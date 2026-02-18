import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Card, Breadcrumb, message, Tag, Modal, Form, Input, Select, Divider } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import CmsService from '../api/services/cms';

const { Option } = Select;

const WidgetManagement = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingWidget, setEditingWidget] = useState(null);
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const list = await CmsService.widget.getList();
            setData(list);
        } catch (error) {
            console.error(error);
            const errMsg = error.response?.data?.message || '위젯 목록을 불러오는데 실패했습니다.';
            message.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const showModal = (widget = null) => {
        setEditingWidget(widget);
        if (widget) {
            form.setFieldsValue(widget);
        } else {
            form.resetFields();
            form.setFieldsValue({ useAt: 'Y', widgetTyCode: 'BANNER' });
        }
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            if (editingWidget) {
                await CmsService.widget.update(editingWidget.widgetId, values);
                message.success('위젯이 수정되었습니다.');
            } else {
                // ID는 백엔드에서 생성하므로 전송하지 않음
                await CmsService.widget.create(values);
                message.success('신규 위젯이 등록되었습니다.');
            }

            setIsModalVisible(false);
            fetchData();
        } catch (error) {
            console.error(error);
            const errMsg = error.response?.data?.message || error.message || '저장에 실패했습니다.';
            message.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: '위젯 삭제',
            content: '정말 이 위젯을 삭제하시겠습니까? 연결된 레이아웃에서 제거됩니다.',
            okText: '삭제',
            okType: 'danger',
            onOk: async () => {
                try {
                    await CmsService.widget.delete(id);
                    message.success('삭제되었습니다.');
                    fetchData();
                } catch (error) {
                    message.error('삭제에 실패했습니다.');
                }
            }
        });
    };

    const columns = [
        {
            title: '위젯 ID',
            dataIndex: 'widgetId',
            key: 'widgetId',
            width: 140,
            align: 'center',
        },
        {
            title: '위젯 명',
            dataIndex: 'widgetNm',
            key: 'widgetNm',
            ellipsis: true,
        },
        {
            title: '유형',
            dataIndex: 'widgetTyCode',
            key: 'widgetTyCode',
            width: 100,
            align: 'center',
            render: (type) => {
                const types = {
                    'BANNER': { color: 'cyan', text: '배너' },
                    'POPUP': { color: 'purple', text: '팝업' },
                    'QUICK': { color: 'orange', text: '퀵메뉴' },
                };
                const t = types[type] || { color: 'default', text: type };
                return <Tag color={t.color}>{t.text}</Tag>;
            }
        },
        {
            title: '사용여부',
            dataIndex: 'useAt',
            key: 'useAt',
            width: 80,
            align: 'center',
            render: (use) => <Tag color={use === 'Y' ? 'green' : 'red'}>{use === 'Y' ? '사용' : '미사용'}</Tag>,
        },
        {
            title: '등록일',
            dataIndex: 'frstRegistPnttm',
            key: 'frstRegistPnttm',
            width: 120,
            align: 'center',
            render: (val) => val ? new Date(val).toLocaleDateString() : '-'
        },
        {
            title: '관리',
            key: 'action',
            width: 150,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button icon={<EditOutlined />} size="small" onClick={() => showModal(record)}>수정</Button>
                    <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record.widgetId)}>삭제</Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Breadcrumb style={{ marginBottom: 16 }}>
                <Breadcrumb.Item>CMS</Breadcrumb.Item>
                <Breadcrumb.Item>사이트 관리</Breadcrumb.Item>
                <Breadcrumb.Item>위젯 관리</Breadcrumb.Item>
            </Breadcrumb>

            <Card
                title="위젯 관리"
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                        신규 위젯 생성
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="widgetId"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    size="small"
                    style={{ tableLayout: 'fixed' }}
                />
            </Card>

            <Modal
                title={editingWidget ? "위젯 정보 수정" : "신규 위젯 등록"}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                confirmLoading={loading}
                width={700}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ useAt: 'Y', widgetTyCode: 'BANNER' }}
                >
                    <Form.Item
                        name="widgetNm"
                        label="위젯 명"
                        rules={[{ required: true, message: '위젯명을 입력하세요.' }]}
                    >
                        <Input placeholder="실제 관리용 이름 (예: 메인 상단 배너)" />
                    </Form.Item>

                    <Form.Item name="widgetTyCode" label="위젯 유형" rules={[{ required: true }]}>
                        <Select>
                            <Option value="BANNER">배너 (이미지/링크)</Option>
                            <Option value="POPUP">공지 팝업</Option>
                            <Option value="QUICK">퀵메뉴 (사이드바 고정)</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="widgetCn" label="위젯 설정 (JSON)">
                        <Input.TextArea
                            rows={6}
                            placeholder='예: {"imgUrl": "/uploads/banner.jpg", "link": "/notice", "target": "_self"}'
                        />
                        <div style={{ marginTop: 5, color: '#888', fontSize: '12px' }}>
                            ※ JSON 형식으로 이미지 경로, 링크 등을 설정합니다.
                        </div>
                    </Form.Item>

                    <Form.Item name="useAt" label="사용 여부">
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

export default WidgetManagement;
