
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import  { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import React from 'react';     
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, incrementQuantity, decrementQuantity } from './store';
import Products from './components/products.jsx'; 
import AddProducts  from './components/addProducts.jsx';
import Home from './components/home.jsx';



function App() {
  // State to control cart modal visibility
  const [showCart, setShowCart] = React.useState(false);
  // Use Redux for cart state and actions
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();
  // Calculate total price
  const total = cart.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0);
  // Calculate total quantity of items in cart
  const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <>
      <Router>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/products">Products</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/add-products">Add Products</Link>
              </li>
            </ul>
            <button className="btn btn-success ms-auto" onClick={() => setShowCart(true)}>
              View Cart ({totalQuantity})
            </button>
          </div>
        </nav>

        {/* Cart Modal */}
        {showCart && (
          <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Your Cart</h5>
                  <button type="button" className="btn-close" onClick={() => setShowCart(false)}></button>
                </div>
                <div className="modal-body">
                  {cart.length === 0 ? (
                    <div>Your cart is empty.</div>
                  ) : (
                    <ul className="list-group mb-3">
                  {cart.map((item, idx) => (
                    <li key={item.id + '-' + idx} className="list-group-item d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <img src={item.image} alt={item.title} style={{ width: 50, height: 50, objectFit: 'contain', marginRight: 10 }} />
                        <div>
                          <strong>{item.title}</strong> <span className="text-muted">${item.price}</span>
                          <div className="input-group input-group-sm mt-2" style={{ maxWidth: 120 }}>
                            <button className="btn btn-outline-secondary" onClick={() => dispatch(decrementQuantity(item.id))}>-</button>
                            <input type="text" className="form-control text-center" value={item.quantity || 1} readOnly style={{ width: 40 }} />
                            <button className="btn btn-outline-secondary" onClick={() => dispatch(incrementQuantity(item.id))}>+</button>
                          </div>
                        </div>
                      </div>
                      <button className="btn btn-danger btn-sm" onClick={() => dispatch(removeFromCart(item.id))}>
                        Remove
                      </button>
                    </li>
                  ))}
                    </ul>
                  )}
                  <div className="mt-3 text-end">
                    <strong>Total: ${total.toFixed(2)}</strong>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowCart(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/add-products" element={<AddProducts />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
