from typing import Dict, List, Tuple
import src.Constants as Const
import logging
import pymongo
import datetime
from tqdm import tqdm
from sqlalchemy.sql import text


def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


def run_sql_file(connection, filepath):
    connection.execute(text(open(filepath, "r").read()).execution_options(autocommit=True))


def omp_data(sql_conn) -> Dict[str, List[Dict]]:
    """
    Read the whole sqlite db into a dict
    """
    omp: Dict = {}
    for table in Const.SQ_TABLE_NAMES:
        cur = sql_conn.cursor()
        cur.execute(f"SELECT * FROM {table}")
        omp[table] = cur.fetchall()

    return omp

