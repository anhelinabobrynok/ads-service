import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmDialog from '../../components/common/ConfirmDialog';

describe('ConfirmDialog component', () => {
    const defaultProps = {
        isOpen: true,
        title: 'Delete Item?',
        message: 'This cannot be undone.',
        onConfirm: jest.fn(),
        onCancel: jest.fn(),
    };

    beforeEach(() => {
        defaultProps.onConfirm.mockClear();
        defaultProps.onCancel.mockClear();
    });

    test('renders nothing when isOpen is false', () => {
        const { container } = render(<ConfirmDialog {...defaultProps} isOpen={false} />);
        expect(container.firstChild).toBeNull();
    });

    test('renders title when open', () => {
        render(<ConfirmDialog {...defaultProps} />);
        expect(screen.getByText('Delete Item?')).toBeInTheDocument();
    });

    test('renders message when open', () => {
        render(<ConfirmDialog {...defaultProps} />);
        expect(screen.getByText('This cannot be undone.')).toBeInTheDocument();
    });

    test('calls onConfirm when confirm button clicked', () => {
        render(<ConfirmDialog {...defaultProps} />);
        fireEvent.click(screen.getByText('Confirm'));
        expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    });

    test('calls onCancel when cancel button clicked', () => {
        render(<ConfirmDialog {...defaultProps} />);
        fireEvent.click(screen.getByText('Cancel'));
        expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });

    test('renders custom confirm label', () => {
        render(<ConfirmDialog {...defaultProps} confirmLabel="Yes, Delete" />);
        expect(screen.getByText('Yes, Delete')).toBeInTheDocument();
    });

    test('renders custom cancel label', () => {
        render(<ConfirmDialog {...defaultProps} cancelLabel="No, Go Back" />);
        expect(screen.getByText('No, Go Back')).toBeInTheDocument();
    });

    test('applies danger class when danger prop is true', () => {
        render(<ConfirmDialog {...defaultProps} danger />);
        const confirmBtn = screen.getByText('Confirm');
        expect(confirmBtn).toHaveClass('btn--danger');
    });

    test('applies primary class when danger prop is false', () => {
        render(<ConfirmDialog {...defaultProps} danger={false} />);
        const confirmBtn = screen.getByText('Confirm');
        expect(confirmBtn).toHaveClass('btn--primary');
    });

    test('has dialog role', () => {
        render(<ConfirmDialog {...defaultProps} />);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
});
