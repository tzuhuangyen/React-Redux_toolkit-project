import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const FrontLayout = () => {
  return (
    <>
      <Header />
      {/* <nav
        className='navbar bg-dark border-bottom border-body'
        data-bs-theme='dark'
      >
        <div className='container'>
          <ul className='navbar-nav flex-row gap-5 fs-5'>
            {routes.map((route) => (
              <li key={route.path} className='nav-item'>
                <NavLink
                  className='nav-link'
                  aria-current='page'
                  to={route.path}
                >
                  {route.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav> */}
      <Outlet />
      <Footer />
    </>
  );
};

export default FrontLayout;
