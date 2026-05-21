import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import RequireAuth from './components/layout/RequireAuth';
import RequireAdmin from './components/layout/RequireAdmin';
import LoginPage from './pages/LoginPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import AnnouncementDetailPage from './pages/AnnouncementDetailPage';
import AnnouncementCreatePage from './pages/AnnouncementCreatePage';
import AnnouncementEditPage from './pages/AnnouncementEditPage';
import UsersListPage from './pages/UsersListPage';
import UserDetailPage from './pages/UserDetailPage';
import UserCreatePage from './pages/UserCreatePage';
import UserEditPage from './pages/UserEditPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
    return (
        <Routes>
            <Route element={<AppLayout />}>

                <Route path="/login" element={<LoginPage />} />

                <Route path="/" element={<RequireAuth><AnnouncementsPage filter="all" /></RequireAuth>} />
                <Route path="/public" element={<RequireAuth><AnnouncementsPage filter="public" /></RequireAuth>} />
                <Route path="/local" element={<RequireAuth><AnnouncementsPage filter="local" /></RequireAuth>} />
                <Route path="/my" element={<RequireAuth><AnnouncementsPage filter="my" /></RequireAuth>} />

                <Route path="/announcements/:id" element={<RequireAuth><AnnouncementDetailPage /></RequireAuth>} />
                <Route path="/create" element={<RequireAuth><AnnouncementCreatePage /></RequireAuth>} />
                <Route path="/edit/:id" element={<RequireAuth><AnnouncementEditPage /></RequireAuth>} />

                <Route path="/users" element={<RequireAdmin><UsersListPage /></RequireAdmin>} />
                <Route path="/users/create" element={<RequireAdmin><UserCreatePage /></RequireAdmin>} />
                <Route path="/users/:id" element={<RequireAdmin><UserDetailPage /></RequireAdmin>} />
                <Route path="/users/:id/edit" element={<RequireAdmin><UserEditPage /></RequireAdmin>} />

                <Route path="*" element={<NotFoundPage />} />

            </Route>
        </Routes>
    );
}

export default App;
