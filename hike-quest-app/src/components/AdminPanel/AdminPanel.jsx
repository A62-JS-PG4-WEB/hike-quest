import React, { useState, useEffect, useContext } from 'react';
import { getAllUsers, updateUserStatus } from '../../services/users.service';
import { getAllThreads, deleteThread } from '../../services/threads.service';
import { AppContext } from '../../state/app.context';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [threads, setThreads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState('handle');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        const usersArray = Object.values(allUsers);
        setUsers(usersArray);
        setFilteredUsers(usersArray);
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

  useEffect(() => {
    setFilteredUsers(
      users.filter(user => {
        const value = user[searchBy]?.toLowerCase() || ''; 
        return value.includes(searchQuery.toLowerCase());
      })
    );
  }, [searchQuery, searchBy, users]);

    const handleBlockUser = async (handle, isBlocked) => {
        try {
            await updateUserStatus(handle, { isBlocked });
            setUsers(users.map(user => user.handle === handle ? { ...user, isBlocked } : user));
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    const handleDeleteThread = async (threadId) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this thread?");

  if (confirmDelete) {
        try {
            await deleteThread(threadId);
            setThreads(threads.filter(thread => thread.id !== threadId));
            alert('Thread deleted successfully.');
        } catch (error) {
            console.error('Error deleting thread:', error);
        }
    }
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
        <option value="handle">Handle</option>
        <option value="email">Email</option>
        <option value="displayName">Display Name</option>
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
            <th>Handle</th>
            <th>Email</th>
            <th>Blocked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
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