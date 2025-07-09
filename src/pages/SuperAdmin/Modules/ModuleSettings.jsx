import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Form, 
  Modal, 
  Badge, 
  Spinner, 
  InputGroup,
  Tab,
  Nav,
  Alert
} from 'react-bootstrap';
import { 
  FiSearch, 
  FiEdit2, 
  FiTrash2, 
  FiPlus, 
  FiToggleLeft, 
  FiToggleRight,
  FiSettings,
  FiPackage,
  FiLink,
  FiEye,
  FiEyeOff,
  FiSave,
  FiUpload,
  FiDownload
} from 'react-icons/fi';

const ModuleSettings = () => {
  // Sample modules data
  const initialModules = [
    {
      id: 1,
      name: 'User Management',
      description: 'Manage system users and their permissions',
      status: 'active',
      version: '1.2.0',
      installedDate: '2023-05-15',
      dependencies: ['Core System'],
      settings: {
        allowSelfRegistration: true,
        requireEmailVerification: false,
        defaultRole: 'user'
      }
    },
    {
      id: 2,
      name: 'Content Management',
      description: 'Create and manage website content',
      status: 'inactive',
      version: '2.1.3',
      installedDate: '2023-06-20',
      dependencies: ['Core System', 'Media Library'],
      settings: {
        enableComments: true,
        maxRevisions: 10,
        autoSaveInterval: 5
      }
    },
    {
      id: 3,
      name: 'Analytics Dashboard',
      description: 'View system analytics and reports',
      status: 'active',
      version: '3.0.1',
      installedDate: '2023-07-10',
      dependencies: ['Core System', 'Data Collection'],
      settings: {
        retentionPeriod: 30,
        anonymizeData: false,
        dashboardRefresh: 15
      }
    }
  ];

  const [modules, setModules] = useState(initialModules);
  const [filteredModules, setFilteredModules] = useState(initialModules);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentModule, setCurrentModule] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showSettingsAlert, setShowSettingsAlert] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentModule({
      ...currentModule,
      settings: {
        ...currentModule.settings,
        [name]: type === 'checkbox' ? checked : value
      }
    });
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
        setShowSettingsAlert(true);
      } else {
        // Add new module
        const newModule = {
          ...currentModule,
          id: modules.length + 1,
          installedDate: new Date().toISOString().split('T')[0],
          status: 'inactive',
          version: '1.0.0',
          dependencies: [],
          settings: {}
        };
        setModules([...modules, newModule]);
      }

      setIsLoading(false);
      setShowModal(false);
      setCurrentModule(null);
    }, 1000);
  };

  const resetForm = () => {
    setCurrentModule(null);
    setIsEditing(false);
  };

  const handleEdit = (module) => {
    setCurrentModule(JSON.parse(JSON.stringify(module)));
    setIsEditing(true);
    setShowModal(true);
    setActiveTab('overview');
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploadProgress(0);
          // Here you would typically handle the actual module installation
          alert(`${file.name} uploaded successfully!`);
        }, 500);
      }
      setUploadProgress(Math.min(progress, 100));
    }, 200);
  };

  const exportModuleConfig = (module) => {
    // Simulate export
    const dataStr = JSON.stringify(module, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${module.name}_config.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold"><FiSettings className="me-2" />Module Settings</h2>
          <p className="text-muted">Manage system modules and their configurations</p>
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
        <Col md={4} className="d-flex justify-content-end gap-2">
          <Button className='leave-button' onClick={() => setShowModal(true)}>
            <FiPlus className="me-2" /> Add Module
          </Button>
          <Button variant="outline-primary">
            <FiDownload className="me-2" /> Export All
          </Button>
        </Col>
      </Row>

      {showSettingsAlert && (
        <Alert variant="success" onClose={() => setShowSettingsAlert(false)} dismissible className="mb-4">
          Module settings saved successfully! Some changes may require a system restart to take effect.
        </Alert>
      )}

      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Module</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Version</th>
                  <th>Installed On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredModules.length > 0 ? (
                  filteredModules.map(module => (
                    <tr key={module.id}>
                      <td className="fw-semibold">
                        <FiPackage className="me-2 text-primary" />
                        {module.name}
                      </td>
                      <td className="text-muted">{module.description}</td>
                      <td>
                        <Badge bg={module.status === 'active' ? 'success' : 'secondary'} className="d-flex align-items-center">
                          {module.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>{module.version}</td>
                      <td>{module.installedDate}</td>
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
                    <td colSpan="6" className="text-center py-4">
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
      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FiSettings className="me-2" />
            {isEditing ? `Edit ${currentModule?.name}` : 'Add New Module'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
              <Nav variant="tabs" className="mb-3">
                <Nav.Item>
                  <Nav.Link eventKey="overview">Overview</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="dependencies" disabled={!isEditing}>
                    Dependencies
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="settings" disabled={!isEditing}>
                    Settings
                  </Nav.Link>
                </Nav.Item>
                {!isEditing && (
                  <Nav.Item>
                    <Nav.Link eventKey="upload">
                      <FiUpload className="me-1" /> Upload Module
                    </Nav.Link>
                  </Nav.Item>
                )}
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="overview">
                  <Form.Group className="mb-3">
                    <Form.Label>Module Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={currentModule?.name || ''}
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
                      value={currentModule?.description || ''}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter module description"
                    />
                  </Form.Group>
                  {isEditing && (
                    <>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Version</Form.Label>
                            <Form.Control
                              type="text"
                              name="version"
                              value={currentModule?.version || ''}
                              onChange={handleInputChange}
                              placeholder="e.g., 1.0.0"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                              name="status"
                              value={currentModule?.status || 'inactive'}
                              onChange={handleInputChange}
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </>
                  )}
                </Tab.Pane>

                <Tab.Pane eventKey="dependencies">
                  <div className="p-3 border rounded bg-light">
                    <h6 className="mb-3">Current Dependencies</h6>
                    {currentModule?.dependencies?.length > 0 ? (
                      <ul className="list-group">
                        {currentModule.dependencies.map((dep, index) => (
                          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <FiLink className="me-2" />
                            {dep}
                            <Button variant="outline-danger" size="sm">
                              Remove
                            </Button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted">No dependencies added</p>
                    )}
                  </div>
                  <div className="mt-3">
                    <Form.Group>
                      <Form.Label>Add Dependency</Form.Label>
                      <InputGroup>
                        <Form.Select>
                          <option>Select a module...</option>
                          {modules
                            .filter(m => m.id !== currentModule?.id && !currentModule?.dependencies?.includes(m.name))
                            .map(m => (
                              <option key={m.id} value={m.name}>{m.name}</option>
                            ))}
                        </Form.Select>
                        <Button className='leave-button'>
                          Add
                        </Button>
                      </InputGroup>
                    </Form.Group>
                  </div>
                </Tab.Pane>

                <Tab.Pane eventKey="settings">
                  {currentModule?.settings ? (
                    <div className="p-3 border rounded">
                      <h6 className="mb-3">Module Configuration</h6>
                      {Object.entries(currentModule.settings).map(([key, value]) => (
                        <Form.Group key={key} className="mb-3">
                          <Form.Label>
                            {key.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </Form.Label>
                          {typeof value === 'boolean' ? (
                            <Form.Check
                              type="switch"
                              id={key}
                              name={key}
                              checked={value}
                              onChange={handleSettingsChange}
                              label={value ? 'Enabled' : 'Disabled'}
                            />
                          ) : (
                            <Form.Control
                              type={typeof value === 'number' ? 'number' : 'text'}
                              name={key}
                              value={value}
                              onChange={handleSettingsChange}
                            />
                          )}
                        </Form.Group>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No settings available for this module</p>
                  )}
                </Tab.Pane>

                <Tab.Pane eventKey="upload">
                  <div className="text-center p-4 border rounded bg-light">
                    <FiUpload size={48} className="mb-3 text-primary" />
                    <h5>Upload Module Package</h5>
                    <p className="text-muted mb-4">
                      Upload a .zip file containing the module files and configuration
                    </p>
                    <Form.Group>
                      <Form.Control
                        type="file"
                        accept=".zip"
                        onChange={handleFileUpload}
                      />
                    </Form.Group>
                    {uploadProgress > 0 && (
                      <div className="mt-3">
                        <div className="progress">
                          <div
                            className="progress-bar progress-bar-striped progress-bar-animated"
                            role="progressbar"
                            style={{ width: `${uploadProgress}%` }}
                            aria-valuenow={uploadProgress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          >
                            {Math.round(uploadProgress)}%
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Modal.Body>
          <Modal.Footer>
            <div className="d-flex justify-content-between w-100">
              <div>
                {isEditing && (
                  <Button variant="outline-secondary" onClick={() => exportModuleConfig(currentModule)}>
                    <FiDownload className="me-2" /> Export Config
                  </Button>
                )}
              </div>
              <div>
                <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }} className="me-2">
                  Cancel
                </Button>
                <Button className='leave-button' type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="ms-2">Saving...</span>
                    </>
                  ) : isEditing ? (
                    <>
                      <FiSave className="me-2" /> Save Changes
                    </>
                  ) : (
                    'Add Module'
                  )}
                </Button>
              </div>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Module Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the <strong>{moduleToDelete?.name}</strong> module?</p>
          <p className="text-danger">
            <strong>Warning:</strong> This action will remove all module files and configurations and cannot be undone.
          </p>
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

export default ModuleSettings;