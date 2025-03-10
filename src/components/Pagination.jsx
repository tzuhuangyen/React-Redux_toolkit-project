import React from 'react';

const Pagination = ({ pageInfo, handlePageChange }) => {
  // 如果 pageInfo 為空或未定義，不渲染任何內容
  if (!pageInfo || Object.keys(pageInfo).length === 0) {
    return null;
  }
  return (
    <>
      <div className='d-flex justify-content-center'>
        <nav>
          <ul className='pagination'>
            <li className={`page-item ${!pageInfo.has_pre && 'disabled'}`}>
              <a
                onClick={() => handlePageChange(pageInfo.current_page - 1)}
                className='page-link'
                href='#'
              >
                上一頁
              </a>
            </li>

            {Array.from({ length: pageInfo.total_pages }).map((_, index) => (
              <li
                key={index}
                className={`page-item ${
                  pageInfo.current_page === index + 1 && 'active'
                }`}
              >
                <a
                  onClick={() => handlePageChange(index + 1)}
                  className='page-link'
                  href='#'
                >
                  {index + 1}
                </a>
              </li>
            ))}
            <li className={`page-item ${!pageInfo.has_next && 'disabled'}`}>
              <a
                onClick={() => handlePageChange(pageInfo.current_page + 1)}
                className='page-link'
                href='#'
              >
                下一頁
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Pagination;
