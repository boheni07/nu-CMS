import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, Select, Tag, Card, Breadcrumb, message, Modal, Timeline, Typography, Divider, Dropdown, Tooltip } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined, RollbackOutlined, FileTextOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import axios from '../api/axios';

const { Option } = Select;
const { Text } = Typography;

const ContentList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyModalVisible, setHistoryModalVisible] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [searchParams, setSearchParams] = useState({ sj: '', sttusCode: '' });
    const [previewModalVisible, setPreviewModalVisible] = useState(false);
    const [previewContent, setPreviewContent] = useState(null);
    const navigate = useNavigate();

    const fetchData = async (params = {}) => {
        setLoading(true);
        try {
            const response = await axios.get('/cms/content', {
                params: {
                    ...searchParams,
                    ...params
                }
            });
            if (response.data.success) {
                setData(response.data.data);
            }
        } catch (error) {
            console.error('API Error:', error);
            message.error('데이터를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = () => {
        fetchData({ current: 1 });
    };

    const handlePreview = (record) => {
        setPreviewContent(record);
        setPreviewModalVisible(true);
    };

    const showHistory = async (id) => {
        console.log('showHistory called for id:', id);
        setCurrentId(id);
        try {
            const response = await axios.get(`/cms/content/${id}/history`);
            console.log('History response:', response);
            if (response.data.success) {
                setHistory(response.data.data);
                setHistoryModalVisible(true);
            } else {
                message.error(response.data.message || '이력을 불러오지 못했습니다.');
            }
        } catch (error) {
            console.error('History fetch error:', error);
            const errMsg = error.response?.data?.message || error.message || '이력을 불러오는데 실패했습니다.';
            message.error(errMsg);
        }
    };

    const handleRollback = async (histId) => {
        Modal.confirm({
            title: '버전 롤백',
            content: '선택한 버전으로 콘텐츠를 복구하시겠습니까? (현재 상태는 임시저장으로 변경됩니다)',
            onOk: async () => {
                try {
                    const response = await axios.post(`/cms/content/${currentId}/rollback/${histId}`);
                    if (response.data.success) {
                        message.success('롤백되었습니다.');
                        setHistoryModalVisible(false);
                        fetchData();
                    }
                } catch (error) {
                    message.error('롤백에 실패했습니다.');
                }
            }
        });
    };


    const handleDelete = (cntentsId) => {
        Modal.confirm({
            title: '삭제 확인',
            content: '정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
            okText: '삭제',
            okType: 'danger',
            cancelText: '취소',
            onOk: async () => {
                try {
                    const response = await axios.delete(`/cms/content/${cntentsId}`);
                    if (response.data.success) {
                        message.success('삭제되었습니다.');
                        fetchData(pagination);
                    } else {
                        message.error(response.data.message || '삭제에 실패했습니다.');
                    }
                } catch (error) {
                    console.error('Delete error:', error);
                    message.error('삭제 중 오류가 발생했습니다.');
                }
            },
        });
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'cntentsId',
            key: 'cntentsId',
            width: 90, // 100 -> 90
            align: 'center',
        },
        {
            title: '카테고리',
            dataIndex: 'ctgryId',
            key: 'ctgryId',
            width: 90, // 100 -> 90
            align: 'center',
            render: (id) => <Tag>{id || '미지정'}</Tag>,
        },
        {
            title: '제목',
            dataIndex: 'sj',
            key: 'sj',
            ellipsis: true,
            render: (text, record) => (
                <a onClick={() => handlePreview(record)} style={{ cursor: 'pointer' }}>
                    {text}
                </a>
            ),
        },
        {
            title: '작성자',
            dataIndex: 'wrterId',
            key: 'wrterId',
            width: 80, // 90 -> 80
            align: 'center',
        },
        {
            title: '버전',
            dataIndex: 'verNo',
            key: 'verNo',
            width: 60, // 70 -> 60
            align: 'center',
            render: (text) => `v${text}`,
        },
        {
            title: '상태',
            dataIndex: 'sttusCode',
            key: 'sttusCode',
            width: 80, // 90 -> 80
            align: 'center',
            render: (code) => {
                const statusMap = {
                    'I': { color: 'default', text: '임시' },
                    'R': { color: 'orange', text: '검토' },
                    'A': { color: 'cyan', text: '승인' },
                    'P': { color: 'green', text: '게시' },
                    'D': { color: 'red', text: '종료' },
                };
                const status = statusMap[code] || { color: 'default', text: code };
                return <Tag color={status.color}>{status.text}</Tag>;
            },
        },
        {
            title: '수정일',
            dataIndex: 'lastUpdtPnttm',
            key: 'lastUpdtPnttm',
            width: 130, // 140 -> 130
            align: 'center',
            render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
        },
        {
            title: '관리',
            key: 'action',
            width: 190, // 200 -> 190
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button size="small" icon={<EditOutlined />} onClick={() => navigate(`/content/edit/${record.cntentsId}`)}>수정</Button>
                    <Button size="small" icon={<HistoryOutlined />} onClick={() => showHistory(record.cntentsId)}>이력</Button>
                    <Button size="small" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.cntentsId)}>삭제</Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Breadcrumb style={{ marginBottom: 16 }}>
                <Breadcrumb.Item>CMS</Breadcrumb.Item>
                <Breadcrumb.Item>콘텐츠 목록</Breadcrumb.Item>
            </Breadcrumb>

            <Card style={{ marginBottom: 16 }}>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Space>
                        <Select
                            placeholder="상태 선택"
                            style={{ width: 120 }}
                            value={searchParams.sttusCode}
                            onChange={value => setSearchParams({ ...searchParams, sttusCode: value })}
                        >
                            <Option value="">전체 상태</Option>
                            <Option value="I">임시</Option>
                            <Option value="R">검토</Option>
                            <Option value="A">승인</Option>
                            <Option value="P">게시</Option>
                            <Option value="D">종료</Option>
                        </Select>
                        <Input.Search
                            placeholder="제목 검색"
                            style={{ width: 300 }}
                            value={searchParams.sj}
                            onChange={e => setSearchParams({ ...searchParams, sj: e.target.value })}
                            onSearch={handleSearch}
                            enterButton
                        />
                    </Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/content/new')}>
                        신규 등록
                    </Button>
                </Space>
            </Card>

            <Card
                title={<span><FileTextOutlined /> 콘텐츠 목록</span>}
                bodyStyle={{ padding: 0 }} // 테이블 카드 패딩 제거로 깔끔하게
            >
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="cntentsId"
                    loading={loading}
                    pagination={pagination}
                    onChange={(p) => setPagination(p)}
                    size="small"
                    style={{ tableLayout: 'fixed' }} // 테이블 레이아웃 고정으로 가로 폭 준수
                />
            </Card>

            <Modal
                title="콘텐츠 수정 이력"
                open={historyModalVisible}
                onCancel={() => setHistoryModalVisible(false)}
                footer={null}
                width={600}
            >
                <Timeline
                    mode="left"
                    items={history.length > 0 ? history.map(hist => ({
                        label: dayjs(hist.updtPnttm).format('YYYY-MM-DD HH:mm:ss'),
                        children: (
                            <Card size="small" style={{ marginBottom: 8 }}>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text strong>v{hist.verNo} - {hist.sj}</Text>
                                        <Button
                                            size="small"
                                            type="link"
                                            icon={<RollbackOutlined />}
                                            onClick={() => handleRollback(hist.histId)}
                                        >
                                            이 버전으로 복구
                                        </Button>
                                    </div>
                                    <Text type="secondary">상태: {hist.sttusCode} | 작성자: {hist.wrterId}</Text>
                                </Space>
                            </Card>
                        ),
                    })) : [{ children: '저장된 이력이 없습니다.' }]}
                />
            </Modal>

            <Modal
                title="콘텐츠 미리보기"
                open={previewModalVisible}
                onCancel={() => setPreviewModalVisible(false)}
                footer={null}
                width={800}
            >
                {previewContent && (
                    <div>
                        <Typography.Title level={4}>{previewContent.sj}</Typography.Title>
                        <Space style={{ marginBottom: 16 }}>
                            <Tag color="blue">{previewContent.ctgryId || '미지정'}</Tag>
                            <Text type="secondary">작성자: {previewContent.wrterId}</Text>
                            <Text type="secondary">|</Text>
                            <Text type="secondary">수정일: {dayjs(previewContent.lastUpdtPnttm).format('YYYY-MM-DD HH:mm')}</Text>
                        </Space>
                        <Divider />
                        <div
                            className="preview-content"
                            dangerouslySetInnerHTML={{ __html: previewContent.cn }}
                            style={{ minHeight: '200px', padding: '10px', border: '1px solid #f0f0f0', borderRadius: '4px' }}
                        />
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ContentList;
