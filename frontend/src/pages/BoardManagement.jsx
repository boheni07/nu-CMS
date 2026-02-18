import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, Select, Tag, message, Breadcrumb, Popconfirm } from 'antd';
import { TableOutlined, FileTextOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import CmsService from '../api/services/cms';

import { useNavigate } from 'react-router-dom';

const BoardManagement = () => {
    // State 초기화
    const [masterList, setMasterList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingId, setEditingId] = useState(null); // 수정 중인 ID
    const [form] = Form.useForm();
    const navigate = useNavigate();

    // 초기 데이터 로드
    useEffect(() => {
        fetchMasterList();
    }, []);

    // 게시판 목록 조회
    const fetchMasterList = async () => {
        setLoading(true);
        try {
            const data = await CmsService.board.getMasterList();
            setMasterList(data);
        } catch (error) {
            console.error(error);
            message.error('게시판 목록을 불러오는데 실패했습니다.');
            setMasterList([]);
        } finally {
            setLoading(false);
        }
    };

    // 생성 모달 열기
    const handleCreate = () => {
        setEditingId(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    // 수정 모달 열기
    const handleEdit = (record) => {
        setEditingId(record.bbsId);
        form.setFieldsValue({
            ...record,
            useAt: record.useAt || 'Y',
            bbsTyCode: record.bbsTyCode || 'BBST01'
        });
        setIsModalVisible(true);
    };

    // 게시물 관리 이동
    const handleManage = (record) => {
        // 도메인 분리가 안된 경우 
        navigate(`/board/${record.bbsId}/articles`);
    };

    // 게시판 생성/수정 제출
    const onFinish = async (values) => {
        try {
            let response;
            if (editingId) {
                // 수정
                response = await CmsService.board.updateMaster(editingId, values);
                if (response.data && response.data.success) {
                    message.success('게시판이 수정되었습니다.');
                }
            } else {
                // 생성
                response = await CmsService.board.createMaster(values);
                if (response.data && response.data.success) {
                    message.success('게시판이 생성되었습니다.');
                }
            }

            setIsModalVisible(false);
            fetchMasterList();
        } catch (error) {
            console.error(error);
            const errMsg = error.response?.data?.message || error.message || (editingId ? '게시판 수정에 실패했습니다.' : '게시판 생성에 실패했습니다.');
            message.error(errMsg);
        }
    };

    // 게시판 삭제
    const handleDelete = async (bbsId) => {
        try {
            await CmsService.board.deleteMaster(bbsId);
            message.success('게시판이 삭제되었습니다.');
            fetchMasterList();
        } catch (error) {
            console.error(error);
            message.error('게시판 삭제에 실패했습니다.');
        }
    };

    // 테이블 컬럼 정의
    const columns = [
        {
            title: '게시판 명',
            dataIndex: 'bbsNm',
            key: 'bbsNm',
            ellipsis: true,
            render: (text) => <span style={{ fontWeight: 'bold', fontSize: '1.05em' }}>{text}</span>,
        },
        {
            title: '게시판 ID',
            dataIndex: 'bbsId',
            key: 'bbsId',
            width: 170,
            align: 'center',
            render: (text) => <span style={{ fontFamily: 'monospace', color: '#666' }}>{text}</span>,
        },
        {
            title: '유형',
            dataIndex: 'bbsTyCode',
            key: 'bbsTyCode',
            width: 80,
            align: 'center',
            render: (code) => {
                const typeMap = { 'BBST01': '일반', 'BBST02': '공지' };
                return <Tag color="blue">{typeMap[code] || code}</Tag>;
            }
        },
        {
            title: '사용여부',
            dataIndex: 'useAt',
            key: 'useAt',
            width: 70,
            align: 'center',
            render: (useAt) => {
                const isUse = useAt === 'Y';
                return <Tag color={isUse ? 'green' : 'red'}>{isUse ? '사용' : '미사용'}</Tag>;
            }
        },
        {
            title: '등록일',
            dataIndex: 'frstRegistPnttm',
            key: 'frstRegistPnttm',
            width: 100,
            align: 'center',
            render: (val) => val ? new Date(val).toLocaleDateString() : '-'
        },
        {
            title: '관리',
            key: 'action',
            width: 200,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button icon={<FileTextOutlined />} size="small" onClick={() => handleManage(record)}>관리</Button>
                    <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>수정</Button>
                    <Popconfirm
                        title="게시판 삭제"
                        description="정말로 이 게시판을 삭제하시겠습니까?"
                        onConfirm={() => handleDelete(record.bbsId)}
                        okText="삭제"
                        cancelText="취소"
                    >
                        <Button icon={<DeleteOutlined />} size="small" danger>삭제</Button>
                    </Popconfirm>
                </Space>
            ),
        }
    ];

    return (
        <div>
            <Breadcrumb style={{ marginBottom: 16 }}>
                <Breadcrumb.Item>CMS</Breadcrumb.Item>
                <Breadcrumb.Item>부가 서비스</Breadcrumb.Item>
                <Breadcrumb.Item>게시판 관리</Breadcrumb.Item>
            </Breadcrumb>

            <Card
                title={<span><TableOutlined /> 게시판 마스터 관리</span>}
                extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>새 게시판 생성</Button>}
            >
                <Table
                    columns={columns}
                    dataSource={masterList}
                    rowKey="bbsId"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    size="small"
                    style={{ tableLayout: 'fixed' }}
                />
            </Card>

            <Modal
                title={editingId ? "게시판 수정" : "게시판 생성"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ useAt: 'Y', bbsTyCode: 'BBST01' }}
                >
                    <Form.Item
                        name="bbsNm"
                        label="게시판 명"
                        rules={[{ required: true, message: '게시판 명을 입력하세요.' }]}
                    >
                        <Input placeholder="예: 자유게시판" />
                    </Form.Item>

                    <Form.Item name="bbsTyCode" label="게시판 유형">
                        <Select>
                            <Select.Option value="BBST01">일반게시판</Select.Option>
                            <Select.Option value="BBST02">공지사항</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="bbsIntrcn" label="게시판 소개">
                        <Input.TextArea placeholder="게시판에 대한 설명을 입력하세요" />
                    </Form.Item>

                    <Form.Item name="useAt" label="사용 여부">
                        <Select>
                            <Select.Option value="Y">사용</Select.Option>
                            <Select.Option value="N">미사용</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default BoardManagement;
