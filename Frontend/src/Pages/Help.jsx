import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Help() {
  const { t } = useTranslation();

  return (
    <section className="bg-success py-5" id="help">
      <div className="container">
        <h2 className="text-center mb-4">{t('helpTitle')}</h2>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="mb-4">
              <h4 className="text-white">{t('faqSection')}</h4>
              <p className="text-white">{t('faq1')}</p>
              <p className="text-white">{t('faq2')}</p>
            </div>
            <div className="mb-4">
              <h4 className="text-white">{t('guideSection')}</h4>
              <ul className="text-white">
                <li>{t('guide1')}</li>
                <li>{t('guide2')}</li>
                <li>{t('guide3')}</li>
              </ul>
            </div>
            <div className="text-center">
              <button className="btn btn-outline-light px-4 py-2 fw-semibold">
                <Link to="/contact" className="text-white text-decoration-none">{t('contactSupport')}</Link>
              </button>
            </div>
            <div className="d-flex justify-content-center mt-4">
              <button type="button" className="btn btn-outline-light fw-semibold">
                <Link to="/" className="text-white text-decoration-none">{t('home')}</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Help;