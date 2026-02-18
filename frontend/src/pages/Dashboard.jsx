import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Breadcrumb, List, Typography, Tag, Button } from 'antd';
import { FileTextOutlined, MenuOutlined, UserOutlined, EyeOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import dayjs from 'dayjs';

const { Title } = Typography;

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        contentCount: 0,
        menuCount: 0,
        userCount: 0,
        recentContents: []
    });
    const [dailyStats, setDailyStats] = useState([]);
    const [pendingWorkflows, setPendingWorkflows] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const startDate = dayjs().subtract(6, 'day').format('YYYYMMDD');
            const endDate = dayjs().format('YYYYMMDD');

            const [contentRes, menuRes, statsRes, workflowRes] = await Promise.all([
                axios.get('/cms/content'),
                axios.get('/cms/menu'),
                axios.get('/cms/stats/daily', { params: { startDate, endDate } }),
                axios.get('/cms/workflow/request', { params: { status: 'REQUESTED' } })
            ]);

            if (contentRes.data.success) {
                setStats(prev => ({
                    ...prev,
                    contentCount: contentRes.data.data.length,
                    recentContents: contentRes.data.data.slice(0, 5)
                }));
            }
            if (menuRes.data.success) {
                setStats(prev => ({ ...prev, menuCount: menuRes.data.data.length }));
            }
            if (statsRes.data.success) {
                setDailyStats(statsRes.data.data);
            }
            if (workflowRes.data.success) {
                setPendingWorkflows(workflowRes.data.data.slice(0, 5));
            }
        } catch (error) {
            console.error('데이터 로딩 실패', error);
        }
    };

    // 총 방문자 수 계산
    const totalPv = dailyStats.reduce((sum, item) => sum + item.pvCount, 0);

    return (
        <div>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Admin</Breadcrumb.Item>
                <Breadcrumb.Item>대시보드</Breadcrumb.Item>
            </Breadcrumb>

            <Title level={2}>CMS 관리 현황</Title>

            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="전체 콘텐츠"
                            value={stats.contentCount}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#3f51b5' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="운영 메뉴"
                            value={stats.menuCount}
                            prefix={<MenuOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="주간 방문자 (PV)"
                            value={totalPv}
                            prefix={<EyeOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="승인 대기"
                            value={pendingWorkflows.length}
                            prefix={<SafetyCertificateOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={16}>
                    <Card title="주간 방문자 추이" style={{ marginBottom: 24 }}>
                        <div style={{ height: 250 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dailyStats}>
                                    <XAxis dataKey="conectDe" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="pvCount" fill="#8884d8" name="페이지 뷰" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

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
                                    <Tag color={item.sttusCode === 'P' ? 'green' : 'orange'}>
                                        {item.sttusCode === 'P' ? '게시중' : '임시'}
                                    </Tag>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                <Col span={8}>
                    <Card title="승인 대기 워크플로우" style={{ marginBottom: 24 }} extra={<a href="/workflow">더보기</a>}>
                        <List
                            itemLayout="horizontal"
                            dataSource={pendingWorkflows}
                            renderItem={item => (
                                <List.Item actions={[<Button size="small" onClick={() => navigate('/workflow')}>검토</Button>]}>
                                    <List.Item.Meta
                                        title={item.reqTitle}
                                        description={<span style={{ fontSize: 12 }}>{item.reqUserId} | {dayjs(item.reqDt).format('MM-DD')}</span>}
                                    />
                                </List.Item>
                            )}
                        />
                        {pendingWorkflows.length === 0 && <div style={{ textAlign: 'center', padding: 20 }}>대기 중인 요청이 없습니다.</div>}
                    </Card>

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
