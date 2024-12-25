import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RankingPage from './Ranking';
import { getLanguageModelRankings, getMultimodalModelRankings } from '../services/rankingService.js';

// Mock the ranking service functions
jest.mock('../services/rankingService.js', () => ({
    getLanguageModelRankings: jest.fn(),
    getMultimodalModelRankings: jest.fn(),
}));

describe('RankingPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders leaderboard with initial data', async () => {
        getLanguageModelRankings.mockResolvedValue([
            { id: 1, model_name: 'Model A', rank: 1, overall_score: 0.95, updated_at: '2023-10-01T00:00:00Z' },
            { id: 2, model_name: 'Model B', rank: 2, overall_score: 0.90, updated_at: '2023-10-01T00:00:00Z' },
        ]);

        render(<RankingPage />);

        await waitFor(() => {
            expect(screen.getByText('Model A')).toBeInTheDocument();
            expect(screen.getByText('Model B')).toBeInTheDocument();
        });
    });

    test('switches tabs and fetches multimodal model rankings', async () => {
        getLanguageModelRankings.mockResolvedValue([]);
        getMultimodalModelRankings.mockResolvedValue([
            { id: 3, model_name: 'Model C', rank: 1, overall_score: 0.85, updated_at: '2023-10-01T00:00:00Z' },
        ]);

        render(<RankingPage />);

        fireEvent.click(screen.getByText('Multimodal'));

        await waitFor(() => {
            expect(screen.getByText('Model C')).toBeInTheDocument();
        });
    });

    test('filters models based on search term', async () => {
        getLanguageModelRankings.mockResolvedValue([
            { id: 1, model_name: 'Model A', rank: 1, overall_score: 0.95, updated_at: '2023-10-01T00:00:00Z' },
            { id: 2, model_name: 'Model B', rank: 2, overall_score: 0.90, updated_at: '2023-10-01T00:00:00Z' },
        ]);

        render(<RankingPage />);

        await waitFor(() => {
            expect(screen.getByText('Model A')).toBeInTheDocument();
            expect(screen.getByText('Model B')).toBeInTheDocument();
        });

        fireEvent.change(screen.getByPlaceholderText('Search models...'), { target: { value: 'Model B' } });

        await waitFor(() => {
            expect(screen.queryByText('Model A')).not.toBeInTheDocument();
            expect(screen.getByText('Model B')).toBeInTheDocument();
        });
    });

    test('opens and closes the add model modal', () => {
        render(<RankingPage />);

        fireEvent.click(screen.getByText('ADD NEW Model →'));

        expect(screen.getByText('Add New Model')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Cancel'));

        expect(screen.queryByText('Add New Model')).not.toBeInTheDocument();
    });

    test('submits new model form', async () => {
        getLanguageModelRankings.mockResolvedValue([]);
        const addDocMock = jest.fn().mockResolvedValue({ id: 'new-model-id' });
        jest.mock('firebase/firestore', () => ({
            collection: jest.fn(),
            addDoc: addDocMock,
        }));

        render(<RankingPage />);

        fireEvent.click(screen.getByText('ADD NEW Model →'));

        fireEvent.change(screen.getByLabelText('Model Name'), { target: { value: 'New Model' } });
        fireEvent.change(screen.getByLabelText('API URL'), { target: { value: 'http://api.url' } });
        fireEvent.change(screen.getByLabelText('API Token'), { target: { value: 'api-token' } });
        fireEvent.change(screen.getByLabelText('Model Description'), { target: { value: 'Description of the new model' } });

        fireEvent.click(screen.getByText('Add Model'));

        await waitFor(() => {
            expect(addDocMock).toHaveBeenCalled();
        });
    });
});