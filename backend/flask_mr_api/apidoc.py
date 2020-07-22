# -*- coding: utf-8 -*-
"""
"""

from __future__ import division
from __future__ import absolute_import
from __future__ import print_function


class ApiDoc(object):

    """Docstring for ApiDoc. """

    _wrapper_endpoint = None
    _wrappers = []

    @staticmethod
    def norm_schema(schema):
        new_schema = {}
        to_keep = {
            'type',
            'empty',
            'minlength',
            'maxlength',
            'required',
            'empty',
            'nullable',
            'allowed',
        }
        if 'coerce' in schema:
            if schema['type'] == 'string':
                new_schema['type'] = 'string'
            else:
                new_schema['coerced_to'] = schema['type']
            if 'required' in schema:
                new_schema['required'] = schema['required']
        else:
            for allowed in to_keep:
                if allowed in schema:
                    new_schema[allowed] = schema[allowed]
        return new_schema

    @classmethod
    def add_wrapper_props(cls, props):
        cls._wrappers.append((cls._wrapper_endpoint, props))

    @classmethod
    def set_wrapper_endpoint(cls, path, method):
        cls._wrapper_endpoint = (path, method)

    @classmethod
    def get_doc(cls):
        doc = {}
        for (path, method), props in cls._wrappers:
            endpoint = '{} {}'.format(method, path)
            doc.setdefault(endpoint, {}).update(props)
        for props in doc.values():
            if 'schema' in props and props['schema']:
                for name, schema in list(props['schema'].items()):
                    props['schema'][name] = ApiDoc.norm_schema(schema)
        for props in doc.values():
            if 'description' in props:
                props['description'] = props['description'].strip()
        return doc
