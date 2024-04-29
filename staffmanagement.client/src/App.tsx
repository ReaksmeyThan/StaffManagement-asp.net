import './App.css';
import { useState, useEffect } from 'react';
import 'react-responsive-modal/styles.css';
import { PlusCircle, Search, Edit, Trash2 } from 'react-feather';
import { Modal } from 'react-responsive-modal';

interface User {
    staffID: string;
    fullName: string;
    birthday: string;
    gender: number;
}

//const https_ = 'https://localhost:7070/api';
//const https_ = 'http://localhost:5039/api';
// Define base URLs for development and production environments
export const config = {
    development: {
        apiUrl: 'http://localhost:5039/api'
    },
    production: {
        apiUrl: 'https://localhost:7070/api/api'
    }
};


function App() {
    const blankUser: User = {
        staffID: '',
        fullName: '',
        birthday: '',
        gender: 0
    };

    // Determine the environment (development or production)
    const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';
    // Select the appropriate base URL based on the environment
    const apiUrl = config[environment].apiUrl;

    const [open, setOpen] = useState(false);
    const [action, setAction] = useState<'Add' | 'Edit'>('Add');
    const [userdata, setUserdata] = useState<User[]>([]);
    const [user, setUser] = useState({ staffID: '', fullName: '', birthday: '', gender: 0 });
    // const [editIndex, setEditIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [gender, setGender] = useState<number>(0); // Initialize gender state



    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(apiUrl + '/Staff', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'

                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            console.log(data)
            setUserdata(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const onOpenModal = () => setOpen(true);

    const onCloseModal = () => {
        setOpen(false);
        setAction('Add');
    };

    const addUser = async () => {
        /*   setUserdata([...userdata, user]);
           setUser(blankUser);
           onCloseModal();*/
        try {
            const response = await fetch(apiUrl + '/Staff', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            if (!response.ok) {
                throw new Error('Failed to add user');
            }

            // If the user is added successfully, update the local state with the new user
            const newUser = await response.json();
            setUserdata([...userdata, newUser]);
            setUser(blankUser);
            onCloseModal();
        } catch (error) {
            console.error('Error adding user:', error);
            alert('Failed to add user. Please try again later.');
        }
    };

    const editUser = (index: number) => {
        console.log('index', index);
        setAction('Edit');
        const selectedUser = userdata.find((_, i) => i === index);
        if (selectedUser) {
            setUser(selectedUser);
            //   setEditIndex(index);
            onOpenModal();
        }
    };

    const updateUser = async (idToDelete: string) => {
        try {
            const response = await fetch(apiUrl + `/Staff/${idToDelete}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            if (!response.ok) {
                throw new Error('Failed to update user');
            }
            // If update is successful, update the user data in the state
            const updatedUserData = userdata.map((userData) => {
                if (userData.staffID === idToDelete) {
                    return user;
                }
                return userData;
            });
            setUserdata(updatedUserData);
            setUser(blankUser); // Reset user state
            //  setEditIndex(null); // Reset editIndex state
            onCloseModal(); // Close the modal
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const deleteUser = (index: number) => {
        /* const newUsers = userdata.filter((_, i) => i !== index);
         setUserdata(newUsers);*/
        const confirmed = window.confirm("Are you sure you want to delete this record?");
        if (confirmed) {
            const idToDelete = userdata[index].staffID;
            findByID(idToDelete, 'DELETE');
        }
    };

    const findByID = async (id: string, methodName: string) => {
        try {
            const response = await fetch(apiUrl + `/Staff/${id}`, {
                method: methodName
            });
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
            // If deletion is successful, update the user data state
            const updatedUsers = userdata.filter(user => user.staffID !== id);
            setUserdata(updatedUsers);
            console.log('User deleted successfully');
        } catch (error) {
            console.error(' Error deleting user:', error);
        }
    };
    // Function to filter users based on search query
    const filteredUsers = userdata.filter((user) =>
        user.fullName.toLowerCase().includes(searchQuery ? searchQuery.toLowerCase() : '')
    );


    return (
        <div className="container">
            <div className="d-flex">
                <h1>STAFF LIST</h1>
            </div>

            <div className="toolbar">
                <div className="search">

                    <input
                        type="text"
                        placeholder="Search by full name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Search by full name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <input
                        type="date"
                        placeholder="Start Date"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <input
                        type="date"
                        placeholder="End Date"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="btn btn-p" onClick={onOpenModal}>
                        <Search size={16}></Search>
                        <span>Search</span>
                    </button>
                </div>

                <button className="btn btn-p" onClick={onOpenModal}>
                    <PlusCircle size={16}></PlusCircle>
                    <span>Add</span>
                </button>
            </div>

            <hr />

            <table className="table">
                <thead>
                    <tr>
                        <th>Staff ID</th>
                        <th>Full Name</th>
                        <th>Birthday</th>
                        <th>Gender</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user, index) => (
                        <tr key={index}>
                            <td>{user.staffID}</td>
                            <td>{user.fullName}</td>
                            <td>{user.birthday}</td>
                            <td>{user.gender === 1 ? 'Male' : 'Female'}</td>
                            <td>
                                <button className="btn ml2" onClick={() => editUser(index)}>
                                    <Edit size={16}></Edit>
                                    <span>Edit</span>
                                </button>

                                <button className="btn ml2" onClick={() => deleteUser(index)}>
                                    <Trash2 size={16}></Trash2>
                                    <span>Delete</span>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal open={open} onClose={onCloseModal} center>
                <div className="form_title">
                    <h2>{action} User</h2>
                </div>


                <div className="form">

                    <div className="wrap">
                        <label htmlFor="">Staff ID</label>
                        <input
                            type="text"
                            value={user.staffID}
                            onChange={(e) => setUser({ ...user, staffID: e.target.value })}
                        />

                        <label htmlFor="">Full Name</label>
                        <input
                            type="text"
                            value={user.fullName}
                            onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                        />

                        <label htmlFor="">Birthday</label>

                        <input
                            type="date"
                            value={user.birthday}
                            onChange={(e) => setUser({ ...user, birthday: e.target.value })}
                        />

                        <label htmlFor="">Gender</label>

                        <select
                            value={gender}
                            onChange={(e) => setGender(Number(e.target.value))}
                            className="gender-dropdown"
                        >
                            <option value={1}>Male</option>
                            <option value={2}>Female</option>
                        </select>


                        {action === 'Add' && (
                            <button className="btn" onClick={() => addUser()}>
                                Submit
                            </button>
                        )}
                        {action === 'Edit' && (
                            <button className="btn" onClick={() => updateUser(user.staffID)}>
                                Update
                            </button>
                        )}

                    </div>
                </div>

            </Modal>
        </div>
    );
}

export default App;

