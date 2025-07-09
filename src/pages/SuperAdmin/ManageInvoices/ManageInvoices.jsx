import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import InvoiceTable from './InvoiceTable';
import InvoiceFilters from './InvoiceFilters';
import InvoiceForm from './InvoiceForm';
import { downloadCSV } from '../../../utils/exportHelpers';

const ManageInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateFrom: '',
    dateTo: ''
  });

  // Load sample data (replace with API call)
  useEffect(() => {
    const sampleData = [
      { id: 1, invoiceNo: 'INV-2023-001', client: 'Acme Corp', date: '2023-11-01', dueDate: '2023-11-30', amount: 1250.50, status: 'paid' },
      { id: 2, invoiceNo: 'INV-2023-002', client: 'Globex Inc', date: '2023-11-05', dueDate: '2023-12-05', amount: 890.00, status: 'pending' },
      { id: 3, invoiceNo: 'INV-2023-003', client: 'Soylent Corp', date: '2023-11-10', dueDate: '2023-12-10', amount: 2450.75, status: 'overdue' },
    ];
    setInvoices(sampleData);
    setFilteredInvoices(sampleData);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = invoices;
    
    if (filters.status !== 'all') {
      result = result.filter(inv => inv.status === filters.status);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(inv => 
        inv.invoiceNo.toLowerCase().includes(searchTerm) ||
        inv.client.toLowerCase().includes(searchTerm)
  )}
    
    if (filters.dateFrom) {
      result = result.filter(inv => inv.date >= filters.dateFrom);
    }
    
    if (filters.dateTo) {
      result = result.filter(inv => inv.date <= filters.dateTo);
    }
    
    setFilteredInvoices(result);
  }, [filters, invoices]);

  const handleEdit = (invoice) => {
    setCurrentInvoice(invoice);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(invoices.filter(inv => inv.id !== id));
    }
  };

  const handleExport = () => {
    const headers = ['Invoice No', 'Client', 'Date', 'Due Date', 'Amount', 'Status'];
    const data = filteredInvoices.map(inv => [
      inv.invoiceNo,
      inv.client,
      inv.date,
      inv.dueDate,
      inv.amount,
      inv.status
    ]);
    downloadCSV(data, headers, 'invoices_export');
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Manage Invoices</h2>
        </Col>
        <Col className="text-end">
          <Button className='leave-button' onClick={() => { setCurrentInvoice(null); setShowForm(true); }}>
            <i className="bi bi-plus-circle me-2"></i>Create Invoice
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <InvoiceFilters 
            filters={filters} 
            setFilters={setFilters} 
            onExport={handleExport}
          />
          
          <InvoiceTable 
            invoices={filteredInvoices}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Card.Body>
      </Card>

      <InvoiceForm 
        show={showForm}
        handleClose={() => setShowForm(false)}
        invoice={currentInvoice}
        onSubmit={(formData) => {
          if (currentInvoice) {
            // Update existing
            setInvoices(invoices.map(inv => 
              inv.id === currentInvoice.id ? { ...formData, id: currentInvoice.id } : inv
            ));
          } else {
            // Add new
            setInvoices([...invoices, { ...formData, id: invoices.length + 1 }]);
          }
          setShowForm(false);
        }}
      />
    </Container>
  );
};

export default ManageInvoices;