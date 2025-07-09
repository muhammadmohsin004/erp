import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';

const statusVariant = {
  paid: 'success',
  pending: 'warning',
  overdue: 'danger',
  cancelled: 'secondary'
};

const InvoiceTable = ({ invoices, onEdit, onDelete }) => {
  return (
    <Table striped bordered hover responsive className="mt-3">
      <thead>
        <tr>
          <th>Invoice #</th>
          <th>Client</th>
          <th>Date</th>
          <th>Due Date</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {invoices.length > 0 ? (
          invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.invoiceNo}</td>
              <td>{invoice.client}</td>
              <td>{invoice.date}</td>
              <td>{invoice.dueDate}</td>
              <td>${invoice.amount.toFixed(2)}</td>
              <td>
                <Badge bg={statusVariant[invoice.status]}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </Badge>
              </td>
              <td>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="me-2"
                  onClick={() => onEdit(invoice)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => onDelete(invoice.id)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="text-center py-4 text-muted">
              No invoices found matching your criteria
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default InvoiceTable;