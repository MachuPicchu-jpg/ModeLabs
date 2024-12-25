import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Dataset from './Dataset';
import { useAuth } from '../contexts/AuthContext';

// Mock the AuthContext
jest.mock('../contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}));

// Mock the fetch API
global.fetch = jest.fn();

describe('Dataset', () => {
    beforeEach(() => {
        useAuth.mockReturnValue({ user: { uid: 'test-user-id', email: 'test@example.com' } });
        fetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue([]),
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders loading spinner initially', () => {
        render(<Dataset />);
        expect(screen.getByText('Loading datasets...')).toBeInTheDocument();
    });

    test('fetches and displays datasets', async () => {
        const datasets = [
            { id: 1, name: 'Dataset 1', description: 'Description 1', size: 1024, category: 'Large Language Models', subCategory: 'Language Understanding', userEmail: 'user1@example.com' },
            { id: 2, name: 'Dataset 2', description: 'Description 2', size: 2048, category: 'Multimodal Models', subCategory: 'Image Recognition', userEmail: 'user2@example.com' },
        ];
        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue(datasets),
        });

        render(<Dataset />);

        await waitFor(() => {
            expect(screen.getByText('Dataset 1')).toBeInTheDocument();
            expect(screen.getByText('Dataset 2')).toBeInTheDocument();
        });
    });

    test('opens file selector when "Select File" button is clicked', () => {
        render(<Dataset />);
        const fileInput = screen.getByLabelText('Select File');
        fireEvent.click(screen.getByText('Select File'));
        expect(fileInput).toBeInTheDocument();
    });

    test('uploads a new dataset', async () => {
        render(<Dataset />);
        const file = new File(['dummy content'], 'example.json', { type: 'application/json' });

        fireEvent.click(screen.getByText('Select File'));
        fireEvent.change(screen.getByLabelText('Select File'), { target: { files: [file] } });

        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test description' } });
        fireEvent.click(screen.getByText('Upload'));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/datasets/upload'), expect.any(Object));
        });
    });

    test('deletes a dataset', async () => {
        const datasets = [
            { id: 1, name: 'Dataset 1', description: 'Description 1', size: 1024, category: 'Large Language Models', subCategory: 'Language Understanding', userEmail: 'test@example.com', userId: 'test-user-id' },
        ];
        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue(datasets),
        });

        render(<Dataset />);

        await waitFor(() => {
            expect(screen.getByText('Dataset 1')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTitle('Delete dataset'));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/datasets/1'), { method: 'DELETE' });
        });
    });

    test('downloads a dataset', async () => {
        const datasets = [
            { id: 1, name: 'Dataset 1', description: 'Description 1', size: 1024, category: 'Large Language Models', subCategory: 'Language Understanding', userEmail: 'user1@example.com' },
        ];
        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue(datasets),
        });

        render(<Dataset />);

        await waitFor(() => {
            expect(screen.getByText('Dataset 1')).toBeInTheDocument();
        });

        fetch.mockResolvedValueOnce({
            ok: true,
            blob: jest.fn().mockResolvedValue(new Blob(['dummy content'], { type: 'application/json' })),
        });

        fireEvent.click(screen.getByTitle('Download dataset'));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/datasets/download/1'));
        });
    });
});