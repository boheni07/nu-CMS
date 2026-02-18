import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message, Card, Breadcrumb, Tag, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import axios from '../api/axios';

const { Option } = Select;
const { Title } = Typography;

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form] = Form.useForm();
    const [formLoading, setFormLoading] = useState(false);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/cms/category');
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            message.error('카테고리 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAdd = () => {
        setEditingId(null);
        form.resetFields();
        form.setFieldsValue({ useAt: 'Y' });
        setModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingId(record.ctgryId);
        form.setFieldsValue({
            ctgryId: record.ctgryId,
            ctgryNm: record.ctgryNm,
            upperCtgryId: record.upperCtgryId || undefined,
            useAt: record.useAt
        });
        setModalVisible(true);
    };

    const handleDelete = (ctgryId) => {
        Modal.confirm({
            title: '카테고리 삭제',
            content: '정말로 이 카테고리를 삭제하시겠습니까? 하위 카테고리나 연결된 콘텐츠가 있을 경우 오류가 발생할 수 있습니다.',
            okText: '삭제',
            okType: 'danger',
            cancelText: '취소',
            onOk: async () => {
                try {
                    const response = await axios.delete(`/cms/category/${ctgryId}`);
                    if (response.data.success) {
                        message.success('카테고리가 삭제되었습니다.');
                        fetchCategories();
                    } else {
                        message.error(response.data.message || '삭제 실패');
                    }
                } catch (error) {
                    console.error('Delete error:', error);
                    message.error('삭제 중 오류가 발생했습니다.');
                }
            },
        });
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setFormLoading(true);

            let response;
            if (editingId) {
                response = await axios.put(`/cms/category/${editingId}`, values);
            } else {
                response = await axios.post('/cms/category', values);
            }

            if (response.data.success) {
                message.success(editingId ? '수정되었습니다.' : '등록되었습니다.');
                setModalVisible(false);
                fetchCategories();
            } else {
                message.error(response.data.message || '저장 실패');
            }
        } catch (error) {
            console.error('Submit error:', error);
            // 에러 메시지 분석 (GlobalExceptionHandler에서 반환하는 형식 기반)
            const errorMsg = error.response?.data?.message || error.message;
            if (errorMsg && (errorMsg.includes('Duplicate') || errorMsg.includes('ConstraintViolation'))) {
                message.error('이미 존재하는 카테고리 ID입니다. 다른 ID를 입력해주세요.');
            } else {
                message.error('저장 중 오류가 발생했습니다: ' + errorMsg);
            }
        } finally {
            setFormLoading(false);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'ctgryId',
            key: 'ctgryId',
            width: 120,
        },
        {
            title: '카테고리명',
            dataIndex: 'ctgryNm',
            key: 'ctgryNm',
        },
        {
            title: '상위 카테고리',
            dataIndex: 'upperCtgryId',
            key: 'upperCtgryId',
            width: 120,
            render: (id) => id ? <Tag>{id}</Tag> : '-',
        },
        {
            title: '사용여부',
            dataIndex: 'useAt',
            key: 'useAt',
            width: 80,
            align: 'center',
            render: (useAt) => (
                <Tag color={useAt === 'Y' ? 'green' : 'red'}>
                    {useAt === 'Y' ? '사용' : '미사용'}
                </Tag>
            ),
        },
        {
            title: '관리',
            key: 'action',
            width: 150,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>수정</Button>
                    <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.ctgryId)}>삭제</Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Breadcrumb
                items={[
                    { title: 'CMS' },
                    { title: '사이트 관리' },
                    { title: '카테고리 관리' },
                ]}
                style={{ marginBottom: 16 }}
            />

            <Card
                title={<span><ReloadOutlined /> 카테고리 관리</span>}
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        카테고리 등록
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={categories}
                    rowKey="ctgryId"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    size="small"
                />
            </Card>

            <Modal
                title={editingId ? '카테고리 수정' : '카테고리 등록'}
                open={modalVisible}
                onOk={handleOk}
                confirmLoading={formLoading}
                onCancel={() => setModalVisible(false)}
                okText="저장"
                cancelText="취소"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="ctgryId"
                        label="카테고리 ID"
                        rules={[
                            { required: true, message: '카테고리 ID를 입력해주세요.' },
                            { pattern: /^[A-Za-z0-9_]+$/, message: '영문, 숫자, 언더바(_)만 사용 가능합니다.' }
                        ]}
                    >
                        <Input disabled={!!editingId} placeholder="예: NEWS, BLOG" />
                    </Form.Item>

                    <Form.Item
                        name="ctgryNm"
                        label="카테고리명"
                        rules={[{ required: true, message: '카테고리명을 입력해주세요.' }]}
                    >
                        <Input placeholder="카테고리 이름" />
                    </Form.Item>

                    <Form.Item
                        name="upperCtgryId"
                        label="상위 카테고리 (선택)"
                    >
                        <Select allowClear placeholder="상위 카테고리 선택">
                            {categories
                                .filter(c => c.ctgryId !== form.getFieldValue('ctgryId')) // 자기 자신 제외 (간단한 필터링)
                                .map(c => (
                                    <Option key={c.ctgryId} value={c.ctgryId}>{c.ctgryNm} ({c.ctgryId})</Option>
                                ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="useAt"
                        label="사용여부"
                        initialValue="Y"
                        rules={[{ required: true, message: '사용여부를 선택해주세요.' }]}
                    >
                        <Select>
                            <Option value="Y">사용</Option>
                            <Option value="N">미사용</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryManagement;
