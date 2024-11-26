import React, { useEffect, useState } from 'react';
import { useTicket } from '../context/TicketContext'; // Assuming TicketContext is being used for fetching tickets
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTicketAlt, faExclamationCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // To navigate to login page after logout

const AdminDashboard = () => {
  const { tickets, loading, error, fetchTickets } = useTicket();
  const [users, setUsers] = useState([]);
  const [highPriorityCount, setHighPriorityCount] = useState(0);
  const { auth, logout } = useAuth();
  const navigate = useNavigate(); // Used to redirect to login page

  // Fetch tickets and users
  useEffect(() => {
    fetchTickets(); // Fetch all tickets

    // Fetch users
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/getAllUser', {
          method: 'GET',
        });
        const data = await response.json();
        if (data.status === 'ok') {
          setUsers(data.data);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, []);

  // Calculate high-priority tickets count
  useEffect(() => {
    if (tickets) {
      const highPriority = tickets.filter(ticket => ticket.priority === 'High').length;
      setHighPriorityCount(highPriority);
    }
  }, [tickets]);

  // Handle adding a comment
  const handleAddComment = async (ticketId) => {
    const comment = prompt('Enter your comment:');
    if (comment) {
      try {
        const response = await fetch(`http://localhost:5000/ticket/${ticketId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify({ comment }),
        });
        const data = await response.json();
        if (response.ok) {
          toast.success('Comment added successfully!');
          fetchTickets(); // Refresh tickets after adding the comment
        } else {
          toast.error(data.message || 'Failed to add comment');
        }
      } catch (err) {
        console.error('Error adding comment:', err);
        toast.error('An error occurred while adding the comment.');
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout(); // Clear the token and user data from AuthContext
    navigate('/'); // Redirect to the login page
    toast.success('Logged out successfully');
  };

  return (
    <div
      className="container-fluid"
      style={{
        backgroundColor: '#F0F0F0',
        minHeight: '100vh',
        padding: '30px 120px', // More space left and right
      }}
    >
      {/* Header Section */}
      <div className="card shadow-sm mb-4" style={{ backgroundColor: '#fff', padding: '15px 20px' }}>
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="text-primary">
            <FontAwesomeIcon icon={faTicketAlt} /> Admin Dashboard
          </h1>
          {/* Logout Button */}
          <button onClick={handleLogout} className="btn btn-secondary">
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </button>
        </div>
      </div>

      {/* Overview Boxes */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <FontAwesomeIcon icon={faTicketAlt} className="text-primary mb-2" size="3x" />
              <h5 className="text-primary">Total Tickets</h5>
              <h2 className="text-dark">{tickets.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <FontAwesomeIcon icon={faUser} className="text-info mb-2" size="3x" />
              <h5 className="text-info">Total Users</h5>
              <h2 className="text-dark">{users.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <FontAwesomeIcon icon={faExclamationCircle} className="text-danger mb-2" size="3x" />
              <h5 className="text-danger">High Priority Tickets</h5>
              <h2 className="text-dark">{highPriorityCount}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Tickets Section */}
      <div className="card shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 className="m-0">Tickets Overview</h5>
        </div>
        <div className="card-body">
          {loading ? (
            <p>Loading tickets...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : tickets.length === 0 ? (
            <p>No tickets to display.</p>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket._id} className="p-3 mb-3 border rounded bg-white shadow-sm">
                {/* Ticket Main Details */}
                <div>
                  <h6 className="text-primary mb-1">{ticket.name}</h6>
                  <p className="text-muted mb-2">{ticket.description}</p>
                </div>
                {/* Priority & Status */}
                <div>
                  <span
                    className={`badge me-2 ${ticket.priority === 'High' ? 'bg-danger' : ticket.priority === 'Medium' ? 'bg-warning' : 'bg-success'}`}
                  >
                    {ticket.priority}
                  </span>
                  <span
                    className={`badge ${ticket.status === 'Active' ? 'bg-primary' : ticket.status === 'Resolved' ? 'bg-success' : 'bg-warning'}`}
                  >
                    {ticket.status}
                  </span>
                  <p className="text-muted mb-2">
                    <strong>Comments:</strong> {ticket.comments}
                  </p>
                </div>
                {/* Button for adding comment */}
                <button onClick={() => handleAddComment(ticket._id)} className="btn btn-info btn-sm mt-2">
                  Add Comment
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
