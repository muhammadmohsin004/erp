import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Table, Button,
  Form, Modal, Alert, Badge, Spinner, Pagination,
  InputGroup
} from 'react-bootstrap';
import {
  FiDollarSign, FiRefreshCw, FiSearch, FiEye,
  FiCheck, FiX, FiClock, FiDownload
} from 'react-icons/fi';

const PaymentTransactions = () => {
  // State for transactions data
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);

  // Modal state
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  // Fetch transactions data (simulated)
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          const mockTransactions = [
            {
              id: 'TXN_1001',
              customer: 'John Doe',
              email: 'john@example.com',
              amount: 29.99,
              date: '2023-05-15',
              paymentMethod: 'Credit Card',
              status: 'completed',
              plan: 'Professional',
              invoiceId: 'INV_20230515_001'
            },
            {
              id: 'TXN_1002',
              customer: 'Jane Smith',
              email: 'jane@example.com',
              amount: 99.99,
              date: '2023-05-14',
              paymentMethod: 'PayPal',
              status: 'completed',
              plan: 'Enterprise',
              invoiceId: 'INV_20230514_002'
            },
            {
              id: 'TXN_1003',
              customer: 'Robert Johnson',
              email: 'robert@example.com',
              amount: 9.99,
              date: '2023-05-13',
              paymentMethod: 'Credit Card',
              status: 'failed',
              plan: 'Starter',
              invoiceId: 'INV_20230513_003'
            },
            {
              id: 'TXN_1004',
              customer: 'Emily Davis',
              email: 'emily@example.com',
              amount: 29.99,
              date: '2023-05-12',
              paymentMethod: 'Bank Transfer',
              status: 'pending',
              plan: 'Professional',
              invoiceId: 'INV_20230512_004'
            },
            {
              id: 'TXN_1005',
              customer: 'Michael Wilson',
              email: 'michael@example.com',
              amount: 99.99,
              date: '2023-05-11',
              paymentMethod: 'Credit Card',
              status: 'refunded',
              plan: 'Enterprise',
              invoiceId: 'INV_20230511_005'
            },
            {
              id: 'TXN_1006',
              customer: 'Sarah Brown',
              email: 'sarah@example.com',
              amount: 9.99,
              date: '2023-05-10',
              paymentMethod: 'PayPal',
              status: 'completed',
              plan: 'Starter',
              invoiceId: 'INV_20230510_006'
            },
            {
              id: 'TXN_1007',
              customer: 'David Taylor',
              email: 'david@example.com',
              amount: 29.99,
              date: '2023-05-09',
              paymentMethod: 'Credit Card',
              status: 'completed',
              plan: 'Professional',
              invoiceId: 'INV_20230509_007'
            },
          ];
          setTransactions(mockTransactions);
          setFilteredTransactions(mockTransactions);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to fetch transactions. Please try again later.');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter transactions based on search and status
  useEffect(() => {
    let results = transactions;
    
    if (searchTerm) {
      results = results.filter(txn =>
        txn.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      results = results.filter(txn => txn.status === statusFilter);
    }

    setFilteredTransactions(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, transactions]);

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle view details
  const handleViewDetails = (transaction) => {
    setCurrentTransaction(transaction);
    setShowDetailsModal(true);
  };

  // Refresh transactions
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage('Transactions refreshed successfully!');
    }, 800);
  };

  // Export transactions
  const handleExport = () => {
    setSuccessMessage('Export started. You will receive an email shortly.');
  };

  // Get badge variant based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'danger';
      case 'refunded': return 'info';
      default: return 'secondary';
    }
  };

  // Format date
  const formatDate = (dateString) => {
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
            <FiDollarSign className="me-2" />
            Payment Transactions
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
                        placeholder="Search transactions..."
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
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </Form.Select>
                  </Form.Group>
                </div>

                <div className="d-flex gap-2">
                  <Button className='leave-button' onClick={handleRefresh}>
                    <FiRefreshCw className="me-2" />
                    Refresh
                  </Button>
                  <Button className='leave-button' onClick={handleExport}>
                    <FiDownload className="me-2" />
                    Export
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading transactions...</p>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Transaction ID</th>
                          <th>Customer</th>
                          <th>Amount</th>
                          <th>Date</th>
                          <th>Payment Method</th>
                          <th>Status</th>
                          <th>Plan</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentTransactions.length > 0 ? (
                          currentTransactions.map(txn => (
                            <tr key={txn.id}>
                              <td>
                                <small className="text-muted">{txn.id}</small>
                              </td>
                              <td>
                                <div>{txn.customer}</div>
                                <small className="text-muted">{txn.email}</small>
                              </td>
                              <td>{formatAmount(txn.amount)}</td>
                              <td>{formatDate(txn.date)}</td>
                              <td>{txn.paymentMethod}</td>
                              <td>
                                <Badge bg={getStatusBadge(txn.status)}>
                                  {txn.status === 'pending' && <FiClock className="me-1" />}
                                  {txn.status === 'completed' && <FiCheck className="me-1" />}
                                  {txn.status === 'failed' && <FiX className="me-1" />}
                                  {txn.status}
                                </Badge>
                              </td>
                              <td>{txn.plan}</td>
                              <td>
                                <Button
                                  className='leave-button'
                                  onClick={() => handleViewDetails(txn)}
                                >
                                  <FiEye />
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="text-center py-4">
                              No transactions found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>

                  {filteredTransactions.length > transactionsPerPage && (
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

      {/* Transaction Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Transaction Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentTransaction && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <h5>Transaction Information</h5>
                  <Table borderless size="sm">
                    <tbody>
                      <tr>
                        <td><strong>Transaction ID:</strong></td>
                        <td>{currentTransaction.id}</td>
                      </tr>
                      <tr>
                        <td><strong>Invoice ID:</strong></td>
                        <td>{currentTransaction.invoiceId}</td>
                      </tr>
                      <tr>
                        <td><strong>Date:</strong></td>
                        <td>{formatDate(currentTransaction.date)}</td>
                      </tr>
                      <tr>
                        <td><strong>Status:</strong></td>
                        <td>
                          <Badge bg={getStatusBadge(currentTransaction.status)}>
                            {currentTransaction.status}
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
                        <td>{currentTransaction.customer}</td>
                      </tr>
                      <tr>
                        <td><strong>Email:</strong></td>
                        <td>{currentTransaction.email}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <h5>Payment Details</h5>
                  <Table borderless size="sm">
                    <tbody>
                      <tr>
                        <td><strong>Amount:</strong></td>
                        <td>{formatAmount(currentTransaction.amount)}</td>
                      </tr>
                      <tr>
                        <td><strong>Payment Method:</strong></td>
                        <td>{currentTransaction.paymentMethod}</td>
                      </tr>
                      <tr>
                        <td><strong>Plan:</strong></td>
                        <td>{currentTransaction.plan}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
          <Button className='leave-button' onClick={() => {
            // Handle any action like resend receipt
            setSuccessMessage('Receipt has been resent to customer email');
            setShowDetailsModal(false);
          }}>
            Resend Receipt
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PaymentTransactions;