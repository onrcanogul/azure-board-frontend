import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "@emotion/styled";

// Tema renklerine uygun özelleştirilmiş ToastContainer
const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast {
    background-color: #232422;
    color: white;
    border-radius: 4px;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }

  .Toastify__toast-body {
    font-size: 14px;
  }

  .Toastify__progress-bar {
    background: #4fa3ff;
  }

  .Toastify__close-button {
    color: #999;

    &:hover {
      color: white;
    }
  }

  /* Başarılı mesaj stili */
  .Toastify__toast--success {
    border-left: 4px solid #4caf50;
  }

  /* Hata mesaj stili */
  .Toastify__toast--error {
    border-left: 4px solid #ff5252;
  }

  /* Bilgi mesaj stili */
  .Toastify__toast--info {
    border-left: 4px solid #4fa3ff;
  }

  /* Uyarı mesaj stili */
  .Toastify__toast--warning {
    border-left: 4px solid #ffc107;
  }
`;

const ToastManager: React.FC = () => {
  return (
    <StyledToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};

// Toast mesajlarını göstermek için yardımcı fonksiyonlar
export const showSuccessToast = (message: string) => {
  toast.success(message);
};

export const showErrorToast = (message: string) => {
  toast.error(message);
};

export const showInfoToast = (message: string) => {
  toast.info(message);
};

export const showWarningToast = (message: string) => {
  toast.warning(message);
};

export default ToastManager;
