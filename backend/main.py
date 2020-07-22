# -*- coding: utf-8 -*-
"""
"""

from __future__ import division
from __future__ import absolute_import
from __future__ import print_function

import os

from mr.api.app import init_app
import mr.api.endpoints.v1
from mr.core.coreconf import CoreConf

SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://postgres:postconnectuser@127.0.0.1/reporting'
core_conf = CoreConf()

if os.getenv('GAE_ENV', '').startswith('standard'):
    db_uri = 'postgresql+psycopg2://postgres:postconnectuser@127.0.0.1/reporting'
    # db_uri = db_uri.format(app_id=app_identity.get_application_id())
    SQLALCHEMY_DATABASE_URI = db_uri

app = init_app({
    'SECRET_KEY': b'uGghVYNIo8TOd0pH8hPi8tWx0gumvWiA8Qa7jCPLQHU=',
    'SQLALCHEMY_DATABASE_URI': SQLALCHEMY_DATABASE_URI,
    'CORE_CONF': core_conf
})

if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    # Flask's development server will automatically serve static files in
    # the "static" directory. See:
    # http://flask.pocoo.org/docs/1.0/quickstart/#static-files. Once deployed,
    # App Engine itself will serve those files as configured in app.yaml.

    app.run(host='127.0.0.1', port=5000, debug=True)
