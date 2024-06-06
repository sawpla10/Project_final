import React, { useState, useEffect } from 'react';

const TasksBanner = ({ studyGroup }) => {
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const storedTasks = localStorage.getItem(`tasks_${studyGroup.id}`);
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, [studyGroup]);

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      const updatedTasks = [...tasks, { name: newTask, completed: false }];
      setTasks(updatedTasks);
      localStorage.setItem(`tasks_${studyGroup.id}`, JSON.stringify(updatedTasks));
      setNewTask('');
    }
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    localStorage.setItem(`tasks_${studyGroup.id}`, JSON.stringify(updatedTasks));
  };

  const handleToggleTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
    localStorage.setItem(`tasks_${studyGroup.id}`, JSON.stringify(updatedTasks));
  };

  return (
    <div style={{ backgroundColor: '#f0f4f7', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ marginBottom: '20px', color: '#4b5563', textAlign: 'center' }}>과제 현황</h2>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="새로운 과제 추가"
          style={{ padding: '5px', marginRight: '10px', borderRadius: '5px', border: '1px solid #d1d5db', flex: 1 }}
        />
        <button onClick={handleAddTask} style={{ padding: '8px 15px', borderRadius: '5px', backgroundColor: '#4b5563', color: '#fff', border: 'none' }}>추가</button>
      </div>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {tasks.map((task, index) => (
          <li key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleTask(index)}
              style={{ marginRight: '10px' }}
            />
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none', color: '#4b5563', flex: 1 }}>
              {task.name}
            </span>
            <button onClick={() => handleDeleteTask(index)} style={{ padding: '5px 10px', borderRadius: '5px', backgroundColor: '#ef4444', color: '#fff', border: 'none' }}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksBanner;
