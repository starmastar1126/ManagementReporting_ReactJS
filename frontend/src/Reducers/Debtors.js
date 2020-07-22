import { createActions, handleActions, combineActions } from 'redux-actions';

const initState = {
  selectedYears: [2019],
  label: '2019',
  selectedMonths: [],
  selectedDaysRanges: [],
  selectedItems: [],
  selectedItemStacks: [],

  summaryData: [],
  detailData: [],

  fetching: false,
  error: null,
};

export const creators = createActions({
    DEBTORS_UPDATE_FILTER: (filter) => (filter),
    DEBTORS_SUMMARY_REQUEST: (selectedYears) => ({selectedYears}),
    DEBTORS_DETAIL_REQUEST: (selectedYears) => ({selectedYears}),
    DEBTORS_SUCCESS: (payload) => (payload),
    DEBTORS_FAILURE: (payload) => (payload)
  }
);

const updateFilterReducer = (state, {payload}) => {
  const nextState = Object.assign({}, state, payload);
  return nextState;
};

const summaryReducer = (state) => {
  return {...state, fetching: true, error: null}
};

const detailReducer = (state) => {
  return {...state, fetching: true, error: null}
};

const successReducer = (state, {payload}) => {
  const nextState = Object.assign({}, state, payload);
  nextState.fetching = false;
  return nextState;
};

const failureReducer = (state, {payload}) => {
  return {...state, fetching: false, error: payload};
};

export default handleActions (
  {
    DEBTORS_UPDATE_FILTER: updateFilterReducer,
    DEBTORS_SUMMARY_REQUEST: summaryReducer,
    DEBTORS_DETAIL_REQUEST: detailReducer,
    DEBTORS_SUCCESS: successReducer,
    DEBTORS_FAILURE: failureReducer
  },
  initState
);
