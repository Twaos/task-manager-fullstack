import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.log(error));
  }, []);

  const addTask = () => {
    const newTask = { title, description, dueDate, priority, completed: false };
    axios.post('http://localhost:8080/api/tasks', newTask)
      .then(response => {
        setTasks([...tasks, response.data]);
        clearForm();
      })
      .catch(error => console.log(error));
  };

  const updateTask = () => {
    axios.put(`http://localhost:8080/api/tasks/${editingTask.id}`, { title, description, dueDate, priority, completed: false })
      .then(response => {
        setTasks(tasks.map(task => task.id === editingTask.id ? response.data : task));
        clearForm();
        setEditingTask(null);
      })
      .catch(error => console.log(error));
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:8080/api/tasks/${id}`)
      .then(() => setTasks(tasks.filter(task => task.id !== id)))
      .catch(error => console.log(error));
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('MEDIUM');
  };

  const editTask = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate || '');
    setPriority(task.priority);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Task Manager</h1>
      <div>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="date" placeholder="Due Date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>LOW</option>
          <option>MEDIUM</option>
          <option>HIGH</option>
        </select>
        {editingTask ? (
          <button onClick={updateTask}>Update Task</button>
        ) : (
          <button onClick={addTask}>Add Task</button>
        )}
        {editingTask && <button onClick={() => { clearForm(); setEditingTask(null); }}>Cancel</button>}
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <strong>{task.title}</strong> - {task.description} 
            ({task.priority}) - Due: {task.dueDate}
            <button onClick={() => editTask(task)}>Edit</button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;