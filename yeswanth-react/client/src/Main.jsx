import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { menuCategories, quickLinkData } from './menuData';

const Main = ({ restaurants }) => {
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeQuickLink, setActiveQuickLink] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Define handleQuickLinkClick before useEffect that uses it
  const handleQuickLinkClick = useCallback((linkType) => {
    setActiveQuickLink(linkType);
    setActiveFilter('all');
    
    let items = [];
    
    switch(linkType) {
      case 'birthdayParty':
        items = quickLinkData.birthdayParty.map(item => ({
          id: item.id,
          name: item.name,
          cuisine: "Cakes & Desserts",
          rating: 4.5,
          deliveryTime: "30-35 min",
          image: item.image,
          priceForTwo: item.price,
          discount: `${item.discount}% OFF`
        }));
        break;
      case 'healthyFoods':
        // Get the 10 healthy items from menuCategories
        items = menuCategories[0].items.slice(0, 10).map(item => ({
          id: item.id,
          name: item.name,
          cuisine: "Healthy Food",
          rating: 4.5,
          deliveryTime: "30-40 min",
          image: item.image,
          priceForTwo: item.price,
          discount: `${item.discount}% OFF`
        }));
        break;
      case 'veg':
        items = quickLinkData.veg.map(item => ({
          id: item.id,
          name: item.name,
          cuisine: "Vegetarian",
          rating: 4.4,
          deliveryTime: "25-35 min",
          image: item.image,
          priceForTwo: item.price,
          discount: `${item.discount}% OFF`
        }));
        break;
      case 'nonVeg':
        items = quickLinkData.nonVeg.map(item => ({
          id: item.id,
          name: item.name,
          cuisine: "Non-Vegetarian",
          rating: 4.5,
          deliveryTime: "25-40 min",
          image: item.image,
          priceForTwo: item.price,
          discount: `${item.discount}% OFF`
        }));
        break;
      case 'offers':
        items = quickLinkData.offers.map(item => ({
          id: item.id,
          name: item.name,
          cuisine: "Special Offers",
          rating: 4.5,
          deliveryTime: "30-40 min",
          image: item.image,
          priceForTwo: item.price,
          discount: `${item.discount}% OFF`
        }));
        break;
      case 'food':
        items = quickLinkData.food.map(item => ({
          id: item.id,
          name: item.name,
          cuisine: "Best Food Items",
          rating: 4.5,
          deliveryTime: "25-40 min",
          image: item.image,
          priceForTwo: item.price,
          discount: `${item.discount}% OFF`
        }));
        break;
      case 'drinks':
        items = quickLinkData.drinks.map(item => ({
          id: item.id,
          name: item.name,
          cuisine: "Cool Drinks & Juices",
          rating: 4.4,
          deliveryTime: "15-25 min",
          image: item.image,
          priceForTwo: item.price,
          discount: `${item.discount}% OFF`
        }));
        break;
      case 'smoothies':
        items = quickLinkData.smoothies.map(item => ({
          id: item.id,
          name: item.name,
          cuisine: "Healthy Smoothies",
          rating: 4.6,
          deliveryTime: "15-20 min",
          image: item.image,
          priceForTwo: item.price,
          discount: `${item.discount}% OFF`
        }));
        break;
      case 'desserts':
        items = quickLinkData.desserts.map(item => ({
          id: item.id,
          name: item.name,
          cuisine: "Delicious Desserts",
          rating: 4.5,
          deliveryTime: "20-30 min",
          image: item.image,
          priceForTwo: item.price,
          discount: `${item.discount}% OFF`
        }));
        break;
      default:
        items = restaurants;
    }
    
    setFilteredRestaurants(items);
  }, [restaurants]);

  // Handle category query parameter from navigation
  useEffect(() => {
    const category = searchParams.get('category');
    if (category && quickLinkData[category]) {
      handleQuickLinkClick(category);
    }
  }, [searchParams, handleQuickLinkClick]);

  useEffect(() => {
    setFilteredRestaurants(restaurants);
  }, [restaurants]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setActiveQuickLink(null);
    let filtered = [...restaurants];
    
    switch(filter) {
      case 'rating':
        filtered = restaurants.filter(r => r.rating >= 4.5);
        break;
      case 'fast':
        filtered = restaurants.filter(r => parseInt(r.deliveryTime) <= 30);
        break;
      case 'offer':
        filtered = restaurants.filter(r => parseInt(r.discount) >= 40);
        break;
      default:
        filtered = restaurants;
    }
    
    setFilteredRestaurants(filtered);
  };

  const handleCardClick = (restaurant) => {
    // Map restaurant IDs to menu item IDs for healthy items
    const restaurantToMenuItemMap = {
      6: 1,  // OATS VEGETABLE UPMA
      8: 2,  // RAGI DOSA with COCONUT CHUTNEY (restaurant id 8)
      5: 3,  // VEGETABLE POHA (restaurant id 5)
      7: 4,  // OATMEAL THICK SHAKE (restaurant id 7)
      10: 5, // MINTY MILLET IDLY
      12: 6, // MILLET PONGAL
      13: 7, // CHICKPEA SALAD TOAST
      14: 8, // STUFFED VEGETABLE PARATHA
      15: 9, // AVOCADO CHICKPEA GLOW BOWL
      16: 10 // CABBAGE APPLE SLIM SALAD
    };

    const menuItemId = restaurantToMenuItemMap[restaurant.id];
    
    if (menuItemId) {
      const menuItem = menuCategories[0].items.find(item => item.id === menuItemId);
      if (menuItem && menuItem.recipeDetails) {
        navigate(`/recipe?id=${menuItemId}&name=${encodeURIComponent(menuItem.name)}`);
        return;
      }
    }
    
    // Navigate to related page for other restaurants
    navigate(`/related?id=${restaurant.id}&name=${encodeURIComponent(restaurant.name)}`);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Discover the best food & drinks</h1>
          <p>Order food from the best restaurant near you</p>
          
          <div className="quick-links">
            <button 
              className={`quick-link ${activeQuickLink === 'birthdayParty' ? 'active' : ''}`}
              onClick={() => handleQuickLinkClick('birthdayParty')}
            >
              <i className="fas fa-birthday-cake"></i> Birthday Party
            </button>
            <button 
              className={`quick-link ${activeQuickLink === 'healthyFoods' ? 'active' : ''}`}
              onClick={() => handleQuickLinkClick('healthyFoods')}
            >
              <i className="fas fa-leaf"></i> Healthy Foods
            </button>
            <button 
              className={`quick-link ${activeQuickLink === 'veg' ? 'active' : ''}`}
              onClick={() => handleQuickLinkClick('veg')}
            >
              <i className="fas fa-pizza-slice"></i> Veg
            </button>
            <button 
              className={`quick-link ${activeQuickLink === 'nonVeg' ? 'active' : ''}`}
              onClick={() => handleQuickLinkClick('nonVeg')}
            >
              <i className="fas fa-drumstick-bite"></i> Non-Veg
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">
        <h2 className="section-title">Restaurant near you</h2>
        
        {/* Filters */}
        <div className="filters">
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} 
            data-filter="all"
            onClick={() => handleFilterClick('all')}
          >
            <i className="fas fa-border-all"></i> All
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'rating' ? 'active' : ''}`} 
            data-filter="rating"
            onClick={() => handleFilterClick('rating')}
          >
            <i className="fas fa-star"></i> Top Rated
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'fast' ? 'active' : ''}`} 
            data-filter="fast"
            onClick={() => handleFilterClick('fast')}
          >
            <i className="fas fa-bolt"></i> Fast Delivery
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'offer' ? 'active' : ''}`} 
            data-filter="offer"
            onClick={() => handleFilterClick('offer')}
          >
            <i className="fas fa-tag"></i> Offers
          </button>
          <button className="filter-btn">
            <i className="fas fa-rupee-sign"></i> Budget Friendly
          </button>
          <button className="filter-btn">
            <i className="fas fa-filter"></i> More Filters
          </button>
        </div>
        
        {/* Restaurant Grid */}
        <div className="restaurant-grid" id="restaurantGrid">
          {filteredRestaurants.map(restaurant => (
            <div 
              className="restaurant-card" 
              key={restaurant.id} 
              onClick={() => handleCardClick(restaurant)}
            >
              <div className="restaurant-image">
                <img src={restaurant.image} alt={restaurant.name} />
                <div className="discount-badge">{restaurant.discount}</div>
              </div>
              <div className="restaurant-info">
                <div className="restaurant-name">{restaurant.name}</div>
                <div className="restaurant-cuisine">{restaurant.cuisine}</div>
                <div className="restaurant-details">
                  <span className="rating">★ {restaurant.rating}</span>
                  <span className="delivery-time">⏱ {restaurant.deliveryTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Location Section */}
      <section className="location-section">
        <h2 className="section-title">Find Us Here</h2>
        <div className="location-container">
          <div className="location-map">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3800.45678912345!2d81.804!3d16.98!2m3!1f0!3f0!3f0!2m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDU4JzUwLjAiTiA4McKwNDgnMjAuMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
              width="100%" 
              height="400" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Restaurant Location"
            />
          </div>
          <div className="location-info">
            <h3>Yeswanth's Healthy Kitchen</h3>
            <div className="address-detail">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <p><strong>Address:</strong></p>
                <p>46-7-26/1, Danavaipeta</p>
                <p>Above Meg Unisex Lounge</p>
                <p>Rajahmundry - 533101</p>
              </div>
            </div>
            <div className="address-detail">
              <i className="fas fa-phone-alt"></i>
              <div>
                <p><strong>Contact:</strong></p>
                <p>Order now: +91 98765 43210</p>
              </div>
            </div>
            <div className="address-detail">
              <i className="fas fa-clock"></i>
              <div>
                <p><strong>Delivery Hours:</strong></p>
                <p>8:00 AM - 10:00 PM</p>
              </div>
            </div>
            <a 
              href="https://www.google.com/maps/dir//Yeswanth's+Healthy+Kitchen,+Rajahmundry" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="directions-btn"
            >
              <i className="fas fa-directions"></i> Get Directions
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About Yeswanth's Healthy Kitchen</h4>
            <ul>
              <li><Link to="">About Us</Link></li>
              <li><Link to="">Culture</Link></li>
              <li><Link to="">Blog</Link></li>
              <li><Link to="">Careers</Link></li>
              <li><Link to="">Financial Information</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>For Restaurants</h4>
            <ul>
              <li><Link to="">Partner With Us</Link></li>
              <li><Link to="">Apps For You</Link></li>
              <li><Link to="">Restaurant Owner</Link></li>
              <li><Link to="">Advertise</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Learn More</h4>
            <ul>
              <li><Link to="">Privacy</Link></li>
              <li><Link to="">Terms</Link></li>
              <li><Link to="">Security</Link></li>
              <li><Link to="">Sitemap</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Social Links</h4>
            <div className="social-links">
              <Link to=""><i className="fab fa-facebook"></i></Link>
              <Link to=""><i className="fab fa-instagram"></i></Link>
              <Link to=""><i className="fab fa-twitter"></i></Link>
              <Link to=""><i className="fab fa-youtube"></i></Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy and Content Policies. All trademarks are properties of their respective owners.</p>
          © 2024 Yeswanth's Healthy Kitchen - All rights reserved
        </div>
      </footer>
    </>
  );
};

export default Main;
