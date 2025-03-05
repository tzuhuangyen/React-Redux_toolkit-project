import { useState } from 'react';
// import axios from 'axios';

import MainComponent from './components/MainComponent';
import SideBar from './components/SideBar';
import AdminUploadFile from './AdminUploadFile';
import LoginPage from './pages/LoginPage';
import AdminProductPage from './pages/AdminProductPage';
import Loading from './components/Loading';
import { AdminProvider } from './contexts/AdminContext';

import AddCart from './pages/AddCart';
const hexAPIUrl = import.meta.env.VITE_API_hexAPIUrl;
const hexAPIPath = import.meta.env.VITE_API_hexAPIPath;

function App() {
  const [isAuth, setIsAuth] = useState(false); // 初始狀態為未認證
  // const [products, setProducts] = useState([]);

  // const [pageInfo, setPageInfo] = useState({});
  const [loadingState, setLoadingState] = useState(false);

  //管理員取得產品
  // const getAdminProducts = async (page = 1) => {
  //   setLoadingState(true); // 開始加載時顯示 loading

  //   try {
  //     const response = await axios.get(
  //       `${hexAPIUrl}/api/${hexAPIPath}/admin/products?page=${page}`
  //     );
  //     console.log('取得產品列表成功：', response.data);
  //     // 確保正確處理回應數據
  //     if (response.data.success) {
  //       setProducts(response.data.products);
  //       setPageInfo(response.data.pagination);
  //     }
  //   } catch (error) {
  //     console.error('取得產品列表失敗：', error);
  //     if (error.response) {
  //       console.log('錯誤狀態:', error.response.status);
  //       console.log('錯誤數據:', error.response.data);
  //     }
  //   } finally {
  //     setLoadingState(false); // 無論成功或失敗，都結束 loading
  //   }
  // };

  return (
    <>
      <AdminProvider>
        {loadingState && <Loading />}{' '}
        {/* 當 loadingState 為 true 時顯示 Loading 組件 */}
        {/* 登入和未登入畫面 */}
        <div className='container'>
          {/* 管理員已登入顯示主要內容 */}

          {isAuth ? (
            <>
              <div className='row'>
                <div className='col-md-2'>
                  <SideBar />
                </div>
                <div className='col-md-10'>
                  <MainComponent />
                  <AdminProductPage
                    setIsAuth={setIsAuth}
                    // getAdminProducts={getAdminProducts}
                    // pageInfo={pageInfo}
                    // products={products}
                  />
                  <AdminUploadFile />
                  <button
                    onClick={() => setIsAuth(false)}
                    className='btn btn-danger mt-3'
                  >
                    登出
                  </button>
                </div>
              </div>
            </>
          ) : (
            // 未登入顯示登入表單
            <LoginPage
              setIsAuth={setIsAuth}
              // getAdminProducts={getAdminProducts}
            />
          )}
        </div>
        <AddCart />
        <p className='mt-5 mb-3 text-muted text-center'>
          &copy; 2025~∞ - Yennefer
        </p>
      </AdminProvider>
    </>
  );
}

export default App;
