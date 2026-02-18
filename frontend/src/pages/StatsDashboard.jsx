import React, { useState, useEffect } from 'react';
import {
    Layout, Card, Row, Col, DatePicker, Table, Statistic
} from 'antd';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line
} from 'recharts';
import { ArrowUpOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons';
import axios from '../api/axios';
import dayjs from 'dayjs';

const { Content } = Layout;
const { RangePicker } = DatePicker;

const StatsDashboard = () => {
    const [dailyStats, setDailyStats] = useState([]);
    const [menuStats, setMenuStats] = useState([]);
    const [dateRange, setDateRange] = useState([
        dayjs().subtract(30, 'day'),
        dayjs()
    ]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchStats();
    }, [dateRange]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const startDate = dateRange[0].format('YYYYMMDD');
            const endDate = dateRange[1].format('YYYYMMDD');

            const [dailyRes, menuRes] = await Promise.all([
                axios.get('/cms/stats/daily', { params: { startDate, endDate } }),
                axios.get('/cms/stats/menu', { params: { startDate, endDate } })
            ]);

            if (dailyRes.data.success) setDailyStats(dailyRes.data.data);
            if (menuRes.data.success) setMenuStats(menuRes.data.data);
        } catch (error) {
            console.error("Failed to fetch stats", error);
        } finally {
            setLoading(false);
        }
    };

    // 요약 데이터 계산
    const totalPv = dailyStats.reduce((sum, item) => sum + item.pvCount, 0);
    const totalUv = dailyStats.reduce((sum, item) => sum + item.userCount, 0);

    const menuColumns = [
        {
            title: 'URL',
            dataIndex: 'conectUrl',
            key: 'conectUrl',
        },
        {
            title: '조회수',
            dataIndex: 'pvCount',
            key: 'pvCount',
            sorter: (a, b) => a.pvCount - b.pvCount,
        },
    ];

    return (
        <Layout style={{ padding: '24px', background: '#f0f2f5' }}>
            <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>방문자 통계</h2>
                <RangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    style={{ width: 300 }}
                />
            </div>

            <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col span={12}>
                    <Card>
                        <Statistic
                            title="총 페이지 뷰 (PV)"
                            value={totalPv}
                            prefix={<EyeOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card>
                        <Statistic
                            title="총 방문자 수 (UV)"
                            value={totalUv}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col span={24}>
                    <Card title="일별 방문 추이" loading={loading}>
                        <div style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={dailyStats}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="conectDe" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="pvCount" name="페이지 뷰" fill="#8884d8" />
                                    <Bar dataKey="userCount" name="방문자 수" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={24}>
                    <Card title="인기 메뉴 (Top 10)" loading={loading}>
                        <Table
                            dataSource={menuStats}
                            columns={menuColumns}
                            rowKey="conectUrl"
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
            </Row>
        </Layout>
    );
};

export default StatsDashboard;
