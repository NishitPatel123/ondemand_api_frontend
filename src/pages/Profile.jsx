import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { getProfile, updateProfile } from "../services/api";

export default function Profile({ isAuthenticated, setIsAuthenticated }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const BACKEND = "http://localhost:8000";

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setProfile(res.data.data);
      setForm({
        name: res.data.data.name || "",
        phone: res.data.data.phone || "",
        address: res.data.data.address || "",
      });
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      if (imageFile) formData.append("profile_image", imageFile);

      const res = await updateProfile(formData);
      if (res.data.success) {
        toast.success("Profile updated successfully!");
        setEditing(false);
        setImageFile(null);
        setPreview(null);
        fetchProfile();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          <span className="fa fa-spinner fa-spin" style={{ fontSize: "40px", color: "#4caf50" }}></span>
        </div>
        <Footer />
      </>
    );
  }

  const avatarSrc = preview
    ? preview
    : profile?.profile_image
    ? `${BACKEND}${profile.profile_image}`
    : null;

  return (
    <>
      <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />

      {/* Banner */}
      <div
        style={{
          background:
            "linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)), url(/images/banner.jpg) center/cover",
          padding: "50px 0",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div className="wrapper">
          <h2 style={{ fontSize: "32px" }}>My Profile</h2>
          <p style={{ marginTop: "8px", opacity: 0.75, fontSize: "14px" }}>
            <Link to="/" style={{ color: "#4caf50" }}>Home</Link> / My Profile
          </p>
        </div>
      </div>

      <section style={{ padding: "60px 0", background: "#f8f9fa", minHeight: "60vh" }}>
        <div className="wrapper">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "300px 1fr",
              gap: "25px",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            {/* ── Left Card ── */}
            <div
              style={{
                background: "#fff",
                borderRadius: "10px",
                padding: "30px 20px",
                boxShadow: "0 2px 15px rgba(0,0,0,0.08)",
                textAlign: "center",
              }}
            >
              <div style={{ position: "relative", display: "inline-block" }}>
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt="Profile"
                    style={{
                      width: "110px",
                      height: "110px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "4px solid #4caf50",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "110px",
                      height: "110px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#4caf50,#2e7d32)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto",
                      fontSize: "40px",
                      color: "#fff",
                      fontWeight: "700",
                    }}
                  >
                    {profile?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                {editing && (
                  <label
                    htmlFor="profile_img_upload"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      background: "#4caf50",
                      color: "#fff",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                  >
                    <span className="fa fa-camera"></span>
                    <input
                      id="profile_img_upload"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>

              <h3 style={{ color: "#2c3038", marginTop: "15px", fontSize: "20px" }}>
                {profile?.name}
              </h3>
              <p style={{ color: "#888", fontSize: "13px" }}>{profile?.email}</p>

              <span
                style={{
                  display: "inline-block",
                  marginTop: "8px",
                  padding: "3px 14px",
                  borderRadius: "12px",
                  background:
                    profile?.status === "Active" ? "#e8f5e9" : "#ffebee",
                  color:
                    profile?.status === "Active" ? "#2e7d32" : "#c62828",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {profile?.status}
              </span>

              <hr style={{ margin: "20px 0", border: "1px solid #f0f0f0" }} />

              <div style={{ textAlign: "left" }}>
                {[
                  { icon: "fa-phone", label: "Phone", value: profile?.phone },
                  { icon: "fa-map-marker", label: "Address", value: profile?.address },
                  { icon: "fa-user-circle", label: "Role", value: profile?.role },
                  {
                    icon: "fa-calendar",
                    label: "Member Since",
                    value: profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long" })
                      : "—",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      marginBottom: "12px",
                    }}
                  >
                    <span
                      className={`fa ${item.icon}`}
                      style={{ color: "#4caf50", marginTop: "2px", width: "16px" }}
                    ></span>
                    <div>
                      <p style={{ fontSize: "11px", color: "#aaa", marginBottom: "1px" }}>
                        {item.label}
                      </p>
                      <p style={{ fontSize: "14px", color: "#2c3038", fontWeight: "500" }}>
                        {item.value || "—"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "20px", display: "flex", gap: "8px", justifyContent: "center" }}>
                <Link
                  to="/my-bookings"
                  className="btn"
                  style={{ padding: "8px 16px", fontSize: "13px" }}
                >
                  My Bookings
                </Link>
              </div>
            </div>

            {/* ── Right Edit Form ── */}
            <div>
              <div
                style={{
                  background: "#fff",
                  borderRadius: "10px",
                  padding: "30px",
                  boxShadow: "0 2px 15px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "25px",
                    borderBottom: "2px solid #4caf50",
                    paddingBottom: "12px",
                  }}
                >
                  <h4 style={{ color: "#2c3038", fontSize: "18px" }}>
                    {editing ? "Edit Profile" : "Profile Information"}
                  </h4>
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      style={{
                        background: "#4caf50",
                        color: "#fff",
                        border: "none",
                        padding: "8px 18px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "13px",
                      }}
                    >
                      <span className="fa fa-edit" style={{ marginRight: "5px" }}></span>
                      Edit Profile
                    </button>
                  )}
                </div>

                {editing ? (
                  <form onSubmit={handleSubmit}>
                    {[
                      { label: "Full Name", name: "name", type: "text", placeholder: "Your full name" },
                      { label: "Phone Number", name: "phone", type: "tel", placeholder: "Your phone number" },
                      { label: "Address", name: "address", type: "text", placeholder: "Your address" },
                    ].map((field) => (
                      <div key={field.name} style={{ marginBottom: "18px" }}>
                        <label
                          style={{
                            display: "block",
                            fontWeight: "600",
                            marginBottom: "6px",
                            color: "#2c3038",
                            fontSize: "14px",
                          }}
                        >
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          name={field.name}
                          value={form[field.name]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            border: "1px solid #e0e0e0",
                            borderRadius: "4px",
                            fontSize: "14px",
                            outline: "none",
                            transition: "border-color 0.3s",
                          }}
                          onFocus={(e) => (e.target.style.borderColor = "#4caf50")}
                          onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                        />
                      </div>
                    ))}

                    {/* Read-only Email */}
                    <div style={{ marginBottom: "18px" }}>
                      <label
                        style={{
                          display: "block",
                          fontWeight: "600",
                          marginBottom: "6px",
                          color: "#2c3038",
                          fontSize: "14px",
                        }}
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profile?.email || ""}
                        disabled
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          border: "1px solid #e0e0e0",
                          borderRadius: "4px",
                          fontSize: "14px",
                          background: "#f8f9fa",
                          color: "#888",
                        }}
                      />
                      <p style={{ fontSize: "12px", color: "#aaa", marginTop: "4px" }}>
                        Email cannot be changed
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                      <button
                        type="submit"
                        className="btn"
                        disabled={saving}
                        style={{ flex: 1, padding: "12px" }}
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(false);
                          setPreview(null);
                          setImageFile(null);
                          setForm({
                            name: profile?.name || "",
                            phone: profile?.phone || "",
                            address: profile?.address || "",
                          });
                        }}
                        style={{
                          flex: 1,
                          padding: "12px",
                          background: "#f0f0f0",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    {[
                      { label: "Full Name", value: profile?.name },
                      { label: "Email Address", value: profile?.email },
                      { label: "Phone Number", value: profile?.phone },
                      { label: "Address", value: profile?.address },
                      { label: "Account Role", value: profile?.role },
                      { label: "Account Status", value: profile?.status },
                    ].map((item, i) => (
                      <div
                        key={i}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "160px 1fr",
                          gap: "10px",
                          padding: "14px 0",
                          borderBottom: "1px solid #f5f5f5",
                        }}
                      >
                        <span style={{ color: "#888", fontSize: "14px" }}>{item.label}</span>
                        <span style={{ color: "#2c3038", fontWeight: "500", fontSize: "14px" }}>
                          {item.value || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Links */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: "10px",
                  padding: "25px",
                  boxShadow: "0 2px 15px rgba(0,0,0,0.08)",
                  marginTop: "20px",
                }}
              >
                <h5 style={{ color: "#2c3038", marginBottom: "15px", fontSize: "16px" }}>
                  Quick Actions
                </h5>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <Link to="/my-bookings" style={{ padding: "10px 18px", background: "#e8f5e9", color: "#2e7d32", borderRadius: "4px", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>
                    <span className="fa fa-calendar-check-o" style={{ marginRight: "6px" }}></span>My Bookings
                  </Link>
                  <Link to="/services" style={{ padding: "10px 18px", background: "#e3f2fd", color: "#1565c0", borderRadius: "4px", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>
                    <span className="fa fa-wrench" style={{ marginRight: "6px" }}></span>Browse Services
                  </Link>
                  <Link to="/forgot-password" style={{ padding: "10px 18px", background: "#fff3e0", color: "#e65100", borderRadius: "4px", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>
                    <span className="fa fa-lock" style={{ marginRight: "6px" }}></span>Change Password
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
