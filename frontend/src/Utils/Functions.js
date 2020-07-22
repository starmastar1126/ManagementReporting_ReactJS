import { timeParse, timeFormat } from 'd3-time-format';

const getParams = (window, width, height, margin={}) => {
  const pageYOffset = window.pageYOffset;
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  return {
    pageYOffset: pageYOffset,
    xMax: xMax,
    yMax: yMax,
  }
};

const parseDate = timeParse('%Y-%m-%d');
const getMonth = date => {
  return parseDate(date).getMonth();
};

const isEqualObjList = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  if (arr1.length === 0) return true;
  return JSON.stringify(arr1[arr1.length - 1]) === JSON.stringify(arr2[arr2.length - 1]);
};

const isEqualList = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  if (arr1.length === 0) return true;
  return arr1[arr1.length - 1] === arr2[arr2.length - 1];
};

const isMulti = (arrs) => {
  let isMulti = false;
  arrs.forEach(arr => {
    isMulti = isMulti || arr.length > 0;
  });
  return isMulti;
};

const getIndexFromElementList = (els, el) => {
  for (let i = 0; i < els.length; i++) {
    if (els[i] === el) return i;
  }
  return -1;
};

const getIndexFromObjList = (objs, obj) => {
  for (let i = 0; i < objs.length; i ++) {
    if (JSON.stringify(objs[i]) === JSON.stringify(obj)) return i;
  }
  return -1;
};

const randomColor = () => ('#' + (Math.random() * 0xFFFFFF << 0).toString(16) + '000000').slice(0, 7);

const deActivateEls = (els, className) => {
  els.forEach(el => {
    el.classList.remove(className);
  });
};

const thousandFormat = (value) => {
  let x = parseFloat(value);
  if (!value || isNaN(x)) return '0';
  const converted = Math.round(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');;
  return converted;
};

const financialMonth = (month) => {
  month = parseInt(month);
  if (month === 6) return month + 6;
  return (month + 6) % 12
};

export {
  getParams,
  getMonth,
  isEqualObjList,
  isEqualList,
  isMulti,
  getIndexFromElementList,
  getIndexFromObjList,
  randomColor,
  deActivateEls,
  thousandFormat,
  financialMonth
}
