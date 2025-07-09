import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Form, Button,
  Alert, Spinner, Tab, Nav, Table, Modal,
  InputGroup,
  Badge
} from 'react-bootstrap';
import {
  FiCreditCard, FiDollarSign, FiSettings, FiRefreshCw,
  FiPlus, FiEdit, FiTrash2, FiCheck, FiX, FiDownload
} from 'react-icons/fi';

const BillingSettings = () => {
  // State for billing settings
  const [settings, setSettings] = useState({
    currency: 'USD',
    taxEnabled: true,
    taxRate: 10.0,
    invoicePrefix: 'INV-',
    invoiceDueDays: 14,
    lateFeeEnabled: true,
    lateFeeAmount: 25.0,
    lateFeePercentage: 5.0,
    paymentMethods: ['card', 'bank_transfer', 'paypal'],
    defaultPaymentMethod: 'card'
  });
  
  // State for payment methods
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [showAddMethodModal, setShowAddMethodModal] = useState(false);
  const [showDeleteMethodModal, setShowDeleteMethodModal] = useState(false);
  const [currentMethod, setCurrentMethod] = useState(null);
  const [newMethod, setNewMethod] = useState({
    name: '',
    type: 'card',
    isActive: true,
    credentials: {}
  });

  // Available currencies
  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'CAD', name: 'Canadian Dollar' }
  ];

  // Available payment method types
  const methodTypes = [
    { id: 'card', name: 'Credit/Debit Card' },
    { id: 'bank_transfer', name: 'Bank Transfer' },
    { id: 'paypal', name: 'PayPal' },
    { id: 'stripe', name: 'Stripe' },
    { id: 'custom', name: 'Custom Gateway' }
  ];

  // Fetch payment methods (simulated)
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          const mockMethods = [
            {
              id: 'method_1',
              name: 'Primary Card Processor',
              type: 'card',
              isActive: true,
              credentials: { processor: 'Stripe' },
              createdAt: '2022-01-15',
              isDefault: true
            },
            {
              id: 'method_2',
              name: 'Backup Bank Transfer',
              type: 'bank_transfer',
              isActive: true,
              credentials: { accountNumber: '****6789', routing: '*****1234' },
              createdAt: '2022-03-22',
              isDefault: false
            },
            {
              id: 'method_3',
              name: 'PayPal Express',
              type: 'paypal',
              isActive: false,
              credentials: { email: 'billing@company.com' },
              createdAt: '2022-05-10',
              isDefault: false
            }
          ];
          setPaymentMethods(mockMethods);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load payment methods. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchPaymentMethods();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle method input changes
  const handleMethodInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewMethod(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle credential changes
  const handleCredentialChange = (key, value) => {
    setNewMethod(prev => ({
      ...prev,
      credentials: {
        ...prev.credentials,
        [key]: value
      }
    }));
  };

  // Handle save settings
  const handleSaveSettings = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage('Billing settings updated successfully!');
    }, 800);
  };

  // Handle add payment method
  const handleAddMethod = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const method = {
        ...newMethod,
        id: `method_${paymentMethods.length + 1}`,
        createdAt: new Date().toISOString().split('T')[0],
        isDefault: false
      };
      setPaymentMethods([...paymentMethods, method]);
      setShowAddMethodModal(false);
      setNewMethod({
        name: '',
        type: 'card',
        isActive: true,
        credentials: {}
      });
      setLoading(false);
      setSuccessMessage('Payment method added successfully!');
    }, 800);
  };

  // Handle delete payment method
  const handleDeleteMethod = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPaymentMethods(paymentMethods.filter(m => m.id !== currentMethod.id));
      setShowDeleteMethodModal(false);
      setLoading(false);
      setSuccessMessage('Payment method deleted successfully!');
    }, 800);
  };

  // Handle set default payment method
  const handleSetDefault = (methodId) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPaymentMethods(paymentMethods.map(m => ({
        ...m,
        isDefault: m.id === methodId
      })));
      setLoading(false);
      setSuccessMessage('Default payment method updated!');
    }, 800);
  };

  // Get method badge color
  const getMethodBadge = (type) => {
    switch (type) {
      case 'card': return 'primary';
      case 'bank_transfer': return 'info';
      case 'paypal': return 'success';
      case 'stripe': return 'primary';
      default: return 'secondary';
    }
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <h2 className="mb-4">
            <FiCreditCard className="me-2" />
            Billing Settings
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

          <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Row>
              <Col md={3}>
                <Card className="mb-4">
                  <Card.Body className="p-0">
                    <Nav variant="pills" className="flex-column">
                      <Nav.Item>
                        <Nav.Link eventKey="general" className='leave-button mt-2'>
                          <FiSettings className="me-2" />
                          General Settings
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="payment" className='leave-button mt-2'>
                          <FiDollarSign className="me-2" />
                          Payment Methods
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="tax" className='leave-button mt-2'>
                          <FiCreditCard className="me-2" />
                          Tax Settings
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={9}>
                <Card>
                  <Card.Body>
                    <Tab.Content>
                      {/* General Settings Tab */}
                      <Tab.Pane eventKey="general">
                        <h4 className="mb-4">
                          <FiSettings className="me-2" />
                          General Billing Settings
                        </h4>

                        <Form>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Default Currency</Form.Label>
                                <Form.Select
                                  name="currency"
                                  value={settings.currency}
                                  onChange={handleInputChange}
                                >
                                  {currencies.map(currency => (
                                    <option key={currency.code} value={currency.code}>
                                      {currency.name} ({currency.code})
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Invoice Prefix</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="invoicePrefix"
                                  value={settings.invoicePrefix}
                                  onChange={handleInputChange}
                                />
                              </Form.Group>
                            </Col>
                          </Row>

                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Invoice Due Days</Form.Label>
                                <Form.Control
                                  type="number"
                                  name="invoiceDueDays"
                                  value={settings.invoiceDueDays}
                                  onChange={handleInputChange}
                                  min="1"
                                  max="60"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Default Payment Method</Form.Label>
                                <Form.Select
                                  name="defaultPaymentMethod"
                                  value={settings.defaultPaymentMethod}
                                  onChange={handleInputChange}
                                >
                                  {settings.paymentMethods.map(method => (
                                    <option key={method} value={method}>
                                      {method === 'card' ? 'Credit/Debit Card' : 
                                       method === 'bank_transfer' ? 'Bank Transfer' : 
                                       method === 'paypal' ? 'PayPal' : method}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                            </Col>
                          </Row>

                          <Form.Group className="mb-3">
                            <Form.Check
                              type="checkbox"
                              name="lateFeeEnabled"
                              label="Enable Late Fees"
                              checked={settings.lateFeeEnabled}
                              onChange={handleInputChange}
                            />
                          </Form.Group>

                          {settings.lateFeeEnabled && (
                            <Row>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>Late Fee Amount</Form.Label>
                                  <InputGroup>
                                    <InputGroup.Text>$</InputGroup.Text>
                                    <Form.Control
                                      type="number"
                                      name="lateFeeAmount"
                                      value={settings.lateFeeAmount}
                                      onChange={handleInputChange}
                                      min="0"
                                      step="0.01"
                                    />
                                  </InputGroup>
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>Late Fee Percentage</Form.Label>
                                  <InputGroup>
                                    <Form.Control
                                      type="number"
                                      name="lateFeePercentage"
                                      value={settings.lateFeePercentage}
                                      onChange={handleInputChange}
                                      min="0"
                                      max="100"
                                      step="0.1"
                                    />
                                    <InputGroup.Text>%</InputGroup.Text>
                                  </InputGroup>
                                </Form.Group>
                              </Col>
                            </Row>
                          )}

                          <div className="d-flex justify-content-end mt-4">
                            <Button className='leave-button' onClick={handleSaveSettings} disabled={loading}>
                              {loading ? (
                                <>
                                  <Spinner animation="border" size="sm" className="me-2" />
                                  Saving...
                                </>
                              ) : 'Save Settings'}
                            </Button>
                          </div>
                        </Form>
                      </Tab.Pane>

                      {/* Payment Methods Tab */}
                      <Tab.Pane eventKey="payment">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <h4>
                            <FiDollarSign className="me-2" />
                            Payment Methods
                          </h4>
                          <Button className='leave-button' onClick={() => setShowAddMethodModal(true)}>
                            <FiPlus className="me-2" />
                            Add Payment Method
                          </Button>
                        </div>

                        {loading ? (
                          <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2">Loading payment methods...</p>
                          </div>
                        ) : (
                          <Table striped bordered hover>
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Default</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paymentMethods.map(method => (
                                <tr key={method.id}>
                                  <td>{method.name}</td>
                                  <td>
                                    <Badge bg={getMethodBadge(method.type)}>
                                      {method.type === 'card' ? 'Credit Card' : 
                                       method.type === 'bank_transfer' ? 'Bank Transfer' : 
                                       method.type === 'paypal' ? 'PayPal' : method.type}
                                    </Badge>
                                  </td>
                                  <td>
                                    {method.isActive ? (
                                      <Badge bg="success">Active</Badge>
                                    ) : (
                                      <Badge bg="secondary">Inactive</Badge>
                                    )}
                                  </td>
                                  <td>{method.createdAt}</td>
                                  <td>
                                    {method.isDefault ? (
                                      <Badge bg="primary">Default</Badge>
                                    ) : (
                                      <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => handleSetDefault(method.id)}
                                      >
                                        Set Default
                                      </Button>
                                    )}
                                  </td>
                                  <td>
                                    <Button
                                      variant="outline-primary"
                                      size="sm"
                                      className="me-2"
                                      onClick={() => {
                                        setCurrentMethod(method);
                                        setNewMethod(method);
                                        setShowAddMethodModal(true);
                                      }}
                                    >
                                      <FiEdit />
                                    </Button>
                                    {!method.isDefault && (
                                      <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => {
                                          setCurrentMethod(method);
                                          setShowDeleteMethodModal(true);
                                        }}
                                      >
                                        <FiTrash2 />
                                      </Button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        )}
                      </Tab.Pane>

                      {/* Tax Settings Tab */}
                      <Tab.Pane eventKey="tax">
                        <h4 className="mb-4">
                          <FiCreditCard className="me-2" />
                          Tax Settings
                        </h4>

                        <Form>
                          <Form.Group className="mb-3">
                            <Form.Check
                              type="checkbox"
                              name="taxEnabled"
                              label="Enable Tax Calculation"
                              checked={settings.taxEnabled}
                              onChange={handleInputChange}
                            />
                          </Form.Group>

                          {settings.taxEnabled && (
                            <Row>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label>Tax Rate</Form.Label>
                                  <InputGroup>
                                    <Form.Control
                                      type="number"
                                      name="taxRate"
                                      value={settings.taxRate}
                                      onChange={handleInputChange}
                                      min="0"
                                      max="100"
                                      step="0.1"
                                    />
                                    <InputGroup.Text>%</InputGroup.Text>
                                  </InputGroup>
                                </Form.Group>
                              </Col>
                            </Row>
                          )}

                          <div className="d-flex justify-content-end mt-4">
                            <Button className='leave-button' onClick={handleSaveSettings} disabled={loading}>
                              {loading ? (
                                <>
                                  <Spinner animation="border" size="sm" className="me-2" />
                                  Saving...
                                </>
                              ) : 'Save Tax Settings'}
                            </Button>
                          </div>
                        </Form>
                      </Tab.Pane>
                    </Tab.Content>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Container>
        </Col>
      </Row>

      {/* Add/Edit Payment Method Modal */}
      <Modal show={showAddMethodModal} onHide={() => setShowAddMethodModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {currentMethod ? 'Edit Payment Method' : 'Add New Payment Method'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Method Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={newMethod.name}
                    onChange={handleMethodInputChange}
                    placeholder="e.g., Company Credit Card Processor"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Method Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={newMethod.type}
                    onChange={handleMethodInputChange}
                  >
                    {methodTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="isActive"
                label="Active"
                checked={newMethod.isActive}
                onChange={handleMethodInputChange}
              />
            </Form.Group>

            {newMethod.type === 'card' && (
              <>
                <h5 className="mb-3">Card Processor Credentials</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Processor</Form.Label>
                      <Form.Control
                        type="text"
                        value={newMethod.credentials.processor || ''}
                        onChange={(e) => handleCredentialChange('processor', e.target.value)}
                        placeholder="e.g., Stripe, PayPal, etc."
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>API Key</Form.Label>
                      <Form.Control
                        type="password"
                        value={newMethod.credentials.apiKey || ''}
                        onChange={(e) => handleCredentialChange('apiKey', e.target.value)}
                        placeholder="Enter API key"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}

            {newMethod.type === 'bank_transfer' && (
              <>
                <h5 className="mb-3">Bank Account Details</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Account Number</Form.Label>
                      <Form.Control
                        type="text"
                        value={newMethod.credentials.accountNumber || ''}
                        onChange={(e) => handleCredentialChange('accountNumber', e.target.value)}
                        placeholder="Enter account number"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Routing Number</Form.Label>
                      <Form.Control
                        type="text"
                        value={newMethod.credentials.routing || ''}
                        onChange={(e) => handleCredentialChange('routing', e.target.value)}
                        placeholder="Enter routing number"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}

            {newMethod.type === 'paypal' && (
              <>
                <h5 className="mb-3">PayPal Credentials</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>PayPal Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={newMethod.credentials.email || ''}
                        onChange={(e) => handleCredentialChange('email', e.target.value)}
                        placeholder="Enter PayPal email"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>API Client ID</Form.Label>
                      <Form.Control
                        type="password"
                        value={newMethod.credentials.clientId || ''}
                        onChange={(e) => handleCredentialChange('clientId', e.target.value)}
                        placeholder="Enter client ID"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}

            {newMethod.type === 'custom' && (
              <>
                <h5 className="mb-3">Custom Gateway Settings</h5>
                <Form.Group className="mb-3">
                  <Form.Label>Endpoint URL</Form.Label>
                  <Form.Control
                    type="url"
                    value={newMethod.credentials.endpoint || ''}
                    onChange={(e) => handleCredentialChange('endpoint', e.target.value)}
                    placeholder="https://api.example.com/payment"
                  />
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowAddMethodModal(false);
            setCurrentMethod(null);
            setNewMethod({
              name: '',
              type: 'card',
              isActive: true,
              credentials: {}
            });
          }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddMethod} disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                {currentMethod ? 'Updating...' : 'Adding...'}
              </>
            ) : currentMethod ? 'Update Method' : 'Add Method'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Payment Method Modal */}
      <Modal show={showDeleteMethodModal} onHide={() => setShowDeleteMethodModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the payment method <strong>{currentMethod?.name}</strong>?
          <br />
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteMethodModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteMethod} disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : 'Delete Method'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BillingSettings;