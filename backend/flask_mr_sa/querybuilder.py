# -*- coding: utf-8 -*-
"""
"""

from __future__ import division
from __future__ import absolute_import
from __future__ import print_function

from flask import g

from flask_mr_api.filterbuilder import FilterBuilder
from flask_mr_api.page import Page
from flask_mr_api import errors


class QueryBuilder(object):
    """Docstring for QueryBuilder. """

    @staticmethod
    def get_result_from_query(query, page=None, page_size=None):
        if page is None:
            page = g.api.page
        if page_size is None:
            page_size = g.api.page_size
        return Page(
            query.offset(page_size * page).limit(page_size).all(),
            query.count()
        )

    def __init__(self, model, session=None):
        if session:
            self.session = session
        else:
            self.session = g.s
        self.model = model

    def _get_filtered_query(self, query, query_filter):
        for field, filters in query_filter.items():
            for op, value in filters.items():
                if op == FilterBuilder.OP_EQ:
                    query = query.filter(getattr(self.model, field) == value)
                elif op == FilterBuilder.OP_LT:
                    query = query.filter(getattr(self.model, field) < value)
                elif op == FilterBuilder.OP_LTE:
                    query = query.filter(getattr(self.model, field) <= value)
                elif op == FilterBuilder.OP_GT:
                    query = query.filter(getattr(self.model, field) > value)
                elif op == FilterBuilder.OP_GTE:
                    query = query.filter(getattr(self.model, field) >= value)
                elif op == FilterBuilder.OP_LIKE:
                    query = query.filter(getattr(self.model, field).like(value))
                elif op == FilterBuilder.OP_IN:
                    query = query.filter(getattr(self.model, field).in_(value))
                else:
                    raise errors.ApiError('Incorrect request filter', 400)
        return query

    def get_query(self, query_filter=None, sorting=None):
        if query_filter is None:
            query_filter = g.api.filter
        query = self.session.query(self.model)
        if query_filter:
            query = self._get_filtered_query(query, query_filter)
        if sorting is None:
            sorting = g.api.order_by
        if sorting:
            if sorting.desc:
                query = query.order_by(getattr(self.model, sorting.field).desc())
            else:
                query = query.order_by(getattr(self.model, sorting.field))
        return query

    def get_page(self, page=None, page_size=None, query_filter=None, sorting=None):
        if page is None:
            page = g.api.page
        if page_size is None:
            page_size = g.api.page_size
        query = self.get_query(query_filter, sorting)
        return query.offset(page_size * page).limit(page_size).all()

    def get_count(self, query_filter=None):
        query = self.get_query(query_filter)
        return query.count()

    def get_result(self, query_filter=None, sorting=None):
        return Page(
            self.get_page(query_filter=query_filter, sorting=sorting),
            self.get_count(query_filter=query_filter)
        )
