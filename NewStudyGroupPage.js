import React, { useState, useEffect } from 'react';

const NewStudyGroupPage = () => {
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
  const [studyGroups, setStudyGroups] = useState([]); // 스터디 그룹 목록 상태

  // 로컬 스토리지에서 스터디 그룹 목록을 불러와 초기화
  useEffect(() => {
    const savedStudyGroups = localStorage.getItem('studyGroups');
    if (savedStudyGroups) {
      setStudyGroups(JSON.parse(savedStudyGroups));
    }
  }, []);

  // 검색어 입력 시 상태 업데이트
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // 실제 검색 로직을 수행하여 일치하는 스터디 그룹 필터링
  const filteredStudyGroups = studyGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: '#f3f4f6', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#4b5563' }}>새로운 스터디 그룹 찾기</h2>
      {/* 검색 입력란 */}
      <input
        type="text"
        placeholder="스터디 그룹 검색"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: '20px', padding: '10px', borderRadius: '5px', border: '1px solid #d1d5db', width: '100%' }}
      />

      {/* 검색 결과 표시 */}
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {filteredStudyGroups.map(group => (
          <li key={group.id} style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #d1d5db', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>{group.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default NewStudyGroupPage;
