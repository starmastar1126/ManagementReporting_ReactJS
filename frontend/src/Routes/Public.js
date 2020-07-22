import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import PropTypes from 'prop-types';

const PublicRoutes = ({ redirect, component: Component, ...rest }) => {
  if (redirect)
    return <Redirect from={rest.path} to={rest.to} />;
  return <Route {...rest} render={props => (<Component {...props}/>)}/>
};

PublicRoutes.propTypes = {
  redirect: PropTypes.bool,
  component: PropTypes.func,
  location: PropTypes.object,
};

export default PublicRoutes
