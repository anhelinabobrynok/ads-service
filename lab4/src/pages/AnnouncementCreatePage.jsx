import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifyContext } from '../hooks/useNotifyContext';
import announcementsApi from '../api/announcementsApi';
import AnnouncementForm from '../components/announcements/AnnouncementForm';

function AnnouncementCreatePage() {
    const { user } = useAuth();
    const notify = useNotifyContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (payload) => {
        setLoading(true);
        announcementsApi.create({
            ...payload,
            authorId: user.id,
            authorName: user.username,
            location: user.location,
        })
            .then((saved) => {
                notify.success('Announcement published!');
                navigate(`/announcements/${saved.id}`);
            })
            .catch(() => {
                notify.error('Failed to publish. Please try again.');
                setLoading(false);
            });
    };

    return (
        <>
            <header className="page-header">
                <div>
                    <h1 className="page-header__title">
                        New
                        {' '}
                        <span>Announcement</span>
                    </h1>
                </div>
            </header>
            <div className="announcement-detail" style={{ maxWidth: '700px' }}>
                <AnnouncementForm onSubmit={handleSubmit} loading={loading} />
            </div>
        </>
    );
}

export default AnnouncementCreatePage;
