import React, { createContext, useContext } from "react";
import { toast } from "react-toastify";

// Create the context
const TicketContext = createContext();

// Create a provider component
export const TicketProvider = ({ children }) => {
  const createTicket = async (ticketData) => {
    try {
      const response = await fetch("http://localhost:5000/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketData),
      });

      if (response.ok) {
        toast.success("Ticket created successfully!");
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

  return (
    <TicketContext.Provider value={{ createTicket }}>
      {children}
    </TicketContext.Provider>
  );
};

// Custom hook to use the TicketContext
export const useTicket = () => {
  return useContext(TicketContext);
};
