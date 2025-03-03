import React from 'react';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';
import { set, useForm } from 'react-hook-form';
import ReactLoading from 'react-loading';

const BASE_URL = import.meta.env.VITE_API_hexAPIUrl;
const API_PATH = import.meta.env.VITE_API_hexAPIPath;

const CartPage = () => {
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState({});
  const getCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/${API_PATH}/cart`);
      console.log('取得購物車成功:', res.data); // 除錯用
      setCart(res.data.data || {});
    } catch (error) {}
  };
  useEffect(() => {
    getCart();
  }, []);

  //remove all cart item
  const removeCart = async () => {
    try {
      setIsScreenLoading(true);
      const res = await axios.delete(`${BASE_URL}/api/${API_PATH}/carts`);
      console.log('清除購物車成功:', res.data); // 除錯用
      alert(res.data.message);
      getCart();
    } catch (error) {
      console.error('清除購物車失敗:', error.response?.data || error); // 除錯用
      alert(error.response?.data?.message || '清除購物車失敗');
    } finally {
      setIsScreenLoading(false);
    }
  };
  //remove single cart item
  const removeCartItem = async (cartItem_id) => {
    try {
      setIsScreenLoading(true);
      const res = await axios.delete(
        `${BASE_URL}/api/${API_PATH}/cart/${cartItem_id}`
      );
      console.log('清除購物車單一項目成功:', res.data); // 除錯用
      alert(res.data.message);
      getCart();
    } catch (error) {
      console.error('清除購物車單一項目失敗:', error.response?.data || error); // 除錯用
      alert(error.response?.data?.message || '清除購物車失敗');
    } finally {
      setIsScreenLoading(false);
    }
  };
  //update cart item
  const updateCartItem = async (cartItem_id, product_id, qty) => {
    try {
      setIsScreenLoading(true);
      const res = await axios.put(
        `${BASE_URL}/api/${API_PATH}/cart/${cartItem_id}`,
        {
          data: { product_id, qty: Number(qty) },
        }
      );

      getCart();
    } catch (error) {
      console.error('更新購物車商品數量失敗:', error.response?.data || error); // 除錯用
      alert(error.response?.data?.message || '更新購物車商品失敗');
    } finally {
      setIsScreenLoading(false);
    }
  };
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

  //結帳
  const {
    register, // 註冊表單欄位
    handleSubmit, // 處理表單提交
    formState: { errors }, // 表單錯誤狀態
    reset, // 重置表單
    watch, // 監聽表單值變化
  } = useForm();

  const onSubmit = handleSubmit((data) => {
    console.log('表單資料:', data);
    const { message, ...user } = data;
    const userInfo = {
      data: {
        user,
        message,
      },
    };
    console.log('準備送出的訂單資料:', userInfo);

    checkout(userInfo);
  });

  const checkout = async (userInfo) => {
    try {
      setIsScreenLoading(true);
      console.log('準備送出訂單資料:', userInfo); // 除錯用

      const res = await axios.post(
        `${BASE_URL}/api/${API_PATH}/order`,
        userInfo
      );
      console.log('訂單送出成功:', res.data);

      alert(res.data.message || '訂單送出成功');
      reset(); // 重置表單
    } catch (error) {
      console.error('訂單送出失敗:', error.response?.data || error);

      alert(error.response?.data?.message || '訂單送出失敗');
    } finally {
      setIsScreenLoading(false);
    }
  };
  return (
    <>
      <div className='container'>
        {cart.carts?.length > 0 && (
          <div>
            <div className='text-end py-3'>
              <button
                onClick={removeCart}
                className='btn btn-outline-danger'
                type='button'
              >
                清空購物車
              </button>
            </div>

            <table className='table align-middle'>
              <thead>
                <tr>
                  <th></th>
                  <th>品名</th>
                  <th style={{ width: '150px' }}>數量/單位</th>
                  <th className='text-end'>單價</th>
                </tr>
              </thead>

              <tbody>
                {cart.carts?.map((cartItem) => (
                  <tr key={cartItem.id}>
                    <td>
                      <button
                        onClick={() => removeCartItem(cartItem.id)}
                        type='button'
                        className='btn btn-outline-danger btn-sm'
                      >
                        x
                      </button>
                    </td>
                    <td>{cartItem.product.title}</td>
                    <td style={{ width: '150px' }}>
                      <div className='d-flex align-items-center'>
                        <div className='btn-group me-2' role='group'>
                          <button
                            onClick={() =>
                              updateCartItem(
                                cartItem.id,
                                cartItem.product_id,
                                cartItem.qty - 1
                              )
                            }
                            disabled={cartItem.qty === 1}
                            type='button'
                            className='btn btn-outline-dark btn-sm'
                          >
                            -
                          </button>
                          <span
                            className='btn border border-dark'
                            style={{ width: '50px', cursor: 'auto' }}
                          >
                            {cartItem.qty}
                          </span>
                          <button
                            onClick={() =>
                              updateCartItem(
                                cartItem.id,
                                cartItem.product_id,
                                cartItem.qty + 1
                              )
                            }
                            type='button'
                            className='btn btn-outline-dark btn-sm'
                          >
                            +
                          </button>
                        </div>
                        <span className='input-group-text bg-transparent border-0'>
                          {cartItem.product.unit}
                        </span>
                      </div>
                    </td>
                    <td className='text-end'>{cartItem.total}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan='3' className='text-end'>
                    總計：
                  </td>
                  <td className='text-end' style={{ width: '130px' }}>
                    NT${cart.final_total}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        <div className='my-5 row justify-content-center'>
          <form onSubmit={onSubmit} className='col-md-6'>
            <div className='mb-3'>
              <label htmlFor='email' className='form-label'>
                Email
              </label>
              <input
                {...register('email', {
                  required: 'Email 是必填欄位',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: '無效的 email 格式',
                  },
                })}
                id='email'
                type='email'
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder='請輸入 Email'
              />

              <p className='text-danger my-2'>{errors.email?.message}</p>
            </div>

            <div className='mb-3'>
              <label htmlFor='name' className='form-label'>
                收件人姓名
              </label>
              <input
                {...register('name', { required: '姓名是必填欄位' })}
                id='name'
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder='請輸入姓名'
              />
              {errors.name?.message && (
                <p className='text-danger my-2'>{errors.name.message}</p>
              )}
            </div>

            <div className='mb-3'>
              <label htmlFor='tel' className='form-label'>
                收件人電話
              </label>
              <input
                {...register('tel', {
                  required: '電話是必填欄位',
                  pattern: {
                    value: /^(0[2-8]\d{7}|09\d{8})$/,
                    message: '無效的電話格式',
                  },
                })}
                id='tel'
                type='text'
                className={`form-control ${errors.tel && 'is-invalid'}`}
                placeholder='請輸入電話'
              />

              {errors.tel && (
                <p className='text-danger my-2'>{errors.tel.message}</p>
              )}
            </div>

            <div className='mb-3'>
              <label htmlFor='address' className='form-label'>
                收件人地址
              </label>
              <input
                {...register('address', { required: '地址是必填欄位' })}
                id='address'
                type='text'
                className={`form-control ${errors.address && 'is-invalid'}`}
                placeholder='請輸入地址'
              />

              {errors.address && (
                <p className='text-danger my-2'>{errors.address.message}</p>
              )}
            </div>

            <div className='mb-3'>
              <label htmlFor='message' className='form-label'>
                留言
              </label>
              <textarea
                {...register('message')}
                id='message'
                className='form-control'
                cols='30'
                rows='10'
              ></textarea>
            </div>
            <div className='text-end'>
              <button type='submit' className='btn btn-danger'>
                送出訂單
              </button>
            </div>
          </form>
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
            <ReactLoading
              type='spin'
              color='black'
              width='4rem'
              height='4rem'
            />
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
