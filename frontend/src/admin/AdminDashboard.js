import React, { useEffect, useState } from 'react';
import { useTicket } from '../context/TicketContext'; // Assuming TicketContext is being used for fetching tickets
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { tickets, loading, error, fetchTickets } = useTicket();
  const [users, setUsers] = useState([]);
  const [highPriorityCount, setHighPriorityCount] = useState(0);
  const { auth } = useAuth();

  // Fetch tickets and users
  useEffect(() => {
    fetchTickets(); // Fetch all tickets

    // Fetch users (you can customize this request according to your backend)
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
  }, [fetchTickets]);

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

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-stats">
        <div className="stat-box">
          <h2>Total Tickets</h2>
          <p>{tickets.length}</p>
        </div>
        <div className="stat-box">
          <h2>Total Users</h2>
          <p>{users.length}</p>
        </div>
        <div className="stat-box">
          <h2>High Priority Tickets</h2>
          <p>{highPriorityCount}</p>
        </div>
      </div>

      <h2>Tickets</h2>
      <div className="ticket-list">
        {loading ? (
          <p>Loading tickets...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          tickets.map(ticket => (
            <div className="ticket-card" key={ticket._id}>
              <h3>{ticket.name}</h3>
              <p>{ticket.description}</p>
              <p><strong>Priority:</strong> {ticket.priority}</p>
              <p><strong>Status:</strong> {ticket.status}</p>
              <button onClick={() => handleAddComment(ticket._id)}>Add Comment</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
