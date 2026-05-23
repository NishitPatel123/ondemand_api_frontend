import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { getServices, getCategories } from "../services/api";

export default function Services({ isAuthenticated, setIsAuthenticated }) {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchParams] = useSearchParams();
  const BACKEND = "http://localhost:8000";

  useEffect(() => {
    const catId = searchParams.get("category_id") || "";
    setSelectedCat(catId);
    fetchData(catId);
    getCategories()
      .then((r) => setCategories(r.data.data || []))
      .catch(console.error);
  }, [searchParams]);

  const fetchData = async (catId = selectedCat) => {
    setLoading(true);
    try {
      const params = {};
      if (catId) params.category_id = catId;
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;
      const res = await getServices(params);
      setServices(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchData(selectedCat);
  };

  const handleCatChange = (catId) => {
    setSelectedCat(catId);
    fetchData(catId);
  };

  const filtered = services.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase()) ||
      s.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />

      {/* Inner Banner */}
      <section className="w3l-inner-banner">
        <div
          style={{
            background:
              "linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)), url(/images/banner.jpg) center/cover",
            padding: "60px 0",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <div className="wrapper">
            <h2 style={{ fontSize: "36px", fontWeight: "700" }}>Our Services</h2>
            <p style={{ marginTop: "10px", opacity: 0.85 }}>
              Browse and book from our wide range of professional home services
            </p>
            <p style={{ marginTop: "5px", opacity: 0.7, fontSize: "14px" }}>
              <Link to="/" style={{ color: "#4caf50" }}>
                Home
              </Link>{" "}
              / Services
            </p>
          </div>
        </div>
      </section>

      <section className="w3l-features-7" style={{ padding: "50px 0" }}>
        <div className="wrapper">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "260px 1fr",
              gap: "30px",
            }}
          >
            {/* ── Sidebar Filters ── */}
            <aside>
              {/* Search */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: "8px",
                  padding: "20px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                  marginBottom: "20px",
                }}
              >
                <h5
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#2c3038",
                    marginBottom: "12px",
                    borderBottom: "2px solid #4caf50",
                    paddingBottom: "8px",
                  }}
                >
                  Search Services
                </h5>
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                    outline: "none",
                    fontSize: "14px",
                  }}
                />
              </div>

              {/* Categories */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: "8px",
                  padding: "20px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                  marginBottom: "20px",
                }}
              >
                <h5
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#2c3038",
                    marginBottom: "12px",
                    borderBottom: "2px solid #4caf50",
                    paddingBottom: "8px",
                  }}
                >
                  Categories
                </h5>
                <ul style={{ padding: 0, margin: 0 }}>
                  <li
                    onClick={() => handleCatChange("")}
                    style={{
                      padding: "8px 0",
                      cursor: "pointer",
                      color: selectedCat === "" ? "#4caf50" : "#555",
                      fontWeight: selectedCat === "" ? "600" : "400",
                      fontSize: "14px",
                      borderBottom: "1px solid #f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span className="fa fa-th-large"></span> All Categories
                  </li>
                  {categories.map((cat) => (
                    <li
                      key={cat._id}
                      onClick={() => handleCatChange(cat._id)}
                      style={{
                        padding: "8px 0",
                        cursor: "pointer",
                        color: selectedCat === cat._id ? "#4caf50" : "#555",
                        fontWeight: selectedCat === cat._id ? "600" : "400",
                        fontSize: "14px",
                        borderBottom: "1px solid #f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span className="fa fa-wrench" style={{ fontSize: "12px" }}></span>
                      {cat.name}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price filter */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: "8px",
                  padding: "20px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                }}
              >
                <h5
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#2c3038",
                    marginBottom: "12px",
                    borderBottom: "2px solid #4caf50",
                    paddingBottom: "8px",
                  }}
                >
                  Price Range (₹)
                </h5>
                <form onSubmit={handleFilter}>
                  <input
                    type="number"
                    placeholder="Min price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #e0e0e0",
                      borderRadius: "4px",
                      marginBottom: "8px",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Max price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #e0e0e0",
                      borderRadius: "4px",
                      marginBottom: "12px",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                  <button
                    type="submit"
                    className="btn"
                    style={{ width: "100%", padding: "10px" }}
                  >
                    Apply Filter
                  </button>
                  {(minPrice || maxPrice || selectedCat) && (
                    <button
                      type="button"
                      onClick={() => {
                        setMinPrice("");
                        setMaxPrice("");
                        setSelectedCat("");
                        fetchData("");
                      }}
                      style={{
                        width: "100%",
                        padding: "8px",
                        marginTop: "8px",
                        background: "none",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "13px",
                        color: "#888",
                      }}
                    >
                      Clear Filters
                    </button>
                  )}
                </form>
              </div>
            </aside>

            {/* ── Services Grid ── */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h4 style={{ color: "#2c3038" }}>
                  {filtered.length} Service{filtered.length !== 1 ? "s" : ""} Found
                </h4>
              </div>

              {loading ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <span
                    className="fa fa-spinner fa-spin"
                    style={{ fontSize: "40px", color: "#4caf50" }}
                  ></span>
                  <p style={{ marginTop: "15px", color: "#888" }}>
                    Loading services...
                  </p>
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <span
                    className="fa fa-search"
                    style={{ fontSize: "50px", color: "#ccc" }}
                  ></span>
                  <h4 style={{ color: "#888", marginTop: "15px" }}>
                    No services found
                  </h4>
                  <p style={{ color: "#aaa" }}>
                    Try adjusting your filters or search term
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(230px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {filtered.map((svc) => (
                    <div
                      key={svc._id}
                      style={{
                        background: "#fff",
                        borderRadius: "8px",
                        overflow: "hidden",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                        transition: "transform 0.3s, box-shadow 0.3s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 8px 20px rgba(76,175,80,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.08)";
                      }}
                    >
                      <Link to={`/service/${svc._id}`}>
                        <img
                          src={svc.image ? `${BACKEND}${svc.image}` : "/images/cleaning.jpg"}
                          alt={svc.name}
                          style={{ width: "100%", height: "170px", objectFit: "cover" }}
                          onError={(e) => { e.target.src = "/images/cleaning.jpg"; }}
                        />
                      </Link>
                      <div style={{ padding: "16px" }}>
                        {svc.category?.name && (
                          <span
                            style={{
                              fontSize: "11px",
                              background: "#e8f5e9",
                              color: "#4caf50",
                              padding: "2px 8px",
                              borderRadius: "12px",
                              fontWeight: "600",
                            }}
                          >
                            {svc.category.name}
                          </span>
                        )}
                        <h5 style={{ marginTop: "8px", marginBottom: "6px" }}>
                          <Link
                            to={`/service/${svc._id}`}
                            style={{ color: "#2c3038", fontWeight: "600", fontSize: "15px" }}
                          >
                            {svc.name}
                          </Link>
                        </h5>
                        <p style={{ color: "#888", fontSize: "13px", lineHeight: "1.5", marginBottom: "12px" }}>
                          {svc.description?.slice(0, 80)}...
                        </p>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <strong style={{ color: "#4caf50", fontSize: "18px" }}>
                            ₹{svc.price}
                          </strong>
                          <Link
                            to={`/service/${svc._id}`}
                            className="btn"
                            style={{
                              padding: "6px 16px",
                              fontSize: "13px",
                              display: "inline-block",
                            }}
                          >
                            Book Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
