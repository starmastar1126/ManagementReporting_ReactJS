import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import { creators as FeesActions } from '../../../Reducers/Fees';

import YearSelector from "../../../Common/Selectors/YearSelector";
import PeriodSelector from "../../../Common/Selectors/PeriodSelector";
import TopChart from "./TopChart";
import MiddleChart from "./MiddleChart";
import BottomChart from "./BottomChart";

import { styles } from './style';


class Fees extends Component {

  constructor(props) {
    super(props);

    this.state = {
      resize: false
    };

    this.handleYear = this.handleYear.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
  }

  onResize() {
    this.setState({resize: !this.state.resize});
  }

  componentDidMount() {
    console.log('Fees');
    window.addEventListener('resize', this.onResize.bind(this));

    const { selectedYears } = this.props;
    this.props.getFeesSummary(selectedYears);
    this.props.getFeesDetail(selectedYears);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  handleYear = (event) => {
    this.props.getFeesSummary(event.selectedYears);
    this.props.getFeesDetail(event.selectedYears);
    this.handleFilter(event);
  };

  handleFilter = (event) => {
    this.props.updateFilter(event);
  };

  render() {
    const {
      classes, dir,
      summaryData, detailData,
      selectedYears, label, period, selectedMonths, selectedTopItems, selectedMiddleItems, filterName
    } = this.props;

    return (
      <div className={classes.root} dir={dir}>

        <div className="wrapper">
          <PeriodSelector
            period={period}
            onChange={this.handleFilter}
          />
          <YearSelector
            selectedYears={selectedYears}
            label={label}
            onChange={this.handleYear}
          />
          <div className="right well"></div>
        </div>

        <TopChart
          summaryData={summaryData}
          period={period}
          selectedYears={selectedYears}
          selectedMonths={selectedMonths}
          selectedTopItems={selectedTopItems}
          handleFilter={this.handleFilter}
        />

        <MiddleChart
          detailData={detailData}
          selectedYears={selectedYears}
          selectedMonths={selectedMonths}
          selectedTopItems={selectedTopItems}
          selectedMiddleItems={selectedMiddleItems}
          filterName={filterName}
          handleFilter={this.handleFilter}
        />

        <BottomChart
          detailData={detailData}
          selectedYears={selectedYears}
          selectedMonths={selectedMonths}
          selectedTopItems={selectedTopItems}
          selectedMiddleItems={selectedMiddleItems}
          filterName={filterName}
        />

      </div>
    );
  }

}


Fees.propTypes = {
  classes: PropTypes.object.isRequired,
  dir: PropTypes.string.isRequired,

  summaryData: PropTypes.array.isRequired,
  detailData: PropTypes.array.isRequired,

  selectedYears: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  period: PropTypes.string.isRequired,

  selectedMonths: PropTypes.array.isRequired,
  selectedTopItems: PropTypes.array.isRequired,

  selectedMiddleItems: PropTypes.array.isRequired,
  filterName: PropTypes.string.isRequired,
};

const mapStateToProps = state => {
  return {
    selectedYears: state.fees.selectedYears,
    label: state.fees.label,
    period: state.fees.period,

    selectedMonths: state.fees.selectedMonths,
    selectedTopItems: state.fees.selectedTopItems,

    selectedMiddleItems: state.fees.selectedMiddleItems,
    filterName: state.fees.filterName,

    summaryData: state.fees.summaryData,
    detailData: state.fees.detailData,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateFilter: (filter) => dispatch(FeesActions.feesUpdateFilter(filter)),
    getFeesSummary: (selectedYears) => dispatch(FeesActions.feesSummaryRequest(selectedYears)),
    getFeesDetail: (selectedYears) => dispatch(FeesActions.feesDetailRequest(selectedYears)),
  }
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Fees));
