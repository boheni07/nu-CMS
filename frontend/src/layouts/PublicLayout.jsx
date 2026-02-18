import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { Outlet, Link } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const PublicLayout = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div className="demo-logo" style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', marginRight: '2rem' }}>
                    nu-CMS Public
                </div>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    items={[
                        { key: '1', label: <Link to="/view">Home</Link> },
                        { key: '2', label: <Link to="/view/board">Board</Link> },
                    ]}
                    style={{ flex: 1, minWidth: 0 }}
                />
            </Header>
            <Content style={{ padding: '0 48px', marginTop: 24, minHeight: 'calc(100vh - 134px)' }}>
                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: 280,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                nu-CMS ©{new Date().getFullYear()} Created by nu-CMS Team
            </Footer>
        </Layout>
    );
};

export default PublicLayout;
