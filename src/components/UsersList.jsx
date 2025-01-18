import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch users from the API
        axios.get('https://vehicle-rental-6o3p.onrender.com/users/users')
            .then((response) => {
                setUsers(response.data.users);  // Update state with the list of users
                setLoading(false);  // Stop loading
            })
            .catch((error) => {
                setError(error.message);  // Set error if any issue occurs
                setLoading(false);
            });
    }, []);  // Empty dependency array ensures this runs only once (on component mount)

    if (loading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 py-4">Error: {error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-semibold text-center mb-6">User List</h1>

            {/* Button or Link to go back to Admin Dashboard */}
            <div className="mb-4 text-center">
                <Link to="/admin-dashboard" className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
                    Back to Admin Dashboard
                </Link>
            </div>

            {users.length > 0 ? (
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Role</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Verified</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.userId} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm text-gray-700">{user.name}</td>
                                <td className="px-4 py-2 text-sm text-gray-700">{user.email}</td>
                                <td className="px-4 py-2 text-sm text-gray-700">{user.role}</td>
                                <td className="px-4 py-2 text-sm text-gray-700">
                                    {user.verified ? 'Yes' : 'No'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="text-center py-4">No users available</div>
            )}
        </div>
    );
};

export default UsersList;
