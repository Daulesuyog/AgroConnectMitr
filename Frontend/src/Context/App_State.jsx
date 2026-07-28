import { useEffect, useState } from "react";
import { AppContext } from "./App_Context.jsx";
import axios from "axios";

function AppState({ children }) {
  // const url = "http://localhost:3000/api";
  const url = import.meta.env.VITE_API_URL;

  const [token, settoken] = useState('');
  const [isauth, setisauth] = useState(false);
  const [reload, setreload] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
    const tokenFromLocalStorage = localStorage.getItem('token');
    if (tokenFromLocalStorage) {
      settoken(tokenFromLocalStorage);
      setisauth(true);
    }
  }, [token, reload]);

  const fetchPublicJobs = async () => {
    try {
      const api = await axios.get(`${url}/job/public`, {
        headers: { "Content-Type": "application/json" }
      });
      return { success: true, jobs: api.data.jobs || [] };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch jobs" };
    }
  };

  // Farmer Functions
  const farmerRegister = async (name, email, phone, password, farm_intro, worker_requirement, farm_location) => {
    const api = await axios.post(
      `${url}/farmer/register`,
      { name, email, phone, password, farm_intro, worker_requirement, farm_location },
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );
    settoken(api.data.token);
    localStorage.setItem('token', api.data.token);
    setisauth(true);
    return api;
  };

  const farmerLogin = async (email, password) => {
    try {
      const api = await axios.post(
        `${url}/farmer/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      settoken(api.data.token);
      localStorage.setItem("token", api.data.token);
      localStorage.setItem("userType", "farmer");
      localStorage.setItem("farmerData", JSON.stringify(api.data.farmer));
      setisauth(true);
      return { success: true, data: api.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  const createJob = async (farmer_id, title, description, location, wage, required_skills) => {
    try {
      const api = await axios.post(
        `${url}/job/create`,
        { farmer_id, title, description, location, wage, required_skills },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token || localStorage.getItem('token') || ''}` }, withCredentials: true }
      );
      return { success: true, job: api.data.job, message: api.data.message || "Job posted successfully" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to post job" };
    }
  };

  const fetchJobs = async () => {
    try {
      const api = await axios.get(`${url}/job/`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token || localStorage.getItem('token') || ''}` },
        withCredentials: true
      });
      return { success: true, jobs: api.data.jobs || [] };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch jobs" };
    }
  };

  const fetchApplicationByJob = async (jobid) => {
    try {
      const api = await axios.get(`${url}/application/job/${jobid}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token || localStorage.getItem('token') || ''}` },
        withCredentials: true
      });
      return { success: true, applications: api.data.applications || [] };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch applications" };
    }
  };

  const updateApplicationStatus = async (id, status) => {
    try {
      const api = await axios.put(
        `${url}/application/status`,
        { id, status },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token || localStorage.getItem('token') || ''}` }, withCredentials: true }
      );
      return { success: true, application: api.data.application, message: api.data.message || "Status updated" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to update status" };
    }
  };

  // Worker Functions
  const workerRegister = async (name, email, phone, password, skills_ofworker, capacity_ofworker, wage_per_day_ofworker, wage_per_month_ofworker) => {
    try {
      const api = await axios.post(
        `${url}/worker/register`,
        { name, email, phone, password, skills_ofworker, capacity_ofworker, wage_per_day_ofworker, wage_per_month_ofworker },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      settoken(api.data.token);
      localStorage.setItem('token', api.data.token);
      setisauth(true);
      return { success: true, data: api.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Registration failed" };
    }
  };

  const workerLogin = async (email, password) => {
    try {
      const res = await axios.post(`${url}/worker/login`, { email, password }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });
      settoken(res.data.token);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userType", "worker");
      localStorage.setItem("workerData", JSON.stringify(res.data.worker));
      setisauth(true);
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Login failed" };
    }
  };

  const fetchAvailableWorker = async () => {
    try {
      const api = await axios.get(`${url}/worker/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || localStorage.getItem('token') || ''}`
        },
        withCredentials: true
      });
      return { success: true, workers: api.data.workers || [] };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch workers" };
    }
  };

  const fetchWorkerJobs = async () => {
    try {
      const api = await axios.get(`${url}/job/`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token || localStorage.getItem('token') || ''}` },
        withCredentials: true
      });
      return { success: true, jobs: api.data.jobs || [] };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch jobs" };
    }
  };

  const applyToJob = async (worker_id, job_id, message) => {
    try {
      const api = await axios.post(
        `${url}/application/apply`,
        { worker_id, job_id, message },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token || localStorage.getItem('token') || ''}` }, withCredentials: true }
      );
      return { success: true, application: api.data.application, message: api.data.message || "Applied successfully" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to apply" };
    }
  };

  const fetchWorkerApplications = async (worker_id) => {
    try {
      const api = await axios.get(`${url}/application/worker/${worker_id}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token || localStorage.getItem('token') || ''}` },
        withCredentials: true
      });
      return { success: true, applications: api.data.applications || [] };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch applications" };
    }
  };

  const deleteApplication = async (id) => {
    try {
      const api = await axios.delete(`${url}/application/delete/${id}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token || localStorage.getItem('token') || ''}` },
        withCredentials: true
      });
      return { success: true, application: api.data.application, message: api.data.message || "Deleted successfully" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to delete" };
    }
  };

  const contact = async (name, email, subject, message) => {
  try {
    const api = await axios.post(`${url}/contact`, {
      name,
      email,
      subject,
      message
    }, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true
    });
    return { success: true, message: api.data.message || "Message sent successfully" };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Failed to send message" };
  }
};


  const logoutUser = () => {
    settoken('');
    setisauth(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('farmerData');
    localStorage.removeItem('workerData');
    setreload(true);
    return { success: true, message: "Logged out" };
  };

  // Payment Functions (post-registration UPI update)
    // const updateUPI = async (upi_id) => {
    //     try {
    //         const userType = localStorage.getItem('userType');
    //         const userId = userType === 'farmer' ? JSON.parse(localStorage.getItem('farmerData'))?.farmerid : JSON.parse(localStorage.getItem('workerData'))?.workerid;
    //         const api = await axios.put(
    //             `${url}/payment/update-upi`,
    //             { user_id: userId, upi_id },
    //             { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token || localStorage.getItem('token') || ''}` }, withCredentials: true }
    //         );
    //         return { success: true, message: api.data.message || "UPI updated successfully" };
    //     } catch (error) {
    //         return { success: false, message: error.response?.data?.message || "Failed to update UPI" };
    //     }
    // };

    // const getUPI = async (targetUserId) => {
    //     try {
    //         const api = await axios.get(
    //             `${url}/payment/get-upi/${targetUserId}`,
    //             { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token || localStorage.getItem('token') || ''}` }, withCredentials: true }
    //         );
    //         return { success: true, upi_id: api.data.upi_id };
    //     } catch (error) {
    //         return { success: false, message: error.response?.data?.message || "Failed to fetch UPI" };
    //     }
    // };

    // const uploadScreenshot = async (targetUserId, imageData) => {
    //     try {
    //         const userType = localStorage.getItem('userType');
    //         const userId = userType === 'farmer' ? JSON.parse(localStorage.getItem('farmerData'))?.farmerid : JSON.parse(localStorage.getItem('workerData'))?.workerid;
    //         const api = await axios.post(
    //             `${url}/payment/screenshot`,
    //             { user_id: userId, target_id: targetUserId, screenshot: imageData },
    //             { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token || localStorage.getItem('token') || ''}` }, withCredentials: true }
    //         );
    //         return { success: true, message: api.data.message || "Screenshot uploaded successfully" };
    //     } catch (error) {
    //         return { success: false, message: error.response?.data?.message || "Failed to upload screenshot" };
    //     }
    // };

 

  return (
    <AppContext.Provider
      value={{
        token,
         isauth, 
         reload, setreload,
        fetchPublicJobs, farmerRegister, farmerLogin, createJob, fetchJobs, fetchApplicationByJob, updateApplicationStatus,
        workerRegister, workerLogin, fetchAvailableWorker, fetchWorkerJobs, applyToJob, fetchWorkerApplications, deleteApplication,
        contact, logoutUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppState;