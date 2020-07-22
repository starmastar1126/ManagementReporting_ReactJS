# -*- coding: utf-8 -*-
"""
"""

from __future__ import division
from __future__ import absolute_import
from __future__ import print_function


class ApiError(Exception):

    """Docstring for ApiError. """

    def __init__(self, message, error_code, messages=None):
        """TODO: to be defined1.

        :message: TODO
        :error_code: TODO
        :messages: TODO

        """
        Exception.__init__(self, message)
        self.message = message
        self.error_code = error_code
        self.messages = messages


unauthorized_error = ApiError('Unauthorized', 401)
bad_request_error = ApiError('Bad request', 400)
forbidden_error = ApiError('Forbidden', 403)
not_found_error = ApiError('Not found', 404)
