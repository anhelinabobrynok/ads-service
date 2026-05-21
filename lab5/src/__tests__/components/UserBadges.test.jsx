import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import UserRoleBadge from '../../components/users/UserRoleBadge';
import UserAvatar from '../../components/users/UserAvatar';

describe('UserRoleBadge component', () => {
    test('renders Admin badge for admin role', () => {
        render(<UserRoleBadge role="admin" />);
        expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    test('renders Regular badge for regular role', () => {
        render(<UserRoleBadge role="regular" />);
        expect(screen.getByText('Regular')).toBeInTheDocument();
    });

    test('applies badge-admin class for admin', () => {
        const { container } = render(<UserRoleBadge role="admin" />);
        expect(container.firstChild).toHaveClass('badge-admin');
    });

    test('applies badge-user class for regular', () => {
        const { container } = render(<UserRoleBadge role="regular" />);
        expect(container.firstChild).toHaveClass('badge-user');
    });
});

describe('UserAvatar component', () => {
    test('renders first two initials uppercased', () => {
        render(<UserAvatar username="john_doe" />);
        expect(screen.getByText('JO')).toBeInTheDocument();
    });

    test('renders initials for short username', () => {
        render(<UserAvatar username="ab" />);
        expect(screen.getByText('AB')).toBeInTheDocument();
    });

    test('has aria-hidden attribute', () => {
        const { container } = render(<UserAvatar username="admin" />);
        expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
    });

    test('applies custom size via style', () => {
        const { container } = render(<UserAvatar username="admin" size={48} />);
        expect(container.firstChild).toHaveStyle({ width: '48px', height: '48px' });
    });
});
