import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import NotificationContainer from '../common/NotificationContainer';
import { useAuth } from '../../hooks/useAuth';

function AppLayout() {
    const { user } = useAuth();

    return (
        <div className={user ? 'app-shell' : 'app-shell app-shell--no-sidebar'}>
            <Header />
            {user && <Sidebar />}
            <main id="app-main" className="main-content" role="main">
                <Outlet />
            </main>
            <NotificationContainer />
        </div>
    );
}

export default AppLayout;
