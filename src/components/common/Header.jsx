import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { updateCartData } from '../../redux/cardSlice';
import { useEffect } from 'react';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_hexAPIUrl;
const API_PATH = import.meta.env.VITE_API_hexAPIPath;
const routes = [
  { path: '/', name: 'Home' },
  { path: '/products', name: 'Products' },
  { path: '/cart', name: 'Cart' },
  //{path:'/login',name:'登入頁面'}
];
export default function Header() {
  const carts = useSelector((state) => state.cart.carts);

  const dispatch = useDispatch();
  // const [carts, setCarts] = useState([]);
  // const [total, setTotal] = useState(0);
  // const [subtotal, setSubtotal] = useState(0);
  // const [totalQty, setTotalQty] = useState(0);
  // const [totalPrice, setTotalPrice] = useState(0);
  const getCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/${API_PATH}/cart`);
      console.log('取得購物車成功:', res.data); // 除錯用
      dispatch(updateCartData(res.data.data));
    } catch (error) {}
  };

  useEffect(() => {
    getCart();
  }, []);
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
            {routes.map((route) => (
              <NavLink
                to={route.path}
                key={route.path}
                className='nav-item nav-link me-4'
              >
                {route.name === 'Cart' ? (
                  <div className='position-relative'>
                    <i className='fas fa-shopping-cart'></i>
                    <span
                      class='position-absolute badge text-bg-success rounded-circle'
                      style={{
                        bottom: '12px',
                        left: '12px',
                      }}
                    >
                      {carts?.length}
                    </span>
                  </div>
                ) : (
                  route.name
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
