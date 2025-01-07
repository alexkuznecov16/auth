import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Todos.scss';

const Todos = () => {
  const [tasks, setTasks] = useState([]);  // Tasks
  const [loading, setLoading] = useState(true);  // Loading
  const [error, setError] = useState(null);  // Error

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
  }); // new task

  useEffect(() => {
    // Функция для получения задач
    const fetchTasks = async () => {
      const token = sessionStorage.getItem('token');  // Get token from sessionStorage

      // Show error: token not found
      if (!token) {
        setError('No token available. Please log in.');
        setLoading(false);
        return;
      }

      try {
        // Make request
        const { data } = await axios.get('http://localhost:3000/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Check success
        if (data.success && Array.isArray(data.tasks)) {
          setTasks(data.tasks);  // Add tasks
        } else {
          throw new Error(data.message || 'Failed to fetch tasks.');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);  // Set errors
      } finally {
        setLoading(false);  // Stop loading
      }
    };

    fetchTasks();  // Get tasks
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem('token');

    if (!token) {
      setError('No token available. Please log in.');
      return;
    }

    try {
      // Make add task request
      const { data } = await axios.post(
        'http://localhost:3000/add-tasks',
        newTask,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If success -> refresh tasks
      if (data.success) {
        setTasks((prevTasks) => [...prevTasks, newTask]);
        setNewTask({ title: '', description: '' });  // Refresh inputs
      } else {
        throw new Error(data.message || 'Failed to add task.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // Render content of API request
  const renderContent = () => {
    if (loading) {
      return <div className="loading">Loading tasks...</div>;  // Show loading
    }

    if (error) {
      return <div className="error">Error: {error}</div>;  // Show error
    }

    // show tasks if exists
    return tasks.length > 0 ? (
      <ul className="todos__list">
        {tasks.map((task, index) => (
          <li key={index} className={`todos__item ${task.completed ? 'todos__item--completed' : ''}`}>
            <h2 className="todos__item-title">{task.title}</h2>  {/* Task title */}
            <p className="todos__item-description">{task.description}</p>  {/* Task description */}
            <p className="todos__item-status">{task.completed ? 'Completed' : 'Pending'}</p> {/* Task status */}
          </li>
        ))}
      </ul>
    ) : (
      <p className="no-tasks">No tasks found.</p>  // if no found
    );
  };

  return (
    <div className="todo-container">
      <h1>Your Tasks</h1>
      <form onSubmit={handleAddTask} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Task Title</label>
          <input
            type="text"
            id="title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Task Description</label>
          <textarea
            id="description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="btn-add-task">Add Task</button>
      </form>
      {renderContent()}
    </div>
  );
};

export default Todos;
