import * as duckdb from '@duckdb/duckdb-wasm'
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url'
import mvp_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url'
import duckdb_wasm_next from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url'
import eh_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url'
import type { FeatureCollection, Polygon } from 'geojson'

const MANUAL_BUNDLES = {
  mvp: {
    mainModule: duckdb_wasm,
    mainWorker: mvp_worker,
  },
  eh: {
    mainModule: duckdb_wasm_next,
    mainWorker: eh_worker,
  },
}

interface DuckResponseProperties {
  count: number
}
interface DuckResponseObject extends DuckResponseProperties {
  geometry: string
}

const logger = new duckdb.ConsoleLogger()

export async function executeQuery(
  query: string,
): Promise<FeatureCollection<Polygon, DuckResponseProperties> | undefined> {
  const bundle = await duckdb.selectBundle(MANUAL_BUNDLES)
  const worker = new Worker(bundle.mainWorker)
  const db = new duckdb.AsyncDuckDB(logger, worker)
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker)
  const conn = await db.connect()

  conn.query('INSTALL spatial;LOAD spatial;')
  conn.query('INSTALL h3 FROM community;LOAD h3;')
  let featureCollection: FeatureCollection<Polygon, DuckResponseProperties>
  try {
    const res = await conn.query(query)

    featureCollection = {
      type: 'FeatureCollection',
      features: res.toArray().map((d: DuckResponseObject) => {
        const { geometry, ...properties } = d
        return {
          type: 'Feature',
          geometry: JSON.parse(geometry) as Polygon,
          properties,
        }
      }),
    }
  } catch (error) {
    console.error('Error executing query:', error)
  } finally {
    await conn.close()
    await db.terminate()
    await worker.terminate()
  }
  return featureCollection
}
