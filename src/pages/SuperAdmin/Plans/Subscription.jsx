import React, { useState } from 'react';
import {
    Container, Row, Col, Card, Button,
    Form, Alert, Spinner
} from 'react-bootstrap';
import { FiCreditCard, FiRefreshCw, FiPlus } from 'react-icons/fi';
import { useMutation } from '@tanstack/react-query';
import { post } from '../../../services/apiService';
import AlertDialog from '../../../utitlities/Alert';
import { CREATE_SUPERADMIN_SUBSCRIPTION } from '../../../services/apiRoutes';

const initialPlanState = {
    Name: '',
    Description: '',
    PlanType: 'Enterprise',
    MonthlyPrice: 0,
    YearlyPrice: 0,
    MaxUsers: 0,
    MaxEmployees: 0,
    MaxProducts: 0,
    MaxWarehouses: 0,
    StorageLimitGB: 0,
    EnableInventory: true,
    EnableHR: true,
    EnableAccounting: true,
    EnableReports: true,
    EnableAPI: true,
    EnableCustomBranding: true,
    EnableAdvancedReports: true,
    EnableMultiCurrency: true,
    IsActive: true,
    IsPopular: false,
    SortOrder: 0
};

const planTypes = ['Basic', 'Standard', 'Premium', 'Enterprise'];

const featureGroups = [
    {
        features: [
            { name: 'EnableInventory', label: 'Enable Inventory' },
            { name: 'EnableHR', label: 'Enable HR' },
            { name: 'EnableAccounting', label: 'Enable Accounting' },
            { name: 'EnableReports', label: 'Enable Reports' }
        ]
    },
    {
        features: [
            { name: 'EnableAPI', label: 'Enable API' },
            { name: 'EnableCustomBranding', label: 'Enable Custom Branding' },
            { name: 'EnableAdvancedReports', label: 'Enable Advanced Reports' },
            { name: 'EnableMultiCurrency', label: 'Enable Multi-Currency' }
        ]
    }
];

const token = localStorage.getItem("authToken");

const Subscription = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [newPlan, setNewPlan] = useState(initialPlanState);

    const { mutate: createPlan, isLoading: isCreatingPlan } = useMutation({
        mutationFn: async (data) => await post(CREATE_SUPERADMIN_SUBSCRIPTION, data, token),
        onSuccess: (data) => {
            AlertDialog("", data.message || "Plan created successfully", "success");
            setNewPlan(initialPlanState);
        },
        onError: (error) => {
            setError(error.message || "Failed to create plan");
        },
    });

    const handleCreatePlan = (e) => {
        e.preventDefault();
        createPlan(newPlan);
    };

    const handleNewPlanChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewPlan(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccessMessage('Subscriptions refreshed successfully!');
        }, 800);
    };

    return (
        <Container fluid className="py-4">
            <Row>
                <Col>
                    <h2 className="mb-4">
                        <FiCreditCard className="me-2" />
                        Subscriptions Management
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

                    <Button variant="outline-secondary" onClick={handleRefresh} className="mb-4 me-2">
                        <FiRefreshCw className="me-2" />
                        Refresh
                    </Button>

                    <Card className="mb-4">
                        <Card.Header>
                            <h5>Create New Subscription Plan</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleCreatePlan}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Plan Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Name"
                                                value={newPlan.Name}
                                                onChange={handleNewPlanChange}
                                                placeholder="Enter plan name"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Plan Type</Form.Label>
                                            <Form.Select
                                                name="PlanType"
                                                value={newPlan.PlanType}
                                                onChange={handleNewPlanChange}
                                                required
                                            >
                                                {planTypes.map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="Description"
                                        value={newPlan.Description}
                                        onChange={handleNewPlanChange}
                                        rows={3}
                                        placeholder="Enter plan description"
                                        required
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Monthly Price ($)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="MonthlyPrice"
                                                value={newPlan.MonthlyPrice}
                                                onChange={handleNewPlanChange}
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Yearly Price ($)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="YearlyPrice"
                                                value={newPlan.YearlyPrice}
                                                onChange={handleNewPlanChange}
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Max Users</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="MaxUsers"
                                                value={newPlan.MaxUsers}
                                                onChange={handleNewPlanChange}
                                                min="0"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Max Employees</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="MaxEmployees"
                                                value={newPlan.MaxEmployees}
                                                onChange={handleNewPlanChange}
                                                min="0"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Max Products</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="MaxProducts"
                                                value={newPlan.MaxProducts}
                                                onChange={handleNewPlanChange}
                                                min="0"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Max Warehouses</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="MaxWarehouses"
                                                value={newPlan.MaxWarehouses}
                                                onChange={handleNewPlanChange}
                                                min="0"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Storage Limit (GB)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="StorageLimitGB"
                                                value={newPlan.StorageLimitGB}
                                                onChange={handleNewPlanChange}
                                                min="0"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <h5 className="mb-3">Features</h5>
                                <Row>
                                    {featureGroups.map((group, index) => (
                                        <Col md={6} key={index}>
                                            <div className="border p-3 rounded mb-3">
                                                {group.features.map(feature => (
                                                    <Form.Check
                                                        key={feature.name}
                                                        type="checkbox"
                                                        name={feature.name}
                                                        label={feature.label}
                                                        checked={newPlan[feature.name]}
                                                        onChange={handleNewPlanChange}
                                                        className="mb-2"
                                                    />
                                                ))}
                                            </div>
                                        </Col>
                                    ))}
                                </Row>

                                <Row className="mt-3">
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Check
                                                type="checkbox"
                                                name="IsActive"
                                                label="Is Active"
                                                checked={newPlan.IsActive}
                                                onChange={handleNewPlanChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Check
                                                type="checkbox"
                                                name="IsPopular"
                                                label="Is Popular (Featured)"
                                                checked={newPlan.IsPopular}
                                                onChange={handleNewPlanChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Sort Order</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="SortOrder"
                                        value={newPlan.SortOrder}
                                        onChange={handleNewPlanChange}
                                        min="0"
                                        required
                                    />
                                </Form.Group>

                                <div className="d-flex justify-content-end">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={isCreatingPlan}
                                        className="mt-3"
                                    >
                                        {isCreatingPlan ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                                <span className="ms-2">Creating Plan...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FiPlus className="me-2" />
                                                Create Plan
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Subscription;