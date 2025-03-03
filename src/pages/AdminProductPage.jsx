import React from 'react';
import { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext'; // 添加這行

import Pagination from '../components/Pagination';
import ProductModal from '../components/ProductModal';
import DelProductModal from '../components/DelProductModal';
// const hexAPIUrl = import.meta.env.VITE_API_hexAPIUrl;
// const hexAPIPath = import.meta.env.VITE_API_hexAPIPath;

const defaultModalState = {
  imageUrl: '',
  title: '',
  category: '',
  unit: '',
  origin_price: '',
  price: '',
  description: '',
  content: '',
  is_enabled: 0,
  imagesUrl: [''],
};

const AdminProductPage = ({ setIsAuth }) => {
  const {
    value: { products, pageInfo, getAdminProducts },
  } = useAdmin();
  const [tempProduct, setTempProduct] = useState(defaultModalState);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [isDelProductModalOpen, setIsDelProductModalOpen] = useState(false);

  useEffect(() => {
    getAdminProducts();
  }, [getAdminProducts]);
  //打開刪除產品模組
  const handleOpenDelProductModal = (product) => {
    setTempProduct(product);
    setIsDelProductModalOpen(true);
  };
  //打開編輯產品模組
  const handleOpenProductModal = (mode, product) => {
    setModalMode(mode);
    switch (mode) {
      case 'create':
        setTempProduct(defaultModalState);
        break;
      case 'edit':
        setTempProduct(product);
        break;
    }
    setIsProductModalOpen(true);
  };

  //換分頁
  const handlePageChange = (page) => {
    getAdminProducts(page);
  };

  return (
    <>
      <div className='row'>
        {' '}
        {/* 添加 row 容器 */}
        <div className='col'>
          <div className='d-flex justify-content-between'>
            <h2>產品列表</h2>
            <button
              onClick={() => handleOpenProductModal('create')}
              type='button'
              className='btn btn-primary'
            >
              建立新的產品
            </button>
          </div>
          <table className='table'>
            <thead>
              <tr>
                <th scope='col'>產品名稱</th>
                <th scope='col'>原價</th>
                <th scope='col'>售價</th>
                <th scope='col'>是否啟用</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(products) &&
                products.map((product) => (
                  <tr key={product.id}>
                    <th scope='row'>{product.title}</th>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td>
                      {product.is_enabled ? (
                        <span className='text-success'>啟用</span>
                      ) : (
                        <span>未啟用</span>
                      )}
                    </td>
                    <td>
                      <div className='btn-group'>
                        <button
                          onClick={() =>
                            handleOpenProductModal('edit', product)
                          }
                          type='button'
                          className='btn btn-outline-primary btn-sm'
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => handleOpenDelProductModal(product)}
                          type='button'
                          className='btn btn-outline-danger btn-sm'
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {/* 分頁 */}
          <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
        </div>
      </div>
      {/* 登入後的編輯產品模組modal */}
      <ProductModal
        // getAdminProducts={getAdminProducts}
        tempProduct={tempProduct}
        modalMode={modalMode}
        isOpen={isProductModalOpen}
        setIsOpen={setIsProductModalOpen}
      />
      {/*登入後的確認商品刪除模組modal */}
      <DelProductModal
        tempProduct={tempProduct}
        // getAdminProducts={getAdminProducts}
        isOpen={isDelProductModalOpen}
        setIsOpen={setIsDelProductModalOpen}
      />
    </>
  );
};

export default AdminProductPage;
