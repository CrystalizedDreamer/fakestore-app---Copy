
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import  { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import React from 'react';     
import Products from './components/products.jsx'; 
import AddProducts  from './components/addProducts.jsx';
import Home from './components/home.jsx';


function App() {

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

          </div>
        </nav>

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
