import { call, put, select } from 'redux-saga/effects';

import { creators as DebtorsActions } from '../Reducers/Debtors';
import ApiDebtors from '../Api/ApiDebtors';

export function * getDebtorsSummary({payload}) {
  try {
    const response = yield call(ApiDebtors.getSummary, payload.selectedYears);

    if (response.status === 200) {
      yield put(DebtorsActions.debtorsSuccess({summaryData: response.data}));
    }
  } catch(e) {
    yield put(DebtorsActions.debtorsFailure(e));
  }
}

export function * getDebtorsDetail({payload}) {
  try {
    const response = yield call(ApiDebtors.getDetail, payload.selectedYears);

    if (response.status === 200) {
      yield put(DebtorsActions.debtorsSuccess({detailData: response.data}));
    }
  } catch(e) {
    yield put(DebtorsActions.debtorsFailure(e));
  }
}
