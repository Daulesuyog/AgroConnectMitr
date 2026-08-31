
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Jobfetch from "./Pages/Jobfetch.jsx";
import Home from './Pages/Home.jsx';
import About from './Pages/AboutUs.jsx';
import Contact from './Pages/Contact.jsx';
import Help from './Pages/Help.jsx';
import FarmerRegister from './Pages/FarmerRegister.jsx';
import Farmerlogin from './Pages/Farmerlogin.jsx';
import FarmerDashboard from './Component/FarmerDashboard.jsx';
import WorkerRegister from "./Pages/Workerregister.jsx";
import WorkerLogin from './Pages/WorkerLogin.jsx';
import WorkerDashboard from './Component/WorkerDashboard.jsx';
import JobDashboard from './Component/jobDasboard.jsx';
import ApplicationDashboard from './Component/ApplicationDashboard.jsx';
// import PaymentDetails from './Pages/PaymentDetails.jsx';


const App = () => {
  return (
    <Router>
        <Routes>
          <Route path='/' element= {<Jobfetch />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<FarmerRegister />} />
          <Route path='/login' element={<Farmerlogin /> } />
          <Route path='/workerregister' element= {<WorkerRegister />} />
          <Route path='/workerlogin' element= {< WorkerLogin />} />
          {/* <Route path="/paymentdetails" element={<PaymentDetails />} /> */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
           <Route path="/help" element={<Help />} />
          <Route path="/farmerdashboard" element={<FarmerDashboard />} />
           <Route path="/workerdashboard" element={<WorkerDashboard />} />
           <Route path="/jobdashboard" element={<JobDashboard />} />
           <Route path="/applicationdashboard/" element={<ApplicationDashboard />} />
           <Route path="/applicationdashboard/:jobid" element={<ApplicationDashboard />} />
        </Routes>
      
    </Router>
  );
};

export default App;