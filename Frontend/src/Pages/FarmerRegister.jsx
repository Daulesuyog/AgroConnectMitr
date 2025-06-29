import React, {useContext, useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../Context/App_Context.jsx";
import { ToastContainer, toast, Bounce } from 'react-toastify';

const FarmerRegister = () => {
    const navigate = useNavigate();
    const {farmerRegister} = useContext(AppContext);
    const [name, setname] = useState('');
    const [email, setemail] = useState('');
    const [phone, setphone] = useState('');
    const [password, setpassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');
    const [farmIntro, setfarmIntro] = useState('');
    const [workerRequirement, setworkerRequirement] = useState('');
    const [farmLocation, setfarmLocation] = useState('');
    const passwordMatch = password === confirmPassword;

    const registerHandler = async (e) => {
        e.preventDefault();
        if(!passwordMatch){
            toast.error('Passwords do not match!', {
        position: 'top-right',
        autoClose: 1500,
        theme: 'dark',
        transition: Bounce
      });
      return;
    }
    try {
         const result = await farmerRegister(
            name, email, phone, password, farmIntro, workerRequirement, farmLocation);
            toast.success(result.data.message,{
                 position: 'top-riconght',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce
     });
     if(result.data.message !== 'Farmer Already exist'){
        setTimeout(()=>{
            navigate("/farmerdashboard" );
        }, 3000)
     }
    }catch(error){
        toast.error(error.response?.data?.message || 'Registration failed', {
        position: 'top-right',
        autoClose: 1500,
        theme: 'dark',
        transition: Bounce
    });
        }
    };
  return (
    <>
      <ToastContainer />
     <div
  style={{
    minHeight: '100vh',
    backgroundImage: 'linear-gradient(to right, #2f855a, #276749, #22543d)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '30px',
    overflow: 'hidden',
  }}
>

       <div
  className="container p-4"
  style={{
    width: '500px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '15px',
    background: 'rgba(255, 255, 255, 0.1)', 
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    color: '#fff'
  }}
>

          <div className="text-center mb-3">
            <Link to='/'>
              <img
                src="/Agro2.png"
                alt="App Logo"
                style={{ width: '100px', height: '100px' }}
              />
            </Link>
          </div>
          <h2 className="text-center mb-4">Register as Farmer</h2>      
          <form onSubmit={registerHandler} className="my-3 p-3  rounded shadow bg-linear-gradient(to right, #2f855a, #276749, #22543d)"
          style={{background: 'linear-gradient(135deg, rgba(47,133,90,0.8), rgba(34,84,61,0.8))',
}}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setname(e.target.value)}
                required
                className="form-control"
                placeholder="Enter your full name"
                style={{ padding: '8px' }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                required
                className="form-control"
                placeholder="Enter your email"
                style={{ padding: '8px' }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setphone(e.target.value)}
                required
                className="form-control"
                placeholder="Enter your phone number"
                style={{ padding: '8px' }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="farmLocation" className="form-label">
                Farm Location *
              </label>
              <input
                type="text"
                id="farmLocation"
                value={farmLocation}
                onChange={(e) => setfarmLocation(e.target.value)}
                required
                className="form-control"
                placeholder="Enter your farm location"
                style={{ padding: '8px' }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="farmIntro" className="form-label">
                Farm Introduction
              </label>
              <textarea
                id="farmIntro"
                value={farmIntro}
                onChange={(e) => setfarmIntro(e.target.value)}
                rows="3"
                className="form-control"
                placeholder="Tell us about your farm..."
                style={{ padding: '8px' }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="workerRequirement" className="form-label">
                Worker Requirements
              </label>
              <textarea
                id="workerRequirement"
                value={workerRequirement}
                onChange={(e) => setworkerRequirement(e.target.value)}
                rows="3"
                className="form-control"
                placeholder="Describe what type of workers you need..."
                style={{ padding: '8px' }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password *
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                required
                className="form-control"
                placeholder="Create a password"
                style={{ padding: '8px' }}
              />
            </div>
           <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password *
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setconfirmPassword(e.target.value)}
              required
              className={`form-control ${confirmPassword.length > 0 ? (passwordMatch ? 'is-valid' : 'is-invalid') : ''}`}
              placeholder="Confirm your password"
              style={{ padding: '8px' }}
            />
              {confirmPassword.length > 0 && !passwordMatch && (
                <div className="invalid-feedback">Passwords do not match</div>
              )}
              {confirmPassword.length > 0 && passwordMatch && (
                <div className="valid-feedback">Passwords match</div>
              )}
            </div>
            <div className="d-grid">
              <button
                type="submit"
                disabled={!passwordMatch}
                className="btn btn-primary"
                style={{
                  padding: '10px',
                  backgroundColor: '#28a745',
                  borderColor: '#28a745'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'silver';
                  e.target.style.borderColor = 'gray';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'gray';
                  e.target.style.borderColor = 'yellow';
                }}
              >
                Register as Farmer
              </button>
            </div>
          </form>
          <div className="text-center mt-4">
            <p>
              Already have an account?{' '}
              <button className="btn btn-outline-light fw-bold px-4">
                <Link to="/login" className="text-white text-docoration-none">
                  Login here
                </Link>
              </button>
            </p>
            <p className="mt-2">
              Looking for work?{' '}
              <button className="btn btn-outline-light fw-bold px-4">
                <Link to="/workerregister" className="text-white text-decoration-none">
                  Register as Worker
                </Link>
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FarmerRegister;