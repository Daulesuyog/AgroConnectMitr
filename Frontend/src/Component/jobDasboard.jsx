import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from "../Context/App_Context.jsx";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JobForm = ({ onJobPosted }) => {
  const { createJob } = useContext(AppContext);
  const [formData, setFormData] = useState({ title: '', description: '', location: '', wage: '', required_skills: '' });
  const farmerData = JSON.parse(localStorage.getItem('farmerData') || '{}');
  const farmer_id = farmerData.farmerid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!farmer_id) {
      toast.error('Farmer ID not found. Please log in again.', { position: 'top-right', autoClose: 1500, theme: 'colored', transition: Bounce });
      return;
    }
    const result = await createJob(farmer_id, formData.title, formData.description, formData.location, parseFloat(formData.wage), formData.required_skills.split(','));
    if (result.success) {
      toast.success(result.message, { position: 'top-right', autoClose: 1000, theme: 'colored', transition: Bounce });
      if (onJobPosted) onJobPosted();
      setFormData({ title: '', description: '', location: '', wage: '', required_skills: '' });
    } else {
      toast.error(result.message, { position: 'top-right', autoClose: 1500, theme: 'colored', transition: Bounce });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-3"><input type="text" className="form-control" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Job Title" required /></div>
      <div className="mb-3"><textarea className="form-control" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" required /></div>
      <div className="mb-3"><input type="text" className="form-control" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Location" required /></div>
      <div className="mb-3"><input type="number" className="form-control" value={formData.wage} onChange={(e) => setFormData({ ...formData, wage: e.target.value })} placeholder="Wage (₹)" step="0.01" required /></div>
      <div className="mb-3"><input type="text" className="form-control" value={formData.required_skills} onChange={(e) => setFormData({ ...formData, required_skills: e.target.value })} placeholder="Skills (comma-separated)" required /></div>
      <button type="submit" className="btn btn-primary">Post Job</button>
    </form>
  );
};

function JobDashboard() {
  const navigate = useNavigate();
  const { isauth, fetchJobs, logoutUser } = useContext(AppContext);
  const [farmer, setFarmer] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const farmerData = localStorage.getItem('farmerData');

    if (!token || userType !== 'farmer' || !farmerData || !isauth) {
      toast.error('Please log in as a farmer', { position: 'top-right', autoClose: 1500, theme: 'colored', transition: Bounce });
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    const parsedFarmer = JSON.parse(farmerData);
    setFarmer(parsedFarmer);
    loadJobs();

    const intervalId = setInterval(loadJobs, 30000);
    return () => clearInterval(intervalId);
  }, [navigate, isauth]);

  const loadJobs = async () => {
    const result = await fetchJobs();
    if (result.success) setJobs(result.jobs);
  };

  const handleLogout = () => {
    logoutUser();
    toast.success('Logged out!', { position: 'top-right', autoClose: 1000, theme: 'colored', transition: Bounce });
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to right, #2f855a, #276749)', padding: '20px' }}>
      <ToastContainer />
      <div className="container bg-white shadow rounded p-4" style={{ maxWidth: '800px' }}>
        <div className="text-center mb-4">
          <img src="/Agro2.png" alt="Logo" style={{ width: '100px', height: '100px' }} />
          <h3>Job Dashboard</h3>
        </div>
        {farmer ? (
          <div className="bg-light p-3 rounded">
            <h5>Welcome, {farmer.name}!</h5>
            <JobForm onJobPosted={loadJobs} />
            <h5 className="mt-4">Your Jobs</h5>
            {jobs.length > 0 ? (
              <ul className="list-group">
                {jobs.map(job => (
                  <li key={job.jobid} className="list-group-item">
                    <strong>{job.title}</strong> - {job.location}<br />
                    <small>Wage: ₹{job.wage}</small>
                    <Link to={`/applicationdashboard/${job.jobid}`} className="btn btn-info btn-sm mt-2">View Applications</Link>
                  </li>
                ))}
              </ul>
            ) : <p>No jobs posted yet.</p>}
            <div className="d-grid mt-3">
              <button onClick={handleLogout} className="btn btn-danger">Logout</button>
            </div>
          </div>
        ) : <p className="text-center">Loading...</p>}
        <div className="text-center mt-3">
          <p>Are you a worker? <Link to="/workerlogin" className="text-success fw-bold">Worker Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default JobDashboard;