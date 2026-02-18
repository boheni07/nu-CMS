import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Divider, Space, message, Modal, Spin } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import CmsService from '../api/services/cms';

const { Title, Text, Paragraph } = Typography;

const ArticleDetail = () => {
    const { bbsId, nttId } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDetail();
    }, [bbsId, nttId]);

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const data = await CmsService.board.article.getDetail(bbsId, nttId);
            if (data) {
                setArticle(data);
            } else {
                message.error('게시물을 찾을 수 없습니다.');
                navigate(`/board/${bbsId}/articles`);
            }
        } catch (error) {
            console.error(error);
            message.error('게시물을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        Modal.confirm({
            title: '게시물 삭제',
            content: '정말로 이 게시물을 삭제하시겠습니까?',
            okText: '삭제',
            okType: 'danger',
            cancelText: '취소',
            onOk: async () => {
                try {
                    await CmsService.board.article.delete(bbsId, nttId);
                    message.success('삭제되었습니다.');
                    navigate(`/board/${bbsId}/articles`);
                } catch (error) {
                    message.error('삭제 실패: ' + (error.response?.data?.message || error.message));
                }
            }
        });
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>;
    }

    if (!article) return null;

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Card
                title={
                    <Space direction="vertical" style={{ width: '100%', gap: 0 }}>
                        <Title level={4} style={{ margin: 0 }}>{article.nttSj}</Title>
                        <Space style={{ fontSize: '13px', color: '#888', fontWeight: 'normal' }} split={<Divider type="vertical" />}>
                            <span>작성자: {article.frstRegisterId}</span>
                            <span>작성일: {new Date(article.frstRegistPnttm).toLocaleDateString()}</span>
                            <span>조회수: {article.inqireCo}</span>
                        </Space>
                    </Space>
                }
                extra={
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/board/${bbsId}/articles`)}>
                        목록
                    </Button>
                }
            >
                <div style={{ minHeight: '300px', padding: '20px 0' }}>
                    {/* HTML 컨텐츠일 경우 dangerouslySetInnerHTML 사용 고려, 여기서는 simple text/linebreak 처리 */}
                    <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                        {article.nttCn}
                    </Paragraph>
                </div>

                <Divider />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/board/${bbsId}/articles/${nttId}/edit`)}
                    >
                        수정
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={handleDelete}
                    >
                        삭제
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default ArticleDetail;
