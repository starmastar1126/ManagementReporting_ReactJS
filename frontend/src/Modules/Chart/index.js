import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';

import { withStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Tabs,
  Tab,
} from '@material-ui/core';

import ExecutiveSummary from "./ExecutiveSummary";
import Fees from "./Fees";
import Expenses from "./Expenses";
import FinancialPerformanceYTD from "./FinancialPerformanceYTD";
import YearlyFinancialPerformance from "./YearlyFinancialPerformance";
import BalanceSheet from "./BalanceSheet";
import CashFlow from "./CashFlow";
import Debtors from "./Debtors";
import ProjectPerformance from "./ProjectPerformance";
import WorkInHand from "./WorkInHand";
import WIHDetailList from "./WIHDetailList";
import Opportunities from "./Opportunities";
import WorkGenerated from "./WorkGenerated";
import FeeProjection from "./FeeProjection";
import ProjectedFinancialPerformance from "./ProjectedFinancialPerformance";
import FinancialPerformanceProjDetail from "./FinancialPerformanceProjDetail";
import ProjectedCashFlow from "./ProjectedCashFlow";
import People from "./People";
import KPI from "./KPI";

import {
  chartTypes
} from "../../Assets/js/constant";

import {styles} from './style';


class Chart extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tabIndex: NaN
    };

    this.handleChangeTab = this.handleChangeTab.bind(this);
  }

  onResize() {
    this.setState({resize: !this.state.resize});
  }

  componentDidMount() {
    const { type } = this.props.match.params;
    this.setState({tabIndex: chartTypes.indexOf(type)});
    window.addEventListener('resize', this.onResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  handleChangeTab = (event, tabIndex) => {
    this.props.history.push('/chart/' + chartTypes[tabIndex]);
    this.setState({ tabIndex });
  };

  handleChangeIndex = tabIndex => {
    this.props.history.push('/chart/' + chartTypes[tabIndex]);
    this.setState({ tabIndex });
  };

  render() {
    const { classes, theme } = this.props;
    const { tabIndex } = this.state;

    return (
      <div className={classes.root}>
        {!isNaN(tabIndex) && tabIndex > -1 &&
          <Fragment>
            <AppBar position="static" color="default">
              <Tabs
                value={tabIndex}
                onChange={this.handleChangeTab}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Executive Summary" className="ft-bold" />
                <Tab label="Fees" className="ft-bold" />
                <Tab label="Expenses" className="ft-bold" />
                <Tab label="Financial Performance YTD" className="ft-bold" />
                <Tab label="Yearly Financial Performance" className="ft-bold" />
                <Tab label="Balance Sheet" className="ft-bold" />
                <Tab label="Cash Flow" className="ft-bold" />
                <Tab label="Debtors" className="ft-bold" />
                <Tab label="Project Performance" className="ft-bold" />
                <Tab label="Work in Hand" className="ft-bold" />
                <Tab label="WIH Detail List" className="ft-bold" />
                <Tab label="Opportunities" className="ft-bold" />
                <Tab label="Work Generated" className="ft-bold" />
                <Tab label="Fee Projection" className="ft-bold" />
                <Tab label="Projected Financial Performance" className="ft-bold" />
                <Tab label="Financial Performance Proj Detail" className="ft-bold" />
                <Tab label="Projected Cash Flow" className="ft-bold" />
                <Tab label="People" className="ft-bold" />
                <Tab label="KPI" className="ft-bold" />
              </Tabs>
            </AppBar>

            <div className={classes.slider}>
              <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={tabIndex}
                onChangeIndex={this.handleChangeIndex}
              >
                {tabIndex === 0 ? <ExecutiveSummary dir={theme.direction}/> : <div></div> }
                {tabIndex === 1 ? <Fees dir={theme.direction}/> : <div></div>}
                {tabIndex === 2 ? <Expenses dir={theme.direction}/> : <div></div>}
                {tabIndex === 3 ? <FinancialPerformanceYTD dir={theme.direction}/> : <div></div>}
                {tabIndex === 4 ? <YearlyFinancialPerformance dir={theme.direction}/> : <div></div>}
                {tabIndex === 5 ? <BalanceSheet dir={theme.direction}/> : <div></div>}
                {tabIndex === 6 ? <CashFlow dir={theme.direction}/> : <div></div>}
                {tabIndex === 7 ? <Debtors dir={theme.direction}/> : <div></div>}
                {tabIndex === 8 ? <ProjectPerformance dir={theme.direction}/> : <div></div>}
                {tabIndex === 9 ? <WorkInHand dir={theme.direction}/> : <div></div>}
                {tabIndex === 10 ? <WIHDetailList dir={theme.direction}/> : <div></div>}
                {tabIndex === 11 ? <Opportunities dir={theme.direction}/> : <div></div>}
                {tabIndex === 12 ? <WorkGenerated dir={theme.direction}/> : <div></div>}
                {tabIndex === 13 ? <FeeProjection dir={theme.direction}/> : <div></div>}
                {tabIndex === 14 ? <ProjectedFinancialPerformance dir={theme.direction}/> : <div></div>}
                {tabIndex === 15 ? <FinancialPerformanceProjDetail dir={theme.direction}/> : <div></div>}
                {tabIndex === 16 ? <ProjectedCashFlow dir={theme.direction}/> : <div></div>}
                {tabIndex === 17 ? <People dir={theme.direction}/> : <div></div>}
                {tabIndex === 18 ? <KPI dir={theme.direction}/> : <div></div>}
              </SwipeableViews>
            </div>

          </Fragment>
        }
      </div>
    );
  };
}


Chart.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(Chart);
