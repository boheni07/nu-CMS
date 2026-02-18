import React, { useState } from 'react';
import { Input, List, Card, Typography, Space, Tag, Breadcrumb, Empty } from 'antd';
import { SearchOutlined, FileTextOutlined, ClockCircleOutlined } from '@ant-design/icons';
import axios from '../api/axios';

const { Title, Text, Paragraph } = Typography;

const GlobalSearch = () => {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (value) => {
        if (!value.trim()) return;
        setLoading(true);
        try {
            const response = await axios.get('/cms/board/search', { params: { keyword: value } });
            if (response.data.success) {
                setResults(response.data.data);
                setKeyword(value);
            }
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>CMS</Breadcrumb.Item>
                <Breadcrumb.Item>통합 검색</Breadcrumb.Item>
            </Breadcrumb>

            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card>
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <Title level={2}>통합 검색</Title>
                        <Text type="secondary">사이트 내 모든 게시물과 콘텐츠를 한 번에 검색하세요.</Text>
                        <div style={{ maxWidth: 600, margin: '24px auto' }}>
                            <Input.Search
                                placeholder="검색어를 입력하세요 (제목, 내용)"
                                enterButton="검색"
                                size="large"
                                onSearch={handleSearch}
                                loading={loading}
                            />
                        </div>
                    </div>
                </Card>

                {keyword && (
                    <Card title={<span><SearchOutlined /> '{keyword}'에 대한 검색 결과 ({results.length}건)</span>}>
                        <List
                            itemLayout="vertical"
                            size="large"
                            dataSource={results}
                            renderItem={item => (
                                <List.Item
                                    key={item.nttId}
                                    extra={<Tag color="blue">게시판</Tag>}
                                >
                                    <List.Item.Meta
                                        title={<a href={`/board/view/${item.nttId}`}><FileTextOutlined /> {item.nttSj}</a>}
                                        description={
                                            <Space split="|">
                                                <span><ClockCircleOutlined /> {new Date(item.frstRegistPnttm).toLocaleString()}</span>
                                                <span>ID: {item.nttId}</span>
                                            </Space>
                                        }
                                    />
                                    <Paragraph ellipsis={{ rows: 2 }}>
                                        {item.nttCn.replace(/<[^>]*>?/gm, '') /* HTML 태그 제거 */}
                                    </Paragraph>
                                </List.Item>
                            )}
                            locale={{ emptyText: <Empty description="검색 결과가 없습니다." /> }}
                        />
                    </Card>
                )}
            </Space>
        </div>
    );
};

export default GlobalSearch;
