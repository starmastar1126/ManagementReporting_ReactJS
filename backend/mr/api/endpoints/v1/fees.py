# -*- coding: utf-8 -*-
"""
"""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import json

from flask import g, request
from sqlalchemy import func

from mr.api.app import api, auth
from mr.core.alias import *


@api.get('/fees/summary')
@api.doc("""
Get fees summary data.
""")
# @auth.required
def get_fees_summary():
    """TODO: Docstring for get_fees_summary.
    :returns: TODO

    """
    filter_data = {}
    if 'filter' in request.args:
        filter_data = json.loads(request.args.get('filter'))

    query = g.s\
        .query(
            DO.OrgId, DO.OrgName, DD.FY, DD.FirstDayOfMonth,
            func.sum(FPF.ActualFees).label("ActualFess"),
            func.sum(FPF.ForecastFees).label("ForecastFees"),
        )\
        .join(DO).join(DD)

    if 'FYs' in filter_data:
        query = query.filter(DD.FY.in_(filter_data['FYs']))

    summary = query.group_by(DO.OrgId, DO.OrgName, DD.FY, DD.FirstDayOfMonth).all()

    resp = []
    for row in summary:
        item = {}
        item['OrgId'] = row[0]
        item['OrgName'] = row[1]
        item['FY'] = row[2]
        item['Date'] = row[3]
        item['ActualFees'] = row[4]
        item['ForecastFees'] = row[5]
        resp.append(item)

    return resp


@api.get('/fees/detail')
@api.doc("""
Get fees detail data.
""")
# @auth.required
def get_fees_detail():
    """TODO: Docstring for get_fees_detail.
    :returns: TODO

    """
    filter_data = {}
    if 'filter' in request.args:
        filter_data = json.loads(request.args.get('filter'))

    query = g.s\
        .query(DO.OrgName, DD.FY, DD.FirstDayOfMonth, DP.ProjectId, DP.ProjectName, DC.ClientName,
               DED.EmployeeName, DEPM.EmployeeName, DESU.EmployeeName, DPT.ProjectTypeDescription,
               DPST.ProjectSubTypeDescription, FPF.ActualFees, FPF.ForecastFees)\
        .join(DO).join(DD).join(DP).join(DC)\
        .join(DED, FPF._Director)\
        .join(DEPM, FPF._ProjectManager)\
        .join(DESU, FPF._Supervisor)\
        .join(DPT).join(DPST)

    if 'FYs' in filter_data:
        query = query.filter(DD.FY.in_(filter_data['FYs']))

    detail = query.all()

    resp = []
    for row in detail:
        item = {}
        item['OrgName'] = row[0]
        item['FY'] = row[1]
        item['Date'] = row[2]
        item['ProjectId'] = row[3]
        item['ProjectName'] = row[4]
        item['ClientName'] = row[5]
        item['Director'] = row[6]
        item['ProjectManager'] = row[7]
        item['Supervisor'] = row[8]
        item['ProjectType'] = row[9]
        item['ProjectSubType'] = row[10]
        item['ActualFees'] = row[11]
        item['ForecastFees'] = row[12]
        resp.append(item)

    return resp
