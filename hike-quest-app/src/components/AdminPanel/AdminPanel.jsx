import React, { useState, useEffect, useContext } from 'react';
import { getAllUsers, updateUserStatus } from '../../services/users.service';
import { getAllThreads, deleteThread } from '../../services/threads.service';
import { AppContext } from '../../state/app.context';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [threads, setThreads] = useState([]);
    const { userData } = useContext(AppContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const allUsers = await getAllUsers();
                setUsers(Object.values(allUsers));
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        const fetchThreads = async () => {
            try {
                const allThreads = await getAllThreads();
                setThreads(allThreads);
            } catch (error) {
                console.error('Error fetching threads:', error);
            }
        };

        fetchUsers();
        fetchThreads();
    }, []);

    const handleBlockUser = async (handle, isBlocked) => {
        try {
            await updateUserStatus(handle, { isBlocked });
            setUsers(users.map(user => user.handle === handle ? { ...user, isBlocked } : user));
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    const handleDeleteThread = async (threadId) => {
        try {
            await deleteThread(threadId);
            setThreads(threads.filter(thread => thread.id !== threadId));
        } catch (error) {
            console.error('Error deleting thread:', error);
        }
    };

    return (
        <div>
            <h1>Admin Panel</h1>
            <h2>Users</h2>
            <table>
                <thead>
                    <tr>
                        <th>Handle</th>
                        <th>Email</th>
                        <th>Blocked</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users
                        .filter(user => user.handle !== userData.handle)
                        .map(user => (
                            <tr key={user.handle}>
                                <td>{user.handle}</td>
                                <td>{user.email}</td>
                                <td>{user.isBlocked ? 'Yes' : 'No'}</td>
                                <td>
                                    <button onClick={() => handleBlockUser(user.handle, !user.isBlocked)}>
                                        {user.isBlocked ? 'Unblock' : 'Block'}
                                    </button>
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
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {threads.map(thread => (
                        <tr key={thread.id}>
                            <td>{thread.title}</td>
                            <td>{thread.author}</td>
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