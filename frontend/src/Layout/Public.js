//import libs
import React from 'react';
import PropTypes from 'prop-types';

import Header from '../Common/Header';
import Footer from '../Common/Footer';

const displayName = 'Public Layout';
const propTypes = {
  children: PropTypes.node.isRequired,
};

function PublicLayout({ children }) {
  return <div className="main">
    <Header/>
    <main>
      { children }
    </main>
    <Footer/>
  </div>
}

PublicLayout.displayName = displayName;
PublicLayout.propTypes = propTypes;

export default PublicLayout;
