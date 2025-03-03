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
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState({});

  const [loadingState, setLoadingState] = useState(false);
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [loadingItem, setLoadingItem] = useState('');
  //產品列表 getProducts
  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsScreenLoading(true);
        console.log('API URL:', `${BASE_URL}/api/${API_PATH}/products`); // 加入除錯用的 console.log
        const res = await axios.get(`${BASE_URL}/api/${API_PATH}/products`);
        setProducts(res.data.products || []);
      } catch (error) {
        alert('取得產品失敗');
        setProducts([]); // 錯誤時設置為空陣列
      } finally {
        setIsScreenLoading(false);
      }
    };
    getProducts();
  }, []);
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
    <div className='container productPage'>
      <table className='table align-middle'>
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td style={{ width: '200px' }}>
                <img
                  className='img-fluid'
                  src={product.imageUrl}
                  alt={product.title}
                />
              </td>
              <td>{product.title}</td>
              <td>
                <del className='h6'>原價 {product.origin_price} 元</del>
                <div className='h5'>特價 {product.price}元</div>
              </td>
              <td>
                <div className='btn-group btn-group-sm'>
                  <Link
                    to={`/products/${product.id}`}
                    className='btn btn-outline-info'
                  >
                    查看更多
                  </Link>
                  <button
                    onClick={() => addCartItem(product.id, 1)}
                    type='button'
                    className='btn btn-outline-danger'
                    disabled={loadingItem === product.id} // 當此商品正在加載時禁用按鈕
                  >
                    加到購物車
                    {loadingItem === product.id && (
                      <ReactLoading
                        type={'spin'}
                        color={'#000'}
                        height={'1.5rem'}
                        width={'1.5rem'}
                      />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
};

export default ProductsPage;
