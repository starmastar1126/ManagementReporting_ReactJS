from flask import g
from flask_mr_api import errors


def update_if_set(item, fields, ignore_fields=None):
    if ignore_fields is None:
        ignore_fields = []
    for name in fields:
        if name in g.api.json and name not in ignore_fields:
            setattr(item, name, g.api.json[name])
    return item


def get_or_not_found(Model, model_key):
    item = g.s.query(Model).get(model_key)
    if not item:
        raise errors.not_found_error
    return item


def get_or_bad(Model, model_key):
    item = g.s.query(Model).get(model_key)
    if not item:
        raise errors.bad_request_error
    return item
