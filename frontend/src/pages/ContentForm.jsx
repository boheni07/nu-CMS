import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Card, Breadcrumb, message, Space, DatePicker, Tag, Divider } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import axios from '../api/axios';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ContentForm = () => {
    const [form] = Form.useForm();
    const [templates, setTemplates] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    useEffect(() => {
        loadTemplates();
        loadCategories();
        if (isEdit) {
            loadDetail();
        }
    }, [id]);

    const loadTemplates = async () => {
        try {
            const response = await axios.get('/cms/template');
            if (response.data.success) {
                setTemplates(response.data.data);
            }
        } catch (error) {
            console.error('템플릿 로드 실패');
        }
    };

    const loadCategories = async () => {
        try {
            const response = await axios.get('/cms/category');
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.error('카테고리 로드 실패');
        }
    };

    const loadDetail = async () => {
        try {
            const response = await axios.get(`/cms/content/${id}`);
            if (response.data.success) {
                const data = response.data.data;

                // 날짜 포맷팅 (dayjs 사용)
                const formData = {
                    ...data,
                    publishDate: data.ntceBgnde && data.ntceEndde
                        ? [dayjs(data.ntceBgnde), dayjs(data.ntceEndde)]
                        : null
                };

                form.setFieldsValue(formData);
                setContent(data.cn || '');
            }
        } catch (error) {
            message.error('데이터를 불러오는데 실패했습니다.');
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const { publishDate, ...rest } = values;
            const payload = {
                ...rest,
                cn: content,
                ntceBgnde: publishDate ? publishDate[0].format('YYYY-MM-DD HH:mm:ss') : null,
                ntceEndde: publishDate ? publishDate[1].format('YYYY-MM-DD HH:mm:ss') : null
            };

            let response;
            if (isEdit) {
                response = await axios.put(`/cms/content/${id}`, payload);
            } else {
                payload.sttusCode = payload.sttusCode || 'I';
                payload.verNo = 1;
                payload.wrterId = 'admin';
                response = await axios.post('/cms/content', payload);
            }

            if (response.data.success) {
                message.success(isEdit ? '수정 및 아카이빙이 완료되었습니다.' : '등록되었습니다.');
                navigate('/content');
            }
        } catch (error) {
            console.error(error);
            const errMsg = error.response?.data?.message || error.message || '저장에 실패했습니다.';
            message.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>CMS</Breadcrumb.Item>
                <Breadcrumb.Item>콘텐츠 {isEdit ? '수정' : '등록'}</Breadcrumb.Item>
            </Breadcrumb>

            <Card title={`콘텐츠 ${isEdit ? '수정' : '등록'}`}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ sttusCode: 'I' }}
                >
                    <Space size="large">
                        <Form.Item
                            name="cntentsId"
                            label="콘텐츠 ID"
                            rules={[{ required: true, message: '콘텐츠 ID를 입력하세요.' }]}
                            style={{ width: 200 }}
                        >
                            <Input disabled={isEdit} placeholder="예: NOTICE_001" />
                        </Form.Item>

                        <Form.Item name="ctgryId" label="카테고리" style={{ width: 250 }}>
                            <Select placeholder="분류 선택">
                                {categories.map(cat => (
                                    <Option key={cat.ctgryId} value={cat.ctgryId}>{cat.ctgryNm}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item name="tmplatId" label="적용 템플릿" style={{ width: 250 }}>
                            <Select placeholder="레이아웃 템플릿 선택">
                                {templates.map(tmpl => (
                                    <Option key={tmpl.tmplatId} value={tmpl.tmplatId}>
                                        {tmpl.tmplatNm}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Space>

                    <Form.Item
                        name="sj"
                        label="제목"
                        rules={[{ required: true, message: '제목을 입력하세요.' }]}
                    >
                        <Input placeholder="콘텐츠 제목" size="large" />
                    </Form.Item>

                    <Form.Item name="tags" label="태그">
                        <Select mode="tags" style={{ width: '100%' }} placeholder="태그를 입력하고 Enter를 누르세요" />
                    </Form.Item>

                    <Divider orientation="left">게시 예약 설정</Divider>
                    <Form.Item name="publishDate" label="게시 기간 (미설정 시 즉시 상시 노출)">
                        <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item label="본문 (에디터)">
                        <Editor
                            apiKey="no-api-key"
                            init={{
                                height: 500,
                                menubar: true,
                                plugins: [
                                    'advlist autolink lists link image charmap print preview anchor',
                                    'searchreplace visualblocks code fullscreen',
                                    'insertdatetime media table paste code help wordcount'
                                ],
                                toolbar:
                                    'undo redo | formatselect | bold italic backcolor | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | removeformat | help'
                            }}
                            value={content}
                            onEditorChange={(newContent) => setContent(newContent)}
                        />
                    </Form.Item>

                    <Form.Item name="sttusCode" label="워크플로우 상태">
                        <Select style={{ width: 200 }}>
                            <Option value="I">임시 (Draft)</Option>
                            <Option value="R">검토 요청 (Review)</Option>
                            <Option value="A">승인 완료 (Approved)</Option>
                            <Option value="P">게시 중 (Published)</Option>
                            <Option value="D">게시 종료 (Archived)</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={loading} size="large">
                                {isEdit ? '수정 및 아카이빙' : '콘텐츠 등록'}
                            </Button>
                            <Button onClick={() => navigate('/content')} size="large">취소</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default ContentForm;
