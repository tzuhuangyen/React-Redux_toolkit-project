import React, { useState, useEffect } from 'react';
const BASE_URL = import.meta.env.VITE_API_hexAPIUrl;
const API_PATH = import.meta.env.VITE_API_hexAPIPath;
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReactLoading from 'react-loading';

const ProductDetailPage = () => {
  const [product, setProduct] = useState({});
  const [qtySelect, setQtySelect] = useState(1);
  const { id: product_id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  //產品列表 getProducts
  useEffect(() => {
    const getProduct = async () => {
      try {
        setIsScreenLoading(true);
        const res = await axios.get(
          `${BASE_URL}/api/${API_PATH}/product/${product_id}`
        );
        setProduct(res.data.product || []);
      } catch (error) {
        alert('取得產品失敗');
        setProduct([]); // 錯誤時設置為空陣列
      } finally {
        setIsScreenLoading(false);
      }
    };
    getProduct();
  }, []);
  //加入購物車 addCartItem
  const addCartItem = async (product_id, qty) => {
    if (!product_id) {
      alert('請選擇商品');
      return;
    }
    try {
      setIsLoading(product_id); // 設置正在加載的商品 ID
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
      setIsLoading('');
    }
  };
  return (
    <>
      (
      <div className='container mt-5'>
        <div className='row'>
          <div className='col-6'>
            <img
              className='img-fluid'
              src={product.imageUrl}
              alt={product.title}
            />
          </div>
          <div className='col-6'>
            <div className='d-flex align-items-center gap-2'>
              <h2>{product.title}</h2>
              <span className='badge text-bg-success'>{product.category}</span>
            </div>
            <p className='mb-3'>{product.description}</p>
            <p className='mb-3'>{product.content}</p>
            <h5 className='mb-3'>NT$ {product.price}</h5>
            <div className='input-group align-items-center w-75'>
              <select
                value={qtySelect}
                onChange={(e) => setQtySelect(e.target.value)}
                id='qtySelect'
                className='form-select'
              >
                {Array.from({ length: 10 }).map((_, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
              <button
                onClick={() => addCartItem(product.id, qtySelect)}
                type='button'
                className='btn btn-primary d-flex align-items-center gap-2'
                disabled={isLoading}
              >
                加入購物車
                {isLoading === product.id && (
                  <ReactLoading
                    type={'spin'}
                    color={'#000'}
                    height={'1.5rem'}
                    width={'1.5rem'}
                  />
                )}
              </button>
            </div>
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
      )
    </>
  );
};

export default ProductDetailPage;
