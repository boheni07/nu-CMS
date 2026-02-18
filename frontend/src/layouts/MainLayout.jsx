import React, { useState } from 'react';
import { Layout, Menu, Button, Space, Avatar, Dropdown, message } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    DashboardOutlined,
    FileTextOutlined,
    SettingOutlined,
    GlobalOutlined,
    AppstoreOutlined,
    LayoutOutlined,
    UserOutlined,
    TeamOutlined,
    ContainerOutlined,
    SafetyCertificateOutlined,
    PictureOutlined,
    BarChartOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleMenuClick = ({ key }) => {
        if (key === 'logout') {
            message.success('로그아웃 되었습니다.');
            return;
        }
        navigate(key);
    };

    const menuItems = [
        {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: '대시보드',
        },
        {
            key: 'content-management',
            icon: <FileTextOutlined />,
            label: '콘텐츠 관리',
            children: [
                { key: '/content', label: '단일 페이지' },
                { key: '/board-master', label: '게시판 관리' },
            ]
        },
        {
            key: '/media',
            icon: <PictureOutlined />,
            label: '미디어 라이브러리',
        },
        {
            key: '/stats',
            icon: <BarChartOutlined />,
            label: '통계 대시보드',
        },
        {
            key: 'site-management',
            icon: <GlobalOutlined />,
            label: '사이트 관리',
            children: [
                { key: '/menu', label: '메뉴 관리' },
                { key: '/widget', label: '위젯 관리' },
                { key: '/template', label: '템플릿 관리' },
            ]
        },
        {
            key: 'member-management',
            icon: <TeamOutlined />,
            label: '회원/권한 관리',
            children: [
                { key: '/member', label: '회원 관리' },
                { key: '/role', label: '권한/역할 관리' },
            ]
        },
        {
            key: '/workflow',
            icon: <SafetyCertificateOutlined />,
            label: '승인 워크플로우',
        },
        {
            key: 'system-config',
            icon: <SettingOutlined />,
            label: '환경설정',
            children: [
                { key: '/config', label: '시스템 설정' },
                { key: '/audit-log', label: '통합 감사 로그' },
            ]
        }
    ];

    const userMenu = (
        <Menu onClick={({ key }) => {
            if (key === 'profile') message.info('프로필 설정 준비중');
            if (key === 'logout') message.success('로그아웃');
        }}>
            <Menu.Item key="profile" icon={<UserOutlined />}>내 프로필</Menu.Item>
            <Menu.Item key="logout" danger>로그아웃</Menu.Item>
        </Menu>
    );

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} theme="dark">
                <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', textAlign: 'center', color: 'white', lineHeight: '32px', fontWeight: 'bold' }}>
                    {collapsed ? 'CMS' : 'nu-CMS'}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={handleMenuClick}
                />
            </Sider>
            <Layout className="site-layout">
                <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: () => setCollapsed(!collapsed),
                        style: { fontSize: '18px', cursor: 'pointer' }
                    })}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button type="link" icon={<GlobalOutlined />} onClick={() => window.open('http://localhost:8080', '_blank')}>
                            사이트 바로가기
                        </Button>
                        <Dropdown overlay={userMenu}>
                            <Space style={{ cursor: 'pointer', marginLeft: 16 }}>
                                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />
                                <span style={{ fontWeight: 500 }}>관리자님</span>
                            </Space>
                        </Dropdown>
                    </div>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: '#fff',
                        borderRadius: '8px',
                        overflow: 'initial'
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
