import React from 'react';
import styles from './ImageGallery.module.css';

const ImageGallery = ({ images, title, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.gallery} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        <div className={styles.imageGrid}>
          {images.map((imageUrl, index) => (
            <div key={index} className={styles.imageItem}>
              <img 
                src={imageUrl} 
                alt={`${title} ${index + 1}`}
                className={styles.image}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>
        {images.length === 0 && (
          <div className={styles.noImages}>
            <p>No images found for this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
