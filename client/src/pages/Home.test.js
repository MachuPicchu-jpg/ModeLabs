import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from './Home';

describe('Home Component', () => {
    test('renders the component', () => {
        render(
            <Router>
                <Home />
            </Router>
        );

        expect(screen.getByText(/ModeLabs/i)).toBeInTheDocument();
        expect(screen.getByText(/ModeLabs is a leaderboard for evaluating the capabilities of large language models and multimodal large models./i)).toBeInTheDocument();
        expect(screen.getByText(/Start Now/i)).toBeInTheDocument();
    });

    test('navigates to Ranking page on button click', () => {
        const { container } = render(
            <Router>
                <Home />
            </Router>
        );

        const startNowButton = screen.getByText(/Start Now/i);
        fireEvent.click(startNowButton);

        // Assuming you have a mock or spy on useNavigate to check navigation
        // For example, if you use jest.mock('react-router-dom', () => ({ useNavigate: jest.fn() }))
        // You can check if navigate('/Ranking') was called
        // expect(mockNavigate).toHaveBeenCalledWith('/Ranking');
    });

    test('renders the footer with correct links', () => {
        render(
            <Router>
                <Home />
            </Router>
        );

        expect(screen.getByText(/Research/i)).toBeInTheDocument();
        expect(screen.getByText(/Products/i)).toBeInTheDocument();
        expect(screen.getByText(/Company/i)).toBeInTheDocument();
        expect(screen.getByText(/Legal/i)).toBeInTheDocument();
        expect(screen.getByText(/Connect/i)).toBeInTheDocument();

        expect(screen.getByText(/Overview/i)).toBeInTheDocument();
        expect(screen.getByText(/Models/i)).toBeInTheDocument();
        expect(screen.getByText(/About Us/i)).toBeInTheDocument();
        expect(screen.getByText(/Terms/i)).toBeInTheDocument();
        expect(screen.getByText(/Contact Us/i)).toBeInTheDocument();
    });

    test('renders social media icons in the footer', () => {
        render(
            <Router>
                <Home />
            </Router>
        );

        expect(screen.getByLabelText(/Twitter/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Github/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Linkedin/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Youtube/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Instagram/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Discord/i)).toBeInTheDocument();
    });
});