import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Table, Button,
  Form, Modal, Alert, Badge, Spinner, Pagination,
  InputGroup, Dropdown
} from 'react-bootstrap';
import {
  FiDollarSign, FiRefreshCw, FiSearch, FiEye,
  FiCheck, FiX, FiClock, FiArrowLeft, FiArrowRight
} from 'react-icons/fi';

const Refunds = () => {
  // State for refunds data
  const [refunds, setRefunds] = useState([]);
  const [filteredRefunds, setFilteredRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [refundsPerPage] = useState(8);

  // Modal state
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentRefund, setCurrentRefund] = useState(null);
  const [showProcessModal, setShowProcessModal] = useState(false);

  // Fetch refunds data (simulated)
  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          const mockRefunds = [
            {
              id: 'REF-2023-001',
              transactionId: 'TXN-1001',
              customer: 'John Doe',
              email: 'john@example.com',
              amount: 29.99,
              dateRequested: '2023-06-15',
              dateProcessed: '2023-06-16',
              status: 'completed',
              reason: 'Duplicate charge',
              paymentMethod: 'Credit Card',
              originalInvoice: 'INV-2023-001'
            },
            {
              id: 'REF-2023-002',
              transactionId: 'TXN-1002',
              customer: 'Jane Smith',
              email: 'jane@example.com',
              amount: 99.99,
              dateRequested: '2023-06-14',
              dateProcessed: '',
              status: 'pending',
              reason: 'Service not as described',
              paymentMethod: 'PayPal',
              originalInvoice: 'INV-2023-002'
            },
            {
              id: 'REF-2023-003',
              transactionId: 'TXN-1003',
              customer: 'Robert Johnson',
              email: 'robert@example.com',
              amount: 9.99,
              dateRequested: '2023-06-13',
              dateProcessed: '',
              status: 'rejected',
              reason: 'Change of mind',
              paymentMethod: 'Credit Card',
              originalInvoice: 'INV-2023-003'
            },
            {
              id: 'REF-2023-004',
              transactionId: 'TXN-1004',
              customer: 'Emily Davis',
              email: 'emily@example.com',
              amount: 29.99,
              dateRequested: '2023-06-12',
              dateProcessed: '2023-06-13',
              status: 'completed',
              reason: 'Cancelled subscription',
              paymentMethod: 'Bank Transfer',
              originalInvoice: 'INV-2023-004'
            },
            {
              id: 'REF-2023-005',
              transactionId: 'TXN-1005',
              customer: 'Michael Wilson',
              email: 'michael@example.com',
              amount: 99.99,
              dateRequested: '2023-06-11',
              dateProcessed: '',
              status: 'pending',
              reason: 'Technical issues',
              paymentMethod: 'Credit Card',
              originalInvoice: 'INV-2023-005'
            },
            {
              id: 'REF-2023-006',
              transactionId: 'TXN-1006',
              customer: 'Sarah Brown',
              email: 'sarah@example.com',
              amount: 9.99,
              dateRequested: '2023-06-10',
              dateProcessed: '2023-06-11',
              status: 'completed',
              reason: 'Duplicate charge',
              paymentMethod: 'PayPal',
              originalInvoice: 'INV-2023-006'
            },
            {
              id: 'REF-2023-007',
              transactionId: 'TXN-1007',
              customer: 'David Taylor',
              email: 'david@example.com',
              amount: 29.99,
              dateRequested: '2023-06-09',
              dateProcessed: '',
              status: 'pending',
              reason: 'Billing error',
              paymentMethod: 'Credit Card',
              originalInvoice: 'INV-2023-007'
            },
          ];
          setRefunds(mockRefunds);
          setFilteredRefunds(mockRefunds);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to fetch refunds. Please try again later.');
        setLoading(false);
      }
    };

    fetchRefunds();
  }, []);

  // Filter refunds based on search and status
  useEffect(() => {
    let results = refunds;
    
    if (searchTerm) {
      results = results.filter(refund =>
        refund.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        refund.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        refund.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        refund.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      results = results.filter(refund => refund.status === statusFilter);
    }

    setFilteredRefunds(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, refunds]);

  // Pagination logic
  const indexOfLastRefund = currentPage * refundsPerPage;
  const indexOfFirstRefund = indexOfLastRefund - refundsPerPage;
  const currentRefunds = filteredRefunds.slice(indexOfFirstRefund, indexOfLastRefund);
  const totalPages = Math.ceil(filteredRefunds.length / refundsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle view details
  const handleViewDetails = (refund) => {
    setCurrentRefund(refund);
    setShowDetailsModal(true);
  };

  // Handle process refund
  const handleProcessRefund = (refund) => {
    setCurrentRefund(refund);
    setShowProcessModal(true);
  };

  // Confirm process refund
  const confirmProcessRefund = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setRefunds(refunds.map(r => 
        r.id === currentRefund.id ? {...r, status: 'completed', dateProcessed: new Date().toISOString().split('T')[0]} : r
      ));
      setShowProcessModal(false);
      setSuccessMessage(`Refund ${currentRefund.id} processed successfully!`);
      setLoading(false);
    }, 1000);
  };

  // Handle reject refund
  const handleRejectRefund = (refund) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setRefunds(refunds.map(r => 
        r.id === refund.id ? {...r, status: 'rejected'} : r
      ));
      setSuccessMessage(`Refund ${refund.id} rejected.`);
      setLoading(false);
    }, 1000);
  };

  // Refresh refunds
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage('Refunds refreshed successfully!');
    }, 800);
  };

  // Get badge variant based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      default: return 'secondary';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format amount
  const formatAmount = (amount) => {
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
            <FiArrowLeft className="me-2" />
            Refund Management
          </h2>

          {successMessage && (
            <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
              {successMessage}
            </Alert>
          )}

          {error && (
            <Alert className='leave-button' onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}

          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex gap-2">
                  <Form.Group controlId="search" className="mb-0">
                    <InputGroup>
                      <InputGroup.Text>
                        <FiSearch />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search refunds..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group controlId="statusFilter" className="mb-0">
                    <Form.Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </Form.Select>
                  </Form.Group>
                </div>

                <Button variant="outline-secondary" onClick={handleRefresh}>
                  <FiRefreshCw className="me-2" />
                  Refresh
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading refunds...</p>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Refund ID</th>
                          <th>Customer</th>
                          <th>Amount</th>
                          <th>Request Date</th>
                          <th>Processed Date</th>
                          <th>Status</th>
                          <th>Reason</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentRefunds.length > 0 ? (
                          currentRefunds.map(refund => (
                            <tr key={refund.id}>
                              <td>
                                <small className="text-muted">{refund.id}</small>
                                <div className="small text-muted">TXN: {refund.transactionId}</div>
                              </td>
                              <td>
                                <div>{refund.customer}</div>
                                <small className="text-muted">{refund.email}</small>
                              </td>
                              <td>{formatAmount(refund.amount)}</td>
                              <td>{formatDate(refund.dateRequested)}</td>
                              <td>{formatDate(refund.dateProcessed)}</td>
                              <td>
                                <Badge bg={getStatusBadge(refund.status)}>
                                  {refund.status === 'pending' && <FiClock className="me-1" />}
                                  {refund.status === 'completed' && <FiCheck className="me-1" />}
                                  {refund.status === 'rejected' && <FiX className="me-1" />}
                                  {refund.status}
                                </Badge>
                              </td>
                              <td>
                                <small>{refund.reason}</small>
                              </td>
                              <td>
                                <Dropdown>
                                  <Dropdown.Toggle className='leave-button' size="sm" id="dropdown-actions">
                                    Actions
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleViewDetails(refund)}>
                                      <FiEye className="me-2" /> View Details
                                    </Dropdown.Item>
                                    {refund.status === 'pending' && (
                                      <>
                                        <Dropdown.Item onClick={() => handleProcessRefund(refund)}>
                                          <FiArrowRight className="me-2" /> Process Refund
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleRejectRefund(refund)}>
                                          <FiX className="me-2" /> Reject Request
                                        </Dropdown.Item>
                                      </>
                                    )}
                                  </Dropdown.Menu>
                                </Dropdown>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="text-center py-4">
                              No refunds found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>

                  {filteredRefunds.length > refundsPerPage && (
                    <div className="d-flex justify-content-center mt-4">
                      <Pagination>
                        <Pagination.Prev
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        />

                        {Array.from({ length: totalPages }, (_, i) => (
                          <Pagination.Item
                            key={i + 1}
                            active={i + 1 === currentPage}
                            onClick={() => paginate(i + 1)}
                          >
                            {i + 1}
                          </Pagination.Item>
                        ))}

                        <Pagination.Next
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        />
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Refund Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Refund Details - {currentRefund?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentRefund && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <h5>Refund Information</h5>
                  <Table borderless size="sm">
                    <tbody>
                      <tr>
                        <td><strong>Refund ID:</strong></td>
                        <td>{currentRefund.id}</td>
                      </tr>
                      <tr>
                        <td><strong>Transaction ID:</strong></td>
                        <td>{currentRefund.transactionId}</td>
                      </tr>
                      <tr>
                        <td><strong>Invoice:</strong></td>
                        <td>{currentRefund.originalInvoice}</td>
                      </tr>
                      <tr>
                        <td><strong>Request Date:</strong></td>
                        <td>{formatDate(currentRefund.dateRequested)}</td>
                      </tr>
                      <tr>
                        <td><strong>Processed Date:</strong></td>
                        <td>{formatDate(currentRefund.dateProcessed) || '-'}</td>
                      </tr>
                      <tr>
                        <td><strong>Status:</strong></td>
                        <td>
                          <Badge bg={getStatusBadge(currentRefund.status)}>
                            {currentRefund.status}
                          </Badge>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col md={6}>
                  <h5>Customer Information</h5>
                  <Table borderless size="sm">
                    <tbody>
                      <tr>
                        <td><strong>Name:</strong></td>
                        <td>{currentRefund.customer}</td>
                      </tr>
                      <tr>
                        <td><strong>Email:</strong></td>
                        <td>{currentRefund.email}</td>
                      </tr>
                      <tr>
                        <td><strong>Payment Method:</strong></td>
                        <td>{currentRefund.paymentMethod}</td>
                      </tr>
                      <tr>
                        <td><strong>Amount:</strong></td>
                        <td>{formatAmount(currentRefund.amount)}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <h5>Refund Reason</h5>
                  <div className="bg-light p-3 rounded">
                    {currentRefund.reason}
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className='leave-button' onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
          {currentRefund?.status === 'pending' && (
            <>
              <Button className='leave-button' onClick={() => handleRejectRefund(currentRefund)}>
                <FiX className="me-2" /> Reject
              </Button>
              <Button className='leave-button' onClick={() => handleProcessRefund(currentRefund)}>
                <FiCheck className="me-2" /> Process Refund
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {/* Process Refund Modal */}
      <Modal show={showProcessModal} onHide={() => setShowProcessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Process Refund - {currentRefund?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentRefund && (
            <div>
              <p>You are about to process a refund of {formatAmount(currentRefund.amount)} to {currentRefund.customer}.</p>
              <p>Payment method: {currentRefund.paymentMethod}</p>
              
              <Form.Group className="mb-3">
                <Form.Label>Additional Notes (Optional)</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Add any notes about this refund..." />
              </Form.Group>
              
              <Alert variant="warning">
                This action cannot be undone. The refund will be processed immediately.
              </Alert>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className='leave-button' onClick={() => setShowProcessModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmProcessRefund} disabled={loading}>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Processing...
              </>
            ) : (
              'Confirm Refund'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Refunds;