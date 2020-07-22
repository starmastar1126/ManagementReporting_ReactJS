import { takeLatest, all } from 'redux-saga/effects';

import { creators as FeesActions } from '../Reducers/Fees';
import { creators as DebtorsActions } from '../Reducers/Debtors';

import { getFeesSummary, getFeesDetail } from './FeesSaga';
import { getDebtorsSummary, getDebtorsDetail } from './DebtorsSaga';

export default function * root () {
  yield all([

    takeLatest(FeesActions.feesSummaryRequest, getFeesSummary),

    takeLatest(FeesActions.feesDetailRequest, getFeesDetail),

    takeLatest(DebtorsActions.debtorsSummaryRequest, getDebtorsSummary),

    takeLatest(DebtorsActions.debtorsDetailRequest, getDebtorsDetail),

  ]);
}
