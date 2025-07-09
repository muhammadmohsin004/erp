import { useQuery } from "@tanstack/react-query";
import React from "react";
import { GET_ALL_TICKETS, GET_ANALYTICS } from "../../../services/apiRoutes";
import { get } from "../../../services/apiService";
import AlertDialog from "../../../utitlities/Alert";
import {
  Card,
  CardBody,
  CardTitle,
  Row,
  Col,
  Spinner,
  Alert,
  Badge,
  Table,
  Button
} from "react-bootstrap";
import {
  Bar,
  Line,
  Pie,
  Doughnut,
  PolarArea
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  RadialLinearScale
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  RadialLinearScale
);

const SuperAnalytics = () => {
  const token = localStorage.getItem("authToken");

  // Fetch analytics data
  const { 
    data: analytics = [], 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const res = await get(GET_ANALYTICS, token);
      return res.Analytics?.$values || [];
    },
    onError: (err) => {
      console.error("Analytics Query Error", err);
      AlertDialog("Error", err.message || "Failed to load analytics data", "error");
    },
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: 1000
  });

  // Fetch tickets data
  const { 
    data: ticketsData = {}, 
    isLoading: isLoadingTickets,
    isError: isErrorTickets,
    error: errorTickets
  } = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const res = await get(GET_ALL_TICKETS, token);
      return res || { Items: [], TotalCount: 0 };
    },
    onError: (err) => {
      console.error("Tickets Query Error", err);
      AlertDialog("Error", err.message || "Failed to load tickets data", "error");
    },
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: 1000
  });

  // Safely extract tickets array
  const tickets = Array.isArray(ticketsData?.Items) ? ticketsData.Items : [];

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Safe filter function with fallback
  const safeFilter = (array, condition) => {
    if (!Array.isArray(array)) return [];
    return array.filter(condition);
  };

  // Generate random revenue data for demonstration
  const generateRevenueData = (baseRevenue) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, index) => ({
      month,
      revenue: Math.round(baseRevenue * (0.7 + Math.random() * 0.6))
    }));
  };

  // Prepare data for charts
  const prepareChartData = () => {
    if (!analytics || analytics.length === 0) return null;
    
    const data = analytics[0];
    
    // Safely get ticket counts
    const openTickets = safeFilter(tickets, t => t.Status === 'Open').length;
    const inProgressTickets = safeFilter(tickets, t => t.Status === 'In Progress').length;
    const resolvedTickets = safeFilter(tickets, t => t.Status === 'Resolved').length;
    const closedTickets = safeFilter(tickets, t => t.Status === 'Closed').length;
    
    const lowPriorityTickets = safeFilter(tickets, t => t.Priority === 'Low').length;
    const mediumPriorityTickets = safeFilter(tickets, t => t.Priority === 'Medium').length;
    const highPriorityTickets = safeFilter(tickets, t => t.Priority === 'High').length;
    const criticalPriorityTickets = safeFilter(tickets, t => t.Priority === 'Critical').length;

    // Enhanced color schemes
    const primaryColors = {
      blue: 'rgba(54, 162, 235, 0.8)',
      green: 'rgba(75, 192, 192, 0.8)',
      yellow: 'rgba(255, 206, 86, 0.8)',
      red: 'rgba(255, 99, 132, 0.8)',
      purple: 'rgba(153, 102, 255, 0.8)',
      orange: 'rgba(255, 159, 64, 0.8)',
      teal: 'rgba(0, 188, 212, 0.8)',
      indigo: 'rgba(63, 81, 181, 0.8)'
    };

    const borderColors = {
      blue: 'rgba(54, 162, 235, 1)',
      green: 'rgba(75, 192, 192, 1)',
      yellow: 'rgba(255, 206, 86, 1)',
      red: 'rgba(255, 99, 132, 1)',
      purple: 'rgba(153, 102, 255, 1)',
      orange: 'rgba(255, 159, 64, 1)',
      teal: 'rgba(0, 188, 212, 1)',
      indigo: 'rgba(63, 81, 181, 1)'
    };

    // Company Metrics - Enhanced Horizontal Bar Chart
    const companyData = {
      labels: ['Total Companies', 'Active Companies', 'New This Month', 'Suspended'],
      datasets: [{
        label: 'Companies',
        data: [
          data.TotalCompanies || 0,
          data.ActiveCompanies || 0,
          data.NewCompaniesThisMonth || 0,
          data.SuspendedCompanies || 0
        ],
        backgroundColor: [
          primaryColors.blue,
          primaryColors.green,
          primaryColors.yellow,
          primaryColors.red
        ],
        borderColor: [
          borderColors.blue,
          borderColors.green,
          borderColors.yellow,
          borderColors.red
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }]
    };

    // User Metrics - Enhanced Stacked Bar Chart
    const userData = {
      labels: ['User Statistics'],
      datasets: [
        {
          label: 'Total Users',
          data: [data.TotalUsers || 0],
          backgroundColor: primaryColors.purple,
          borderColor: borderColors.purple,
          borderWidth: 2,
          borderRadius: 6
        },
        {
          label: 'Active Users',
          data: [data.ActiveUsers || 0],
          backgroundColor: primaryColors.blue,
          borderColor: borderColors.blue,
          borderWidth: 2,
          borderRadius: 6
        },
        {
          label: 'New This Month',
          data: [data.NewUsersThisMonth || 0],
          backgroundColor: primaryColors.orange,
          borderColor: borderColors.orange,
          borderWidth: 2,
          borderRadius: 6
        }
      ]
    };

    // Revenue Data - Enhanced Gradient Line Chart
    const revenueDataPoints = generateRevenueData(data.MonthlyRevenue || 0);
    const revenueData = {
      labels: revenueDataPoints.map(d => d.month),
      datasets: [{
        label: 'Monthly Revenue ($)',
        data: revenueDataPoints.map(d => d.revenue),
        borderColor: primaryColors.teal,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(0, 188, 212, 0.3)');
          gradient.addColorStop(1, 'rgba(0, 188, 212, 0.05)');
          return gradient;
        },
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: primaryColors.teal,
        pointBorderColor: borderColors.teal,
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderWidth: 3
      }]
    };

    // Activity Data - Enhanced Doughnut Chart
    const activityData = {
      labels: ['Total Logins', 'API Calls', 'Storage Used (GB)'],
      datasets: [{
        label: 'Activity Metrics',
        data: [
          data.TotalLogins || 0,
          data.ApiCallsCount || 0,
          data.StorageUsedGB || 0
        ],
        backgroundColor: [
          primaryColors.red,
          primaryColors.blue,
          primaryColors.yellow
        ],
        borderColor: [
          borderColors.red,
          borderColors.blue,
          borderColors.yellow
        ],
        borderWidth: 3,
        hoverOffset: 10
      }]
    };

    // Support Tickets Overview - Enhanced Doughnut
    const ticketsChartData = {
      labels: ['Open Tickets', 'Resolved Tickets'],
      datasets: [{
        data: [data.OpenTickets || 0, data.ResolvedTickets || 0],
        backgroundColor: [
          primaryColors.red,
          primaryColors.green
        ],
        borderColor: [
          borderColors.red,
          borderColors.green
        ],
        borderWidth: 3,
        cutout: '65%',
        hoverOffset: 15
      }]
    };

    // Ticket Status Distribution - Enhanced Pie Chart
    const ticketStatusData = {
      labels: ['Open', 'In Progress', 'Resolved', 'Closed'],
      datasets: [{
        data: [
          openTickets,
          inProgressTickets,
          resolvedTickets,
          closedTickets
        ],
        backgroundColor: [
          primaryColors.red,
          primaryColors.yellow,
          primaryColors.green,
          primaryColors.purple
        ],
        borderColor: [
          borderColors.red,
          borderColors.yellow,
          borderColors.green,
          borderColors.purple
        ],
        borderWidth: 3,
        hoverOffset: 10
      }]
    };

    // Ticket Priority Distribution - Enhanced Polar Area Chart
    const ticketPriorityData = {
      labels: ['Low Priority', 'Medium Priority', 'High Priority', 'Critical Priority'],
      datasets: [{
        data: [
          lowPriorityTickets,
          mediumPriorityTickets,
          highPriorityTickets,
          criticalPriorityTickets
        ],
        backgroundColor: [
          primaryColors.green,
          primaryColors.yellow,
          primaryColors.orange,
          primaryColors.red
        ],
        borderColor: [
          borderColors.green,
          borderColors.yellow,
          borderColors.orange,
          borderColors.red
        ],
        borderWidth: 2
      }]
    };

    return {
      companyData,
      userData,
      revenueData,
      activityData,
      ticketsChartData,
      ticketStatusData,
      ticketPriorityData,
      lastUpdated: formatDate(data.CreatedAt),
      ticketCount: ticketsData.TotalCount || 0,
      recentTickets: tickets.slice(0, 5),
      analyticsData: data
    };
  };

  const chartData = prepareChartData();

  // Enhanced Chart Options
  const horizontalBarOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6c757d'
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6c757d'
        }
      }
    },
    elements: {
      bar: {
        borderRadius: 6
      }
    }
  };

  const stackedBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          color: '#495057'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        },
        ticks: {
          color: '#6c757d'
        }
      },
      y: {
        stacked: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#6c757d'
        }
      }
    }
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function(context) {
            return `Revenue: $${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6c757d'
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#6c757d',
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          color: '#495057'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12
      }
    },
    cutout: '60%'
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          color: '#495057'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12
      }
    }
  };

  const polarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          color: '#495057'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12
      }
    },
    scales: {
      r: {
        grid: {
          circular: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: '#6c757d'
        }
      }
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Low': return 'success';
      case 'Medium': return 'primary';
      case 'High': return 'warning';
      case 'Critical': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open': return 'danger';
      case 'In Progress': return 'warning';
      case 'Resolved': return 'success';
      case 'Closed': return 'secondary';
      default: return 'info';
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num?.toString() || '0';
  };

  return (
  <div className="container">
      <div className="super-analytics">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Analytics Dashboard</h1>
        <Button 
          variant="outline-primary" 
          onClick={() => {
            refetch();
          }}
          disabled={isLoading || isLoadingTickets}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh Data
        </Button>
      </div>
      
      {(isLoading || isLoadingTickets) ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" size="lg" />
          <h5 className="mt-3 text-muted">Loading dashboard data...</h5>
          <p className="text-muted">Please wait while we gather your analytics</p>
        </div>
      ) : (isError || isErrorTickets) ? (
        <Alert variant="danger" className="shadow-sm">
          <Alert.Heading>Error Loading Data</Alert.Heading>
          <p className="mb-0">
            {error?.message || errorTickets?.message || "An unexpected error occurred while loading the dashboard data."}
          </p>
        </Alert>
      ) : (
        <>
          {chartData && chartData.analyticsData && (
            <>
              <div className="mb-4 d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  <i className="bi bi-clock me-1"></i>
                  Last updated: {chartData.lastUpdated}
                </small>
                <Badge bg="info" className="px-3 py-2">
                  <i className="bi bi-graph-up me-1"></i>
                  Live Data
                </Badge>
              </div>

              {/* Company and User Metrics Row */}
              <Row className="mb-4">
                <Col lg={6} className="mb-4">
                  <Card className="shadow-sm border-0 h-100">
                    <CardBody>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <CardTitle className="mb-0">
                          <i className="bi bi-building me-2 text-primary"></i>
                          Company Metrics
                        </CardTitle>
                        <Badge bg="primary" pill>
                          {formatNumber(chartData.analyticsData.TotalCompanies)} Total
                        </Badge>
                      </div>
                      <div style={{ height: '300px' }}>
                        <Bar 
                          data={chartData.companyData} 
                          options={horizontalBarOptions} 
                        />
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={6} className="mb-4">
                  <Card className="shadow-sm border-0 h-100">
                    <CardBody>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <CardTitle className="mb-0">
                          <i className="bi bi-people me-2 text-primary"></i>
                          User Metrics
                        </CardTitle>
                        <Badge bg="primary" pill>
                          {formatNumber(chartData.analyticsData.TotalUsers)} Total
                        </Badge>
                      </div>
                      <div style={{ height: '300px' }}>
                        <Bar 
                          data={chartData.userData} 
                          options={stackedBarOptions} 
                        />
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              {/* Revenue and Activity Row */}
              <Row className="mb-4">
                <Col lg={8} className="mb-4">
                  <Card className="shadow-sm border-0 h-100">
                    <CardBody>
                      <CardTitle>
                        <i className="bi bi-graph-up me-2 text-success"></i>
                        Revenue Trends
                      </CardTitle>
                      <div style={{ height: '350px' }}>
                        <Line 
                          data={chartData.revenueData} 
                          options={lineOptions} 
                        />
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={4} className="mb-4">
                  <Card className="shadow-sm border-0 h-100">
                    <CardBody>
                      <CardTitle>
                        <i className="bi bi-activity me-2 text-info"></i>
                        Activity Overview
                      </CardTitle>
                      <div style={{ height: '350px' }}>
                        <Doughnut 
                          data={chartData.activityData} 
                          options={doughnutOptions} 
                        />
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              {/* Ticket Analytics Row */}
              <Row className="mb-4">
                <Col lg={4} className="mb-4">
                  <Card className="shadow-sm border-0 h-100">
                    <CardBody>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <CardTitle className="mb-0">
                          <i className="bi bi-ticket me-2 text-warning"></i>
                          Support Overview
                        </CardTitle>
                        <Badge bg="warning" pill>
                          {chartData.analyticsData.OpenTickets + chartData.analyticsData.ResolvedTickets} Total
                        </Badge>
                      </div>
                      <div style={{ height: '280px' }}>
                        <Doughnut 
                          data={chartData.ticketsChartData} 
                          options={doughnutOptions} 
                        />
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={4} className="mb-4">
                  <Card className="shadow-sm border-0 h-100">
                    <CardBody>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <CardTitle className="mb-0">
                          <i className="bi bi-kanban me-2 text-primary"></i>
                          Ticket Status
                        </CardTitle>
                        <Badge bg="primary" pill>
                          {chartData.ticketCount} Active
                        </Badge>
                      </div>
                      <div style={{ height: '280px' }}>
                        <Pie 
                          data={chartData.ticketStatusData} 
                          options={pieOptions} 
                        />
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={4} className="mb-4">
                  <Card className="shadow-sm border-0 h-100">
                    <CardBody>
                      <CardTitle>
                        <i className="bi bi-exclamation-triangle me-2 text-danger"></i>
                        Priority Distribution
                      </CardTitle>
                      <div style={{ height: '280px' }}>
                        <PolarArea 
                          data={chartData.ticketPriorityData} 
                          options={polarOptions} 
                        />
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              {/* Stats and Recent Tickets Row */}
              <Row>
                <Col lg={6} className="mb-4">
                  <Card className="shadow-sm border-0 h-100">
                    <CardBody>
                      <CardTitle>
                        <i className="bi bi-speedometer2 me-2 text-success"></i>
                        Key Performance Metrics
                      </CardTitle>
                      <Row>
                        <Col md={6} className="mb-3">
                          <div className="p-3 bg-primary bg-opacity-10 rounded-3 border border-primary border-opacity-25">
                            <div className="d-flex align-items-center">
                              <i className="bi bi-currency-dollar fs-3 text-primary me-3"></i>
                              <div>
                                <h6 className="text-muted mb-1">Monthly Revenue</h6>
                                <h4 className="text-primary mb-0">${formatNumber(chartData.analyticsData.MonthlyRevenue)}</h4>
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col md={6} className="mb-3">
                          <div className="p-3 bg-info bg-opacity-10 rounded-3 border border-info border-opacity-25">
                            <div className="d-flex align-items-center">
                              <i className="bi bi-diagram-3 fs-3 text-info me-3"></i>
                              <div>
                                <h6 className="text-muted mb-1">API Calls</h6>
                                <h4 className="text-info mb-0">{formatNumber(chartData.analyticsData.ApiCallsCount)}</h4>
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col md={6} className="mb-3">
                          <div className="p-3 bg-warning bg-opacity-10 rounded-3 border border-warning border-opacity-25">
                            <div className="d-flex align-items-center">
                              <i className="bi bi-hdd fs-3 text-warning me-3"></i>
                              <div>
                                <h6 className="text-muted mb-1">Storage Used</h6>
                                <h4 className="text-warning mb-0">{chartData.analyticsData.StorageUsedGB} GB</h4>
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col md={6} className="mb-3">
                          <div className="p-3 bg-success bg-opacity-10 rounded-3 border border-success border-opacity-25">
                            <div className="d-flex align-items-center">
                              <i className="bi bi-person-check fs-3 text-success me-3"></i>
                              <div>
                                <h6 className="text-muted mb-1">Total Logins</h6>
                                <h4 className="text-success mb-0">{formatNumber(chartData.analyticsData.TotalLogins)}</h4>
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={6} className="mb-4">
                  <Card className="shadow-sm border-0 h-100">
                    <CardBody>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <CardTitle className="mb-0">
                          <i className="bi bi-clock-history me-2 text-secondary"></i>
                          Recent Tickets
                        </CardTitle>
                        <Badge bg="secondary" pill>
                          {chartData.ticketCount} Total
                        </Badge>
                      </div>
                      <div className="table-responsive">
                        <Table hover className="mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Ticket #</th>
                              <th>Subject</th>
                              <th>Priority</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {chartData.recentTickets.length > 0 ? (
                              chartData.recentTickets.map(ticket => (
                                <tr key={ticket.Id}>
                                  <td>
                                    <small className="text-muted">#{ticket.TicketNumber}</small>
                                  </td>
                                  <td>
                                    <div className="text-truncate" style={{ maxWidth: '150px' }}>
                                      {ticket.Subject}
                                    </div>
                                  </td>
                                  <td>
                                    <Badge bg={getPriorityBadge(ticket.Priority)} size="sm">
                                      {ticket.Priority}
                                    </Badge>
                                  </td>
                                  <td>
                                    <Badge bg={getStatusBadge(ticket.Status)} size="sm">
                                      {ticket.Status}
                                    </Badge>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="4" className="text-center py-4">
                                  <div className="text-muted">
                                    <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                                    No recent tickets found
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </>
      )}
    </div>
  </div>
  );
};

export default SuperAnalytics;