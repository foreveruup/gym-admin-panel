import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClassList from './components/ClassList';
import ClassStatistics from './components/ClassStatistics';
import EquipmentSummary from './components/EquipmentSummary';
import TrainerClassCount from './components/TrainerClassCount';
import SearchMembers from './components/SearchMembers';

const API_URL = 'http://localhost:3001';

function App() {
    const [members, setMembers] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [classStats, setClassStats] = useState([]);
    const [equipmentSummary, setEquipmentSummary] = useState(null);
    const [trainerClassCount, setTrainerClassCount] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [newMember, setNewMember] = useState({ name: '', email: '', join_date: '', membership_type: '' });
    const [selectedMember, setSelectedMember] = useState(null);
    const [newTrainer, setNewTrainer] = useState({ name: '', email: '', specialization: ''});
    const [selectedTrainer, setSelectedTrainer] = useState(null);

    useEffect(() => {
        fetchMembers();
        fetchTrainers();
        fetchClasses();
        fetchClassStats();
        fetchEquipmentSummary();
        fetchTrainerClassCount();
    }, []);

    const fetchMembers = async () => {
        const response = await axios.get(`${API_URL}/members`);
        setMembers(response.data);
    };

    const fetchTrainers = async () => {
        const response = await axios.get(`${API_URL}/trainers`);
        setTrainers(response.data);
    }

    const fetchClasses = async () => {
        const response = await axios.get(`${API_URL}/classes`);
        setClasses(response.data);
    };

    const fetchClassStats = async () => {
        const response = await axios.get(`${API_URL}/class-stats`);
        setClassStats(response.data);
    };

    const fetchEquipmentSummary = async () => {
        const response = await axios.get(`${API_URL}/equipment-summary`);
        setEquipmentSummary(response.data);
    };

    const fetchTrainerClassCount = async () => {
        const response = await axios.get(`${API_URL}/trainer-class-count`);
        setTrainerClassCount(response.data);
    };

    const handleSearch = async () => {
        const response = await axios.get(`${API_URL}/search?keyword=${searchKeyword}`);
        setSearchResults(response.data);
    };

    const handleAddMember = async () => {
        const { name, email, join_date, membership_type } = newMember;

        // Проверка на заполненность всех полей
        if (!name || !email || !join_date || !membership_type) {
            alert("Please fill in all fields before submitting.");
            return;
        }

        try {
            await axios.post(`${API_URL}/members`, newMember);
            setNewMember({ name: '', email: '', join_date: '', membership_type: '' });
            fetchMembers();
        } catch (error) {
            console.error("Failed to add member:", error);
        }
    };

    const handleUpdateMember = async () => {
        if (selectedMember && selectedMember.id) {
            const { name, email, join_date, membership_type } = selectedMember;

            // Проверка на заполненность всех полей
            if (!name || !email || !join_date || !membership_type) {
                alert("Please fill in all fields before updating.");
                return;
            }

            try {
                await axios.put(`${API_URL}/members/${selectedMember.id}`, selectedMember);
                setSelectedMember(null); // Сбросить выбранного члена после успешного обновления
                fetchMembers(); // Обновить список членов
            } catch (error) {
                console.error("Failed to update member:", error);
            }
        } else {
            console.error("Selected member ID is missing.");
        }
    };

    const handleDeleteMember = async (id) => {
        await axios.delete(`${API_URL}/members/${id}`);
        fetchMembers();
    };

    const handleAddTrainer = async () => {
        const { name, email , specialization } = newTrainer;

        // Проверка на заполненность всех полей
        if (!name || !email || !specialization) {
            alert("Please fill in all fields before submitting.");
            return;
        }

        try {
            await axios.post(`${API_URL}/trainers`, newTrainer);
            setNewTrainer({ name: '', specialization: '', email: ''});
            fetchTrainers();
        } catch (error) {
            console.error("Failed to add trainer:", error);
        }
    };

    const handleUpdateTrainer = async () => {
        if (selectedTrainer && selectedTrainer.id) {
            const { name, specialization, email} = selectedTrainer;

            // Проверка на заполненность всех полей
            if (!name || !specialization || !email) {
                alert("Please fill in all fields before updating.");
                return;
            }

            try {
                await axios.put(`${API_URL}/trainers/${selectedTrainer.id}`, selectedTrainer);
                setSelectedTrainer(null); // Сбросить выбранного члена после успешного обновления
                fetchTrainers(); // Обновить список членов
            } catch (error) {
                console.error("Failed to update trainer:", error);
            }
        } else {
            console.error("Selected trainer ID is missing.");
        }
    };

    const handleDeleteTrainer = async (id) => {
        await axios.delete(`${API_URL}/trainers/${id}`);
        fetchTrainers();
    };

    const handleCheckMembership = async (memberId) => {
        try {
            const response = await axios.get(`${API_URL}/active-membership/${memberId}`);
            const isActive = response.data.is_active;
            alert(`Membership is ${isActive ? 'Active' : 'Inactive'}`);
        } catch (error) {
            console.error("Failed to check membership status:", error);
            alert("Failed to check membership status");
        }
    };

    return (
        <div className="App">
            <h1>Gym Admin Panel</h1>

            <SearchMembers
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
                handleSearch={handleSearch}
                searchResults={searchResults}
            />

            {/* Members Section */}
            <div>
                <h2>Add New Member</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                />
                <input
                    type="date"
                    placeholder="Join Date"
                    value={newMember.join_date}
                    onChange={(e) => setNewMember({...newMember, join_date: e.target.value})}
                />
                <input
                    type="text"
                    placeholder="Membership Type"
                    value={newMember.membership_type}
                    onChange={(e) => setNewMember({...newMember, membership_type: e.target.value})}
                />
                <button onClick={handleAddMember}>Add Member</button>
            </div>

            {/* Edit Member Section */}
            {selectedMember && (
                <div>
                    <h2>Edit Member</h2>
                    <input
                        type="text"
                        value={selectedMember.name || ''}
                        onChange={(e) => setSelectedMember({...selectedMember, name: e.target.value})}
                    />
                    <input
                        type="email"
                        value={selectedMember.email || ''}
                        onChange={(e) => setSelectedMember({...selectedMember, email: e.target.value})}
                    />
                    <input
                        type="date"
                        value={selectedMember.join_date || ''}
                        onChange={(e) => setSelectedMember({...selectedMember, join_date: e.target.value})}
                    />
                    <input
                        type="text"
                        value={selectedMember.membership_type || ''}
                        onChange={(e) => setSelectedMember({...selectedMember, membership_type: e.target.value})}
                    />
                    <button onClick={handleUpdateMember}>Update Member</button>
                </div>
            )}

            <div>
                <h2>Members</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Join Date</th>
                        <th>Membership Type</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {members.map(member => (
                        <tr key={member.id}>
                            <td>{member.name}</td>
                            <td>{member.email}</td>
                            <td>{member.join_date}</td>
                            <td>{member.membership_type}</td>
                            <td>
                                <button onClick={() => setSelectedMember(member)}>Edit</button>
                                <button onClick={() => handleDeleteMember(member.id)}>Delete</button>
                                <button onClick={() => handleCheckMembership(member.id)}>Check Status</button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            <div>
                <h2>Add New Trainer</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={newTrainer.name}
                    onChange={(e) => setNewTrainer({...newTrainer, name: e.target.value})}
                />
                <input
                    type="text"
                    placeholder="Specialization"
                    value={newTrainer.specialization}
                    onChange={(e) => setNewTrainer({...newTrainer, specialization: e.target.value})}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={newTrainer.email}
                    onChange={(e) => setNewTrainer({...newTrainer, email: e.target.value})}
                />
                <button onClick={handleAddTrainer}>Add Trainer</button>
            </div>

            {selectedTrainer && (
                <div>
                    <h2>Edit Trainer</h2>
                    <input
                        type="text"
                        value={selectedTrainer.name || ''}
                        onChange={(e) => setSelectedTrainer({...selectedTrainer, name: e.target.value})}
                    />
                    <input
                        type="text"
                        value={selectedTrainer.specialization || ''}
                        onChange={(e) => setSelectedTrainer({...selectedTrainer, specialization: e.target.value})}
                    />
                    <input
                        type="email"
                        value={selectedTrainer.email || ''}
                        onChange={(e) => setSelectedTrainer({...selectedTrainer, email: e.target.value})}
                    />
                    <button onClick={handleUpdateTrainer}>Update Trainer</button>
                </div>
            )}

            <div>
                <h2>Trainers</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Specialization</th>
                        <th>Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {trainers.map(trainer => (
                        <tr key={trainer.id}>
                            <td>{trainer.name}</td>
                            <td>{trainer.specialization}</td>
                            <td>{trainer.email}</td>
                            <td>
                                <button onClick={() => setSelectedTrainer(trainer)}>Edit</button>
                                <button onClick={() => handleDeleteTrainer(trainer.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <TrainerClassCount trainerClassCount={trainerClassCount}/>
            <ClassList classes={classes}/>
            <ClassStatistics classStats={classStats}/>
            <EquipmentSummary equipmentSummary={equipmentSummary}/>
        </div>
    );
}

export default App;