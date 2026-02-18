import React, { useState, useEffect } from 'react';
import { Tree, Space, Button, Card, Breadcrumb, message, Tag, Modal, Typography, Row, Col, Form, Input, Select, InputNumber, Divider } from 'antd';
import {
    PlusOutlined, DeleteOutlined, SaveOutlined, LinkOutlined,
    FileTextOutlined, LayoutOutlined, ReloadOutlined, ClusterOutlined, FormOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const { Text } = Typography;
const { Option } = Select;

const MenuList = () => {
    const [treeData, setTreeData] = useState([]);
    const [rawData, setRawData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isChanged, setIsChanged] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [form] = Form.useForm();
    const [editMode, setEditMode] = useState(false); // false: 등록, true: 수정
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/cms/menu');
            if (response.data.success) {
                const flatList = response.data.data || [];
                setRawData(flatList);
                const treeStructure = buildTree(flatList);
                const formatted = formatTreeData(treeStructure);
                setTreeData(formatted);
                setIsChanged(false);
            }
        } catch (error) {
            console.error(error);
            message.error('메뉴 데이터를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // Flat List -> Tree Structure 변환
    const buildTree = (flatList) => {
        const dataMap = {};
        const tree = [];

        // Deep copy to avoid mutating original list during multiple renders
        const listCopy = JSON.parse(JSON.stringify(flatList));

        listCopy.forEach(item => {
            dataMap[item.menuId] = { ...item, children: [] };
        });

        listCopy.forEach(item => {
            const node = dataMap[item.menuId];
            if (item.upperMenuId && dataMap[item.upperMenuId]) {
                dataMap[item.upperMenuId].children.push(node);
            } else {
                tree.push(node);
            }
        });

        return tree;
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'LINK': return <LinkOutlined />;
            case 'CONT': return <FileTextOutlined />;
            case 'WIDG': return <LayoutOutlined />;
            default: return <FileTextOutlined />;
        }
    };

    const formatTreeData = (nodes) => {
        return nodes.map(node => ({
            ...node,
            key: node.menuId,
            title: (
                <Space>
                    {getTypeIcon(node.menuTyCode)}
                    <Text strong={node.useAt === 'Y'} type={node.useAt === 'N' ? 'secondary' : undefined}>
                        {node.menuNm}
                    </Text>
                    <span style={{ color: '#999', fontSize: '0.8em' }}>({node.menuId})</span>
                    {node.menuTyCode === 'LINK' && <Tag color="orange" style={{ fontSize: '10px', lineHeight: '18px' }}>Link</Tag>}
                </Space>
            ),
            children: node.children && node.children.length > 0 ? formatTreeData(node.children) : []
        }));
    };

    const handleSelect = (keys, info) => {
        if (keys.length > 0) {
            const key = keys[0];
            setSelectedKeys(keys);
            const selectedNode = rawData.find(item => item.menuId === key);
            if (selectedNode) {
                setEditMode(true);
                form.setFieldsValue(selectedNode);
            }
        } else {
            // 선택 해제 시 폼 유지 또는 초기화? 여기서는 초기화 안함 (실수로 해제할 수 있으니)
            // setSelectedKeys([]);
        }
    };

    const handleCreateNew = () => {
        setSelectedKeys([]);
        setEditMode(false);
        form.resetFields();
        form.setFieldsValue({
            useAt: 'Y',
            expsrOrdr: 1,
            menuTyCode: 'CONT'
        });

        // 만약 특정 노드가 선택된 상태에서 '하위 메뉴 추가' 같은 기능이라면 upperMenuId를 넣어줄 수 있음
        // 여기서는 '신규 루트/메뉴 등록' 버튼이므로 완전 초기화
    };

    const handleDelete = async () => {
        if (selectedKeys.length === 0) {
            message.warning('삭제할 메뉴를 선택하세요.');
            return;
        }

        const menuId = selectedKeys[0];

        Modal.confirm({
            title: '메뉴 삭제',
            content: '정말 삭제하시겠습니까? 하위 메뉴가 있는 경우 함께 삭제되거나 오류가 발생할 수 있습니다.',
            okText: '삭제',
            okType: 'danger',
            onOk: async () => {
                try {
                    const response = await axios.delete(`/cms/menu/${menuId}`);
                    if (response.data.success) {
                        message.success('삭제되었습니다.');
                        handleCreateNew(); // 폼 초기화
                        fetchData(); // 트리 목록 갱신
                    }
                } catch (error) {
                    message.error('삭제에 실패했습니다.');
                }
            }
        });
    };

    const onFinish = async (values) => {
        // 수정 모드인데 ID가 변경되었다면? PK이므로 변경 불가 처리하거나, 백엔드에서 처리 필요.
        // 여기서는 ID 변경 불가(disabled) 처리함.

        try {
            let response;
            if (editMode) {
                const currentId = selectedKeys[0];
                response = await axios.put(`/cms/menu/${currentId}`, values);
            } else {
                response = await axios.post('/cms/menu', values);
            }

            if (response.data.success) {
                message.success(editMode ? '수정되었습니다.' : '등록되었습니다.');
                fetchData();
                if (!editMode) {
                    // 신규 등록 후 해당 폼 유지할지 초기화할지 결정. 여기서는 폼 값을 유지하되 모드는 수정모드로? 
                    // 아니면 폼 초기화. 
                    handleCreateNew();
                }
            } else {
                message.error(response.data.message || '저장에 실패했습니다.');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || '저장 중 오류가 발생했습니다.';
            message.error(errorMsg);
        }
    };

    // 드래그 앤 드롭 로직 (기존 유지)
    const handleDrop = (info) => {
        const dropKey = info.node.key;
        const dragKey = info.dragNode.key;
        const dropPos = info.node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

        const data = [...treeData];

        let dragObj;
        const loop = (data, key, callback) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].key === key) {
                    return callback(data[i], i, data);
                }
                if (data[i].children) {
                    loop(data[i].children, key, callback);
                }
            }
        };

        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
        });

        if (!info.dropToGap) {
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                dragObj.upperMenuId = item.menuId;
                item.children.unshift(dragObj);
            });
        } else if (
            (info.node.props.children || []).length > 0 &&
            info.node.props.expanded &&
            dropPosition === 1
        ) {
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                dragObj.upperMenuId = item.menuId;
                item.children.unshift(dragObj);
            });
        } else {
            let ar = [];
            let i;
            loop(data, dropKey, (_item, index, arr) => {
                ar = arr;
                i = index;
            });
            if (dropPosition === -1) {
                dragObj.upperMenuId = ar[i].upperMenuId;
                ar.splice(i, 0, dragObj);
            } else {
                dragObj.upperMenuId = ar[i].upperMenuId;
                ar.splice(i + 1, 0, dragObj);
            }
        }

        setTreeData(data);
        setIsChanged(true);
    };

    const saveTreeStructure = async () => {
        const flatList = [];
        const flatten = (nodes, parentId = null, level = 1) => {
            nodes.forEach((node, index) => {
                flatList.push({
                    menuId: node.menuId,
                    menuNm: node.menuNm,
                    upperMenuId: parentId, // 최상위면 null
                    menuLvl: level,
                    menuTyCode: node.menuTyCode,
                    conectUrl: node.conectUrl,
                    expsrOrdr: index + 1,
                    useAt: node.useAt
                });
                if (node.children && node.children.length > 0) {
                    flatten(node.children, node.menuId, level + 1);
                }
            });
        };
        flatten(treeData);

        try {
            setLoading(true);
            const response = await axios.post('/cms/menu-tree/save', flatList);
            if (response.data.success) {
                message.success('메뉴 구조가 저장되었습니다.');
                setIsChanged(false);
                fetchData();
            }
        } catch (error) {
            message.error('메뉴 구조 저장 실패');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <Breadcrumb style={{ marginBottom: 16 }}>
                <Breadcrumb.Item>CMS</Breadcrumb.Item>
                <Breadcrumb.Item>사이트 관리</Breadcrumb.Item>
                <Breadcrumb.Item>메뉴 관리</Breadcrumb.Item>
            </Breadcrumb>

            <Row gutter={[16, 16]}>
                <Col span={10}>
                    <Card
                        title={<span><ClusterOutlined /> 메뉴 구조</span>}
                        extra={
                            <Space>
                                <Button size="small" icon={<ReloadOutlined />} onClick={fetchData} />
                                <Button
                                    size="small"
                                    type="primary"
                                    icon={<SaveOutlined />}
                                    onClick={saveTreeStructure}
                                    disabled={!isChanged}
                                >
                                    구조 저장
                                </Button>
                            </Space>
                        }
                        bodyStyle={{ minHeight: '600px', maxHeight: '800px', overflow: 'auto' }}
                    >
                        <Tree
                            className="draggable-tree"
                            draggable
                            blockNode
                            onDrop={handleDrop}
                            onSelect={handleSelect}
                            selectedKeys={selectedKeys}
                            treeData={treeData}
                            defaultExpandAll
                        />
                    </Card>
                </Col>

                <Col span={14}>
                    <Card
                        title={<span><FormOutlined /> {editMode ? '메뉴 상세 정보 수정' : '신규 메뉴 등록'}</span>}
                        extra={
                            editMode && (
                                <Space>
                                    <Button size="small" onClick={handleCreateNew}>신규 등록 모드</Button>
                                    <Button size="small" danger icon={<DeleteOutlined />} onClick={handleDelete}>삭제</Button>
                                </Space>
                            )
                        }
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            initialValues={{ useAt: 'Y', expsrOrdr: 1, menuTyCode: 'CONT' }}
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="menuId"
                                        label="메뉴 ID"
                                        rules={[
                                            { required: true, message: 'ID를 입력하세요.' },
                                            { pattern: /^[A-Z0-9_]+$/, message: '대문자, 숫자, _ 만 사용 가능' }
                                        ]}
                                    >
                                        <Input disabled={editMode} placeholder="예: MENU_01" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="menuNm"
                                        label="메뉴명"
                                        rules={[{ required: true, message: '메뉴명을 입력하세요.' }]}
                                    >
                                        <Input placeholder="메뉴 이름" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="upperMenuId" label="상위 메뉴 ID">
                                        <Input placeholder="최상위면 비워두세요" />
                                        {/* 추후 TreeSelect로 변경 가능 */}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="menuTyCode" label="메뉴 유형">
                                        <Select>
                                            <Option value="CONT">콘텐츠(페이지)</Option>
                                            <Option value="LINK">외부 링크</Option>
                                            <Option value="WIDG">위젯 모음</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item name="conectUrl" label="연결 URL / 프로그램 경로">
                                <Input placeholder="/content/list 또는 https://..." />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="expsrOrdr" label="노출 순서">
                                        <InputNumber min={0} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="useAt" label="사용 여부">
                                        <Select>
                                            <Option value="Y">사용</Option>
                                            <Option value="N">미사용</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider />

                            <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                                    {editMode ? '수정 내용 저장' : '신규 메뉴 저장'}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default MenuList;
