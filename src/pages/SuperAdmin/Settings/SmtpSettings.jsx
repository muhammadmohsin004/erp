import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';

const SmtpSettings = () => {
  const [formData, setFormData] = useState({
    smtpHost: 'smtp.example.com',
    smtpPort: '587',
    smtpUsername: 'user@example.com',
    smtpPassword: '',
    encryption: 'tls',
  });
  const [testResult, setTestResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTest = () => {
    // Simulate SMTP test
    setTimeout(() => {
      setTestResult({
        success: true,
        message: 'SMTP connection successful!',
      });
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('SMTP settings saved:', formData);
    alert('SMTP settings updated!');
  };

  return (
    <Card className="p-4">
      <h5 className="mb-4">SMTP Settings</h5>
      
      {testResult && (
        <Alert variant={testResult.success ? 'success' : 'danger'}>
          {testResult.message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>SMTP Host</Form.Label>
          <Form.Control
            type="text"
            name="smtpHost"
            value={formData.smtpHost}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>SMTP Port</Form.Label>
          <Form.Control
            type="number"
            name="smtpPort"
            value={formData.smtpPort}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="smtpUsername"
            value={formData.smtpUsername}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="smtpPassword"
            value={formData.smtpPassword}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Encryption</Form.Label>
          <Form.Select
            name="encryption"
            value={formData.encryption}
            onChange={handleChange}
          >
            <option value="tls">TLS</option>
            <option value="ssl">SSL</option>
            <option value="none">None</option>
          </Form.Select>
        </Form.Group>

        <div className="d-flex gap-2">
          <Button className='leave-button' type="submit">
            Save Settings
          </Button>
          <Button className='leave-button' onClick={handleTest}>
            Test Connection
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default SmtpSettings;