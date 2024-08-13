import PropTypes from 'prop-types';
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AppContext } from '../state/app.context';

/**
 * Higher-order component that protects routes requiring authentication.
 * Redirects unauthenticated users to the login page.
 *
 * @param {object} props - The component's props.
 * @param {React.ReactNode} props.children - The child elements 
 * @returns {React.ReactElement} A `Navigate` component if the user is not authenticated, otherwise the child elements.
 */
export default function Authenticated({ children }) {
  const { user } = useContext(AppContext);
  const location = useLocation();

  if (!user) {
    return <Navigate replace to="/login" state={{ from: location }} />;
  }

  return (
    <>
      {children}
    </>
  );
}

Authenticated.propTypes = {
  /**
   * The child elements to render if the user is authenticated.
   * Can be any valid React node.
   *
   * @type {React.ReactNode}
   */
  children: PropTypes.any,
};