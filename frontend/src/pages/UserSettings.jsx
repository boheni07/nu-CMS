import React, { useState } from 'react';
import { Card, Tabs, Form, Input, Button, Upload, Avatar, message, Descriptions, Switch, Divider, Space, Typography, List } from 'antd';
import { UserOutlined, LockOutlined, BellOutlined, UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;

const UserSettings = () => {
    const [form] = Form.useForm();
    const [pwdForm] = Form.useForm();

    const onProfileFinish = (values) => {
        console.log('Profile values:', values);
        message.success('프로필 정보가 저장되었습니다.');
    };

    const onPasswordFinish = (values) => {
        console.log('Password values:', values);
        message.success('비밀번호가 성공적으로 변경되었습니다.');
        pwdForm.resetFields();
    };

    const items = [
        {
            key: '1',
            label: (
                <span>
                    <UserOutlined />
                    프로필 관리
                </span>
            ),
            children: (
                <div style={{ maxWidth: 600 }}>
                    <div style={{ marginBottom: 24, textAlign: 'center' }}>
                        <Avatar size={100} icon={<UserOutlined />} src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
                        <div style={{ marginTop: 16 }}>
                            <Upload showUploadList={false}>
                                <Button icon={<UploadOutlined />}>사진 변경</Button>
                            </Upload>
                        </div>
                    </div>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onProfileFinish}
                        initialValues={{
                            username: 'admin',
                            name: '관리자',
                            email: 'admin@nucms.com',
                            dept: '디지털혁신팀'
                        }}
                    >
                        <Form.Item name="username" label="아이디">
                            <Input disabled />
                        </Form.Item>
                        <Form.Item name="name" label="이름" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="email" label="이메일" rules={[{ required: true, type: 'email' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="dept" label="소속 부서">
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">정보 수정</Button>
                        </Form.Item>
                    </Form>
                </div>
            ),
        },
        {
            key: '2',
            label: (
                <span>
                    <LockOutlined />
                    보안 설정
                </span>
            ),
            children: (
                <div style={{ maxWidth: 400 }}>
                    <Title level={4}>비밀번호 변경</Title>
                    <Divider />
                    <Form
                        form={pwdForm}
                        layout="vertical"
                        onFinish={onPasswordFinish}
                    >
                        <Form.Item
                            name="currentPassword"
                            label="현재 비밀번호"
                            rules={[{ required: true, message: '현재 비밀번호를 입력하세요.' }]}
                        >
                            <Input.Password prefix={<LockOutlined />} />
                        </Form.Item>
                        <Form.Item
                            name="newPassword"
                            label="새 비밀번호"
                            rules={[{ required: true, message: '새 비밀번호를 입력하세요.' }]}
                        >
                            <Input.Password prefix={<LockOutlined />} />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            label="새 비밀번호 확인"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: '비밀번호를 다시 한번 입력하세요.' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('비밀번호가 일치하지 않습니다.'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">비밀번호 변경</Button>
                        </Form.Item>
                    </Form>
                </div>
            ),
        },
        {
            key: '3',
            label: (
                <span>
                    <BellOutlined />
                    알림 설정
                </span>
            ),
            children: (
                <Card title="알림 수신 설정" bordered={false}>
                    <List itemLayout="horizontal">
                        <List.Item actions={[<Switch defaultChecked />]}>
                            <List.Item.Meta title="시스템 공지사항" description="새로운 시스템 공지 등록 시 알림을 받습니다." />
                        </List.Item>
                        <List.Item actions={[<Switch defaultChecked />]}>
                            <List.Item.Meta title="콘텐츠 업데이트" description="내 콘텐츠에 변경 사항이 발생할 경우 알림을 받습니다." />
                        </List.Item>
                        <List.Item actions={[<Switch />]}>
                            <List.Item.Meta title="이메일 알림" description="보안 이벤트 발생 시 이메일로 알림을 받습니다." />
                        </List.Item>
                    </List>
                </Card>
            ),
        },
    ];

    return (
        <Card title="사용자 및 시스템 설정" bordered={false}>
            <Tabs defaultActiveKey="1" items={items} />
        </Card>
    );
};

export default UserSettings;
