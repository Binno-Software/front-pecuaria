import React from 'react';
import PropTypes from 'prop-types';
import AuthProvider from './AuthContext';

const AppContext = ({ children }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

export default AppContext;

AppContext.propTypes = {
  children: PropTypes.node
};
