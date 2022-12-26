import logging
import random

import src.Constants as Const

from sqlalchemy import create_engine
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session

from tqdm import tqdm

logging.basicConfig(
    format='%(asctime)s : %(levelname)s : %(message)s', level=logging.DEBUG)

# Postgres
db_string = "postgres://postgres:postgres@" + Const.PG_URL + ":" + str(Const.PG_PORT) + "/omp"

# config
n_fake_facts = 1000000

cache = {}


if __name__ == "__main__":

    db = create_engine(db_string)
    connection = db.connect()
    Base = automap_base()
    Base.prepare(db, reflect=True)
    session = Session(db)

    Facts = Base.classes.facts

    # session.execute(Facts.delete())

    bulk = []
    for i in tqdm(range(n_fake_facts)):
        rnd_id = random.randint(1, 1000000)
        rnd_label = random.randint(1, 9)
        rnd_cache_id = str(rnd_id) + "_" + str(rnd_label)
        if rnd_cache_id in cache:
            continue
        bulk.append({
            "comment_id" : rnd_id,
            "label_id" : rnd_label,
            "label" : (random.randint(0, 1)),
            "value" : 2,
            "confidence" : 0.5
        })
        cache[rnd_cache_id] = True
        if i % 10000 == 0:
            session.execute(Facts.__table__.insert(), bulk)
            bulk = []

    if bulk:
        session.execute(Facts.__table__.insert(), bulk)

    session.commit()

connection.close()