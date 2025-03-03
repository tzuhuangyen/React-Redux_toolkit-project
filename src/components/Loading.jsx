import React, { useEffect, useRef } from 'react';

const Loading = () => {
  const planeLoaderRef = useRef(null);

  useEffect(() => {
    const createDot = (x, y) => {
      const dot = document.createElement('div');
      dot.className = 'dot';
      dot.style.left = x + 'px';
      dot.style.top = y + 'px';
      dot.style.animation = 'dotFade 1.5s forwards';
      planeLoaderRef.current?.appendChild(dot);

      setTimeout(() => {
        dot.remove();
      }, 1500);
    };

    const trackPlane = () => {
      const plane = document.querySelector('.plane');
      if (!plane || !planeLoaderRef.current) return;

      const rect = plane.getBoundingClientRect();
      const containerRect = planeLoaderRef.current.getBoundingClientRect();

      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top + rect.height / 2;

      createDot(x, y);
    };

    const intervalId = setInterval(trackPlane, 80);

    // Cleanup function
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className='loading-container'>
      <div className='plane-loader' ref={planeLoaderRef}>
        <div className='plane'>✈</div>
      </div>
    </div>
  );
};

export default Loading;
