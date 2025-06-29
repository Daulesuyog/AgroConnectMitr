import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../Context/App_Context.jsx";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FarmerDashboard() {
  const navigate = useNavigate();
  const { isauth, fetchAvailableWorker, logoutUser, token } = useContext(AppContext);
  const [farmer, setFarmer] = useState(null);
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    // Redirect if not authenticated or userType is not farmer
    const storedToken = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const farmerData = JSON.parse(localStorage.getItem('farmerData'));

    if (!isauth || !storedToken || userType !== 'farmer' || !farmerData) {
      toast.error('Please log in as a farmer to access the dashboard', {
        position: 'top-center',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce
      });
      setTimeout(() => navigate('/farmerlogin'), 1500);
      return;
    }

    setFarmer(farmerData);

    const loadWorkers = async () => {
      const workersResult = await fetchAvailableWorker();
      if (workersResult.success) {
        setWorkers(workersResult.workers || []);
      } else {
        toast.error(workersResult.message || "Failed to load workers.", {
          position: 'top-center',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce
        });
        setWorkers([]); // Ensure workers is an empty array on error
      }
    };

    loadWorkers();
  }, [isauth, navigate, fetchAvailableWorker, token]); // Added token to dependencies

  const handleLogout = () => {
    const result = logoutUser();
    toast.success(result.message, { position: 'top-center', autoClose: 1500, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: 'light', transition: Bounce });
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <>
      <ToastContainer />
      <div style={{ minHeight: '100vh', background: '#2f855a', padding: '20px' }}>
        <div className="container bg-white shadow rounded p-4" style={{ maxWidth: '800px' }}>
          <div className="text-center mb-4">
            <img src="/Agro2.png" alt="Logo" style={{ width: '100px', height: '100px' }} />
            <h3>Farmer Dashboard</h3>
          </div>
          {farmer ? (
            <div className="bg-light p-3 rounded">
              <h5 className="mb-3">Welcome, {farmer.name}!</h5>
              <p>Email: {farmer.email}</p>
              <p>Phone: {farmer.phone}</p>
              <p>Farm Intro: {farmer.farm_intro}</p>
              <p>Worker Requirement: {farmer.worker_requirement}</p>
              <p>Farm Location: {farmer.farm_location}</p>

              <h5 className="mt-4 mb-3">Available Workers</h5>
              {workers.length > 0 ? (
                <ul className="list-group mb-3">
                  {workers.map((worker) => (
                    <li key={worker.workerid} className="list-group-item">
                      <strong>{worker.name}</strong>
                      <p>Skills: {worker.skills_ofworker || 'N/A'}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white">No workers available.</p>
              )}

              <div className="d-grid gap-3">
                <Link to="/jobdashboard" className="btn btn-success w-50 mx-auto" style={{ maxWidth: '250px' }}>
                  Manage Jobs
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger w-50 mx-auto"
                  style={{ maxWidth: '250px' }}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center">Redirecting to login...</p>
          )}
          <div className="text-center mt-3">
            <p>
              Are you a worker?{' '}
              <button className="btn btn-success btn-sm" style={{ borderRadius: '2px' }}>
                <Link to="/workerlogin" className="text-white text-decoration-none">
                  Worker Login
                </Link>
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default FarmerDashboard;