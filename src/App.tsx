import { useState, useEffect } from 'react';
import './UserManagement.css';

type User = {
  id?: string;
  name: string;
  age: string;
  nickname: string;
};

const initialUsers: User[] = [
  { id: '1', name: 'chaiyarod sodtaisong', age: '23', nickname: 'Mind' },
  { id: '2', name: 'Apirat Saengarun', age: '23', nickname: 'Boat' },
  { id: '3', name: 'Danuporn Seesin', age: '23', nickname: 'Um' },
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      return JSON.parse(savedUsers);
    }
    return initialUsers;
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<User>({ name: '', age: '', nickname: '' });
  const [newForm, setNewForm] = useState<User>({ name: '', age: '', nickname: '' });

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewForm({ ...newForm, [e.target.name]: e.target.value });
  };

  const handleStartEdit = (user: User) => {
    if (!user.id) return;
    setEditId(user.id);
    setForm({ name: user.name, age: user.age, nickname: user.nickname });
  };

  const handleSaveEdit = () => {
    if (!form.name || !form.age || !form.nickname) {
      return alert('กรอกข้อมูลให้ครบ แล้วกดบันทึกอีกครั้ง');
    }
    const ageNum = parseInt(form.age, 10);
    if (ageNum < 1 ) {
      return alert('อายุเป็นค่าลบไม่ได้้');
    } else if (ageNum > 100){
      return alert('อายุยืนเกิน ไม่สามารถบันทึกได้');
    }
    setUsers(users.map(u => (u.id === editId ? { ...u, ...form } : u)));
    setEditId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('การลบข้อมูลผู้ใช้นี้ไม่สามารถกู้คืนได้ ยังต้องการลบไหม?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleAddUser = () => {
    if (!newForm.name || !newForm.age || !newForm.nickname) {
      return alert('กรอกข้อมูลให้ครบ แล้วกดบันทึกอีกครั้ง');
    }

    const ageNum = parseInt(newForm.age, 10);
    if (ageNum < 1 ) {
      return alert('อายุเป็นค่าลบไม่ได้้');
    } else if (ageNum > 100){
      return alert('อายุยืนเกิน ไม่สามารถบันทึกได้');
    }

    const maxId = users.length > 0
      ? Math.max(...users.map(u => parseInt(u.id || '0', 10)))
      : 0;

    const nextId = (maxId + 1).toString();

    const newUser = { id: nextId, ...newForm };

    setUsers([...users, newUser]);
    setNewForm({ name: '', age: '', nickname: '' });
    setIsAdding(false);
  };

  const handleCancelAdd = () => {
    setNewForm({ name: '', age: '', nickname: '' });
    setIsAdding(false);
  };

  return (
    <div className="container">
      <h1 className="title">Pre Test Web developer</h1>
      <div className="section">
        <table className="table">
          <thead>
            <tr className="header-row">
              <th className="th">Name</th>
              <th className="th">Age</th>
              <th className="th">Nickname</th>
              <th className="th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="row">
                {editId === user.id ? (
                  <>
                    <td className="td">
                      <input type="text" name="name" value={form.name} onChange={handleEditChange} className="input-cell" />
                    </td>
                    <td className="td">
                      <input type="number" name="age" value={form.age} onChange={handleEditChange} className="input-cell" />
                    </td>
                    <td className="td">
                      <input type="text" name="nickname" value={form.nickname} onChange={handleEditChange} className="input-cell" />
                    </td>
                    <td className="td">
                      <div className="actions">
                        <button onClick={handleSaveEdit} className="btn-small">Save</button>
                        <button onClick={() => setEditId(null)} className="btn-small btn-cancel">Cancel</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="td">{user.name}</td>
                    <td className="td">{user.age}</td>
                    <td className="td">{user.nickname}</td>
                    <td className="td">
                      <div className="actions">
                        <button onClick={() => handleStartEdit(user)} className="btn-small">Edit</button>
                        <button onClick={() => handleDelete(String(user.id))} className="btn-small btn-delete">Delete</button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section">
        {!isAdding ? (
          <button onClick={() => setIsAdding(true)} className="button">Add</button>
        ) : (
          <>
            <h2 className="heading">New User</h2>
            <div className="form">
              <input type="text" name="name" placeholder="Full Name" value={newForm.name} onChange={handleAddChange} className="input" />
              <input type="number" name="age" placeholder="Age" value={newForm.age} onChange={handleAddChange} className="input" />
              <input type="text" name="nickname" placeholder="Nickname" value={newForm.nickname} onChange={handleAddChange} className="input" />

              <div className="actions">
                <button onClick={handleAddUser} className="button">Save</button>
                <button onClick={handleCancelAdd} className="button btn-cancel">Cancel</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}