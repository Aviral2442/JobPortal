import React, { useState, useEffect, useRef } from "react";
import { Modal } from "react-bootstrap";
import { TbZoomIn, TbZoomOut, TbRefresh, TbRotate } from "react-icons/tb";

const ImageModal = ({
  show,
  onHide,
  imageSrc,
  title = "Image Preview",
}) => {
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const imgRef = useRef(null);
  const [isPdf, setIsPdf] = useState(false);

  // Reset transforms when modal opens or image changes
  useEffect(() => {
    if (show) {
      setRotation(0);
      setScale(1);
      // Check if it's a PDF
      setIsPdf(imageSrc?.includes('data:application/pdf') || imageSrc?.endsWith('.pdf'));
    }
  }, [show, imageSrc]);

  const rotate = () => setRotation((prev) => (prev + 90) % 360);
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.2));
  const reset = () => {
    setRotation(0);
    setScale(1);
    if (imgRef.current) {
      imgRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton className="my-0">
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center p-0" style={{ overflow: "auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
            padding: "16px",
          }}
        >
          {isPdf ? (
            <iframe
              src={imageSrc}
              style={{
                width: "100%",
                height: "70vh",
                border: "none",
              }}
              title={title}
            />
          ) : (
            <img
              ref={imgRef}
              src={imageSrc}
              alt={title}
              style={{
                transform: `rotate(${rotation}deg) scale(${scale})`,
                maxWidth: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
                transition: "transform 0.2s ease",
              }}
            />
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-around align-items-center">
        {!isPdf && (
          <>
            <button className="btn btn-light" id="rotate-btn" onClick={rotate} title="Rotate 90°">
              <TbRotate className="me-1" /> Rotate
            </button>
            <button className="btn btn-light" id="zoom-in-btn" onClick={zoomIn} title="Zoom In">
              <TbZoomIn className="me-1" /> Zoom In
            </button>
            <button className="btn btn-light" id="zoom-out-btn" onClick={zoomOut} title="Zoom Out">
              <TbZoomOut className="me-1" /> Zoom Out
            </button>
            <button className="btn btn-light" id="reset-btn" onClick={reset} title="Reset">
              <TbRefresh className="me-1" /> Reset
            </button>
          </>
        )}
        {isPdf && (
          <a 
            href={imageSrc} 
            download={title}
            className="btn btn-primary"
          >
            Download PDF
          </a>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ImageModal;