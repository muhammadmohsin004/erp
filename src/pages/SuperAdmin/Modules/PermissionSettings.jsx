import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, Spinner, InputGroup, Accordion } from 'react-bootstrap';
import { FiSearch, FiEdit2, FiSave, FiTrash2, FiPlus, FiChevronDown, FiChevronUp, FiUsers, FiLock, FiCheck, FiX } from 'react-icons/fi';

const PermissionSettings = () => {
    // Sample data structure
    const initialPermissions = [
        {
            id: 1,
            role: 'Administrator',
            description: 'Full system access',
            modules: [
                { name: 'Dashboard', view: true, create: true, edit: true, delete: true },
                { name: 'User Management', view: true, create: true, edit: true, delete: true },
                { name: 'Content Management', view: true, create: true, edit: true, delete: true },
            ]
        },
        {
            id: 2,
            role: 'Content Manager',
            description: 'Manage website content',
            modules: [
                { name: 'Dashboard', view: true, create: false, edit: false, delete: false },
                { name: 'Content Management', view: true, create: true, edit: true, delete: false },
            ]
        },
        {
            id: 3,
            role: 'Viewer',
            description: 'View content only',
            modules: [
                { name: 'Dashboard', view: true, create: false, edit: false, delete: false },
            ]
        }
    ];

    const allModules = ['Dashboard', 'User Management', 'Content Management', 'Reports', 'Settings'];

    const [permissions, setPermissions] = useState(initialPermissions);
    const [filteredPermissions, setFilteredPermissions] = useState(initialPermissions);
    const [searchTerm, setSearchTerm] = useState('');
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [currentRole, setCurrentRole] = useState({ id: '', role: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);
    const [activeAccordion, setActiveAccordion] = useState(null);
    const [editingPermissions, setEditingPermissions] = useState(null);

    // Filter permissions based on search term
    useEffect(() => {
        const results = permissions.filter(permission =>
            permission.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            permission.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPermissions(results);
    }, [searchTerm, permissions]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentRole({ ...currentRole, [name]: value });
    };

    const handleSubmitRole = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            if (isEditing) {
                // Update existing role
                setPermissions(permissions.map(perm =>
                    perm.id === currentRole.id ? { ...perm, ...currentRole } : perm
                ));
            } else {
                // Add new role with default permissions
                const newRole = {
                    ...currentRole,
                    id: permissions.length + 1,
                    modules: allModules.map(module => ({
                        name: module,
                        view: false,
                        create: false,
                        edit: false,
                        delete: false
                    }))
                };
                setPermissions([...permissions, newRole]);
            }

            setIsLoading(false);
            setShowRoleModal(false);
            resetRoleForm();
        }, 1000);
    };

    const resetRoleForm = () => {
        setCurrentRole({ id: '', role: '', description: '' });
        setIsEditing(false);
    };

    const handleEditRole = (role) => {
        setCurrentRole(role);
        setIsEditing(true);
        setShowRoleModal(true);
    };

    const handleDeleteClick = (role) => {
        setRoleToDelete(role);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setPermissions(permissions.filter(perm => perm.id !== roleToDelete.id));
            setIsLoading(false);
            setShowDeleteModal(false);
            setRoleToDelete(null);
        }, 800);
    };

    const toggleAccordion = (id) => {
        setActiveAccordion(activeAccordion === id ? null : id);
    };

    const startEditingPermissions = (role) => {
        setEditingPermissions(JSON.parse(JSON.stringify(role)));
    };

    const cancelEditingPermissions = () => {
        setEditingPermissions(null);
    };

    const savePermissions = () => {
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setPermissions(permissions.map(perm =>
                perm.id === editingPermissions.id ? editingPermissions : perm
            ));
            setIsLoading(false);
            setEditingPermissions(null);
        }, 800);
    };

    const handlePermissionChange = (roleId, moduleName, permissionType, value) => {
        setEditingPermissions(prev => {
            const updatedModules = prev.modules.map(module => {
                if (module.name === moduleName) {
                    return { ...module, [permissionType]: value };
                }
                return module;
            });
            return { ...prev, modules: updatedModules };
        });
    };

    const toggleAllPermissions = (moduleName, value) => {
        setEditingPermissions(prev => {
            const updatedModules = prev.modules.map(module => {
                if (module.name === moduleName) {
                    return {
                        ...module,
                        view: value,
                        create: value,
                        edit: value,
                        delete: value
                    };
                }
                return module;
            });
            return { ...prev, modules: updatedModules };
        });
    };

    return (
        <Container fluid className="py-4">
            <Row className="mb-4">
                <Col>
                    <h2 className="fw-bold"><FiLock className="me-2" />Permission Settings</h2>
                    <p className="text-muted">Manage role-based access control for the system</p>
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
                            placeholder="Search roles by name or description..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </InputGroup>
                </Col>
                <Col md={4} className="d-flex justify-content-end">
                    <Button className="leave-button" onClick={() => setShowRoleModal(true)}>
                        <FiPlus className="me-2" /> Add New Role
                    </Button>
                </Col>
            </Row>

            <Card className="shadow-sm">
                <Card.Body className="p-0">
                    {filteredPermissions.length > 0 ? (
                        <Accordion activeKey={activeAccordion}>
                            {filteredPermissions.map(role => (
                                <Accordion.Item eventKey={role.id.toString()} key={role.id}>
                                    <Accordion.Header onClick={() => toggleAccordion(role.id)}>
                                        <div className="d-flex justify-content-between w-100 pe-3">
                                            <div>
                                                <span className="fw-semibold me-2">{role.role}</span>
                                                <Badge bg="light" text="dark" className="me-2">
                                                    <FiUsers className="me-1" /> {role.modules.length} modules
                                                </Badge>
                                                <span className="text-muted small">{role.description}</span>
                                            </div>
                                            {activeAccordion === role.id ? <FiChevronUp /> : <FiChevronDown />}
                                        </div>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        {editingPermissions?.id === role.id ? (
                                            <>
                                                <div className="table-responsive">
                                                    <Table bordered className="mb-4">
                                                        <thead>
                                                            <tr>
                                                                <th>Module</th>
                                                                <th className="text-center">View</th>
                                                                <th className="text-center">Create</th>
                                                                <th className="text-center">Edit</th>
                                                                <th className="text-center">Delete</th>
                                                                <th className="text-center">All</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {editingPermissions.modules.map((module, idx) => (
                                                                <tr key={idx}>
                                                                    <td className="fw-semibold">{module.name}</td>
                                                                    <td className="text-center">
                                                                        <Form.Check
                                                                            type="checkbox"
                                                                            checked={module.view}
                                                                            onChange={(e) => handlePermissionChange(role.id, module.name, 'view', e.target.checked)}
                                                                        />
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <Form.Check
                                                                            type="checkbox"
                                                                            checked={module.create}
                                                                            onChange={(e) => handlePermissionChange(role.id, module.name, 'create', e.target.checked)}
                                                                        />
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <Form.Check
                                                                            type="checkbox"
                                                                            checked={module.edit}
                                                                            onChange={(e) => handlePermissionChange(role.id, module.name, 'edit', e.target.checked)}
                                                                        />
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <Form.Check
                                                                            type="checkbox"
                                                                            checked={module.delete}
                                                                            onChange={(e) => handlePermissionChange(role.id, module.name, 'delete', e.target.checked)}
                                                                        />
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <Button
                                                                            variant="outline-primary"
                                                                            size="sm"
                                                                            onClick={() => toggleAllPermissions(module.name, !(module.view && module.create && module.edit && module.delete))}
                                                                        >
                                                                            {module.view && module.create && module.edit && module.delete ? <FiX /> : <FiCheck />}
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                                <div className="d-flex justify-content-end gap-2">
                                                    <Button variant="outline-secondary" onClick={cancelEditingPermissions}>
                                                        Cancel
                                                    </Button>
                                                    <Button className="leave-button" onClick={savePermissions} disabled={isLoading}>
                                                        {isLoading ? (
                                                            <>
                                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                                                <span className="ms-2">Saving...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FiSave className="me-2" /> Save Permissions
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="table-responsive">
                                                    <Table bordered className="mb-4">
                                                        <thead>
                                                            <tr>
                                                                <th>Module</th>
                                                                <th className="text-center">View</th>
                                                                <th className="text-center">Create</th>
                                                                <th className="text-center">Edit</th>
                                                                <th className="text-center">Delete</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {role.modules.map((module, idx) => (
                                                                <tr key={idx}>
                                                                    <td className="fw-semibold">{module.name}</td>
                                                                    <td className="text-center">
                                                                        {module.view ? <FiCheck className="text-success" /> : <FiX className="text-danger" />}
                                                                    </td>
                                                                    <td className="text-center">
                                                                        {module.create ? <FiCheck className="text-success" /> : <FiX className="text-danger" />}
                                                                    </td>
                                                                    <td className="text-center">
                                                                        {module.edit ? <FiCheck className="text-success" /> : <FiX className="text-danger" />}
                                                                    </td>
                                                                    <td className="text-center">
                                                                        {module.delete ? <FiCheck className="text-success" /> : <FiX className="text-danger" />}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => handleEditRole(role)}
                                                            className="me-2"
                                                        >
                                                            <FiEdit2 className="me-1" /> Edit Role
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => handleDeleteClick(role)}
                                                            className="me-2"
                                                        >
                                                            <FiTrash2 className="me-1" /> Delete
                                                        </Button>
                                                    </div>
                                                    <Button
                                                        className="leave-button"
                                                        size="sm"
                                                        onClick={() => startEditingPermissions(role)}
                                                    >
                                                        <FiLock className="me-1" /> Edit Permissions
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    ) : (
                        <div className="text-center py-5">
                            <h5 className="text-muted">No roles found</h5>
                            <p>Try a different search or add a new role</p>
                            <Button className="leave-button" onClick={() => setShowRoleModal(true)}>
                                <FiPlus className="me-2" /> Add New Role
                            </Button>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Add/Edit Role Modal */}
            <Modal show={showRoleModal} onHide={() => { setShowRoleModal(false); resetRoleForm(); }}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Edit Role' : 'Add New Role'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmitRole}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Role Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="role"
                                value={currentRole.role}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter role name (e.g., Administrator)"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={currentRole.description}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter role description"
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => { setShowRoleModal(false); resetRoleForm(); }}>
                            Cancel
                        </Button>
                        <Button className="leave-button" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                    <span className="ms-2">Saving...</span>
                                </>
                            ) : isEditing ? (
                                'Update Role'
                            ) : (
                                'Add Role'
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
                    Are you sure you want to delete the role <strong>{roleToDelete?.role}</strong>? This action will remove all associated permissions and cannot be undone.
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
                            'Delete Role'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default PermissionSettings;