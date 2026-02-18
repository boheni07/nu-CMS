import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import ContentList from './pages/ContentList';
import ContentForm from './pages/ContentForm';
import MenuList from './pages/MenuList';
import MenuForm from './pages/MenuForm';
import WidgetManagement from './pages/WidgetManagement';
import SitePreview from './pages/SitePreview';
import TemplateList from './pages/TemplateList';
import TemplateForm from './pages/TemplateForm';
import MemberManagement from './pages/MemberManagement';
import RoleManagement from './pages/RoleManagement';
import BoardManagementPage from './pages/BoardManagement';
import ArticleList from './pages/ArticleList';
import ArticleForm from './pages/ArticleForm';
import SystemConfig from './pages/SystemConfig';
import AuditLogList from './pages/AuditLogList';
import WorkflowDashboard from './pages/WorkflowDashboard';
import MediaLibrary from './pages/MediaLibrary';
import StatsDashboard from './pages/StatsDashboard';


// PV Logger Component
const PvLogger = () => {
  const location = useLocation();
  const [axiosInstance] = React.useState(() => import('./api/axios').then(m => m.default));

  React.useEffect(() => {
    // PV 기록 API 호출
    const logPv = async () => {
      try {
        const axios = await axiosInstance;
        await axios.post('/cms/stats/pv', {
          url: location.pathname,
          referer: document.referrer
        });
      } catch (e) {
        // Ignore errors
      }
    };
    logPv();
  }, [location, axiosInstance]);

  return null;
};

function App() {
  console.log('App.jsx: Safe Mode (Dashboard & ContentList Only)');
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
        },
      }}
    >
      <BrowserRouter>
        <PvLogger />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="content" element={<ContentList />} />
            <Route path="content/new" element={<ContentForm />} />
            <Route path="content/edit/:id" element={<ContentForm />} />
            <Route path="menu" element={<MenuList />} />
            <Route path="menu/new" element={<MenuForm />} />
            <Route path="menu/edit/:id" element={<MenuForm />} />
            <Route path="widget" element={<WidgetManagement />} />
            <Route path="preview" element={<SitePreview />} />
            <Route path="template" element={<TemplateList />} />
            <Route path="template/new" element={<TemplateForm />} />
            <Route path="template/edit/:id" element={<TemplateForm />} />
            <Route path="member" element={<MemberManagement />} />
            <Route path="role" element={<RoleManagement />} />
            <Route path="board-master" element={<BoardManagementPage />} />
            <Route path="board/:bbsId/articles" element={<ArticleList />} />
            <Route path="board/:bbsId/articles/new" element={<ArticleForm />} />
            <Route path="board/:bbsId/articles/:nttId/edit" element={<ArticleForm />} />
            <Route path="config" element={<SystemConfig />} />
            <Route path="audit-log" element={<AuditLogList />} />
            <Route path="workflow" element={<WorkflowDashboard />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="stats" element={<StatsDashboard />} />
            {/* 
            <Route path="search" element={<GlobalSearch />} />
            <Route path="settings" element={<UserSettings />} /> 
            */}
            <Route path="*" element={<div style={{ padding: 20 }}><h2>404 Not Found</h2></div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
