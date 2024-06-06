import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const ScheduleBanner = ({ studyGroup }) => {
  const [newSchedule, setNewSchedule] = useState('');
  const [schedules, setSchedules] = useState([]);

  // 로컬 스토리지에서 해당 스터디 그룹의 일정 가져오기
  useEffect(() => {
    const storedSchedules = localStorage.getItem(`schedules_${studyGroup.id}`);
    if (storedSchedules) {
      setSchedules(JSON.parse(storedSchedules));
    }
  }, [studyGroup]);

  // 새로운 일정 추가
  const handleAddSchedule = () => {
    if (newSchedule.trim() !== '') {
      const updatedSchedules = [...schedules, newSchedule];
      setSchedules(updatedSchedules);
      // 로컬 스토리지에 해당 스터디 그룹의 일정 저장
      localStorage.setItem(`schedules_${studyGroup.id}`, JSON.stringify(updatedSchedules));
      setNewSchedule('');
    }
  };

  // 일정 삭제
  const handleDeleteSchedule = (index) => {
    const updatedSchedules = [...schedules];
    updatedSchedules.splice(index, 1);
    setSchedules(updatedSchedules);
    // 로컬 스토리지에서 해당 스터디 그룹의 일정 삭제
    localStorage.setItem(`schedules_${studyGroup.id}`, JSON.stringify(updatedSchedules));
  };

  return (
    <div style={{ backgroundColor: '#f0f4f7', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ marginBottom: '20px', color: '#4b5563', textAlign: 'center' }}>일정 관리</h2>
      {/* 일정 추가 폼 */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={newSchedule}
          onChange={(e) => setNewSchedule(e.target.value)}
          placeholder="날짜와 시간을 포함한 일정 추가"
          style={{ marginRight: '10px', padding: '8px', borderRadius: '5px', border: '1px solid #d1d5db' }}
        />
        <button onClick={handleAddSchedule} style={{ padding: '8px 15px', borderRadius: '5px', backgroundColor: '#4b5563', color: '#fff', border: 'none' }}>추가</button>
      </div>
      {/* 달력 */}
      <div style={{ height: 400 }}>
        <Calendar
          localizer={localizer}
          events={schedules.map((schedule, index) => ({
            id: index,
            title: schedule,
            start: new Date(),
            end: new Date(),
          }))}
          startAccessor="start"
          endAccessor="end"
          style={{ borderRadius: '5px', border: '1px solid #d1d5db' }}
        />
      </div>
      {/* 일정 목록 */}
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ marginBottom: '10px', color: '#4b5563' }}>일정 목록</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {schedules.map((schedule, index) => (
            <li key={index} style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #d1d5db', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
              {schedule}
              <button onClick={() => handleDeleteSchedule(index)} style={{ marginLeft: '10px', padding: '5px 10px', borderRadius: '5px', backgroundColor: '#ef4444', color: '#fff', border: 'none' }}>삭제</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ScheduleBanner;
