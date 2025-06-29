import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { AppContext } from '../Context/App_Context.jsx';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FarmerApplications = ({ applications, onUpdateStatus }) => (
  <div>
    <h5 className="mt-3 text-white">Applications</h5>
    {applications.length > 0 ? (
      <ul className="list-group">
        {applications.map(app => (
          <li key={app.id} className="list-group-item">
            <strong>Worker:</strong> {app.name} ({app.email})<br />
            <small>Status: {app.status || 'pending'}</small>
            <div className="btn-group mt-2" role="group">
              <button onClick={() => onUpdateStatus(app.id, 'accepted')} className="btn btn-success btn-sm" disabled={app.status === 'accepted'}>Accept</button>
              <button onClick={() => onUpdateStatus(app.id, 'pending')} className="btn btn-warning btn-sm" disabled={app.status === 'pending'}>Pending</button>
              <button onClick={() => onUpdateStatus(app.id, 'rejected')} className="btn btn-danger btn-sm" disabled={app.status === 'rejected'}>Reject</button>
            </div>
          </li>
        ))}
      </ul>
    ) : <p className="text-white">No applications yet.</p>}
  </div>
);

const WorkerApplications = ({ applications }) => {
  const getStatusBadge = (status) => {
    const badgeClass = status === 'accepted' ? 'bg-success' : status === 'rejected' ? 'bg-danger' : 'bg-warning';
    return <span className={`badge ${badgeClass} text-white`}>{status}</span>;
  };

  return (
    <div>
      <h5 className="mt-3 text-white">Your Applications</h5>
      {applications.length > 0 ? (
        <ul className="list-group">
          {applications.map(app => (
            <li key={app.id} className="list-group-item">
              <strong>{app.title}</strong> - {app.location}<br />
              <small>Status: {getStatusBadge(app.status || 'pending')}</small>
            </li>
          ))}
        </ul>
      ) : <p className="text-white">No applications found.</p>}
    </div>
  );
};

function ApplicationDashboard() {
  const navigate = useNavigate();
  const { jobid } = useParams();
  const { isauth, fetchApplicationByJob, updateApplicationStatus, fetchWorkerApplications, logoutUser } = useContext(AppContext);
  const [userType, setUserType] = useState(null);
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const type = localStorage.getItem('userType');
    const farmerData = localStorage.getItem('farmerData');
    const workerData = localStorage.getItem('workerData');

    if (!token || !type || (!farmerData && !workerData) || !isauth) {
      toast.error('Please log in', { position: 'top-right', autoClose: 1500, theme: 'colored', transition: Bounce });
      setTimeout(() => navigate(type === 'farmer' ? '/login' : '/workerlogin'), 2000);
      return;
    }

    setUserType(type);
    if (type === 'farmer') {
      const farmer = JSON.parse(farmerData);
      setUser(farmer);
      if (jobid && !isNaN(parseInt(jobid))) loadFarmerApplications(parseInt(jobid));
      else navigate('/jobdashboard');
    } else {
      const worker = JSON.parse(workerData);
      setUser(worker);
      loadWorkerApplications(worker.workerid);
    }
  }, [navigate, isauth, jobid]);

  const loadFarmerApplications = async (jobid) => {
    const result = await fetchApplicationByJob(jobid);
    if (result.success) setApplications(result.applications);
  };

  const loadWorkerApplications = async (workerid) => {
    const result = await fetchWorkerApplications(workerid);
    if (result.success) {
      const updatedApps = result.applications;
      setApplications(updatedApps);
      updatedApps.forEach(app => {
        if (app.status !== 'APPLIED' && !app.notified) {
          toast.info(`Your application for "${app.title}" has been ${app.status.toLowerCase()}!`, {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored',
            transition: Bounce
          });
          app.notified = true; // Simulated locally
        }
      });
    }
  };

  const handleUpdateStatus = async (id, status) => {
    const result = await updateApplicationStatus(id, status);
    if (result.success) {
      toast.success(result.message, { position: 'top-right', autoClose: 1000, theme: 'colored', transition: Bounce });
      setApplications(applications.map(app => app.id === id ? { ...app, status } : app));
    } else {
      toast.error(result.message, { position: 'top-right', autoClose: 1500, theme: 'colored', transition: Bounce });
    }
  };

  const handleLogout = () => {
    logoutUser();
    toast.success('Logged out!', { position: 'top-right', autoClose: 1000, theme: 'colored', transition: Bounce });
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div style={{ minHeight: '100vh', background: userType === 'farmer' ? '#2f855a' : '#1e3a8a', padding: '20px' }}>
      <ToastContainer />
      <div className="container bg-light shadow rounded p-4" style={{ maxWidth: '800px' }}>
        <div className="text-center mb-4"><img src="/Agro2.png" alt="Logo" style={{ width: '100px', height: '100px' }} /><h3>Application Dashboard</h3></div>
        {user ? (
          <div>
            <h5>Welcome, {user.name}!</h5>
            {userType === 'farmer' ? (
              <FarmerApplications applications={applications} onUpdateStatus={handleUpdateStatus} />
            ) : (
              <WorkerApplications applications={applications} />
            )}
            <div className="d-grid gap-2 mt-3">
              <Link to={userType === 'farmer' ? '/jobdashboard' : '/workerdashboard'} className="btn btn-success">Back to Dashboard</Link>
              <button onClick={handleLogout} className="btn btn-danger">Logout</button>
            </div>
          </div>
        ) : <p className="text-center">Loading...</p>}
        <div className="text-center mt-3">
          <p>Switch role? <Link to={userType === 'farmer' ? '/workerlogin' : '/login'} className="text-primary fw-bold">{userType === 'farmer' ? 'Worker' : 'Farmer'} Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default ApplicationDashboard;