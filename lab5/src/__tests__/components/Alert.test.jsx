import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Alert from '../../components/common/Alert';

describe('Alert component', () => {
    const mockDismiss = jest.fn();

    const successNotification = { id: 1, message: 'Operation successful', type: 'success' };
    const errorNotification = { id: 2, message: 'Something went wrong', type: 'error' };
    const warningNotification = { id: 3, message: 'Be careful', type: 'warning' };

    beforeEach(() => {
        mockDismiss.mockClear();
    });

    test('renders message text', () => {
        render(<Alert notification={successNotification} onDismiss={mockDismiss} />);
        expect(screen.getByText('Operation successful')).toBeInTheDocument();
    });

    test('renders correct icon for success', () => {
        render(<Alert notification={successNotification} onDismiss={mockDismiss} />);
        expect(screen.getByText('✓')).toBeInTheDocument();
    });

    test('renders correct icon for error', () => {
        render(<Alert notification={errorNotification} onDismiss={mockDismiss} />);
        expect(screen.getByText('✕')).toBeInTheDocument();
    });

    test('renders correct icon for warning', () => {
        render(<Alert notification={warningNotification} onDismiss={mockDismiss} />);
        expect(screen.getByText('⚠')).toBeInTheDocument();
    });

    test('applies correct CSS class for success type', () => {
        const { container } = render(
            <Alert notification={successNotification} onDismiss={mockDismiss} />,
        );
        expect(container.firstChild).toHaveClass('alert--success');
    });

    test('applies correct CSS class for error type', () => {
        const { container } = render(
            <Alert notification={errorNotification} onDismiss={mockDismiss} />,
        );
        expect(container.firstChild).toHaveClass('alert--error');
    });

    test('calls onDismiss with notification id when close button clicked', () => {
        render(<Alert notification={successNotification} onDismiss={mockDismiss} />);
        fireEvent.click(screen.getByRole('button', { name: /close/i }));
        expect(mockDismiss).toHaveBeenCalledWith(1);
    });

    test('close button is accessible', () => {
        render(<Alert notification={successNotification} onDismiss={mockDismiss} />);
        const closeBtn = screen.getByRole('button', { name: /close notification/i });
        expect(closeBtn).toBeInTheDocument();
    });
});
