const chartTypes = [
  'ExecutiveSummary',
  'Fees',
  'Expenses',
  'FinancialPerformanceYTD',
  'YearlyFinancialPerformance',
  'BalanceSheet',
  'CashFlow',
  'Debtors',
  'ProjectPerformance',
  'WorkInHand',
  'WIHDetailList',
  'Opportunities',
  'WorkGenerated',
  'FeeProjection',
  'ProjectedFinancialPerformance',
  'FinancialPerformanceProjDetail',
  'ProjectedCashFlow',
  'People',
  'KPI',
];

const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const fMonths = [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5];
const enMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const years = ['All', 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];
const daysRangeKeys = [
  'Outstanding30Days', 'Outstanding60Days', 'Outstanding90Days',
  'Outstanding120Days', 'Outstanding120PlusDays'
];
const debtorKeyTextMap = {
  Outstanding30Days: '0-30',
  Outstanding60Days: '31-60',
  Outstanding90Days: '61-90',
  Outstanding120Days: '91-120',
  Outstanding120PlusDays: '120+',
  Total: 'All'
};
const debtorColors = {
  Outstanding30Days: '#cfe8ae',
  Outstanding60Days: '#eac0bd',
  Outstanding90Days: '#f37263',
  Outstanding120Days: '#d63128',
  Outstanding120PlusDays: '#be1e2d',
  Total: '#919698'
};
const daysRanges = {
  0: {
    key: 0,
    daysRange: 'Outstanding30Days',
    text: '0-30',
    color: '#cfe8ae'
  },
  1: {
    key: 1,
    daysRange: 'Outstanding60Days',
    text: '31-60',
    color: '#eac0bd'
  },
  2: {
    key: 2,
    daysRange: 'Outstanding90Days',
    text: '61-90',
    color: '#f37263'
  },
  3: {
    key: 3,
    daysRange: 'Outstanding120Days',
    text: '91-120',
    color: '#d63128'
  },
  4: {
    key: 4,
    daysRange: 'Outstanding120PlusDays',
    text: '120+',
    color: '#be1e2d'
  },
  5: {
    key: 5,
    daysRange: 'Total',
    text: 'Total',
    color: '#919698'
  }
};

const borderHoverColor = '#939393';

const positiveActiveColor = '#8dc63f';
const positiveDisableColor = '#e0ebd2';
const negativeActiveColor = '#919698';
const negativeDisableColor = '#e1e2e2';
const labelColor = '#000000';
const activeLabelColor = '#316ac5';

const ITEM_HEIGHT = 30;
const ITEM_PADDING_TOP = 5;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 15 + ITEM_PADDING_TOP,
      width: 130,
    },
  },
};

const barHeight = 30;
const barThinHeight = 25;

const ship = (maxHeight) => {
  return {
    maxHeight: `${maxHeight}px`,
    overflowY: 'auto',
    borderBottom: 'solid 1px #a9a9a9',
    borderTop: 'solid 1px #a9a9a9',
    fontSize: '11px'
  }
};

const axis = {
  height: barHeight
};

const thinAxis = {
  height: barThinHeight
};

const tooltip = {
  minWidth: 60,
  backgroundColor: 'white',
  color: 'black'
};

const item = {
  height: barHeight - 7,
  margin: 0,
  paddingTop: '7px',
  paddingLeft: '5px',
};

const thinItem = {
  height: barThinHeight + 'px',
  margin: 0,
  lineHeight: barThinHeight + 'px',
  paddingLeft: '5px',
};

const empty = (height) => {
  return {
    width: '100%',
    height: `${height}px`,
    lineHeight: `${height}px`,
    textAlign: 'center',
  }
};

export {
  chartTypes,

  months,
  fMonths,
  enMonths,
  years,
  daysRangeKeys,
  debtorKeyTextMap,
  debtorColors,
  daysRanges,

  borderHoverColor,
  positiveActiveColor,
  positiveDisableColor,
  negativeActiveColor,
  negativeDisableColor,
  labelColor,
  activeLabelColor,

  MenuProps,
  barHeight,
  barThinHeight,
  ship,
  axis,
  thinAxis,
  tooltip,
  item,
  thinItem,
  empty
};
