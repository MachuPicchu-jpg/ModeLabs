import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ModelManagement from './ModelManagement';
import { getModels, addModel, updateModelScore } from '../services/modelService';

// Mock the service functions
jest.mock('../services/modelService');

describe('ModelManagement', () => {
    beforeEach(() => {
        getModels.mockResolvedValue([]);
        addModel.mockResolvedValue({});
        updateModelScore.mockResolvedValue({});
    });

    test('renders loading spinner initially', () => {
        render(<ModelManagement />);
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    test('fetches and displays models', async () => {
        const models = [
            { id: 1, name: 'Model 1', type: 'Type 1', organization: 'Org 1', evaluationMetrics: { averageScore: 75 } },
            { id: 2, name: 'Model 2', type: 'Type 2', organization: 'Org 2', evaluationMetrics: { averageScore: 85 } },
        ];
        getModels.mockResolvedValueOnce(models);

        render(<ModelManagement />);

        await waitFor(() => {
            expect(screen.getByText('Model 1')).toBeInTheDocument();
            expect(screen.getByText('Model 2')).toBeInTheDocument();
        });
    });

    test('opens add model form', () => {
        render(<ModelManagement />);
        fireEvent.click(screen.getByText('Add New Model'));
        expect(screen.getByText('Add New Model')).toBeInTheDocument();
    });

    test('adds a new model', async () => {
        render(<ModelManagement />);
        fireEvent.click(screen.getByText('Add New Model'));

        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New Model' } });
        fireEvent.change(screen.getByLabelText('Organization'), { target: { value: 'New Org' } });
        fireEvent.change(screen.getByLabelText('API Endpoint'), { target: { value: 'http://api.endpoint' } });
        fireEvent.change(screen.getByLabelText('API Key'), { target: { value: 'apikey' } });

        fireEvent.click(screen.getByText('Add Model'));

        await waitFor(() => {
            expect(addModel).toHaveBeenCalledWith(expect.objectContaining({
                name: 'New Model',
                organization: 'New Org',
                apiEndpoint: 'http://api.endpoint',
                apiKey: 'apikey',
            }));
        });
    });

    test('updates model score', async () => {
        const models = [
            { id: 1, name: 'Model 1', type: 'Type 1', organization: 'Org 1', evaluationMetrics: { averageScore: 75 } },
        ];
        getModels.mockResolvedValueOnce(models);

        render(<ModelManagement />);

        await waitFor(() => {
            expect(screen.getByText('Model 1')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Run Evaluation'));

        await waitFor(() => {
            expect(updateModelScore).toHaveBeenCalledWith(1, expect.any(Object));
        });
    });
});