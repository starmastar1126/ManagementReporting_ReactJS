# -*- coding: utf-8 -*-
"""
"""

from __future__ import division
from __future__ import absolute_import
from __future__ import print_function

import flask
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
from sqlalchemy.exc import IntegrityError, DataError


class SA(object):
    """Docstring for SA. """

    SQLALCHEMY_DATABASE_URI = 'SQLALCHEMY_DATABASE_URI'

    def __init__(self, app=None, echo=False):
        """TODO: to be defined1.

        :app: TODO
        :echo: TODO

        """
        self.engine = None
        self.Session = None
        if app:
            self.init_app(app)
        self.echo = echo

    def _commit_after_request(self, response):
        flask.g.s.commit()
        return response

    def _flush_before_response_encoding(self, sender, **kwargs):
        flask.g.s.flush()

    def _finish_session(self, error):
        if error:
            # error occured during request, rolling back changes,
            # this error should not happen, if this error happened it means
            # somethere error is not caught correctly
            flask.g.s.rollback()
        flask.g.s.close()

    def _register_session(self):
        if not hasattr(flask.g, 's'):
            flask.g.s = self.get_session()

    def _integrity_error_handler(self, error):
        if hasattr(flask.g, 's'):
            flask.g.s.rollback()
            flask.g.s.close()
        error = self.app.api.get_error('Value should be unique or reference incorrect or other integrity error', [],
                                       400)
        return self.app.api.json_response(error, 400)

    def _data_error_handler(self, error):
        if hasattr(flask.g, 's'):
            flask.g.s.rollback()
            flask.g.s.close()
        error = self.app.api.get_error('Incorrect data value', [], 400)
        return self.app.api.json_response(error, 400)

    def _api_error_handler(self, sender, **kwargs):
        """TODO: Docstring for _api_error_handler.
        :returns: TODO

        """
        if hasattr(flask.g, 's'):
            flask.g.s.rollback()
            flask.g.s.close()

    def init_app(self, app):
        """TODO: Docstring for init_app.

        :app: TODO
        :returns: TODO

        """
        self.app = app
        self.app.sa = self
        self.engine = create_engine(app.config[self.SQLALCHEMY_DATABASE_URI], poolclass=NullPool, echo=self.echo)
        self.Session = sessionmaker(bind=self.engine)
        self.app.before_request(self._register_session)
        self.app.after_request(self._commit_after_request)
        self.app.teardown_appcontext(self._finish_session)
        self.app.register_error_handler(IntegrityError, self._integrity_error_handler)
        self.app.register_error_handler(DataError, self._data_error_handler)
        self.app.api.api_error_signal.connect(self._api_error_handler, self.app.api)
        self.app.api.before_response_encoding_signal.connect(self._flush_before_response_encoding, self.app.api)

    def get_session(self):
        if not hasattr(flask.g, 's'):
            self.Session()
            flask.g.s = self.Session()
        return flask.g.s
