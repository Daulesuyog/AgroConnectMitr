import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../Context/App_Context.jsx';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import i18n from '../Component/i18.jsx';
import '../style/jobFetch.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTractor,
  faUser,
  faSearch,
  faCheckCircle,
  faTimesCircle,
  faHome,
  faQuestionCircle,
  faMapMarkerAlt,
  faRupeeSign,
} from '@fortawesome/free-solid-svg-icons';

// Simple error boundary component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <p style={{ textAlign: 'center', color: '#666', fontSize: '18px' }}>
          Something went wrong. Try again!
        </p>
      );
    }
    return this.props.children;
  }
}

function Jobfetch() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    fetchPublicJobs,
    applyToJob,
    fetchAvailableWorker,
    fetchJobs,
    isauth,
    fetchWorkerApplications,
  } = useContext(AppContext);
  const [jobs, setJobs] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [jobSearch, setJobSearch] = useState('');
  const [workerSearch, setWorkerSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [step, setStep] = useState(1);
  const userType = localStorage.getItem('userType');
  const workerData = JSON.parse(localStorage.getItem('workerData'));

  const fetchJobsData = useCallback(async () => {
    const result = await fetchPublicJobs();
    if (result.success) {
      setJobs(result.jobs);
    } else if (isauth) {
      const fallbackResult = await fetchJobs();
      if (fallbackResult.success) {
        setJobs(fallbackResult.jobs);
      }
    }
  }, [fetchPublicJobs, fetchJobs, isauth]);

  const fetchWorkersData = useCallback(async () => {
    if (isauth && userType === 'farmer') {
      const result = await fetchAvailableWorker();
      if (result.success) setWorkers(result.workers);
    }
  }, [fetchAvailableWorker, isauth, userType]);

  const fetchApplicationsData = async () => {
    if (isauth && userType === 'worker' && workerData?.workerid) {
      const result = await fetchWorkerApplications(workerData.workerid);
      if (result.success) {
        const updatedApps = result.applications || [];
        setApplications(updatedApps);
        updatedApps.forEach(app => {
          if (app && app.status !== 'APPLIED' && !app.notified) {
            app.notified = true;
          }
        });
      }
    }
  };

  useEffect(() => {
    fetchJobsData();
    if (isauth && userType === 'farmer') {
      fetchWorkersData();
    }
    let intervalId;
    if (isauth && userType === 'worker' && workerData?.workerid) {
      fetchApplicationsData();
      intervalId = setInterval(fetchApplicationsData, 15000);
    }
    return () => clearInterval(intervalId);
  }, [fetchJobsData, fetchWorkersData, fetchApplicationsData]);

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
    job.location.toLowerCase().includes(jobSearch.toLowerCase())
  );

  const filteredWorkers = workers.filter(worker =>
    worker.name.toLowerCase().includes(workerSearch.toLowerCase()) ||
    (Array.isArray(worker.skills_ofworker)
      ? worker.skills_ofworker.some(skill => skill.toLowerCase().includes(workerSearch.toLowerCase()))
      : typeof worker.skills_ofworker === 'string' &&
        worker.skills_ofworker.toLowerCase().includes(workerSearch.toLowerCase()))
  );

  const showJobDetails = (job) => {
    setSelectedJob(job);
    setStep(1);
  };
  const hideJobDetails = () => setSelectedJob(null);

  const handleApply = async (jobId) => {
    if (!isauth || !userType) {
      toast.info(t('Log in as a worker to apply'), {
        position: 'top-right',
        autoClose: 2000,
        theme: 'dark',
        transition: Bounce,
        onClose: () => setTimeout(() => navigate('/workerlogin'), 500),
      });
      return;
    }
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      const workerData = JSON.parse(localStorage.getItem('workerData'));
      if (!workerData || !workerData.workerid) {
        toast.error(t('Worker data missing'), {
          position: 'top-right',
          autoClose: 1500,
          theme: 'dark',
          transition: Bounce,
        });
        setTimeout(() => navigate('/workerlogin'), 1500);
        return;
      }
      const result = await applyToJob(workerData.workerid, jobId, 'Interested');
      if (result.success) {
        toast.success(t('Applied!'), {
          position: 'top-right',
          autoClose: 1000,
          theme: 'dark',
          transition: Bounce,
        });
        const updatedApps = await fetchWorkerApplications(workerData.workerid);
        if (updatedApps.success) setApplications(updatedApps.applications);
        hideJobDetails();
      } else {
        toast.error(result.message, {
          position: 'top-right',
          autoClose: 1500,
          theme: 'dark',
          transition: Bounce,
        });
      }
    }
  };

  const formatSkills = (skills) => {
    if (!skills) return t('None');
    if (Array.isArray(skills)) return skills.join(', ');
    if (typeof skills === 'string') {
      try {
        const parsed = JSON.parse(skills);
        return Array.isArray(parsed) ? parsed.join(', ') : skills.split(',').map(s => s.trim()).join(', ');
      } catch {
        return skills.split(',').map(s => s.trim()).join(', ') || skills;
      }
    }
    return t('None');
  };

  const getStatusBadge = (jobId) => {
    const app = applications.find(a => a.job_id === jobId);
    if (!app) return null;
    const badgeClass =
      app.status === 'accepted'
        ? 'bg-success'
        : app.status === 'rejected'
        ? 'bg-danger'
        : 'bg-warning';
    return <span className={`badge ${badgeClass} text-white`}>{app.status}</span>;
  };

  const canApply = (jobId) => {
    if (!isauth || !userType || userType !== 'worker') return false;
    const app = applications.find(a => a.job_id === jobId);
    return !app || app.status === 'rejected';
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <ErrorBoundary>
      <div style={{ minHeight: '100vh', backgroundColor: '#f4f4f4' }}>
        <ToastContainer />
        {/* Header with Small Logo and Language Switch */}
        <div className="text-center py-2" style={{ backgroundColor: '#28a745', color: '#fff' }}>
          <img src="/Agro2.png" alt="AgroConnect Mitr Logo" style={{ width: '40px', height: '40px' }} />
          <h1 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>{t('welcome')}</h1>
          <p style={{ fontSize: '0.875rem' }}>{t('tagline')}</p>
          <div className="d-flex justify-content-center flex-wrap">
            <button
              onClick={() => changeLanguage('en')}
              style={{ margin: '0.25rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
              className="btn btn-outline-light btn-sm"
            >
              EN
            </button>
            <button
              onClick={() => changeLanguage('mr')}
              style={{ margin: '0.25rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
              className="btn btn-outline-light btn-sm"
            >
              मर
            </button>
            <button
              onClick={() => changeLanguage('hi')}
              style={{ margin: '0.25rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
              className="btn btn-outline-light btn-sm"
            >
              हि
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <img
                src="/Agro2.png"
                alt="Logo"
                style={{ width: '40px', height: '40px', marginRight: '0.5rem' }}
              />
              {t('welcome')}
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/home"
                    style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
                  >
                    <FontAwesomeIcon icon={faHome} /> {t('home')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/jobdashboard"
                    style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
                  >
                    <FontAwesomeIcon icon={faTractor} /> {t('jobs')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/workerlogin"
                    style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
                  >
                    <FontAwesomeIcon icon={faUser} /> {t('worker')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/register"
                    style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
                  >
                    <FontAwesomeIcon icon={faUser} /> {t('farmer')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/about"
                    style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
                  >
                    <FontAwesomeIcon icon={faHome} /> {t('about')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/help"
                    style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
                  >
                    <FontAwesomeIcon icon={faQuestionCircle} /> {t('help')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Job Search Bar */}
        <div className="container-fluid mt-3">
          <h2 style={{ fontSize: '1.375rem', color: '#333', marginBottom: '0.75rem' }}>
            <FontAwesomeIcon icon={faTractor} /> {t('findJobs')}
          </h2>
          <div className="row mb-3">
            <div className="col-12 col-md-6 mx-auto">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder={t('searchJobs')}
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  style={{ padding: '0.75rem', fontSize: '0.875rem' }}
                />
                <button className="btn btn-outline-success" style={{ padding: '0.75rem' }}>
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-md-3 g-3">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <div key={job.jobid} className="col">
                  <div
                    className="card h-100"
                    style={{ border: '1px solid #ddd', cursor: 'pointer' }}
                    onClick={() => showJobDetails(job)}
                  >
                    <div className="card-body" style={{ padding: '0.75rem' }}>
                      <h5 style={{ fontSize: '1.125rem', color: '#333' }}>
                        <FontAwesomeIcon icon={faTractor} /> {job.title}
                      </h5>
                      <p style={{ fontSize: '0.875rem', color: '#666' }}>
                        <FontAwesomeIcon icon={faMapMarkerAlt} /> {job.location}
                      </p>
                      <p style={{ fontSize: '1rem', fontWeight: 'bold', color: '#28a745' }}>
                        <FontAwesomeIcon icon={faRupeeSign} /> {job.wage}/day
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#555' }}>
                        {job.description.slice(0, 50)}...
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p style={{ fontSize: '0.875rem', color: '#666' }}>
                  {t('noJobs')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Worker Search Section (Farmers Only) */}
        {isauth && userType === 'farmer' && (
          <div className="container-fluid mt-4">
            <h2 style={{ fontSize: '1.375rem', color: '#333', marginBottom: '0.75rem' }}>
              <FontAwesomeIcon icon={faUser} /> {t('findWorkers')}
            </h2>
            <div className="row mb-3">
              <div className="col-12 col-md-6 mx-auto">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={t('searchWorkers')}
                    value={workerSearch}
                    onChange={(e) => setWorkerSearch(e.target.value)}
                    style={{ padding: '0.75rem', fontSize: '0.875rem' }}
                  />
                  <button className="btn btn-outline-success" style={{ padding: '0.75rem' }}>
                    <FontAwesomeIcon icon={faSearch} />
                  </button>
                </div>
              </div>
            </div>
            <div className="row row-cols-1 row-cols-md-3 g-3">
              {filteredWorkers.length > 0 ? (
                filteredWorkers.map(worker => (
                  <div key={worker.workerid} className="col">
                    <div className="card h-100" style={{ border: '1px solid #ddd' }}>
                      <div className="card-body" style={{ padding: '0.75rem' }}>
                        <h5 style={{ fontSize: '1.125rem', color: '#333' }}>
                          <FontAwesomeIcon icon={faUser} /> {worker.name}
                        </h5>
                        <p style={{ fontSize: '0.875rem', color: '#666' }}>
                          Skills: {formatSkills(worker.skills_ofworker)}
                        </p>
                        <p style={{ fontSize: '1rem', fontWeight: 'bold', color: '#28a745' }}>
                          <FontAwesomeIcon icon={faRupeeSign} /> {worker.wage_per_day_ofworker}/day
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#555' }}>Contact: {worker.email}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center">
                  <p style={{ fontSize: '0.875rem', color: '#666' }}>
                    {t('noWorkers')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Job Details Modal with Step-by-Step Form */}
        {selectedJob && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header" style={{ backgroundColor: '#f8f9fa' }}>
                  <h5 style={{ fontSize: '1.25rem', color: '#333' }}>
                    <FontAwesomeIcon icon={faTractor} /> {selectedJob.title}
                  </h5>
                  <button type="button" className="btn-close" onClick={hideJobDetails}></button>
                </div>
                <div className="modal-body" style={{ padding: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <strong>{t('wage')}:</strong> <FontAwesomeIcon icon={faRupeeSign} /> {selectedJob.wage}/day
                  </p>
                  <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <strong>{t('location')}:</strong> <FontAwesomeIcon icon={faMapMarkerAlt} /> {selectedJob.location}
                  </p>
                  <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <strong>{t('farm')}:</strong> {selectedJob.farm_location}
                  </p>
                  <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <strong>{t('farmer')}:</strong> {selectedJob.farmer_name}
                  </p>
                  <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <strong>{t('about')}:</strong> {selectedJob.description}
                  </p>
                  <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <strong>{t('skills')}:</strong> {formatSkills(selectedJob.required_skills)}
                  </p>
                  <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <strong>{t('posted')}:</strong>{' '}
                    {new Date(selectedJob.posted_at).toLocaleDateString()}
                  </p>
                  {userType === 'worker' && applications.length > 0 && (
                    <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      <strong>{t('status')}:</strong> {getStatusBadge(selectedJob.jobid) || t('Not Applied')}
                    </p>
                  )}
                  {step === 1 && (
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => handleApply(selectedJob.jobid)}
                      disabled={isauth && userType === 'worker' && !canApply(selectedJob.jobid)}
                      style={{
                        padding: '0.75rem',
                        fontSize: '1rem',
                        backgroundColor: '#28a745',
                        borderColor: '#28a745',
                      }}
                    >
                      <FontAwesomeIcon icon={faCheckCircle} /> {t('apply')}
                    </button>
                  )}
                  {step === 2 && (
                    <div className="d-flex flex-column align-items-center">
                      <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', textAlign: 'center' }}>
                        {t('confirmApply', { selectedJob: selectedJob.title })}
                      </p>
                      <div className="d-flex justify-content-between w-100">
                        <button
                          className="btn btn-success flex-fill me-2"
                          onClick={() => handleApply(selectedJob.jobid)}
                          style={{ padding: '0.75rem', fontSize: '1rem' }}
                        >
                          <FontAwesomeIcon icon={faCheckCircle} /> {t('yes')}
                        </button>
                        <button
                          className="btn btn-danger flex-fill"
                          onClick={() => setStep(1)}
                          style={{ padding: '0.75rem', fontSize: '1rem' }}
                        >
                          <FontAwesomeIcon icon={faTimesCircle} /> {t('no')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default Jobfetch;








// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { AppContext } from '../Context/App_Context.jsx';
// import { ToastContainer, toast, Bounce } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useTranslation } from 'react-i18next';
// import i18n from '../Component/i18.jsx'; // Import configured i18n instance
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTractor, faUser, faSearch, faCheckCircle, faTimesCircle, faHome, faQuestionCircle, faMapMarkerAlt, faRupeeSign } from '@fortawesome/free-solid-svg-icons';

// // Simple error boundary component
// class ErrorBoundary extends React.Component {
//   state = { hasError: false };

//   static getDerivedStateFromError() {
//     return { hasError: true };
//   }

//   render() {
//     if (this.state.hasError) {
//       return <p style={{ textAlign: 'center', color: '#666', fontSize: '18px' }}>Something went wrong. Try again!</p>;
//     }
//     return this.props.children;
//   }
// }

// function Jobfetch() {
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//   const { fetchPublicJobs, applyToJob, fetchAvailableWorker, fetchJobs, isauth, fetchWorkerApplications } = useContext(AppContext);
//   const [jobs, setJobs] = useState([]);
//   const [workers, setWorkers] = useState([]);
//   const [jobSearch, setJobSearch] = useState('');
//   const [workerSearch, setWorkerSearch] = useState('');
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [applications, setApplications] = useState([]);
//   const [step, setStep] = useState(1); // For step-by-step form
//   const userType = localStorage.getItem('userType');
//   const workerData = JSON.parse(localStorage.getItem('workerData'));

//   useEffect(() => {
//     const getJobs = async () => {
//       const result = await fetchPublicJobs();
//       if (result.success) setJobs(result.jobs);
//       else if (isauth) {
//         const fallbackResult = await fetchJobs();
//         if (fallbackResult.success) setJobs(fallbackResult.jobs);
//       }
//     };
//     getJobs();

//     if (isauth && userType === 'farmer') {
//       const getWorkers = async () => {
//         const result = await fetchAvailableWorker();
//         if (result.success) setWorkers(result.workers);
//       };
//       getWorkers();
//     }

//     if (isauth && userType === 'worker' && workerData?.workerid) {
//       const getApplications = async () => {
//         const result = await fetchWorkerApplications(workerData.workerid);
//         if (result.success) {
//           const updatedApps = result.applications;
//           setApplications(updatedApps);
//           updatedApps.forEach(app => {
//             if (app.status !== 'APPLIED' && !app.notified) {
//               toast.info(`${t('Your application for "')}"${app.job_title}" ${t('is')} ${app.status.toLowerCase()}!`, {
//                 position: 'top-right', autoClose: 3000, theme: 'dark', transition: Bounce
//               });
//               app.notified = true;
//             }
//           });
//         }
//       };
//       getApplications();
//       const interval = setInterval(getApplications, 15000);
//       return () => clearInterval(interval);
//     }
//   }, [fetchPublicJobs, fetchAvailableWorker, fetchJobs, fetchWorkerApplications, isauth, userType, workerData, t]);

//   const filteredJobs = jobs.filter(job =>
//     job.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
//     job.location.toLowerCase().includes(jobSearch.toLowerCase())
//   );

//   const filteredWorkers = workers.filter(worker =>
//     worker.name.toLowerCase().includes(workerSearch.toLowerCase()) ||
//     (Array.isArray(worker.skills_ofworker) 
//       ? worker.skills_ofworker.some(skill => skill.toLowerCase().includes(workerSearch.toLowerCase()))
//       : worker.skills_ofworker.toLowerCase().includes(workerSearch.toLowerCase()))
//   );

//   const showJobDetails = (job) => {
//     console.log('Showing job details:', job); // Debug
//     setSelectedJob(job);
//     setStep(1); // Reset step when opening modal
//   };
//   const hideJobDetails = () => setSelectedJob(null);

//   const handleApply = async (jobId) => {
//     console.log('Applying, isauth:', isauth, 'userType:', userType); // Debug
//     if (!isauth || !userType) {
//       toast.info(t('Log in as a worker to apply'), { 
//         position: 'top-right', 
//         autoClose: 2000, 
//         theme: 'dark', 
//         transition: Bounce,
//         onClose: () => setTimeout(() => navigate('/workerlogin'), 500) // Delay redirect
//       });
//       return;
//     }
//     if (step === 1) {
//       setStep(2); // Move to confirmation step
//       return;
//     }
//     if (step === 2) {
//       const workerData = JSON.parse(localStorage.getItem('workerData'));
//       if (!workerData || !workerData.workerid) {
//         toast.error(t('Worker data missing'), { position: 'top-right', autoClose: 1500, theme: 'dark', transition: Bounce });
//         setTimeout(() => navigate('/workerlogin'), 1500);
//         return;
//       }
//       const result = await applyToJob(workerData.workerid, jobId, 'Interested');
//       if (result.success) {
//         toast.success(t('Applied!'), { position: 'top-right', autoClose: 1000, theme: 'dark', transition: Bounce });
//         const updatedApps = await fetchWorkerApplications(workerData.workerid);
//         if (updatedApps.success) setApplications(updatedApps.applications);
//         hideJobDetails();
//       } else {
//         toast.error(result.message, { position: 'top-right', autoClose: 1500, theme: 'dark', transition: Bounce });
//       }
//     }
//   };

//   const formatSkills = (skills) => {
//     if (!skills) return t('None');
//     if (Array.isArray(skills)) return skills.join(', ');
//     if (typeof skills === 'string') {
//       try { return JSON.parse(skills).join(', ') || skills.split(',').map(s => s.trim()).join(', '); }
//       catch { return skills.split(',').map(s => s.trim()).join(', '); }
//     }
//     return t('None');
//   };

//   const getStatusBadge = (jobId) => {
//     const app = applications.find(a => a.job_id === jobId);
//     if (!app) return null;
//     const badgeClass = app.status === 'accepted' ? 'bg-success' : app.status === 'rejected' ? 'bg-danger' : 'bg-warning';
//     return <span className={`badge ${badgeClass} text-white`}>{app.status}</span>;
//   };

//   const canApply = (jobId) => {
//     console.log('canApply check, isauth:', isauth, 'userType:', userType); // Debug
//     if (!isauth || !userType || userType !== 'worker') return false;
//     const app = applications.find(a => a.job_id === jobId);
//     return !app || app.status === 'rejected';
//   };

//   const changeLanguage = (lng) => {
//     console.log('Changing language to:', lng); // Debug
//     i18n.changeLanguage(lng); // Use the imported i18n instance
//   };

//   return (
//     <ErrorBoundary>
//       <div style={{ minHeight: '100vh', backgroundColor: '#f4f4f4' }}>
//         <ToastContainer />
//         {/* Header with Small Logo and Language Switch */}
//         <div className="text-center py-3" style={{ backgroundColor: '#28a745', color: '#fff' }}>
//           <img src="/Agro2.png" alt="AgroConnect Mitr Logo" style={{ width: '40px', height: '40px' }} />
//           <h1 style={{ fontSize: '24px', marginTop: '10px' }}>{t('welcome')}</h1>
//           <p style={{ fontSize: '16px' }}>{t('tagline')}</p>
//           <div>
//             <button onClick={() => changeLanguage('en')} style={{ margin: '5px', padding: '5px 10px', fontSize: '14px' }}>EN</button>
//             <button onClick={() => changeLanguage('mr')} style={{ margin: '5px', padding: '5px 10px', fontSize: '14px' }}>मर</button>
//             <button onClick={() => changeLanguage('hi')} style={{ margin: '5px', padding: '5px 10px', fontSize: '14px' }}>हि</button>
//           </div>
//         </div>

//         {/* Simplified Navigation */}
//         <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
//           <div className="container">
//             <Link className="navbar-brand" to="/">
//               <img src="/Agro2.png" alt="Logo" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
//               {t('welcome')}
//             </Link>
//             <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
//               <span className="navbar-toggler-icon"></span>
//             </button>
//             <div className="collapse navbar-collapse" id="navbarNav">
//               <ul className="navbar-nav ms-auto">
//                 <li className="nav-item"><Link className="nav-link" to="/home" style={{ fontSize: '18px', padding: '15px' }}><FontAwesomeIcon icon={faHome} /> {t('home')}</Link></li>
//                 <li className="nav-item"><Link className="nav-link" to="/jobdashoboard" style={{ fontSize: '18px', padding: '15px' }}><FontAwesomeIcon icon={faTractor} /> {t('jobs')}</Link></li>
//                 <li className="nav-item"><Link className="nav-link" to="/workerlogin" style={{ fontSize: '18px', padding: '15px' }}><FontAwesomeIcon icon={faUser} /> {t('workers')}</Link></li>
//                 <li className="nav-item"><Link className="nav-link" to="/register" style={{ fontSize: '18px', padding: '15px' }}><FontAwesomeIcon icon={faUser} /> {t('login')}</Link></li>
//                 <li className="nav-item"><Link className="nav-link" to="/about" style={{ fontSize: '18px', padding: '15px' }}><FontAwesomeIcon icon={faHome} /> {t('home')}</Link></li>
//                 <li className="nav-item"><Link className="nav-link" to="/help" style={{ fontSize: '18px', padding: '15px' }}><FontAwesomeIcon icon={faQuestionCircle} /> {t('help')}</Link></li>
//               </ul>
//             </div>
//           </div>
//         </nav>

//         {/* Job Search Bar */}
//         <div className="container mt-4">
//           <h2 style={{ fontSize: '22px', color: '#333', marginBottom: '15px' }}><FontAwesomeIcon icon={faTractor} /> {t('findJobs')}</h2>
//           <div className="row mb-4">
//             <div className="col-md-6 mx-auto">
//               <div className="input-group">
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder={t('searchJobs')}
//                   value={jobSearch}
//                   onChange={(e) => setJobSearch(e.target.value)}
//                   style={{ padding: '15px', fontSize: '16px' }}
//                 />
//                 <button className="btn btn-outline-success" style={{ padding: '15px' }}><FontAwesomeIcon icon={faSearch} /></button>
//               </div>
//             </div>
//           </div>
//           <div className="row">
//             {filteredJobs.length > 0 ? (
//               filteredJobs.map(job => (
//                 <div key={job.jobid} className="col-md-4 mb-3">
//                   <div className="card" style={{ border: '1px solid #ddd', cursor: 'pointer' }} onClick={() => showJobDetails(job)}>
//                     <div className="card-body" style={{ padding: '15px' }}>
//                       <h5 style={{ fontSize: '18px', color: '#333' }}><FontAwesomeIcon icon={faTractor} /> {job.title}</h5>
//                       <p style={{ fontSize: '16px', color: '#666' }}><FontAwesomeIcon icon={faMapMarkerAlt} /> {job.location}</p>
//                       <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}><FontAwesomeIcon icon={faRupeeSign} /> {job.wage}/day</p>
//                       <p style={{ fontSize: '14px', color: '#555' }}>{job.description.slice(0, 50)}...</p>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : <p style={{ fontSize: '16px', color: '#666', textAlign: 'center' }}>{t('noJobs')}</p>}
//           </div>
//         </div>

//         {/* Worker Search Section (Farmers Only) */}
//         {isauth && userType === 'farmer' && (
//           <div className="container mt-5">
//             <h2 style={{ fontSize: '22px', color: '#333', marginBottom: '15px' }}><FontAwesomeIcon icon={faUser} /> {t('findWorkers')}</h2>
//             <div className="row mb-4">
//               <div className="col-md-6 mx-auto">
//                 <div className="input-group">
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder={t('searchWorkers')}
//                     value={workerSearch}
//                     onChange={(e) => setWorkerSearch(e.target.value)}
//                     style={{ padding: '15px', fontSize: '16px' }}
//                   />
//                   <button className="btn btn-outline-success" style={{ padding: '15px' }}><FontAwesomeIcon icon={faSearch} /></button>
//                 </div>
//               </div>
//             </div>
//             <div className="row">
//               {filteredWorkers.length > 0 ? (
//                 filteredWorkers.map(worker => (
//                   <div key={worker.workerid} className="col-md-4 mb-3">
//                     <div className="card" style={{ border: '1px solid #ddd' }}>
//                       <div className="card-body" style={{ padding: '15px' }}>
//                         <h5 style={{ fontSize: '18px', color: '#333' }}><FontAwesomeIcon icon={faUser} /> {worker.name}</h5>
//                         <p style={{ fontSize: '16px', color: '#666' }}>Skills: {formatSkills(worker.skills_ofworker)}</p>
//                         <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}><FontAwesomeIcon icon={faRupeeSign} /> {worker.wage_per_day_ofworker}/day</p>
//                         <p style={{ fontSize: '14px', color: '#555' }}>Contact: {worker.email}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : <p style={{ fontSize: '16px', color: '#666', textAlign: 'center' }}>{t('noWorkers')}</p>}
//             </div>
//           </div>
//         )}

//         {/* Job Details Modal with Step-by-Step Form */}
//         {selectedJob && (
//           <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
//             <div className="modal-dialog modal-lg">
//               <div className="modal-content" style={{ borderRadius: '8px' }}>
//                 <div className="modal-header" style={{ backgroundColor: '#f8f9fa' }}>
//                   <h5 style={{ fontSize: '20px', color: '#333' }}><FontAwesomeIcon icon={faTractor} /> {selectedJob.title}</h5>
//                   <button type="button" className="btn-close" onClick={hideJobDetails}></button>
//                 </div>
//                 <div className="modal-body" style={{ padding: '20px' }}>
//                   <p style={{ fontSize: '16px', marginBottom: '15px' }}><strong>{t('wage')}:</strong> <FontAwesomeIcon icon={faRupeeSign} /> {selectedJob.wage}/day</p>
//                   <p style={{ fontSize: '16px', marginBottom: '15px' }}><strong>{t('location')}:</strong> <FontAwesomeIcon icon={faMapMarkerAlt} /> {selectedJob.location}</p>
//                   <p style={{ fontSize: '16px', marginBottom: '15px' }}><strong>{t('farm')}:</strong> {selectedJob.farm_location}</p>
//                   <p style={{ fontSize: '16px', marginBottom: '15px' }}><strong>{t('farmer')}:</strong> {selectedJob.farmer_name}</p>
//                   <p style={{ fontSize: '16px', marginBottom: '15px' }}><strong>{t('about')}:</strong> {selectedJob.description}</p>
//                   <p style={{ fontSize: '16px', marginBottom: '15px' }}><strong>{t('skills')}:</strong> {formatSkills(selectedJob.required_skills)}</p>
//                   <p style={{ fontSize: '16px', marginBottom: '15px' }}><strong>{t('posted')}:</strong> {new Date(selectedJob.posted_at).toLocaleDateString()}</p>
//                   {userType === 'worker' && applications.length > 0 && (
//                     <p style={{ fontSize: '16px', marginBottom: '15px' }}><strong>{t('status')}:</strong> {getStatusBadge(selectedJob.jobid) || t('Not Applied')}</p>
//                   )}
//                   {step === 1 && (
//                     <button
//                       className="btn btn-primary"
//                       onClick={() => handleApply(selectedJob.jobid)}
//                       disabled={isauth && userType === 'worker' && !canApply(selectedJob.jobid)}
//                       style={{ padding: '15px 30px', fontSize: '18px', backgroundColor: '#28a745', borderColor: '#28a745', width: '100%' }}
//                     >
//                       <FontAwesomeIcon icon={faCheckCircle} /> {t('apply')}
//                     </button>
//                   )}
//                   {step === 2 && (
//                     <div>
//                       <p style={{ fontSize: '16px', marginBottom: '15px' }}>{t('confirmApply', { selectedJob: selectedJob.title })}</p>
//                       <button
//                         className="btn btn-success"
//                         onClick={() => handleApply(selectedJob.jobid)}
//                         style={{ padding: '15px 30px', fontSize: '18px', marginRight: '10px', width: '45%' }}
//                       >
//                         <FontAwesomeIcon icon={faCheckCircle} /> {t('yes')}
//                       </button>
//                       <button
//                         className="btn btn-danger"
//                         onClick={() => setStep(1)}
//                         style={{ padding: '15px 30px', fontSize: '18px', width: '45%' }}
//                       >
//                         <FontAwesomeIcon icon={faTimesCircle} /> {t('no')}
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </ErrorBoundary>
//   );
// }

// export default Jobfetch;

// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { AppContext } from '../Context/App_Context.jsx';
// import { ToastContainer, toast, Bounce } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // Simple error boundary component
// class ErrorBoundary extends React.Component {
//   state = { hasError: false };

//   static getDerivedStateFromError() {
//     return { hasError: true };
//   }

//   render() {
//     if (this.state.hasError) {
//       return <p style={{ textAlign: 'center', color: '#666' }}>Something went wrong. Please try again.</p>;
//     }
//     return this.props.children;
//   }
// }

// function JobListings() {
//   const navigate = useNavigate();
//   const { fetchPublicJobs, applyToJob, fetchAvailableWorker, fetchJobs, isauth, fetchWorkerApplications } = useContext(AppContext);
//   const [jobs, setJobs] = useState([]); // Store all jobs
//   const [workers, setWorkers] = useState([]); // Store workers (for farmers)
//   const [jobSearch, setJobSearch] = useState(''); // Job search input
//   const [workerSearch, setWorkerSearch] = useState(''); // Worker search input
//   const [selectedJob, setSelectedJob] = useState(null); // Job for modal
//   const [applications, setApplications] = useState([]); // Store worker applications
//   const userType = localStorage.getItem('userType'); // Get user type
//   const workerData = JSON.parse(localStorage.getItem('workerData'));

//   // Load jobs, workers, and applications (if worker)
//   useEffect(() => {
//     // Fetch jobs
//     const getJobs = async () => {
//       const result = await fetchPublicJobs();
//       if (result.success) {
//         setJobs(result.jobs);
//         console.log('Public jobs fetched:', result.jobs); // Debug log
//       } else {
//         toast.error(`Failed to fetch public jobs: ${result.message}`, {
//           position: 'top-right',
//           autoClose: 1500,
//           theme: 'dark',
//           transition: Bounce
//         });
//         if (isauth) {
//           const fallbackResult = await fetchJobs();
//           if (fallbackResult.success) {
//             setJobs(fallbackResult.jobs);
//             console.log('Fallback jobs fetched:', fallbackResult.jobs); // Debug log
//           } else {
//             toast.error(`Fallback fetch failed: ${fallbackResult.message}`, {
//               position: 'top-right',
//               autoClose: 1500,
//               theme: 'dark',
//               transition: Bounce
//             });
//           }
//         }
//       }
//     };
//     getJobs();

//     // Fetch workers if user is a farmer
//     if (isauth && userType === 'farmer') {
//       const getWorkers = async () => {
//         const result = await fetchAvailableWorker();
//         if (result.success) {
//           setWorkers(result.workers);
//         } else {
//           toast.error(result.message, {
//             position: 'top-right',
//             autoClose: 1500,
//             theme: 'dark',
//             transition: Bounce
//           });
//         }
//       };
//       getWorkers();
//     }

//     // Fetch and poll applications if user is a worker
//     if (isauth && userType === 'worker' && workerData?.workerid) {
//       const getApplications = async () => {
//         const result = await fetchWorkerApplications(workerData.workerid);
//         if (result.success) {
//           const updatedApps = result.applications;
//           setApplications(updatedApps);
//           updatedApps.forEach(app => {
//             if (app.status !== 'APPLIED' && !app.notified) {
//               toast.info(`Your application for "${app.job_title}" has been ${app.status.toLowerCase()}!`, {
//                 position: 'top-right',
//                 autoClose: 3000,
//                 theme: 'dark',
//                 transition: Bounce
//               });
//               app.notified = true; // Simulated locally
//             }
//           });
//         } else {
//           toast.error(result.message, {
//             position: 'top-right',
//             autoClose: 1500,
//             theme: 'dark',
//             transition: Bounce
//           });
//         }
//       };
//       getApplications();
//       const interval = setInterval(getApplications, 15000); // Reduced to 15 seconds
//       return () => clearInterval(interval); // Cleanup on unmount
//     }
//   }, [fetchPublicJobs, fetchAvailableWorker, fetchJobs, fetchWorkerApplications, isauth, userType, workerData]);

//   // Filter jobs by title or location
//   const filteredJobs = jobs.filter(job =>
//     job.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
//     job.location.toLowerCase().includes(jobSearch.toLowerCase())
//   );

//   // Filter workers by name or skills
//   const filteredWorkers = workers.filter(worker =>
//     worker.name.toLowerCase().includes(workerSearch.toLowerCase()) ||
//     (Array.isArray(worker.skills_ofworker) 
//       ? worker.skills_ofworker.some(skill => skill.toLowerCase().includes(workerSearch.toLowerCase()))
//       : worker.skills_ofworker.toLowerCase().includes(workerSearch.toLowerCase()))
//   );

//   // Open job details modal
//   const showJobDetails = (job) => {
//     setSelectedJob(job);
//   };

//   // Close job details modal
//   const hideJobDetails = () => {
//     setSelectedJob(null);
//   };

//   // Apply to a job
//   const handleApply = async (jobId) => {
//     if (!isauth || !userType) {
//       toast.info('Please log in as a worker to apply', {
//         position: 'top-right',
//         autoClose: 1500,
//         theme: 'dark',
//         transition: Bounce
//       });
//       setTimeout(() => navigate('/workerlogin'), 1500);
//       return;
//     }
//     const workerData = JSON.parse(localStorage.getItem('workerData'));
//     if (!workerData || !workerData.workerid) {
//       toast.error('Worker data not found', {
//         position: 'top-right',
//         autoClose: 1500,
//         theme: 'dark',
//         transition: Bounce
//       });
//       setTimeout(() => navigate('/workerlogin'), 1500);
//       return;
//     }
//     const result = await applyToJob(workerData.workerid, jobId, 'Interested');
//     if (result.success) {
//       toast.success('Applied successfully!', {
//         position: 'top-right',
//         autoClose: 1000,
//         theme: 'dark',
//         transition: Bounce
//       });
//       const updatedApps = await fetchWorkerApplications(workerData.workerid);
//       if (updatedApps.success) setApplications(updatedApps.applications);
//       hideJobDetails();
//     } else {
//       toast.error(result.message, {
//         position: 'top-right',
//         autoClose: 1500,
//         theme: 'dark',
//         transition: Bounce
//       });
//     }
//   };

//   // Format skills for display
//   const formatSkills = (skills) => {
//     if (!skills) return 'None';
//     if (Array.isArray(skills)) return skills.join(', ');
//     if (typeof skills === 'string') {
//       try {
//         const parsed = JSON.parse(skills);
//         if (Array.isArray(parsed)) return parsed.join(', ');
//         return skills.split(',').map(s => s.trim()).join(', ');
//       } catch {
//         return skills.split(',').map(s => s.trim()).join(', ');
//       }
//     }
//     return 'None';
//   };

//   const getStatusBadge = (jobId) => {
//     const app = applications.find(a => a.job_id === jobId);
//     if (!app) return null;
//     const badgeClass = app.status === 'accepted' ? 'bg-success' : app.status === 'rejected' ? 'bg-danger' : 'bg-warning';
//     return <span className={`badge ${badgeClass} text-white`}>{app.status}</span>;
//   };

//   const canApply = (jobId) => {
//     if (!isauth || !userType) return false;
//     if (userType !== 'worker') return false;
//     const app = applications.find(a => a.job_id === jobId);
//     return !app || app.status === 'rejected'; // Allow apply if no app or rejected
//   };

//   return (
//     <ErrorBoundary>
//       <div style={{ minHeight: '100vh', backgroundColor: '#f4f4f4' }}>
//         <ToastContainer />
//         {/* Header with Small Logo */}
//         <div className="text-center py-3" style={{ backgroundColor: '#28a745', color: '#fff' }}>
//           <img src="/Agro2.png" alt="AgroConnect Mitr Logo" style={{ width: '40px', height: '40px' }} />
//           <h1 className="mt-2" style={{ fontSize: '24px' }}>Welcome to AgroConnect Mitr</h1>
//           <p className="lead" style={{ fontSize: '14px' }}>Find jobs or workers in agriculture!</p>
//         </div>

//         {/* Navigation Bar */}
//         <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
//           <div className="container">
//             <Link className="navbar-brand" to="/">
//               <img src="/Agro2.png" alt="Logo" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
//               AgroConnect Mitr
//             </Link>
//             <button
//               className="navbar-toggler"
//               type="button"
//               data-bs-toggle="collapse"
//               data-bs-target="#navbarNav"
//               aria-controls="navbarNav"
//               aria-expanded="false"
//               aria-label="Toggle navigation"
//             >
//               <span className="navbar-toggler-icon"></span>
//             </button>
//             <div className="collapse navbar-collapse" id="navbarNav">
//               <ul className="navbar-nav ms-auto">
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/login" style={{ padding: '8px 15px' }}>
//                     Farmer Login
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/workerlogin" style={{ padding: '8px 15px' }}>
//                     Worker Login
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/about" style={{ padding: '8px 15px' }}>
//                     About
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/contact" style={{ padding: '8px 15px' }}>
//                     Contact
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </nav>

//         {/* Job Search Bar */}
//         <div className="container mt-4">
//           <h2 style={{ fontSize: '24px', color: '#333', marginBottom: '15px' }}>Find Jobs</h2>
//           <div className="row mb-4">
//             <div className="col-md-6 mx-auto">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Search jobs by title or location..."
//                 value={jobSearch}
//                 onChange={(e) => setJobSearch(e.target.value)}
//                 style={{ padding: '10px', fontSize: '14px' }}
//               />
//             </div>
//           </div>

//           {/* Job Listings */}
//           <div className="row">
//             {filteredJobs.length > 0 ? (
//               filteredJobs.map(job => (
//                 <div key={job.jobid} className="col-md-4 mb-3">
//                   <div
//                     className="card"
//                     style={{
//                       border: '1px solid #ddd',
//                       cursor: 'pointer',
//                       transition: 'box-shadow 0.3s'
//                     }}
//                     onClick={() => showJobDetails(job)}
//                   >
//                     <div className="card-body" style={{ padding: '15px' }}>
//                       <h5 className="card-title" style={{ fontSize: '18px', color: '#333' }}>
//                         {job.title}
//                       </h5>
//                       <p className="card-text" style={{ fontSize: '14px', color: '#666' }}>
//                         {job.location}
//                       </p>
//                       <p className="card-text" style={{ fontSize: '16px', fontWeight: 'bold', color: '#28a745' }}>
//                         ₹{job.wage}/day
//                       </p>
//                       <p className="card-text" style={{ fontSize: '13px', color: '#555' }}>
//                         {job.description.slice(0, 80)}...
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="col-12 text-center">
//                 <p style={{ fontSize: '16px', color: '#666' }}>No jobs found.</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Worker Search Section (Farmers Only) */}
//         {isauth && userType === 'farmer' && (
//           <div className="container mt-5">
//             <h2 style={{ fontSize: '24px', color: '#333', marginBottom: '15px' }}>Find Workers</h2>
//             <div className="row mb-4">
//               <div className="col-md-6 mx-auto">
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Search workers by name or skills..."
//                   value={workerSearch}
//                   onChange={(e) => setWorkerSearch(e.target.value)}
//                   style={{ padding: '10px', fontSize: '14px' }}
//                 />
//               </div>
//             </div>
//             <div className="row">
//               {filteredWorkers.length > 0 ? (
//                 filteredWorkers.map(worker => (
//                   <div key={worker.workerid} className="col-md-4 mb-3">
//                     <div className="card" style={{ border: '1px solid #ddd' }}>
//                       <div className="card-body" style={{ padding: '15px' }}>
//                         <h5 className="card-title" style={{ fontSize: '18px', color: '#333' }}>
//                           {worker.name}
//                         </h5>
//                         <p className="card-text" style={{ fontSize: '14px', color: '#666' }}>
//                           Skills: {formatSkills(worker.skills_ofworker)}
//                         </p>
//                         <p className="card-text" style={{ fontSize: '16px', fontWeight: 'bold', color: '#28a745' }}>
//                           ₹{worker.wage_per_day_ofworker}/day
//                         </p>
//                         <p className="card-text" style={{ fontSize: '13px', color: '#555' }}>
//                           Contact: {worker.email}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="col-12 text-center">
//                   <p style={{ fontSize: '16px', color: '#666' }}>No workers found.</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Job Details Modal */}
//         {selectedJob && (
//           <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
//             <div className="modal-dialog modal-lg">
//               <div className="modal-content" style={{ borderRadius: '8px' }}>
//                 <div className="modal-header" style={{ backgroundColor: '#f8f9fa' }}>
//                   <h5 className="modal-title" style={{ color: '#333' }}>{selectedJob.title}</h5>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={hideJobDetails}
//                   ></button>
//                 </div>
//                 <div className="modal-body" style={{ padding: '15px' }}>
//                   <p style={{ marginBottom: '10px' }}>
//                     <strong style={{ color: '#555' }}>Wage:</strong> ₹{selectedJob.wage}/day
//                   </p>
//                   <p style={{ marginBottom: '10px' }}>
//                     <strong style={{ color: '#555' }}>Location:</strong> {selectedJob.location}
//                   </p>
//                   <p style={{ marginBottom: '10px' }}>
//                     <strong style={{ color: '#555' }}>Farm:</strong> {selectedJob.farm_location}
//                   </p>
//                   <p style={{ marginBottom: '10px' }}>
//                     <strong style={{ color: '#555' }}>Farmer:</strong> {selectedJob.farmer_name}
//                   </p>
//                   <p style={{ marginBottom: '10px' }}>
//                     <strong style={{ color: '#555' }}>Description:</strong> {selectedJob.description}
//                   </p>
//                   <p style={{ marginBottom: '10px' }}>
//                     <strong style={{ color: '#555' }}>Skills:</strong> {formatSkills(selectedJob.required_skills)}
//                   </p>
//                   <p style={{ marginBottom: '10px' }}>
//                     <strong style={{ color: '#555' }}>Posted:</strong> {new Date(selectedJob.posted_at).toLocaleDateString()}
//                   </p>
//                   {userType === 'worker' && applications.length > 0 && (
//                     <p style={{ marginBottom: '10px' }}>
//                       <strong style={{ color: '#555' }}>Your Status:</strong> {getStatusBadge(selectedJob.jobid) || 'Not Applied'}
//                     </p>
//                   )}
//                 </div>
//                 <div className="modal-footer">
//                   <button
//                     type="button"
//                     className="btn btn-secondary"
//                     onClick={hideJobDetails}
//                     style={{ padding: '8px 15px' }}
//                   >
//                     Close
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-primary"
//                     onClick={() => handleApply(selectedJob.jobid)}
//                     disabled={isauth && userType === 'worker' && !canApply(selectedJob.jobid)}
//                     style={{ padding: '8px 15px', backgroundColor: '#28a745', borderColor: '#28a745' }}
//                   >
//                     Apply
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </ErrorBoundary>
//   );
// }

// export default JobListings;