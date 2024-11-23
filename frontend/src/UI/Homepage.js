import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTicketAlt, faUserShield, faBell, faSignInAlt, faUserPlus,faHeadset } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

const Homepage = () => {
  return (
    <div>
      {/* Header */}
      <header className="bg-primary text-white text-center py-3">
        <h1>
          <FontAwesomeIcon icon={faHeadset} /> Helpdesk
        </h1>
      </header>

      {/* Welcome Message */}
      <div className="container mt-4">
        <div className="text-center">
          <h2>Welcome to Helpdesk Tool</h2>
          <p>Your one-stop solution for managing issues and tickets efficiently.</p>
        </div>

        {/* Key Features */}
        <div className="row mt-5">
          <div className="col-md-4 text-center">
            <FontAwesomeIcon icon={faTicketAlt} size="3x" className="text-primary mb-3" />
            <h4>Submit Tickets</h4>
            <p>Report your issues quickly and track their resolution status.</p>
          </div>
          <div className="col-md-4 text-center">
            <FontAwesomeIcon icon={faUserShield} size="3x" className="text-primary mb-3" />
            <h4>Role-Based Access</h4>
            <p>Admins can manage tickets while users focus on reporting issues.</p>
          </div>
          <div className="col-md-4 text-center">
            <FontAwesomeIcon icon={faBell} size="3x" className="text-primary mb-3" />
            <h4>Notifications</h4>
            <p>Stay informed with real-time updates on ticket progress.</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="text-center mt-5">
          <a href="/auth" className="btn btn-primary mx-2">
            <FontAwesomeIcon icon={faSignInAlt} /> Login
          </a>
          <a href="/auth" className="btn btn-success mx-2">
            <FontAwesomeIcon icon={faUserPlus} /> Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
