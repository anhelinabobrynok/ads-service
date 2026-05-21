import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const NAV_LINK_CLASS = ({ isActive }) => (isActive
    ? 'sidebar__nav-link--active'
    : 'sidebar__nav-link');

function Sidebar() {
    const { user, isAdmin } = useAuth();

    if (!user) return null;

    return (
        <aside className="sidebar" role="complementary">
            <nav role="navigation" aria-label="Main navigation">
                <p className="sidebar__section-label">Browse</p>

                <NavLink to="/" end className={NAV_LINK_CLASS}>
                    <span className="sidebar__nav-icon" aria-hidden="true">📋</span>
                    All Announcements
                </NavLink>

                <NavLink to="/public" className={NAV_LINK_CLASS}>
                    <span className="sidebar__nav-icon" aria-hidden="true">🌐</span>
                    Public
                </NavLink>

                <NavLink to="/local" className={NAV_LINK_CLASS}>
                    <span className="sidebar__nav-icon" aria-hidden="true">📍</span>
                    {`Local (${user.location})`}
                </NavLink>

                <p className="sidebar__section-label">My Content</p>

                <NavLink to="/my" className={NAV_LINK_CLASS}>
                    <span className="sidebar__nav-icon" aria-hidden="true">✏️</span>
                    My Announcements
                </NavLink>

                {isAdmin && (
                    <>
                        <p className="sidebar__section-label">Administration</p>
                        <NavLink to="/users" className={NAV_LINK_CLASS}>
                            <span className="sidebar__nav-icon" aria-hidden="true">👥</span>
                            Manage Users
                        </NavLink>
                    </>
                )}
            </nav>
        </aside>
    );
}

export default Sidebar;
