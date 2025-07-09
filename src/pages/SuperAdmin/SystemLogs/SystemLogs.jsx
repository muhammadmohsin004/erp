import { useQuery } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import {
    Container, Row, Col, Table, Button, Form,
    Modal, Card, Badge, Alert, Spinner, Pagination,
    Dropdown, InputGroup, FormControl
} from 'react-bootstrap';
import {
    FiFileText, FiSearch, FiFilter, FiRefreshCw,
    FiChevronUp, FiChevronDown, FiDownload, FiActivity
} from 'react-icons/fi';
import { GET_ALL_SYSTEM_LOGS } from '../../../services/apiRoutes';
import { get } from '../../../services/apiService';
import AlertDialog from '../../../utitlities/Alert';

const SystemLogs = () => {
    // State for logs data
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [logsPerPage] = useState(10);

    // Search and filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [levelFilter, setLevelFilter] = useState('all');
    const [actionFilter, setActionFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'CreatedAt', direction: 'desc' });

    const token = localStorage.getItem("authToken");

    // Fetch system logs
    const { data: logs = [], isLoading, refetch } = useQuery({
        queryKey: ["systemLogs"],
        queryFn: async () => {
            const res = await get(GET_ALL_SYSTEM_LOGS, token);
            return res.Items.$values || [];
        },
        onError: (err) => {
            console.error("Query Error", err);
            AlertDialog("Error", err.message || "Failed to load data", "error");
            setError(err.message || "Failed to load system logs");
        },
        onSuccess: () => {
            setLoading(false);
        },
        refetchOnWindowFocus: false,
    });

    console.log("system logs----------------", logs);
    
    // Filter and sort logs
    useEffect(() => {
        let result = [...logs];

        // Apply search filter
        if (searchTerm) {
            result = result.filter(log =>
                (log.Message?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (log.UserEmail?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (log.AdminEmail?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (log.CompanyName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (log.IPAddress?.toLowerCase() || '').includes(searchTerm.toLowerCase())
            );
        }

        // Apply level filter
        if (levelFilter !== 'all') {
            result = result.filter(log => log.Level === levelFilter);
        }

        // Apply action filter
        if (actionFilter !== 'all') {
            result = result.filter(log => log.Action === actionFilter);
        }

        // Apply sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];
                
                // Handle null/undefined values
                if (aValue == null) aValue = '';
                if (bValue == null) bValue = '';
                
                // Handle date sorting
                if (sortConfig.key === 'CreatedAt') {
                    aValue = new Date(aValue);
                    bValue = new Date(bValue);
                }
                
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        setFilteredLogs(result);
        setCurrentPage(1); // Reset to first page when filters change
    }, [logs, searchTerm, levelFilter, actionFilter, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Available levels and actions for filters
    const levels = ['Info', 'Warning', 'Error', 'Debug'];
    const actions = ['ImpersonateUser', 'Login', 'Logout', 'Create', 'Update', 'Delete', 'Export'];

    // Pagination logic
    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
    const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

    const getLevelBadge = (level) => {
        switch (level) {
            case 'Error':
                return 'danger';
            case 'Warning':
                return 'warning';
            case 'Info':
                return 'info';
            case 'Debug':
                return 'secondary';
            default:
                return 'primary';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    // Export data function
    const exportToCSV = () => {
        const csvData = filteredLogs.map(log => ({
            Id: log.Id,
            Level: log.Level,
            Action: log.Action,
            Message: log.Message,
            CompanyName: log.CompanyName || 'N/A',
            UserEmail: log.UserEmail || 'N/A',
            AdminEmail: log.AdminEmail || 'N/A',
            IPAddress: log.IPAddress || 'N/A',
            CreatedAt: formatDate(log.CreatedAt)
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
        link.setAttribute('download', `system_logs_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setSuccessMessage('Logs exported successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    // Refresh logs
    const handleRefresh = () => {
        setLoading(true);
        refetch().then(() => {
            setSuccessMessage('System logs refreshed successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        });
    };

    return (
        <Container fluid className="py-4">
            <Row>
                <Col>
                    <h2 className="mb-4">
                        <FiActivity className="me-2" />
                        System Logs
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
                                        Export Logs
                                    </Button>
                                </Col>

                                <Col md={6}>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <FiSearch />
                                        </InputGroup.Text>
                                        <FormControl
                                            placeholder="Search logs by message, email, company, or IP..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </InputGroup>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>
                                    <Dropdown className="d-inline me-2">
                                        <Dropdown.Toggle variant="outline-secondary" id="level-filter">
                                            <FiFilter className="me-2" />
                                            Level: {levelFilter === 'all' ? 'All' : levelFilter}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => setLevelFilter('all')}>All Levels</Dropdown.Item>
                                            {levels.map(level => (
                                                <Dropdown.Item key={level} onClick={() => setLevelFilter(level)}>
                                                    {level}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>

                                    <Dropdown className="d-inline">
                                        <Dropdown.Toggle variant="outline-secondary" id="action-filter">
                                            <FiFilter className="me-2" />
                                            Action: {actionFilter === 'all' ? 'All' : actionFilter}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => setActionFilter('all')}>All Actions</Dropdown.Item>
                                            {actions.map(action => (
                                                <Dropdown.Item key={action} onClick={() => setActionFilter(action)}>
                                                    {action}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>

                                <Col md={6} className="text-md-end">
                                    <small className="text-muted">
                                        Showing {indexOfFirstLog + 1}-{Math.min(indexOfLastLog, filteredLogs.length)} of {filteredLogs.length} logs
                                    </small>
                                </Col>
                            </Row>

                            {isLoading ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" variant="primary" />
                                    <p className="mt-2">Loading system logs...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="table-responsive">
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th onClick={() => requestSort('Id')} className="sortable-header" style={{ cursor: 'pointer', width: '80px' }}>
                                                        <div className="d-flex align-items-center">
                                                            ID
                                                            {sortConfig.key === 'Id' && (
                                                                sortConfig.direction === 'asc' ? <FiChevronUp className="ms-1" /> : <FiChevronDown className="ms-1" />
                                                            )}
                                                        </div>
                                                    </th>
                                                    <th onClick={() => requestSort('Level')} className="sortable-header" style={{ cursor: 'pointer', width: '100px' }}>
                                                        <div className="d-flex align-items-center">
                                                            Level
                                                            {sortConfig.key === 'Level' && (
                                                                sortConfig.direction === 'asc' ? <FiChevronUp className="ms-1" /> : <FiChevronDown className="ms-1" />
                                                            )}
                                                        </div>
                                                    </th>
                                                    <th onClick={() => requestSort('Action')} className="sortable-header" style={{ cursor: 'pointer', width: '120px' }}>
                                                        <div className="d-flex align-items-center">
                                                            Action
                                                            {sortConfig.key === 'Action' && (
                                                                sortConfig.direction === 'asc' ? <FiChevronUp className="ms-1" /> : <FiChevronDown className="ms-1" />
                                                            )}
                                                        </div>
                                                    </th>
                                                    <th style={{ width: '300px' }}>Message</th>
                                                    <th onClick={() => requestSort('CompanyName')} className="sortable-header" style={{ cursor: 'pointer', width: '150px' }}>
                                                        <div className="d-flex align-items-center">
                                                            Company
                                                            {sortConfig.key === 'CompanyName' && (
                                                                sortConfig.direction === 'asc' ? <FiChevronUp className="ms-1" /> : <FiChevronDown className="ms-1" />
                                                            )}
                                                        </div>
                                                    </th>
                                                    <th onClick={() => requestSort('UserEmail')} className="sortable-header" style={{ cursor: 'pointer', width: '150px' }}>
                                                        <div className="d-flex align-items-center">
                                                            User Email
                                                            {sortConfig.key === 'UserEmail' && (
                                                                sortConfig.direction === 'asc' ? <FiChevronUp className="ms-1" /> : <FiChevronDown className="ms-1" />
                                                            )}
                                                        </div>
                                                    </th>
                                                    <th onClick={() => requestSort('AdminEmail')} className="sortable-header" style={{ cursor: 'pointer', width: '150px' }}>
                                                        <div className="d-flex align-items-center">
                                                            Admin Email
                                                            {sortConfig.key === 'AdminEmail' && (
                                                                sortConfig.direction === 'asc' ? <FiChevronUp className="ms-1" /> : <FiChevronDown className="ms-1" />
                                                            )}
                                                        </div>
                                                    </th>
                                                    <th onClick={() => requestSort('IPAddress')} className="sortable-header" style={{ cursor: 'pointer', width: '120px' }}>
                                                        <div className="d-flex align-items-center">
                                                            IP Address
                                                            {sortConfig.key === 'IPAddress' && (
                                                                sortConfig.direction === 'asc' ? <FiChevronUp className="ms-1" /> : <FiChevronDown className="ms-1" />
                                                            )}
                                                        </div>
                                                    </th>
                                                    <th onClick={() => requestSort('CreatedAt')} className="sortable-header" style={{ cursor: 'pointer', width: '150px' }}>
                                                        <div className="d-flex align-items-center">
                                                            Created At
                                                            {sortConfig.key === 'CreatedAt' && (
                                                                sortConfig.direction === 'asc' ? <FiChevronUp className="ms-1" /> : <FiChevronDown className="ms-1" />
                                                            )}
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentLogs.length > 0 ? (
                                                    currentLogs.map(log => (
                                                        <tr key={log.Id}>
                                                            <td>{log.Id}</td>
                                                            <td>
                                                                <Badge bg={getLevelBadge(log.Level)}>
                                                                    {log.Level}
                                                                </Badge>
                                                            </td>
                                                            <td>
                                                                <Badge bg="secondary">
                                                                    {log.Action}
                                                                </Badge>
                                                            </td>
                                                            <td>
                                                                <div style={{ 
                                                                    maxWidth: '300px', 
                                                                    overflow: 'hidden', 
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap'
                                                                }} 
                                                                title={log.Message}>
                                                                    {log.Message}
                                                                </div>
                                                            </td>
                                                            <td>{log.CompanyName || 'N/A'}</td>
                                                            <td>{log.UserEmail || 'N/A'}</td>
                                                            <td>{log.AdminEmail || 'N/A'}</td>
                                                            <td>{log.IPAddress || 'N/A'}</td>
                                                            <td>{formatDate(log.CreatedAt)}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="9" className="text-center py-4">
                                                            No system logs found matching your criteria
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>

                                    {filteredLogs.length > logsPerPage && (
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

export default SystemLogs;