import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import SubjectManager from '../../components/bai2/SubjectManager';
import QuestionBank from '../../components/bai2/QuestionBank';
import ExamGenerator from '../../components/bai2/ExamGenerator';

const { Content, Sider } = Layout;

const App: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState('subjects');

  const renderContent = () => {
    switch(selectedMenu) {
      case 'subjects': return <SubjectManager />;
      case 'questions': return <QuestionBank />;
      case 'exams': return <ExamGenerator />;
      default: return <SubjectManager />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['subjects']}
          style={{ height: '100%', borderRight: 0 }}
          onSelect={({ key }) => setSelectedMenu(key)}
        >
          <Menu.Item key="subjects">Quản Lý Môn Học</Menu.Item>
          <Menu.Item key="questions">Ngân Hàng Câu Hỏi</Menu.Item>
          <Menu.Item key="exams">Tạo Đề Thi</Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ padding: '24px', minHeight: 280 }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
