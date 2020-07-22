import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import PublicLayout from './Public';


class Layout extends Component {
  static displayName = 'Layout';
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const { children, ...props } = this.props;
    return <PublicLayout {...props}>{children}</PublicLayout>
  }
}

export default withRouter(Layout);
