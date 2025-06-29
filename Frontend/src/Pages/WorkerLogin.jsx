import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../Context/App_Context";
import { ToastContainer, toast, Bounce } from "react-toastify";

const WorkerLogin = () => {
  const navigate = useNavigate();
  const {  workerLogin} = useContext(AppContext);
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const result = await workerLogin(email, password);

      if (result.success) {
        toast.success('Login successful!', {
          position: 'top-right',
          autoClose: 1000,
          theme: 'dark',
          transition: Bounce
        });
        setTimeout(() => {
          navigate('/workerdashboard');
        }, 1500);
      } else {
        toast.error(result.message, {
          position: 'top-right',
          autoClose: 1500,
          theme: 'dark',
          transition: Bounce
        });
      }
    } catch {
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
        <div
            className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-4"
            style={{
                background: 'linear-gradient(to right, #1e3a8a, #3b82f6, #60a5fa)',
            }}
        >
            <div className="w-100 bg-white rounded-lg shadow-lg p-5" style={{ maxWidth: '450px' }}>
                <div className="text-center mb-4">
                    <Link to='/'>
                        <img
                            src="/Agro2.png"
                            alt="App Logo"
                            style={{ width: '100px', height: '100px' }}
                        />
                    </Link>
                </div>
                <h2 className="text-3xl fw-bold text-dark">
                    <span className="text-primary">Worker</span> Login
                </h2>
                <p className="text-muted mt-2">Welcome back! Please sign in to your account</p>

                <form onSubmit={loginHandler} className="space-y-4">
                    <div className="mb-3">
                        <label className="form-label fw-bold text-dark">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                            required
                            className="form-control"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold text-dark">
                            Password *
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                            required
                            className="form-control"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button type="submit" className="w-100 btn btn-primary fw-bold py-3">
                        Sign In
                    </button>
                </form>

                <div className="text-center mt-4">
                    <p className="text-muted">
                        Don't have an account?{' '}
                        <button className="btn  fw-bold px-3" style={{background:"blue", border:'2px solid black'}}>
                                    <Link to='/workerregister' className="text-white text-decoration-none">
                                  Register here
                                    </Link>
                                  </button>
                    </p>
                    <p className="text-muted mt-2">
                        Are you a farmer?{' '}
                        <button className="btn fw-bold px-4"  style={{background:"green", border:'2px solid black'}}>
                                    <Link to="/login" className="text-white text-decoration-none">
                                      Login  as Farmer
                                    </Link>
                                  </button>
                    </p>
                    <p className="text-muted mt-2">
                        <Link to="/" className="text-secondary text-decoration-none">
                            ← Back to Home
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    </>
);
};

export default WorkerLogin;
