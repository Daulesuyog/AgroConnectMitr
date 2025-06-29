import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  const values = [
    {
      icon: '❤️',
      title: 'Empowerment',
      description: 'Empowering farmers and workers with technology and fair opportunities'
    },
    {
      icon: '🤝',
      title: 'Trust',
      description: 'Building trust through verified profiles and transparent processes'
    },
    {
      icon: '🌍',
      title: 'Accessibility',
      description: 'Making agricultural employment accessible across rural and urban India'
    },
    {
      icon: '📈',
      title: 'Growth',
      description: 'Fostering sustainable growth for the entire agricultural ecosystem'
    }
  ];

  const milestones = [
    { year: '2022', event: 'AgroConnect Mitr founded', description: 'Started with a vision to digitize agricultural employment' },
    { year: '2023', event: '1,000+ Users', description: 'Reached our first thousand registered users across 5 states' },
    { year: '2024', event: 'National Expansion', description: 'Expanded operations to 15 states with multilingual support' },
    { year: '2025', event: '10,000+ Connections', description: 'Facilitated over 10,000 successful farmer-worker connections' }
  ];

  const team = [
    {
      name: 'Suyog Daule',
      role: 'CTO & Co-Founder',
      bio: 'Former agricultural engineer with 15+ years in farm technology',
      image: '/Suyog.jpg'
    },
     {
       name: 'Vaibhav Najan',
       role: 'CEO & Co-Founder',
       bio: 'Tech entrepreneur passionate about rural digital transformation',
      image: '/vaibhav.jpg'
     },
    // {
    //   name: 'Raj Kumar',
    //   role: 'Head of Operations',
    //   bio: 'Expert in agricultural labor management and rural economics',
    //   image: '👨‍💼'
    // },
    // {
    //   name: 'Sunita Devi',
    //   role: 'Community Manager',
    //   bio: 'Connecting with farmers and workers across Indian villages',
    //   image: '👩‍🤝‍👩'
    // }
  ];

  return (
    <div>

      {/* Hero Section */}
      <section className="bg-success text-white text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold">About AgroConnect Mitr</h1>
          <p className="lead mt-3">We're on a mission to revolutionize agricultural employment in India by connecting farmers with skilled workers through technology and trust.</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6">
              <h3>🎯 Our Mission</h3>
              <p>To bridge the gap between farmers and agricultural workers by providing a reliable and transparent platform that ensures fair employment.</p>
              <blockquote className="blockquote">“Empowering India's agricultural backbone through technology and human connection.”</blockquote>
            </div>
            <div className="col-md-6">
              <h3>💡 Our Vision</h3>
              <p>To become India's leading agricultural employment platform, creating a thriving ecosystem where farmers and workers grow together.</p>
              <blockquote className="blockquote">“Building the future of agricultural employment, one connection at a time.”</blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-5">
        <div className="container text-center">
          <h2 className="mb-4">Our Core Values</h2>
          <div className="row g-4">
            {values.map((value, index) => (
              <div className="col-md-3" key={index}>
                <div className="card h-100">
                  <div className="card-body">
                    <div className="fs-2 mb-3">{value.icon}</div>
                    <h5 className="card-title">{value.title}</h5>
                    <p className="card-text">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-5 bg-primary text-white text-center">
        <div className="container d-flex justify-content-center align-items-center">
          <h2 className="mb-4 ">Our Journey</h2>
          <div className="row g-4">
            {milestones.map((m, index) => (
              <div className="col-md-3" key={index}>
                <div className="border rounded p-3 h-100 bg-opacity-50 bg-light text-dark">
                  <h4 className="text-warning">{m.year}</h4>
                  <h5>{m.event}</h5>
                  <p>{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="mb-4">Meet Our Team</h2>
          <div className="row  d-flex justify-content-center align-items-center g-4 ">
            {team.map((member, index) => (
              <div className="col-md-3" key={index}>
                <div className="card h-100">
                  <div className="card-body">
                    <img src={member.image} alt={member.name} style={{height:'100px', width:'100px', borderRadius:'30%', objectFit:'cover', marginBottom:'10px', border:'2px solid gray'}} />
                    {/* <div className="fs-1 mb-3">{member.image}</div>
                    <h5 className="card-title">{member.name}</h5> */}
                    <p className="text-success fw-semibold">{member.role}</p>
                    <p className="card-text">{member.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-5 bg-success text-white text-center">
        <div className="container">
          <h2 className="mb-4">Our Impact</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <h3 className="text-warning">₹2.5Cr+</h3>
              <p>Total Wages Facilitated</p>
            </div>
            <div className="col-md-4">
              <h3 className="text-warning">85%</h3>
              <p>User Satisfaction</p>
            </div>
            <div className="col-md-4">
              <h3 className="text-warning">500+</h3>
              <p>Villages Reached</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-5 bg-danger text-white text-center">
        <div className="container">
          <h2 className="mb-3">Join Our Mission</h2>
          <p className="lead mb-4">Be part of the agricultural revolution. Together, we can build a stronger, more connected farming community.</p>
          <div className="d-flex justify-content-center flex-wrap gap-3">
     <button className="btn btn-outline-light px-4 py-2 fw-semibold">
                     <Link to="/register" className="text-white text-decoration-none"> Join as Farmer</Link></button>
          <button className="btn btn-outline-light px-4 py-2 fw-semibold">
                        <Link to="/workerregister"className="text-white text-decoration-none"> Join as Worker</Link></button>
            <button className="btn btn-outline-light fw-bold px-4">
              <Link to="/contact" className='text-decoration-none text-white'>Contact Us</Link></button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
