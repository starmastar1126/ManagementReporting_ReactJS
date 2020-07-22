import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import {
  FormControl,
  Input,
  Select,
  MenuItem,
  ListItemText,
  Checkbox
} from '@material-ui/core';

import { styles } from './style';

import {
  years,
  MenuProps
} from "../../../Assets/js/constant";


class YearSelector extends Component {

  constructor(props) {
    super(props);
  }

  handleChange = (event) => {
    const all = 'All';
    const { selectedYears } = this.props;
    const newYears = event.target.value;

    let _selectedYears = [], _label;

    if (selectedYears.indexOf(all) > -1) {
      if (newYears.indexOf(all) > -1) {
        newYears.splice(newYears.indexOf(all), 1);
        _selectedYears = newYears;
        _label = 'Multi';
      } else {
        _selectedYears = [];
        _label = 'None';
      }

    } else {

      if (newYears.indexOf(all) > -1) {
        _selectedYears = years;
        _label = 'All';
      } else {
        if (newYears.length === years.length - 1) {
          _selectedYears = years;
          _label = 'All';
        } else {
          _selectedYears = newYears;
          if (newYears.length > 1) {
            _label = 'Multi';
          } else if (newYears.length === 1) {
            _label = newYears[0].toString();
          } else {
            _label = 'None';
          }
        }
      }
    }

    this.props.onChange({
      selectedYears: _selectedYears,
      label: _label
    })
  };

  render() {
    const { classes, selectedYears, label } = this.props;

    return (
      <div className={`${classes.root} border`}>
        <FormControl className={classes.formControl}>
          <Select
            multiple
            value={selectedYears}
            onChange={this.handleChange}
            input={<Input id="select-multiple-checkbox" />}
            renderValue={selected => label}
            MenuProps={MenuProps}
          >
            {years.map(year => (
              <MenuItem key={year} value={year} className={classes.menuItem}>
                <Checkbox className="pd-0" checked={selectedYears.indexOf(year) > -1} />
                <ListItemText primary={year} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    );
  }

}


YearSelector.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedYears: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(YearSelector);
