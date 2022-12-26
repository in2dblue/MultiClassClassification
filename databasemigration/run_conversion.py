import src.Constants as Const
import sqlite3
from pymongo import MongoClient
from typing import Dict, List
import logging
import src.tools as tools

logging.basicConfig(
    format='%(asctime)s : %(levelname)s : %(message)s', level=logging.DEBUG)

# Sqlite
sql_conn = sqlite3.connect(Const.OMP_DB_FILE)
sql_conn.row_factory = tools.dict_factory
logging.info(f'Sqlite3 connection to file: {Const.OMP_DB_FILE}')

# Mongodb
mongo_conn = MongoClient(Const.MONGODB_URL, port=Const.MONGODB_PORT)
logging.info(
    f'MongoDB connection to: {Const.MONGODB_URL}:{Const.MONGODB_PORT}')
db = mongo_conn.omp


if __name__ == "__main__":
    tools.clear_db(db)

    omp = tools.omp_data(sql_conn)

    source = tools.write_sources_collection(db)
    users, user_id_lookup = tools.write_users_collection(db, omp[Const.POSTS])
    documents, documents_lookup = tools.write_documents_collection(db, omp[Const.ARTICLES])
    labels = tools.write_labels_collection(db, omp[Const.CATEGORIES])
    comments = tools.write_comments_collection(
        db,
        omp[Const.POSTS],
        documents_lookup,
        omp[Const.ANNOTATIONS_CONSOLIDATED],
        labels,
        source,
        user_id_lookup)

