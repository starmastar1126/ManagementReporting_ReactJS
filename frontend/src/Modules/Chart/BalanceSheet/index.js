import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import { styles } from './style';


class BalanceSheet extends Component {

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    console.log('Balance Sheet');
  }

  componentWillUnmount() {

  }

  render() {
    const { classes, dir } = this.props;

    return (
      <div className={classes.root} dir={dir}>
        Balance Sheet
      </div>
    );
  }

}


BalanceSheet.propTypes = {
  classes: PropTypes.object.isRequired,
  dir: PropTypes.string.isRequired,
};

export default withStyles(styles)(BalanceSheet);
