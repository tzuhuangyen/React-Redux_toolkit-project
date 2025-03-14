import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../components/Pagination';
import ProductModal from '../components/ProductModal';
import { Link } from 'react-router-dom';
import ReactLoading from 'react-loading';
const BASE_URL = import.meta.env.VITE_API_hexAPIUrl;
const API_PATH = import.meta.env.VITE_API_hexAPIPath;

const ProductsPage = () => {
  // const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const [tempProduct, setTempProduct] = useState({});

  const [loadingState, setLoadingState] = useState(false);
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [loadingItem, setLoadingItem] = useState('');
  //產品分類
  const [selectedCategory, setSelectedCategory] = useState('All');
  //收藏
  const [wishList, setWishList] = useState(() => {
    const initWishList = localStorage.getItem('wishList')
      ? JSON.parse(localStorage.getItem('wishList'))
      : {};

    return initWishList;
  });

  const toggleWishListItem = (product_id) => {
    const newWishList = {
      ...wishList,
      [product_id]: !wishList[product_id],
    };
    localStorage.setItem('wishList', JSON.stringify(newWishList));
    setWishList(newWishList);
  };

  //產品列表 getProducts
  useEffect(() => {
    // const getProducts = async () => {
    //   try {
    //     setIsScreenLoading(true);
    //     console.log('API URL:', `${BASE_URL}/api/${API_PATH}/products`); // 加入除錯用的 console.log
    //     const res = await axios.get(`${BASE_URL}/api/${API_PATH}/products`);
    //     setProducts(res.data.products || []);
    //   } catch (error) {
    //     alert('取得產品失敗');
    //     setProducts([]); // 錯誤時設置為空陣列
    //   } finally {
    //     setIsScreenLoading(false);
    //   }
    // };
    // getProducts();
    const getAllProducts = async () => {
      try {
        setIsScreenLoading(true);
        console.log('API URL:', `${BASE_URL}/api/${API_PATH}/products`); // 加入除錯用的 console.log
        const res = await axios.get(`${BASE_URL}/api/${API_PATH}/products/all`);
        setAllProducts(res.data.products || []);
      } catch (error) {
        alert('取得產品失敗');
        setProducts([]); // 錯誤時設置為空陣列
      } finally {
        setIsScreenLoading(false);
      }
    };
    getAllProducts();
  }, []);

  //產品分類
  const categories = [
    'All',
    ...new Set(allProducts.map((product) => product.category)),
  ];
  const filteredProducts = allProducts.filter((product) => {
    if (selectedCategory === 'All') return product;
    return product.category === selectedCategory;
  });

  // 收藏

  //加入購物車 addCartItem
  const addCartItem = async (product_id, qty) => {
    if (!product_id) {
      alert('請選擇商品');
      return;
    }
    try {
      setLoadingItem(product_id); // 設置正在加載的商品 ID
      console.log('正在加入購物車:', { product_id, qty }); // 除錯用
      const res = await axios.post(`${BASE_URL}/api/${API_PATH}/cart`, {
        data: {
          product_id,
          qty: Number(qty),
        },
      });
      console.log('加入購物車成功:', res.data); // 除錯用
      alert(res.data.message);
    } catch (error) {
      console.error('加入購物車失敗:', error.response?.data || error); // 除錯用
      alert(error.response?.data?.message || '加入購物車失敗');
    } finally {
      setLoadingItem('');
    }
  };

  return (
    <div className='container-fluid'>
      <div
        className='position-relative d-flex align-items-center justify-content-center'
        style={{ minHeight: '400px' }}
      >
        <div
          className='position-absolute'
          style={{
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundImage:
              'url(https://images.unsplash.com/photo-1480399129128-2066acb5009e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80)',
            backgroundPosition: 'center center',
            opacity: 0.1,
          }}
        ></div>
        <h2 className='fw-bold'>Lorem ipsum.</h2>
      </div>
      <div className='container mt-md-5 mt-3 mb-7'>
        <div className='row'>
          <div className='col-md-4'>
            <div
              className='accordion border border-bottom border-top-0 border-start-0 border-end-0 mb-3'
              id='accordionExample'
            >
              <div className='card border-0'>
                <div
                  className='card-header px-0 py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0 rounded-0'
                  id='headingOne'
                  data-bs-toggle='collapse'
                  data-bs-target='#collapseOne'
                >
                  <div className='d-flex justify-content-between align-items-center pe-1'>
                    <h4 className='mb-0'>Categories</h4>
                    <i className='fas fa-chevron-down'></i>
                  </div>
                </div>
                <div
                  id='collapseOne'
                  className='collapse show'
                  aria-labelledby='headingOne'
                  data-bs-parent='#accordionExample'
                >
                  <div className='card-body py-0'>
                    <ul className='list-unstyled'>
                      {categories.map((category) => (
                        <li key={category}>
                          <button
                            onClick={() => setSelectedCategory(category)}
                            type='button'
                            className='btn py-2 d-block text-muted border-none'
                          >
                            {category}{' '}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className='card border-0'>
                <div
                  className='card-header px-0 py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0 rounded-0'
                  id='headingTwo'
                  data-bs-toggle='collapse'
                  data-bs-target='#collapseTwo'
                >
                  <div className='d-flex justify-content-between align-items-center pe-1'>
                    <h4 className='mb-0'>Lorem ipsum</h4>
                    <i className='fas fa-chevron-down'></i>
                  </div>
                </div>
                <div
                  id='collapseTwo'
                  className='collapse'
                  aria-labelledby='headingTwo'
                  data-bs-parent='#accordionExample'
                >
                  <div className='card-body py-0'>
                    <ul className='list-unstyled'>
                      <li>
                        <a href='#' className='py-2 d-block text-muted'>
                          Lorem ipsum
                        </a>
                      </li>
                      <li>
                        <a href='#' className='py-2 d-block text-muted'>
                          Lorem ipsum
                        </a>
                      </li>
                      <li>
                        <a href='#' className='py-2 d-block text-muted'>
                          Lorem ipsum
                        </a>
                      </li>
                      <li>
                        <a href='#' className='py-2 d-block text-muted'>
                          Lorem ipsum
                        </a>
                      </li>
                      <li>
                        <a href='#' className='py-2 d-block text-muted'>
                          Lorem ipsum
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className='card border-0'>
                <div
                  className='card-header px-0 py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0 rounded-0'
                  id='headingThree'
                  data-bs-toggle='collapse'
                  data-bs-target='#collapseThree'
                >
                  <div className='d-flex justify-content-between align-items-center pe-1'>
                    <h4 className='mb-0'>Lorem ipsum</h4>
                    <i className='fas fa-chevron-down'></i>
                  </div>
                </div>
                <div
                  id='collapseThree'
                  className='collapse'
                  aria-labelledby='headingThree'
                  data-bs-parent='#accordionExample'
                >
                  <div className='card-body py-0'>
                    <ul className='list-unstyled'>
                      <li>
                        <a href='#' className='py-2 d-block text-muted'>
                          Lorem ipsum
                        </a>
                      </li>
                      <li>
                        <a href='#' className='py-2 d-block text-muted'>
                          Lorem ipsum
                        </a>
                      </li>
                      <li>
                        <a href='#' className='py-2 d-block text-muted'>
                          Lorem ipsum
                        </a>
                      </li>
                      <li>
                        <a href='#' className='py-2 d-block text-muted'>
                          Lorem ipsum
                        </a>
                      </li>
                      <li>
                        <a href='#' className='py-2 d-block text-muted'>
                          Lorem ipsum
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-8'>
            <div className='row'>
              {filteredProducts.map((product) => (
                <div key={product.id} className='col-md-6'>
                  <div className='card border-0 mb-4 position-relative position-relative'>
                    <img
                      src={product.imageUrl}
                      className='card-img-top rounded-0'
                      alt={product.title}
                    />
                    <button
                      onClick={() => toggleWishListItem(product.id)}
                      type='button'
                      className='btn border-none text-dark'
                    >
                      <i
                        className={`${
                          wishList[product.id] ? 'fas' : 'far'
                        } fa-heart position-absolute`}
                        style={{ right: '16px', top: '16px' }}
                      ></i>
                    </button>
                    <div className='card-body p-0'>
                      <h4 className='mb-0 mt-3'>
                        <Link to={`/products/${product.id}`}>
                          {product.title}
                        </Link>
                      </h4>
                      <p className='card-text mb-0'>
                        NT${product.price}
                        <span className='text-muted '>
                          <del>NT${product.origin_price}</del>
                        </span>
                      </p>
                      <p className='text-muted mt-3'></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <nav className='d-flex justify-content-center'>
              <ul className='pagination'>
                <li className='page-item'>
                  <a className='page-link' href='#' aria-label='Previous'>
                    <span aria-hidden='true'>&laquo;</span>
                  </a>
                </li>
                <li className='page-item active'>
                  <a className='page-link' href='#'>
                    1
                  </a>
                </li>
                <li className='page-item'>
                  <a className='page-link' href='#'>
                    2
                  </a>
                </li>
                <li className='page-item'>
                  <a className='page-link' href='#'>
                    3
                  </a>
                </li>
                <li className='page-item'>
                  <a className='page-link' href='#' aria-label='Next'>
                    <span aria-hidden='true'>&raquo;</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      {isScreenLoading && (
        <div
          className='d-flex justify-content-center align-items-center'
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(255,255,255,0.3)',
            zIndex: 999,
          }}
        >
          <ReactLoading type='spin' color='black' width='4rem' height='4rem' />
        </div>
      )}
    </div>
  );

  // return (
  //   <div className='container productPage'>
  //     <table className='table align-middle'>
  //       <thead>
  //         <tr>
  //           <th>圖片</th>
  //           <th>商品名稱</th>
  //           <th>價格</th>
  //           <th></th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {products.map((product) => (
  //           <tr key={product.id}>
  //             <td style={{ width: '200px' }}>
  //               <img
  //                 className='img-fluid'
  //                 src={product.imageUrl}
  //                 alt={product.title}
  //               />
  //             </td>
  //             <td>{product.title}</td>
  //             <td>
  //               <del className='h6'>原價 {product.origin_price} 元</del>
  //               <div className='h5'>特價 {product.price}元</div>
  //             </td>
  //             <td>
  //               <div className='btn-group btn-group-sm'>
  //                 <Link
  //                   to={`/products/${product.id}`}
  //                   className='btn btn-outline-info'
  //                 >
  //                   查看更多
  //                 </Link>
  //                 <button
  //                   onClick={() => addCartItem(product.id, 1)}
  //                   type='button'
  //                   className='btn btn-outline-danger'
  //                   disabled={loadingItem === product.id} // 當此商品正在加載時禁用按鈕
  //                 >
  //                   加到購物車
  //                   {loadingItem === product.id && (
  //                     <ReactLoading
  //                       type={'spin'}
  //                       color={'#000'}
  //                       height={'1.5rem'}
  //                       width={'1.5rem'}
  //                     />
  //                   )}
  //                 </button>
  //               </div>
  //             </td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>

  //     {isScreenLoading && (
  //       <div
  //         className='d-flex justify-content-center align-items-center'
  //         style={{
  //           position: 'fixed',
  //           inset: 0,
  //           backgroundColor: 'rgba(255,255,255,0.3)',
  //           zIndex: 999,
  //         }}
  //       >
  //         <ReactLoading type='spin' color='black' width='4rem' height='4rem' />
  //       </div>
  //     )}
  //   </div>
  // );
};

export default ProductsPage;
