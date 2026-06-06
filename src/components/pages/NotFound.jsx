import React from 'react';
import { Link } from 'react-router';
import { Helmet } from 'react-helmet-async';
import './NotFound.css';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page not found | Lexodd</title>
        <meta
          name="description"
          content="The page you are looking for could not be found. Return to Lexodd or explore our work."
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <section className="not-found section">
        <div className="container not-found__inner">
          <div className="not-found__content">
            <span className="label">404 / Page not found</span>
            <h1>We could not find that page.</h1>
            <p>
              The link may have moved, or the address may be typed incorrectly.
              Start from the homepage or jump into the areas most visitors need.
            </p>

            <div className="not-found__actions">
              <Link className="cta ot_cta not-found__primary" to="/">
                <span>Back to home</span>
              </Link>
              <Link className="cta cta3" to="/contact">
                Contact us
              </Link>
            </div>
          </div>

          <div className="not-found__panel" aria-hidden="true">
            <div className="not-found__code">404</div>
            <div className="not-found__grid">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
