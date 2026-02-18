import React, { useEffect, useState } from 'react';
import { Typography, List, Card, Spin } from 'antd';
import axios from '../api/axios';

const { Title, Paragraph } = Typography;

const PublicHome = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch some public data or just show a welcome message
        // For now, we'll just simulate loading
        setTimeout(() => setLoading(false), 500);
    }, []);

    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <Title level={1}>Welcome to nu-CMS</Title>
                <Paragraph>
                    이 페이지는 CMS에서 관리되는 콘텐츠가 실제 사용자에게 어떻게 보이는지 확인하는 미리보기(Preview) 페이지입니다.
                </Paragraph>
            </div>

            <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={[
                    { title: '공지사항', desc: '최신 소식을 확인하세요.' },
                    { title: '갤러리', desc: '다양한 이미지를 구경하세요.' },
                    { title: '문의하기', desc: '궁금한 점을 문의해주세요.' },
                ]}
                renderItem={item => (
                    <List.Item>
                        <Card title={item.title}>{item.desc}</Card>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default PublicHome;
