import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotifyContext } from '../hooks/useNotifyContext';
import announcementsApi from '../api/announcementsApi';
import AnnouncementForm from '../components/announcements/AnnouncementForm';
import Loader from '../components/common/Loader';

function AnnouncementEditPage() {
    const { id } = useParams();
    const notify = useNotifyContext();
    const navigate = useNavigate();
    const [existing, setExisting] = useState(null);
    const [fetching, setFetching] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        announcementsApi.getById(id)
            .then(setExisting)
            .catch(() => notify.error('Failed to load announcement.'))
            .finally(() => setFetching(false));
    }, [id, notify]);

    const handleSubmit = (payload) => {
        setSaving(true);
        announcementsApi.update(id, { ...existing, ...payload })
            .then((saved) => {
                notify.success('Announcement updated!');
                navigate(`/announcements/${saved.id}`);
            })
            .catch(() => {
                notify.error('Failed to save.');
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
                        <span>Announcement</span>
                    </h1>
                </div>
            </header>
            <div className="announcement-detail" style={{ maxWidth: '700px' }}>
                <AnnouncementForm
                    existing={existing}
                    onSubmit={handleSubmit}
                    loading={saving}
                />
            </div>
        </>
    );
}

export default AnnouncementEditPage;
