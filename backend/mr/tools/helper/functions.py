# -*- coding: utf-8 -*-
"""
"""
try:
    from StringIO import StringIO
except ImportError:
    from io import StringIO

import os
from random import SystemRandom
from werkzeug._compat import range_type

choice = SystemRandom().choice
_sys_rng = SystemRandom()
GEN_NUMBERS = '0123456789'


def get_request_ip():
    """Return IP of client request"""
    return os.environ.get("REMOTE_ADDR")


def get_user_agent(request):
    """Return the browser info"""
    return request.headers.get('User-Agent')


def gen_code(symbols, size):
    """Function for generating protection code

        :symbols: @todo
        :size: @todo
        :returns: @todo

        """
    code = ''
    for _ in range(size):
        code += choice(symbols)
    return code


def stringify(value):
    if isinstance(value, str):
        return value
    elif value is None:
        return u''
    else:
        return str(value)


def generate_verification(length):
    if length <= 0:
        raise ValueError('verification length must be positive')
    return ''.join(_sys_rng.choice(GEN_NUMBERS) for _ in range_type(length))
