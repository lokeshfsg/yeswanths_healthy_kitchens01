import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { menuCategories, additionalItems } from './menuData';
import './Menu.css';

const RelatedItems = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const restaurantId = searchParams.get('id');
  const restaurantName = searchParams.get('name') || 'Related Items';
  
  const [relatedItems, setRelatedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Restaurant IDs that should NOT show related items (the 10 healthy breakfast items)
  const itemsWithoutRelated = [5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16];
  
  // Check if current restaurant should show related items
  const shouldShowRelated = !itemsWithoutRelated.includes(parseInt(restaurantId));

  useEffect(() => {
    // Get the restaurant type based on ID and determine which items to show
    const restaurants = [
      { id: 1, type: 'biryani' },
      { id: 2, type: 'pizza' },
      { id: 3, type: 'biryani' },
      { id: 4, type: 'burger' },
      { id: 5, type: 'healthy' },
      { id: 6, type: 'healthy' },
      { id: 7, type: 'healthy' },
      { id: 8, type: 'healthy' },
      { id: 9, type: 'salads' },
      { id: 10, type: 'healthy' },
      { id: 11, type: 'chinese' },
      { id: 12, type: 'healthy' },
      { id: 13, type: 'healthy' },
      { id: 14, type: 'healthy' },
      { id: 15, type: 'healthy' },
      { id: 16, type: 'healthy' }
    ];

    // Find restaurant type based on ID
    const restaurant = restaurants.find(r => r.id === parseInt(restaurantId));
    const itemType = restaurant ? restaurant.type : 'biryani';

    // Get related items based on type
    let items = [];
    
    if (additionalItems[itemType]) {
      items = [...additionalItems[itemType]];
    } else {
      // Get items from menuCategories that match
      menuCategories.forEach(cat => {
        items = [...items, ...cat.items];
      });
    }

    // Add items from menuCategories to make it 20+
    menuCategories.forEach(cat => {
      items = [...items, ...cat.items];
    });

    // Get unique items (by id) and limit to at least 20
    const uniqueItems = [];
    const seen = new Set();
    items.forEach(item => {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        uniqueItems.push(item);
      }
    });

    // Ensure we have at least 20 items
    while (uniqueItems.length < 20) {
      const baseItem = uniqueItems[0];
      if (baseItem) {
        uniqueItems.push({
          ...baseItem,
          id: baseItem.id + uniqueItems.length * 1000,
          name: `${baseItem.name} Special`,
          price: Math.floor(baseItem.price * (0.8 + Math.random() * 0.4)),
          discount: Math.floor(10 + Math.random() * 25)
        });
      }
    }

    setRelatedItems(uniqueItems.slice(0, 24));
  }, [restaurantId]);

  const handleAddToCart = (item) => {
    setCart([...cart, { ...item, cartId: Date.now() + Math.random() }]);
  };

  const handleRemoveFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const getDiscountedPrice = (price, discount) => {
    return Math.floor(price - (price * discount / 100));
  };

  // Filter items based on selected category
  const getFilteredItems = () => {
    let filtered = [...relatedItems];
    
    if (selectedCategory !== 'all') {
      filtered = relatedItems.filter(item => 
        item.name.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Sort items
    switch(sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        filtered.sort((a, b) => b.discount - a.discount);
        break;
      default:
        // Popular - keep original order
        break;
    }

    return filtered;
  };

  const handleGoBack = () => {
    navigate('/');
  };

  const handleItemClick = (item) => {
    if (item.recipeDetails) {
      setSelectedItem(item);
    }
  };

  const handleBackToList = () => {
    setSelectedItem(null);
  };

  // Render Recipe Detail View
  if (selectedItem) {
    const recipe = selectedItem.recipeDetails;
    return (
      <div className="menu-page">
        <section className="menu-hero" style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('${selectedItem.image}')`
        }}>
          <div className="menu-hero-content">
            <button className="back-btn" onClick={handleBackToList}>
              <i className="fas fa-arrow-left"></i> Back to Menu
            </button>
            <h1>{selectedItem.name}</h1>
            <p>{selectedItem.description}</p>
          </div>
        </section>

        <div className="recipe-detail-container">
          <div className="recipe-content">
            <div className="recipe-header">
              <div className="recipe-price">
                <span className="price-original">₹{selectedItem.price}</span>
                {selectedItem.discount && (
                  <span className="price-discount">{selectedItem.discount}% OFF</span>
                )}
              </div>
              <button className="add-btn" onClick={() => handleAddToCart(selectedItem)}>
                Add to Cart
              </button>
            </div>

            {recipe.benefits && (
              <div className="recipe-section">
                <h3><i className="fas fa-heart"></i> Health Benefits</h3>
                <ul className="benefits-list">
                  {recipe.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="prep-info">
              <div className="prep-item">
                <i className="fas fa-clock"></i>
                <span className="prep-label">Prep Time</span>
                <span className="prep-value">{recipe.prepTime}</span>
              </div>
              <div className="prep-item">
                <i className="fas fa-fire"></i>
                <span className="prep-label">Cook Time</span>
                <span className="prep-value">{recipe.cookTime}</span>
              </div>
              <div className="prep-item">
                <i className="fas fa-users"></i>
                <span className="prep-label">Servings</span>
                <span className="prep-value">{recipe.servings}</span>
              </div>
            </div>

            {/* Ingredients - Part 1 */}
            {recipe.ingredients && (
              <div className="recipe-section">
                <h3><i className="fas fa-carrot"></i> {recipe.part1Title || "Ingredients"}</h3>
                {recipe.part1Subtitle && <p className="recipe-subtitle">{recipe.part1Subtitle}</p>}
                <ul className="ingredients-list">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Preparation Steps - Part 1 */}
            {recipe.preparationSteps && recipe.part1StepsTitle && (
              <div className="recipe-section">
                <h3><i className="fas fa-list-ol"></i> {recipe.part1StepsTitle}</h3>
                <ol className="steps-list">
                  {recipe.preparationSteps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Ingredients - Part 2 (Chutney) */}
            {recipe.chutneyIngredients && (
              <div className="recipe-section">
                <h3><i className="fas fa-carrot"></i> {recipe.part2Title || "COCONUT CHUTNEY"}</h3>
                {recipe.part2Subtitle && <p className="recipe-subtitle">{recipe.part2Subtitle}</p>}
                <ul className="ingredients-list">
                  {recipe.chutneyIngredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tempering Ingredients */}
            {recipe.temperingIngredients && (
              <div className="recipe-section">
                <h3><i className="fas fa-fire"></i> {recipe.temperingTitle || "For Tempering:"}</h3>
                <ul className="ingredients-list">
                  {recipe.temperingIngredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Preparation Steps - Part 2 (Chutney) */}
            {recipe.chutneySteps && recipe.part2StepsTitle && (
              <div className="recipe-section">
                <h3><i className="fas fa-list-ol"></i> {recipe.part2StepsTitle}</h3>
                <ol className="steps-list">
                  {recipe.chutneySteps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Batter Ingredients */}
            {recipe.batterIngredients && (
              <div className="recipe-section">
                <h3><i className="fas fa-carrot"></i> {recipe.batterTitle || 'Batter Ingredients'}</h3>
                <ul className="ingredients-list">
                  {recipe.batterIngredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mint Twist Ingredients */}
            {recipe.mintTwistIngredients && (
              <div className="recipe-section">
                <h3><i className="fas fa-leaf"></i> {recipe.mintTwistTitle || 'Mint Twist'}</h3>
                <ul className="ingredients-list">
                  {recipe.mintTwistIngredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Millet Base Ingredients */}
            {recipe.milletBaseIngredients && (
              <div className="recipe-section">
                <h3><i className="fas fa-seedling"></i> {recipe.milletBaseTitle || 'Millet Base'}</h3>
                <ul className="ingredients-list">
                  {recipe.milletBaseIngredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Base Ingredients */}
            {recipe.baseIngredients && (
              <div className="recipe-section">
                <h3><i className="fas fa-bowl-food"></i> {recipe.baseTitle || 'Base'}</h3>
                <ul className="ingredients-list">
                  {recipe.baseIngredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Salad Ingredients */}
            {recipe.saladIngredients && (
              <div className="recipe-section">
                <h3><i className="fas fa-carrot"></i> {recipe.saladTitle || 'Salad'}</h3>
                <ul className="ingredients-list">
                  {recipe.saladIngredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Salad Base Ingredients */}
            {recipe.saladBaseIngredients && (
              <div className="recipe-section">
                <h3><i className="fas fa-carrot"></i> {recipe.saladBaseTitle || 'Salad Base'}</h3>
                <ul className="ingredients-list">
                  {recipe.saladBaseIngredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Dough Ingredients */}
            {recipe.doughIngredients && (
              <div className="recipe-section">
                <h3><i className="fas fa-bread-slice"></i> {recipe.doughTitle || 'Dough'}</h3>
                <ul className="ingredients-list">
                  {recipe.doughIngredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stuffing Ingredients */}
            {recipe.stuffingIngredients && (
              <div className="recipe-section">
                <h3><i className="fas fa-carrot"></i> {recipe.stuffingTitle || 'Stuffing'}</h3>
                <ul className="ingredients-list">
                  {recipe.stuffingIngredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Toast Ingredients */}
            {recipe.toastIngredients && (
              <div className="recipe-section">
                <h3><i className="fas fa-bread-slice"></i> {recipe.toastTitle || 'Toast'}</h3>
                <ul className="ingredients-list">
                  {recipe.toastIngredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Dressing Ingredients */}
            {recipe.dressingIngredients && (
              <div className="recipe-section">
                <h3><i className="fas fa-wine-bottle"></i> {recipe.dressingTitle || 'Dressing'}</h3>
                <ul className="ingredients-list">
                  {recipe.dressingIngredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Default Preparation Steps (when no part1StepsTitle) */}
            {recipe.preparationSteps && !recipe.part1StepsTitle && (
              <div className="recipe-section">
                <h3><i className="fas fa-list-ol"></i> Preparation Steps</h3>
                <ol className="steps-list">
                  {recipe.preparationSteps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {recipe.variations && (
              <div className="recipe-section optional-section">
                <h3><i className="fas fa-lightbulb"></i> Variations</h3>
                <ul className="optional-list">
                  {recipe.variations.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {(recipe.optionalAdditions || recipe.optionalAddons) && (
              <div className="recipe-section optional-section">
                <h3><i className="fas fa-plus-circle"></i> Optional Additions</h3>
                <ul className="optional-list">
                  {(recipe.optionalAdditions || recipe.optionalAddons || []).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {recipe.optional && (
              <div className="recipe-section optional-section">
                <h3><i className="fas fa-info-circle"></i> Note</h3>
                <p className="serving-text">{recipe.optional}</p>
              </div>
            )}

            {recipe.servingSuggestion && (
              <div className="recipe-section optional-section">
                <h3><i className="fas fa-utensils"></i> Serving Suggestion</h3>
                <p className="serving-text">{recipe.servingSuggestion}</p>
              </div>
            )}

            {recipe.nutritionalInfo && (
              <div className="recipe-section nutritional-section">
                <h3><i className="fas fa-chart-pie"></i> Nutritional Information</h3>
                <div className="nutritional-grid">
                  {Object.entries(recipe.nutritionalInfo).map(([key, value]) => (
                    <div key={key} className="nutrient-item">
                      <span className="nutrient-name">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</span>
                      <span className="nutrient-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {cart.length > 0 && (
          <button className="floating-cart" onClick={() => setShowCart(true)}>
            <i className="fas fa-shopping-cart"></i>
            <span className="cart-count">{cart.length}</span>
          </button>
        )}

        <aside className={`cart-sidebar ${showCart ? 'open' : ''}`}>
          <div className="cart-header">
            <h3>Your Cart</h3>
            <button className="close-cart" onClick={() => setShowCart(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <i className="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.cartId} className="cart-item">
                  <div className="cart-item-info">
                    <h5>{item.name}</h5>
                    <span className="cart-item-price">₹{item.price}</span>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveFromCart(item.cartId)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <span className="total-amount">₹{getCartTotal()}</span>
              </div>
              <button className="checkout-btn">Checkout</button>
            </div>
          )}
        </aside>
      </div>
    );
  }

  // If shouldShowRelated is false, show a message instead of related items
  if (!shouldShowRelated) {
    return (
      <div className="related-page">
        <section className="related-hero">
          <div className="related-hero-content">
            <button className="back-btn" onClick={handleGoBack}>
              <i className="fas fa-arrow-left"></i> Back to Restaurants
            </button>
            <h1>{restaurantName}</h1>
            <p>Choose from our delicious menu options</p>
          </div>
        </section>

        <div className="related-container">
          <div className="no-items">
            <i className="fas fa-utensils"></i>
            <p>This item doesn't have additional recommendations.</p>
            <p>Please browse our other restaurants for more options.</p>
            <button className="back-btn" onClick={handleGoBack}>
              Browse Restaurants
            </button>
          </div>
        </div>

        <aside className={`cart-sidebar ${showCart ? 'open' : ''}`}>
          <div className="cart-header">
            <h3>Your Cart</h3>
            <button className="close-cart" onClick={() => setShowCart(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <i className="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.cartId} className="cart-item">
                  <div className="cart-item-info">
                    <h5>{item.name}</h5>
                    <span className="cart-item-price">₹{item.price}</span>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveFromCart(item.cartId)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <span className="total-amount">₹{getCartTotal()}</span>
              </div>
              <button className="checkout-btn">Checkout</button>
            </div>
          )}
        </aside>

        {cart.length > 0 && !showCart && (
          <button className="floating-cart" onClick={() => setShowCart(true)}>
            <i className="fas fa-shopping-cart"></i>
            <span className="cart-count">{cart.length}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="related-page">
      <section className="related-hero">
        <div className="related-hero-content">
          <button className="back-btn" onClick={handleGoBack}>
            <i className="fas fa-arrow-left"></i> Back to Restaurants
          </button>
          <h1>{restaurantName}</h1>
          <p>Choose from {relatedItems.length}+ delicious options</p>
        </div>
      </section>

      <div className="related-container">
        <div className="related-filters">
          <div className="filter-group">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="popular">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Discount %</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Search:</label>
            <input 
              type="text" 
              placeholder="Search items..." 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            />
          </div>
          <div className="item-count">
            Showing {getFilteredItems().length} items
          </div>
        </div>

        <div className="related-items-grid">
          {getFilteredItems().map(item => (
            <div 
              key={item.id} 
              className={`related-item-card ${item.recipeDetails ? 'clickable' : ''}`}
              onClick={() => handleItemClick(item)}
            >
              <div className="related-item-image">
                <img 
                  src={item.image || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop'} 
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop';
                  }}
                />
                {item.discount && (
                  <div className="discount-badge">{item.discount}% OFF</div>
                )}
              </div>
              <div className="related-item-info">
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <div className="related-item-pricing">
                  <div className="price-info">
                    <span className="original-price">₹{item.price}</span>
                    <span className="discounted-price">₹{getDiscountedPrice(item.price, item.discount)}</span>
                  </div>
                  <button 
                    className="add-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                  >
                    Add +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {getFilteredItems().length === 0 && (
          <div className="no-items">
            <i className="fas fa-search"></i>
            <p>No items found. Try a different search.</p>
          </div>
        )}
      </div>

      <aside className={`cart-sidebar ${showCart ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Your Cart</h3>
          <button className="close-cart" onClick={() => setShowCart(false)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <i className="fas fa-shopping-cart"></i>
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.cartId} className="cart-item">
                <div className="cart-item-info">
                  <h5>{item.name}</h5>
                  <span className="cart-item-price">₹{item.price}</span>
                </div>
                <button 
                  className="remove-btn"
                  onClick={() => handleRemoveFromCart(item.cartId)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span className="total-amount">₹{getCartTotal()}</span>
            </div>
            <button className="checkout-btn">Checkout</button>
          </div>
        )}
      </aside>

      {cart.length > 0 && !showCart && (
        <button className="floating-cart" onClick={() => setShowCart(true)}>
          <i className="fas fa-shopping-cart"></i>
          <span className="cart-count">{cart.length}</span>
        </button>
      )}
    </div>
  );
};

export default RelatedItems;
