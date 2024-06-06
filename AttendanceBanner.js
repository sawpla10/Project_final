import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';

const AttendanceBanner = ({ studyGroup }) => {
  const [attendanceDates, setAttendanceDates] = useState([]);

  useEffect(() => {
    const storedAttendanceDates = JSON.parse(localStorage.getItem(`attendanceDates_${studyGroup.id}`));
    if (storedAttendanceDates) {
      setAttendanceDates(storedAttendanceDates);
    }
  }, [studyGroup]);

  const updateAttendanceDates = (newAttendanceDates) => {
    setAttendanceDates(newAttendanceDates);
    localStorage.setItem(`attendanceDates_${studyGroup.id}`, JSON.stringify(newAttendanceDates));
  };

  const handleDateClick = (date) => {
    const dateString = date.toISOString().split('T')[0];

    let updatedAttendanceDates;
    if (attendanceDates.includes(dateString)) {
      updatedAttendanceDates = attendanceDates.filter(attendDate => attendDate !== dateString);
    } else {
      updatedAttendanceDates = [...attendanceDates, dateString];
    }
    updateAttendanceDates(updatedAttendanceDates);
  };

  return (
    <div style={{ backgroundColor: '#f0f4f7', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ marginBottom: '20px', color: '#4b5563', textAlign: 'center' }}>출석 현황</h2>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
        <Calendar
          onClickDay={handleDateClick}
          value={new Date()}
          tileContent={({ date }) => {
            const dateString = date.toISOString().split('T')[0];
            const isAttended = attendanceDates.includes(dateString);
            if (isAttended) {
              return <p style={{ margin: 0, color: '#fff', backgroundColor: '#4b5563', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>출석</p>;
            }
          }}
        />
      </div>
    </div>
  );
};

export default AttendanceBanner;