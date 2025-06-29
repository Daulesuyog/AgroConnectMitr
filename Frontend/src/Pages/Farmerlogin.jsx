import React, {useState, useContext} from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../Context/App_Context.jsx";
import  { ToastContainer, toast, Bounce } from "react-toastify";

function Farmerlogin () {
const navigate = useNavigate();
const {   farmerLogin} = useContext(AppContext)
const [email, setemail] = useState('');
const [password, setpassword] = useState('');

const loginHandler = async (e) => {
  e.preventDefault();
  try {
    const result = await   farmerLogin(email, password);
    if (result.success) {
      localStorage.setItem('userType', 'farmer');
      localStorage.setItem('farmerData', JSON.stringify(result.data.farmer));
      toast.success('Login Successful', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
        transition: Bounce
      });
      setTimeout(() => {
        navigate('/farmerdashboard');
      }, 2000);
    }
  } catch (error) {
    console.error('Login error:', error.message, error.response?.data || 'No response data');
    toast.error('Network error. Please try again.', {
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
    <div style={{minHeight:'100vh', background: 'linear-gradient(to right, #2f855a, #276749, #22543d)',
        display:'flex', justifyContent:'center',alignItems:'center',padding:'30px'}}>

            <div  className="container p-4 bg-success"
          style={{
            width: '500px',
            border: '2px solid yellow',
            borderRadius: '10px',
            backgroundColor: '#fff'
          }}>
            <div className="text-center mb-3">
              <Link to= '/'>
            <img
              src="/Agro2.png"
              alt="App Logo"
              style={{ width: '100px', height: '100px' }}
            />
            </Link>
          </div>
          <h2 className="text-center mb-4">Farmer Login</h2>
          <form onSubmit={loginHandler}  className="my-3 p-3 bg-success rounded shadow"
            style={{ background: 'linear-gradient(to right, #2f855a, #276749, #22543d)' }}
            >
               <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email Address *
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
           <div className="d-grid">
              <button
                type="submit"
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
                Sign In
              </button>
              </div>
            </form>
            <div className="text-center mt-4">
            <p>
              Don't have an account?{' '}
              <button className="btn btn-outline-light fw-bold px-4">
                <Link to="/register" className="text-white text-decoration-none">
                  Register here
                </Link>
              </button>
            </p>
            <p className="mt-2">
              Are you a worker?{' '}
              <button className="btn btn-outline-light fw-bold px-4">
                <Link to="/workerlogin" className="text-white text-decoration-none">
                  Worker Login
                </Link>
              </button>
            </p>
          </div>
          </div>
    </div>
  </>
)
}

export default Farmerlogin;