import React, { useState, useEffect } from 'react';
import { Table, Card, Breadcrumb, message, Input, Space, Button, Typography, Tag, Tabs, Modal, Descriptions } from 'antd';
import { HistoryOutlined, SearchOutlined, ReloadOutlined, EyeOutlined, SwapOutlined } from '@ant-design/icons';
import axios from '../api/axios';

const { Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const AuditLogList = () => {
    // Access Log State
    const [accessLogs, setAccessLogs] = useState([]);
    const [accessLoading, setAccessLoading] = useState(false);
    const [accessSearchText, setAccessSearchText] = useState('');

    // Data Audit Log State
    const [auditLogs, setAuditLogs] = useState([]);
    const [auditLoading, setAuditLoading] = useState(false);
    const [auditSearchText, setAuditSearchText] = useState('');

    // Modal State
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);

    useEffect(() => {
        fetchAccessLogs();
        fetchAuditLogs();
    }, []);

    // --- Access Log Functions ---
    const fetchAccessLogs = async (params = {}) => {
        setAccessLoading(true);
        try {
            const response = await axios.get('/api/cms/access-log', { params });
            if (response.data.success) {
                setAccessLogs(response.data.data);
            }
        } catch (error) {
            // message.error('접속 로그 조회 실패');
            console.error(error);
        } finally {
            setAccessLoading(false);
        }
    };

    const handleAccessSearch = () => {
        fetchAccessLogs({ mberNm: accessSearchText });
    };

    const accessColumns = [
        { title: 'No', dataIndex: 'logId', key: 'logId', width: 70, sorter: (a, b) => b.logId - a.logId },
        { title: '일시', dataIndex: 'creatPnttm', key: 'creatPnttm', width: 160, render: (date) => new Date(date).toLocaleString() },
        { title: '수행자', dataIndex: 'mberNm', key: 'mberNm', render: (text, record) => <span>{text || '비회원'} <Text type="secondary" style={{ fontSize: '11px' }}>({record.esntlId || '-'})</Text></span> },
        { title: 'IP', dataIndex: 'conectIp', key: 'conectIp', width: 120 },
        { title: 'Method', dataIndex: 'conectMethod', key: 'conectMethod', width: 90, render: (method) => <Tag color={method === 'POST' ? 'green' : method === 'DELETE' ? 'red' : 'blue'}>{method}</Tag> },
        { title: 'URL', dataIndex: 'conectUrl', key: 'conectUrl', ellipsis: true },
    ];

    // --- Data Audit Log Functions ---
    const fetchAuditLogs = async (params = {}) => {
        setAuditLoading(true);
        try {
            const response = await axios.get('/api/cms/audit-log', { params });
            if (response.data.success) {
                setAuditLogs(response.data.data);
            }
        } catch (error) {
            console.error('감사 로그 조회 실패', error);
        } finally {
            setAuditLoading(false);
        }
    };

    const handleAuditSearch = () => {
        fetchAuditLogs({ searchKeyword: auditSearchText });
    };

    const showAuditDetail = (record) => {
        setSelectedLog(record);
        setIsModalVisible(true);
    };

    const auditColumns = [
        { title: 'No', dataIndex: 'logId', width: 70, sorter: (a, b) => b.logId - a.logId },
        { title: '일시', dataIndex: 'creatDt', width: 160, render: (date) => new Date(date).toLocaleString() },
        {
            title: '행위', dataIndex: 'actionTy', width: 90, render: (val) => {
                let color = 'blue';
                if (val === 'INSERT') color = 'green';
                if (val === 'UPDATE') color = 'orange';
                if (val === 'DELETE') color = 'red';
                return <Tag color={color}>{val}</Tag>;
            }
        },
        { title: '대상 메뉴', dataIndex: 'menuId', width: 120 },
        { title: '대상 데이터', dataIndex: 'targetNm', ellipsis: true, render: (text, record) => <span>{text} <Text type="secondary" style={{ fontSize: '11px' }}>({record.targetId})</Text></span> },
        { title: '수행자', dataIndex: 'userNm', width: 100, render: (text, record) => <span>{text}<br /><Text type="secondary" style={{ fontSize: '10px' }}>{record.clientIp}</Text></span> },
        { title: '보기', width: 70, align: 'center', render: (_, record) => <Button size="small" icon={<EyeOutlined />} onClick={() => showAuditDetail(record)} /> },
    ];

    return (
        <div>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>CMS</Breadcrumb.Item>
                <Breadcrumb.Item>기본 설정</Breadcrumb.Item>
                <Breadcrumb.Item>통합 감사 로그</Breadcrumb.Item>
            </Breadcrumb>

            <Card className="audit-card">
                <Tabs defaultActiveKey="2" type="card">
                    <TabPane tab={<span><HistoryOutlined /> 데이터 변경 이력</span>} key="2">
                        <Space style={{ marginBottom: 16 }}>
                            <Input
                                placeholder="데이터명 또는 수행자 검색"
                                value={auditSearchText}
                                onChange={e => setAuditSearchText(e.target.value)}
                                onPressEnter={handleAuditSearch}
                                style={{ width: 250 }}
                                prefix={<SearchOutlined />}
                            />
                            <Button type="primary" onClick={handleAuditSearch}>검색</Button>
                            <Button icon={<ReloadOutlined />} onClick={() => { setAuditSearchText(''); fetchAuditLogs(); }} />
                        </Space>
                        <Table
                            columns={auditColumns}
                            dataSource={auditLogs}
                            rowKey="logId"
                            loading={auditLoading}
                            pagination={{ pageSize: 15 }}
                            size="small"
                        />
                    </TabPane>

                    <TabPane tab={<span><SwapOutlined /> 접속 로그 (Access Log)</span>} key="1">
                        <Space style={{ marginBottom: 16 }}>
                            <Input
                                placeholder="수행자 이름 입력"
                                value={accessSearchText}
                                onChange={e => setAccessSearchText(e.target.value)}
                                onPressEnter={handleAccessSearch}
                                style={{ width: 200 }}
                            />
                            <Button type="primary" onClick={handleAccessSearch}>검색</Button>
                            <Button icon={<ReloadOutlined />} onClick={() => { setAccessSearchText(''); fetchAccessLogs(); }} />
                        </Space>
                        <Table
                            columns={accessColumns}
                            dataSource={accessLogs}
                            rowKey="logId"
                            loading={accessLoading}
                            pagination={{ pageSize: 15 }}
                            size="small"
                        />
                    </TabPane>
                </Tabs>
            </Card>

            <Modal
                title={`[${selectedLog?.actionTy}] 데이터 변경 상세`}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[<Button key="close" onClick={() => setIsModalVisible(false)}>닫기</Button>]}
                width={800}
            >
                {selectedLog && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <Tag color="default">변경 전 (Before)</Tag>
                            <Card size="small" style={{ marginTop: 8, backgroundColor: '#f5f5f5', height: '300px', overflow: 'auto' }}>
                                <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                                    {selectedLog.beforeVal ? JSON.stringify(JSON.parse(selectedLog.beforeVal), null, 2) : '(없음)'}
                                </pre>
                            </Card>
                        </div>
                        <div style={{ flex: 1 }}>
                            <Tag color="blue">변경 후 (After)</Tag>
                            <Card size="small" style={{ marginTop: 8, backgroundColor: '#e6f7ff', height: '300px', overflow: 'auto' }}>
                                <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                                    {selectedLog.afterVal ? JSON.stringify(JSON.parse(selectedLog.afterVal), null, 2) : '(없음)'}
                                </pre>
                            </Card>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AuditLogList;
