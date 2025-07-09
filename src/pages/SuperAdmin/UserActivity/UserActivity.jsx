import React, { useState } from 'react';
import { Card, Table, Form, Button, Badge, InputGroup } from 'react-bootstrap';
import UserActivityTable from './UserActivityTable';

const UserActivity = () => {
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [userFilter, setUserFilter] = useState('');

  // Sample data - replace with API call
  const activities = [
    {
      id: 1,
      user: 'admin@erp.com',
      action: 'Created new company "Acme Inc"',
      timestamp: '2023-11-15 09:30:45',
      ip: '192.168.1.100',
      status: 'success'
    },
    {
      id: 2,
      user: 'manager@company.com',
      action: 'Updated payroll records',
      timestamp: '2023-11-15 10:15:22',
      ip: '203.0.113.45',
      status: 'success'
    },
    {
      id: 3,
      user: 'employee@test.com',
      action: 'Failed login attempt',
      timestamp: '2023-11-14 14:05:33',
      ip: '198.51.100.22',
      status: 'failed'
    }
  ];

  const filteredActivities = activities.filter(activity => {
    const matchesUser = activity.user.toLowerCase().includes(userFilter.toLowerCase());
    const matchesDate = (
      (!dateRange.start || activity.timestamp >= dateRange.start) &&
      (!dateRange.end || activity.timestamp <= dateRange.end + ' 23:59:59')
    );
    return matchesUser && matchesDate;
  });

  return (
    <Card className="p-4 pt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>User Activity Logs</h4>
        <div className="d-flex gap-3">
          <InputGroup style={{ width: '250px' }}>
            <Form.Control
              placeholder="Filter by user..."
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            />
          </InputGroup>
          <InputGroup style={{ width: '300px' }}>
            <Form.Control
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            />
            <InputGroup.Text>to</InputGroup.Text>
            <Form.Control
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            />
          </InputGroup>
        </div>
      </div>

      <UserActivityTable activities={filteredActivities} />

      <div className="d-flex justify-content-between mt-3">
        <small className="text-muted">
          Showing {filteredActivities.length} of {activities.length} records
        </small>
        <Button className='leave-button' size="sm">
          <i className="bi bi-download me-2"></i>Export Logs
        </Button>
      </div>
    </Card>
  );
};

export default UserActivity;