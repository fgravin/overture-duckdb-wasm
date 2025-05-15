# overture-duckdb-wasm

Demo about using [DuckDB](https://duckdb.org/) with WASM to leverage Overture Maps datasets processing.

# Quick start
```shell
npm install
npm run dev
```

# Principles
## Datasets

**Disclaimer** : DuckDB WASM [does not support HTTPFS extension](https://duckdb.org/docs/stable/clients/wasm/extensions.html#httpfs). Therefore you can't directly hint the official Overture Maps GeoParquet releases, which provide root level S3 file system entry (eg. `s3://overturemaps-us-west-2/release/2025-04-23.0/theme=places/type=place/*'` )

A subset of Overture Maps datasets has been downloaded in the `/public` folder.  
- `saltlake-division_area.parquet`
- `saltlake-place.parquet`

This is _places_ and _division areas_ data for **Salt Lake City**, Utah.

It has been downloaded from the [Overture Maps](https://overturemaps.org/) project with the [Python CLI](https://docs.overturemaps.org/getting-data/overturemaps-py/) project.
```shell
overturemaps download --bbox=-113.230591,39.913950,-110.505981,41.689322 -f geoparquet -o /data/saltlake-division_area.parquet --type=division_area
overturemaps download --bbox=-113.230591,39.913950,-110.505981,41.689322 -f geoparquet -o /data/saltlake-place.parquet --type=place
```

## Web application
The demo provides a textarea to enter SQL queries. Those queries will be executed in the frontend with DuckDB WASM. They are performed on the local GeoParquet files (Salt Lake subset).

2 important points:
- in the query, the text `FROM places` and `FROM division_area` are replaced with the correct duckDB syntax to load the GeoParquet files.
- the frontend expects the result to have at least 2 attributes
  - `count` as an integer
  - `geometry` as GeoJSON geometry. 

The application transforms the result into a GeoJSON FeatureCollection and displays it on the map.