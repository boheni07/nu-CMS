import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Card, Breadcrumb, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const TemplateList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/cms/template');
            if (response.data.success) {
                setData(response.data.data);
            }
        } catch (error) {
            message.error('템플릿 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        try {
            const response = await axios.delete(`/cms/template/${id}`);
            if (response.data.success) {
                message.success('삭제되었습니다.');
                fetchData();
            }
        } catch (error) {
            message.error('삭제에 실패했습니다.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            title: '템플릿 ID',
            dataIndex: 'tmplatId',
            key: 'tmplatId',
            width: 150,
            align: 'center',
        },
        {
            title: '템플릿명',
            dataIndex: 'tmplatNm',
            key: 'tmplatNm',
            ellipsis: true,
        },
        {
            title: '구분',
            dataIndex: 'tmplatSeCode',
            key: 'tmplatSeCode',
            width: 120,
            align: 'center',
            render: (text) => <Tag color="blue">{text}</Tag>
        },
        {
            title: '경로',
            dataIndex: 'tmplatCours',
            key: 'tmplatCours',
            ellipsis: true,
        },
        {
            title: '사용여부',
            dataIndex: 'useAt',
            key: 'useAt',
            width: 100,
            align: 'center',
            render: (text) => <Tag color={text === 'Y' ? 'green' : 'red'}>{text === 'Y' ? '사용' : '미사용'}</Tag>
        },
        {
            title: '관리',
            key: 'action',
            width: 180,
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <Button size="small" icon={<EditOutlined />} onClick={() => navigate(`/template/edit/${record.tmplatId}`)}>수정</Button>
                    <Button size="small" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.tmplatId)}>삭제</Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Breadcrumb style={{ marginBottom: 16 }}>
                <Breadcrumb.Item>CMS</Breadcrumb.Item>
                <Breadcrumb.Item>템플릿 관리</Breadcrumb.Item>
            </Breadcrumb>
            <Card
                title="템플릿 목록"
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/template/new')}>
                        신규 템플릿 등록
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="tmplatId"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    );
};

export default TemplateList;
