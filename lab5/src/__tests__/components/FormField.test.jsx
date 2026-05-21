import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import FormField from '../../components/common/FormField';

describe('FormField component', () => {
    test('renders label text', () => {
        render(
            <FormField id="test" label="Username">
                <input id="test" type="text" />
            </FormField>,
        );
        expect(screen.getByText('Username')).toBeInTheDocument();
    });

    test('label htmlFor matches input id', () => {
        render(
            <FormField id="email" label="Email">
                <input id="email" type="email" />
            </FormField>,
        );
        const label = screen.getByText('Email');
        expect(label).toHaveAttribute('for', 'email');
    });

    test('renders children (input)', () => {
        render(
            <FormField id="name" label="Name">
                <input id="name" type="text" data-testid="name-input" />
            </FormField>,
        );
        expect(screen.getByTestId('name-input')).toBeInTheDocument();
    });

    test('renders error message when error prop provided', () => {
        render(
            <FormField id="pass" label="Password" error="Too short">
                <input id="pass" type="password" />
            </FormField>,
        );
        expect(screen.getByText('Too short')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    test('renders hint when no error', () => {
        render(
            <FormField id="user" label="User" hint="Min 3 chars">
                <input id="user" type="text" />
            </FormField>,
        );
        expect(screen.getByText('Min 3 chars')).toBeInTheDocument();
    });

    test('does not render hint when error is present', () => {
        render(
            <FormField id="u" label="U" error="Required" hint="Min 3 chars">
                <input id="u" type="text" />
            </FormField>,
        );
        expect(screen.queryByText('Min 3 chars')).toBeNull();
        expect(screen.getByText('Required')).toBeInTheDocument();
    });

    test('does not render error when not provided', () => {
        render(
            <FormField id="x" label="X">
                <input id="x" type="text" />
            </FormField>,
        );
        expect(screen.queryByRole('alert')).toBeNull();
    });
});
