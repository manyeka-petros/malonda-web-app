import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../Auth/api';
import { FaHeart, FaShoppingCart, FaStar, FaRegStar, FaShare, FaExpand } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [zoomImage, setZoomImage] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}/`)
      .then(res => {
        setProduct(res.data);
        const firstImage = res.data.images?.[0]?.image || '';
        setSelectedImage(firstImage);
      })
      .catch(err => {
        console.error('Failed to load product', err);
        setError('Failed to load product. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const renderRating = (rating = 0) =>
    [...Array(5)].map((_, i) =>
      i < rating ? <FaStar key={i} className="star filled" /> :
        <FaRegStar key={i} className="star" />
    );

  const handleAddToCart = () => {
    api.post('/cart/', { product: product.id, quantity: 1 })
      .then(() => toast.success('Added to cart!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }))
      .catch(() => toast.error('Failed to add to cart', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }));
  };

  const handleAddToWishlist = () => {
    api.post('/wishlist/', { product: product.id })
      .then(() => toast.success('Added to wishlist!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }))
      .catch(() => toast.error('Failed to add to wishlist', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this amazing product: ${product.name}`,
        url: window.location.href,
      })
      .catch(err => console.error('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info('Link copied to clipboard!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading product details...</p>
    </div>
  );

  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div className="error-message">Product not found.</div>;

  return (
    <>
      <div className="product-detail-container">
        <div className="product-gallery">
          <div className="main-image-container">
            <img
              src={selectedImage || 'https://via.placeholder.com/800x600?text=No+Image'}
              alt={product.name || 'Product image'}
              className="main-image"
              onClick={() => setZoomImage(true)}
            />
            <button className="zoom-button" onClick={() => setZoomImage(true)}>
              <FaExpand />
            </button>
          </div>

          {product.images?.length > 1 && (
            <div className="thumbnail-gallery">
              {product.images.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`thumbnail-container ${selectedImage === img.image ? 'active' : ''}`}
                  onClick={() => setSelectedImage(img.image)}
                >
                  <img
                    src={img.image}
                    alt={`Thumbnail ${idx}`}
                    className="thumbnail-image"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <div className="product-header">
            <h1 className="product-title">{product.name}</h1>
            <button className="share-button" onClick={handleShare}>
              <FaShare />
            </button>
          </div>

          <div className="product-rating-container">
            <div className="product-rating">
              {renderRating(product.rating)}
              <span className="review-count">({product.reviewCount || 0} reviews)</span>
            </div>
            <div className="stock-status">
              {product.stock_quantity > 0 ? (
                <span className="in-stock">In Stock</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>
          </div>

          <div className="product-price-container">
            <span className="current-price">${parseFloat(product.price).toFixed(2)}</span>
            {product.original_price && (
              <span className="original-price">${parseFloat(product.original_price).toFixed(2)}</span>
            )}
            {product.original_price && (
              <span className="discount-badge">
                {Math.round((1 - product.price / product.original_price) * 100)}% OFF
              </span>
            )}
          </div>

          <div className="product-description-container">
            <h3>Description</h3>
            <p className="product-description">{product.description}</p>
          </div>

          <div className="product-actions">
            <button 
              className="wishlist-button"
              onClick={handleAddToWishlist}
            >
              <FaHeart /> Add to Wishlist
            </button>

            <button
              className="cart-button"
              onClick={handleAddToCart}
              disabled={product.stock_quantity <= 0}
            >
              <FaShoppingCart /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      {zoomImage && (
        <div className="image-modal" onClick={() => setZoomImage(false)}>
          <img
            src={selectedImage}
            alt="Zoomed product"
            className="zoomed-image"
          />
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default ProductDetails;