import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, Spinner, InputGroup } from 'react-bootstrap';
import { FiSearch, FiEdit2, FiTrash2, FiPlus, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const ManageModules = () => {
  // Sample modules data
  const initialModules = [
    { id: 1, name: 'User Management', description: 'Manage system users and permissions', status: 'active', created: '2023-05-15' },
    { id: 2, name: 'Content Management', description: 'Create and manage website content', status: 'inactive', created: '2023-06-20' },
    { id: 3, name: 'Analytics Dashboard', description: 'View system analytics and reports', status: 'active', created: '2023-07-10' },
    { id: 4, name: 'Billing System', description: 'Manage subscriptions and payments', status: 'active', created: '2023-08-05' },
    { id: 5, name: 'Notification Center', description: 'Configure and send notifications', status: 'inactive', created: '2023-09-12' },
  ];

  const [modules, setModules] = useState(initialModules);
  const [filteredModules, setFilteredModules] = useState(initialModules);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentModule, setCurrentModule] = useState({ id: '', name: '', description: '', status: 'active' });
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);

  // Filter modules based on search term
  useEffect(() => {
    const results = modules.filter(module =>
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredModules(results);
  }, [searchTerm, modules]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusToggle = (moduleId) => {
    setModules(modules.map(module =>
      module.id === moduleId
        ? { ...module, status: module.status === 'active' ? 'inactive' : 'active' }
        : module
    ));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentModule({ ...currentModule, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (isEditing) {
        // Update existing module
        setModules(modules.map(module =>
          module.id === currentModule.id ? currentModule : module
        ));
      } else {
        // Add new module
        const newModule = {
          ...currentModule,
          id: modules.length + 1,
          created: new Date().toISOString().split('T')[0]
        };
        setModules([...modules, newModule]);
      }

      setIsLoading(false);
      setShowModal(false);
      resetForm();
    }, 1000);
  };

  const resetForm = () => {
    setCurrentModule({ id: '', name: '', description: '', status: 'active' });
    setIsEditing(false);
  };

  const handleEdit = (module) => {
    setCurrentModule(module);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteClick = (module) => {
    setModuleToDelete(module);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setModules(modules.filter(module => module.id !== moduleToDelete.id));
      setIsLoading(false);
      setShowDeleteModal(false);
      setModuleToDelete(null);
    }, 800);
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Manage Modules</h2>
          <p className="text-muted">View, add, edit, and manage system modules</p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text>
              <FiSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search modules by name or description..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </InputGroup>
        </Col>
        <Col md={4} className="d-flex justify-content-end">
          <Button className='leave-button' onClick={() => setShowModal(true)}>
            <FiPlus className="me-2" /> Add New Module
          </Button>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Module Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredModules.length > 0 ? (
                  filteredModules.map(module => (
                    <tr key={module.id}>
                      <td className="fw-semibold">{module.name}</td>
                      <td className="text-muted">{module.description}</td>
                      <td>
                        <Badge bg={module.status === 'active' ? 'success' : 'secondary'} className="d-flex align-items-center">
                          {module.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>{module.created}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEdit(module)}
                          >
                            <FiEdit2 />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteClick(module)}
                          >
                            <FiTrash2 />
                          </Button>
                          <Button
                            variant={module.status === 'active' ? 'outline-success' : 'outline-secondary'}
                            size="sm"
                            onClick={() => handleStatusToggle(module.id)}
                          >
                            {module.status === 'active' ? <FiToggleLeft /> : <FiToggleRight />}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No modules found. Try a different search or add a new module.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Add/Edit Module Modal */}
      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Module' : 'Add New Module'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Module Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentModule.name}
                onChange={handleInputChange}
                required
                placeholder="Enter module name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={currentModule.description}
                onChange={handleInputChange}
                required
                placeholder="Enter module description"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={currentModule.status}
                onChange={handleInputChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>
              Cancel
            </Button>
            <Button className='leave-button' type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span className="ms-2">Saving...</span>
                </>
              ) : isEditing ? (
                'Update Module'
              ) : (
                'Add Module'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the module <strong>{moduleToDelete?.name}</strong>? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Deleting...</span>
              </>
            ) : (
              'Delete Module'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageModules;