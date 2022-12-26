import argparse
import json
import logging
import socket
import threading
import time
import traceback
from datetime import date, datetime, timedelta
from typing import Any, Dict

import requests
import spiegel_scraper as spon

requests.packages.urllib3.disable_warnings()

logging.basicConfig(format = '%(asctime)s - %(levelname)s - %(name)s -   %(message)s',
                    datefmt = '%m/%d/%Y %H:%M:%S',
                    level = logging.INFO)
logger = logging.getLogger(__name__)

if socket.gethostname() ==  'mast-se':
    ENDPOINT = 'https://mast-se.informatik.uni-hamburg.de'
else:
    ENDPOINT = 'https://localhost'

DEFAULT_PERIOD_SECONDS = 600
PERIOD_SECONDS = 0
DEFAULT_USERNAME = 'ankit'
DEFAULT_PASSWORD = 'ankit'
USERNAME = ''
PASSWORD = ''
DO_CERT_VERIFY=False
 
SPIEGEL_ONLINE = 'SPIEGEL Online'
SPIEGEL_ONLINE_DOMAIN = 'https://www.spiegel.de/'
CERT_PATH = None

# TODO: verify password

def get_request(*args, **kwargs):
    if CERT_PATH:
        return requests.get(*args, **kwargs, verify=CERT_PATH)
    else:
        return requests.get(*args, **kwargs)

def post_request(*args, **kwargs):
    if CERT_PATH:
        return requests.post(*args, **kwargs, verify=CERT_PATH)
    else:
        return requests.post(*args, **kwargs)

def create_comment(_id, body, timestamp, parent_id):
    return {
        "id": _id,
        "body": body,
        "timestamp": timestamp,
        "parent_id": parent_id
    }

def flatten_root_comment(root_comment, parent_id = None):

    comments = []
    _id = root_comment['id']
    body = root_comment['body']
    timestamp = root_comment['created_at']
    replies = root_comment['replies']
    root_comment = create_comment(_id, body, timestamp, parent_id)
    comments.append(root_comment)
    if len(replies) > 0:
        for reply in replies:
            comments.extend(flatten_root_comment(reply, _id))
    
    return comments

def flatten_comments(comments):

    flattened_comments = []
    for comment in comments:
        flattened_comments.extend(flatten_root_comment(comment))
    
    return flattened_comments

def get_articles_from(date, max_articles=None):
    logger.info(f'Date: {date}')

    archive_entries = spon.archive.by_date(date)
    if max_articles:
        archive_entries = archive_entries[:max_articles]
    logger.info(f'Found {len(archive_entries)} archive entries')
    articles = [spon.article.by_url(ae['url']) for ae in archive_entries]
    logger.info(f'Found {len(archive_entries)} articles')
    article_ids = [article['id'] for article in articles]
    logger.info(f'Found {len(article_ids)} article_ids')

    articles_all : Dict[str, Dict] = {article['id']: article for article in articles}
    comments_per_article_id = {article_id: spon.comments.by_article_id(article_id) for article_id in article_ids}

    for article_id, comments in comments_per_article_id.items():
        articles_all[article_id]['comments'] = flatten_comments(comments)

    return articles_all

def get_auth_token(username, password):
    response = get_request(f'{ENDPOINT}/api/db/auth/login/{username}/{password}', verify=DO_CERT_VERIFY)
    auth_token = response.json().get('token', False)
    return auth_token

def auth_token_header(token):
    return {
        'x-access-token': token
    }

def test_auth(token):
    response = get_request(f'{ENDPOINT}/api/db/auth/test', headers=auth_token_header(token), verify=DO_CERT_VERIFY)
    return response.json().get('ok') == USERNAME

def get_source_id(source_name, auth_token):
    response = get_request(f'{ENDPOINT}/api/db/sources/{source_name}', verify=DO_CERT_VERIFY)
    response = response.json()
    if response['id'] == None: # Create new Source if not existent yet
        logger.info(f'Source {source_name} not found on server creating it')
        source = {
            'name': SPIEGEL_ONLINE,
            'domain': SPIEGEL_ONLINE_DOMAIN
        }
        response = post_request(f'{ENDPOINT}/api/db/sources/', data=source, headers=auth_token_header(auth_token), verify=DO_CERT_VERIFY)
        new_source = response.json()
        new_source_id = new_source.get('id', None)
        logger.info(f'New source: {new_source}')
        return new_source_id
    source_id = response.get('id', False)
    logger.info(f'Found source {SPIEGEL_ONLINE} with id {source_id}')
    return source_id

def post_article(article_id, article, source_id, auth_token):
    comments = article.pop('comments')

    article_data = {
        'url' : article.pop('url'),
        'title' : article.pop('headline')['main'],
        'text' : article.pop('text'),
        'timestamp' : article.pop('date_created'),
        'source_id' : source_id,
        'external_id' : article_id
    }
    article_data['metadata'] = json.dumps(article)

    # print(json.dumps(article_data))

    r = post_request(f'{ENDPOINT}/api/db/documents/', data=article_data, headers=auth_token_header(auth_token), verify=DO_CERT_VERIFY)

    article_id = r.json()['id']

    post_comments(comments, article_id, source_id, auth_token)

