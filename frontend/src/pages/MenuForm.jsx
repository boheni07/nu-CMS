import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, Card, Breadcrumb, message, Space } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axios';

const { Option } = Select;

const MenuForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    useEffect(() => {
        if (isEdit) {
            loadDetail();
        }
    }, [id]);

    const loadDetail = async () => {
        try {
            const response = await axios.get(`/cms/menu/${id}`);
            if (response.data.success) {
                form.setFieldsValue(response.data.data);
            }
        } catch (error) {
            message.error('데이터를 불러오는데 실패했습니다.');
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            let response;
            if (isEdit) {
                response = await axios.put(`/cms/menu/${id}`, values);
            } else {
                response = await axios.post('/cms/menu', values);
            }

            if (response.data.success) {
                message.success(isEdit ? '수정되었습니다.' : '등록되었습니다.');
                navigate('/menu');
            } else {
                message.error(response.data.message || '저장에 실패했습니다.');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || '서버와의 통신 중 오류가 발생했습니다.';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>CMS</Breadcrumb.Item>
                <Breadcrumb.Item>메뉴 {isEdit ? '수정' : '등록'}</Breadcrumb.Item>
            </Breadcrumb>

            <Card title={`메뉴 ${isEdit ? '수정' : '등록'}`} extra={<span style={{ color: '#888', fontSize: '12px' }}>* 계층 관계는 상위 메뉴 ID로 설정하세요.</span>}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ useAt: 'Y', expsrOrdr: 1 }}
                >
                    <Form.Item
                        name="menuId"
                        label="메뉴 ID"
                        rules={[
                            { required: true, message: '메뉴 ID를 입력하세요.' },
                            { max: 20, message: '메뉴 ID는 20자 이내여야 합니다.' },
                            { pattern: /^[A-Z0-9_]+$/, message: '대문자, 숫자, 언더바(_)만 사용 가능합니다.' }
                        ]}
                    >
                        <Input disabled={isEdit} placeholder="예: MENU_ADMIN_01" />
                    </Form.Item>

                    <Form.Item
                        name="menuNm"
                        label="메뉴명"
                        rules={[{ required: true, message: '메뉴명을 입력하세요.' }]}
                    >
                        <Input placeholder="메뉴 이름" />
                    </Form.Item>

                    <Form.Item name="upperMenuId" label="상위 메뉴 ID">
                        <Input placeholder="부모 메뉴가 있는 경우 입력" />
                    </Form.Item>

                    <Form.Item name="conectUrl" label="연결 URL">
                        <Input placeholder="예: /content/list" />
                    </Form.Item>

                    <Form.Item name="expsrOrdr" label="노출 순서">
                        <InputNumber min={0} />
                    </Form.Item>

                    <Form.Item name="useAt" label="사용 여부">
                        <Select style={{ width: 120 }}>
                            <Option value="Y">사용</Option>
                            <Option value="N">미사용</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                저장
                            </Button>
                            <Button onClick={() => navigate('/menu')}>취소</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default MenuForm;
