# Postgres db

This skript converts the OMP corpus to a postgres database scheme.

- Start the forum40 project, which launches a postgres db container.


For OSX:

To run the Python script create a virtual environment:

`python3.6 -m venv ./<newvenvpath>`

Load the virtual environment:

`source ./<newvenvpath>/bin/activate`

Install requirements:

`pip install -r requirements.txt`

Run script:

`python run_postgres.py`

User credentials: `postgres:postgres`

You can also create the database schema without importing the data directly with psql:

   psql -d omp -h localhost -p 5432 --username=postgres --password < pg_schema.sql
   psql -d omp -h localhost -p 5432 --username=postgres --password < pg_indexes.sql 

(password: postgres)

# DEPRECATED: mongodb


This skript converts the OMP corpus to a NoSQL dataabse scehme.

- Start the forum40 project, which launches a mongo db container.


For OSX:

To run the Python script create a virtual environment:

`python3.6 -m venv ./<newvenvpath>`

Load the virtual environment:

`source ./<newvenvpath>/bin/activate`

Install requirements:

`pip install -r requirements.txt`

Run script:

`python run_conversion.py`
