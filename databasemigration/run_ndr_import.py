from collections import defaultdict
from timeit import default_timer as timer
import csv
import operator
import logging
import sys

import src.Constants as Const
import src.pg_tools as tools

from sqlalchemy import create_engine
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session

# this is the filtered input file, where linefeeds and some interesting escaping of new lines is removed
# use these commands in vim (^M must be entered by pressing Ctrl+v and then m, release all keys simultaneously)
# :s/^M\\//g
# :x
import_filename="ndrb-3576_filtered.csv"

# Postgres
db_string = "postgres://postgres:postgres@" + Const.PG_URL + ":" + str(Const.PG_PORT) + "/omp"

logging.basicConfig(
    format='%(asctime)s : %(levelname)s : %(message)s', level=logging.DEBUG)

if __name__ == "__main__":
    line_count = 0
    malformed = 0

    # example row:
    # ['Landesregierung schränkt Gänsejagd weiter ein', 'http://www.ndr.de/nachrichten/niedersachsen/Landesregierung-schraenkt-Gaensejagd-weiter-ein,gaensejagd134.html', 'Die Marktwirtschaft kann das Problem lösen. Wer am meisten zahlt, der darf eine Gans abschießen. Abschussrechte können ja versteigert werden durch das Bundesfinanzministerium und spülen dadurch noch Geld in öffentliche Kassen.\n', '2015-04-17 11:53:39', 'Online']

    labels_count = defaultdict(int)

    start = timer()

    db = create_engine(db_string)
    session = Session(db)
    Base = automap_base()
    Base.prepare(db, reflect=True)

    comment_rows = []
    articles = []

    # we need to set errors='ignore' as reading the csv will otherwise fail due to malformed UTF-8
    with open(import_filename, errors='ignore') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_ALL, lineterminator="\n", escapechar='\\')
        for row in csv_reader:
            if len(row)==5:
                line_count += 1
                title, url, comment_text, str_date, label = row
                comment_rows+=[row]
                articles[url] = title
                labels_count[label] += 1
            else:
                malformed += 1

    print('Total csv rows (readable):', line_count)
    print('malformed csv rows:', malformed)
    print('labels:', labels_count)
    print('Number of articles:', len(articles))

    sys.exit()
    # TODO: the code below isn't finished yet

    # sources
    Sources = Base.classes.sources
    new_source = Sources(name = "NDR", domain = "NDR.de")
    session.add(new_source)
    session.commit()
    logging.info("Inserted source %s with id %d" % (new_source.name, new_source.id))

    labels_count_sorted = sorted(x.items(), key=operator.itemgetter(1))

    # labels
    Labels = Base.classes.labels
    label_lookup = {}
    for i,label in enumerate(labels_count):
        label_name = label[0]
        new_label = Labels(id = i, name = label, type = "classification", order = i, source_id = new_source.id)
        session.add(new_label)
        label_lookup[label[0]] = i
    session.commit()
    logging.info("Inserted %d labels" % i)

    # documents
    Documents = Base.classes.documents
    document_lookup = {}
    i = 0
    for article in articles:
        "TODO: add article here"

    # comments
    Comments = Base.classes.comments
    comment_lookup = {}
    i = 0
    bulk = []
    comment_id = 0

    for comment in comment_rows:
        "TODO: add comments here" 

    if bulk:
        session.execute(Comments.__table__.insert(), bulk)
    session.commit()
    logging.info("Inserted %d comments" % comment_id)

    # annotations

    #todo