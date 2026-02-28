import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-top">
        <Link to="/" className="logo">
          <div className="logo-icon">
            <i className="fas fa-carrot"></i>
          </div>
          Yeswanth's Healthy Kitchen
        </Link>

        <div className="header-search">
          <div className="search-bar">
            <input
              type="text"
              id="searchInput"
              placeholder="Search for the best food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn" onClick={handleSearch}>
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>

        <div className="header-actions">
          <Link to="/login"><i className="fas fa-user"></i> Login</Link>
          <Link to="/signup"><i className="fas fa-user-plus"></i> Sign Up</Link>
          <Link to="/cart" className="cart-link">
            <i className="fas fa-shopping-cart"></i>
            Cart
            <span className="cart-badge" style={{ display: 'none' }}>0</span>
          </Link>
        </div>

        <button className="hamburger-btn" onClick={toggleMobileMenu}>
          <i className="fas fa-bars"></i>
        </button>
      </div>

      <nav className="nav">
        <Link to="/" className="active"><i className="fas fa-home"></i> Home</Link>
        <Link to="/menu"><i className="fas fa-utensils"></i> Menu</Link>
        <Link to="/?category=offers"><i className="fas fa-percent"></i> Offers</Link>
        <Link to="/?category=food"><i className="fas fa-hamburger"></i> Food</Link>
        <Link to="/?category=drinks"><i className="fas fa-mug-hot"></i> Drinks</Link>
        <Link to="/?category=smoothies"><i className="fas fa-blender"></i> Smoothies</Link>
        <Link to="/?category=desserts"><i className="fas fa-birthday-cake"></i> Desserts</Link>
      </nav>

      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/login" onClick={toggleMobileMenu}><i className="fas fa-user"></i> Sign in</Link>
          <Link to="/signup" onClick={toggleMobileMenu}><i className="fas fa-user-plus"></i> Sign up</Link>
          <Link to="/cart" className="cart-link" onClick={toggleMobileMenu}>
            <i className="fas fa-shopping-cart"></i>
            Cart
            <span className="cart-badge" style={{ display: 'none' }}>0</span>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Nav;
