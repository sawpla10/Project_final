import React, { useState, useEffect } from 'react';

const ProgressBanner = ({ studyGroup }) => {
  const [chapter, setChapter] = useState('');
  const [section, setSection] = useState('');
  const [progressList, setProgressList] = useState([]);

  useEffect(() => {
    const storedProgressList = localStorage.getItem(`progressList_${studyGroup.id}`);
    if (storedProgressList) {
      setProgressList(JSON.parse(storedProgressList));
    }
  }, [studyGroup]);

  const saveProgressListToLocalStorage = (progressList) => {
    localStorage.setItem(`progressList_${studyGroup.id}`, JSON.stringify(progressList));
  };

  const handleChapterChange = (e) => {
    setChapter(e.target.value);
  };

  const handleSectionChange = (e) => {
    setSection(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProgress = {
      chapter: chapter,
      section: section,
    };
    const updatedProgressList = [...progressList, newProgress];
    setProgressList(updatedProgressList);
    saveProgressListToLocalStorage(updatedProgressList); // 새로운 진도 목록을 로컬 스토리지에 저장
    setChapter('');
    setSection('');
  };

  const handleDelete = (index) => {
    const updatedProgressList = progressList.filter((_, idx) => idx !== index);
    setProgressList(updatedProgressList);
    saveProgressListToLocalStorage(updatedProgressList); // 삭제 후의 진도 목록을 로컬 스토리지에 저장
  };

  return (
    <div style={{ backgroundColor: '#f6f8fa', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ marginBottom: '20px', color: '#4b5563', textAlign: 'center' }}>진도 현황</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>
          챕터:
          <input type="text" value={chapter} onChange={handleChapterChange} style={{ marginLeft: '5px', padding: '5px', borderRadius: '5px', border: '1px solid #d1d5db' }} />
        </label>
        <label>
          섹션:
          <input type="text" value={section} onChange={handleSectionChange} style={{ marginLeft: '5px', padding: '5px', borderRadius: '5px', border: '1px solid #d1d5db' }} />
        </label>
        <button type="submit" style={{ marginLeft: '10px', padding: '8px 15px', borderRadius: '5px', backgroundColor: '#4b5563', color: '#fff', border: 'none' }}>저장</button>
      </form>
      <div>
        <h3 style={{ marginBottom: '10px', color: '#4b5563' }}>진도 목록</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {progressList.map((progress, index) => (
            <li key={index} style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #d1d5db', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
              챕터: {progress.chapter}, 섹션: {progress.section}
              <button onClick={() => handleDelete(index)} style={{ marginLeft: '10px', padding: '5px 10px', borderRadius: '5px', backgroundColor: '#ef4444', color: '#fff', border: 'none' }}>삭제</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProgressBanner;
