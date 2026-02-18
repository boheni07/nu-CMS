import React, { useState, useEffect } from 'react';
import { Table, Tabs, Tag, Button, Card, Breadcrumb, message, Modal, Input, Space, Badge } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import axios from '../api/axios'; // Direct axios for now, or update cms.js

const { TextArea } = Input;

const WorkflowDashboard = () => {
    const [activeTab, setActiveTab] = useState('REQUESTED');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentAction, setCurrentAction] = useState(null); // 'APPROVE' or 'REJECT'
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [comment, setComment] = useState('');

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 탭에 따라 status 필터링 (REQUESTED vs 그 외)
            const params = {};
            if (activeTab === 'REQUESTED') {
                params.status = 'REQUESTED';
            } else {
                // 처리 내역은 APPROVED, REJECTED 등을 모두 포함해야 함.
                // 다만 현재 API 스펙상 status 하나만 받으므로, 클라이언트 필터링 또는 API 개선 필요.
                // 우선 전체 조회를 위해 params 비움 (API가 status 없으면 전체 조회한다고 가정)
                // 만약 'REQUESTED'가 아닌 것만 가져오려면 백엔드 수정 필요.
                // 여기서는 UI에서 필터링하거나, 백엔드에 'completed=true' 같은 파라미터를 추가하는게 좋음.
                // 임시로 'APPROVED'만 조회하거나, 전체 조회 후 필터링.
            }

            const response = await axios.get('/cms/workflow/request', { params });
            if (response.data.success) {
                let list = response.data.data;
                if (activeTab === 'HISTORY') {
                    list = list.filter(item => item.status !== 'REQUESTED');
                } else {
                    list = list.filter(item => item.status === 'REQUESTED');
                }
                setData(list);
            }
        } catch (error) {
            message.error('데이터를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = (record, action) => {
        setSelectedRequest(record);
        setCurrentAction(action);
        setComment('');
        setModalVisible(true);
    };

    const submitAction = async () => {
        if (!comment.trim()) {
            message.warning('처리 사유(코멘트)를 입력해주세요.');
            return;
        }

        try {
            const url = `/cms/workflow/${selectedRequest.reqId}/${currentAction === 'APPROVE' ? 'approve' : 'reject'}`;
            const response = await axios.post(url, { actionMsg: comment });

            if (response.data.success) {
                message.success('처리되었습니다.');
                setModalVisible(false);
                fetchData();
            }
        } catch (error) {
            message.error('처리에 실패했습니다.');
        }
    };

    const columns = [
        {
            title: '요청 ID',
            dataIndex: 'reqId',
            width: 120,
        },
        {
            title: '구분',
            dataIndex: 'targetType',
            width: 90,
            render: (text) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: '제목',
            dataIndex: 'reqSj',
            ellipsis: true,
        },
        {
            title: '요청자',
            dataIndex: 'reqUserNm',
            width: 90,
            align: 'center',
        },
        {
            title: '요청일시',
            dataIndex: 'reqDt',
            width: 140,
            align: 'center',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: '상태',
            dataIndex: 'status',
            width: 90,
            align: 'center',
            render: (status) => {
                let color = 'default';
                let icon = <ClockCircleOutlined />;
                if (status === 'APPROVED') { color = 'success'; icon = <CheckCircleOutlined />; }
                if (status === 'REJECTED') { color = 'error'; icon = <CloseCircleOutlined />; }
                return <Tag icon={icon} color={color}>{status}</Tag>;
            },
        },
    ];

    if (activeTab === 'HISTORY') {
        columns.push(
            {
                title: '처리자',
                dataIndex: 'processUserNm',
                width: 90,
                align: 'center',
            },
            {
                title: '처리일시',
                dataIndex: 'processDt',
                width: 140,
                align: 'center',
                render: (date) => date ? new Date(date).toLocaleString() : '-',
            }
        );
    } else {
        columns.push({
            title: '관리',
            key: 'action',
            width: 150,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        size="small"
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleAction(record, 'APPROVE')}
                    >
                        승인
                    </Button>
                    <Button
                        danger
                        size="small"
                        icon={<CloseCircleOutlined />}
                        onClick={() => handleAction(record, 'REJECT')}
                    >
                        반려
                    </Button>
                </Space>
            ),
        });
    }

    return (
        <div>
            <Breadcrumb style={{ marginBottom: 16 }}>
                <Breadcrumb.Item>CMS</Breadcrumb.Item>
                <Breadcrumb.Item>운영 관리</Breadcrumb.Item>
                <Breadcrumb.Item>승인 워크플로우</Breadcrumb.Item>
            </Breadcrumb>

            <Card title={<span><SafetyCertificateOutlined /> 승인 대시보드</span>}>
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        { key: 'REQUESTED', label: <span><ClockCircleOutlined /> 승인 대기</span> },
                        { key: 'HISTORY', label: <span><CheckCircleOutlined /> 처리 내역</span> },
                    ]}
                />

                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="reqId"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    size="small"
                    style={{ tableLayout: 'fixed' }}
                />
            </Card>

            <Modal
                title={currentAction === 'APPROVE' ? '승인 처리' : '반려 처리'}
                open={modalVisible}
                onOk={submitAction}
                onCancel={() => setModalVisible(false)}
                okText="확인"
                cancelText="취소"
                okButtonProps={{ danger: currentAction === 'REJECT' }}
            >
                <p><strong>{selectedRequest?.reqSj}</strong> 요청을 {currentAction === 'APPROVE' ? '승인' : '반려'}하시겠습니까?</p>
                <TextArea
                    rows={4}
                    placeholder="처리 사유(코멘트)를 입력하세요."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default WorkflowDashboard;
