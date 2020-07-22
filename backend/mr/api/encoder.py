# -*- coding: utf-8 -*-
"""
"""

from __future__ import division
from __future__ import absolute_import
from __future__ import print_function


from .modelsmap import modelsmap


def model_to_dict(obj):
    data = {}
    for prop in modelsmap[type(obj)]:
        if isinstance(prop, tuple):
            prop, converter = prop
            if hasattr(obj, prop):
                data[prop] = converter(getattr(obj, prop))
        else:
            if hasattr(obj, prop):
                data[prop] = getattr(obj, prop)
    return data


def encode(obj):
    if type(obj) in modelsmap:
        return model_to_dict(obj), True
    return obj, False
