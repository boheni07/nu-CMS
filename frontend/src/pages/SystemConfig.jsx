import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Tabs, message, Spin, Alert, Breadcrumb } from 'antd';
import { SettingOutlined, SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import axios from '../api/axios';

const { TabPane } = Tabs;

const SystemConfig = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [configs, setConfigs] = useState({});

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/cms/config');
            if (response.data.success) {
                const configList = response.data.data;
                const configMap = {};
                configList.forEach(item => {
                    configMap[item.configKey] = item.configVal;
                });
                setConfigs(configMap);
                form.setFieldsValue(configMap);
            }
        } catch (error) {
            console.error(error);
            message.error('설정 정보를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/cms/config/save', values);
            if (response.data.success) {
                message.success('설정이 저장되었습니다.');
                // 설정 변경 후 필요한 경우 새로고침 안내
                if (values.SITE_TITLE !== configs.SITE_TITLE) {
                    message.info('사이트 제목이 변경되었습니다. 새로고침 시 적용됩니다.');
                }
                fetchConfigs();
            }
        } catch (error) {
            console.error(error);
            message.error('설정 저장에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Breadcrumb style={{ marginBottom: 16 }}>
                <Breadcrumb.Item>CMS</Breadcrumb.Item>
                <Breadcrumb.Item>기본 설정</Breadcrumb.Item>
                <Breadcrumb.Item>시스템 환경설정</Breadcrumb.Item>
            </Breadcrumb>

            <Card
                title={<span><SettingOutlined /> 시스템 환경설정</span>}
                extra={<Button icon={<ReloadOutlined />} onClick={fetchConfigs}>새로고침</Button>}
            >
                <Spin spinning={loading}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="기본 설정" key="1">
                                <Alert
                                    message="사이트 기본 정보"
                                    description="브라우저 타이틀, 하단 카피라이트 등 사이트 전반에 사용되는 정보를 설정합니다."
                                    type="info"
                                    showIcon
                                    style={{ marginBottom: 24 }}
                                />
                                <Form.Item
                                    name="SITE_TITLE"
                                    label="사이트 제목 (Browser Title)"
                                    rules={[{ required: true, message: '사이트 제목을 입력하세요' }]}
                                    extra="브라우저 탭에 표시되는 제목입니다."
                                >
                                    <Input placeholder="예: nu-CMS Enterprise" />
                                </Form.Item>
                                <Form.Item
                                    name="SITE_COPYRIGHT"
                                    label="카피라이트 (Footer)"
                                    extra="페이지 하단에 표시될 저작권 문구입니다."
                                >
                                    <Input placeholder="예: © 2026 Company. All rights reserved." />
                                </Form.Item>
                            </TabPane>

                            <TabPane tab="관리자 설정" key="2">
                                <Form.Item
                                    name="ADMIN_EMAIL"
                                    label="관리자 대표 이메일"
                                    rules={[{ type: 'email', message: '유효한 이메일 형식이 아닙니다' }]}
                                    extra="시스템 알림 등을 수신할 대표 이메일입니다."
                                >
                                    <Input placeholder="admin@example.com" />
                                </Form.Item>
                                <Form.Item
                                    name="THEME_COLOR"
                                    label="관리자 테마 컬러"
                                    extra="관리자 페이지의 포인트 컬러입니다 (Hex Code)."
                                >
                                    <Input type="color" style={{ width: 100 }} />
                                </Form.Item>
                            </TabPane>

                            <TabPane tab="SEO 설정" key="3">
                                <Form.Item
                                    name="SEO_KEYWORDS"
                                    label="메타 키워드 (Keywords)"
                                >
                                    <Input.TextArea rows={2} placeholder="쉼표(,)로 구분하여 입력" />
                                </Form.Item>
                                <Form.Item
                                    name="SEO_DESCRIPTION"
                                    label="메타 설명 (Description)"
                                >
                                    <Input.TextArea rows={3} placeholder="사이트에 대한 간략한 설명" />
                                </Form.Item>
                            </TabPane>
                        </Tabs>

                        <Form.Item style={{ marginTop: 24, textAlign: 'center' }}>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large" style={{ minWidth: 120 }}>
                                설정 저장
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </Card>
        </div>
    );
};

export default SystemConfig;
