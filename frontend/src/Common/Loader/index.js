import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  wrapper: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 10000000,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    msTransform: 'translate(-50%,-50%)',
    // -msTransform: 'translate(-50%,-50%)',
    width: '100px',
    height: '100px',
    backgroundColor: 'transparent',
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },

});

// set display name for component
const displayName = 'CommonLoader';

// validate component properties
const propTypes = {
  isLoading: PropTypes.bool,
  error: PropTypes.object,
};

const LoadingComponent = (props) => {

  const { classes, isLoading, error } = props;

  // Handle the loading state
  if (isLoading) {
    return (
      <div className={classes.wrapper}>
        <div className={classes.loading}>
          <CircularProgress className={classes.progress} color="secondary" />
        </div>
      </div>
    );
  }
  // Handle the error state
  else if (error) {
    return (
      <div className={classes.wrapper}>
        <div className={classes.loading}>
          Sorry, there was a problem loading the page.
        </div>
      </div>
    );
  }
  else {
    return null;
  }
};

LoadingComponent.displayName = displayName;
LoadingComponent.propTypes = propTypes;

export default withStyles(styles)(LoadingComponent);
