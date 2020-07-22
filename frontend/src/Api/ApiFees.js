import BaseApi from './BaseApi';

// Must be function instead of Object as Generators don't work with complex structure...I guess.
const ApiFees = () => {
  const _api = BaseApi.api;

  const getSummary = (selectedYears) => {
    let queryParams = '';

    let _selectedYears = selectedYears.slice();
    const allIndex = _selectedYears.indexOf('All');
    if (allIndex > -1) _selectedYears.splice(allIndex, 1);
    const filter = {FYs: _selectedYears};

    queryParams += ('?filter=' + JSON.stringify(filter));

    return _api.get('v1.0/fees/summary' + queryParams);
  };

  const getDetail = (selectedYears) => {
    let queryParams = '';
    let _selectedYears = selectedYears.slice();
    const allIndex = _selectedYears.indexOf('All');
    if (allIndex > -1) _selectedYears.slice().splice(allIndex, 1);
    let filter = {FYs: _selectedYears};

    queryParams += ('?filter=' + JSON.stringify(filter));
    return _api.get('v1.0/fees/detail' + queryParams);
  };

  return {
    getSummary,
    getDetail,
  }
};

export default ApiFees();
