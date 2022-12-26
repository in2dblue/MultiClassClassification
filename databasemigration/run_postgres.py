import sqlite3
import logging
import datetime

from timeit import default_timer as timer
from tqdm import tqdm

import src.Constants as Const
import src.pg_tools as tools

from sqlalchemy import create_engine
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session

logging.basicConfig(
    format='%(asctime)s : %(levelname)s : %(message)s', level=logging.DEBUG)

# Sqlite
sql_conn = sqlite3.connect(Const.OMP_DB_FILE)
sql_conn.row_factory = tools.dict_factory
logging.info(f'Sqlite3 connection to file: {Const.OMP_DB_FILE}')

# Postgres
db_string = "postgres://postgres:postgres@" + Const.PG_URL + ":" + str(Const.PG_PORT) + "/omp"


# keine foreign keys
# keine unique constraints
# primary keys nach insert
# indexes nach insert
# labelgroup sentiment: pos neg and what else?


if __name__ == "__main__":

    db = create_engine(db_string)
    connection = db.connect()

    start = timer()

    # init database schema
    tools.run_sql_file(connection, "pg_schema.sql")
    Base = automap_base()
    Base.prepare(db, reflect=True)
    session = Session(db)
    logging.info("Schema public created")

    # connect to sqlite
    omp = tools.omp_data(sql_conn)

    # sources
    Sources = Base.classes.sources
    new_source = Sources(name = "Der Standard", domain = "derstandard.at")
    session.add(new_source)
    session.commit()
    logging.info("Inserted source %s with id %d" % (new_source.name, new_source.id))

    # commentators
    Commentators = Base.classes.users
    commentators = set()
    for post in omp[Const.POSTS]:
        commentators.add(post['ID_User'])
    commentator_lookup = {}
    commentator_id = 0
    bulk = []
    for commentator in tqdm(commentators):
        commentator_id += 1
        commentator_lookup[commentator] = commentator_id
        bulk.append({"id" : commentator_id, "external_id" : commentator, "name" : commentator})
    session.execute(Commentators.__table__.insert(), bulk)
    logging.info("Inserted %d commentators" % commentator_id)

    # documents
    Documents = Base.classes.documents
    document_lookup = {}
    i = 0
    for document in tqdm(omp[Const.ARTICLES]):
        new_document = Documents(url = document["Path"], title = document["Title"], text = document["Body"], timestamp = document["publishingDate"])
        session.add(new_document)
        document_lookup[document["ID_Article"]] = new_document.id
        i += 1
    session.commit()
    logging.info("Inserted %d documents" % i)

    # labels
    Labels = Base.classes.labels
    label_lookup = {}
    i = 0
    for label in omp[Const.CATEGORIES]:
        i += 1
        new_label = Labels(id = i, name = label["Name"], type = "classification", order = label["Ord"], source_id = new_source.id)
        session.add(new_label)
        label_lookup[label["Name"]] = i
    session.commit()
    logging.info("Inserted %d labels" % i)

    # comments
    Comments = Base.classes.comments
    comment_lookup = {}
    i = 0
    bulk = []
    comment_id = 0
    for comment in tqdm(omp[Const.POSTS]):
        comment_id += 1
        comment_lookup[comment["ID_Post"]] = comment_id
        comment_date = datetime.datetime.strptime(comment["CreatedAt"], '%Y-%m-%d %H:%M:%S.%f')
        new_comment = {
            "id" : comment_id,
            "doc_id" : document_lookup[comment["ID_Article"]],
            "source_id" : new_source.id,
            "commentator_id" : commentator_lookup[comment["ID_User"]],
            "parent_comment_id" : comment["ID_Parent_Post"],
            "status" : comment["Status"],
            "title" : comment["Headline"],
            "text" : comment["Body"],
            "timestamp" : comment["CreatedAt"],
            "year" : comment_date.year,
            "month" : comment_date.month,
            "day" : comment_date.day,
        }
        bulk.append(new_comment)
        if comment_id % 1000 == 0:
            session.execute(Comments.__table__.insert(), bulk)
            bulk = []
            # break
    if bulk:
        session.execute(Comments.__table__.insert(), bulk)
    session.commit()
    logging.info("Inserted %d comments" % comment_id)

    # annotations
    print(label_lookup)
    Annotations = Base.classes.annotations
    i = 0
    for annotation in omp[Const.ANNOTATIONS_CONSOLIDATED]:
        new_annotation = Annotations(
            label_id = label_lookup[annotation["Category"]],
            comment_id = comment_lookup[annotation["ID_Post"]],
            label = annotation["Value"]
        )
        session.add(new_annotation)
        i += 1
    session.commit()
    logging.info("Inserted %d annotations" % i)

logging.info("Run indexing ...")
tools.run_sql_file(connection, "pg_indexes.sql")

end = timer()
logging.info("Import completed after " + str((end - start)) + " seconds.")

session.close()

# Query example

# select
# 	c.year,
# 	c."month",
# 	c."day",
# 	count(*)
# from
# 	comments c,
# 	facts f
# where
# 	c.id = f.comment_id
# 	and f.label_id = 7
# 	and f."label" = true
# group by
# 	cube (c."year",
# 	c."month",
# 	c."day")
# order by
# 	c."year",
# 	c."month"
#   c."day";