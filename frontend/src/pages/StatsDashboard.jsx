import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, DatePicker, Space, Breadcrumb, Typography } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { UserOutlined, EyeOutlined, ArrowUpOutlined, ShareAltOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from '../api/axios';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const StatsDashboard = () => {
    const [data, setData] = useState({ dailyPv: [], popularContent: [], refererStats: [] });
    const [loading, setLoading] = useState(false);
    const [dates, setDates] = useState([dayjs().subtract(7, 'day'), dayjs()]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    useEffect(() => {
        fetchStats();
    }, [dates]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const startDate = dates[0].format('YYYYMMDD');
            const endDate = dates[1].format('YYYYMMDD');
            const response = await axios.get('/api/cms/stats/summary', { params: { startDate, endDate } });
            if (response.data.success) {
                setData(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const popularColumns = [
        { title: '콘텐츠 URL', dataIndex: 'statsLabel', key: 'statsLabel' },
        { title: '조회수(PV)', dataIndex: 'statsCount', key: 'statsCount', render: (val) => <strong>{val.toLocaleString()}</strong> }
    ];

    return (
        <div>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>CMS</Breadcrumb.Item>
                <Breadcrumb.Item>통계 및 성과</Breadcrumb.Item>
                <Breadcrumb.Item>대시보드</Breadcrumb.Item>
            </Breadcrumb>

            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card>
                    <Row gutter={16} align="middle">
                        <Col span={12}><Title level={4} style={{ margin: 0 }}>통계 분석 기간 설정</Title></Col>
                        <Col span={12} style={{ textAlign: 'right' }}>
                            <RangePicker value={dates} onChange={setDates} />
                        </Col>
                    </Row>
                </Card>

                <Row gutter={16}>
                    <Col span={8}>
                        <Card bordered={false}>
                            <Statistic title="전체 페이지뷰 (PV)" value={data.dailyPv.reduce((acc, cur) => acc + cur.statsCount, 0)} prefix={<EyeOutlined />} valueStyle={{ color: '#3f51b5' }} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card bordered={false}>
                            <Statistic title="일평균 방문" value={(data.dailyPv.length > 0 ? data.dailyPv.reduce((acc, cur) => acc + cur.statsCount, 0) / data.dailyPv.length : 0).toFixed(1)} prefix={<UserOutlined />} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card bordered={false}>
                            <Statistic title="성장률 (전주 대비)" value={12.5} precision={1} valueStyle={{ color: '#3fcf8e' }} prefix={<ArrowUpOutlined />} suffix="%" />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={16}>
                        <Card title="방문자 추이 (Daily PV)">
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <LineChart data={data.dailyPv}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="statsLabel" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="statsCount" stroke="#8884d8" strokeWidth={2} name="PV" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="유입 경로 비중">
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie data={data.refererStats} dataKey="statsCount" nameKey="statsLabel" cx="50%" cy="50%" outerRadius={80} label>
                                            {data.refererStats.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Card title="인기 콘텐츠 TOP 10">
                    <Table columns={popularColumns} dataSource={data.popularContent} rowKey="statsLabel" pagination={false} />
                </Card>
            </Space>
        </div>
    );
};

export default StatsDashboard;
