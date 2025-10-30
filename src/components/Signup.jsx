import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Signup = () => {
  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "influencer",
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  if (token) {
    return <Navigate to="/" replace />;
  }

  const SignupSchema = Yup.object({
    name: Yup.string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .matches(/^[A-Za-z ]+$/, "Name can only contain letters and spaces")
      .required("Name is required"),
    email: Yup.string().email("Enter a valid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .matches(/[A-Z]/, "Password must include at least one uppercase letter")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords do not match")
      .required("Please confirm password"),
    role: Yup.string().oneOf(["influencer", "brand"], "Role is required").required("Role is required"),
  });

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 py-4">
      <div className="row justify-content-center w-100">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
          <div className="card shadow border-0">
            <div className="card-header bg-transparent py-3">
              <div className="text-center">
                <h2 className="h4 fw-bold mb-1">Create your account</h2>
                <p className="text-muted small mb-0">Join Connectify community</p>
              </div>
            </div>
            
            <div className="card-body p-3 p-md-4">
              <Formik
                initialValues={initialValues}
                validationSchema={SignupSchema}
                validateOnChange
                validateOnBlur
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    setLoading(true);
                    const res = await axios.post("/api/auth/register", values);
                    toast.success(res.data.message);
                    navigate("/verify?email=" + values.email);
                  } catch (err) {
                    toast.error(err.response?.data?.message || "Signup failed");
                  } finally {
                    setLoading(false);
                    setSubmitting(false);
                  }
                }}
              >
                {({ values, setFieldValue, isSubmitting, isValid }) => (
                  <Form>
                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <button
                          type="button"
                          className={`btn w-100 ${values.role === "influencer" ? "btn-primary" : "btn-outline-primary"}`}
                          onClick={() => setFieldValue("role", "influencer")}
                        >
                          Influencer
                        </button>
                      </div>
                      <div className="col-6">
                        <button
                          type="button"
                          className={`btn w-100 ${values.role === "brand" ? "btn-primary" : "btn-outline-primary"}`}
                          onClick={() => setFieldValue("role", "brand")}
                        >
                          Brand
                        </button>
                      </div>
                    </div>
                    
                    <ErrorMessage name="role" component="div" className="text-danger small text-center mb-2" />
                    
                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Full Name</label>
                      <Field name="name">
                        {({ field, meta, form }) => (
                          <>
                            <input
                              {...field}
                              type="text"
                              className={`form-control form-control-sm ${meta.touched && meta.error ? 'is-invalid' : ''}`}
                              disabled={loading}
                              placeholder="Enter your full name"
                              onChange={(e) => { field.onChange(e); form.setFieldTouched(field.name, true, false); }}
                            />
                            {meta.touched && meta.error ? (
                              <div className="invalid-feedback d-block">{meta.error}</div>
                            ) : null}
                          </>
                        )}
                      </Field>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Email address</label>
                      <Field name="email">
                        {({ field, meta, form }) => (
                          <>
                            <input
                              {...field}
                              type="email"
                              className={`form-control form-control-sm ${meta.touched && meta.error ? 'is-invalid' : ''}`}
                              disabled={loading}
                              placeholder="Enter your email"
                              onChange={(e) => { field.onChange(e); form.setFieldTouched(field.name, true, false); }}
                            />
                            {meta.touched && meta.error ? (
                              <div className="invalid-feedback d-block">{meta.error}</div>
                            ) : null}
                          </>
                        )}
                      </Field>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Password</label>
                      <div className="input-group input-group-sm">
                        <Field name="password">
                          {({ field, meta, form }) => (
                            <input
                              {...field}
                              type={showPassword ? 'text' : 'password'}
                              className={`form-control ${meta.touched && meta.error ? 'is-invalid' : ''}`}
                              disabled={loading}
                              placeholder="Create a password"
                              onChange={(e) => { field.onChange(e); form.setFieldTouched(field.name, true, false); }}
                            />
                          )}
                        </Field>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowPassword((v) => !v)}
                        >
                          <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                        </button>
                      </div>
                      <ErrorMessage name="password" component="div" className="invalid-feedback d-block" />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Confirm Password</label>
                      <div className="input-group input-group-sm">
                        <Field name="confirmPassword">
                          {({ field, meta, form }) => (
                            <input
                              {...field}
                              type={showConfirm ? 'text' : 'password'}
                              className={`form-control ${meta.touched && meta.error ? 'is-invalid' : ''}`}
                              disabled={loading}
                              placeholder="Confirm your password"
                              onChange={(e) => { field.onChange(e); form.setFieldTouched(field.name, true, false); }}
                            />
                          )}
                        </Field>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowConfirm((v) => !v)}
                        >
                          <i className={`bi bi-eye${showConfirm ? '-slash' : ''}`}></i>
                        </button>
                      </div>
                      <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback d-block" />
                    </div>

                    <button 
                      className="btn btn-primary w-100 py-2 mb-3 d-flex align-items-center justify-content-center" 
                      type="submit" 
                      disabled={loading || isSubmitting || !isValid}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </button>

                    <div className="position-relative text-center mb-3">
                      <hr className="my-2" />
                      <span className="position-absolute top-50 start-50 translate-middle bg-white px-2 text-muted small">
                        or continue with
                      </span>
                    </div>

                    <div className="mb-3">
                      <button type="button" className="btn btn-outline-secondary w-100 btn-sm d-flex align-items-center justify-content-center" disabled>
                        <i className="bi bi-google me-2"></i>
                        Continue with Google
                      </button>
                    </div>

                    <div className="text-center">
                      <span className="text-muted small">Already have an account? </span>
                      <Link to="/login" className="text-primary text-decoration-none fw-semibold small">Sign in</Link>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;