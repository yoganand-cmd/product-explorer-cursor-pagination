import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://product-explorer-cursor-pagination.onrender.com";

function App() {
  const [products, setProducts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = [
    "",
    "Electronics",
    "Books",
    "Clothing",
    "Home",
    "Sports",
    "Toys",
    "Beauty",
    "Grocery",
  ];

  const loadProducts = async (reset = false) => {
    try {
      setLoading(true);

      let url = `${API_URL}/products?limit=20`;

      if (category) {
        url += `&category=${category}`;
      }

      if (!reset && cursor) {
        url += `&created_at=${encodeURIComponent(
          cursor.created_at
        )}&id=${cursor.id}`;
      }

      const response = await axios.get(url);

      if (reset) {
        setProducts(response.data.data);
      } else {
        setProducts((prev) => [...prev, ...response.data.data]);
      }

      setCursor(response.data.nextCursor);
    } catch (error) {
      console.error(error);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setProducts([]);
    setCursor(null);

    setTimeout(() => {
      loadProducts(true);
    }, 0);
  }, [category]);

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <h1>Products Explorer</h1>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{
          padding: "10px",
          marginBottom: "20px",
          width: "250px",
        }}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat || "All Categories"}
          </option>
        ))}
      </select>

      {products.map((product) => (
        <div
          key={product.id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "8px",
          }}
        >
          <h3>{product.name}</h3>

          <p>
            <strong>Category:</strong> {product.category}
          </p>

          <p>
            <strong>Price:</strong> ₹{product.price}
          </p>

          <small>ID: {product.id}</small>
        </div>
      ))}

      <button
        onClick={() => loadProducts()}
        disabled={loading}
        style={{
          padding: "12px 20px",
          cursor: "pointer",
        }}
      >
        {loading ? "Loading..." : "Load More"}
      </button>
    </div>
  );
}

export default App;