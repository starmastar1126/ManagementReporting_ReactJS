# -*- coding: utf-8 -*-
"""
"""

from __future__ import division
from __future__ import absolute_import
from __future__ import print_function

import json
from functools import wraps
import decimal
from datetime import date, datetime

import dateutil.tz
from cerberus import Validator

from . import errors

import flask
from flask.signals import Namespace

from .apidata import ApiData
from .sorting import Sorting
from .apidoc import ApiDoc
from .filterbuilder import FilterBuilder
from .page import Page


class Api(object):
    """Docstring for Api. """

    MAX_PAGE_SIZE_CONFIG = 'MAX_PAGE_SIZE'
    MAX_PAGE_SIZE_DEFAULT = 100

    _signal = Namespace()

    @property
    def max_page_size(self):
        return self.app.config.get(self.MAX_PAGE_SIZE_CONFIG, self.MAX_PAGE_SIZE_DEFAULT)

    def __init__(self, app, version=None, root='/api', encode=None, filter_builder=None):
        """TODO: to be defined1.

        :app: TODO
        :encode: function accepting one argument, returning tuple of 2 values -
        first is value encodable by json encoder or original object and second
        if value was encoded by function

        """
        self.version = version
        self.root = root
        self.encoder_cls = self.get_encoder_cls(encode)
        if filter_builder:
            self.filter_builder = filter_builder
        else:
            self.filter_builder = FilterBuilder()
        self.api_error_signal = self._signal.signal('api-error')
        self.before_response_encoding_signal = self._signal.signal('before-response-encoding')
        self.init_app(app)

    @staticmethod
    def _str_to_type(value, value_type):
        pass

    def _filter_from_dict(self, filter_data, field_type):
        return {}

    def _catch_api_error(self, e):
        self.api_error_signal.send(self, error=e)
        details = []
        if e.messages:
            details = e.messages
        error = self.get_error(e.message, details, e.error_code)
        return self.json_response(error, e.error_code)

    def _set_page_size(self):
        page_size = flask.request.args.get('page_size')
        if page_size is None:
            page_size = self.max_page_size
        else:
            try:
                page_size = int(page_size)
            except ValueError:
                raise errors.ApiError('`page_size` should be positive integer', 400)
            page_size = min(page_size, self.max_page_size)
            if page_size < 1:
                raise errors.ApiError('`page_size` should be positive integer', 400)
        flask.g.api.page_size = page_size

    def _set_page(self):
        page = 0
        if 'page' in flask.request.args:
            try:
                page = int(flask.request.args['page']) - 1
            except ValueError:
                raise errors.ApiError('`page` should be positive integer', 400)
            if page < 0:
                raise errors.ApiError('`page` should be positive integer', 400)
        flask.g.api.page = page

    def _set_order_by(self, allowed_fields):
        field = flask.request.args.get('order_by')
        if not field:
            flask.g.api.order_by = None
        else:
            if field.startswith('-'):
                flask.g.api.order_by = Sorting(field[1:], True)
            else:
                flask.g.api.order_by = Sorting(field, False)
            if flask.g.api.order_by.field not in allowed_fields:
                flask.g.api.order_by = None

    def _set_filter(self, validator, filter_types):
        if not validator:
            flask.g.api.filter = None
            return
        request_filter = self.filter_builder.filter_from_request(filter_types)
        if not validator.validate(request_filter):
            validator_errors = []
            for prop, error in validator.errors.items():
                validator_errors.append({prop: error})
            raise errors.ApiError('Incorrect filter format', 400, messages=validator_errors)
        flask.g.api.filter = validator.document

    def register_api_data(self):
        flask.g.api = ApiData()

    def init_app(self, app):
        app.api = self
        self.app = app
        self.app.before_request(self.register_api_data)
        self.app.register_error_handler(errors.ApiError, self._catch_api_error)

    def get_encoder_cls(self, encode):
        class CustomEncoder(json.JSONEncoder):
            def default(self, obj):
                if isinstance(obj, decimal.Decimal):
                    return float(obj)
                elif isinstance(obj, date):
                    return obj.isoformat()
                elif isinstance(obj, datetime):
                    if not obj.tzinfo:
                        obj = obj.replace(tzinfo=dateutil.tz.tzutc())
                    return obj.isoformat()
                elif isinstance(obj, set):
                    return list(obj)
                elif encode:
                    obj, ok = encode(obj)
                    if ok:
                        return obj
                return json.JSONEncoder.default(self, obj)

        return CustomEncoder

    def get_path(self, path):
        if self.version:
            return '{root}/{version}{path}'.format(root=self.root, version=self.version, path=path)
        else:
            return '{root}{path}'.format(root=self.root, path=path)

    def get_error(self, message, details=None, code=400):
        """TODO: Docstring for get_error.

        :message: TODO
        :details: TODO
        :returns: TODO

        """
        details = details or []
        return {
            'message': message,
            'details': details,
            'code': code
        }

    def json_response(self, data, code):
        data = json.dumps(data, cls=self.encoder_cls)
        response = flask.make_response(data, code)
        response.mimetype = 'application/json'
        return response

    def register_checked_json(self, validator=None, json_required=True, json_data=None):
        if json_data is None:
            if flask.request.is_json:
                json_data = flask.request.get_json()
            elif not flask.request.is_json and json_required:
                raise errors.ApiError('JSON data expected', 400)
            else:
                json_data = {}
        if validator:
            if not validator.validate(json_data):
                validator_errors = []
                for prop, error in validator.errors.items():
                    validator_errors.append({prop: error})
                raise errors.ApiError('Incorrect data format', 400, messages=validator_errors)
            json_data = validator.document
        flask.g.api.json = json_data

    def endpoint(self, path, method):
        ApiDoc.set_wrapper_endpoint(path, method)
        ApiDoc.add_wrapper_props({
            'method': method
        })

        def wrapper(f):
            @self.app.route(self.get_path(path), methods=[method])
            @wraps(f)
            def endpoint(*args, **kwargs):
                response = f(*args, **kwargs)
                self.before_response_encoding_signal.send(self)
                if not isinstance(response, flask.Response):
                    response = self.json_response(response, 200)
                return response

        return wrapper

    def get(self, path):
        ApiDoc.set_wrapper_endpoint(path, 'GET')
        ApiDoc.add_wrapper_props({
            'method': 'GET'
        })
        return self.endpoint(path, 'GET')

    def list(self, path, order_by=None, filters=None):
        """page based pagination
        """
        ApiDoc.set_wrapper_endpoint(path, 'GET')
        ApiDoc.add_wrapper_props({
            'method': 'GET',
            'list': True,
            'order_by': order_by,
            'filters': filters
        })
        filter_validator = None
        if order_by is None:
            order_by = set()
        if filters:
            filter_validator = Validator(self.filter_builder.get_filter_schema(filters))
        if filters is None:
            filters = {}

        def wrapper(f):
            @wraps(f)
            def f_wrapper(*args, **kwargs):
                self._set_page_size()
                self._set_page()
                self._set_order_by(order_by)
                self._set_filter(filter_validator, filters)
                result = f(*args, **kwargs)
                if isinstance(result, Page):
                    response_data = {
                        'data': result.get_items()
                    }
                    if result.has_count():
                        response_data['total'] = result.get_count()
                    return response_data
                else:
                    return {
                        'data': result,
                    }

            return self.get(path)(f_wrapper)

        return wrapper

    def iterate(self, path, order_by=None, filters=None):
        """cursor based pagination
        """
        ApiDoc.set_wrapper_endpoint(path, 'GET')
        ApiDoc.add_wrapper_props({
            'method': 'GET',
            'list': True,
            'order_by': order_by,
            'filters': filters
        })
        filter_validator = None
        if order_by is None:
            order_by = set()
        if filters:
            filter_validator = Validator(self.filter_builder.get_filter_schema(filters))
        if filters is None:
            filters = {}

        def wrapper(f):
            @wraps(f)
            def f_wrapper(*args, **kwargs):
                self._set_page_size()
                self._set_order_by(order_by)
                self._set_filter(filter_validator, filters)
                flask.g.api.cursor = flask.request.args.get('next')
                result, cursor = f(*args, **kwargs)
                if isinstance(result, Page):
                    response_data = {
                        'data': result.get_items,
                        'next': cursor
                    }
                    if result.has_count():
                        response_data['total'] = result.get_count()
                    return response_data
                else:
                    return {
                        'data': result,
                        'next': cursor
                    }

            return self.get(path)(f_wrapper)

        return wrapper

    def post(self, path, schema=None):
        ApiDoc.set_wrapper_endpoint(path, 'POST')
        ApiDoc.add_wrapper_props({
            'method': 'POST',
            'schema': schema
        })
        validator = None
        if schema:
            validator = Validator(schema, purge_unknown=True)

        def wrapper(f):
            @wraps(f)
            def f_wrapper(*args, **kwargs):
                flask.g.api.schema = schema
                self.register_checked_json(validator)
                return f(*args, **kwargs)

            return self.endpoint(path, 'POST')(f_wrapper)

        return wrapper

    def upload(self, path, schema=None):
        ApiDoc.set_wrapper_endpoint(path, 'POST')
        ApiDoc.add_wrapper_props({
            'method': 'POST',
            'file_upload': True,
            'schema': schema
        })
        validator = None
        if schema:
            validator = Validator(schema, purge_unknown=True)

        def wrapper(f):
            @wraps(f)
            def f_wrapper(*args, **kwargs):
                flask.g.api.schema = schema
                if 'data' in flask.request.form:
                    json_data = json.loads(flask.request.form['data'])
                else:
                    json_data = {}
                self.register_checked_json(validator, json_data=json_data)
                return f(*args, **kwargs)

            return self.endpoint(path, 'POST')(f_wrapper)

        return wrapper

    def put(self, path, schema=None):
        ApiDoc.set_wrapper_endpoint(path, 'PUT')
        ApiDoc.add_wrapper_props({
            'method': 'PUT',
            'schema': schema
        })
        validator = None
        if schema:
            validator = Validator(schema, purge_unknown=True)

        def wrapper(f):
            @wraps(f)
            def f_wrapper(*args, **kwargs):
                flask.g.api.schema = schema
                self.register_checked_json(validator, json_required=False)
                return f(*args, **kwargs)

            return self.endpoint(path, 'PUT')(f_wrapper)

        return wrapper

    def delete(self, path):
        ApiDoc.set_wrapper_endpoint(path, 'DELETE')
        ApiDoc.add_wrapper_props({
            'method': 'DELETE',
        })

        def wrapper(f):
            @wraps(f)
            def f_wrapper(*args, **kwargs):
                result = f(*args, **kwargs)
                if result is None:
                    return {}
                return result

            return self.endpoint(path, 'DELETE')(f_wrapper)

        return wrapper

    def doc(self, description):
        ApiDoc.add_wrapper_props({
            'description': description
        })

        def wrapper(f):
            return f

        return wrapper
