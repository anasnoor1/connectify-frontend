import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "influencer",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextData = { ...formData, [name]: value };
    setFormData(nextData);
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldMsg = validateField(name, value, nextData);
    let nextErrors = { ...errors, [name]: fieldMsg };
    if (name === "password" || name === "confirmPassword") {
      nextErrors = {
        ...nextErrors,
        password: validateField("password", nextData.password, nextData),
        confirmPassword: validateField("confirmPassword", nextData.confirmPassword, nextData),
      };
    }
    setErrors(nextErrors);
  };

  const validateForm = () => {
    const newErrors = {
      name: validateField("name", formData.name, formData),
      email: validateField("email", formData.email, formData),
      password: validateField("password", formData.password, formData),
      confirmPassword: validateField(
        "confirmPassword",
        formData.confirmPassword,
        formData
      ),
      role: validateField("role", formData.role, formData),
    };
    setErrors(newErrors);
    setTouched({ name: true, email: true, password: true, confirmPassword: true, role: true });
    const hasError = Object.values(newErrors).some((v) => v);
    if (hasError) {
      toast.error("Please fix the highlighted errors");
      return false;
    }
    return true;
  };

  const validateField = (name, value, all) => {
    switch (name) {
      case "name":
        if (!value || !value.trim()) return "Name is required";
        if (value.trim().length < 3) return "Name must be at least 3 characters";
        if (!/^[A-Za-z ]+$/.test(value.trim())) return "Name can only contain letters and spaces";
        return "";
      case "email":
        if (!value) return "Email is required";
        const email = value.trim();
        if (email.includes(" ")) return "Email cannot contain spaces";
        // Basic format check
        if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,24}$/.test(email)) return "Enter a valid email";
        const [local, domain] = email.split("@");
        // No consecutive dots
        if (local.includes("..") || domain.includes("..")) return "Email cannot have consecutive dots";
        // Domain labels cannot start/end with hyphen and must be alphanumeric inside
        const labels = domain.split('.');
        if (labels.some(l => l.length === 0 || l.startsWith('-') || l.endsWith('-') || !/^[A-Za-z0-9-]+$/.test(l))) {
          return "Enter a valid email";
        }
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        if (!/[A-Z]/.test(value)) return "Password must include at least one uppercase letter";
        return "";
      case "confirmPassword":
        if (!value) return "Please confirm password";
        if (value !== all.password) return "Passwords do not match";
        return "";
      case "role":
        if (!value) return "Role is required";
        return "";
      default:
        return "";
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const msg = validateField(name, value, formData);
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      toast.success(res.data.message);
      navigate("/verify?email=" + formData.email);
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
    finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    const current = {
      name: validateField("name", formData.name, formData),
      email: validateField("email", formData.email, formData),
      password: validateField("password", formData.password, formData),
      confirmPassword: validateField("confirmPassword", formData.confirmPassword, formData),
      role: validateField("role", formData.role, formData),
    };
    return Object.values(current).every((v) => !v);
  };

  return (
    <div className="row justify-content-center w-100">
      <div className="col-12 col-sm-10 col-md-8 col-lg-6" style={{ maxWidth: 520 }}>
        <div className="card shadow-lg border-0 overflow-hidden" style={{ borderRadius: 16 }}>
          <div
            className="px-4 px-md-5 pt-4 pt-md-5"
            style={{
              background:
                "radial-gradient(1200px 400px at -10% -10%, rgba(124,58,237,0.25), rgba(124,58,237,0) 60%), radial-gradient(800px 300px at 120% -20%, rgba(20,20,27,0.6), rgba(20,20,27,0) 60%)",
            }}
          >
            <div className="text-center mb-3">
              <h3 className="mb-1" style={{ fontSize: 26, letterSpacing: 0.2 }}>Create your account</h3>
              <div className="text-muted small">Join Connectify in a minute</div>
            </div>
          </div>
          <div className="card-body p-4 p-md-5">
            <div className="d-flex justify-content-center gap-2 mb-3">
              <button
                type="button"
                className={`btn ${formData.role === "influencer" ? "btn-success" : "btn-outline-success"}`}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, role: "influencer" }));
                  setTouched((prev) => ({ ...prev, role: true }));
                  setErrors((prev) => ({ ...prev, role: "" }));
                }}
                aria-pressed={formData.role === "influencer"}
              >
                As an Influencer
              </button>
              <button
                type="button"
                className={`btn ${formData.role === "brand" ? "btn-info" : "btn-outline-info"}`}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, role: "brand" }));
                  setTouched((prev) => ({ ...prev, role: true }));
                  setErrors((prev) => ({ ...prev, role: "" }));
                }}
                aria-pressed={formData.role === "brand"}
              >
                As a Brand
              </button>
            </div>
            {touched.role && errors.role ? (
              <div className="text-danger small mb-2">{errors.role}</div>
            ) : null}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  className={`form-control ${touched.name && errors.name ? "is-invalid" : ""}`}
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                />
                {touched.name && errors.name ? (
                  <div className="invalid-feedback">{errors.name}</div>
                ) : null}
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                />
                {touched.email && errors.email ? (
                  <div className="invalid-feedback">{errors.email}</div>
                ) : null}
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className={`form-control ${touched.password && errors.password ? "is-invalid" : ""}`}
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-10-8-10-8a21.86 21.86 0 0 1 5.06-6.94"/>
                        <path d="M1 1l22 22"/>
                        <path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88"/>
                        <path d="M14.12 14.12L9.88 9.88"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s3-8 11-8 11 8 11 8-3 8-11 8S1 12 1 12z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                  {touched.password && errors.password ? (
                    <div className="invalid-feedback d-block">{errors.password}</div>
                  ) : null}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <div className="input-group">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    className={`form-control ${touched.confirmPassword && errors.confirmPassword ? "is-invalid" : ""}`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirm ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-10-8-10-8a21.86 21.86 0 0 1 5.06-6.94"/>
                        <path d="M1 1l22 22"/>
                        <path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88"/>
                        <path d="M14.12 14.12L9.88 9.88"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s3-8 11-8 11 8 11 8-3 8-11 8S1 12 1 12z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                  {touched.confirmPassword && errors.confirmPassword ? (
                    <div className="invalid-feedback d-block">{errors.confirmPassword}</div>
                  ) : null}
                </div>
              </div>

              

              <button className="btn btn-primary w-100 d-flex align-items-center justify-content-center py-2" type="submit" disabled={loading || !isFormValid()}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>

              <p className="mt-3 text-center mb-0">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
