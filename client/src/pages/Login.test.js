import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './Login';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';

// Mock the Firebase auth functions
jest.mock('firebase/auth', () => ({
    signInWithEmailAndPassword: jest.fn(),
    signInWithPopup: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    GoogleAuthProvider: jest.fn(),
}));

describe('Login', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders login form', () => {
        render(
            <Router>
                <Login />
            </Router>
        );
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    test('toggles to sign up form', () => {
        render(
            <Router>
                <Login />
            </Router>
        );
        fireEvent.click(screen.getByText("Don't have an account? Sign Up"));
        expect(screen.getByText('Create Account')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    });

    test('shows error if passwords do not match during sign up', async () => {
        render(
            <Router>
                <Login />
            </Router>
        );
        fireEvent.click(screen.getByText("Don't have an account? Sign Up"));
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password456' } });
        fireEvent.click(screen.getByText('Sign Up'));

        await waitFor(() => {
            expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
        });
    });

    test('calls signInWithEmailAndPassword on sign in', async () => {
        signInWithEmailAndPassword.mockResolvedValue({});

        render(
            <Router>
                <Login />
            </Router>
        );
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByText('Sign In'));

        await waitFor(() => {
            expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
        });
    });

    test('calls createUserWithEmailAndPassword on sign up', async () => {
        createUserWithEmailAndPassword.mockResolvedValue({});

        render(
            <Router>
                <Login />
            </Router>
        );
        fireEvent.click(screen.getByText("Don't have an account? Sign Up"));
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByText('Sign Up'));

        await waitFor(() => {
            expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
        });
    });

    test('calls signInWithPopup on Google sign in', async () => {
        signInWithPopup.mockResolvedValue({});

        render(
            <Router>
                <Login />
            </Router>
        );
        fireEvent.click(screen.getByText('Continue with Google'));

        await waitFor(() => {
            expect(signInWithPopup).toHaveBeenCalled();
        });
    });
});