import React, { useEffect, useState } from 'react';
import { List, Typography, Card, Tag, Space } from 'antd';
import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import axios from '../api/axios';

const { Title, Text } = Typography;

const PublicBoardList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            // Headless API calling (or regular API if public access is allowed)
            // For now, let's assume we can fetch from a public endpoint or simulate it
            const response = await axios.get('/headless/search?q='); // Fetch all or use specific board API
            if (response.data.success) {
                setPosts(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch public posts', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>Posts</Title>
            <List
                itemLayout="vertical"
                size="large"
                loading={loading}
                dataSource={posts}
                renderItem={(item) => (
                    <Card style={{ marginBottom: 16 }} hoverable>
                        <List.Item
                            key={item.nttId}
                            actions={[
                                <Space><ClockCircleOutlined /> {new Date(item.frstRegistPnttm).toLocaleDateString()}</Space>,
                                <Space><UserOutlined /> {item.frstRegisterId}</Space>
                            ]}
                        >
                            <List.Item.Meta
                                title={<a href="#">{item.nttSj}</a>}
                                description={
                                    <Space>
                                        <Tag color="geekblue">Board: {item.bbsId}</Tag>
                                    </Space>
                                }
                            />
                            {item.nttCn?.replace(/<[^>]*>?/gm, '').substring(0, 100)}...
                        </List.Item>
                    </Card>
                )}
            />
        </div>
    );
};

export default PublicBoardList;
