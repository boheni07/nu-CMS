import React, { useState } from 'react';
import { Card, Breadcrumb, Radio, Divider, Space, Typography, Tooltip } from 'antd';
import { DesktopOutlined, TabletOutlined, MobileOutlined, ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

const SitePreview = () => {
    const [viewport, setViewport] = useState('pc');
    const [refreshKey, setRefreshKey] = useState(0);

    const viewportStyles = {
        pc: { width: '100%', height: 'calc(100vh - 250px)', transition: 'all 0.3s' },
        tablet: { width: '768px', height: '1024px', margin: '0 auto', boxShadow: '0 0 20px rgba(0,0,0,0.1)', transition: 'all 0.3s' },
        mobile: { width: '375px', height: '667px', margin: '0 auto', boxShadow: '0 0 20px rgba(0,0,0,0.1)', transition: 'all 0.3s' },
    };

    return (
        <div>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>CMS</Breadcrumb.Item>
                <Breadcrumb.Item>반응형 미리보기</Breadcrumb.Item>
            </Breadcrumb>

            <Card style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space size="large">
                        <Radio.Group value={viewport} onChange={(e) => setViewport(e.target.value)} buttonStyle="solid">
                            <Radio.Button value="pc"><DesktopOutlined /> PC</Radio.Button>
                            <Radio.Button value="tablet"><TabletOutlined /> Tablet</Radio.Button>
                            <Radio.Button value="mobile"><MobileOutlined /> Mobile</Radio.Button>
                        </Radio.Group>
                        <Divider type="vertical" />
                        <Tooltip title="새로고침">
                            <ReloadOutlined style={{ fontSize: 18, cursor: 'pointer' }} onClick={() => setRefreshKey(prev => prev + 1)} />
                        </Tooltip>
                    </Space>
                    <Text type="secondary">
                        {viewport === 'pc' && 'Desktop (100%)'}
                        {viewport === 'tablet' && 'iPad (768 x 1024)'}
                        {viewport === 'mobile' && 'iPhone SE (375 x 667)'}
                    </Text>
                </div>
            </Card>

            <div style={{
                background: '#f0f2f5',
                padding: viewport === 'pc' ? 0 : '40px 0',
                minHeight: 'calc(100vh - 250px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                overflow: 'auto'
            }}>
                <div style={{
                    ...viewportStyles[viewport],
                    background: 'white',
                    border: '1px solid #d9d9d9',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <iframe
                        key={refreshKey}
                        src="/view"
                        title="Site Preview"
                        style={{ width: '100%', height: '100%', border: 'none' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default SitePreview;
