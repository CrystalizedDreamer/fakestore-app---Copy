
import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { addToCart } from '../store';
import { useQuery } from '@tanstack/react-query';
import ProductDetailsModal from './ProductDetailsModal';
import EditProductModal from './EditProductModal';
import DeleteConfirmModal from './DeleteConfirmModal';



// Products component displays the list of products and handles product modals and cart actions
function Products() {
  // Redux dispatch for cart actions
  const dispatch = useDispatch();
  // State for delete confirmation modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // State for edit success message
  const [editMessage, setEditMessage] = useState("");
  // State for product details modal
  const [modalProduct, setModalProduct] = useState(null);
  // State for editing a product
  const [editProduct, setEditProduct] = useState(null);
  // State for the edit product form
  const [editForm, setEditForm] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    image: "",
  });

  // React Query for products
  // Fetch products from API using React Query
  const { data: products = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      // Fetch product data from fakestoreapi
      const res = await fetch("https://fakestoreapi.com/products");
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
  });

  // Clear edit message after 3 seconds
  React.useEffect(() => {
    if (editMessage) {
      const timer = setTimeout(() => setEditMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [editMessage]);

  // Show loading indicator while products are being fetched
  if (loading) return <div id="loading">Loading...</div>;

  return (
    <div className="container my-4">
      {/* Show edit success message if present */}
      {editMessage && (
        <div className="alert alert-success text-center" role="alert">
          {editMessage}
        </div>
      )}
      <div className="row">
        {/* Render each product card */}
        {products.map((product) => (
          <div
            className="col-12 col-sm-6 col-md-3 mb-4 mt-4 pt-2 pb-2"
            key={product.id}
          >
            <div className="card h-100" id="productCard">
              <img
                src={product.image}
                className="card-img-top"
                alt={product.title}
              />
              <div className="cardBody">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">${product.price}</p>
                <p className="card-text">{product.category}</p>
                <p className="card-text" style={{ fontSize: "0.9em" }}>
                  {product.description.substring(0, 80)}...
                </p>
                <div className="d-flex flex-column gap-2 mt-auto">
                  {/* Open edit modal and populate form with product data */}
                  <button
                    className="btn btn-outline-warning w-100"
                    onClick={() => {
                      setEditProduct(product);
                      setEditForm({
                        title: product.title,
                        price: product.price,
                        category: product.category,
                        description: product.description,
                        image: product.image,
                      });
                    }}
                  >
                    Edit
                  </button>
                  {/* Open product details modal */}
                  <button
                    className="btn btn-outline-secondary btn-sm w-100"
                    onClick={() => setModalProduct(product)}
                  >
                    Details
                  </button>
                  {/* Add product to cart using Redux */}
                  <button
                    className="btn btn-primary btn-sm w-100"
                    onClick={() => dispatch(addToCart(product))}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Product Details Modal */}
      {/* Product Details Modal */}
      <ProductDetailsModal product={modalProduct} onClose={() => setModalProduct(null)} />
      {/* Edit Product Modal */}
      {/* Edit Product Modal with update logic */}
      <EditProductModal
        editProduct={editProduct}
        editForm={editForm}
        setEditForm={setEditForm}
        onClose={() => setEditProduct(null)}
        onDelete={() => setShowDeleteConfirm(true)}
        onSubmit={async (e) => {
          // Handle product update
          e.preventDefault();
          try {
            await fetch(
              `https://fakestoreapi.com/products/${editProduct.id}`,
              {
                method: "PUT",
                body: JSON.stringify({
                  ...editForm,
                  price: parseFloat(editForm.price),
                }),
                headers: { "Content-Type": "application/json" },
              }
            );
            setEditProduct(null);
            setEditForm({
              title: "",
              price: "",
              category: "",
              description: "",
              image: "",
            });
            setEditMessage("Product updated successfully!");
            refetch();
          } catch {
            alert("Error updating product.");
          }
        }}
      />
      {/* Delete Confirm Modal */}
      {/* Delete Confirm Modal with delete logic */}
      <DeleteConfirmModal
        show={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onDelete={async () => {
          // Handle product delete
          try {
            await fetch(
              `https://fakestoreapi.com/products/${editProduct.id}`,
              { method: "DELETE" }
            );
            setEditProduct(null);
            setEditMessage("Product deleted successfully!");
            refetch();
          } catch {
            alert("Error deleting product.");
          }
          setShowDeleteConfirm(false);
        }}
      />
    </div>
  );
}

export default Products;
