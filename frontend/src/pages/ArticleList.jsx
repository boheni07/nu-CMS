import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Space, Input, Tag, message, Breadcrumb, Popconfirm, Modal, Spin } from 'antd';
import { FormOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import CmsService from '../api/services/cms';

const ArticleList = () => {
    const { bbsId } = useParams();
    const navigate = useNavigate();

    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewArticle, setPreviewArticle] = useState(null);
    const [previewLoading, setPreviewLoading] = useState(false);

    useEffect(() => {
        fetchList();
    }, [bbsId, pagination.current]);

    const fetchList = async () => {
        setLoading(true);
        try {
            const response = await CmsService.board.article.getList(bbsId, {
                pageIndex: pagination.current,
                pageSize: pagination.pageSize
            });

            const dataList = Array.isArray(response) ? response : (response.list || []);
            const totalCount = response.totalCount || dataList.length;

            setList(dataList);
            setPagination(prev => ({ ...prev, total: totalCount }));
        } catch (error) {
            message.error('게시물 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = async (nttId) => {
        setPreviewVisible(true);
        setPreviewLoading(true);
        try {
            const data = await CmsService.board.article.getDetail(bbsId, nttId);
            setPreviewArticle(data);
        } catch (error) {
            message.error('게시물 정보를 불러오는데 실패했습니다.');
            setPreviewVisible(false);
        } finally {
            setPreviewLoading(false);
        }
    };

    const handleDelete = async (nttId) => {
        try {
            await CmsService.board.article.delete(bbsId, nttId);
            message.success('게시물이 삭제되었습니다.');
            fetchList();
            if (previewVisible && previewArticle?.nttId === nttId) {
                setPreviewVisible(false);
            }
        } catch (error) {
            message.error('삭제 실패: ' + (error.response?.data?.message || error.message));
        }
    };

    const columns = [
        { title: 'No', dataIndex: 'nttId', key: 'nttId', width: 70, align: 'center', render: (val, _, index) => pagination.total - ((pagination.current - 1) * pagination.pageSize) - index },
        {
            title: '제목',
            dataIndex: 'nttSj',
            key: 'nttSj',
            ellipsis: true,
            render: (text, record) => (
                <a onClick={() => handlePreview(record.nttId)} style={{ cursor: 'pointer' }}>
                    {text}
                </a>
            )
        },
        { title: '작성자', dataIndex: 'frstRegisterId', key: 'frstRegisterId', width: 100, align: 'center' },
        { title: '작성일', dataIndex: 'frstRegistPnttm', key: 'frstRegistPnttm', width: 120, align: 'center', render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
        { title: '조회수', dataIndex: 'inqireCo', key: 'inqireCo', width: 70, align: 'center' },
        {
            title: '관리',
            key: 'action',
            width: 140,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button size="small" icon={<EditOutlined />} onClick={() => navigate(`/board/${bbsId}/articles/${record.nttId}/edit`)}>수정</Button>
                    <Popconfirm title="삭제하시겠습니까?" onConfirm={() => handleDelete(record.nttId)}>
                        <Button size="small" danger icon={<DeleteOutlined />}>삭제</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Breadcrumb style={{ marginBottom: 16 }}>
                <Breadcrumb.Item>CMS</Breadcrumb.Item>
                <Breadcrumb.Item>게시판 관리</Breadcrumb.Item>
                <Breadcrumb.Item>게시물 목록</Breadcrumb.Item>
            </Breadcrumb>

            <Card
                title={`게시물 목록 (${bbsId})`}
                extra={
                    <Space>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/board-master')}>목록으로</Button>
                        <Button type="primary" icon={<FormOutlined />} onClick={() => navigate(`/board/${bbsId}/articles/new`)}>글쓰기</Button>
                    </Space>
                }
            >
                <Table
                    columns={columns}
                    dataSource={list}
                    rowKey="nttId"
                    loading={loading}
                    pagination={{
                        ...pagination,
                        onChange: (page) => setPagination(prev => ({ ...prev, current: page }))
                    }}
                    size="small"
                    style={{ tableLayout: 'fixed' }}
                />
            </Card>

            <Modal
                title={previewArticle?.nttSj || '게시물 미리보기'}
                open={previewVisible}
                onCancel={() => setPreviewVisible(false)}
                footer={[
                    <Button key="edit" icon={<EditOutlined />} onClick={() => {
                        setPreviewVisible(false);
                        navigate(`/board/${bbsId}/articles/${previewArticle.nttId}/edit`);
                    }}>
                        수정
                    </Button>,
                    <Button key="close" onClick={() => setPreviewVisible(false)}>
                        닫기
                    </Button>
                ]}
                width={800}
                centered
            >
                {previewLoading ? (
                    <div style={{ textAlign: 'center', padding: '50px 0' }}><Spin /></div>
                ) : (
                    previewArticle && (
                        <div>
                            <div style={{ marginBottom: 16, borderBottom: '1px solid #f0f0f0', paddingBottom: 10 }}>
                                <Space split={<span style={{ color: '#ddd' }}>|</span>} style={{ fontSize: 13, color: '#666' }}>
                                    <span>작성자: {previewArticle.frstRegisterId}</span>
                                    <span>작성일: {new Date(previewArticle.frstRegistPnttm).toLocaleDateString()}</span>
                                    <span>조회수: {previewArticle.inqireCo}</span>
                                </Space>
                            </div>
                            <div style={{ minHeight: 200, whiteSpace: 'pre-wrap' }}>
                                {previewArticle.nttCn}
                            </div>
                        </div>
                    )
                )}
            </Modal>
        </div>
    );
};

export default ArticleList;
