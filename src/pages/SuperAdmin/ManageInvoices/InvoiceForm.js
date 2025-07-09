import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';

const InvoiceForm = ({ show, handleClose, invoice, onSubmit }) => {
  const generateInvoiceNo = () => {
    return `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
  };

  const getInitialFormData = () => ({
    invoiceNo: generateInvoiceNo(),
    client: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    amount: '',
    status: 'pending',
  });

  const [formData, setFormData] = useState(getInitialFormData());

  useEffect(() => {
    if (show) {
      // If invoice is passed, populate form with invoice data
      if (invoice) {
        setFormData({
          invoiceNo: invoice.invoiceNo || '',
          client: invoice.client || '',
          date: invoice.date || new Date().toISOString().split('T')[0],
          dueDate: invoice.dueDate || '',
          amount: invoice.amount || '',
          status: invoice.status || 'pending',
        });
      } else {
        // Creating new invoice
        setFormData(getInitialFormData());
      }
    }
  }, [show, invoice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    handleClose(); // Optional: close modal after submit
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{invoice ? 'Edit Invoice' : 'Create New Invoice'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="invoiceNo">
              <Form.Label>Invoice Number</Form.Label>
              <Form.Control
                type="text"
                name="invoiceNo"
                value={formData.invoiceNo}
                onChange={handleChange}
                required
                disabled={!!invoice}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="client">
              <Form.Label>Client</Form.Label>
              <Form.Control
                type="text"
                name="client"
                value={formData.client}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="date">
              <Form.Label>Invoice Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group as={Col} controlId="dueDate">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                min={formData.date}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </Form.Select>
            </Form.Group>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button className="leave-button" type="submit">
            {invoice ? 'Update Invoice' : 'Create Invoice'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default InvoiceForm;
