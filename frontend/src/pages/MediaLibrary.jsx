import React, { useState, useEffect } from 'react';
import {
    Layout, Tree, Card, Upload, Button, Input, Modal, message,
    Row, Col, Image, Empty, Tag, Space, Breadcrumb, Dropdown, Menu
} from 'antd';
import {
    FolderOutlined, FolderOpenOutlined, FileImageOutlined,
    UploadOutlined, DeleteOutlined, PlusOutlined,
    MoreOutlined, AppstoreOutlined, BarsOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import axios from '../api/axios';

const { Sider, Content } = Layout;
const { DirectoryTree } = Tree;
const { Dragger } = Upload;
const { Search } = Input;

const MediaLibrary = () => {
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    // 초기 데이터 로드
    useEffect(() => {
        fetchFolders();
        fetchFiles(); // 전체 보기
    }, []);

    // 상세 조회 (선택 시)
    useEffect(() => {
        fetchFiles(selectedFolder);
    }, [selectedFolder]);

    const fetchFolders = async () => {
        try {
            const response = await axios.get('/cms/dam/folder');
            if (response.data.success) {
                // 부모-자식 구조로 변환 (간단히 1단계만 구현하거나, 재귀함수 필요)
                // 현재는 1단계 list로 가정하고 TreeData로 매핑
                const treeData = response.data.data.map(folder => ({
                    title: folder.folderNm,
                    key: folder.folderId,
                    icon: <FolderOutlined />,
                    isLeaf: false,
                }));
                // 루트 가상 폴더 추가
                setFolders([{
                    title: '전체 파일',
                    key: 'ALL',
                    icon: <FolderOpenOutlined />,
                    children: treeData
                }]);
            }
        } catch (error) {
            console.error(error);
            message.error('폴더 목록을 불러오지 못했습니다.');
        }
    };

    const fetchFiles = async (folderId) => {
        setLoading(true);
        try {
            const params = {};
            if (folderId && folderId !== 'ALL') {
                params.folderId = folderId;
            }
            const response = await axios.get('/cms/dam/list', { params });
            if (response.data.success) {
                setFiles(response.data.data);
            }
        } catch (error) {
            message.error('파일 목록을 불러오지 못했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return;
        try {
            await axios.post('/cms/dam/folder', {
                folderNm: newFolderName,
                upperFolderId: null // 1단계만 지원
            });
            message.success('폴더가 생성되었습니다.');
            setModalVisible(false);
            setNewFolderName('');
            fetchFolders();
        } catch (error) {
            message.error('폴더 생성 실패');
        }
    };

    const uploadProps = {
        name: 'file',
        multiple: true,
        action: 'http://localhost:8080/api/cms/dam/upload',
        data: (file) => ({
            folderId: selectedFolder === 'ALL' ? '' : selectedFolder
            // tags, author 등 추가 필드 전송 가능
        }),
        headers: {
            // Authorization 헤더가 필요하다면 axios interceptor와 동일하게 설정 필요
            // 여기서는 생략하거나 로컬 스토리지에서 가져옴
        },
        onChange(info) {
            const { status } = info.file;
            if (status === 'done') {
                message.success(`${info.file.name} 업로드 성공`);
                fetchFiles(selectedFolder);
            } else if (status === 'error') {
                message.error(`${info.file.name} 업로드 실패`);
            }
        },
        showUploadList: false,
    };

    const onSelectFolder = (keys) => {
        if (keys.length > 0) {
            setSelectedFolder(keys[0]);
        } else {
            setSelectedFolder('ALL');
        }
    };

    const handleDeleteFile = async (item) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        try {
            await axios.delete(`/cms/file/${item.atchFileId}/${item.fileSn}`);
            message.success('삭제되었습니다.');
            fetchFiles(selectedFolder);
        } catch (error) {
            message.error('삭제 실패');
        }
    };

    return (
        <Layout style={{ height: 'calc(100vh - 100px)', background: '#fff' }}>
            <Sider width={250} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
                <div style={{ padding: '10px' }}>
                    <Button
                        type="dashed"
                        block
                        icon={<PlusOutlined />}
                        onClick={() => setModalVisible(true)}
                    >
                        새 폴더
                    </Button>
                </div>
                <DirectoryTree
                    defaultExpandAll
                    onSelect={onSelectFolder}
                    treeData={folders}
                    style={{ padding: '0 10px' }}
                />
            </Sider>
            <Content style={{ padding: '20px', overflow: 'auto' }}>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                    <Breadcrumb>
                        <Breadcrumb.Item>Media Library</Breadcrumb.Item>
                        <Breadcrumb.Item>{selectedFolder === 'ALL' || !selectedFolder ? '전체' : '선택 폴더'}</Breadcrumb.Item>
                    </Breadcrumb>
                    <Space>
                        <Button
                            icon={viewMode === 'grid' ? <BarsOutlined /> : <AppstoreOutlined />}
                            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                        />
                    </Space>
                </div>

                <Card style={{ marginBottom: 20 }}>
                    <Dragger {...uploadProps}>
                        <p className="ant-upload-drag-icon">
                            <UploadOutlined />
                        </p>
                        <p className="ant-upload-text">파일을 이 영역으로 드래그하거나 클릭하여 업로드</p>
                        <p className="ant-upload-hint">
                            {selectedFolder && selectedFolder !== 'ALL'
                                ? '현재 선택된 폴더에 업로드됩니다.'
                                : '전체(루트) 경로에 업로드됩니다.'}
                        </p>
                    </Dragger>
                </Card>

                {files.length === 0 ? (
                    <Empty description="파일이 없습니다." />
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                        gap: '16px'
                    }}>
                        {files.map(file => (
                            <Card
                                key={`${file.atchFileId}_${file.fileSn}`}
                                hoverable
                                cover={
                                    <div style={{ height: 150, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
                                        {['jpg', 'png', 'jpeg', 'gif', 'webp'].includes(file.fileExtsn) ? (
                                            <Image
                                                alt={file.orignlFileNm}
                                                src={`http://localhost:8080/api/cms/file/download/${file.atchFileId}/${file.fileSn}`}
                                                style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                                                preview={{ src: `http://localhost:8080/api/cms/file/download/${file.atchFileId}/${file.fileSn}` }}
                                            />
                                        ) : (
                                            <FileTextOutlined style={{ fontSize: 40, color: '#999' }} />
                                        )}
                                    </div>
                                }
                                actions={[
                                    <DeleteOutlined key="delete" onClick={() => handleDeleteFile(file)} />,
                                    <MoreOutlined key="more" />
                                ]}
                                size="small"
                            >
                                <Card.Meta
                                    title={file.orignlFileNm}
                                    description={<span style={{ fontSize: 11 }}>{Math.round(file.fileSize / 1024)} KB</span>}
                                />
                                {file.fileWidth > 0 && (
                                    <div style={{ marginTop: 5, fontSize: 10, color: '#888' }}>
                                        {file.fileWidth} x {file.fileHeight}
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </Content>

            <Modal
                title="새 폴더 생성"
                open={modalVisible}
                onOk={handleCreateFolder}
                onCancel={() => setModalVisible(false)}
            >
                <Input
                    placeholder="폴더명 입력"
                    value={newFolderName}
                    onChange={e => setNewFolderName(e.target.value)}
                />
            </Modal>
        </Layout>
    );
};

export default MediaLibrary;
