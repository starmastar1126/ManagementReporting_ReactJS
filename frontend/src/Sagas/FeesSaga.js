import { call, put, select } from 'redux-saga/effects';

import { creators as FeesActions } from '../Reducers/Fees';
import ApiFees from '../Api/ApiFees';

export function * getFeesSummary({payload}) {
  try {
    const response = yield call(ApiFees.getSummary, payload.selectedYears);

    if (response.status === 200) {
      yield put(FeesActions.feesSuccess({summaryData: response.data}));
    }
  } catch(e) {
    yield put(FeesActions.feesFailure(e));
  }
}

export function * getFeesDetail({payload}) {
  try {
    const response = yield call(ApiFees.getDetail, payload.selectedYears);

    if (response.status === 200) {
      yield put(FeesActions.feesSuccess({detailData: response.data}));
    }
  } catch(e) {
    yield put(FeesActions.feesFailure(e));
  }
}
