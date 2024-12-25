import { addDoc, updateDoc, getDocs, query, orderBy, collection, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { addModel, updateModelScore, getModels } from './modelService';

jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    addDoc: jest.fn(),
    updateDoc: jest.fn(),
    getDocs: jest.fn(),
    query: jest.fn(),
    orderBy: jest.fn(),
    doc: jest.fn(),
}));

describe('modelService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('addModel', () => {
        it('should add a model and return its ID', async () => {
            const mockModelData = { name: 'Test Model' };
            const mockDocRef = { id: '12345' };
            addDoc.mockResolvedValue(mockDocRef);

            const result = await addModel(mockModelData);

            expect(addDoc).toHaveBeenCalledWith(collection(db, 'models'), expect.objectContaining(mockModelData));
            expect(result).toBe(mockDocRef.id);
        });

        it('should throw an error if adding model fails', async () => {
            const mockModelData = { name: 'Test Model' };
            const mockError = new Error('Failed to add model');
            addDoc.mockRejectedValue(mockError);

            await expect(addModel(mockModelData)).rejects.toThrow(mockError);
            expect(console.error).toHaveBeenCalledWith('Error adding model:', mockError);
        });
    });

    describe('updateModelScore', () => {
        it('should update the model score', async () => {
            const mockModelId = '12345';
            const mockEvaluationData = { score: 95 };
            updateDoc.mockResolvedValue();

            await updateModelScore(mockModelId, mockEvaluationData);

            expect(updateDoc).toHaveBeenCalledWith(doc(db, 'models', mockModelId), expect.objectContaining(mockEvaluationData));
        });

        it('should throw an error if updating model score fails', async () => {
            const mockModelId = '12345';
            const mockEvaluationData = { score: 95 };
            const mockError = new Error('Failed to update model score');
            updateDoc.mockRejectedValue(mockError);

            await expect(updateModelScore(mockModelId, mockEvaluationData)).rejects.toThrow(mockError);
            expect(console.error).toHaveBeenCalledWith('Error updating model score:', mockError);
        });
    });

    describe('getModels', () => {
        it('should get models ordered by averageScore', async () => {
            const mockDocs = [
                { id: '1', data: () => ({ name: 'Model 1', averageScore: 90 }) },
                { id: '2', data: () => ({ name: 'Model 2', averageScore: 85 }) },
            ];
            getDocs.mockResolvedValue({ docs: mockDocs });

            const result = await getModels();

            expect(query).toHaveBeenCalledWith(collection(db, 'models'), orderBy('averageScore', 'desc'));
            expect(result).toEqual([
                { id: '1', name: 'Model 1', averageScore: 90 },
                { id: '2', name: 'Model 2', averageScore: 85 },
            ]);
        });

        it('should throw an error if getting models fails', async () => {
            const mockError = new Error('Failed to get models');
            getDocs.mockRejectedValue(mockError);

            await expect(getModels()).rejects.toThrow(mockError);
            expect(console.error).toHaveBeenCalledWith('Error getting models:', mockError);
        });
    });
});