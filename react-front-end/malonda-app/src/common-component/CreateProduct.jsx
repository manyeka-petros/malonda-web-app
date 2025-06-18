import { useEffect, useState } from 'react';
import api from '../Auth/api';
import Swal from 'sweetalert2';
import './CreateProduct.css';

const CreateProduct = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_id: ''
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    api.get('/categories/')
      .then(res => setCategories(res.data))
      .catch(err => {
        console.error('Failed to load categories', err);
        Swal.fire('Error', 'Failed to load categories', 'error');
      });
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('stock_quantity', form.stock_quantity);
    formData.append('category_id', form.category_id);
    if (image) {
      formData.append('image', image);
    }

    try {
      await api.post('/products/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Product Created!',
        text: 'Your product has been added.',
        timer: 2000,
        showConfirmButton: false,
      });

      setForm({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        category_id: ''
      });
      setImage(null);
    } catch (err) {
      console.error('Failed to create product', err);
      Swal.fire('Error', 'Failed to create product', 'error');
    }
  };

  return (
    <div className="create-product-container">
      <h2>Create Product</h2>
      <form onSubmit={handleSubmit} className="create-product-form" encType="multipart/form-data">
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          name="stock_quantity"
          type="number"
          placeholder="Stock Quantity"
          value={form.stock_quantity}
          onChange={handleChange}
          required
        />
        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Category --</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <input
          type="file"
          name="image"
          onChange={handleImageChange}
          accept="image/*"
        />

        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default CreateProduct;
