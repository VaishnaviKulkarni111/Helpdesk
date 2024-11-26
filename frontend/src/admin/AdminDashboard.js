import React, { useEffect, useState } from 'react';
import { useTicket } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTicketAlt, faExclamationCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';

const AdminDashboard = () => {
  const { tickets, loading, error, fetchTickets, addComment, updateStatus } = useTicket(); // Updated to use context
  const [users, setUsers] = useState([]);
  const [highPriorityCount, setHighPriorityCount] = useState(0);
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Fetch tickets and users
  useEffect(() => {
    fetchTickets();
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
      const highPriority = tickets.filter((ticket) => ticket.priority === 'High').length;
      setHighPriorityCount(highPriority);
    }
  }, [tickets]);

  // Open modal for adding a comment
  const handleOpenCommentModal = (ticketId) => {
    setSelectedTicketId(ticketId);
    setShowCommentModal(true);
  };

  // Add a comment using context
  const handleAddComment = async () => {
    if (!commentText.trim()) {
      toast.error('Comment cannot be empty.');
      return;
    }

    try {
      await addComment(selectedTicketId, commentText); // Call context function
      toast.success('Comment added successfully!');
      setShowCommentModal(false);
      setCommentText('');
    } catch (err) {
      toast.error('Failed to add comment.');
      console.error(err);
    }
  };

  // Update ticket status
  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      await updateStatus(ticketId, newStatus); // Call context function
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status.');
      console.error(err);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  return (
    <div
      className="container-fluid"
      style={{
        backgroundColor: '#F0F0F0',
        minHeight: '100vh',
        padding: '30px 120px',
      }}
    >
      {/* Header Section */}
      <div className="card shadow-sm mb-4" style={{ backgroundColor: '#fff', padding: '15px 20px' }}>
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="text-primary">
            <FontAwesomeIcon icon={faTicketAlt} /> Admin Dashboard
          </h1>
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
                <div>
                  <h6 className="text-primary mb-1">{ticket.name}</h6>
                  <p className="text-muted mb-2">{ticket.description}</p>
                </div>
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
                    <strong>Comments:</strong>{' '}
                    {Array.isArray(ticket.comments) ? (
                      ticket.comments.length > 0 ? (
                        ticket.comments.map((comment, index) => (
                          <span key={index} className="d-block">
                            {comment.text} (on {new Date(comment.date).toLocaleString()})
                          </span>
                        ))
                      ) : (
                        <span>No comments yet.</span>
                      )
                    ) : (
                      <span>{ticket.comments?.text || 'No comments available.'}</span>
                    )}
                  </p>
                </div>
                <button onClick={() => handleOpenCommentModal(ticket._id)} className="btn btn-info btn-sm mt-2">
                  Add Comment
                </button>
                <button
                  onClick={() => handleUpdateStatus(ticket._id, ticket.status === 'Active' ? 'Resolved' : 'Active')}
                  className="btn btn-secondary btn-sm mt-2 ms-2"
                >
                  {ticket.status === 'Active' ? 'Mark Resolved' : 'Reopen'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Comment Modal */}
      <Modal show={showCommentModal} onHide={() => setShowCommentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Comment</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCommentModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddComment}>
            Save Comment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;