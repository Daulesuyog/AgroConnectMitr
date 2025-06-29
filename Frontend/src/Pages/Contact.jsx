import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { AppContext } from '../Context/App_Context.jsx';

function Contact() {
  const { t } = useTranslation();
  const { contact } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await contact(formData.name, formData.email, formData.subject, formData.message);
      setStatus({ type: 'success', message: result.message || 
        t('contactSuccess', { defaultValue: 'Message received successfully!' }) });
      setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
    } catch (error) {
      setStatus({ type: 'error', message: t('contactError', { defaultValue: 'Failed to send your message. Please try again.' }) });
      console.error('Error submitting form:', error);
    }
  };

  return (
    <section className="bg-success py-5" id="contact">
      <div className="container">
        <h2 className="text-center mb-4">{t('contactTitle', { defaultValue: 'Contact Us' })}</h2>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label text-white">{t('yourName', { defaultValue: 'Your Name' })}</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('yourName', { defaultValue: 'Your Name' })}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label text-white">{t('yourEmail', { defaultValue: 'Your Email' })}</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('yourEmail', { defaultValue: 'Your Email' })}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="subject" className="form-label text-white">{t('subject', { defaultValue: 'Subject' })}</label>
                <input
                  type="text"
                  className="form-control"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={t('subject', { defaultValue: 'Subject' })}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="message" className="form-label text-white">{t('message', { defaultValue: 'Message' })}</label>
                <textarea
                  className="form-control"
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder={t('message', { defaultValue: 'Message' })}
                  required
                ></textarea>
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-outline-light px-4 py-2 fw-semibold">{t('sendMessage', { defaultValue: 'Send message' })}</button>
              </div>
              {status && (
                <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'} mt-3`} role="alert">
                  {status.message}
                </div>
              )}
            </form>
            <div className="d-flex justify-content-center mt-4">
              <button type="button" className="btn btn-outline-light fw-semibold">
                <Link to="/" className="text-white text-decoration-none">{t('home', { defaultValue: 'Home' })}</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;