import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, MapPin, Star, ArrowRight, Handshake, TrendingUp, Shield } from 'lucide-react';

const Home = () => {
  const stats = [
    { number: '10,000+', label: 'Active Workers', icon: Users },
    { number: '5,000+', label: 'Jobs Posted', icon: Briefcase },
    { number: '500+', label: 'Locations', icon: MapPin },
    { number: '4.8/5', label: 'User Rating', icon: Star }
  ];

  const features = [
    {
      icon: Handshake,
      title: 'Direct Connection',
      description: 'Connect directly with farmers and workers without intermediaries'
    },
    {
      icon: Shield,
      title: 'Verified Profiles',
      description: 'All users are verified to ensure trustworthy connections'
    },
    {
      icon: TrendingUp,
      title: 'Fair Wages',
      description: 'Transparent wage system ensuring fair compensation for all'
    }
  ];
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f0fff4, #ffffff, #e6f7ff)' }}>
      
      {/* Header Section */}
<section style={{
    background: 'linear-gradient(to right, #2f855a, #276749, #22543d)',
    position: 'relative',
    overflow: 'hidden',
    padding: '6rem 0',
  }}
>
  <div
    className="container d-flex align-items-center justify-content-between position-relative text-white flex-column flex-sm-row"
  >
    <img
      src="/Agro2.png"
      alt="AgroConnectMitr Logo"
      style={{ height: '200px', width: 'auto', marginBottom: '1rem' }}
    />
    <div className="text-center text-sm-start">
      <h1 className="display-3 fw-bold">
        AgroConnect{' '}
        <span
          style={{
            background: 'linear-gradient(to right, #f6e05e, #ed8936)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Mitr
        </span>
      </h1>
      <p className="lead mt-4">
        Bridging the gap between farmers and agricultural workers across India.
        Find work, hire talent, grow together.
      </p>
      <div className="d-flex flex-column flex-sm-row justify-content-start gap-3 mt-4">
        <button className="btn btn-light fw-semibold px-4 py-2">
          Find Workers
        </button>
        <button className="btn btn-outline-light fw-semibold px-4 py-2">
          Find Jobs
        </button>
      </div>
    </div>
  </div>
</section>
      {/* Stats Section */}
      <section className="py-5 bg-white d-flex justify-content-center align-items-center" style={{gap:'4px'}}>
        <div className="container">
          <div className="row text-start" >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="col-6 col-md-3 mb-4">
                  <div className="mb-3 d-flex align-items-center justify-content-center rounded-circle" style={{ width: 64, height: 64, background: 'green' }}>
                    <Icon size={32} color="#fff" />
                  </div>
                  <h3>{stat.number}</h3>
                  <p className="text-muted">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ background: 'linear-gradient(to bottom right, #f8f9fa, #e6ffed)', padding: '4rem 0' }}>
        <div className="container text-center">
          <h2 className="fw-bold mb-3">Why Choose AgroConnect Mitr?</h2>
          <p className="lead text-muted mb-5">We're revolutionizing agricultural employment with technology and trust</p>
          <div className="row">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="col-md-4 mb-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                      <div className="mb-4 mx-auto d-flex align-items-center justify-content-center rounded" style={{ width: 64, height: 64, background: 'linear-gradient(to bottom right, #38a169, #2f855a)' }}>
                        <Icon size={32} color="#fff" />
                      </div>
                      <h5 className="card-title fw-bold">{feature.title}</h5>
                      <p className="card-text text-muted">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* How It Works Section */}
      <section className="py-5 bg-white">
        <div className="container text-center">
          <h2 className="fw-bold mb-3">How It Works</h2>
          <p className="text-muted mb-5">Simple steps to connect and grow</p>
          <div className="row">
            {['Create Profile', 'Connect', 'Work Together'].map((title, i) => {
              const colors = ['#4299e1', '#38a169', '#ed8936'];
              const descriptions = [
                'Register as a farmer or worker with your details and requirements',
                'Search and connect with verified farmers or skilled workers',
                'Start working together and build lasting agricultural partnerships'
              ];
              return (
                <div key={i} className="col-md-4 mb-4">
                  <div className="mb-4 mx-auto d-flex align-items-center justify-content-center rounded-circle" style={{ width: 80, height: 80, background: colors[i], color: 'white', fontSize: 24, fontWeight: 'bold' }}>
                    {i + 1}
                  </div>
                  <h5 className="fw-bold">{title}</h5>
                  <p className="text-muted">{descriptions[i]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section style={{ background: 'linear-gradient(to right, #f6ad55, #f56565)', padding: '4rem 0' }}>
        <div className="container text-center text-white">
          <h2 className="fw-bold mb-3">Ready to Transform Agriculture?</h2>
          <p className="lead mb-4">Join thousands of farmers and workers building the future of agriculture together</p>
          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
              <button className="btn btn-outline-light px-4 py-2 fw-semibold">
                <Link to="/register" className="text-white text-decoration-none"> Join as Farmer</Link></button> 
            <button className="btn btn-outline-light px-4 py-2 fw-semibold">
              <Link to="/workerregister"className="text-white text-decoration-none"> Join as Worker</Link></button>
            <button className="btn btn-outline-light px-4 py-2 fw-semibold">
         <Link to="/about" className="text-white text-decoration-none"> Learn More
 </Link>
</button> 
             


          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;


