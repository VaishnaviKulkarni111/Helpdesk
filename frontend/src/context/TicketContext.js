import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

// Create the context
const TicketContext = createContext();

// Create a provider component
export const TicketProvider = ({ children }) => {
  const { auth } = useAuth(); // Access the auth context here
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all tickets
  const fetchTickets = async () => {
    if (loading) return; // Prevent fetching if already loading
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
            Authorization: `Bearer ${token}`, // Include token from context
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTickets(data); // Assuming API returns an array of tickets
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

  const fetchUserTickets = async () => {
    if (loading) return; // Prevent fetching if already loading
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
            Authorization: `Bearer ${token}`, // Include token from context
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTickets(data); // Assuming API returns an array of tickets
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
      const token = auth.token; // Retrieve token from context
      const response = await fetch("http://localhost:5000/ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in the Authorization header
        },
        body: JSON.stringify(ticketData),
      });

      if (response.ok) {
        toast.success("Ticket created successfully!");
        await fetchTickets(); // Refresh tickets after creation
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

  // Ensure fetchTickets is only called once on mount
  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <TicketContext.Provider value={{ tickets, loading, error, createTicket, fetchTickets, fetchUserTickets }}>
      {children}
    </TicketContext.Provider>
  );
};

// Custom hook to use the TicketContext
export const useTicket = () => {
  return useContext(TicketContext);
};
