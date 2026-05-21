import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usersApi from '../api/usersApi';
import { useNotifyContext } from '../hooks/useNotifyContext';
import UserForm from '../components/users/UserForm';

function UserCreatePage() {
    const notify = useNotifyContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (payload) => {
        setLoading(true);
        usersApi.create(payload)
            .then((saved) => {
                notify.success('User created!');
                navigate(`/users/${saved.id}`);
            })
            .catch(() => {
                notify.error('Failed to create user.');
                setLoading(false);
            });
    };

    return (
        <>
            <header className="page-header">
                <div>
                    <h1 className="page-header__title">
                        Create
                        {' '}
                        <span>User</span>
                    </h1>
                </div>
            </header>
            <div className="announcement-detail" style={{ maxWidth: '520px' }}>
                <UserForm onSubmit={handleSubmit} loading={loading} />
            </div>
        </>
    );
}

export default UserCreatePage;
