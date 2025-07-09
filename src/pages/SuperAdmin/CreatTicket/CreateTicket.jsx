import React, { useState } from 'react';
import {
  Container, Row, Col, Card, Form, Button,
  Alert, InputGroup, Modal, Badge
} from 'react-bootstrap';
import { FiFileText as FiTicket, FiPlus, FiX } from 'react-icons/fi';
// import { FaSpinner } from "react-icons/fa";

const CreateTicket = () => {
  // State for form and UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);

  // Form state
  const [ticket, setTicket] = useState({
    subject: '',
    status: 'open',
    priority: 'medium',
    customer: '',
    description: ''
  });


  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!ticket.subject || !ticket.customer) {
      setError('Subject and Customer are required fields');
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      const newTicket = {
        ...ticket,
        id: Math.floor(Math.random() * 10000),
        created: new Date().toISOString().split('T')[0]
      };

      setLoading(false);
      setCreatedTicket(newTicket);
      setShowSuccessModal(true);
      setSuccessMessage('Ticket created successfully!');

      // Reset form
      setTicket({
        subject: '',
        status: 'open',
        priority: 'medium',
        customer: '',
        description: ''
      });
    }, 1000);
  };

  // Get badge color based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'open': return 'danger';
      case 'in-progress': return 'warning';
      case 'closed': return 'success';
      default: return 'secondary';
    }
  };

  // Get badge color based on priority
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <h2 className="mb-4">
            <FiTicket className="me-2" />
            Create New Ticket
          </h2>

          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          {successMessage && !showSuccessModal && (
            <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
              {successMessage}
            </Alert>
          )}

          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="formSubject" className="mb-3">
                      <Form.Label>Subject *</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter ticket subject"
                        name="subject"
                        value={ticket.subject}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formCustomer" className="mb-3">
                      <Form.Label>Customer *</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter customer name"
                        name="customer"
                        value={ticket.customer}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="formStatus" className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        name="status"
                        value={ticket.status}
                        onChange={handleChange}
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="closed">Closed</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formPriority" className="mb-3">
                      <Form.Label>Priority</Form.Label>
                      <Form.Select
                        name="priority"
                        value={ticket.priority}
                        onChange={handleChange}
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4" controlId="formDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Enter detailed description of the issue..."
                    name="description"
                    value={ticket.description}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="d-flex justify-content-end gap-2">
                  <Button
                    className='leave-button'
                    type="button"
                    onClick={() => {
                      setTicket({
                        subject: '',
                        status: 'open',
                        priority: 'medium',
                        customer: '',
                        description: ''
                      });
                    }}
                  >
                    <FiX className="me-2" />
                    Clear Form
                  </Button>
                  <Button
                    className='leave-button'
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        {/* <FaSpinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        /> */}
                        Creating...
                      </>
                    ) : (
                      <>
                        <FiPlus className="me-2" />
                        Create Ticket
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ticket Created Successfully</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {createdTicket && (
            <div>
              <p><strong>Subject:</strong> {createdTicket.subject}</p>
              <p><strong>Customer:</strong> {createdTicket.customer}</p>
              <p>
                <strong>Status:</strong> {' '}
                <Badge bg={getStatusBadge(createdTicket.status)}>
                  {createdTicket.status}
                </Badge>
              </p>
              <p>
                <strong>Priority:</strong> {' '}
                <Badge bg={getPriorityBadge(createdTicket.priority)}>
                  {createdTicket.priority}
                </Badge>
              </p>
              <p><strong>Created:</strong> {createdTicket.created}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CreateTicket;