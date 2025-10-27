import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();
  const googleBtnRef = useRef(null);

  useEffect(() => {
    // Load Google Sign-In script
    const loadGoogleScript = () => {
      if (document.getElementById('google-signin-script')) return;
      
      const script = document.createElement('script');
      script.id = 'google-signin-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };

    loadGoogleScript();

    // Initialize Google Sign-In when script loads
    const checkGoogle = setInterval(() => {
      if (window.google) {
        clearInterval(checkGoogle);
        initializeGoogleSignIn();
      }
    }, 100);

    return () => clearInterval(checkGoogle);
  }, [navigate]);

  const initializeGoogleSignIn = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!window.google || !clientId) return;
    
    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            const res = await axios.post("http://localhost:5000/api/auth/google", { 
              idToken: response.credential 
            });
            localStorage.setItem("token", res.data.token);
            toast.success("Logged in with Google");
            navigate("/");
          } catch (err) {
            toast.error(err.response?.data?.message || "Google login failed");
          }
        },
        context: "signin",
      });
      
      if (googleBtnRef.current) {
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "outline",
          size: "large",
          shape: "rectangular",
          width: 360,
          text: "continue_with",
          logo_alignment: "left",
        });
      }
    } catch (error) {
      console.error("Google Sign-In initialization failed:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      const msg = validateField(e.target.name, e.target.value);
      setErrors((prev) => ({ ...prev, [e.target.name]: msg }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };
    
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    
    const hasError = Object.values(newErrors).some((v) => v);
    if (hasError) {
      toast.error("Please fix the highlighted errors");
      return;
    }
    
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      toast.success("Login successful");
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error(err.response?.data?.message || "Please verify your email first.");
        navigate(`/verify?email=${encodeURIComponent(formData.email)}`);
      } else {
        toast.error(err.response?.data?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value) return "Email is required";
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) return "Enter a valid email";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";
      default:
        return "";
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const msg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: msg }));
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
              <div className="fw-bold" style={{ fontSize: 26, letterSpacing: 0.2 }}>Welcome back</div>
              <div className="text-muted small">Sign in to continue to Connectify</div>
            </div>
          </div>
          
          <div className="card-body p-4 p-md-5">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <div className="input-group">
                  <span className="input-group-text">📧</span>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={loading}
                    placeholder="you@example.com"
                  />
                </div>
                {touched.email && errors.email && (
                  <div className="invalid-feedback d-block">{errors.email}</div>
                )}
              </div>
              
              <div className="mb-3">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <span className="input-group-text">🔒</span>
                  <input
                    type={showPwd ? "text" : "password"}
                    name="password"
                    className={`form-control ${touched.password && errors.password ? "is-invalid" : ""}`}
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={loading}
                    placeholder="Your password"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPwd((v) => !v)}
                    tabIndex={-1}
                    aria-label="Toggle password visibility"
                  >
                    {showPwd ? "Hide" : "Show"}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <div className="invalid-feedback d-block">{errors.password}</div>
                )}
              </div>
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="rememberMe" disabled={loading} />
                  <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                </div>
                <Link className="small" to="#">Forgot password?</Link>
              </div>
              
              <button 
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center py-2" 
                type="submit" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
              
              <div className="text-center text-muted my-3 small">or continue with</div>
              <div className="d-flex justify-content-center">
                <div ref={googleBtnRef} />
              </div>
              
              <p className="mt-3 text-center mb-0">
                New here? <Link to="/signup">Create an account</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;