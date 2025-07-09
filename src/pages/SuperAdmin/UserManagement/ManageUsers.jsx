import { useQuery } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import {
    Container, Row, Col, Table, Button, Form,
    Modal, Card, Badge, Alert, Spinner, Pagination,
    Dropdown, InputGroup, FormControl
} from 'react-bootstrap';
import {
    FiUsers, FiPlus, FiSearch, FiEdit2,
    FiTrash2, FiUserPlus, FiFilter, FiRefreshCw,
    FiChevronUp, FiChevronDown, FiDownload
} from 'react-icons/fi';
import { GET_ALL_USERS } from '../../../services/apiRoutes';
import { get } from '../../../services/apiService';
import AlertDialog from '../../../utitlities/Alert';

const ManageUsers = () => {
    // State for users data
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);

    // Search and filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'FirstName', direction: 'asc' });

    const token = localStorage.getItem("authToken");

    // Fetch users
    const { data: users = [], isLoading, refetch } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await get(GET_ALL_USERS, token);
            return res.Items.$values || [];
        },
        onError: (err) => {
            console.error("Query Error", err);
            AlertDialog("Error", err.message || "Failed to load data", "error");
            setError(err.message || "Failed to load users");
        },
        onSuccess: () => {
            setLoading(false);
        },
        refetchOnWindowFocus: false,
    });

    console.log("users----------------", users)
    
    // Filter and sort users
    useEffect(() => {
        let result = [...users];

        // Apply search filter
        if (searchTerm) {
            result = result.filter(user =>
                (user.FirstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (user.LastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (user.Email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
            );
        }

        // Apply role filter
        if (roleFilter !== 'all') {
            result = result.filter(user => user.Role === roleFilter);
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            result = result.filter(user => user.IsActive === (statusFilter === 'active'));
        }

        // Apply sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];
                
                // Handle null/undefined values
                if (aValue == null) aValue = '';
                if (bValue == null) bValue = '';
                
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        setFilteredUsers(result);
        setCurrentPage(1); // Reset to first page when filters change
    }, [users, searchTerm, roleFilter, statusFilter, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Available roles and statuses for filters
    const roles = ['Admin', 'User', 'Manager'];
    const statuses = ['active', 'inactive'];

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const getRoleBadge = (role) => {
        switch (role) {
            case 'Admin':
                return 'danger';
            case 'Manager':
                return 'warning';
            default:
                return 'primary';
        }
    };

    const getStatusBadge = (isActive) => {
        return isActive ? 'success' : 'secondary';
    };

    const getStatusText = (isActive) => {
        return isActive ? 'Active' : 'Inactive';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never logged in';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    // Export data function
    const exportToCSV = () => {
        const csvData = filteredUsers.map(user => ({
            Name: `${user.FirstName} ${user.LastName}`,
            Email: user.Email,
            Role: user.Role,
            Status: getStatusText(user.IsActive),
            LastLogin: formatDate(user.LastLoginAt),
            Company: user.CompanyName || 'N/A'
        }));

        const csvContent = [
            Object.keys(csvData[0]).join(','),
            ...csvData.map(row => Object.values(row).map(value => 
                `"${String(value).replace(/"/g, '""')}"`
            ).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setSuccessMessage('Data exported successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    // Refresh users
    const handleRefresh = () => {
        setLoading(true);
        refetch().then(() => {
            setSuccessMessage('Users refreshed successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        });
    };

    return (
        <Container fluid className="py-4">
            <Row>
                <Col>
                    <h2 className="mb-4">
                        <FiUsers className="me-2" />
                        Manage Users
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

                    <Card className="mb-4">
                        <Card.Body>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Button variant="outline-secondary" onClick={handleRefresh} className="me-2">
                                        <FiRefreshCw className="me-2" />
                                        Refresh
                                    </Button>
                                    <Button variant="outline-success" onClick={exportToCSV}>
                                        <FiDownload className="me-2" />
                                        Export Data
                                    </Button>
                                </Col>

                                <Col md={6}>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <FiSearch />
                                        </InputGroup.Text>
                                        <FormControl
                                            placeholder="Search by name or email..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </InputGroup>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>
                                    <Dropdown className="d-inline me-2">
                                        <Dropdown.Toggle variant="outline-secondary" id="role-filter">
                                            <FiFilter className="me-2" />
                                            Role: {roleFilter === 'all' ? 'All' : roleFilter}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => setRoleFilter('all')}>All Roles</Dropdown.Item>
                                            {roles.map(role => (
                                                <Dropdown.Item key={role} onClick={() => setRoleFilter(role)}>
                                                    {role}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>

                                    <Dropdown className="d-inline">
                                        <Dropdown.Toggle variant="outline-secondary" id="status-filter">
                                            <FiFilter className="me-2" />
                                            Status: {statusFilter === 'all' ? 'All' : statusFilter}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => setStatusFilter('all')}>All Statuses</Dropdown.Item>
                                            {statuses.map(status => (
                                                <Dropdown.Item key={status} onClick={() => setStatusFilter(status)}>
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>

                                <Col md={6} className="text-md-end">
                                    <small className="text-muted">
                                        Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                                    </small>
                                </Col>
                            </Row>

                            {isLoading ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" variant="primary" />
                                    <p className="mt-2">Loading users...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="table-responsive">
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th onClick={() => requestSort('FirstName')} className="sortable-header" style={{ cursor: 'pointer' }}>
                                                        <div className="d-flex align-items-center">
                                                            Name
                                                            {sortConfig.key === 'FirstName' && (
                                                                sortConfig.direction === 'asc' ? <FiChevronUp className="ms-1" /> : <FiChevronDown className="ms-1" />
                                                            )}
                                                        </div>
                                                    </th>
                                                    <th onClick={() => requestSort('Email')} className="sortable-header" style={{ cursor: 'pointer' }}>
                                                        <div className="d-flex align-items-center">
                                                            Email
                                                            {sortConfig.key === 'Email' && (
                                                                sortConfig.direction === 'asc' ? <FiChevronUp className="ms-1" /> : <FiChevronDown className="ms-1" />
                                                            )}
                                                        </div>
                                                    </th>
                                                    <th onClick={() => requestSort('Role')} className="sortable-header" style={{ cursor: 'pointer' }}>
                                                        <div className="d-flex align-items-center">
                                                            Role
                                                            {sortConfig.key === 'Role' && (
                                                                sortConfig.direction === 'asc' ? <FiChevronUp className="ms-1" /> : <FiChevronDown className="ms-1" />
                                                            )}
                                                        </div>
                                                    </th>
                                                    <th onClick={() => requestSort('IsActive')} className="sortable-header" style={{ cursor: 'pointer' }}>
                                                        <div className="d-flex align-items-center">
                                                            Status
                                                            {sortConfig.key === 'IsActive' && (
                                                                sortConfig.direction === 'asc' ? <FiChevronUp className="ms-1" /> : <FiChevronDown className="ms-1" />
                                                            )}
                                                        </div>
                                                    </th>
                                                    <th onClick={() => requestSort('LastLoginAt')} className="sortable-header" style={{ cursor: 'pointer' }}>
                                                        <div className="d-flex align-items-center">
                                                            Last Login
                                                            {sortConfig.key === 'LastLoginAt' && (
                                                                sortConfig.direction === 'asc' ? <FiChevronUp className="ms-1" /> : <FiChevronDown className="ms-1" />
                                                            )}
                                                        </div>
                                                    </th>
                                                    <th onClick={() => requestSort('CompanyName')} className="sortable-header" style={{ cursor: 'pointer' }}>
                                                        <div className="d-flex align-items-center">
                                                            Company
                                                            {sortConfig.key === 'CompanyName' && (
                                                                sortConfig.direction === 'asc' ? <FiChevronUp className="ms-1" /> : <FiChevronDown className="ms-1" />
                                                            )}
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentUsers.length > 0 ? (
                                                    currentUsers.map(user => (
                                                        <tr key={user.Id}>
                                                            <td>{user.FirstName} {user.LastName}</td>
                                                            <td>{user.Email}</td>
                                                            <td>
                                                                <Badge bg={getRoleBadge(user.Role)}>
                                                                    {user.Role}
                                                                </Badge>
                                                            </td>
                                                            <td>
                                                                <Badge bg={getStatusBadge(user.IsActive)}>
                                                                    {getStatusText(user.IsActive)}
                                                                </Badge>
                                                            </td>
                                                            <td>{formatDate(user.LastLoginAt)}</td>
                                                            <td>{user.CompanyName || 'N/A'}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="6" className="text-center py-4">
                                                            No users found matching your criteria
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>

                                    {filteredUsers.length > usersPerPage && (
                                        <div className="d-flex justify-content-center mt-4">
                                            <Pagination>
                                                <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                                                <Pagination.Prev
                                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                    disabled={currentPage === totalPages}
                                                />
                                                <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
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

export default ManageUsers;