import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [loadingState, setLoadingState] = useState(false);

  const hexAPIUrl = import.meta.env.VITE_API_hexAPIUrl;
  const hexAPIPath = import.meta.env.VITE_API_hexAPIPath;

  const getAdminProducts = useCallback(
    async (page = 1) => {
      setLoadingState(true);
      try {
        const response = await axios.get(
          `${hexAPIUrl}/api/${hexAPIPath}/admin/products?page=${page}`
        );
        if (response.data.success) {
          setProducts(response.data.products);
          setPageInfo(response.data.pagination);
        }
      } catch (error) {
        console.error('取得產品列表失敗：', error);
        if (error.response) {
          console.log('錯誤狀態:', error.response.status);
          console.log('錯誤數據:', error.response.data);
        }
      } finally {
        setLoadingState(false);
      }
    },
    [hexAPIUrl, hexAPIPath]
  );
  const value = {
    products,
    pageInfo,
    loadingState,
    getAdminProducts,
  };
  return (
    <AdminContext.Provider
      value={{
        value,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
