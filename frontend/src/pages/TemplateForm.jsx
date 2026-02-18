import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Card, Breadcrumb, message, Space, Divider, Row, Col, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined, LayoutOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axios';

const { Option } = Select;
const { Title, Text } = Typography;

const TemplateForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [widgets, setWidgets] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    useEffect(() => {
        fetchWidgets();
        if (isEdit) {
            loadDetail();
        }
    }, [id]);

    const fetchWidgets = async () => {
        try {
            const response = await axios.get('/cms/widget');
            if (response.data.success) {
                setWidgets(response.data.data);
            }
        } catch (error) {
            message.error('위젯 목록을 불러오는데 실패했습니다.');
        }
    };

    const loadDetail = async () => {
        try {
            const tmplatRes = await axios.get(`/cms/template/${id}`);
            const layoutRes = await axios.get(`/cms/layout-config/${id}`);

            if (tmplatRes.data.success) {
                const data = {
                    ...tmplatRes.data.data,
                    layoutConfigs: layoutRes.data.data || []
                };
                form.setFieldsValue(data);
            }
        } catch (error) {
            message.error('데이터를 불러오는데 실패했습니다.');
        }
    };

    const onFinish = async (values) => {
        const { layoutConfigs, ...tmplatData } = values;
        setLoading(true);
        try {
            // 1. 템플릿 기본 정보 저장
            let tmplatRes;
            if (isEdit) {
                tmplatRes = await axios.put(`/cms/template/${id}`, tmplatData);
            } else {
                tmplatRes = await axios.post('/cms/template', tmplatData);
            }

            // 2. 레이아웃 설정 일괄 저장 (템플릿 ID가 확정된 후)
            const targetId = isEdit ? id : tmplatData.tmplatId;
            if (tmplatRes.data.success) {
                await axios.post(`/cms/layout-config/${targetId}/save`, layoutConfigs || []);
                message.success(isEdit ? '수정되었습니다.' : '등록되었습니다.');
                navigate('/template');
            }
        } catch (error) {
            message.error('저장에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>CMS</Breadcrumb.Item>
                <Breadcrumb.Item>템플릿 관리</Breadcrumb.Item>
                <Breadcrumb.Item>템플릿 {isEdit ? '수정' : '등록'}</Breadcrumb.Item>
            </Breadcrumb>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ useAt: 'Y', layoutConfigs: [] }}
            >
                <Row gutter={24}>
                    <Col span={10}>
                        <Card title="템플릿 기본 정보">
                            <Form.Item
                                name="tmplatId"
                                label="템플릿 ID"
                                rules={[{ required: true, message: '템플릿 ID를 입력하세요.' }]}
                            >
                                <Input disabled={isEdit} placeholder="예: TMPL_HOME" />
                            </Form.Item>
                            <Form.Item
                                name="tmplatNm"
                                label="템플릿 명"
                                rules={[{ required: true, message: '템플릿 명을 입력하세요.' }]}
                            >
                                <Input placeholder="메인 홈페이지 템플릿" />
                            </Form.Item>
                            <Form.Item name="tmplatSeCode" label="구분 코드">
                                <Select>
                                    <Option value="GENERAL">일반 페이지</Option>
                                    <Option value="BLOG">블로그/게시판</Option>
                                    <Option value="MAIN">메인 레이아웃</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="tmplatCours" label="템플릿 실제 경로">
                                <Input placeholder="예: /templates/main.html" />
                            </Form.Item>
                            <Form.Item name="useAt" label="사용 여부">
                                <Select>
                                    <Option value="Y">사용</Option>
                                    <Option value="N">미사용</Option>
                                </Select>
                            </Form.Item>
                            <Divider />
                            <Space>
                                <Button type="primary" htmlType="submit" loading={loading}>전체 저장</Button>
                                <Button onClick={() => navigate('/template')}>취소</Button>
                            </Space>
                        </Card>
                    </Col>

                    <Col span={14}>
                        <Card
                            title={<span><LayoutOutlined /> 레이아웃 구성 (영역별 위젯 배치)</span>}
                        >
                            <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
                                Header, Footer, Sidebar 등 영역을 추가하고 사용할 위젯을 할당하세요.
                            </Text>

                            <Form.List name="layoutConfigs">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Card
                                                size="small"
                                                key={key}
                                                style={{ marginBottom: 12, border: '1px dashed #d9d9d9' }}
                                                extra={<DeleteOutlined onClick={() => remove(name)} style={{ color: 'red' }} />}
                                            >
                                                <Row gutter={16}>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'areaNm']}
                                                            rules={[{ required: true, message: '영역명을 선택하세요.' }]}
                                                        >
                                                            <Select placeholder="영역 선택">
                                                                <Option value="Header">Header</Option>
                                                                <Option value="Footer">Footer</Option>
                                                                <Option value="Sidebar">Sidebar</Option>
                                                                <Option value="PopupArea">PopupArea</Option>
                                                                <Option value="ContentTop">ContentTop</Option>
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'widgetId']}
                                                            rules={[{ required: true, message: '위젯을 선택하세요.' }]}
                                                        >
                                                            <Select placeholder="할당할 위젯 선택">
                                                                {widgets.map(w => (
                                                                    <Option key={w.widgetId} value={w.widgetId}>
                                                                        [{w.widgetTyCode}] {w.widgetNm}
                                                                    </Option>
                                                                ))}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={4}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'expsrOrdr']}
                                                            initialValue={fields.length}
                                                        >
                                                            <Input type="number" placeholder="순서" />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        ))}
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            신규 영역 설정 추가
                                        </Button>
                                    </>
                                )}
                            </Form.List>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default TemplateForm;
