import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import { styles } from './style';


class FinancialPerformanceProjDetail extends Component {

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    console.log('Financial Performance Proj Detail');
  }

  componentWillUnmount() {

  }

  render() {
    const { classes, dir } = this.props;

    return (
      <div className={classes.root} dir={dir}>
        Financial Performance Proj Detail
      </div>
    );
  }

}


FinancialPerformanceProjDetail.propTypes = {
  classes: PropTypes.object.isRequired,
  dir: PropTypes.string.isRequired,
};

export default withStyles(styles)(FinancialPerformanceProjDetail);
