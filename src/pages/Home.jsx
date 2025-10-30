// import React from "react";

// export default function Home() {
//   return (
//     <div className="row justify-content-center">
//       <div className="col-12 col-md-10 col-lg-8">
//         <div className="card shadow-sm">
//           <div className="card-body p-4">
//             <h3 className="mb-3">Home</h3>
//             <p className="mb-0">You are logged in. Welcome to Connectify.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React from 'react';
// import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Header Section */}
      <header>
        {/* Navbar Section */}
        <div id="header"></div>
      </header>

      {/* Sidebar Section */}
      <aside>
        <div id="sidebar"></div>
      </aside>

      {/* Main Content */}
      <main>
        {/* Banner Section */}
        <section className="section-banner-home bg-accent-color-4">
          <div className="hero-container overflow-visible">
            <div className="d-flex flex-column gspace-5">
              <div className="row row-cols-md-2 row-cols-1 grid-spacer-md-1 grid-spacer-2 overflow-hidden">
                <div className="col col-md-8">
                  <h1 className="animate-box animate__animated" data-animate="animate__fadeInLeft">
                    Transforming Talent into <span className="heading-wrapper">Influence</span>
                  </h1>
                </div>
                <div className="col col-md-4">
                  <div className="d-flex flex-column justify-content-end h-100 gspace-3">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ornare nisl aliquam ut consectetur maecenas eros. Efficitur consectetur sed mi lectus odio morbi.</p>
                    <div className="d-flex flex-row gspace-3">
                      <a href="/about" className="btn btn-accent">Discover More</a>
                      <div className="link-wrapper">
                        <a href="/talent">Meet Our Talent</a>
                        <i className="fa-solid fa-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="banner-home">
                <div className="spacer"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Partner Section */}
        <section className="section-partner">
          <div className="hero-container">
            <div className="d-flex flex-column gspace-4 justify-content-center text-center">
              <h3 className="animate-box animate__animated" data-animate="animate__fadeInUp">
                Our Partners in Success, The Brands Behind <span className="heading-wrapper">the Stars</span>
              </h3>
              <div className="overflow-hidden">
                <div className="swiper swiperPartner">
                  <div className="swiper-wrapper">
                    {[49, 52, 50, 51, 40, 47].map((num, index) => (
                      <div key={index} className="swiper-slide">
                        <img src={`/images/logo-${num}.png`} alt={`Partner ${index + 1}`} className="img-fluid" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="section">
          <div className="hero-container">
            <div className="d-flex flex-column gspace-3">
              <div className="d-flex flex-column flex-md-row gspace-md-0 gspace-2">
                <div className="heading-wrapper-title">
                  <div className="row row-cols-xl-2 row-cols-1 gx-0 gy-3">
                    <div className="col col-xl-4">
                      <h4 className="accent-color">// About Us</h4>
                    </div>
                    <div className="col col-xl-8 overflow-hidden">
                      <h2 className="animate-box animate__animated" data-animate="animate__fadeInLeft">
                        Pioneering the Future of Talent and Influence Together
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="heading-wrapper-link">
                  <a href="/about" className="btn btn-accent">More About Us</a>
                </div>
              </div>
              <div className="row row-cols-xl-8 row-cols-1 grid-spacer-4">
                <div className="col col-xl-4">
                  <div className="image-container">
                    <img src="/images/dummy-img-600x400.jpg" alt="About Img" className="img-fluid" />
                  </div>
                </div>
                <div className="col col-xl-8">
                  <div className="d-flex flex-column gspace-2">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Class nullam nam egestas convallis integer penatibus lobortis. Varius magna semper primis ut auctor justo lacus dictum morbi. Mauris luctus scelerisque velit pulvinar ligula sed dolor integer. Et blandit tortor curae vitae quis ipsum non.</p>
                    <div className="about-qoute">
                      <p>“Leo enim hendrerit dolor enim hac augue. Senectus ullamcorper mollis posuere fringilla sit velit. Nisl velit etiam per mus cursus suscipit habitasse vivamus viverra.”</p>
                    </div>
                    <div className="row row-cols-md-2 row-cols-1">
                      <div className="col col-md-5">
                        <ul className="check-list">
                          <li>Montes class leo maecena</li>
                          <li>Aenean in varius ante nibh</li>
                          <li>Volutpat porta neque primis</li>
                          <li>Etiam sit amet cursus arcu</li>
                        </ul>
                      </div>
                      <div className="col col-md-7">
                        <div className="d-flex flex-column flex-md-row gspace-3 w-100 justify-content-between">
                          <div className="card card-accent card-counter">
                            <div className="d-flex flex-row align-items-center">
                              <span className="counter" data-target="12"></span>
                              <span className="counter-detail">+</span>
                            </div>
                            <h6 className="font-1">Years of Experience</h6>
                          </div>
                          <div className="card card-accent card-counter">
                            <div className="d-flex flex-row align-items-center">
                              <span className="counter" data-target="270"></span>
                              <span className="counter-detail">+</span>
                            </div>
                            <h6 className="font-1">Creative Talents</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Section */}
        <section className="section bg-accent-color-4">
          <div className="hero-container">
            <div className="d-flex flex-column gspace-5">
              <div className="d-flex flex-column flex-md-row gspace-md-0 gspace-2">
                <div className="heading-wrapper-title">
                  <div className="row row-cols-xl-2 row-cols-1 gx-0 gy-3">
                    <div className="col col-xl-4">
                      <h4 className="accent-color">// What We Do</h4>
                    </div>
                    <div className="col col-xl-8 overflow-hidden">
                      <h2 className="animate-box animate__animated" data-animate="animate__fadeInLeft">
                        Tailored Solutions for Talent and Influence
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="heading-wrapper-text">
                  <p>Sed ac suscipit tellus, a volutpat erat. Proin sit amet fermentum massa. Cras tincidunt cursus auctor.</p>
                </div>
              </div>
              <div className="row row-cols-xl-2 row-cols-1 grid-spacer-3">
                <div className="col col-xl-4">
                  <div className="card card-service talent-management">
                    <div className="card card-service-wrapper">
                      <div className="card card-service-content">
                        <h3 className="accent-color-3">Talent Management</h3>
                        <div className="underline-1"></div>
                        <p className="accent-color-3">
                          Sed velit magna, dictum sit amet ante eu, tristique tempor ex. Phasellus neque enim nunc, ultrices eget bibendum id, semper ut elit.  
                        </p>
                        <div className="link-wrapper">
                          <a href="/service_detail">Learn More</a>
                          <i className="fa-solid fa-arrow-right"></i>
                        </div>
                        <div className="spacer"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col col-xl-8">
                  <div className="row row-cols-md-2 row-cols-1 overflow-hidden">
                    <div className="col">
                      <div className="d-flex flex-column gspace-3 h-100 overflow-hidden">
                        <div className="card card-service influencer-marketing animate-box animate__animated" data-animate="animate__fadeInLeft">
                          <div className="card-service-wrapper">
                            <div className="card-service-content">
                              <h3 className="accent-color-3">Influencer Marketing</h3>
                              <div className="underline-1"></div>
                              <p className="accent-color-3">
                                Sed velit magna, dictum sit amet ante eu, tristique tempor ex. Phasellus neque enim nunc, ultrices eget bibendum id, semper ut elit.  
                              </p>
                              <div className="link-wrapper">
                                <a href="/service_detail">Learn More</a>
                                <i className="fa-solid fa-arrow-right"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card card-service brand-partnership animate-box animate__animated" data-animate="animate__fadeInRight">
                          <div className="card-service-wrapper">
                            <div className="card-service-content">
                              <h3 className="accent-color-3">Brand Partnership</h3>
                              <div className="underline-1"></div>
                              <p className="accent-color-3">
                                Sed velit magna, dictum sit amet ante eu, tristique tempor ex. Phasellus neque enim nunc, ultrices eget bibendum id, semper ut elit.  
                              </p>
                              <div className="link-wrapper">
                                <a href="/service_detail">Learn More</a>
                                <i className="fa-solid fa-arrow-right"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="d-flex flex-column gspace-3 h-100">
                        <div className="card card-service content-strategy animate-box animate__animated" data-animate="animate__fadeInLeft">
                          <div className="card-service-wrapper">
                            <div className="card-service-content">
                              <h3 className="accent-color-3">Content Strategy</h3>
                              <div className="underline-1"></div>
                              <p className="accent-color-3">
                                Sed velit magna, dictum sit amet ante eu, tristique tempor ex. Phasellus neque enim nunc, ultrices eget bibendum id, semper ut elit.  
                              </p>
                              <div className="link-wrapper">
                                <a href="/service_detail">Learn More</a>
                                <i className="fa-solid fa-arrow-right"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card card-accent service-cta flex-grow-1">
                          <div className="icon-circle">
                            <i className="fa-solid fa-arrow-right"></i>
                          </div>
                          <h3 className="accent-color-3">Ready to elevate your brand? Let's make it happen with us!</h3>
                          <p className="accent-color-3">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Add other sections here */}
      </main>
    </div>
  );
};

export default Home;
