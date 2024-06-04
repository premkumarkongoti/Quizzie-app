import React from "react";
import styles from "./notification.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Success({ handleCloseModal, link }) {
  // Function to handle copying the quiz link to clipboard and showing toast notification
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(link);
    return toast("Link Copied to Clipboard");
  };

  return (
    <>
      <div className={styles.container}>
        {/* Close Button */}
        <div className={styles.close}>
          <button onClick={() => {
              handleCloseModal(false);
              window.location.reload();
            }}>
            X
          </button>
        </div>

        {/* Toast Container */}
        <ToastContainer />

        {/* Success Message */}
        <h1>
          Congrats your Quiz is
          <br /> Published!
        </h1>

        {/* Quiz Link */}
        <div className={styles.link}>{link}</div>

        {/* Share Button */}
        <button onClick={handleCopyToClipboard} className={styles.share}>
          Share
        </button>
      </div>
    </>
  );
}

export default Success;