def post_comment(comment, document_id, source_id, auth_token, ext2int_id):
    print(comment)
    comment_data = {
        'doc_id': document_id,
        'source_id' : source_id,
        'user_id' : '',
        'parent_comment_id' : ext2int_id.get(comment['parent_id'], None),
        'status' : '',
        'title' : '',
        'text' : comment['body'] if comment['body'] else '',
        # 'embedding' : args['embedding'] if args.get('embedding', False) else None
        'timestamp' : comment['timestamp'],
        'external_id' : comment['id']
    }

    r = post_request(f'{ENDPOINT}/api/db/comments/', data=comment_data, headers=auth_token_header(auth_token), verify=DO_CERT_VERIFY)
    res = r.json()
    print(res)
    ext2int_id[comment['id']] = res['id']
    if not res.get('existed', False):
        logger.info(f'Added comment: {res}')
    else:
        logger.info(f'Comment existed: {res}')

def post_comments(comments, document_id, source_id, auth_token):
    ext2int_id = {}
    for comment in comments:
        post_comment(comment, document_id, source_id, auth_token, ext2int_id)

# post comments as a batch to the backend server
def post_comments_batch(comments, document_id, source_id, auth_token):
    ext2int_id = {}
    json_post_list = []
    
    print('len comments:', len(comments))

    for comment in comments:
        comment_data = {
            'doc_id': document_id,
            'source_id' : source_id,
            'user_id' : '',
            'parent_comment_id' : ext2int_id.get(comment['parent_id'], None),
            'status' : '',
            'title' : '',
            'text' : comment['body'] if comment['body'] else '',
            # 'embedding' : args['embedding'] if args.get('embedding', False) else None
            'timestamp' : comment['timestamp'],
            'external_id' : comment['id']
        }
        json_post_list.append(comment_data)
    
    logger.info(f'Adding {len(json_post_list)} comments...')

    r = post_request(f'{ENDPOINT}/api/db/comments/json', json=json_post_list, headers=auth_token_header(auth_token), verify=DO_CERT_VERIFY)

    res_j = r.json()

    res_list = res_j['added_comment_ids']
    print('response:', res_j)
   
    assert(len(res_list) == len(json_post_list))
 
    for comment,res in zip(json_post_list,res_list):
        ext2int_id[comment['id']] = res['id']
        if not res.get('existed', False):
            logger.info(f'Added comment: {res}')
        else:
            logger.info(f'Comment existed: {res}')

def main():
    try:
        # 1. Crawl articles & comments
        yesterday = date.today() - timedelta(1)
        articles = get_articles_from(yesterday) # , max_articles = 1)
        logger.info(f'Articles found: {len(articles)}')

        # 2. Authentication
        token = get_auth_token(USERNAME, PASSWORD)
        logger.info(f'Token: {token}')
        logger.info(f'Authorized: {test_auth(token)}')

        # 3. Source ID for SPON
        source_id = get_source_id('SPIEGEL Online', token)

        # 4. Post Article with Comments
        for article_id, article in articles.items():
            post_article(article_id, article, source_id, token)
        logger.info('Insertion done!')
    except Exception as e:
        logging.error(traceback.format_exc())
    
    # 5. Repeat
    next_crawl = datetime.now() + timedelta(0, PERIOD_SECONDS)
    logger.info(f'Next crawl in {PERIOD_SECONDS}s at {next_crawl.strftime("%d.%m - %H:%M:%S")}')
    threading.Timer(PERIOD_SECONDS, main).start()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Crawls SPON articles and comments periodically.')
    
    parser.add_argument("--username", type=str, help="Username for the Forum4.0 instance", default=DEFAULT_USERNAME)
    parser.add_argument("--password", type=str, help="Password for the Forum4.0 instance", default=DEFAULT_PASSWORD)

    parser.add_argument("--period", type=int, help="Period in seconds", default=DEFAULT_PERIOD_SECONDS)
    parser.add_argument("--cert", type=str, help="Certificate to check for requests (certicate check errors are ignored if empty)", default=None)

    args = parser.parse_args()

    PERIOD_SECONDS = args.period
    CERT_PATH = args.cert
    
    if CERT_PATH is None:
        logger.info('--cert option not used, disabling certicate check.')
        DO_CERT_VERIFY=False

    USERNAME = DEFAULT_USERNAME
    PASSWORD = DEFAULT_PASSWORD

    logger.info(f'Crawl period: {PERIOD_SECONDS}s')
    logger.info(f'Use certificate: {CERT_PATH}')

    main()


    # - [ ]  TODO: POST Ask for new comments to add
    # - [ ]  TODO: POST User
    # - [x]  TODO: Automatic periodic execution
    # - [x]  TODO: POST article
    # - [x]  TODO: Add External Comment ID
    # - [x]  TODO: POST Comment
