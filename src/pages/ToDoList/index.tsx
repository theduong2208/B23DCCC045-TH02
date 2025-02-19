import React, { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { BookOutlined, ScheduleOutlined, TrophyOutlined } from '@ant-design/icons';
import SubjectManagement from '../../components/bai2/ SubjectManagement';
import ProgressTracking from '../../components/bai2/ProgressTracking';
import MonthlyGoals from '../../components/bai2/MonthlyGoals';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const index: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState('1');

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className=" px-4">
        <Title level={3}>Hệ thống Theo dõi Học tập</Title>
      </Header>
      <Layout>
        <Sider width={200} className="bg-white">
          <Menu
            mode="inline"
            selectedKeys={[selectedMenu]}
            onSelect={({ key }) => setSelectedMenu(key)}
            style={{ height: '100%' }}
          >
            <Menu.Item key="1" icon={<BookOutlined />}>
              Quản lý Môn học
            </Menu.Item>
            <Menu.Item key="2" icon={<ScheduleOutlined />}>
              Theo dõi Tiến độ
            </Menu.Item>
            <Menu.Item key="3" icon={<TrophyOutlined />}>
              Mục tiêu Tháng
            </Menu.Item>
          </Menu>
        </Sider>
        <Content className="p-6">
          {selectedMenu === '1' && <SubjectManagement />}
          {selectedMenu === '2' && <ProgressTracking />}
          {selectedMenu === '3' && <MonthlyGoals />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default index;
