# -*- coding: utf-8 -*-
"""
"""

from __future__ import division
from __future__ import absolute_import
from __future__ import print_function

from functools import wraps
from flask_mr_api import errors
from flask_mr_api.apidoc import ApiDoc

import flask
import jwt

from jwt.exceptions import PyJWTError, ExpiredSignatureError


class Auth(object):
    """Docstring for Auth. """

    AUTHORIZATION_HEADER = 'Authorization'
    TOKEN_PARAM = 'token'
    CONF_SECRET_KEY = 'SECRET_KEY'

    _get_user = None
    _get_roles = None

    def __init__(self, app=None):
        if app:
            self.init_app(app)

    def init_app(self, app):
        app.auth = self
        self.app = app
        if not self.app.config.get(Auth.CONF_SECRET_KEY):
            raise RuntimeError('SECRET_KEY required')

    def set_user_getter(self, fn):
        """TODO: Docstring for set_user_getter.

        :fn: function which accepts token data, and returns User object or None
        :returns: TODO

        """
        self._get_user = fn
        return fn

    def set_roles_getter(self, fn):
        """TODO: Docstring for set_roles_getter.

        :fn: function which accepts user, and returns list of user role names
        :returns: TODO

        """
        self._get_roles = fn
        return fn

    def get_token_data(self):
        if flask.request.headers.get(Auth.AUTHORIZATION_HEADER):
            auth = flask.request.headers.get(Auth.AUTHORIZATION_HEADER)
            if auth.startswith('Bearer '):
                token_data = auth[7:]
                token_data = token_data.strip()
                return token_data
        token_data = flask.request.args.get(Auth.TOKEN_PARAM)
        if token_data:
            return token_data
        return None

    def make_token(self, sub, AuthTokenKey, iat, exp, **kwargs):
        """TODO: Docstring for make_token.

        :sub: subject id
        :AuthTokenKey: token key
        :iat: issued at
        :exp: expiration time
        :returns: TODO

        """
        token = kwargs
        token['sub'] = sub
        token['AuthTokenKey'] = AuthTokenKey
        token['iat'] = iat
        token['exp'] = exp
        encoded_token = jwt.encode(token, self.app.config[Auth.CONF_SECRET_KEY], algorithm='HS256')
        return encoded_token.decode()

    def get_token_from_request(self):
        token_data = self.get_token_data()
        if not token_data:
            raise errors.unauthorized_error
        try:
            token = jwt.decode(token_data, self.app.config[Auth.CONF_SECRET_KEY])
        except ExpiredSignatureError:
            raise errors.ApiError('Unauthorized', 401, [{'message': 'Token expired'}])
        except PyJWTError:
            raise errors.unauthorized_error
        return token

    def required(self, f):
        ApiDoc.add_wrapper_props({
            'auth': True
        })

        @wraps(f)
        def wrapper(*args, **kwargs):
            token = self.get_token_from_request()
            user = self._get_user(token)
            if user:
                flask.g.current_user = user
                flask.g.current_token_key = token['AuthTokenKey']
            else:
                raise errors.unauthorized_error
            return f(*args, **kwargs)

        return wrapper

    def user_has_any_of_roles(self, roles):
        user_roles = self._get_roles(flask.g.current_user)
        roles = set(roles)
        user_roles = set(user_roles)
        if 'developer' in user_roles:
            return True
        if roles & user_roles:
            return True
        return False

    def only_for(self, *roles):
        """TODO: Docstring for only_for.

        :*roles: role names
        :returns: TODO

        """
        ApiDoc.add_wrapper_props({
            'roles': roles
        })

        def wrapper(f):
            @wraps(f)
            def wrapper2(*args, **kwargs):
                if self.user_has_any_of_roles(roles):
                    return f(*args, **kwargs)
                raise errors.forbidden_error

            return self.required(wrapper2)

        return wrapper
