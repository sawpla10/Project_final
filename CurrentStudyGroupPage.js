import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CurrentStudyGroupPage = () => {
  const [joinedStudyGroups, setJoinedStudyGroups] = useState([]);

  useEffect(() => {
    const savedStudyGroups = localStorage.getItem('studyGroups');
    if (savedStudyGroups) {
      const parsedStudyGroups = JSON.parse(savedStudyGroups);
      const filteredJoinedGroups = parsedStudyGroups.filter(group => group.isJoined);
      setJoinedStudyGroups(filteredJoinedGroups);
    }
  }, []);

  return (
    <div style={{ backgroundColor: '#f3f4f6', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#4b5563' }}>현재 진행중인 스터디 그룹</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {joinedStudyGroups.map(group => (
          <li key={group.id} style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #d1d5db', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            {/* 스터디 그룹 상세 페이지로 이동하는 링크 */}
            <Link to={`/study_group/${group.id}`} style={{ color: '#4b5563' }}>
              {group.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CurrentStudyGroupPage;
