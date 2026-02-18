import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Breadcrumb, message, Modal, Form, Input, Tree, Row, Col, Divider, Space } from 'antd';
import { SafetyCertificateOutlined, PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import CmsService from '../api/services/cms';

const RoleManagement = () => {
    const [roles, setRoles] = useState([]);
    const [menuTree, setMenuTree] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [checkedMenuKeys, setCheckedMenuKeys] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchRoles();
        fetchMenuTree();
    }, []);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const data = await CmsService.role.getList();
            setRoles(data);
        } catch (error) {
            message.error('역할 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const fetchMenuTree = async () => {
        try {
            const data = await CmsService.role.getMenuTree();
            setMenuTree(formatTreeData(data));
        } catch (error) {
            message.error('메뉴 트리를 불러오는데 실패했습니다.');
        }
    };

    const formatTreeData = (nodes) => {
        if (!nodes) return [];
        return nodes.map(node => ({
            title: node.menuNm,
            key: node.menuId,
            children: node.children ? formatTreeData(node.children) : []
        }));
    };

    const handleRoleSelect = async (role) => {
        setSelectedRole(role);
        try {
            const data = await CmsService.role.getRoleMenus(role.roleCode);
            setCheckedMenuKeys(data);
        } catch (error) {
            message.error('메뉴 권한 정보를 불러오는데 실패했습니다.');
        }
    };

    const handleSavePermissions = async () => {
        if (!selectedRole) return;
        try {
            const response = await CmsService.role.saveRoleMenus(selectedRole.roleCode, checkedMenuKeys);
            if (response.data.success) {
                message.success('메뉴 권한이 저장되었습니다.');
            }
        } catch (error) {
            message.error('권한 저장에 실패했습니다.');
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            let response;

            // For simplicity in this mockup, we only handle Add/Edit via a shared logic
            if (selectedRole && modalVisible && form.getFieldValue('isEdit')) {
                response = await CmsService.role.update(selectedRole.roleCode, values);
            } else {
                response = await CmsService.role.create(values);
            }

            if (response.data.success) {
                message.success('저장되었습니다.');
                setModalVisible(false);
                fetchRoles();
            }
        } catch (error) {
            message.error('저장에 실패했습니다.');
        }
    };

    const showAddModal = () => {
        setSelectedRole(null);
        form.resetFields();
        form.setFieldsValue({ isEdit: false, useAt: 'Y' });
        setModalVisible(true);
    };

    const showEditModal = (role) => {
        setSelectedRole(role);
        form.setFieldsValue({ ...role, isEdit: true });
        setModalVisible(true);
    };

    const columns = [
        {
            title: '역할 코드',
            dataIndex: 'roleCode',
            key: 'roleCode',
            width: 120,
            align: 'center',
            render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
        },
        {
            title: '역할 명',
            dataIndex: 'roleNm',
            key: 'roleNm',
            width: 120,
            align: 'center',
        },
        {
            title: '설명',
            dataIndex: 'roleDc',
            key: 'roleDc',
            ellipsis: true,
        },
        {
            title: '작업',
            key: 'action',
            width: 150,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button size="small" icon={<EditOutlined />} onClick={() => showEditModal(record)}>수정</Button>
                    <Button size="small" type="primary" ghost icon={<SafetyCertificateOutlined />} onClick={() => handleRoleSelect(record)}>권한 설정</Button>
                </Space>
            )
        },
    ];

    return (
        <div>
            <Breadcrumb style={{ marginBottom: 16 }}>
                <Breadcrumb.Item>CMS</Breadcrumb.Item>
                <Breadcrumb.Item>사용자 및 권한</Breadcrumb.Item>
                <Breadcrumb.Item>역할 관리</Breadcrumb.Item>
            </Breadcrumb>

            <Row gutter={0}>
                <Col span={14} style={{ paddingRight: 12 }}>
                    <Card
                        title={<span><SafetyCertificateOutlined /> 역할 목록</span>}
                        extra={<Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>역할 추가</Button>}
                    >
                        <Table
                            columns={columns}
                            dataSource={roles}
                            rowKey="roleCode"
                            loading={loading}
                            onRow={(record) => ({
                                onClick: () => handleRoleSelect(record),
                                style: { cursor: 'pointer', background: selectedRole?.roleCode === record.roleCode ? '#e6f7ff' : 'inherit' }
                            })}
                            size="small"
                            style={{ tableLayout: 'fixed' }}
                        />
                    </Card>
                </Col>
                <Col span={10} style={{ paddingLeft: 12 }}>
                    <Card
                        title={<span><EditOutlined /> 메뉴 접근 권한 설정</span>}
                        extra={
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={handleSavePermissions}
                                disabled={!selectedRole}
                            >
                                권한 저장
                            </Button>
                        }
                    >
                        {selectedRole ? (
                            <>
                                <div style={{ marginBottom: 16 }}>
                                    선택된 역할: <b>{selectedRole.roleNm} ({selectedRole.roleCode})</b>
                                </div>
                                <Divider />
                                <Tree
                                    checkable
                                    onCheck={(keys) => setCheckedMenuKeys(keys)}
                                    checkedKeys={checkedMenuKeys}
                                    treeData={menuTree}
                                    defaultExpandAll
                                />
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                                역할을 선택하여 메뉴 권한을 설정하세요.
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>

            <Modal
                title={selectedRole ? "역할 수정" : "역할 등록"}
                open={modalVisible}
                onOk={handleModalOk}
                onCancel={() => setModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="isEdit" hidden><Input /></Form.Item>
                    <Form.Item
                        name="roleCode"
                        label="역할 코드"
                        rules={[{ required: true, message: '역할 코드를 입력하세요.' }]}
                    >
                        <Input disabled={form.getFieldValue('isEdit')} placeholder="예: ROLE_MANAGER" />
                    </Form.Item>
                    <Form.Item
                        name="roleNm"
                        label="역할 명"
                        rules={[{ required: true, message: '역할 명을 입력하세요.' }]}
                    >
                        <Input placeholder="예: 부서 운영자" />
                    </Form.Item>
                    <Form.Item name="roleDc" label="역할 설명">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default RoleManagement;
