import React, { useState } from 'react';
import {
  Container, Row, Col, Card, Form, Button,
  Alert, Table, Badge, InputGroup, Modal
} from 'react-bootstrap';
import {
  FiCreditCard, FiDollarSign, FiSave, FiPlus,
  FiTrash2, FiCheck, FiX, FiEdit2
} from 'react-icons/fi';
import { FaPaypal, FaCcStripe, FaCcAmazonPay } from "react-icons/fa";
// import { FaSpinner } from "react-icons/fa";

const PaymentSettings = () => {
  // Form state
  const [settings, setSettings] = useState({
    defaultPaymentMethod: 'credit_card',
    paymentMethods: [
      { id: 1, type: 'credit_card', last4: '4242', brand: 'Visa', isDefault: true },
      { id: 2, type: 'paypal', email: 'user@example.com', isDefault: false },
    ],
    taxSettings: {
      taxEnabled: true,
      taxRate: 10,
      taxNumber: ''
    },
    invoiceSettings: {
      autoGenerate: true,
      dueDays: 15
    }
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showAddMethodModal, setShowAddMethodModal] = useState(false);
  const [newMethod, setNewMethod] = useState({
    type: 'credit_card',
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
    email: ''
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle nested input changes
  const handleNestedChange = (section, e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  // Set default payment method
  const setDefaultMethod = (id) => {
    setSettings(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id
      })),
      defaultPaymentMethod: prev.paymentMethods.find(m => m.id === id).type
    }));
  };

  // Remove payment method
  const removeMethod = (id) => {
    if (settings.paymentMethods.length > 1) {
      setSettings(prev => ({
        ...prev,
        paymentMethods: prev.paymentMethods.filter(method => method.id !== id)
      }));
    }
  };

  // Add new payment method
  const addPaymentMethod = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newId = Math.max(...settings.paymentMethods.map(m => m.id)) + 1;
      
      let methodToAdd;
      if (newMethod.type === 'credit_card') {
        methodToAdd = {
          id: newId,
          type: 'credit_card',
          last4: newMethod.cardNumber.slice(-4),
          brand: 'Visa', // In real app, detect from card number
          isDefault: false
        };
      } else {
        methodToAdd = {
          id: newId,
          type: newMethod.type,
          email: newMethod.email,
          isDefault: false
        };
      }
      
      setSettings(prev => ({
        ...prev,
        paymentMethods: [...prev.paymentMethods, methodToAdd]
      }));
      
      setNewMethod({
        type: 'credit_card',
        cardNumber: '',
        expiry: '',
        cvc: '',
        name: '',
        email: ''
      });
      setShowAddMethodModal(false);
      setLoading(false);
      setSuccessMessage('Payment method added successfully!');
    }, 1000);
  };

  // Save all settings
  const saveSettings = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage('Payment settings updated successfully!');
    }, 1500);
  };

  // Get payment method icon
  const getMethodIcon = (type) => {
    switch (type) {
      case 'credit_card': return <FiCreditCard className="me-2" />;
      case 'paypal': return <FaPaypal className="me-2" />;
      case 'stripe': return <FaCcStripe className="me-2" />;
      case 'amazon_pay': return <FaCcAmazonPay className="me-2" />;
      default: return <FiCreditCard className="me-2" />;
    }
  };

  // Format payment method
  const formatMethod = (method) => {
    switch (method.type) {
      case 'credit_card':
        return `${method.brand} ending in ${method.last4}`;
      case 'paypal':
        return `PayPal (${method.email})`;
      default:
        return `${method.type} payment method`;
    }
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <h2 className="mb-4">
            <FiCreditCard className="me-2" />
            Payment Settings
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
              <Form onSubmit={saveSettings}>
                <Row className="mb-4">
                  <Col>
                    <h5 className="mb-3">Payment Methods</h5>
                    <Table bordered className="mb-4">
                      <thead>
                        <tr>
                          <th width="60%">Method</th>
                          <th width="30%">Status</th>
                          <th width="10%"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {settings.paymentMethods.map((method) => (
                          <tr key={method.id}>
                            <td>
                              {getMethodIcon(method.type)}
                              {formatMethod(method)}
                            </td>
                            <td>
                              {method.isDefault ? (
                                <Badge bg="success">Default</Badge>
                              ) : (
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() => setDefaultMethod(method.id)}
                                >
                                  Set as Default
                                </Button>
                              )}
                            </td>
                            <td className="text-center">
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => removeMethod(method.id)}
                                disabled={method.isDefault || settings.paymentMethods.length <= 1}
                              >
                                <FiTrash2 />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>

                    <Button
                      className='leave-button'
                      onClick={() => setShowAddMethodModal(true)}
                    >
                      <FiPlus className="me-2" />
                      Add Payment Method
                    </Button>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={6}>
                    <h5 className="mb-3">Tax Settings</h5>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        id="taxEnabled"
                        label="Enable tax calculation"
                        name="taxEnabled"
                        checked={settings.taxSettings.taxEnabled}
                        onChange={(e) => handleNestedChange('taxSettings', e)}
                      />
                    </Form.Group>

                    {settings.taxSettings.taxEnabled && (
                      <>
                        <Form.Group className="mb-3">
                          <InputGroup>
                            <Form.Control
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              name="taxRate"
                              value={settings.taxSettings.taxRate}
                              onChange={(e) => handleNestedChange('taxSettings', e)}
                            />
                            <InputGroup.Text>%</InputGroup.Text>
                          </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Tax Identification Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="taxNumber"
                            value={settings.taxSettings.taxNumber}
                            onChange={(e) => handleNestedChange('taxSettings', e)}
                            placeholder="VAT/GST number"
                          />
                        </Form.Group>
                      </>
                    )}
                  </Col>

                  <Col md={6}>
                    <h5 className="mb-3">Invoice Settings</h5>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        id="autoGenerate"
                        label="Auto-generate invoices"
                        name="autoGenerate"
                        checked={settings.invoiceSettings.autoGenerate}
                        onChange={(e) => handleNestedChange('invoiceSettings', e)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Invoice Due Days</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          min="1"
                          max="90"
                          name="dueDays"
                          value={settings.invoiceSettings.dueDays}
                          onChange={(e) => handleNestedChange('invoiceSettings', e)}
                        />
                        <InputGroup.Text>days</InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2">
                  <Button className='leave-button' type="button">
                    Cancel
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
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave className="me-2" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Payment Method Modal */}
      <Modal show={showAddMethodModal} onHide={() => setShowAddMethodModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Payment Method</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={addPaymentMethod}>
            <Form.Group className="mb-3">
              <Form.Label>Payment Method Type</Form.Label>
              <Form.Select
                name="type"
                value={newMethod.type}
                onChange={(e) => setNewMethod(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="stripe">Stripe</option>
                <option value="amazon_pay">Amazon Pay</option>
              </Form.Select>
            </Form.Group>

            {newMethod.type === 'credit_card' ? (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Card Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    name="cardNumber"
                    value={newMethod.cardNumber}
                    onChange={(e) => setNewMethod(prev => ({ ...prev, cardNumber: e.target.value }))}
                    required
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Label>Expiry Date</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="MM/YY"
                      name="expiry"
                      value={newMethod.expiry}
                      onChange={(e) => setNewMethod(prev => ({ ...prev, expiry: e.target.value }))}
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Security Code</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="CVC"
                      name="cvc"
                      value={newMethod.cvc}
                      onChange={(e) => setNewMethod(prev => ({ ...prev, cvc: e.target.value }))}
                      required
                    />
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Cardholder Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Name on card"
                    name="name"
                    value={newMethod.name}
                    onChange={(e) => setNewMethod(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </Form.Group>
              </>
            ) : (
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="your@email.com"
                  name="email"
                  value={newMethod.email}
                  onChange={(e) => setNewMethod(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </Form.Group>
            )}

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button
                variant="outline-secondary"
                onClick={() => setShowAddMethodModal(false)}
              >
                Cancel
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
                    Adding...
                  </>
                ) : (
                  <>
                    <FiCheck className="me-2" />
                    Add Method
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PaymentSettings;