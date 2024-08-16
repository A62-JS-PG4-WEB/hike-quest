import React, { useState, useEffect, useContext } from 'react';
import { getAllUsers, updateUserStatus } from '../../services/users.service';
import { getAllThreads, deleteThread } from '../../services/threads.service';
import { AppContext } from '../../state/app.context';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

/**
 * AdminPanel component for managing users and threads. It allows administrators to:
 * - View and search users.
 * - Block or unblock users.
 * - Grant or revoke admin rights.
 * - View and delete threads.
 * 
 * @component
 * 
 * @returns {JSX.Element} The AdminPanel component
 */
const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [threads, setThreads] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchBy, setSearchBy] = useState('user');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const { userData } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        /**
         * Fetches all users and sets the state with the user data.
         * Updates the filteredUsers state to include all users initially.
         */
        const fetchUsers = async () => {
            try {
                const allUsers = await getAllUsers();
                const usersArray = Object.values(allUsers);
                setUsers(usersArray);
                setFilteredUsers(usersArray);
            } catch (error) {
                toast.error('Error fetching users:', error);
            }
        };

        /**
         * Fetches all threads and sets the state with the thread data.
         */
        const fetchThreads = async () => {
            try {
                const allThreads = await getAllThreads();
                setThreads(allThreads);
            } catch (error) {
                toast.error('Error fetching threads:', error);
            }
        };

        fetchUsers();
        fetchThreads();
    }, []);

    useEffect(() => {
        /**
         * Filters users based on the current search query and search criteria.
         */
        setFilteredUsers(
            users.filter(user => {
                const value = user[searchBy]?.toLowerCase() || '';
                return value.includes(searchQuery.toLowerCase());
            })
        );
    }, [searchQuery, searchBy, users]);

    /**
     * Handles blocking or unblocking a user.
     * 
     * @param {string} handle - The handle of the user to be blocked or unblocked.
     * @param {boolean} isBlocked - The new blocked status of the user.
     */
    const handleBlockUser = async (handle, isBlocked) => {
        try {
            await updateUserStatus(handle, { isBlocked });
            setUsers(users.map(user => user.handle === handle ? { ...user, isBlocked } : user));
        } catch (error) {
            toast.error('Error updating user status:', error);
        }
    };

    /**
     * Handles granting or revoking admin rights for a user.
     * 
     * @param {string} handle - The handle of the user to be updated.
     * @param {boolean} isAdmin - The new admin status of the user.
     */
    const handleAdminRights = async (handle, isAdmin) => {
        try {
            await updateUserStatus(handle, { isAdmin });
            setUsers(users.map(user => user.handle === handle ? { ...user, isAdmin } : user));
        } catch (error) {
            toast.error('Error updating user status:', error);
        }
    };

    /**
     * Handles the deletion of a thread with confirmation dialog.
     * 
     * @param {string} threadId - The ID of the thread to be deleted.
     */
    const handleDeleteThread = async (threadId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'rgb(99, 236, 112)',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        });

        if (result.isConfirmed) {
            try {
                await deleteThread(threadId);
                setThreads(threads.filter(thread => thread.id !== threadId));
                toast.success('Thread deleted successfully.');
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your thread has been deleted.',
                    icon: 'success',
                    confirmButtonColor: 'rgb(99, 236, 112)',
                });
            } catch (error) {
                toast.error('Error deleting thread:', error.message || error);
            }
        }
    };

    if (!userData) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Admin Panel</h1>
            <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                <option value="handle">User Name</option>
                <option value="email">Email</option>
                <option value="firstName">First Name</option>
            </select>

            <input
                type="text"
                placeholder={`Search users by ${searchBy}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <h2>Users</h2>
            <table>
                <thead>
                    <tr>
                        <th>First name</th>
                        <th>User name</th>
                        <th>Email</th>
                        <th>Block</th>
                        <th>Admin</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers
                        .filter(user => user.handle !== userData.handle)
                        .map(user => (
                            <tr key={user.id}>
                                <td>{user.firstName}</td>
                                <td>{user.handle}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button onClick={() => handleBlockUser(user.handle, !user.isBlocked)}>
                                        {user.isBlocked ? 'Unblock' : 'Block'}
                                    </button>
                                </td>
                                <td>
                                    {!user.isBlocked && (
                                        <button onClick={() => handleAdminRights(user.handle, !user.isAdmin)}>
                                            {user.isAdmin ? 'Yes' : 'No'}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            <h2>Threads</h2>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Details</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {threads.map(thread => (
                        <tr key={thread.id}>
                            <td>{thread.title}</td>
                            <td>{thread.author}</td>
                            <td>
                                <button className="button" onClick={() => navigate(`/threads/${thread.id}`)}>See more</button>
                            </td>
                            <td>
                                <button onClick={() => handleDeleteThread(thread.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;
