import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Form, Button,
  Alert, Table, Badge, InputGroup, Modal, Tabs, Tab
} from 'react-bootstrap';
import {
  FiSettings, FiMail, FiUsers, FiMessageSquare,
  FiSave, FiRefreshCw, FiTrash2, FiPlus, FiEdit2, FiX, FiCheck
} from 'react-icons/fi';
// import { FaSpinner } from "react-icons/fa";

const SupportSettings = () => {
  // State for UI and data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState(null);
  const [editMode, setEditMode] = useState({
    template: null,
    member: null
  });

  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    supportEmail: 'support@company.com',
    businessHours: '9:00 AM - 6:00 PM (Mon-Fri)',
    responseTime: '24 hours',
    autoCloseTickets: true,
    closeAfterDays: 7
  });

  const [emailTemplates, setEmailTemplates] = useState([
    { id: 1, name: 'Ticket Created', subject: 'Your ticket has been received', body: 'Hello {customer_name}, we have received your ticket #{ticket_id}', isActive: true },
    { id: 2, name: 'Ticket Updated', subject: 'Your ticket has been updated', body: 'Hello {customer_name}, your ticket #{ticket_id} has been updated', isActive: true },
    { id: 3, name: 'Ticket Closed', subject: 'Your ticket has been resolved', body: 'Hello {customer_name}, your ticket #{ticket_id} has been resolved', isActive: false }
  ]);

  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'John Doe', email: 'john@company.com', role: 'Admin', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@company.com', role: 'Support', status: 'active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@company.com', role: 'Support', status: 'inactive' }
  ]);

  // New item states
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    body: '',
    isActive: true
  });

  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'Support',
    status: 'active'
  });

  // Form validation
  const [errors, setErrors] = useState({
    general: {},
    template: {},
    member: {}
  });

  // Load data from API (simulated)
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  // Handle general settings changes
  const handleGeneralSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Validate form
  const validateForm = (formType, data) => {
    const newErrors = {};
    
    if (formType === 'general') {
      if (!data.supportEmail.includes('@')) {
        newErrors.supportEmail = 'Please enter a valid email address';
      }
      if (data.autoCloseTickets && (!data.closeAfterDays || data.closeAfterDays < 1)) {
        newErrors.closeAfterDays = 'Please enter a valid number of days';
      }
    }
    
    if (formType === 'template') {
      if (!data.name.trim()) newErrors.name = 'Template name is required';
      if (!data.subject.trim()) newErrors.subject = 'Subject is required';
      if (!data.body.trim()) newErrors.body = 'Template body is required';
    }
    
    if (formType === 'member') {
      if (!data.name.trim()) newErrors.name = 'Name is required';
      if (!data.email.includes('@')) newErrors.email = 'Valid email is required';
    }
    
    setErrors(prev => ({ ...prev, [formType]: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  // Handle template operations
  const handleTemplateSubmit = (e) => {
    e.preventDefault();
    if (!validateForm('template', newTemplate)) return;
    
    setEmailTemplates(prev => [
      ...prev,
      { ...newTemplate, id: Math.max(...prev.map(t => t.id), 0) + 1 }
    ]);
    setNewTemplate({ name: '', subject: '', body: '', isActive: true });
    setSuccessMessage('Template added successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const updateTemplate = (template) => {
    if (!validateForm('template', template)) return;
    
    setEmailTemplates(prev =>
      prev.map(t => (t.id === template.id ? template : t))
    );
    setEditMode({ ...editMode, template: null });
    setSuccessMessage('Template updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const deleteTemplate = (id) => {
    setEmailTemplates(prev => prev.filter(t => t.id !== id));
    setSuccessMessage('Template deleted successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Handle team member operations
  const handleMemberSubmit = (e) => {
    e.preventDefault();
    if (!validateForm('member', newMember)) return;
    
    setTeamMembers(prev => [
      ...prev,
      { ...newMember, id: Math.max(...prev.map(m => m.id), 0) + 1 }
    ]);
    setNewMember({ name: '', email: '', role: 'Support', status: 'active' });
    setSuccessMessage('Team member added successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const updateMember = (member) => {
    if (!validateForm('member', member)) return;
    
    setTeamMembers(prev =>
      prev.map(m => (m.id === member.id ? member : m))
    );
    setEditMode({ ...editMode, member: null });
    setSuccessMessage('Team member updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const deleteMember = (id) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    setSuccessMessage('Team member removed successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Confirm action
  const confirmAction = (action) => {
    setActionToConfirm(action);
    setShowConfirmModal(true);
  };

  // Execute confirmed action
  const executeAction = () => {
    setLoading(true);
    setTimeout(() => {
      switch (actionToConfirm) {
        case 'resetSettings':
          setGeneralSettings({
            supportEmail: 'support@company.com',
            businessHours: '9:00 AM - 6:00 PM (Mon-Fri)',
            responseTime: '24 hours',
            autoCloseTickets: true,
            closeAfterDays: 7
          });
          setSuccessMessage('Settings reset to defaults successfully!');
          break;
        
        case 'saveSettings':
          if (validateForm('general', generalSettings)) {
            setSuccessMessage('Settings saved successfully!');
          }
          break;
        
        default:
          break;
      }
      
      setLoading(false);
      setShowConfirmModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  // Get badge colors
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      default: return 'primary';
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Admin': return 'danger';
      case 'Support': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <h2 className="mb-4">
            <FiSettings className="me-2" />
            Support Settings
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

          <Card>
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
              >
                {/* General Settings Tab */}
                <Tab eventKey="general" title={<><FiSettings className="me-1" /> General</>}>
                  <Form className="mt-3">
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group controlId="supportEmail">
                          <Form.Label>Support Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="supportEmail"
                            value={generalSettings.supportEmail}
                            onChange={handleGeneralSettingsChange}
                            isInvalid={!!errors.general.supportEmail}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.general.supportEmail}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="businessHours">
                          <Form.Label>Business Hours</Form.Label>
                          <Form.Control
                            type="text"
                            name="businessHours"
                            value={generalSettings.businessHours}
                            onChange={handleGeneralSettingsChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group controlId="responseTime">
                          <Form.Label>Expected Response Time</Form.Label>
                          <Form.Control
                            type="text"
                            name="responseTime"
                            value={generalSettings.responseTime}
                            onChange={handleGeneralSettingsChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="autoCloseTickets" className="mt-4">
                          <Form.Check
                            type="checkbox"
                            label="Automatically close inactive tickets"
                            name="autoCloseTickets"
                            checked={generalSettings.autoCloseTickets}
                            onChange={handleGeneralSettingsChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {generalSettings.autoCloseTickets && (
                      <Row className="mb-3">
                        <Col md={6}>
                          <Form.Group controlId="closeAfterDays">
                            <Form.Label>Close tickets after (days)</Form.Label>
                            <Form.Control
                              type="number"
                              name="closeAfterDays"
                              value={generalSettings.closeAfterDays}
                              onChange={handleGeneralSettingsChange}
                              min="1"
                              isInvalid={!!errors.general.closeAfterDays}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.general.closeAfterDays}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                    )}

                    <div className="d-flex justify-content-end gap-2 mt-4">
                      <Button variant="outline-secondary"
                        onClick={() => confirmAction('resetSettings')}
                        disabled={loading}
                      >
                        {/* {loading ? (
                          <FaSpinner className="me-2" animation="border" size="sm" />
                        ) : (
                          <FiRefreshCw className="me-2" />
                        )} */}
                        Reset to Defaults
                      </Button>
                      <Button className='leave-button'
                        onClick={() => confirmAction('saveSettings')}
                        disabled={loading}
                      >
                        {/* {loading ? (
                          <FaSpinner className="me-2" animation="border" size="sm" />
                        ) : (
                          <FiSave className="me-2" />
                        )} */}
                        Save Settings
                      </Button>
                    </div>
                  </Form>
                </Tab>

                {/* Email Templates Tab */}
                <Tab eventKey="templates" title={<><FiMail className="me-1" /> Email Templates</>}>
                  <div className="mt-3">
                    <Card className="mb-4">
                      <Card.Header>Add New Template</Card.Header>
                      <Card.Body>
                        <Form onSubmit={handleTemplateSubmit}>
                          <Row>
                            <Col md={4}>
                              <Form.Group className="mb-3">
                                <Form.Label>Template Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={newTemplate.name}
                                  onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                                  isInvalid={!!errors.template.name}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.template.name}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col md={8}>
                              <Form.Group className="mb-3">
                                <Form.Label>Subject</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={newTemplate.subject}
                                  onChange={(e) => setNewTemplate({...newTemplate, subject: e.target.value})}
                                  isInvalid={!!errors.template.subject}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.template.subject}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                          </Row>
                          <Form.Group className="mb-3">
                            <Form.Label>Template Body</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={4}
                              value={newTemplate.body}
                              onChange={(e) => setNewTemplate({...newTemplate, body: e.target.value})}
                              isInvalid={!!errors.template.body}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.template.body}
                            </Form.Control.Feedback>
                            <Form.Text className="text-muted">
                              Use placeholders like {"{customer_name}"} and {"{ticket_id}"}
                            </Form.Text>
                          </Form.Group>
                          <Form.Check
                            type="switch"
                            label="Active"
                            checked={newTemplate.isActive}
                            onChange={(e) => setNewTemplate({...newTemplate, isActive: e.target.checked})}
                          />
                          <div className="d-flex justify-content-end mt-3">
                            <Button className='leave-button' type="submit">
                              <FiPlus className="me-2" />
                              Add Template
                            </Button>
                          </div>
                        </Form>
                      </Card.Body>
                    </Card>

                    <Table bordered hover responsive>
                      <thead>
                        <tr>
                          <th width="20%">Template Name</th>
                          <th width="25%">Subject</th>
                          <th width="40%">Body Preview</th>
                          <th width="10%">Status</th>
                          <th width="5%">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {emailTemplates.map(template => (
                          <tr key={template.id}>
                            <td>
                              {editMode.template?.id === template.id ? (
                                <Form.Control
                                  type="text"
                                  value={editMode.template.name}
                                  onChange={(e) => setEditMode({
                                    ...editMode,
                                    template: {
                                      ...editMode.template,
                                      name: e.target.value
                                    }
                                  })}
                                />
                              ) : (
                                template.name
                              )}
                            </td>
                            <td>
                              {editMode.template?.id === template.id ? (
                                <Form.Control
                                  type="text"
                                  value={editMode.template.subject}
                                  onChange={(e) => setEditMode({
                                    ...editMode,
                                    template: {
                                      ...editMode.template,
                                      subject: e.target.value
                                    }
                                  })}
                                />
                              ) : (
                                template.subject
                              )}
                            </td>
                            <td>
                              {editMode.template?.id === template.id ? (
                                <Form.Control
                                  as="textarea"
                                  rows={2}
                                  value={editMode.template.body}
                                  onChange={(e) => setEditMode({
                                    ...editMode,
                                    template: {
                                      ...editMode.template,
                                      body: e.target.value
                                    }
                                  })}
                                />
                              ) : (
                                <div className="text-truncate" style={{ maxWidth: '300px' }}>
                                  {template.body}
                                </div>
                              )}
                            </td>
                            <td className="align-middle">
                              <Form.Check
                                type="switch"
                                id={`template-switch-${template.id}`}
                                label=""
                                checked={template.isActive}
                                onChange={() => {
                                  setEmailTemplates(prev =>
                                    prev.map(t =>
                                      t.id === template.id
                                        ? { ...t, isActive: !t.isActive }
                                        : t
                                    )
                                  );
                                }}
                              />
                            </td>
                            <td className="align-middle">
                              {editMode.template?.id === template.id ? (
                                <div className="d-flex">
                                  <Button
                                    variant="success"
                                    size="sm"
                                    className="me-1"
                                    onClick={() => updateTemplate(editMode.template)}
                                  >
                                    <FiCheck />
                                  </Button>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => setEditMode({ ...editMode, template: null })}
                                  >
                                    <FiX />
                                  </Button>
                                </div>
                              ) : (
                                <div className="d-flex">
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="me-1"
                                    onClick={() => setEditMode({
                                      ...editMode,
                                      template: { ...template }
                                    })}
                                  >
                                    <FiEdit2 />
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => deleteTemplate(template.id)}
                                  >
                                    <FiTrash2 />
                                  </Button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Tab>

                {/* Team Members Tab */}
                <Tab eventKey="team" title={<><FiUsers className="me-1" /> Team Members</>}>
                  <div className="mt-3">
                    <Card className="mb-4">
                      <Card.Header>Add New Team Member</Card.Header>
                      <Card.Body>
                        <Form onSubmit={handleMemberSubmit}>
                          <Row>
                            <Col md={4}>
                              <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={newMember.name}
                                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                                  isInvalid={!!errors.member.name}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.member.name}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col md={4}>
                              <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                  type="email"
                                  value={newMember.email}
                                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                                  isInvalid={!!errors.member.email}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.member.email}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col md={4}>
                              <Form.Group className="mb-3">
                                <Form.Label>Role</Form.Label>
                                <Form.Select
                                  value={newMember.role}
                                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                                >
                                  <option value="Support">Support</option>
                                  <option value="Admin">Admin</option>
                                </Form.Select>
                              </Form.Group>
                            </Col>
                          </Row>
                          <div className="d-flex justify-content-between align-items-center">
                            <Form.Check
                              type="switch"
                              label="Active"
                              checked={newMember.status === 'active'}
                              onChange={(e) => setNewMember({
                                ...newMember,
                                status: e.target.checked ? 'active' : 'inactive'
                              })}
                            />
                            <Button className='leave-button' type="submit">
                              <FiPlus className="me-2" />
                              Add Member
                            </Button>
                          </div>
                        </Form>
                      </Card.Body>
                    </Card>

                    <Table bordered hover responsive>
                      <thead>
                        <tr>
                          <th width="25%">Name</th>
                          <th width="25%">Email</th>
                          <th width="20%">Role</th>
                          <th width="20%">Status</th>
                          <th width="10%">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamMembers.map(member => (
                          <tr key={member.id}>
                            <td>
                              {editMode.member?.id === member.id ? (
                                <Form.Control
                                  type="text"
                                  value={editMode.member.name}
                                  onChange={(e) => setEditMode({
                                    ...editMode,
                                    member: {
                                      ...editMode.member,
                                      name: e.target.value
                                    }
                                  })}
                                />
                              ) : (
                                member.name
                              )}
                            </td>
                            <td>
                              {editMode.member?.id === member.id ? (
                                <Form.Control
                                  type="email"
                                  value={editMode.member.email}
                                  onChange={(e) => setEditMode({
                                    ...editMode,
                                    member: {
                                      ...editMode.member,
                                      email: e.target.value
                                    }
                                  })}
                                />
                              ) : (
                                member.email
                              )}
                            </td>
                            <td>
                              {editMode.member?.id === member.id ? (
                                <Form.Select
                                  value={editMode.member.role}
                                  onChange={(e) => setEditMode({
                                    ...editMode,
                                    member: {
                                      ...editMode.member,
                                      role: e.target.value
                                    }
                                  })}
                                >
                                  <option value="Support">Support</option>
                                  <option value="Admin">Admin</option>
                                </Form.Select>
                              ) : (
                                <Badge bg={getRoleBadge(member.role)}>
                                  {member.role}
                                </Badge>
                              )}
                            </td>
                            <td>
                              {editMode.member?.id === member.id ? (
                                <Form.Check
                                  type="switch"
                                  label=""
                                  checked={editMode.member.status === 'active'}
                                  onChange={(e) => setEditMode({
                                    ...editMode,
                                    member: {
                                      ...editMode.member,
                                      status: e.target.checked ? 'active' : 'inactive'
                                    }
                                  })}
                                />
                              ) : (
                                <Badge bg={getStatusBadge(member.status)}>
                                  {member.status}
                                </Badge>
                              )}
                            </td>
                            <td>
                              {editMode.member?.id === member.id ? (
                                <div className="d-flex">
                                  <Button
                                    variant="success"
                                    size="sm"
                                    className="me-1"
                                    onClick={() => updateMember(editMode.member)}
                                  >
                                    <FiCheck />
                                  </Button>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => setEditMode({ ...editMode, member: null })}
                                  >
                                    <FiX />
                                  </Button>
                                </div>
                              ) : (
                                <div className="d-flex">
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="me-1"
                                    onClick={() => setEditMode({
                                      ...editMode,
                                      member: { ...member }
                                    })}
                                  >
                                    <FiEdit2 />
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => deleteMember(member.id)}
                                  >
                                    <FiTrash2 />
                                  </Button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {actionToConfirm === 'resetSettings' && (
            <p>Are you sure you want to reset all settings to default values? This cannot be undone.</p>
          )}
          {actionToConfirm === 'saveSettings' && (
            <p>Are you sure you want to save these settings?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button
            className='leave-button'
            onClick={executeAction}
            disabled={loading}
          >
            {loading ? (
              <>
                {/* <FaSpinner className="me-2" animation="border" size="sm" /> */}
                Processing...
              </>
            ) : (
              'Confirm'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SupportSettings;