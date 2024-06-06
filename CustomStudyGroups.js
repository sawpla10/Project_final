import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomStudyGroups = () => {
  const [customGroups, setCustomGroups] = useState([]);
  const [userPreferences, setUserPreferences] = useState([]);

  const preferencesList = [
    '스터디', '프로젝트', '기획',
    '서비스', '코테/알고리즘', '프론트엔드',
    '백엔드', '모바일', 'UI/UX', 'AI/머신러닝',
    '게임', '블록체인'
  ];

  // 맞춤형 스터디 그룹을 백엔드에서 가져오는 함수
  const fetchCustomGroups = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/custom-study-groups', {
        params: { preferences: userPreferences.join(' ') },
      });
      setCustomGroups(response.data.groups);
    } catch (error) {
      console.error('Error fetching custom study groups:', error);
    }
  };

  // 선호도 변경 시마다 데이터를 가져옴
  useEffect(() => {
    if (userPreferences.length > 0) {
      fetchCustomGroups();
    }
  }, [userPreferences]);

  // 선호도 선택 핸들러
  const handlePreferenceSelect = (preference) => {
    if (!userPreferences.includes(preference)) {
      setUserPreferences([...userPreferences, preference]);
    }
  };

  return (
    <div style={{ border: '1px solid #d1d5db', borderRadius: '10px', padding: '20px', backgroundColor: '#FFF', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h2>사용자 맞춤 스터디 그룹</h2>
      <div>
        {preferencesList.map(preference => (
          <button key={preference} onClick={() => handlePreferenceSelect(preference)}>
            {preference}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {customGroups.map((group, idx) => (
          <div key={idx} style={{ margin: '10px', padding: '20px', borderRadius: '5px', backgroundColor: '#edf2f7', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <h3>그룹 {idx + 1}</h3>
            <ul>
              {group.map(member => <li key={member}>{member}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomStudyGroups;
