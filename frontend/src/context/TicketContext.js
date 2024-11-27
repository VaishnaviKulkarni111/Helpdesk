import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const TicketContext = createContext();

// Create a provider component
export const TicketProvider = ({ children }) => {
  const { auth } = useAuth(); 
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all tickets
  const fetchTickets = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const { token } = auth;
      const loggedIn = localStorage.getItem("loggedIn");
      const userType = localStorage.getItem("userType");

      // Check if the user is logged in
      if (loggedIn === "true" && userType === "admin") {
        const response = await fetch(`http://localhost:5000/tickets`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTickets(data); 
          console.log("ticket show", data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch tickets.");
          toast.error(errorData.message || "Failed to fetch tickets.");
        }
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setError("An error occurred while fetching tickets.");
      toast.error("An error occurred while fetching tickets.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTickets = async () => {
    if (loading) return; 
    setLoading(true);
    setError(null);

    try {
      const { token } = auth;
      const loggedIn = localStorage.getItem("loggedIn");
      const userType = localStorage.getItem("userType");
      const userId = localStorage.getItem("userId");

      // Check if the user is logged in
      if (loggedIn === "true" && userType === "user") {
        const response = await fetch(`http://localhost:5000/ticket/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTickets(data); 
          console.log("ticket show", data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch tickets.");
          toast.error(errorData.message || "Failed to fetch tickets.");
        }
      } else {
        toast.error("You are not logged in. Please log in first.");
        setError("You are not logged in.");
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setError("An error occurred while fetching tickets.");
      toast.error("An error occurred while fetching tickets.");
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (ticketData) => {
    try {
      const token = auth.token;
      const response = await fetch("http://localhost:5000/ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify(ticketData),
      });

      if (response.ok) {
        toast.success("Ticket created successfully!");
        await fetchTickets(); 
        return true;
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to create ticket.");
        return false;
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("An error occurred while creating the ticket.");
      return false;
    }
  };

  // Add a comment to a ticket
  const addComment = async (ticketId, comment) => {
    if (!comment || comment.trim() === '') {
      toast.error('Comment cannot be empty.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/addComment/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success('Comment added successfully.');
        fetchTickets(); 
      } else {
        toast.error(data.message || 'Failed to add comment.');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error('An error occurred while adding the comment.');
    }
    
  };

  // Update the status of a ticket
  const updateStatus = async (ticketId, status) => {
    const allowedStatuses = ['Active', 'Pending', 'Resolved'];
    if (!allowedStatuses.includes(status)) {
      toast.error('Invalid status.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/updateStatus/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success('Status updated successfully.');
        fetchTickets(); 
      } else {
        toast.error(data.message || 'Failed to update status.');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('An error occurred while updating the status.');
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <TicketContext.Provider value={{ tickets, 
    loading,
     error, 
     createTicket, 
     fetchTickets,
      fetchUserTickets ,
      addComment,
      updateStatus, 
      }}>
      {children}
    </TicketContext.Provider>
  );
};

// Custom hook to use the TicketContext
export const useTicket = () => {
  return useContext(TicketContext);
};