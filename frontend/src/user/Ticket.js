import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useTicket } from "../context/TicketContext"; // Custom hook import
import "react-toastify/dist/ReactToastify.css";

const Ticket = () => {
  const navigate = useNavigate();
  const { createTicket } = useTicket(); // Call useTicket directly

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "Low",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTicket(formData); // Call createTicket from context
      toast.success("Ticket created successfully!");
      navigate("/user");
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error(error.message || "An error occurred while creating the ticket.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <ToastContainer />
      <div className="card shadow-lg" style={{ maxWidth: "500px", width: "100%" }}>
        <div className="card-header bg-primary text-white text-center">
          <h3>Create Ticket</h3>
        </div>
        <div className="card-body">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formTicketName">
              <Form.Label>Ticket Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter ticket name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formTicketDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Enter ticket description"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formTicketPriority">
              <Form.Label>Priority</Form.Label>
              <Form.Control
                as="select"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Form.Control>
            </Form.Group>

            <div className="text-center">
              <Button type="submit" variant="primary" style={{ width: "70%" }}>
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
