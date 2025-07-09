import React from 'react';
import { Table, Badge } from 'react-bootstrap';

const UserActivityTable = ({ activities }) => {
    return (
        <Table bordered responsive>
            <thead >
                <tr>
                    <th>Timestamp</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>IP Address</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {activities.map((activity) => (
                    <tr key={activity.id}>
                        <td>{activity.timestamp}</td>
                        <td>
                            {activity.user}
                            {activity.user === 'admin@erp.com' && (
                                <Badge bg="danger" className="ms-2">Admin</Badge>
                            )}
                        </td>
                        <td>{activity.action}</td>
                        <td>
                            <Badge bg="secondary">{activity.ip}</Badge>
                        </td>
                        <td>
                            <Badge bg={activity.status === 'success' ? 'success' : 'danger'}>
                                {activity.status.toUpperCase()}
                            </Badge>
                        </td>
                    </tr>
                ))}
                {activities.length === 0 && (
                    <tr>
                        <td colSpan="5" className="text-center text-muted py-4">
                            No activity records found
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
};

export default UserActivityTable;