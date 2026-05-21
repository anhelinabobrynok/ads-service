import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import usersApi from '../api/usersApi';
import { useNotifyContext } from '../hooks/useNotifyContext';
import UserForm from '../components/users/UserForm';
import Loader from '../components/common/Loader';

function UserEditPage() {
    const { id } = useParams();
    const notify = useNotifyContext();
    const navigate = useNavigate();
    const [existing, setExisting] = useState(null);
    const [fetching, setFetching] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        usersApi.getById(id)
            .then(setExisting)
            .catch(() => notify.error('Failed to load user.'))
            .finally(() => setFetching(false));
    }, [id, notify]);

    const handleSubmit = (payload) => {
        setSaving(true);
        usersApi.update(id, { ...existing, ...payload })
            .then((saved) => {
                notify.success('User updated!');
                navigate(`/users/${saved.id}`);
            })
            .catch(() => {
                notify.error('Failed to save changes.');
                setSaving(false);
            });
    };

    if (fetching) return <Loader />;

    return (
        <>
            <header className="page-header">
                <div>
                    <h1 className="page-header__title">
                        Edit
                        {' '}
                        <span>User</span>
                    </h1>
                    {existing && (
                        <p className="page-header__subtitle">
                            {`Editing: ${existing.username}`}
                        </p>
                    )}
                </div>
            </header>
            <div className="announcement-detail" style={{ maxWidth: '520px' }}>
                <UserForm
                    existing={existing}
                    onSubmit={handleSubmit}
                    loading={saving}
                />
            </div>
        </>
    );
}

export default UserEditPage;
