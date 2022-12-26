from enum import Enum

OMP_DB_FILE = 'omp_corpus.sqlite3'

MONGODB_URL = 'localhost'
MONGODB_PORT = 27017

PG_URL = 'localhost'
PG_PORT = 5432

# Sqlite3 Table Names
ANNOTATIONS = "Annotations"
CATEGORIES = "Categories"
POSTS = "Posts"
ANNOTATIONS_CONSOLIDATED = "Annotations_consolidated"
CROSSVALSPLIT = "CrossValSplit"
ARTICLES = "Articles"
NEWSPAPER_STAFF = "Newspaper_Staff"

SQ_TABLE_NAMES = [ANNOTATIONS, CATEGORIES, POSTS,
                  ANNOTATIONS_CONSOLIDATED, CROSSVALSPLIT,
                  ARTICLES, NEWSPAPER_STAFF]


# MongoDb Collection Names
SOURCES = 'Sources'
LABELS = 'Labels'
DOCUMENTS = 'Documents'
USERS = 'Users'
COMMENTS = 'Comments'

MDB_COLLECTION_NAMES = [
    SOURCES,
    LABELS,
    DOCUMENTS,
    USERS,
    COMMENTS
]

# postgres table names
ANNOTATIONS_PG = 'annotations'
SOURCES = 'sources'
LABELS = 'labels'
DOCUMENTS = 'documents'
USERS = 'commentators'
COMMENTS = 'comments'
TIME = 'time'
DATE = 'date'
FACTS = 'factsß'
