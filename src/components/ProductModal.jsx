import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';
import { useAdmin } from '../contexts/AdminContext';
import { useDispatch } from 'react-redux';
import { pushMessage } from '../slices/toastSlice';

const hexAPIUrl = import.meta.env.VITE_API_hexAPIUrl;
const hexAPIPath = import.meta.env.VITE_API_hexAPIPath;

const ProductModal = ({
  modalMode,
  tempProduct,
  isOpen,
  setIsOpen,
  // getAdminProducts,
}) => {
  const [modalData, setModalData] = useState(tempProduct);
  const productModalRef = useRef(null);
  const { getAdminProducts } = useAdmin();

  useEffect(() => {
    setModalData({ ...tempProduct });
  }, [tempProduct]);

  useEffect(() => {
    // console.log(productModalRef.current);
    if (productModalRef.current) {
      new Modal(productModalRef.current, { backdrop: false }); // 初始化 Modal
    }
    // console.log(Modal.getInstance(productModalRef.current)); // 顯示 Modal
  }, []);

  useEffect(() => {
    if (isOpen) {
      const modalInstance = Modal.getInstance(productModalRef.current);
      modalInstance.show();
    }
  }, [isOpen]);

  const handleCloseProductModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    if (modalInstance) {
      modalInstance.hide();
    }
    setIsOpen(false);
    // 將焦點移動到模態框觸發按鈕或其他安全的地方
    const triggerButton = document.querySelector(
      '[data-bs-target="#productModal"]'
    );
    if (triggerButton) {
      triggerButton.focus();
    }
  };
  const handleOpenDelProductModal = (product) => {
    setModalData(product);
    const modalInstance = Modal.getInstance(delProductModalRef.current);
    modalInstance.show();
  };
  const handleCloseDelProductModal = () => {
    const modalInstance = Modal.getInstance(delProductModalRef.current);
    modalInstance.hide();
  };
  const dispatch = useDispatch();
  const createProduct = async () => {
    try {
      await axios.post(`${hexAPIUrl}/api/${hexAPIPath}/admin/product`, {
        data: {
          ...modalData,
          origin_price: Number(modalData.origin_price),
          price: Number(modalData.price),
          is_enabled: modalData.is_enabled ? 1 : 0,
        },
      });
      dispatch(
        pushMessage({
          text: 'Product created successfully!',
          status: 'success',
        })
      );
    } catch (error) {
      const { message } = error.response.data;
      dispatch(pushMessage({ text: message.join(','), status: 'Failed' }));
    }
  };

  const updateProduct = async () => {
    try {
      await axios.put(
        `${hexAPIUrl}/api/${hexAPIPath}/admin/product/${modalData.id}`,
        {
          data: {
            ...modalData,
            origin_price: Number(modalData.origin_price),
            price: Number(modalData.price),
            is_enabled: modalData.is_enabled ? 1 : 0,
          },
        }
      );
      console.log('Product created successfully');
      dispatch(pushMessage({ text: 'success', status: 'success' }));
    } catch (error) {
      alert('更新失敗');
      console.error('更新失敗：', error);
      dispatch(pushMessage({ text: message.join(','), status: 'Failed' }));
    }
  };
  const handleUpdateProduct = async () => {
    const apiCall = modalMode === 'create' ? createProduct : updateProduct;
    try {
      await apiCall();
      getAdminProducts();
      handleCloseProductModal();
      console.log('更新成功');
    } catch (error) {
      alert('更新失敗');
      console.error('更新失敗：', error);
    }
  };

  //編輯產品視窗
  const handleModalInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setModalData({
      ...modalData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  //圖片上傳
  const handleFileChange = async (e) => {
    console.log('Files:', e.target.files);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file-to-upload', file);
    console.log(formData);
    try {
      const res = await axios.post(
        `${hexAPIUrl}/api/${hexAPIPath}/admin/upload`,
        formData
      );
      const uploadedImageUrl = res.data.imageUrl;
      setModalData({
        ...modalData,
        imageUrl: uploadedImageUrl,
      });
      alert('圖片上傳成功');
      console.log('圖片上傳成功:', uploadedImageUrl);
    } catch (error) {
      console.error('圖片上傳失敗：', error);
    }
  };
  //編輯副圖
  const handleImageChange = (e, index) => {
    const { value } = e.target;
    const newImages = [...modalData.imagesUrl];
    newImages[index] = value;
    setModalData({
      ...modalData,
      imagesUrl: newImages,
    });
  };

  const handleAddImage = () => {
    const newImages = [...modalData.imagesUrl, ''];
    setModalData({
      ...modalData,
      imagesUrl: newImages,
    });
  };
  const handleRemoveImage = () => {
    const newImages = [...modalData.imagesUrl];
    newImages.pop();

    setModalData({
      ...modalData,
      imagesUrl: newImages,
    });
  };

  return (
    <>
      <div
        ref={productModalRef}
        id='productModal'
        className='modal'
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <div className='modal-dialog modal-dialog-centered modal-xl'>
          <div className='modal-content border-0 shadow'>
            <div className='modal-header border-bottom'>
              <h5 className='modal-title fs-4'>
                {modalMode === 'create' ? 'Create New Product' : 'Edit Product'}
              </h5>
              <button
                onClick={handleCloseProductModal}
                type='button'
                className='btn-close'
                aria-label='Close'
              ></button>
            </div>

            <div className='modal-body p-4'>
              <div className='row g-4'>
                <div className='col-md-4'>
                  <div className='mb-4'>
                    <div className='mb-5'>
                      <label htmlFor='fileInput' className='form-label'>
                        {' '}
                        圖片上傳{' '}
                      </label>
                      <input
                        type='file'
                        accept='.jpg,.jpeg,.png'
                        className='form-control'
                        id='fileInput'
                        onChange={handleFileChange}
                      />
                    </div>
                    <label htmlFor='primary-image' className='form-label'>
                      主圖
                    </label>
                    <div className='input-group'>
                      <input
                        value={modalData.imageUrl}
                        onChange={handleModalInputChange}
                        name='imageUrl'
                        type='text'
                        id='primary-image'
                        className='form-control'
                        placeholder='請輸入圖片連結'
                      />
                    </div>
                    <img
                      src={modalData.imageUrl}
                      alt={modalData.title}
                      className='img-fluid'
                    />
                  </div>

                  {/* 副圖 */}
                  <div className='border border-2 border-dashed rounded-3 p-3'>
                    {modalData.imagesUrl?.map((image, index) => (
                      <div key={index} className='mb-2'>
                        <label
                          htmlFor={`imagesUrl-${index + 1}`}
                          className='form-label'
                        >
                          副圖 {index + 1}
                        </label>
                        <input
                          value={image}
                          onChange={(e) => {
                            handleImageChange(e, index);
                          }}
                          name={`imagesUrl-${index + 1}`}
                          id={`imagesUrl-${index + 1}`}
                          type='text'
                          placeholder={`圖片網址 ${index + 1}`}
                          className='form-control mb-2'
                        />

                        {image && (
                          <img
                            src={image}
                            alt={`副圖 ${index + 1}`}
                            className='img-fluid mb-2'
                          />
                        )}
                      </div>
                    ))}
                    <div className='btn-group w-100'>
                      {modalData.imagesUrl.length < 5 &&
                        modalData.imagesUrl[modalData.imagesUrl.length - 1] !==
                          '' && (
                          <button
                            onClick={handleAddImage}
                            className='btn btn-outline-primary btn-sm w-100'
                          >
                            新增圖片
                          </button>
                        )}
                      {modalData.imagesUrl.length > 1 && (
                        <button
                          onClick={handleRemoveImage}
                          className='btn btn-outline-danger btn-sm w-100'
                        >
                          取消圖片
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className='col-md-8'>
                  <div className='mb-3'>
                    <label htmlFor='title' className='form-label'>
                      標題
                    </label>
                    <input
                      value={modalData.title}
                      onChange={handleModalInputChange}
                      name='title'
                      id='title'
                      type='text'
                      className='form-control'
                      placeholder='請輸入標題'
                    />
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='category' className='form-label'>
                      分類
                    </label>
                    <input
                      value={modalData.category}
                      onChange={handleModalInputChange}
                      name='category'
                      id='category'
                      type='text'
                      className='form-control'
                      placeholder='請輸入分類'
                    />
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='unit' className='form-label'>
                      單位
                    </label>
                    <input
                      value={modalData.unit}
                      onChange={handleModalInputChange}
                      name='unit'
                      id='unit'
                      type='text'
                      className='form-control'
                      placeholder='請輸入單位'
                    />
                  </div>

                  <div className='row g-3 mb-3'>
                    <div className='col-6'>
                      <label htmlFor='origin_price' className='form-label'>
                        原價
                      </label>
                      <input
                        value={modalData.origin_price}
                        onChange={handleModalInputChange}
                        name='origin_price'
                        id='origin_price'
                        type='number'
                        className='form-control'
                        placeholder='請輸入原價'
                      />
                    </div>
                    <div className='col-6'>
                      <label htmlFor='price' className='form-label'>
                        售價
                      </label>
                      <input
                        value={modalData.price}
                        onChange={handleModalInputChange}
                        name='price'
                        id='price'
                        type='number'
                        className='form-control'
                        placeholder='請輸入售價'
                      />
                    </div>
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='description' className='form-label'>
                      產品描述
                    </label>
                    <textarea
                      value={modalData.description}
                      onChange={handleModalInputChange}
                      name='description'
                      id='description'
                      className='form-control'
                      rows={4}
                      placeholder='請輸入產品描述'
                    ></textarea>
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='content' className='form-label'>
                      說明內容
                    </label>
                    <textarea
                      value={modalData.content}
                      onChange={handleModalInputChange}
                      name='content'
                      id='content'
                      className='form-control'
                      rows={4}
                      placeholder='請輸入說明內容'
                    ></textarea>
                  </div>

                  <div className='form-check'>
                    <input
                      checked={modalData.is_enabled}
                      onChange={handleModalInputChange}
                      name='is_enabled'
                      type='checkbox'
                      className='form-check-input'
                      id='isEnabled'
                    />
                    <label className='form-check-label' htmlFor='isEnabled'>
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className='modal-footer border-top bg-light'>
              <button
                onClick={handleCloseProductModal}
                type='button'
                className='btn btn-secondary'
              >
                取消
              </button>
              <button
                onClick={handleUpdateProduct}
                type='button'
                className='btn btn-primary'
              >
                確認
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductModal;
