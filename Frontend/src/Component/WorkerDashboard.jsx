import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from "../Context/App_Context.jsx";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function WorkerDashboard() {
  const navigate = useNavigate();
  const { isauth, fetchPublicJobs, applyToJob, fetchWorkerApplications, logoutUser, reload, token } = useContext(AppContext);

  const [worker, setWorker] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]); // This will store worker's own applications

  // Function to determine application status badge
  const getStatusBadge = (jobId) => {
    const application = applications.find(app => app.job_id === jobId);
    if (!application) return null; // Should not happen if applications.some is true

    let badgeClass = '';
    let statusText = application.status || 'pending';
    switch (statusText) {
      case 'accepted':
        badgeClass = 'bg-success';
        break;
      case 'rejected':
        badgeClass = 'bg-danger';
        break;
      case 'pending':
      default:
        badgeClass = 'bg-warning text-dark';
        break;
    }
    return <span className={`badge ${badgeClass} ms-2`}>{statusText.toUpperCase()}</span>;
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const workerData = JSON.parse(localStorage.getItem('workerData'));

    if (!isauth || !storedToken || userType !== 'worker' || !workerData) {
      toast.error('Please log in as a worker to access the dashboard', {
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
      setTimeout(() => navigate('/workerlogin'), 1500);
      return;
    }

    setWorker(workerData);

    const loadData = async () => {
      // Fetch available public jobs
      const jobsResult = await fetchPublicJobs();
      if (jobsResult.success) {
        setJobs(jobsResult.jobs || []);
      } else {
        toast.error(jobsResult.message || "Failed to load jobs.", { position: 'top-center', autoClose: 1500, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: 'light', transition: Bounce });
        setJobs([]);
      }

      // Fetch worker's own applications
      const applicationsResult = await fetchWorkerApplications();
      if (applicationsResult.success) {
        setApplications(applicationsResult.applications || []);
      } else {
        toast.error(applicationsResult.message || "Failed to load your applications.", { position: 'top-center', autoClose: 1500, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: 'light', transition: Bounce });
        setApplications([]);
      }
    };

    loadData();
  }, [isauth, navigate, fetchPublicJobs, applyToJob, fetchWorkerApplications, token, reload]); // Added reload and token to dependencies

  const handleApply = async (jobId) => {
    if (!worker || !worker.workerid) {
      toast.error("Worker data not available. Please log in again.", { position: 'top-center', autoClose: 1500, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: 'light', transition: Bounce });
      return;
    }
    const result = await applyToJob(worker.workerid, jobId);
    if (result && result.success) {
      toast.success(result.message, { position: 'top-center', autoClose: 1500, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: 'light', transition: Bounce });
      // Trigger a reload of applications to reflect the new application status
      // You might need to add setReload to AppContext or manually update applications state
      // For now, let's just trigger a full re-fetch by changing reload state if it exists
      // If setReload is not in AppContext for WorkerDashboard, you might need to adjust AppContext or directly update applications state here.
      // For demonstration, assuming setReload exists or you will implement it.
      // A better way would be to simply add the new application to the 'applications' state.
      setApplications(prevApps => [...prevApps, { job_id: jobId, worker_id: worker.workerid, status: 'pending', id: Date.now() }]); // Add a placeholder application
    } else {
      toast.error(result?.message || "Failed to apply to job.", { position: 'top-center', autoClose: 1500, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: 'light', transition: Bounce });
    }
  };

  const handleLogout = () => {
    const result = logoutUser();
    toast.success(result.message, { position: 'top-center', autoClose: 1500, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: 'light', transition: Bounce });
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#1e3a8a', padding: '20px' }}>
      <ToastContainer />
      <div className="container bg-white shadow rounded p-4" style={{ maxWidth: '800px' }}>
        <div className="text-center mb-4">
          <img src="/Agro2.png" alt="Logo" style={{ width: '100px', height: '100px' }} />
          <h3>Worker Dashboard</h3>
        </div>
        {worker ? (
          <div className="bg-light p-3 rounded">
            <h5 className="mb-3">Welcome, {worker.name}!</h5>
            <p>Email: {worker.email}</p>
            <p>Phone: {worker.phone}</p>
            <p>Skills: {worker.skills_ofworker}</p>
            <p>Capacity: {worker.capacity_ofworker}</p>
            <p>Wage per Day: ₹{worker.wage_per_day_ofworker}</p>
            <p>Wage per Month: ₹{worker.wage_per_month_ofworker}</p>

            <h5 className="mt-4 mb-3">Available Jobs</h5>
            {jobs.length > 0 ? (
              <ul className="list-group">
                {jobs.map(job => (
                  <li key={job.jobid} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{job.title}</strong> - {job.location}<br />
                      <small>Wage: ₹{job.wage}</small>
                    </div>
                    {/* Conditionally render Apply button or application status badge */}
                    {applications.some(app => app.job_id === job.jobid) ? (
                      getStatusBadge(job.jobid) // Show status if already applied
                    ) : (
                      <button onClick={() => handleApply(job.jobid)} className="btn btn-sm btn-primary">Apply</button> // Show Apply button
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No jobs available.</p>
            )}

            {/* Navigation and Logout buttons */}
            <div className="d-grid mt-3">
              <Link to="/applicationdashboard" className="btn btn-info">View My Applications</Link>
              <button onClick={handleLogout} className="btn btn-danger mt-2">Logout</button>
            </div>
          </div>
        ) : (
          // Show loading message if worker data is not yet available
          <p className="text-center">Redirecting to login...</p>
        )}

        {/* Link for farmer login */}
        <div className="text-center mt-3">
          <p>Are you a farmer? <Link to="/farmerlogin" className="text-primary fw-bold">Farmer Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default WorkerDashboard;

// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { AppContext } from "../Context/App_Context.jsx";
// import { ToastContainer, toast, Bounce } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function WorkerDashboard() {
//   // Hooks for navigation and accessing global context
//   const navigate = useNavigate();
//   const { isauth, fetchJobs, applyToJob, fetchWorkerApplications, logoutUser } = useContext(AppContext);

//   // State variables to hold worker data, available jobs, and applications
//   const [worker, setWorker] = useState(null);
//   const [jobs, setJobs] = useState([]);
//   const [applications, setApplications] = useState([]);

//   // Effect hook to handle authentication and initial data loading
//   useEffect(() => {
//     // Retrieve authentication details from local storage
//     const token = localStorage.getItem('token');
//     const userType = localStorage.getItem('userType');
//     const workerData = localStorage.getItem('workerData');

//     // Check if the user is a logged-in worker
//     if (!token || userType !== 'worker' || !workerData || !isauth) {
//       // If not authenticated, show an error and redirect to login
//       toast.error('Please log in as a worker', { position: 'top-right', autoClose: 1500, theme: 'dark', transition: Bounce });
//       setTimeout(() => navigate('/workerlogin'), 1500);
//       return; // Stop further execution of the effect
//     }

//     // Parse worker data and set it to state
//     const parsedWorker = JSON.parse(workerData);
//     setWorker(parsedWorker);

//     // Load initial job and application data for the worker
//     loadData(parsedWorker.workerid);

//     // Set up an interval to refresh data every 15 seconds
//     const intervalId = setInterval(() => loadData(parsedWorker.workerid), 15000);

//     // Cleanup function: clear the interval when the component unmounts
//     return () => clearInterval(intervalId);
//   }, [navigate, isauth]); // Dependencies: re-run effect if navigate or isauth changes

//   // Function to fetch and update job and application data
//   const loadData = async (workerId) => {
//     // Fetch available jobs
//     const jobsResult = await fetchJobs();
//     if (jobsResult.success) {
//       setJobs(jobsResult.jobs);
//     }

//     // Fetch worker's applications
//     const appsResult = await fetchWorkerApplications(workerId);
//     if (appsResult.success) {
//       const updatedApps = appsResult.applications;
//       setApplications(updatedApps);

//       // Notify worker about application status changes
//       updatedApps.forEach(app => {
//         // Only notify if status is not 'APPLIED' and hasn't been notified before (local simulation)
//         if (app.status !== 'APPLIED' && !app.notified) {
//           toast.info(`Your application for "${app.title}" has been ${app.status.toLowerCase()}!`, {
//             position: 'top-right',
//             autoClose: 3000,
//             theme: 'dark',
//             transition: Bounce
//           });
//           // Mark as notified locally; ideally, this would be persisted in the backend
//           app.notified = true;
//         }
//       });
//     }
//   };

//   // Function to handle applying for a job
//   const handleApply = async (jobId) => {
//     // Ensure worker ID is available
//     if (!worker?.workerid) {
//       toast.error('Worker ID not found', { position: 'top-right', autoClose: 1500, theme: 'dark', transition: Bounce });
//       return;
//     }

//     // Call the applyToJob function from context
//     const result = await applyToJob(worker.workerid, jobId, 'Interested in this job');

//     // Show success or error toast based on the application result
//     if (result.success) {
//       toast.success('Applied successfully!', { position: 'top-right', autoClose: 1000, theme: 'dark', transition: Bounce });
//       loadData(worker.workerid); // Refresh data to show updated application status
//     } else {
//       toast.error(result.message || 'Failed to apply', { position: 'top-right', autoClose: 1500, theme: 'dark', transition: Bounce });
//     }
//   };

//   // Function to handle user logout
//   const handleLogout = () => {
//     logoutUser(); // Call logout function from context
//     toast.success('Logged out!', { position: 'top-right', autoClose: 1000, theme: 'dark', transition: Bounce });
//     setTimeout(() => navigate('/'), 1500); // Redirect to homepage after logout
//   };

//   // Function to determine and return the appropriate status badge for a job
//   const getStatusBadge = (jobId) => {
//     const app = applications.find(a => a.job_id === jobId);
//     if (!app) return null; // No application found for this job

//     // Determine badge color based on application status
//     const badgeClass = app.status === 'accepted' ? 'bg-success' : app.status === 'rejected' ? 'bg-danger' : 'bg-warning';
//     return <span className={`badge ${badgeClass} text-white`}>{app.status}</span>;
//   };

//   // JSX to render the Worker Dashboard UI
//   return (
//     <div style={{ minHeight: '100vh', background: 'linear-gradient(to right, #1e3a8a, #3b82f6)', padding: '20px' }}>
//       <ToastContainer /> {/* Container for displaying toasts */}

//       <div className="container bg-white shadow rounded p-4" style={{ maxWidth: '600px' }}>
//         <div className="text-center mb-4">
//           <img src="/Agro2.png" alt="Logo" style={{ width: '80px', height: '80px' }} />
//           <h3>Worker Dashboard</h3>
//         </div>

//         {worker ? (
//           // Display worker details if available
//           <div className="bg-light p-3 rounded">
//             <p><strong>Name:</strong> {worker.name}</p>
//             <p><strong>Email:</strong> {worker.email}</p>
//             <p><strong>Skills:</strong> {worker.skills_ofworker || 'N/A'}</p>

//             <h5 className="mt-4">Available Jobs</h5>
//             {jobs.length > 0 ? (
//               // List available jobs
//               <ul className="list-group">
//                 {jobs.map(job => (
//                   <li key={job.jobid} className="list-group-item d-flex justify-content-between align-items-center">
//                     <div>
//                       <strong>{job.title}</strong> - {job.location}<br />
//                       <small>Wage: ₹{job.wage}</small>
//                     </div>
//                     {/* Conditionally render Apply button or application status badge */}
//                     {applications.some(app => app.job_id === job.jobid) ? (
//                       getStatusBadge(job.jobid) // Show status if already applied
//                     ) : (
//                       <button onClick={() => handleApply(job.jobid)} className="btn btn-sm btn-primary">Apply</button> // Show Apply button
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No jobs available.</p>
//             )}

//             {/* Navigation and Logout buttons */}
//             <div className="d-grid mt-3">
//               <Link to="/applicationdashboard" className="btn btn-info">View My Applications</Link>
//               <button onClick={handleLogout} className="btn btn-danger mt-2">Logout</button>
//             </div>
//           </div>
//         ) : (
//           // Show loading message if worker data is not yet available
//           <p className="text-center">Loading...</p>
//         )}

//         {/* Link for farmer login */}
//         <div className="text-center mt-3">
//           <p>Are you a farmer? <Link to="/login" className="text-primary fw-bold">Farmer Login</Link></p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default WorkerDashboard;