import React, {useContext, useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../Context/App_Context.jsx";
import { ToastContainer, toast, Bounce } from 'react-toastify';

function WorkerRegister () {
    const navigate = useNavigate();
    const {workerRegister} = useContext(AppContext);
    const [name, setname] = useState('');
    const [email, setemail] = useState('');
    const [phone, setphone] = useState('');
    const[password, setpassword] = useState('');
    const[confirmPassword, setconfirmPassword] = useState('');
    const[skill, setskill] = useState('');
    const[capacity , setcapacity] = useState('');
    const[wageday, setwageday] = useState('');
    const[wagemonth, setwagemonth] = useState('');
    const passwordMatch = password === confirmPassword;

    const registerHandler= async(e)=> {
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
            try{
             const result = await workerRegister (
                name, email, phone, password, skill, capacity, wageday, wagemonth);
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
                      if(result.data.message !== 'Worker Already exist'){
        setTimeout(()=>{
            navigate("/workerdashboard" );
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
                }
                return(
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
            <h2 className="text-3xl font-bold text-gray-800">
              Register as <span className="text-primary">Worker</span>
            </h2>
            <p className="text-gray-600 mt-2">Join AgroConnectMitr to find agricultural jobs</p>
          </div>

          <form onSubmit={registerHandler} className="space-y-4">
             <div className="mb-3">
              <label htmlFor="name" className="form-label text-gray-700 fw-bold">
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
              />
            </div>

            <div>
              <label className="form-label text-gray-700 fw-bold">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setemail (e.target.value)}
                required
                className="form-control"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="form-label text-gray-700 fw-bold">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={(e)=> setphone (e.target.value)}
                required
                className="form-control"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="form-label text-gray-700 fw-bold">
                Skills *
              </label>
              <textarea
                name="skills_ofworker"
                value={skill}
                onChange={(e) => setskill (e.target.value)}
                required
                rows="3"
                className="form-control"
                placeholder="List your agricultural skills (e.g., planting, harvesting, irrigation...)"
              />
            </div>

            <div>
              <label className="form-label text-gray-700 fw-bold">
                Work Capacity
              </label>
              <textarea
                name="capacity_ofworker"
                value={capacity}
                onChange={(e) => setcapacity(e.target.value)}
                rows="2"
                className="form-control"
                placeholder="Describe your work capacity and availability..."
              />
            </div>

            <div className="row">
              <div className="col-md-6">
                <label className="form-label text-gray-700 fw-bold">
                  Daily Wage (₹) *
                </label>
                <input
                  type="number"
                  name="wage_per_day_ofworker"
                  value={wageday}
                  onChange={(e) => setwageday (e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  className="form-control"
                  placeholder="500"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-gray-700 fw-bold">
                  Monthly Wage (₹) *
                </label>
                <input
                  type="number"
                  name="wage_per_month_ofworker"
                  value={wagemonth}
                  onChange={(e)=> setwagemonth(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  className="form-control"
                  placeholder="15000"
                />
              </div>
            </div>

            <div>
              <label className="form-label text-gray-700 fw-bold">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setpassword (e.target.value)}
                required
                className="form-control"
                placeholder="Create a password"
              />
            </div>

             <div className="mb-3">
          <label className="form-label">Confirm Password *</label>
          <input
            type="password"
            className={`form-control ${confirmPassword.length > 0 ? (passwordMatch ? 'is-valid' : 'is-invalid') : ''}`}
            required
            value={confirmPassword}
            onChange={(e) => setconfirmPassword(e.target.value)}
            placeholder="Confirm password"
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
              borderColor: '#28a745',
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
            Register as Worker
          </button>
        </div>
          </form>

          <div className="text-center mt-4">
        <p>
          Already have an account?{' '}
          <button className="btn  fw-bold px-3" style={{background:"blue", border:'2px solid black'}}>
            <Link to='/workerlogin' className="text-white text-decoration-none">
              Login here
            </Link>
          </button>
        </p>
        <p className="mt-2">
          Want to hire workers?{' '}
          <button className="btn fw-bold px-4"  style={{background:"green", border:'2px solid black'}}>
            <Link to="/register" className="text-white text-decoration-none">
              Register as Farmer
            </Link>
          </button>
        </p>
      </div>
        </div>
      </div>
                    </>
                )
            }
export default WorkerRegister;