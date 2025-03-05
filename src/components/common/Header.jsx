const routes = [
  { path: '/', name: '首頁' },
  { path: '/products', name: '產品列表' },
  { path: '/cart', name: '購物車' },
];
import { NavLink } from 'react-router-dom';
export default function Header() {
  return (
    <div className='container d-flex flex-column'>
      <nav className='navbar navbar-expand-lg navbar-light'>
        <a className='navbar-brand' href='./index.html'>
          Navbar
        </a>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNavAltMarkup'
          aria-controls='navbarNavAltMarkup'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div
          className='collapse navbar-collapse justify-content-end'
          id='navbarNavAltMarkup'
        >
          <div className='navbar-nav'>
            <a className='nav-item nav-link me-4 active' href='./index.html'>
              Home <span className='sr-only'>(current)</span>
            </a>
            <NavLink
              to='/products'
              className='nav-item nav-link me-4'
              href='./product.html'
            >
              Product
            </NavLink>
            <a className='nav-item nav-link me-4' href='./detail.html'>
              Detail
            </a>
            <NavLink className='nav-item nav-link' to='/cart'>
              <i className='fas fa-shopping-cart'></i>
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
}
