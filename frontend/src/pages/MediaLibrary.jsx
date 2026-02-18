import React, { useState, useEffect } from 'react';
import { Card, Button, Upload, List, Tag, Space, message, Input, Modal, Typography, Image, Breadcrumb, Empty, Row, Col } from 'antd';
import { InboxOutlined, DeleteOutlined, DownloadOutlined, FileOutlined, SearchOutlined, PictureOutlined } from '@ant-design/icons';
import axios from '../api/axios';

const { Dragger } = Upload;
const { Text, Title } = Typography;

const MediaLibrary = () => {
    const [mediaList, setMediaList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async (params = {}) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/cms/file/library', { params });
            if (response.data.success) {
                setMediaList(response.data.data);
            }
        } catch (error) {
            message.error('미디어 라이브러리를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchMedia({ orignlFileNm: searchText });
    };

    const handleDelete = async (file) => {
        Modal.confirm({
            title: '파일 삭제',
            content: `[${file.orignlFileNm}] 파일을 삭제하시겠습니까?`,
            onOk: async () => {
                try {
                    const response = await axios.delete(`/api/cms/file/${file.atchFileId}/${file.fileSn}`);
                    if (response.data.success) {
                        message.success('파일이 삭제되었습니다.');
                        fetchMedia();
                    }
                } catch (error) {
                    message.error('파일 삭제에 실패했습니다.');
                }
            }
        });
    };

    const uploadProps = {
        name: 'files',
        multiple: true,
        action: '/api/cms/file/upload',
        onChange(info) {
            const { status } = info.file;
            if (status === 'done') {
                message.success(`${info.file.name} 업로드 성공`);
                fetchMedia();
            } else if (status === 'error') {
                message.error(`${info.file.name} 업로드 실패`);
            }
        },
    };

    const getFileIcon = (ext) => {
        const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
        if (imageExts.includes(ext.toLowerCase())) return <PictureOutlined />;
        return <FileOutlined />;
    };

    const renderMediaCard = (item) => {
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(item.fileExtsn.toLowerCase());
        const downloadUrl = `/api/cms/file/download/${item.atchFileId}/${item.fileSn}`;

        return (
            <Col xs={24} sm={12} md={8} lg={6} xl={4} key={`${item.atchFileId}-${item.fileSn}`}>
                <Card
                    hoverable
                    cover={
                        isImage ? (
                            <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', overflow: 'hidden' }}>
                                <Image
                                    alt={item.orignlFileNm}
                                    src={downloadUrl}
                                    style={{ maxHeight: 160, objectFit: 'contain' }}
                                    preview={{
                                        mask: <Space><SearchOutlined /> 미리보기</Space>
                                    }}
                                />
                            </div>
                        ) : (
                            <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', fontSize: 48, color: '#bfbfbf' }}>
                                {getFileIcon(item.fileExtsn)}
                            </div>
                        )
                    }
                    actions={[
                        <DownloadOutlined key="download" onClick={() => window.open(downloadUrl)} />,
                        <DeleteOutlined key="delete" onClick={() => handleDelete(item)} style={{ color: 'red' }} />,
                    ]}
                >
                    <Card.Meta
                        title={<Text ellipsis={{ tooltip: item.orignlFileNm }}>{item.orignlFileNm}</Text>}
                        description={
                            <Space direction="vertical" size={0}>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    {(item.fileSize / 1024).toFixed(1)} KB | {item.fileExtsn.toUpperCase()}
                                </Text>
                                <Text type="secondary" style={{ fontSize: '10px' }}>
                                    {new Date(item.frstRegistPnttm).toLocaleDateString()}
                                </Text>
                            </Space>
                        }
                    />
                </Card>
            </Col>
        );
    };

    return (
        <div>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>CMS</Breadcrumb.Item>
                <Breadcrumb.Item>미디어 및 파일</Breadcrumb.Item>
                <Breadcrumb.Item>중앙 라이브러리</Breadcrumb.Item>
            </Breadcrumb>

            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card>
                    <Dragger {...uploadProps}>
                        <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                        <p className="ant-upload-text">클릭하거나 파일을 이 영역으로 드래그하여 업로드하세요</p>
                        <p className="ant-upload-hint">이미지, 문서, 영상 등 모든 파일을 중앙 라이브러리에 저장할 수 있습니다.</p>
                    </Dragger>
                </Card>

                <Card
                    title={<span><PictureOutlined /> 미디어 자산 목록</span>}
                    extra={
                        <Space>
                            <Input
                                placeholder="파일명 검색"
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                onPressEnter={handleSearch}
                                prefix={<SearchOutlined />}
                            />
                            <Button type="primary" onClick={handleSearch}>검색</Button>
                        </Space>
                    }
                >
                    {mediaList.length > 0 ? (
                        <Row gutter={[16, 16]}>
                            {mediaList.map(renderMediaCard)}
                        </Row>
                    ) : (
                        <Empty description="등록된 미디어가 없습니다." />
                    )}
                </Card>
            </Space>
        </div>
    );
};

export default MediaLibrary;
