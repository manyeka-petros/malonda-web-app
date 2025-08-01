import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiTruck, FiShield, FiHeadphones } from 'react-icons/fi';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              About Our Company
            </motion.h1>
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Our journey, values, and commitment to you
            </motion.p>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Our Story Section */}
        <motion.section 
          className="about-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="row align-items-center">
            <div className="col-md-6">
              <motion.img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Our Store"
                className="img-fluid rounded"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="col-md-6">
              <h2>Our Story</h2>
              <p>
                Founded in 2015, we began with a simple mission: to make quality products accessible to everyone. 
                What started as a small team with big dreams has grown into a thriving e-commerce platform 
                serving thousands of satisfied customers nationwide.
              </p>
              <p>
                Our success is built on three core principles: exceptional quality, outstanding customer service, 
                and continuous innovation. We're proud to have been recognized as one of the fastest-growing 
                online retailers for three consecutive years.
              </p>
            </div>
          </div>
        </motion.section>

        {/* What We Do Section */}
        <motion.section 
          className="about-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="row align-items-center flex-md-row-reverse">
            <div className="col-md-6">
              <motion.img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Our Team"
                className="img-fluid rounded"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="col-md-6">
              <h2>What We Do</h2>
              <p>
                We specialize in curating the finest selection of products across multiple categories, 
                from cutting-edge electronics to stylish fashion. Our team of experts personally verifies 
                each item to ensure it meets our rigorous quality standards.
              </p>
              <p>
                Beyond just selling products, we're committed to creating exceptional shopping experiences. 
                Our platform features personalized recommendations, hassle-free returns, and 24/7 customer 
                support to make your shopping journey seamless.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Why Choose Us Section */}
        <motion.section 
          className="features-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center">
            <h2>Why Choose Us?</h2>
            <p className="section-subtitle">We go above and beyond for every customer</p>
          </div>

          <div className="features-grid">
            <motion.div 
              className="feature-card"
              whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="feature-icon">
                <FiCheck size={28} />
              </div>
              <h3>Quality Assurance</h3>
              <p>Every product undergoes rigorous quality checks before reaching you</p>
            </motion.div>

            <motion.div 
              className="feature-card"
              whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="feature-icon">
                <FiShield size={28} />
              </div>
              <h3>Secure Shopping</h3>
              <p>Bank-level encryption protects all your transactions</p>
            </motion.div>

            <motion.div 
              className="feature-card"
              whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="feature-icon">
                <FiTruck size={28} />
              </div>
              <h3>Fast Delivery</h3>
              <p>98% of orders delivered within 2 business days</p>
            </motion.div>

            <motion.div 
              className="feature-card"
              whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="feature-icon">
                <FiHeadphones size={28} />
              </div>
              <h3>24/7 Support</h3>
              <p>Real humans ready to help anytime, day or night</p>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutUs;