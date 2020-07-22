import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import { styles } from './style';


class People extends Component {

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    console.log('People');
  }

  componentWillUnmount() {

  }

  render() {
    const { classes, dir } = this.props;

    return (
      <div className={classes.root} dir={dir}>
        People
      </div>
    );
  }

}


People.propTypes = {
  classes: PropTypes.object.isRequired,
  dir: PropTypes.string.isRequired,
};

export default withStyles(styles)(People);
