// src/components/CreateCategory.jsx
import { useState } from 'react';
import api from '../Auth/api';
import Swal from 'sweetalert2'; // ✅ SweetAlert2
import './CreateCategory.css';

const CreateCategory = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories/', { name, description });

      // ✅ SweetAlert success message
      Swal.fire({
        icon: 'success',
        title: 'Category Created!',
        text: 'The category has been added successfully.',
        timer: 2000,
        showConfirmButton: false,
      });

      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error creating category:', error);

      // ❌ SweetAlert error message
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to create category. Please try again.',
      });
    }
  };

  return (
    <div className="create-category-container">
      <h2>Create Category</h2>
      <form onSubmit={handleSubmit} className="create-category-form">
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateCategory;
