import React, { useState } from 'react';
import {
  Container, Row, Col, Card, Form, Button,
  Alert, Table, Badge, InputGroup, Modal
} from 'react-bootstrap';
import {
  FiFileText, FiPlus, FiTrash2, FiSave,
  FiUser
} from 'react-icons/fi';
// import { FaSpinner } from "react-icons/fa";

const CreateInvoice = () => {
  // Form state
  const [invoice, setInvoice] = useState({
    customer: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: '',
    items: [
      { description: '', quantity: 1, price: 0, amount: 0 }
    ]
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  // Sample customer data
  const customers = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Acme Corporation', email: 'accounts@acme.com' },
    { id: 4, name: 'Tech Solutions Ltd', email: 'finance@techsolutions.com' }
  ];

  // Calculate totals
  const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const tax = subtotal * 0.1; // 10% tax for example
  const total = subtotal + tax;

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoice(prev => ({ ...prev, [name]: value }));
  };

  // Handle item changes
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...invoice.items];
    newItems[index] = { ...newItems[index], [name]: value };
    
    // Calculate amount if quantity or price changes
    if (name === 'quantity' || name === 'price') {
      newItems[index].amount = newItems[index].quantity * newItems[index].price;
    }
    
    setInvoice(prev => ({ ...prev, items: newItems }));
  };

  // Add new item row
  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0, amount: 0 }]
    }));
  };

  // Remove item row
  const removeItem = (index) => {
    if (invoice.items.length > 1) {
      const newItems = [...invoice.items];
      newItems.splice(index, 1);
      setInvoice(prev => ({ ...prev, items: newItems }));
    }
  };

  // Select customer
  const selectCustomer = (customer) => {
    setInvoice(prev => ({
      ...prev,
      customer: customer.name,
      email: customer.email
    }));
    setShowCustomerModal(false);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate form
    if (!invoice.customer || !invoice.email) {
      setError('Customer information is required');
      setLoading(false);
      return;
    }

    if (invoice.items.some(item => !item.description || item.price <= 0)) {
      setError('All items must have a description and positive price');
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // Generate a mock invoice ID
      const newInvoiceId = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      setLoading(false);
      setSuccessMessage(`Invoice ${newInvoiceId} created successfully!`);
      setError(null);
      
      // Reset form (keep customer info for convenience)
      setInvoice(prev => ({
        customer: prev.customer,
        email: prev.email,
        date: new Date().toISOString().split('T')[0],
        dueDate: '',
        notes: '',
        items: [
          { description: '', quantity: 1, price: 0, amount: 0 }
        ]
      }));
    }, 1500);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <h2 className="mb-4">
            <FiFileText className="me-2" />
            Create New Invoice
          </h2>

          {successMessage && (
            <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
              {successMessage}
            </Alert>
          )}

          {error && (
            <Alert variant="danger" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}

          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-4">
                  <Col md={6}>
                    <h5>Customer Information</h5>
                    <InputGroup className="mb-3">
                      <InputGroup.Text>
                        <FiUser />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Customer Name"
                        name="customer"
                        value={invoice.customer}
                        onChange={handleInputChange}
                        required
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowCustomerModal(true)}
                      >
                        Select Customer
                      </Button>
                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroup.Text>
                        @
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        placeholder="Customer Email"
                        name="email"
                        value={invoice.email}
                        onChange={handleInputChange}
                        required
                      />
                    </InputGroup>
                  </Col>

                  <Col md={6}>
                    <h5>Invoice Details</h5>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Invoice Date</Form.Label>
                          <Form.Control
                            type="date"
                            name="date"
                            value={invoice.date}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Due Date</Form.Label>
                          <Form.Control
                            type="date"
                            name="dueDate"
                            value={invoice.dueDate}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <h5 className="mb-3">Invoice Items</h5>
                <Table bordered className="mb-4">
                  <thead>
                    <tr>
                      <th width="40%">Description</th>
                      <th width="15%">Quantity</th>
                      <th width="20%">Unit Price</th>
                      <th width="20%">Amount</th>
                      <th width="5%"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <Form.Control
                            type="text"
                            name="description"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, e)}
                            required
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            min="1"
                            name="quantity"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, e)}
                            required
                          />
                        </td>
                        <td>
                          <InputGroup>
                            <InputGroup.Text>$</InputGroup.Text>
                            <Form.Control
                              type="number"
                              min="0"
                              step="0.01"
                              name="price"
                              value={item.price}
                              onChange={(e) => handleItemChange(index, e)}
                              required
                            />
                          </InputGroup>
                        </td>
                        <td>
                          {formatCurrency(item.quantity * item.price)}
                        </td>
                        <td className="text-center">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeItem(index)}
                            disabled={invoice.items.length <= 1}
                          >
                            <FiTrash2 />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <div className="d-flex justify-content-between mb-4">
                  <Button
                    variant="outline-primary"
                    onClick={addItem}
                  >
                    <FiPlus className="me-2" />
                    Add Item
                  </Button>
                </div>

                <Row className="justify-content-end">
                  <Col md={6}>
                    <Table borderless>
                      <tbody>
                        <tr>
                          <td><strong>Subtotal:</strong></td>
                          <td className="text-end">{formatCurrency(subtotal)}</td>
                        </tr>
                        <tr>
                          <td><strong>Tax (10%):</strong></td>
                          <td className="text-end">{formatCurrency(tax)}</td>
                        </tr>
                        <tr>
                          <td><strong>Total:</strong></td>
                          <td className="text-end">
                            <Badge bg="light" text="dark" className="fs-5">
                              {formatCurrency(total)}
                            </Badge>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    value={invoice.notes}
                    onChange={handleInputChange}
                    placeholder="Additional notes or terms..."
                  />
                </Form.Group>

                <div className="d-flex justify-content-end gap-2">
                  <Button variant="outline-secondary" type="button">
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
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
                        <FiSave className="me-2" />
                        Create Invoice
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Customer Selection Modal */}
      <Modal show={showCustomerModal} onHide={() => setShowCustomerModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td className="text-end">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => selectCustomer(customer)}
                    >
                      Select
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCustomerModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CreateInvoice;