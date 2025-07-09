import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Container, Row, Col, Card, ProgressBar, Spinner, Table } from 'react-bootstrap';
import { 
  Building, 
  PeopleFill, 
  CreditCard, 
  BellFill,
  ArrowUp,
  ArrowDown,
  ClockFill,
  ExclamationTriangleFill,
  CheckCircleFill
} from 'react-bootstrap-icons';
import { getUserToken } from '../../../utitlities/Global';
import AlertDialog from '../../../utitlities/Alert';
import { GET_SUPERADMIN_STATICS } from '../../../services/apiRoutes';
import { get } from '../../../services/apiService';

const SuperDashboard = () => {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ["superAdminStats"],
    queryFn: async () => {
      const token = getUserToken();
      const res = await get(GET_SUPERADMIN_STATICS, token);
      return res.Data || {};
    },
    onError: (err) => {
      AlertDialog('Error', err.message || 'Failed to load dashboard data', 'error');
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <AlertDialog 
          title="Error" 
          message="Failed to load dashboard data" 
          variant="error" 
        />
      </Container>
    );
  }

  const MetricCard = ({ title, value, change, icon, color }) => {
    const isPositive = change >= 0;
    return (
      <Card className="metric-card h-100">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className={`icon-container bg-${color}-light`}>
              {React.cloneElement(icon, { className: `text-${color}` })}
            </div>
            <span className={`change-badge ${isPositive ? 'text-success' : 'text-danger'}`}>
              {isPositive ? <ArrowUp className="me-1" /> : <ArrowDown className="me-1" />}
              {Math.abs(change)}%
            </span>
          </div>
          <h5 className="metric-title">{title}</h5>
          <h2 className="metric-value">{value.toLocaleString()}</h2>
          <ProgressBar 
            now={Math.abs(change) * 5} 
            variant={isPositive ? 'success' : 'danger'} 
            className="mt-2"
          />
        </Card.Body>
      </Card>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Extract data with proper null checks and handle $values arrays
  const stats = dashboardData?.Stats || {};
  const recentCompanies = dashboardData?.RecentCompanies?.$values || [];
  const recentTickets = dashboardData?.RecentTickets?.$values || [];
  const systemAlerts = dashboardData?.SystemAlerts?.$values || [];

  return (
    <Container fluid className="dashboard-container">
      <h1 className="page-title">Super Admin Dashboard</h1>
      <p className="page-subtitle">Comprehensive platform overview</p>
      
      {/* Main Metrics */}
      <Row className="g-4 mb-4">
        <Col xs={12} md={6} lg={3}>
          <MetricCard 
            title="Total Companies" 
            value={stats.TotalCompanies || 0} 
            change={stats.CompanyGrowthPercentage || 0} 
            icon={<Building size={24} />}
            color="primary"
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <MetricCard 
            title="Total Users" 
            value={stats.TotalUsers || 0} 
            change={stats.UserGrowthPercentage || 0} 
            icon={<PeopleFill size={24} />}
            color="info"
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <MetricCard 
            title="Monthly Revenue" 
            value={stats.MonthlyRevenue || 0} 
            change={stats.RevenueGrowthPercentage || 0} 
            icon={<CreditCard size={24} />}
            color="warning"
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <MetricCard 
            title="Open Tickets" 
            value={stats.OpenTickets || 0} 
            change={0} 
            icon={<BellFill size={24} />}
            color="danger"
          />
        </Col>
      </Row>

      {/* Secondary Metrics */}
      <Row className="g-4 mb-4">
        <Col xs={12} md={4}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Storage & API Usage</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <span>Storage Used:</span>
                <strong>{stats.StorageUsedGB || 0} GB</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Total API Calls:</span>
                <strong>{(stats.TotalApiCalls || 0).toLocaleString()}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Subscription Overview</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <span>Active Companies:</span>
                <strong>{stats.ActiveCompanies || 0}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>New This Month:</span>
                <strong>{stats.NewCompaniesThisMonth || 0}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">User Activity</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <span>Active Users:</span>
                <strong>{stats.ActiveUsers || 0}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Yearly Revenue:</span>
                <strong>${(stats.YearlyRevenue || 0).toLocaleString()}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activities Section */}
      <Row className="g-4">
        <Col xs={12} lg={6}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Recent Companies</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {recentCompanies.length > 0 ? (
                <Table striped hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Plan</th>
                      <th>Users</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentCompanies.map(company => (
                      <tr key={company.Id}>
                        <td>{company.Name}</td>
                        <td>
                          <span className={`badge ${company.SubscriptionPlan === 'Free' ? 'bg-secondary' : 'bg-primary'}`}>
                            {company.SubscriptionPlan}
                          </span>
                        </td>
                        <td>{company.UserCount}</td>
                        <td className="text-muted small">{formatDate(company.CreatedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4 text-muted">
                  <Building size={48} className="mb-2" />
                  <p>No recent companies found</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={6}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Recent Tickets</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {recentTickets.length > 0 ? (
                <Table striped hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Ticket #</th>
                      <th>Subject</th>
                      <th>Company</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTickets.map(ticket => (
                      <tr key={ticket.Id}>
                        <td>{ticket.TicketNumber}</td>
                        <td>{ticket.Subject}</td>
                        <td>{ticket.CompanyName}</td>
                        <td>
                          <span className={`badge bg-${ticket.Status === 'Open' ? 'warning' : ticket.Status === 'Closed' ? 'success' : 'secondary'}`}>
                            {ticket.Status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4 text-muted">
                  <BellFill size={48} className="mb-2" />
                  <p>No recent tickets found</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* System Alerts */}
      <Row className="mt-4">
        <Col xs={12}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">System Alerts</h5>
              <span className="badge bg-danger">
                {systemAlerts.filter(a => !a.IsResolved).length} Active
              </span>
            </Card.Header>
            <Card.Body>
              {systemAlerts.length > 0 ? (
                systemAlerts.map((alert, index) => (
                  <div key={index} className={`alert alert-${alert.IsResolved ? 'success' : 'warning'} mb-2`}>
                    <div className="d-flex align-items-center">
                      {alert.IsResolved ? 
                        <CheckCircleFill className="me-2" /> : 
                        <ExclamationTriangleFill className="me-2" />}
                      <div>
                        <strong>{alert.Type}</strong>: {alert.Message}
                        <div className="text-muted small mt-1">
                          <ClockFill className="me-1" />
                          {formatDate(alert.CreatedAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted">
                  <CheckCircleFill size={48} className="mb-2 text-success" />
                  <p>No system alerts - All systems operational</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SuperDashboard;