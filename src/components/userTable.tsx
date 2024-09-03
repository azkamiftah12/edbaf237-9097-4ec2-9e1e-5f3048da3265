'use client';
import axios from "axios";
import { useEffect, useState } from "react";
import { FaSave, FaPlus, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { IoMdUndo } from "react-icons/io";

const UserTable = () => {
    interface User {
        id?: number;
        firstName: string;
        lastName: string;
        position: string;
        phone: string;
        email: string;
    }

    const [users, setUsers] = useState<User[]>([]);
    const [newUsers, setNewUsers] = useState<User[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' | null }>({ key: 'firstName', direction: null });

    const fetchUsers = async () => {
        try {
            const response = await axios.get<User[]>('http://localhost:3001/users');
            let sortedUsers = [...response.data];

            if (sortConfig.direction) {
                sortedUsers.sort((a, b) => {
                    if (a[sortConfig.key] < b[sortConfig.key]) {
                        return sortConfig.direction === 'asc' ? -1 : 1;
                    }
                    if (a[sortConfig.key] > b[sortConfig.key]) {
                        return sortConfig.direction === 'asc' ? 1 : -1;
                    }
                    return 0;
                });
            }

            setUsers(sortedUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleAddRow = () => {
        setNewUsers([...newUsers, { firstName: '', lastName: '', position: '', phone: '', email: '' }]);
    };

    const handleInputChange = (index: number, field: keyof User, value: string) => {
        const updatedUsers = [...newUsers];
        updatedUsers[index][field] = value;
        setNewUsers(updatedUsers);
    };

    const handleSave = async () => {
        try {
            await axios.post('http://localhost:3001/users', { users: newUsers });
            fetchUsers();
            setNewUsers([]);
        } catch (error) {
            console.error('Error saving users:', error);
        }
        console.log({ users: newUsers });
    };

    const handleSort = (key: keyof User) => {
        let direction: 'asc' | 'desc' | null = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const renderSortIcon = (key: keyof User) => {
        if (sortConfig.key === key) {
            if (sortConfig.direction === 'asc') {
                return <FaSortUp />;
            } else if (sortConfig.direction === 'desc') {
                return <FaSortDown />;
            }
        }
        return <FaSort />;
    };

    useEffect(() => {
        fetchUsers();
    }, [sortConfig]);

    return (
        <div>
            <div className="flex justify-end mb-4 mr-4 gap-4">
                <FaPlus className="cursor-pointer" onClick={handleAddRow} />
                <FaSave className="cursor-pointer" onClick={handleSave} />
                <IoMdUndo className="cursor-pointer" />
            </div>

            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left border rtl:text-right text-gray-700 ">
                    <thead className="text-xs text-gray-900 uppercase border">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSort('firstName')}
                            >
                                First Name {renderSortIcon('firstName')}
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSort('lastName')}
                            >
                                Last Name {renderSortIcon('lastName')}
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSort('position')}
                            >
                                Position {renderSortIcon('position')}
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSort('phone')}
                            >
                                Phone {renderSortIcon('phone')}
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSort('email')}
                            >
                                Email {renderSortIcon('email')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {newUsers.map((user, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="text"
                                        value={user.firstName}
                                        onChange={(e) => handleInputChange(index, 'firstName', e.target.value)}
                                        className={`px-4 py-2 w-full border-0 border-b-2 border-transparent ${user.firstName ? 'bg-green-200' : 'bg-transparent'} focus:border-blue-500 focus:outline-none focus:ring-0`}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={user.lastName}
                                        onChange={(e) => handleInputChange(index, 'lastName', e.target.value)}
                                        className={`px-4 py-2 w-full border-0 border-b-2 border-transparent ${user.lastName ? 'bg-green-200' : 'bg-transparent'} focus:border-blue-500 focus:outline-none focus:ring-0`}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={user.position}
                                        onChange={(e) => handleInputChange(index, 'position', e.target.value)}
                                        className={`px-4 py-2 w-full border-0 border-b-2 border-transparent ${user.position ? 'bg-green-200' : 'bg-transparent'} focus:border-blue-500 focus:outline-none focus:ring-0`}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={user.phone}
                                        onChange={(e) => handleInputChange(index, 'phone', e.target.value)}
                                        className={`px-4 py-2 w-full border-0 border-b-2 border-transparent ${user.phone ? 'bg-green-200' : 'bg-transparent'} focus:border-blue-500 focus:outline-none focus:ring-0`}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="email"
                                        value={user.email}
                                        onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                                        className={`px-4 py-2 w-full border-0 border-b-2 border-transparent ${user.email ? 'bg-green-200' : 'bg-transparent'} focus:border-blue-500 focus:outline-none focus:ring-0`}
                                    />
                                </td>
                            </tr>
                        ))}
                        {users.map(user => (
                            <tr key={user.id} className="bg-white border-b">
                                <td className="px-6 py-4">{user.firstName}</td>
                                <td className="px-6 py-4">{user.lastName}</td>
                                <td className="px-6 py-4">{user.position}</td>
                                <td className="px-6 py-4">{user.phone}</td>
                                <td className="px-6 py-4">{user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;
