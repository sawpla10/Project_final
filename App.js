import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CurrentStudyGroupPage from './CurrentStudyGroupPage';
import NewStudyGroupPage from './NewStudyGroupPage';
import ManageStudyGroupPage from './ManageStudyGroupPage';
import StudyGroupDetailPage from './StudyGroupDetailPage';

const Wrapper = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'Arial, sans-serif' }}>
      {children}
    </div>
  );
};

const LoginBanner = ({ onLogin }) => {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const handleLogin = () => {
    if (username === 'apple' && password === '1234') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      onLogin();
    } else {
      setLoginError(true);
    }
  };

  return (
    <div style={{ flex: '0 0 200px', border: '1px solid #d1d5db', borderRadius: '10px', padding: '20px', marginRight: '20px', backgroundColor: '#FFF', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      {localStorage.getItem('isLoggedIn') !== 'true' ? (
        <div>
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#4b5563' }}>로그인</h2>
          <input type="text" placeholder="아이디" value={username} onChange={e => setUsername(e.target.value)} style={{ marginBottom: '10px', padding: '10px', width: '100%', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #d1d5db' }} />
          <input type="password" placeholder="비밀번호" value={password} onChange={e => setPassword(e.target.value)} style={{ marginBottom: '10px', padding: '10px', width: '100%', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #d1d5db' }} />
          <button style={{ backgroundColor: '#3b82f6', color: '#FFF', padding: '10px', width: '100%', border: 'none', borderRadius: '5px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} onClick={handleLogin}>로그인</button>
          {loginError && <div style={{ color: '#ef4444', marginTop: '10px' }}>아이디 또는 비밀번호가 올바르지 않습니다.</div>}
        </div>
      ) : null}
    </div>
  );
};

const UserInfo = ({ onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    onLogout();
  };

  return (
    <div style={{ display: 'flex', width: '90%', marginBottom: '20px', backgroundColor: '#FFF', padding: '20px', border: '1px solid #d1d5db', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ flex: 1, borderRight: '1px solid #d1d5db', paddingRight: '20px' }}>
        <div style={{ borderBottom: '1px solid #d1d5db', paddingBottom: '20px' }}>
          {localStorage.getItem('isLoggedIn') === 'true' ? (
            <div>
              <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#4b5563' }}>내 정보</h2>
              <p style={{ marginBottom: '10px', color: '#4b5563' }}>아이디: {localStorage.getItem('username')}</p>
              <button style={{ backgroundColor: '#ef4444', color: '#FFF', padding: '10px', width: '100%', border: 'none', borderRadius: '5px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} onClick={handleLogout}>로그아웃</button>
            </div>
          ) : (
            <div style={{ color: '#4b5563', textAlign: 'center' }}>로그인을 해주세요</div>
          )}
        </div>
        <div style={{ paddingTop: '20px' }}>
          <Calendar />
        </div>
      </div>
      <div style={{ flex: 2.5, paddingLeft: '20px' }}>
        <PopularStudyGroups />
      </div>
    </div>
  );
};

const CustomStudyGroups = ({ userInfo }) => {
  const [customGroups, setCustomGroups] = useState({});
  const [userPreferences, setUserPreferences] = useState([]);
  const [selectedPreference, setSelectedPreference] = useState('');
  const [loading, setLoading] = useState(false);

  const preferencesList = [
    '스터디', '프로젝트', '기획', '서비스', '코테/알고리즘', '프론트엔드',
    '백엔드', '모바일', 'UI/UX', 'AI/머신러닝', '게임', '블록체인'
  ];

  const fetchCustomGroups = async (preference) => {
    setLoading(true);
    try {
      console.log(`Fetching groups for preference: ${preference}`);
      const response = await axios.get('http://localhost:5000/api/custom-study-groups', {
        params: { preferences: preference },
      });
      console.log('Received response:', response.data);

      if (response.data.groups && response.data.groups.length > 0) {
        setCustomGroups(prevGroups => ({
          ...prevGroups,
          [preference]: response.data.groups.map(link => ({ group: [], link }))
        }));
      } else {
        console.log('No groups found for this preference:', preference);
        setCustomGroups(prevGroups => ({
          ...prevGroups,
          [preference]: []
        }));
      }
    } catch (error) {
      console.error('Error fetching custom study groups:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo.isLoggedIn && selectedPreference) {
      console.log('Fetching data for selected preference:', selectedPreference);
      fetchCustomGroups(selectedPreference);
    }
  }, [selectedPreference, userInfo]);

  const handlePreferenceSelect = (preference) => {
    setSelectedPreference(preference);
    if (!userPreferences.includes(preference)) {
      setUserPreferences([...userPreferences, preference]);
    }
  };

  const handleRemoveGroup = (preference, index) => {
    setCustomGroups((prevGroups) => {
      const updatedGroups = { ...prevGroups };
      updatedGroups[preference] = updatedGroups[preference].filter((_, idx) => idx !== index);
      if (updatedGroups[preference].length === 0) {
        delete updatedGroups[preference];
        setUserPreferences(userPreferences.filter(pref => pref !== preference));
      }
      return updatedGroups;
    });
  };

  console.log('Current user preferences:', userPreferences);
  console.log('Current custom groups:', customGroups);

  return (
    <div style={{ border: '1px solid #d1d5db', borderRadius: '10px', padding: '20px', flex: 1, marginRight: '100px', backgroundColor: '#FFF', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h2>사용자 맞춤 스터디 그룹</h2>
      <div>
        {preferencesList.map(preference => (
          <button key={preference} onClick={() => handlePreferenceSelect(preference)}>
            {preference}
          </button>
        ))}
      </div>
      {loading ? (
        <div>로드 중...</div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {userPreferences.map((preference) => (
            customGroups[preference]?.length > 0 ? customGroups[preference].map((groupData, idx) => (
              <div key={`${preference}-${idx}`} style={{ flex: '0 0 calc(20% - 10px)', marginRight: '10px', marginBottom: '10px', backgroundColor: '#edf2f7', borderRadius: '5px', padding: '20px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                <h3>그룹 {idx + 1}</h3>
                <div>{preference}</div>
                <ul>
                  {groupData.group.map(member => <li key={member}>{member}</li>)}
                </ul>
                {groupData.link && (
                  <a href={groupData.link} target="_blank" rel="noopener noreferrer">자세히 보기</a>
                )}
                <button onClick={() => handleRemoveGroup(preference, idx)}>그룹 삭제</button>
              </div>
            )) : (
              <div key={`${preference}-none`} style={{ flex: '0 0 calc(100% - 10px)', marginBottom: '10px', backgroundColor: '#edf2f7', borderRadius: '5px', padding: '20px', textAlign: 'center' }}>
                <p>{preference}에 대한 스터디 그룹이 없습니다.</p>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

const PopularStudyGroups = () => {
  const popularGroups = [
    { id: 1, title: '인기 스터디 그룹 1' },
    { id: 2, title: '인기 스터디 그룹 2' },
    { id: 3, title: '인기 스터디 그룹 3' },
    { id: 4, title: '인기 스터디 그룹 4' },
    { id: 5, title: '인기 스터디 그룹 5' },
    { id: 6, title: '인기 스터디 그룹 6' },
  ];

  return (
    <div style={{ padding: '20px', marginBottom: '20px', width: '80%', backgroundColor: '#FFF', border: '1px solid #d1d5db', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <StudyBanner title="인기 스터디 그룹" />
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {popularGroups.map(group => (
          <StudyBanner key={group.id} title={group.title} style={{ flex: '1', margin: '0 2.5%', border: '1px solid #d1d5db', backgroundColor: '#edf2f7', borderRadius: '5px', padding: '20px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} />
        ))}
      </div>
    </div>
  );
};

const StudyBanner = ({ title, style }) => {
  return (
    <div style={{ ...style, border: '1px solid #d1d5db', borderRadius: '10px', padding: '20px', marginBottom: '30px', backgroundColor: '#edf2f7', textAlign: 'center', color: '#4b5563', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
      <h3>{title}</h3>
    </div>
  );
};

const StudyGroups = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #d1d5db', borderRadius: '10px', padding: '20px', marginBottom: '20px', width: '25%', backgroundColor: '#FFF', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <Link to="/current_study_group"><StudyBanner title="현재 진행중인 스터디 그룹" /></Link>
      <Link to="/new_study_group"><StudyBanner title="새로운 스터디 그룹 찾기" /></Link>
      <Link to="/manage_study_group"><StudyBanner title="스터디 그룹 관리" /></Link>
    </div>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  return (
    <Router>
      <Wrapper>
        <div>
          {isLoggedIn ? (
            <>
              <UserInfo onLogout={handleLogout} />
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <StudyGroups style={{ flex: 1, marginRight: '20px' }} />
                <CustomStudyGroups userInfo={{ isLoggedIn }} style={{ flex: 1 }} />
              </div>
              <Routes>
                <Route path="/current_study_group" element={<CurrentStudyGroupPage />} />
                <Route path="/new_study_group" element={<NewStudyGroupPage />} />
                <Route path="/manage_study_group" element={<ManageStudyGroupPage />} />
                <Route path="/study_group/:id" element={<StudyGroupDetailPage />} />
              </Routes>
            </>
          ) : (
            <LoginBanner onLogin={handleLogin} />
          )}
        </div>
      </Wrapper>
    </Router>
  );
};

export default App;
