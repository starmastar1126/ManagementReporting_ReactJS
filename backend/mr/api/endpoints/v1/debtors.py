# -*- coding: utf-8 -*-
"""
"""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import json

from flask import g, request

from mr.api.app import api, auth
from mr.core.alias import *


@api.get('/debtors/summary')
@api.doc("""
Get debtors summary data.
""")
# @auth.required
def get_debtors_summary():
    """TODO: Docstring for get_debtors_summary.
    :returns: TODO

    """
    filter_data = {}
    if 'filter' in request.args:
        filter_data = json.loads(request.args.get('filter'))

    query = g.s.query(DD.FY, DD.Month, FFM.DebtorDays).join(DD)

    if 'years' in filter_data:
        query = query.filter(DD.FY.in_(filter_data['years']))

    summary = query.all()

    resp = []
    for row in summary:
        item = {}
        item['Year'] = row[0]
        item['Month'] = row[1]
        item['DebtorDays'] = row[2]
        resp.append(item)

    return resp


@api.get('/debtors/detail')
@api.doc("""
Get debtors detail data.
""")
# @auth.required
def get_debtors_detail():
    """TODO: Docstring for get_debtors_detail.
    :returns: TODO

    """
    filter_data = {}
    if 'filter' in request.args:
        filter_data = json.loads(request.args.get('filter'))

    query = g.s\
        .query(DO.OrgName, DP.ProjectId, DP.ProjectName, DC.ClientName, DED.EmployeeName, DEPM.EmployeeName,
               DESU.EmployeeName, FARI.InvoiceNumber, DD.DimDate, FARI.InvoiceAmount,
               FARI.Outstanding30Days, FARI.Outstanding60Days, FARI.Outstanding90Days,
               FARI.Outstanding120Days, FARI.Outstanding120PlusDays)\
        .join(DO).join(DP).join(DC)\
        .join(DED, FARI._Director)\
        .join(DEPM, FARI._ProjectManager)\
        .join(DESU, FARI._Supervisor)\
        .join(DD)\
        .filter(FARI.InvoiceAmount > 0)

    if 'years' in filter_data:
        query = query.filter(DD.FY.in_(filter_data['years']))

    detail = query.all()

    resp = []
    for row in detail:
        item = {}
        item['OrgName'] = row[0]
        item['ProjectId'] = row[1]
        item['ProjectName'] = row[2]
        item['ClientName'] = row[3]
        item['Director'] = row[4]
        item['ProjectManager'] = row[5]
        item['Supervisor'] = row[6]
        item['InvoiceNumber'] = row[7]
        item['InvoiceDate'] = row[8]
        item['InvoiceAmount'] = row[9]
        item['Outstanding30Days'] = row[10]
        item['Outstanding60Days'] = row[11]
        item['Outstanding90Days'] = row[12]
        item['Outstanding120Days'] = row[13]
        item['Outstanding120PlusDays'] = row[14]
        resp.append(item)

    return resp
