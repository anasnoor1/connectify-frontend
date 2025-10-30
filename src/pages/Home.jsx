import React from "react";

export default function Home() {
  return (
    <div className="row justify-content-center">
      <div className="col-12 col-xl-10">
        {/* Hero Section */}
        <div className="glass-card p-5 mb-5">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="display-5 fw-bold mb-3">
                Welcome to <span className="text-gradient">Connectify</span>
              </h1>
              <p className="lead text-muted mb-4">
                The premier platform connecting innovative brands with authentic influencers 
                to create meaningful collaborations that drive real results.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <button className="btn btn-primary px-4">
                  Explore Collaborations
                </button>
                <button className="btn btn-outline-primary px-4">
                  View Analytics
                </button>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="position-relative">
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mx-auto"
                     style={{ width: '120px', height: '120px' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div className="position-absolute top-0 start-50 translate-middle-x w-100 h-100">
                  <div className="rounded-circle w-100 h-100 mx-auto" 
                       style={{ 
                         background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)',
                         animation: 'pulse 3s infinite'
                       }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="row mb-5">
          <div className="col-md-4 mb-4">
            <div className="glass-card p-4 text-center h-100">
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                   style={{ width: '60px', height: '60px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="h4 fw-bold">1,200+</h3>
              <p className="text-muted mb-0">Active Influencers</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="glass-card p-4 text-center h-100">
              <div className="bg-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                   style={{ width: '60px', height: '60px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <h3 className="h4 fw-bold">500+</h3>
              <p className="text-muted mb-0">Brand Partners</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="glass-card p-4 text-center h-100">
              <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                   style={{ width: '60px', height: '60px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className="h4 fw-bold">2,500+</h3>
              <p className="text-muted mb-0">Successful Campaigns</p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="row">
          <div className="col-12">
            <h2 className="h3 fw-bold mb-4">Why Choose Connectify?</h2>
          </div>
          <div className="col-md-6 mb-4">
            <div className="glass-card p-4 h-100">
              <div className="d-flex align-items-start gap-3">
                <div className="bg-primary rounded p-2 flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div>
                  <h4 className="h5 fw-bold mb-2">Verified Profiles</h4>
                  <p className="text-muted mb-0">
                    All influencers and brands are thoroughly verified to ensure authentic collaborations.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="glass-card p-4 h-100">
              <div className="d-flex align-items-start gap-3">
                <div className="bg-success rounded p-2 flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="h5 fw-bold mb-2">Smart Matching</h4>
                  <p className="text-muted mb-0">
                    AI-powered algorithm connects you with the perfect partners for your campaign goals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}