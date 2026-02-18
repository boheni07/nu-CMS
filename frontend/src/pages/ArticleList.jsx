import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Space, Input, Tag, message, Breadcrumb, Popconfirm } from 'antd';
import { FormOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import CmsService from '../api/services/cms';

const ArticleList = () => {
    const { bbsId } = useParams();
    const navigate = useNavigate();

    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

    useEffect(() => {
        fetchList();
    }, [bbsId, pagination.current]);

    const fetchList = async () => {
        setLoading(true);
        try {
            // 실제 API 호출 시 params를 전달하여 페이징 처리 가능
            // 현재는 예시로 전체 목록을 가져온다고 가정하거나, 백엔드 스펙에 맞게 조정 필요
            const response = await CmsService.board.article.getList(bbsId, {
                pageIndex: pagination.current,
                pageSize: pagination.pageSize
            });

            // 응답 구조가 { list: [], pagination: {} } 인지, 단순히 배열인지 확인 필요
            // 여기서는 안전하게 처리
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

    const handleDelete = async (nttId) => {
        try {
            await CmsService.board.article.delete(bbsId, nttId);
            message.success('게시물이 삭제되었습니다.');
            fetchList();
        } catch (error) {
            message.error('삭제 실패: ' + (error.response?.data?.message || error.message));
        }
    };

    const columns = [
        { title: 'No', dataIndex: 'nttId', key: 'nttId', width: 80, render: (val, _, index) => pagination.total - ((pagination.current - 1) * pagination.pageSize) - index },
        { title: '제목', dataIndex: 'nttSj', key: 'nttSj', render: (text, record) => <a onClick={() => navigate(`/board/${bbsId}/articles/${record.nttId}`)}>{text}</a> },
        { title: '작성자', dataIndex: 'frstRegisterId', key: 'frstRegisterId', width: 120 },
        { title: '작성일', dataIndex: 'frstRegistPnttm', key: 'frstRegistPnttm', width: 150, render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
        { title: '조회수', dataIndex: 'inqireCo', key: 'inqireCo', width: 80, align: 'center' },
        {
            title: '관리',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space>
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
                />
            </Card>
        </div>
    );
};

export default ArticleList;
