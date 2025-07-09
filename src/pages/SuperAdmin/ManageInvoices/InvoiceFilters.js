import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

const InvoiceFilters = ({ filters, setFilters, onExport }) => {
  return (
    <Row className="mb-3 g-3">
      <Col md={3}>
        <Form.Select
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="all">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </Form.Select>
      </Col>
      
      <Col md={3}>
        <Form.Control
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
          placeholder="From date"
        />
      </Col>
      
      <Col md={3}>
        <Form.Control
          type="date"
          value={filters.dateTo}
          onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
          placeholder="To date"
          min={filters.dateFrom}
        />
      </Col>
      
      <Col md={3}>
        <Form.Control
          type="text"
          placeholder="Search invoices..."
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
        />
      </Col>
      
      <Col className="text-end">
        <Button className='leave-button' onClick={onExport}>
          <i className="bi bi-download me-2"></i>Export
        </Button>
      </Col>
    </Row>
  );
};

export default InvoiceFilters;