import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

const SystemSettings = () => {
  const [formData, setFormData] = useState({
    appName: 'ERP Solution',
    timezone: 'UTC',
    maintenanceMode: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('System settings saved:', formData);
    alert('System settings updated!');
  };

  return (
    <Card className="p-4">
      <h5 className="mb-4">System Settings</h5>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Application Name</Form.Label>
          <Form.Control
            type="text"
            name="appName"
            value={formData.appName}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Timezone</Form.Label>
          <Form.Select
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
          >
            <option value="UTC">UTC</option>
            <option value="EST">EST</option>
            <option value="PST">PST</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="switch"
            label="Maintenance Mode"
            name="maintenanceMode"
            checked={formData.maintenanceMode}
            onChange={handleChange}
          />
        </Form.Group>

        <Button className='leave-button' type="submit">
          Save Changes
        </Button>
      </Form>
    </Card>
  );
};

export default SystemSettings;