import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Breadcrumb, List, Typography, Tag } from 'antd';
import { FileTextOutlined, MenuOutlined, UserOutlined, ArrowUpOutlined } from '@ant-design/icons';
import axios from '../api/axios';

const { Title } = Typography;

const Dashboard = () => {
    const [stats, setStats] = useState({
        contentCount: 0,
        menuCount: 0,
        userCount: 2, // 초기 설정한 admin, user
        recentContents: []
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [contentRes, menuRes] = await Promise.all([
                axios.get('/cms/content'),
                axios.get('/cms/menu')
            ]);

            if (contentRes.data.success && menuRes.data.success) {
                setStats({
                    contentCount: contentRes.data.data.length,
                    menuCount: menuRes.data.data.length,
                    userCount: 2,
                    recentContents: contentRes.data.data.slice(0, 5)
                });
            }
        } catch (error) {
            console.error('통계 데이터를 불러오는데 실패했습니다.');
        }
    };

    return (
        <div>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Admin</Breadcrumb.Item>
                <Breadcrumb.Item>대시보드</Breadcrumb.Item>
            </Breadcrumb>

            <Title level={2}>CMS 관리 현황</Title>

            <Row gutter={16}>
                <Col span={8}>
                    <Card bordered={false}>
                        <Statistic
                            title="전체 콘텐츠"
                            value={stats.contentCount}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#3f51b5' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false}>
                        <Statistic
                            title="운영 메뉴"
                            value={stats.menuCount}
                            prefix={<MenuOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false}>
                        <Statistic
                            title="관리 사용자"
                            value={stats.userCount}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#3fcf8e' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 24 }}>
                <Col span={16}>
                    <Card title="최근 등록/수정된 콘텐츠">
                        <List
                            itemLayout="horizontal"
                            dataSource={stats.recentContents}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={<a href={`/content/edit/${item.cntentsId}`}>{item.sj}</a>}
                                        description={`작성자: ${item.wrterId} | 버전: v${item.verNo}`}
                                    />
                                    <div>
                                        <Tag color={item.sttusCode === 'P' ? 'green' : 'orange'}>
                                            {item.sttusCode === 'P' ? '게시중' : '임시'}
                                        </Tag>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="시스템 정보">
                        <p><strong>프레임워크:</strong> eGovFrame 4.2</p>
                        <p><strong>백엔드:</strong> Spring Boot 3.x</p>
                        <p><strong>프론트엔드:</strong> React & Ant Design v5</p>
                        <p><strong>상태:</strong> 정상 작동 중 <Tag color="processing">Online</Tag></p>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
