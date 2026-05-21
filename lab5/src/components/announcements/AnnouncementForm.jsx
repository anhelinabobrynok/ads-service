import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../common/FormField';
import validate from '../../utils/validate';

const CATEGORIES = [
    { value: 'housing', label: '🏠 Housing' },
    { value: 'electronics', label: '💻 Electronics' },
    { value: 'jobs', label: '💼 Jobs' },
    { value: 'events', label: '🎉 Events' },
    { value: 'pets', label: '🐾 Pets' },
    { value: 'other', label: '📦 Other' },
];

const VISIBILITY_OPTIONS = [
    { value: 'public', label: '🌐 Public — visible to everyone' },
    { value: 'local', label: '📍 Local — visible only to users in my city' },
];

const buildInitialState = (ann) => ({
    title: ann?.title || '',
    body: ann?.body || '',
    visibility: ann?.visibility || '',
    category: ann?.category || '',
    contact: ann?.contact || '',
});

const buildInitialErrors = () => ({
    title: '',
    body: '',
    visibility: '',
    category: '',
});

function AnnouncementForm({ existing = null, onSubmit, loading }) {
    const [fields, setFields] = useState(() => buildInitialState(existing));
    const [errors, setErrors] = useState(buildInitialErrors);
    const navigate = useNavigate();
    const isEdit = existing !== null;

    const setField = (key) => (e) => setFields((prev) => ({ ...prev, [key]: e.target.value }));

    const validateAll = () => {
        const titleErr = validate.runRules(fields.title, [
            validate.required,
            validate.minLength(10),
        ]);
        const bodyErr = validate.runRules(fields.body, [
            validate.required,
            validate.minLength(20),
        ]);
        const visErr = validate.runRules(fields.visibility, [validate.required]);
        const catErr = validate.runRules(fields.category, [validate.required]);

        const next = {
            title: titleErr || '',
            body: bodyErr || '',
            visibility: visErr || '',
            category: catErr || '',
        };
        setErrors(next);
        return !Object.values(next).some(Boolean);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateAll()) return;
        onSubmit({
            title: fields.title.trim(),
            body: fields.body.trim(),
            visibility: fields.visibility,
            category: fields.category,
            contact: fields.contact.trim(),
        });
    };

    const cancelPath = isEdit ? `/announcements/${existing.id}` : '/';

    return (
        <form onSubmit={handleSubmit} noValidate>
            <FormField id="ann-title" label="Title" error={errors.title}>
                <input
                    className={`form-input${errors.title ? ' form-input--error-state' : ''}`}
                    type="text"
                    id="ann-title"
                    value={fields.title}
                    onChange={setField('title')}
                    placeholder="Brief and descriptive title"
                    maxLength={200}
                />
            </FormField>

            <FormField id="ann-body" label="Description" error={errors.body}>
                <textarea
                    className={`form-textarea${errors.body ? ' form-input--error-state' : ''}`}
                    id="ann-body"
                    value={fields.body}
                    onChange={setField('body')}
                    placeholder="Describe your announcement in detail…"
                    rows={6}
                />
            </FormField>

            <FormField
                id="ann-visibility"
                label="Visibility"
                error={errors.visibility}
                hint="Local announcements are for registered users in the same city only."
            >
                <select
                    className={`form-select${errors.visibility ? ' form-input--error-state' : ''}`}
                    id="ann-visibility"
                    value={fields.visibility}
                    onChange={setField('visibility')}
                >
                    <option value="">Choose visibility…</option>
                    {VISIBILITY_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
            </FormField>

            <FormField id="ann-category" label="Category" error={errors.category}>
                <select
                    className={`form-select${errors.category ? ' form-input--error-state' : ''}`}
                    id="ann-category"
                    value={fields.category}
                    onChange={setField('category')}
                >
                    <option value="">Select category…</option>
                    {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>
            </FormField>

            <FormField id="ann-contact" label="Contact Info (optional)">
                <input
                    className="form-input"
                    type="text"
                    id="ann-contact"
                    value={fields.contact}
                    onChange={setField('contact')}
                    placeholder="Phone, email, or Telegram"
                />
            </FormField>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                    type="button"
                    className="btn--secondary"
                    onClick={() => navigate(cancelPath)}
                >
                    Cancel
                </button>
                <button type="submit" className="btn--primary" disabled={loading}>
                    {loading ? 'Saving…' : (isEdit ? 'Save Changes' : 'Publish Announcement')}
                </button>
            </div>
        </form>
    );
}

export default AnnouncementForm;
