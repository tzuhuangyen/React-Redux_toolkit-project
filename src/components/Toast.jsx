import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Toast as BsToast } from 'bootstrap';
import { removeMessage } from '../slices/toastSlice';
const Toast = () => {
  const messages = useSelector((state) => state.toast.messages);
  const toastRefs = useRef({});
  const dispatch = useDispatch();

  useEffect(() => {
    messages.forEach((message) => {
      const toastElement = toastRefs.current[message.id];
      if (toastElement) {
        console.log('Initializing Toast for message');
        const toastInstance = new BsToast(toastElement);
        toastInstance.show();

        setTimeout(() => {
          dispatch(removeMessage(message.id));
        }, 2000);
      }
    });
  }, [messages]);

  const handleDismiss = (message_id) => {
    dispatch(removeMessage(message_id));
  };

  return (
    <>
      <div className='position-fixed top-0 end-0 p-3' style={{ zIndex: 1100 }}>
        {messages.map((message) => (
          <div
            className='toast'
            role='alert'
            aria-live='assertive'
            aria-atomic='true'
            key={message.id}
            ref={(el) => (toastRefs.current[message.id] = el)}
          >
            <div
              className={`toast-header ${
                message.status === 'success' ? 'bg-success' : 'bg-danger'
              } text-white`}
            >
              <strong className='me-auto'>
                {message.status === 'success' ? 'success' : 'Fail'}
              </strong>
              <button
                onClick={() => handleDismiss(message.id)}
                type='button'
                className='btn-close'
                aria-label='Close'
              ></button>
            </div>
            <div className='toast-body'>{message.text}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Toast;
