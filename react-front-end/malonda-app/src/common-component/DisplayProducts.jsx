import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../Auth/api';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  FaShare, FaTrash, FaStar, FaRegStar
} from 'react-icons/fa';
import './DisplayProducts.css';

const DisplayProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearch] = useState('');
  const [userRole, setUserRole] = useState('manager');

  useEffect(() => {
    api.get('/products/')
      .then(res => setProducts(res.data))
      .catch(() =>
        Swal.fire({
          icon: 'error',
          title: 'Oops…',
          text: 'Failed to load products',
          background: '#1e293b',
          color: '#f8fafc',
          confirmButtonColor: '#3b82f6'
        })
      )
      .finally(() => setLoading(false));
  }, []);

  const imgUrl = (src) =>
    src || 'https://via.placeholder.com/600x450?text=No+Image';

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete Product?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Delete'
    }).then(result => {
      if (result.isConfirmed) {
        api.delete(`/products/${id}/`)
          .then(() => {
            setProducts(products.filter(p => p.id !== id));
            Swal.fire('Deleted!', 'Product has been removed.', 'success');
          })
          .catch(() => Swal.fire('Error', 'Failed to delete product.', 'error'));
      }
    });
  };

  const renderImage = (prod) => {
    const images = prod.images?.length > 0 ? prod.images : [];
    const firstImageUrl = images.length > 0 ? imgUrl(images[0].image) : 'https://via.placeholder.com/600x450?text=No+Image';

    return (
      <div className="product-image-wrapper" style={{ textAlign: 'center' }}>
        <img
          src={firstImageUrl}
          alt={prod.name}
          className="product-image-large"
          style={{
            width: '100%',
            maxHeight: '320px',
            objectFit: 'cover',
            borderRadius: '12px'
          }}
        />
      </div>
    );
  };

  const renderRating = (rating = 0) =>
    [...Array(5)].map((_, i) =>
      i < rating ? <FaStar key={i} className="star filled" /> :
        <FaRegStar key={i} className="star" />
    );

  const filtered = products.filter(p => {
    const f = filter === 'all' ||
      (filter === 'inStock' && p.stock_quantity > 0) ||
      (filter === 'onSale' && p.discount);
    const s = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return f && s;
  });

  if (loading) {
    return <div className="products-container" style={{ paddingTop: '100px' }}>
      <div className="loading-spinner" />
    </div>;
  }

  return (
    <div className="products-page">
      <div className="products-hero">
        <div className="hero-content">
          <h2 className="hero-intro">Welcome to Malonda Marketplace</h2>
          
          <h1 className="hero-main-title">Our Products</h1>
          <p className="hero-subtitle">
            Discover the finest selection of premium items
          </p>
        </div>
      </div>

      <div className="products-container">
        <div className="products-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search products…"
              value={searchTerm}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="search-button">🔍</button>
          </div>
          <div className="filter-buttons">
            {['all', 'inStock', 'onSale'].map(k => (
              <button key={k} className={filter === k ? 'active' : ''}
                onClick={() => setFilter(k)}>
                {k === 'all' ? 'All' : k === 'inStock' ? 'In Stock' : 'On Sale'}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="no-products">
            <h3>No products found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map(prod => (
              <div key={prod.id} className="product-card">
                <div className="product-card-inner">
                  <Link to={`/products/${prod.id}`} className="product-card-inner-link">
                    {renderImage(prod)}
                  </Link>
                  <div className="product-details">
                    <div className="product-header">
                      <h3>{prod.name}</h3>
                      <div className="header-actions">
                        <button
                          className="share-button"
                          onClick={(e) => {
                            e.preventDefault();
                            navigator.clipboard.writeText(window.location.origin + `/products/${prod.id}`);
                            Swal.fire({
                              icon: 'success',
                              title: 'Link copied!',
                              showConfirmButton: false,
                              timer: 1500
                            });
                          }}
                        >
                          <FaShare />
                        </button>
                        {userRole === 'manager' && (
                          <button className="delete-button" title="Delete"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(prod.id);
                            }}>
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="product-rating">
                      {renderRating(prod.rating)}
                      <span>({prod.reviewCount || 24})</span>
                    </div>

                    <div className="product-price">
                      <span className="current-price">${prod.price}</span>
                      {prod.original_price && (
                        <span className="original-price">${prod.original_price}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayProducts;
