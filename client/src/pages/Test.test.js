import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Test from './Test';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

// Mock the Upload component for simplicity in testing
jest.mock('lucide-react', () => ({
    Upload: jest.fn(() => <div>Upload Icon</div>),
    CheckCircle: jest.fn(() => <div>Success Icon</div>),
    AlertCircle: jest.fn(() => <div>Error Icon</div>),
}));

describe('Test component', () => {
    it('renders the page correctly', () => {
        render(<Test />);
        expect(screen.getByText(/Test Your Model/i)).toBeInTheDocument();
        expect(screen.getByText(/Upload your dataset for model evaluation/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Select File/i)).toBeInTheDocument();
    });

    it('displays the selected file details', () => {
        render(<Test />);

        const fileInput = screen.getByLabelText(/Select File/i);
        const file = new File(['file contents'], 'testfile.json', { type: 'application/json' });

        // Simulate file selection
        fireEvent.change(fileInput, { target: { files: [file] } });

        expect(screen.getByText('testfile.json')).toBeInTheDocument();
        expect(screen.getByText('(1 KB)')).toBeInTheDocument();
    });

    it('displays success message after file upload', async () => {
        render(<Test />);

        const fileInput = screen.getByLabelText(/Select File/i);
        const file = new File(['file contents'], 'testfile.json', { type: 'application/json' });

        // Simulate file selection
        fireEvent.change(fileInput, { target: { files: [file] } });

        const uploadButton = screen.getByRole('button', { name: /Start Test/i });

        // Simulate upload
        fireEvent.click(uploadButton);

        // Wait for the upload status to be updated
        await waitFor(() => {
            expect(screen.getByText(/File uploaded successfully!/i)).toBeInTheDocument();
            expect(screen.getByText('Success Icon')).toBeInTheDocument();
        });
    });

    it('displays error message if upload fails', async () => {
        render(<Test />);

        const fileInput = screen.getByLabelText(/Select File/i);
        const file = new File(['file contents'], 'testfile.json', { type: 'application/json' });

        // Simulate file selection
        fireEvent.change(fileInput, { target: { files: [file] } });

        // Force the handleUpload function to fail (we can mock it to simulate failure)
        jest.spyOn(window, 'setTimeout').mockImplementationOnce((cb) => cb()); // Simulate immediate failure

        const uploadButton = screen.getByRole('button', { name: /Start Test/i });

        // Simulate upload
        fireEvent.click(uploadButton);

        // Wait for the upload status to be updated
        await waitFor(() => {
            expect(screen.getByText(/Error uploading file. Please try again./i)).toBeInTheDocument();
            expect(screen.getByText('Error Icon')).toBeInTheDocument();
        });
    });

    it('disables the upload button when no file is selected', () => {
        render(<Test />);
        const uploadButton = screen.getByRole('button', { name: /Start Test/i });
        expect(uploadButton).toBeDisabled();
    });

    it('disables the upload button while uploading', async () => {
        render(<Test />);

        const fileInput = screen.getByLabelText(/Select File/i);
        const file = new File(['file contents'], 'testfile.json', { type: 'application/json' });

        fireEvent.change(fileInput, { target: { files: [file] } });

        const uploadButton = screen.getByRole('button', { name: /Start Test/i });

        fireEvent.click(uploadButton);

        // Wait for the upload process to finish
        expect(uploadButton).toBeDisabled();
    });
});
