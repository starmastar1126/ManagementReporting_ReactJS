import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import {
  FormControl,
  NativeSelect
} from '@material-ui/core';

import { styles } from './style';


class PeriodSelector extends Component {

  constructor(props) {
    super(props);
  }

  handleChange = (event) => {
    this.props.onChange({period: event.target.value});
  };

  render() {
    const { classes, period } = this.props;

    return (
      <div className={`${classes.root} border`}>
        <FormControl className={classes.formControl}>
          <NativeSelect
            value={period}
            name="period"
            onChange={this.handleChange}
          >
            <option value='month'>By Month for</option>
            <option value='year'>By Year for</option>
          </NativeSelect>
        </FormControl>
      </div>
    );
  }

}


PeriodSelector.propTypes = {
  classes: PropTypes.object.isRequired,
  period: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(PeriodSelector);
