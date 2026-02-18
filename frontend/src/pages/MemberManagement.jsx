import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Card, Breadcrumb, message, Modal, Select, Form, Input, Badge } from 'antd';
import { UserOutlined, KeyOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import CmsService from '../api/services/cms';

const { Option } = Select;

const MemberManagement = () => {
    const [members, setMembers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [roleModalVisible, setRoleModalVisible] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchMembers();
        fetchRoles();
    }, []);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const data = await CmsService.member.getList();
            setMembers(data);
        } catch (error) {
            message.error('회원 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const data = await CmsService.role.getList();
            setRoles(data);
        } catch (error) {
            message.error('역할 목록을 불러오는데 실패했습니다.');
        }
    };

    const handleStatusUpdate = async (esntlId, status) => {
        try {
            const response = await CmsService.member.updateStatus(esntlId, status);
            if (response.data.success) {
                message.success('상태가 변경되었습니다.');
                fetchMembers();
            }
        } catch (error) {
            message.error('상태 변경에 실패했습니다.');
        }
    };

    const showRoleModal = async (member) => {
        setSelectedMember(member);
        setRoleModalVisible(true);
        try {
            const data = await CmsService.member.getDetail(member.esntlId);
            if (data) {
                form.setFieldsValue({
                    roleCodes: data.roleList || []
                });
            }
        } catch (error) {
            message.error('권한 정보를 불러오는데 실패했습니다.');
        }
    };

    const handleRoleSave = async (values) => {
        try {
            const response = await CmsService.member.saveRoles(selectedMember.esntlId, values.roleCodes);
            if (response.data.success) {
                message.success('권한이 저장되었습니다.');
                setRoleModalVisible(false);
                fetchMembers();
            }
        } catch (error) {
            message.error('권한 저장에 실패했습니다.');
        }
    };

    const columns = [
        {
            title: '고유 ID',
            dataIndex: 'esntlId',
            key: 'esntlId',
            width: 120,
            align: 'center',
            ellipsis: true,
        },
        {
            title: '회원 ID',
            dataIndex: 'mberId',
            key: 'mberId',
            width: 100,
            align: 'center',
            render: (text) => <b>{text}</b>,
        },
        {
            title: '이름',
            dataIndex: 'mberNm',
            key: 'mberNm',
            width: 90,
            align: 'center',
        },
        {
            title: '이메일',
            dataIndex: 'emailAdres',
            key: 'emailAdres',
            ellipsis: true,
        },
        {
            title: '상태',
            dataIndex: 'mberSttusCode',
            key: 'mberSttusCode',
            width: 80,
            align: 'center',
            render: (code) => {
                const statusMap = {
                    'A': { text: '정상', color: 'success' },
                    'P': { text: '잠금', color: 'warning' },
                    'D': { text: '탈퇴', color: 'error' },
                    'R': { text: '승인대기', color: 'default' },
                };
                const status = statusMap[code] || { text: code, color: 'default' };
                return <Badge status={status.color} text={status.text} />;
            },
        },
        {
            title: '가입일',
            dataIndex: 'frstRegistPnttm',
            key: 'frstRegistPnttm',
            width: 120,
            align: 'center',
            render: (date) => date ? new Date(date).toLocaleDateString() : '-',
        },
        {
            title: '관리',
            key: 'action',
            width: 180,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        size="small"
                        icon={<KeyOutlined />}
                        onClick={() => showRoleModal(record)}
                    >
                        권한
                    </Button>
                    {record.mberSttusCode === 'A' ? (
                        <Button
                            size="small"
                            danger
                            icon={<StopOutlined />}
                            onClick={() => handleStatusUpdate(record.esntlId, 'P')}
                        >
                            잠금
                        </Button>
                    ) : (
                        <Button
                            size="small"
                            type="primary"
                            ghost
                            icon={<CheckCircleOutlined />}
                            onClick={() => handleStatusUpdate(record.esntlId, 'A')}
                        >
                            복구
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Breadcrumb style={{ marginBottom: 16 }}>
                <Breadcrumb.Item>CMS</Breadcrumb.Item>
                <Breadcrumb.Item>사용자 및 권한</Breadcrumb.Item>
                <Breadcrumb.Item>회원 관리</Breadcrumb.Item>
            </Breadcrumb>

            <Card
                title={<span><UserOutlined /> 회원 관리</span>}
                extra={<Button type="primary" onClick={fetchMembers}>새로고침</Button>}
            >
                <Table
                    columns={columns}
                    dataSource={members}
                    rowKey="esntlId"
                    loading={loading}
                    size="small"
                    style={{ tableLayout: 'fixed' }}
                />
            </Card>

            <Modal
                title={`권한 설정 - ${selectedMember?.mberId} (${selectedMember?.mberNm})`}
                open={roleModalVisible}
                onOk={() => form.submit()}
                onCancel={() => setRoleModalVisible(false)}
                destroyOnClose
            >
                <Form form={form} onFinish={handleRoleSave} layout="vertical">
                    <Form.Item
                        name="roleCodes"
                        label="부여할 역할 선택"
                        rules={[{ required: true, message: '하나 이상의 역할을 선택하세요.' }]}
                    >
                        <Select mode="multiple" placeholder="역할을 선택하세요" style={{ width: '100%' }}>
                            {roles.map(role => (
                                <Option key={role.roleCode} value={role.roleCode}>
                                    {role.roleNm} ({role.roleCode})
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default MemberManagement;
