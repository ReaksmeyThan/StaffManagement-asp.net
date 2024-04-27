import './App.css';
import { useState, useEffect } from 'react';
import 'react-responsive-modal/styles.css';
import { PlusCircle, Edit, Trash2 } from 'react-feather';
import { Modal } from 'react-responsive-modal';

interface User {
    staffID: string;
    fullName: string;
    birthday: string;
    gender: number;
}

function App() {
    const blankUser: User = {
        staffID: '',
        fullName: '',
        birthday: '',
        gender: 0
    };

    const [open, setOpen] = useState(false);
    const [action, setAction] = useState<'Add' | 'Edit'>('Add');
    const [userdata, setUserdata] = useState<User[]>([]);
    const [user, setUser] = useState<User>(blankUser);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []); // Empty array means this effect will run only once, similar to componentDidMount

    const fetchUsers = async () => {
        try {
            const response = await fetch('https://localhost:7070/api/Staff');
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

    const addUser = () => {
        setUserdata([...userdata, user]);
        setUser(blankUser);
        onCloseModal();
    };

    const editUser = (index: number) => {
        console.log('index', index);
        setAction('Edit');
        const selectedUser = userdata.find((_, i) => i === index);
        if (selectedUser) {
            setUser(selectedUser);
            setEditIndex(index);
            onOpenModal();
        }
    };

    const updateUser = () => {
        const newUsers = userdata.map((x, i) => {
            if (i === editIndex!) {
                return user;
            }
            return x;
        });
        setUserdata(newUsers);
        setUser(blankUser);
        setEditIndex(null);
        onCloseModal();
    };

    const deleteUser = (index: number) => {
        const newUsers = userdata.filter((_, i) => i !== index);
        setUserdata(newUsers);
    };

    return (
        <div className="container">
            <div className="d-flex">
                <h1>STAFF LIST</h1>
            </div>
            <div className="toolbar">
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
                    {userdata.length > 0 &&
                        userdata.map((user, index) => (
                            <tr key={index}>
                                <td>{user.staffID}</td>
                                <td>{user.fullName}</td>
                                <td>{user.birthday}</td>
                                <td>{user.gender}</td>
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
                    <textarea
                        name=""
                        id=""
                        value={user.birthday}
                        cols={30}
                        rows={5}
                        onChange={(e) => setUser({ ...user, birthday: e.target.value })} >
                    </textarea>

                    {action === 'Add' && (
                        <button className="btn" onClick={() => addUser()}>
                            Submit
                        </button>
                    )}
                    {action === 'Edit' && (
                        <button className="btn" onClick={() => updateUser()}>
                            Update
                        </button>
                    )}
                </div>
            </Modal>
        </div>
    );
}

export default App;

