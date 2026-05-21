import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/format';

function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="site-header" role="banner">
            <Link to="/" className="site-header__logo" aria-label="AdBoard home">
                Ad
                <span>Board</span>
            </Link>

            <div className="site-header__actions">
                {user ? (
                    <>
                        <div className="site-header__location" aria-label="Your location">
                            📍
                            {' '}
                            {user.location || 'Unknown'}
                        </div>
                        <div className="site-header__user">
                            <div className="site-header__avatar" aria-hidden="true">
                                {getInitials(user.username)}
                            </div>
                            <span>{user.username}</span>
                            {user.role === 'admin' && (
                                <span className="badge-admin">Admin</span>
                            )}
                        </div>
                        <button
                            type="button"
                            className="btn--secondary"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="btn--primary">Login</Link>
                )}
            </div>
        </header>
    );
}

export default Header;
