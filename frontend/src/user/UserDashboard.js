import React, { useEffect, useState } from "react";
import { useTicket } from "../context/TicketContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTicketAlt,
  faCheckCircle,
  faHourglassHalf,
  faPlusCircle,
  faSignOutAlt,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";

const UserDashboard = () => {
  const { tickets, fetchTickets, loading, error } = useTicket();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTickets(); // Fetch tickets on component mount
  }, []);

  // Filter logic
  const filteredTickets =
    filter === "all"
      ? tickets
      : tickets.filter((ticket) => ticket.status.toLowerCase() === filter);

  const handleCreateTicket = () => {
    navigate("/ticket");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Overview Counts
  const ticketCounts = {
    Active: tickets.filter((t) => t.status === "Active").length,
    Resolved: tickets.filter((t) => t.status === "Resolved").length,
    Pending: tickets.filter((t) => t.status === "Pending").length,
  };

  return (
    <div
      className="container-fluid"
      style={{
        backgroundColor: "#F0F0F0",
        minHeight: "100vh",
        padding: "30px 100px", // More space left and right
      }}
    >
      {/* Header Section */}
      <div
        className="card shadow-sm mb-4"
        style={{ backgroundColor: "#fff", padding: "15px 20px" }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="text-primary">
            <FontAwesomeIcon icon={faHeadset} />
            Helpdesk Dashboard
          </h1>
          <div>
            <button
              className="btn btn-primary me-2"
              onClick={handleCreateTicket}
            >
              <FontAwesomeIcon icon={faPlusCircle} className="me-1" />
              Create Ticket
            </button>
            <button className="btn btn-secondary" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Overview Boxes */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <FontAwesomeIcon
                icon={faTicketAlt}
                className="text-primary mb-2"
                size="3x"
              />
              <h5 className="text-primary">Active Tickets</h5>
              <h2 className="text-dark">{ticketCounts.Active}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-success mb-2"
                size="3x"
              />
              <h5 className="text-success">Resolved Tickets</h5>
              <h2 className="text-dark">{ticketCounts.Resolved}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <FontAwesomeIcon
                icon={faHourglassHalf}
                className="text-warning mb-2"
                size="3x"
              />
              <h5 className="text-warning">Pending Tickets</h5>
              <h2 className="text-dark">{ticketCounts.Pending}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Tickets Section */}
      <div className="card shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 className="m-0">Tickets Overview</h5>
          <select
            className="form-select w-auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div className="card-body">
          {loading ? (
            <p>Loading tickets...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : filteredTickets.length === 0 ? (
            <p>No tickets to display.</p>
          ) : (
            filteredTickets.map((ticket) => (
              <div
                key={ticket._id}
                className="p-3 mb-3 border rounded bg-white shadow-sm"
              >
                {/* Ticket Main Details */}
                <div>
                  <h6 className="text-primary mb-1">{ticket.name}</h6>
                  <p className="text-muted mb-2">{ticket.description}</p>
                </div>
                {/* Priority & Status */}
                <div>
                  <span
                    className={`badge me-2 ${
                      ticket.priority === "High"
                        ? "bg-danger"
                        : ticket.priority === "Medium"
                        ? "bg-warning"
                        : "bg-success"
                    }`}
                  >
                    {ticket.priority}
                  </span>
                  <span
                    className={`badge ${
                      ticket.status === "Active"
                        ? "bg-primary"
                        : ticket.status === "Resolved"
                        ? "bg-success"
                        : "bg-warning"
                    }`}
                  >
                    {ticket.status}
                  </span>
                  <p className="text-muted mb-2">
                    <strong>Comments:</strong> {ticket.comments}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
