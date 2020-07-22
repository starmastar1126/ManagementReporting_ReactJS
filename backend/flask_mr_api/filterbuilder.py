# -*- coding: utf-8 -*-
"""
"""

from __future__ import division
from __future__ import absolute_import
from __future__ import print_function

import json
from flask import request
from dateutil.parser import parse as parse_date
from . import errors


def get_in_schema(item_schema):
    return {
        'type': 'list',
        'empty': False,
        'schema': item_schema
    }


def str_to_integer(val):
    try:
        return int(val)
    except ValueError:
        raise RuntimeError('Incorrect filter parameter value')


def str_to_boolean(val):
    val = val.lower()
    if val == 'true':
        return True
    elif val == 'false':
        return False
    raise RuntimeError('Incorrect filter parameter value')


def str_to_float(val):
    try:
        return float(val)
    except ValueError:
        raise RuntimeError('Incorrect filter parameter value')


def coerce_date(value):
    if value is None:
        return None
    dt = parse_date(value, ignoretz=True)
    return dt.date()


def coerce_datetime(value):
    if value is None:
        return None
    dt = parse_date(value, ignoretz=True)
    return dt


class FilterBuilder(object):

    """Docstring for FilterBuilder. """

    OP_EQ = '$eq'
    OP_IN = '$in'
    OP_LT = '$lt'
    OP_LTE = '$lte'
    OP_GT = '$gt'
    OP_GTE = '$gte'
    OP_LIKE = '$like'
    OPERATORS = {
        OP_EQ,
        OP_IN,
        OP_LT,
        OP_LTE,
        OP_GT,
        OP_GTE,
        OP_LIKE,
    }

    # converters from string value of query parameters to typed values
    str_to_type = {
        'boolean': str_to_boolean,
        'date': lambda v: v,
        'datetime': lambda v: v,
        'float': str_to_float,
        'integer': str_to_integer,
        'string': lambda v: v,
    }

    base_schema = {
        'nullable': True,
        'required': False,
    }

    operator_to_schema = {
        '$in': get_in_schema
    }

    coercion = {
        'date': coerce_date,
        'datetime': coerce_datetime,
    }

    def get_query_param_filter(self, name):
        name = name[2:]
        op = '$eq'
        if '_$' in name:
            name, op = name.split('_$', 1)
            op = '$' + op
        if not name:
            raise errors.bad_request_error
        op = op.lower()
        if op not in self.OPERATORS:
            raise errors.bad_request_error
        return name, op

    def _get_filter(self, args, filter_types):
        filters = []
        for name, value in args.items():
            if name.startswith('f_'):
                name, op = self.get_query_param_filter(name)
                if name in filter_types:
                    value = self.str_to_type[filter_types[name]](value)
                filters.append((name, op, value))
        filter_param = {}
        if 'filter' in args:
            try:
                filter_param = json.loads(args['filter'])
            except ValueError:
                raise errors.bad_request_error
        for name, value in filter_param.items():
            if isinstance(value, dict):
                for op, value in value.items():
                    filters.append((name, op, value))
            else:
                filters.append((name, '$eq', value))
        request_filter = {}
        for name, _, _ in filters:
            request_filter[name] = {}
        for name, op, value in filters:
            request_filter[name][op] = value
        return request_filter

    def filter_from_request(self, filter_types=None):
        if filter_types is None:
            filter_types = {}
        return self._get_filter(request.args, filter_types)

    def get_filter_schema(self, filters):
        """TODO: Docstring for get_filter_schema.

        :filters: dict with values: `{field_name: type}`, where `type` is string
        name of type
        :returns: TODO

        """
        schema = {}
        for name, value_type in filters.items():
            op_schema = {}
            for op in self.OPERATORS:
                item_schema = dict(self.base_schema)
                item_schema['type'] = value_type
                if value_type in self.coercion:
                    item_schema['coerce'] = self.coercion[value_type]
                if op in self.operator_to_schema:
                    item_schema = self.operator_to_schema[op](item_schema)
                op_schema[op] = item_schema
            schema[name] = {
                'type': 'dict',
                'schema': op_schema
            }
        return schema
