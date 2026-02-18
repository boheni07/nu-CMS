import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Breadcrumb, Space, Spin } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import CmsService from '../api/services/cms';

const ArticleForm = () => {
    const { bbsId, nttId } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const isEdit = !!nttId;

    useEffect(() => {
        if (isEdit) {
            fetchDetail();
        }
    }, [bbsId, nttId]);

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const data = await CmsService.board.article.getDetail(bbsId, nttId);
            if (data) {
                form.setFieldsValue(data);
            } else {
                message.error('게시물 정보를 찾을 수 없습니다.');
                navigate(`/board/${bbsId}/articles`);
            }
        } catch (error) {
            message.error('게시물 정보를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const onFinish = async (values) => {
        setSubmitting(true);
        try {
            // 게시판 ID(bbsId) 포함
            const payload = { ...values, bbsId };

            if (isEdit) {
                await CmsService.board.article.update(bbsId, nttId, payload);
                message.success('게시물이 수정되었습니다.');
            } else {
                await CmsService.board.article.create(bbsId, payload);
                message.success('게시물이 등록되었습니다.');
            }
            navigate(`/board/${bbsId}/articles`);
        } catch (error) {
            console.error(error);
            message.error(error.response?.data?.message || '저장에 실패했습니다.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>;
    }

    return (
        <div>
            <Breadcrumb style={{ marginBottom: 16 }}>
                <Breadcrumb.Item>CMS</Breadcrumb.Item>
                <Breadcrumb.Item>게시판 관리</Breadcrumb.Item>
                <Breadcrumb.Item>{isEdit ? '게시물 수정' : '게시물 등록'}</Breadcrumb.Item>
            </Breadcrumb>

            <Card
                title={isEdit ? '게시물 수정' : '게시물 등록'}
                extra={
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
                        뒤로가기
                    </Button>
                }
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ ntceBgnde: '', ntceEndde: '' }}
                >
                    <Form.Item
                        name="nttSj"
                        label="제목"
                        rules={[{ required: true, message: '제목을 입력해주세요.' }]}
                    >
                        <Input placeholder="제목 입력" />
                    </Form.Item>

                    <Form.Item
                        name="nttCn"
                        label="내용"
                        rules={[{ required: true, message: '내용을 입력해주세요.' }]}
                    >
                        <Input.TextArea rows={15} placeholder="내용 입력" />
                    </Form.Item>

                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                        <Space size="large">
                            <Button onClick={() => navigate(-1)}>취소</Button>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={submitting}>
                                {isEdit ? '수정 저장' : '신규 등록'}
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default ArticleForm;
