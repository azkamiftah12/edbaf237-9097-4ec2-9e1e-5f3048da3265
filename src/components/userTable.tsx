'use client';
import axios from "axios";
import { useEffect, useState } from "react";
import { FaSave, FaPlus, FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
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
    const [errorMessage, setErrorMessage]=useState<string | JSX.Element | null>(null);
    const [emailErrors, setEmailErrors] = useState<{ [key: number]: string | null }>({});
    const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' | null }>({ key: 'firstName', direction: null });

    const showErrorAlert = (errMessage:string) => {
        setErrorMessage(
            <div className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-200" role="alert">
                <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                </svg>
                <span className="sr-only">Info</span>
            <div>
              <span className="font-medium">Error!</span> {errMessage}
            </div>
          </div>
        );
    }

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
            setErrorMessage(null);
        } catch (error) {
            setErrorMessage('Error fetching users');
        }
    };

    const handleAddRow = () => {
        setNewUsers([...newUsers, { firstName: '', lastName: '', position: '', phone: '', email: '' }]);
    };

    const handleInputChange = (index: number, field: keyof User, value: string) => {
        const updatedUsers = [...newUsers];
        updatedUsers[index][field] = value;
        setNewUsers(updatedUsers);

        if (field === 'email') {
            checkEmailUnique(value, index);
        }
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
                return <FaLongArrowAltUp />;
            } else if (sortConfig.direction === 'desc') {
                return <FaLongArrowAltDown />;
            }
        }
        return ;
    };

    const checkEmailUnique = async (email: string, index: number) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        if (!emailRegex.test(email)) {
            setEmailErrors((prev) => ({ ...prev, [index]: 'Email is invalid' }));
            console.log(emailErrors);
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:3001/users/check-email', { email });
            const isUnique = response.data.isUnique;
            
            setEmailErrors((prev) => ({ ...prev, [index]: isUnique ? null : 'Email Address is not unique' }));
        } catch (error) {
            setEmailErrors((prev) => ({ ...prev, [index]: 'Error checking email' }));
        }
    };

    const hasAnyErrors = Object.values(emailErrors).some((error) => error !== null);

    const handleSave = async () => {
        try {
            await axios.post('http://localhost:3001/users', { users: newUsers });
            fetchUsers();
            setNewUsers([]);
        } catch (error) {
            showErrorAlert('Error saving users');
        }
        console.log({ users: newUsers });
    };

    useEffect(() => {
        fetchUsers();
    }, [sortConfig]);

    return (
        <div>
            {errorMessage}
            <div className="flex justify-end mb-4 mr-4 gap-4">
                <FaPlus className="cursor-pointer" onClick={handleAddRow} />
                <FaSave className={`cursor-pointer ${hasAnyErrors ? 'cursor-not-allowed' : ''}`} onClick={hasAnyErrors ? undefined : handleSave} />
                <IoMdUndo className="cursor-pointer" />
            </div>

            <div className="relative overflow-x-auto">
                <table className="w-96 text-sm text-left border text-gray-700 ">
                    <thead className="text-xs text-gray-900 uppercase border">
                        <tr>
                            <th
                                scope="col"
                                className="text-nowrap px-6 py-3 hover:bg-gray-100 cursor-pointer"
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
                                        className={`px-4 py-2 w-full border-0 border-b-2 border-gray-200 ${user.firstName ? 'bg-green-200' : 'bg-transparent'} focus:border-blue-500 focus:outline-none focus:ring-0`}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={user.lastName}
                                        onChange={(e) => handleInputChange(index, 'lastName', e.target.value)}
                                        className={`px-4 py-2 w-full border-0 border-b-2 border-gray-200 ${user.lastName ? 'bg-green-200' : 'bg-transparent'} focus:border-blue-500 focus:outline-none focus:ring-0`}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={user.position}
                                        onChange={(e) => handleInputChange(index, 'position', e.target.value)}
                                        className={`px-4 py-2 w-full border-0 border-b-2 border-gray-200 ${user.position ? 'bg-green-200' : 'bg-transparent'} focus:border-blue-500 focus:outline-none focus:ring-0`}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={user.phone}
                                        onChange={(e) => handleInputChange(index, 'phone', e.target.value)}
                                        className={`px-4 py-2 w-full border-0 border-b-2 border-gray-200 ${user.phone ? 'bg-green-200' : 'bg-transparent'} focus:border-blue-500 focus:outline-none focus:ring-0`}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="email"
                                        value={user.email}
                                        onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                                        className={`px-4 py-2 w-full border-0 border-b-2 border-gray-200 ${user.email ? emailErrors[index]?'bg-red-300':'bg-green-200' : 'bg-transparent'} focus:border-blue-500 focus:outline-none focus:ring-0`}
                                    />
                                    {emailErrors[index] && <p className="bg-red-600 text-white text-xs py-2 px-4 rounded-md w-fit absolute">{emailErrors[index]}</p>}
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
