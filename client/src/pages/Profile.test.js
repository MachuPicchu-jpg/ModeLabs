import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import Profile from './Profile';
import { useAuth } from '../contexts/AuthContext';
import { auth, db } from '../config/firebase';
import { updateProfile, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Mock the AuthContext
jest.mock('../contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}));

// Mock Firebase functions
jest.mock('firebase/auth', () => ({
    updateProfile: jest.fn(),
    signOut: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
    doc: jest.fn(),
    getDoc: jest.fn(),
    setDoc: jest.fn(),
}));

describe('Profile', () => {
    beforeEach(() => {
        useAuth.mockReturnValue({ user: { uid: 'test-user-id', displayName: 'Test User', email: 'test@example.com', photoURL: 'test-photo-url' } });
        getDoc.mockResolvedValue({
            exists: () => true,
            data: () => ({
                bio: 'Test bio',
                organization: 'Test organization',
                role: 'Test role',
                photoURL: 'test-photo-url',
            }),
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders profile page with user info', async () => {
        render(
            <Router>
                <Profile />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText('Test User')).toBeInTheDocument();
            expect(screen.getByText('test@example.com')).toBeInTheDocument();
            expect(screen.getByText('Test organization')).toBeInTheDocument();
            expect(screen.getByText('Test bio')).toBeInTheDocument();
        });
    });

    test('toggles to edit mode', async () => {
        render(
            <Router>
                <Profile />
            </Router>
        );

        fireEvent.click(screen.getByText('Edit Profile'));

        await waitFor(() => {
            expect(screen.getByPlaceholderText('Display Name')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Organization')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Bio')).toBeInTheDocument();
        });
    });

    test('updates profile info', async () => {
        updateProfile.mockResolvedValue({});
        setDoc.mockResolvedValue({});

        render(
            <Router>
                <Profile />
            </Router>
        );

        fireEvent.click(screen.getByText('Edit Profile'));

        fireEvent.change(screen.getByPlaceholderText('Display Name'), { target: { value: 'Updated User' } });
        fireEvent.change(screen.getByPlaceholderText('Organization'), { target: { value: 'Updated Organization' } });
        fireEvent.change(screen.getByPlaceholderText('Bio'), { target: { value: 'Updated Bio' } });

        fireEvent.click(screen.getByText('Save Changes'));

        await waitFor(() => {
            expect(updateProfile).toHaveBeenCalledWith(auth.currentUser, { displayName: 'Updated User' });
            expect(setDoc).toHaveBeenCalledWith(expect.any(Object), {
                bio: 'Updated Bio',
                organization: 'Updated Organization',
                role: 'Test role',
                photoURL: 'test-photo-url',
            }, { merge: true });
        });
    });

    test('logs out user', async () => {
        signOut.mockResolvedValue({});

        render(
            <Router>
                <Profile />
            </Router>
        );

        fireEvent.click(screen.getByText('Log Out'));

        await waitFor(() => {
            expect(signOut).toHaveBeenCalledWith(auth);
        });
    });
});