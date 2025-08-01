import { useState } from 'react';
import api from '../Auth/api';
import Swal from 'sweetalert2';
import { FiPlusCircle, FiXCircle } from 'react-icons/fi';
import './CreateCategory.css';

const CreateCategory = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await api.post('/categories/', { name, description });

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        html: `
          <div class="success-alert-content">
            <div class="success-icon">✓</div>
            <h3>Category Created</h3>
            <p>${name} has been added successfully</p>
          </div>
        `,
        showConfirmButton: false,
        timer: 2000,
        background: '#f8f9fa',
        customClass: {
          popup: 'custom-swal-popup'
        }
      });

      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error creating category:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        html: `
          <div class="error-alert-content">
            <div class="error-icon">
              <FiXCircle size={24} />
            </div>
            <h3>Creation Failed</h3>
            <p>${error.response?.data?.message || 'Failed to create category. Please try again.'}</p>
          </div>
        `,
        confirmButtonColor: '#d33',
        background: '#f8f9fa'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-category-container">
      <div className="create-category-header">
        <h2>
          <FiPlusCircle className="header-icon" />
          Create New Category
        </h2>
        <p className="subtitle">Add a new product category to your store</p>
      </div>
      
      <form onSubmit={handleSubmit} className="create-category-form">
        <div className="form-group">
          <label htmlFor="category-name">Category Name</label>
          <input
            id="category-name"
            type="text"
            placeholder="e.g. Electronics, Clothing"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category-description">Description</label>
          <textarea
            id="category-description"
            placeholder="Brief description about this category..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="form-textarea"
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="button-loader"></span>
          ) : (
            'Create Category'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateCategory;