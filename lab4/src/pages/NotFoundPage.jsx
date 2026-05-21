import EmptyState from '../components/common/EmptyState';

function NotFoundPage() {
    return (
        <EmptyState
            icon="🔍"
            title="Page not found"
            description="The page you are looking for does not exist."
            actionLabel="Go to Home"
            actionTo="/"
        />
    );
}

export default NotFoundPage;
