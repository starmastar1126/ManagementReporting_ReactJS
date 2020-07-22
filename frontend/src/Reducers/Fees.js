import { createActions, handleActions, combineActions } from 'redux-actions';

const initState = {
  selectedYears: [2019],
  label: '2019',
  period: 'month',

  selectedMonths: [],
  selectedTopItems: [],

  selectedMiddleItems: [],
  filterName: 'Director',

  summaryData: [],
  detailData: [],

  fetching: false,
  error: null,

};

export const creators = createActions({
    FEES_UPDATE_FILTER: (filter) => (filter),
    FEES_SUMMARY_REQUEST: (selectedYears) => ({selectedYears}),
    FEES_DETAIL_REQUEST: (selectedYears) => ({selectedYears}),
    FEES_SUCCESS: (payload) => (payload),
    FEES_FAILURE: (payload) => (payload)
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
    FEES_UPDATE_FILTER: updateFilterReducer,
    FEES_SUMMARY_REQUEST: summaryReducer,
    FEES_DETAIL_REQUEST: detailReducer,
    FEES_SUCCESS: successReducer,
    FEES_FAILURE: failureReducer
  },
  initState
);
