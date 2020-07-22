import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import {styles} from './style';


function Header(props) {

  const {classes} = props;

  return (
    <div className={classes.root}>

    </div>
  );
}


Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
