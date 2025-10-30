import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { setToken , getToken} from "../utills/check token";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
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
            const res = await axios.post("/api/auth/google", { 
              idToken: response.credential 
            });
            // localStorage.setItem("token", res.data.token);
            setToken(res.data.token); 
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Only check email format; no other field validations
    const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email);
    if (!emailOk) {
      toast.error("Invalid email");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/auth/login", formData);
      toast.success("Login successful");

      // localStorage.setItem("token", res.data.token);

      setToken(res.data.token);
      navigate("/");
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error(err.response?.data?.message || "Please verify your email first.");
        navigate(`/verify?email=${encodeURIComponent(formData.email)}`);
      } else if (err.response?.status === 400) {
        toast.error(err.response?.data?.message || "Login failed");
      } else {
        toast.error("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 py-4">
      <div className="row justify-content-center w-100">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
          <div className="card shadow border-0">
            <div className="card-header bg-transparent py-3">
              <div className="text-center">
                <h2 className="h4 fw-bold mb-1">Welcome back</h2>
                <p className="text-muted small mb-0">Sign in to continue to Connectify</p>
              </div>
            </div>

            <div className="card-body p-3 p-md-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Email address</label>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text">📧</span>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small">Password</label>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text">🔒</span>
                    <input
                      type={showPwd ? "text" : "password"}
                      name="password"
                      className="form-control"
                      value={formData.password}
                      onChange={handleChange}
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
                      {showPwd ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-10-8-10-8a21.86 21.86 0 0 1 5.06-6.94" />
                          <path d="M1 1l22 22" />
                          <path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88" />
                          <path d="M14.12 14.12L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s3-8 11-8 11 8 11 8-3 8-11 8S1 12 1 12z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="rememberMe" disabled={loading} />
                    <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                  </div>
                  <Link className="small" to="/forgot">Forgot password?</Link>
                </div>

                <button
                  className="btn btn-primary w-100 py-2 mb-3 d-flex align-items-center justify-content-center"
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

                <div className="position-relative text-center mb-3">
                  <hr className="my-2" />
                  <span className="position-absolute top-50 start-50 translate-middle bg-white px-2 text-muted small">
                    or continue with
                  </span>
                </div>

                <div className="d-flex justify-content-center">
                  <div ref={googleBtnRef} />
                </div>

                <div className="text-center mt-3">
                  <span className="text-muted small">New here? </span>
                  <Link to="/signup" className="text-primary text-decoration-none fw-semibold small">Create an account</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;