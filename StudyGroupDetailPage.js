import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ScheduleBanner from './ScheduleBanner';
import AttendanceBanner from './AttendanceBanner';
import TasksBanner from './TasksBanner';
import ProgressBanner from './ProgressBanner';

const StudyGroupDetailPage = () => {
  const { id } = useParams();
  const [studyGroup, setStudyGroup] = useState(null);

  useEffect(() => {
    const savedStudyGroups = localStorage.getItem('studyGroups');
    if (savedStudyGroups) {
      const parsedStudyGroups = JSON.parse(savedStudyGroups);
      const group = parsedStudyGroups.find(group => group.id === parseInt(id));
      setStudyGroup(group);
    }
  }, [id]);

  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  if (!studyGroup) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ backgroundColor: '#f3f4f6', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#4b5563' }}>{studyGroup.name}</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <ScheduleBanner studyGroup={studyGroup} onSave={saveToLocalStorage} />
        <ProgressBanner studyGroup={studyGroup} onSave={saveToLocalStorage} />
        <AttendanceBanner studyGroup={studyGroup} onSave={saveToLocalStorage} />
        <TasksBanner studyGroup={studyGroup} onSave={saveToLocalStorage} />
      </div>
    </div>
  );
};

export default StudyGroupDetailPage;
