import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { FiShoppingBag, FiTruck, FiShield, FiTag, FiMail } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import DisplayProducts from './DisplayProducts';
import DisplayCategories from './DisplayCategories';
import './Home.css';

const Home = () => {
  const heroSlides = [
    {
      id: 1,
      image: '/images/banner1.jpg',
      title: 'Summer Collection',
      subtitle: 'Discover our new arrivals',
      cta: 'Shop Now',
      colorGradient: 'linear-gradient(to right, #a29bfe, #fd79a8)'
    },
    {
      id: 2,
      image: '/images/banner2.jpg',
      title: 'Tech Gadgets',
      subtitle: 'Latest technology at your fingertips',
      cta: 'Explore',
      colorGradient: 'linear-gradient(to right, #74b9ff, #0984e3)'
    },
    {
      id: 3,
      image: '/images/banner3.jpg',
      title: 'Home Essentials',
      subtitle: 'Everything for your comfortable living',
      cta: 'Browse',
      colorGradient: 'linear-gradient(to right, #55efc4, #00b894)'
    }
  ];

  const features = [
    { icon: <FiTruck size={32} />, title: 'Free Shipping', text: 'On orders over $50' },
    { icon: <FiShoppingBag size={32} />, title: 'Easy Returns', text: '30-day return policy' },
    { icon: <FiShield size={32} />, title: 'Secure Payment', text: '100% secure checkout' },
    { icon: <FiTag size={32} />, title: 'Best Price', text: 'Guaranteed low prices' }
  ];

  return (
    <div className="homepage">
      {/* Hero Carousel */}
      <section className="hero-section">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="hero-swiper"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="hero-slide" style={{ backgroundImage: `url(${slide.image})` }}>
                <div className="hero-overlay" />
                <motion.div 
                  className="hero-content"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <motion.h2 
                    style={{ backgroundImage: slide.colorGradient }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {slide.title}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    {slide.cta}
                  </motion.button>
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="feature-card"
                whileHover={{ 
                  y: -8,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: idx * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Featured Products
          </motion.h2>
          <DisplayProducts />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <motion.div
            className="newsletter-content"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="newsletter-icon">
              <FiMail size={48} />
            </div>
            <h2>Stay Updated</h2>
            <p>Subscribe to get exclusive offers and product updates</p>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Your email address"
                required
              />
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
};

export default Home;