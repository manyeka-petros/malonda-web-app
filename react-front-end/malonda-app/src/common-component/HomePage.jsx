import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DisplayCategories from '../common-component/DisplayCategories';
import DisplayProducts from '../common-component/DisplayProducts';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Home.css'; // Custom CSS file

export default function HomePage() {
  const navigate = useNavigate();
  const carouselImages = [
    '/ecome2.jpg',
    '/ecome3.jpg',
    '/ecome4.jpg',
    '/ecome5.jpg',
    '/ecome6.jpg',
  ];

  // Function to handle product click
  const handleProductClick = (productId) => {
    // Redirect to login page when clicking a product
    navigate('/login', { state: { from: `/products/${productId}` } });
  };

  return (
    <div className="homepage-container">
      {/* Hero Carousel */}
      <section className="hero-section">
        <div id="homeCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            {carouselImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                data-bs-target="#homeCarousel"
                data-bs-slide-to={idx}
                className={idx === 0 ? 'active' : ''}
                aria-current={idx === 0 ? 'true' : undefined}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="carousel-inner">
            {carouselImages.map((src, idx) => (
              <motion.div 
                className={`carousel-item ${idx === 0 ? 'active' : ''}`} 
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="carousel-image"
                  style={{ backgroundImage: `url(${src})` }}
                >
                  <div className="carousel-overlay">
                    <motion.div
                      className="carousel-content"
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                    >
                      <h1 className="carousel-title">Welcome to Our Store</h1>
                      <p className="carousel-subtitle">Discover amazing deals and quality products</p>
                      <motion.button
                        className="shop-now-btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Shop Now
                      </motion.button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Shop by Category
          </motion.h2>
          <DisplayCategories />
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Featured Products
          </motion.h2>
          <DisplayProducts onProductClick={handleProductClick} />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <motion.div 
            className="newsletter-content"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter for the latest products and deals</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Your email address" required />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}