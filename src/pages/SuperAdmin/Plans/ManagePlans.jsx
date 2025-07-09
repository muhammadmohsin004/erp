import React, { useState, useEffect } from 'react';
import {
    Container, Row, Col, Card, Table, Button,
    Alert, Badge, Spinner, Pagination
} from 'react-bootstrap';
import {
    FiCreditCard, FiRefreshCw, FiZap, FiDownload
} from 'react-icons/fi';
import { GET_ALL_SUPERADMIN_SUBSCRIPTION } from '../../../services/apiRoutes';
import { useQuery } from '@tanstack/react-query';
import { get } from '../../../services/apiService';

const ManagePlans = () => {
    const [filteredPlans, setFilteredPlans] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);
    const plansPerPage = 5;

    const token = localStorage.getItem("authToken");

    const { data: subscriptionData, isLoading, isError, error: queryError, refetch } = useQuery({
        queryKey: ["subscriptionPlans"],
        queryFn: async () => {
            try {
                const response = await get(GET_ALL_SUPERADMIN_SUBSCRIPTION, token);
                return response.$values || [];
            } catch (err) {
                console.error("API Error:", err);
                throw err;
            }
        },
        onError: (err) => {
            console.error("Query Error:", err);
            setError(err.message || "Failed to load subscription plans");
        },
    });

    useEffect(() => {
        if (subscriptionData) {
            setFilteredPlans(subscriptionData);
        }
    }, [subscriptionData]);

    // Export data to CSV function
    const exportToCSV = () => {
        if (!filteredPlans || filteredPlans.length === 0) return;

        // Prepare CSV header
        const headers = [
            'Name',
            'Description',
            'Monthly Price',
            'Yearly Price',
            'Plan Type',
            'Max Users',
            'Max Employees',
            'Max Products',
            'Max Warehouses',
            'Storage Limit (GB)',
            'Is Popular',
            'Features'
        ].join(',');

        // Prepare CSV rows
        const rows = filteredPlans.map(plan => {
            const features = [
                plan.EnableInventory && 'Inventory',
                plan.EnableHR && 'HR',
                plan.EnableAccounting && 'Accounting',
                plan.EnableReports && 'Reports',
                plan.EnableAPI && 'API',
                plan.EnableCustomBranding && 'Custom Branding',
                plan.EnableAdvancedReports && 'Advanced Reports',
                plan.EnableMultiCurrency && 'Multi-Currency'
            ].filter(Boolean).join('; ');

            return [
                `"${plan.Name}"`,
                `"${plan.Description}"`,
                plan.MonthlyPrice,
                plan.YearlyPrice,
                plan.PlanType,
                plan.MaxUsers,
                plan.MaxEmployees,
                plan.MaxProducts,
                plan.MaxWarehouses,
                plan.StorageLimitGB,
                plan.IsPopular ? 'Yes' : 'No',
                `"${features}"`
            ].join(',');
        });

        // Combine header and rows
        const csvContent = [headers, ...rows].join('\n');

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'subscription_plans.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Pagination logic
    const indexOfLastPlan = currentPage * plansPerPage;
    const indexOfFirstPlan = indexOfLastPlan - plansPerPage;
    const currentPlans = filteredPlans?.slice(indexOfFirstPlan, indexOfLastPlan) || [];
    const totalPages = Math.ceil((filteredPlans?.length || 0) / plansPerPage);

    const getPlanTypeBadge = (planType) => {
        switch ((planType || '').toLowerCase()) {
            case 'free': return 'secondary';
            case 'basic': return 'primary';
            case 'professional': return 'info';
            case 'enterprise': return 'success';
            case 'standard': return 'warning';
            default: return 'dark';
        }
    };

    const getEnabledFeatures = (plan) => {
        const features = [];
        if (plan.EnableInventory) features.push('Inventory');
        if (plan.EnableHR) features.push('HR');
        if (plan.EnableAccounting) features.push('Accounting');
        if (plan.EnableReports) features.push('Reports');
        if (plan.EnableAPI) features.push('API');
        if (plan.EnableCustomBranding) features.push('Custom Branding');
        if (plan.EnableAdvancedReports) features.push('Advanced Reports');
        if (plan.EnableMultiCurrency) features.push('Multi-Currency');
        return features;
    };

    return (
        <Container fluid className="py-4">
            <Row>
                <Col>
                    <h2 className="mb-4">
                        <FiCreditCard className="me-2" />
                        Manage Subscription Plans
                    </h2>

                    {isError && (
                        <Alert variant="danger" onClose={() => setError(null)} dismissible>
                            {error || queryError?.message || "Failed to load plans"}
                        </Alert>
                    )}

                    <Card className="mb-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between mb-4">
                                <div>
                                    <Button 
                                        variant="outline-primary" 
                                        onClick={exportToCSV}
                                        disabled={isLoading || filteredPlans.length === 0}
                                    >
                                        <FiDownload className="me-2" />
                                        Export Data
                                    </Button>
                                </div>
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={() => refetch()}
                                    disabled={isLoading}
                                >
                                    <FiRefreshCw className="me-2" />
                                    Refresh
                                </Button>
                            </div>

                            {isLoading ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" variant="primary" />
                                    <p className="mt-2">Loading plans...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="table-responsive">
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Monthly</th>
                                                    <th>Yearly</th>
                                                    <th>Type</th>
                                                    <th>Features</th>
                                                    <th>Popular</th>
                                                    <th>Users</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentPlans.length > 0 ? (
                                                    currentPlans.map(plan => {
                                                        const features = getEnabledFeatures(plan);
                                                        return (
                                                            <tr key={plan.Id}>
                                                                <td>
                                                                    <strong>{plan.Name}</strong>
                                                                    <div className="text-muted small">{plan.Description}</div>
                                                                </td>
                                                                <td>${plan.MonthlyPrice?.toFixed(2)}</td>
                                                                <td>${plan.YearlyPrice?.toFixed(2)}</td>
                                                                <td>
                                                                    <Badge bg={getPlanTypeBadge(plan.PlanType)}>
                                                                        {plan.PlanType}
                                                                    </Badge>
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex flex-wrap gap-1">
                                                                        {features.slice(0, 3).map((feature, idx) => (
                                                                            <Badge key={idx} bg="light" text="dark">
                                                                                {feature}
                                                                            </Badge>
                                                                        ))}
                                                                        {features.length > 3 && (
                                                                            <Badge bg="light" text="dark">
                                                                                +{features.length - 3}
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    {plan.IsPopular ? (
                                                                        <Badge bg="warning">
                                                                            <FiZap className="me-1" /> Popular
                                                                        </Badge>
                                                                    ) : null}
                                                                </td>
                                                                <td>{plan.MaxUsers}</td>
                                                            </tr>
                                                        );
                                                    })
                                                ) : (
                                                    <tr>
                                                        <td colSpan="7" className="text-center py-4">
                                                            {filteredPlans.length === 0 ? "No plans available" : "No plans match current page"}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="d-flex justify-content-center mt-4">
                                            <Pagination>
                                                <Pagination.Prev
                                                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                                    disabled={currentPage === 1}
                                                />
                                                {Array.from({ length: totalPages }, (_, i) => (
                                                    <Pagination.Item
                                                        key={i + 1}
                                                        active={i + 1 === currentPage}
                                                        onClick={() => setCurrentPage(i + 1)}
                                                    >
                                                        {i + 1}
                                                    </Pagination.Item>
                                                ))}
                                                <Pagination.Next
                                                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                                    disabled={currentPage === totalPages}
                                                />
                                            </Pagination>
                                        </div>
                                    )}
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ManagePlans;