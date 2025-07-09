import React, { useState } from 'react';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';

const LogSettings = () => {
  const [settings, setSettings] = useState({
    retentionDays: 30,
    logUserActivities: true,
    logSystemEvents: true,
    logFailedLogins: true,
    logLevel: 'info', // 'debug', 'info', 'warn', 'error'
  });
  const [saveStatus, setSaveStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSaveStatus({
        success: true,
        message: 'Log settings updated successfully!'
      });
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };

  return (
    <Card className="p-4">
      <h4 className="mb-4">Log Settings</h4>
      
      {saveStatus && (
        <Alert variant={saveStatus.success ? 'success' : 'danger'}>
          {saveStatus.message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Log Retention Period (Days)</Form.Label>
              <Form.Control
                type="number"
                name="retentionDays"
                min="1"
                max="365"
                value={settings.retentionDays}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Logging Level</Form.Label>
              <Form.Select
                name="logLevel"
                value={settings.logLevel}
                onChange={handleChange}
              >
                <option value="debug">Debug (Most verbose)</option>
                <option value="info">Info (Default)</option>
                <option value="warn">Warnings</option>
                <option value="error">Errors Only</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Check
            type="switch"
            id="logUserActivities"
            label="Log User Activities"
            name="logUserActivities"
            checked={settings.logUserActivities}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="switch"
            id="logSystemEvents"
            label="Log System Events"
            name="logSystemEvents"
            checked={settings.logSystemEvents}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Check
            type="switch"
            id="logFailedLogins"
            label="Log Failed Login Attempts"
            name="logFailedLogins"
            checked={settings.logFailedLogins}
            onChange={handleChange}
          />
        </Form.Group>

        <div className="d-flex justify-content-end">
          <Button className='leave-button' type="submit">
            Save Settings
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default LogSettings;