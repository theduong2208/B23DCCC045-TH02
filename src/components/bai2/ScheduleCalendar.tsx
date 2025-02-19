import React from 'react';
import { Card } from 'antd';
import moment from 'moment';

interface StudySession {
  id: string;
  subjectId: string;
  date: string;
  duration: string;
  content: string;
}

interface ScheduleCalendarProps {
  sessions: StudySession[];
}

const daysOfWeek = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ sessions }) => {
  const groupedSessions: { [key: string]: StudySession[] } = {};

  daysOfWeek.forEach(day => {
    groupedSessions[day] = [];
  });

  sessions.forEach(session => {
    const dayOfWeek = moment(session.date).format('dddd');
    if (daysOfWeek.includes(dayOfWeek)) {
      groupedSessions[dayOfWeek].push(session);
    }
  });

  return (
    <Card title="Lịch Thời Khóa Biểu">
      <div className="schedule-grid">
        {daysOfWeek.map(day => (
          <div key={day} className="schedule-column">
            <h3 className="schedule-day">{day}</h3>
            {groupedSessions[day].length > 0 ? (
              groupedSessions[day].map(session => (
                <div key={session.id} className="schedule-item">
                  <strong>{session.subjectId}</strong>
                  <p>{moment(session.date).format('HH:mm')} - {session.duration}</p>
                  <p>{session.content}</p>
                </div>
              ))
            ) : (
              <p className="empty">Không có lịch học</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ScheduleCalendar;
