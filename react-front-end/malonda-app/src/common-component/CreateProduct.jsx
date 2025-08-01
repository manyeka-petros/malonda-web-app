import { useEffect, useState } from 'react';
import api from '../Auth/api';
import Swal from 'sweetalert2';
import { FiPlusCircle, FiUpload, FiX } from 'react-icons/fi';
import './CreateProduct.css';

const CreateProduct = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_id: ''
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/categories/');
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to load categories', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          html: `
            <div class="error-alert-content">
              <div class="error-icon">!</div>
              <h3>Failed to load categories</h3>
              <p>Please try again later</p>
            </div>
          `,
          background: '#f8f9fa'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    
    // Create previews for selected images
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]); // Clean up memory
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('stock_quantity', form.stock_quantity);
    formData.append('category_id', form.category_id);

    images.forEach((image) => {
      formData.append('uploaded_images', image);
    });

    try {
      await api.post('/products/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        html: `
          <div class="success-alert-content">
            <div class="success-icon">✓</div>
            <h3>Product Created</h3>
            <p>${form.name} has been added successfully</p>
          </div>
        `,
        showConfirmButton: false,
        timer: 2000,
        background: '#f8f9fa'
      });

      // Reset form
      setForm({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        category_id: ''
      });
      setImages([]);
      setImagePreviews([]);
    } catch (err) {
      console.error('Failed to create product', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        html: `
          <div class="error-alert-content">
            <div class="error-icon">!</div>
            <h3>Failed to create product</h3>
            <p>${err.response?.data?.message || 'Please check your inputs and try again'}</p>
          </div>
        `,
        background: '#f8f9fa'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-product-container">
      <div className="create-product-header">
        <h2>
          <FiPlusCircle className="header-icon" />
          Create New Product
        </h2>
        <p className="subtitle">Add a new product to your inventory</p>
      </div>

      <form onSubmit={handleSubmit} className="create-product-form" encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="product-name">Product Name *</label>
          <input
            id="product-name"
            name="name"
            type="text"
            placeholder="e.g. Premium Wireless Headphones"
            value={form.name}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="product-description">Description</label>
          <textarea
            id="product-description"
            name="description"
            placeholder="Detailed description about the product..."
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="form-textarea"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="product-price">Price *</label>
            <div className="input-with-symbol">
              <span className="symbol">$</span>
              <input
                id="product-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.price}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="product-stock">Stock Quantity *</label>
            <input
              id="product-stock"
              name="stock_quantity"
              type="number"
              min="0"
              placeholder="0"
              value={form.stock_quantity}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="product-category">Category *</label>
          <select
            id="product-category"
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            required
            className="form-select"
            disabled={isLoading}
          >
            <option value="">-- Select Category --</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {isLoading && <div className="select-loading">Loading categories...</div>}
        </div>

        <div className="form-group">
          <label htmlFor="product-images">Product Images</label>
          <div className="file-upload-container">
            <label htmlFor="product-images" className="file-upload-label">
              <FiUpload className="upload-icon" />
              <span>Choose Images</span>
              <input
                id="product-images"
                type="file"
                name="uploaded_images"
                onChange={handleImagesChange}
                accept="image/*"
                multiple
                className="file-upload-input"
              />
            </label>
            <p className="file-upload-hint">Maximum 5 images (JPEG, PNG)</p>
          </div>

          {imagePreviews.length > 0 && (
            <div className="image-previews">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="image-preview-container">
                  <img 
                    src={preview} 
                    alt={`Preview ${index + 1}`} 
                    className="image-preview"
                  />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => removeImage(index)}
                    aria-label="Remove image"
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="button-loader"></span>
          ) : (
            'Create Product'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;