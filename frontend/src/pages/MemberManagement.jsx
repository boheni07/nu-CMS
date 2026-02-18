import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Card, Breadcrumb, message, Modal, Select, Form, Input, Badge } from 'antd';
import { UserOutlined, KeyOutlined, StopOutlined, CheckCircleOutlined, PlusOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import CmsService from '../api/services/cms';

const { Option } = Select;

const MemberManagement = () => {
    const [members, setMembers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);

    // 권한 관리 모달 상태
    const [roleModalVisible, setRoleModalVisible] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [roleForm] = Form.useForm();

    // 회원 등록/수정 모달 상태
    const [memberModalVisible, setMemberModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [memberForm] = Form.useForm();

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

    // ========================================================================
    // 권한(Role) 관리
    // ========================================================================
    const showRoleModal = async (member) => {
        setSelectedMember(member);
        setRoleModalVisible(true);
        try {
            const data = await CmsService.member.getDetail(member.esntlId);
            if (data) {
                roleForm.setFieldsValue({
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

    // ========================================================================
    // 회원 등록/수정
    // ========================================================================
    const showCreateModal = () => {
        setIsEdit(false);
        setSelectedMember(null);
        memberForm.resetFields();
        setMemberModalVisible(true);
    };

    const showEditModal = (member) => {
        setIsEdit(true);
        setSelectedMember(member);
        memberForm.setFieldsValue({
            mberId: member.mberId,
            mberNm: member.mberNm,
            emailAdres: member.emailAdres,
            mbtlnum: member.mbtlnum,
            mberSttusCode: member.mberSttusCode,
            password: '', // 비밀번호는 수정 시 비워둠 (입력 시 변경)
        });
        setMemberModalVisible(true);
    };

    const handleMemberSubmit = async (values) => {
        try {
            if (isEdit) {
                await CmsService.member.update(selectedMember.esntlId, values);
                message.success('회원 정보가 수정되었습니다.');
            } else {
                await CmsService.member.regist(values);
                message.success('신규 회원이 등록되었습니다.');
            }
            setMemberModalVisible(false);
            fetchMembers();
        } catch (error) {
            console.error(error);
            message.error(error.response?.data?.message || '저장에 실패했습니다.');
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
            title: '역할',
            dataIndex: 'roleNms',
            key: 'roleNms',
            width: 150,
            ellipsis: true,
            render: (text) => text ? (
                <Space size={0} wrap>
                    {text.split(', ').map((role, index) => (
                        <Tag key={index} color="blue">{role}</Tag>
                    ))}
                </Space>
            ) : <span style={{ color: '#ccc' }}>-</span>,
        },
        {
            title: '휴대폰',
            dataIndex: 'mbtlnum',
            key: 'mbtlnum',
            width: 120,
            align: 'center',
            render: (text) => text || '-',
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
            width: 100,
            align: 'center',
            render: (date) => date ? new Date(date).toLocaleDateString() : '-',
        },
        {
            title: '관리',
            key: 'action',
            width: 200,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button size="small" icon={<EditOutlined />} onClick={() => showEditModal(record)}>
                        수정
                    </Button>
                    <Button size="small" icon={<KeyOutlined />} onClick={() => showRoleModal(record)}>
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
                extra={
                    <Space>
                        <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal}>신규 회원</Button>
                        <Button icon={<ReloadOutlined />} onClick={fetchMembers}>새로고침</Button>
                    </Space>
                }
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

            {/* 권한 설정 모달 */}
            <Modal
                title={`권한 설정 - ${selectedMember?.mberId}`}
                open={roleModalVisible}
                onOk={() => roleForm.submit()}
                onCancel={() => setRoleModalVisible(false)}
                destroyOnClose
            >
                <Form form={roleForm} onFinish={handleRoleSave} layout="vertical">
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

            {/* 회원 등록/수정 모달 */}
            <Modal
                title={isEdit ? '회원 정보 수정' : '신규 회원 등록'}
                open={memberModalVisible}
                onOk={() => memberForm.submit()}
                onCancel={() => setMemberModalVisible(false)}
                destroyOnClose
            >
                <Form form={memberForm} onFinish={handleMemberSubmit} layout="vertical">
                    <Form.Item
                        name="mberId"
                        label="회원 ID"
                        rules={[{ required: true, message: '아이디를 입력하세요.' }]}
                    >
                        <Input disabled={isEdit} placeholder="아이디 입력" />
                    </Form.Item>

                    <Form.Item
                        name="mberNm"
                        label="이름"
                        rules={[{ required: true, message: '이름을 입력하세요.' }]}
                    >
                        <Input placeholder="이름 입력" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label={isEdit ? "비밀번호 (변경 시에만 입력)" : "비밀번호"}
                        rules={[{ required: !isEdit, message: '비밀번호를 입력하세요.' }]}
                    >
                        <Input.Password placeholder="비밀번호 입력" />
                    </Form.Item>

                    <Form.Item
                        name="emailAdres"
                        label="이메일"
                        rules={[
                            { required: true, message: '이메일을 입력하세요.' },
                            { type: 'email', message: '유효한 이메일 형식이 아닙니다.' }
                        ]}
                    >
                        <Input placeholder="example@nucms.com" />
                    </Form.Item>

                    <Form.Item name="mbtlnum" label="휴대폰 번호">
                        <Input placeholder="010-0000-0000" />
                    </Form.Item>

                    <Form.Item name="mberSttusCode" label="상태" initialValue="A">
                        <Select>
                            <Option value="A">정상</Option>
                            <Option value="R">승인대기</Option>
                            <Option value="P">잠금</Option>
                            <Option value="D">탈퇴</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default MemberManagement;
