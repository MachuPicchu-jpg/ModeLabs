import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface ModelRanking {
    id: string;
    model_name: string;
    model_type: string;
    overall_score: number;
    mathematics?: number;
    coding?: number;
    knowledge_usage?: number;
    organization?: number;
    visual_recognition?: number;
    audio_processing?: number;
    text_understanding?: number;
    integration?: number;
    updated_at: string;
    api_url: string;
    description: string;
}

export const getLanguageModelRankings = async (): Promise<ModelRanking[]> => {
    try {
        const q = query(collection(db, 'language-models'), orderBy('overall_score', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc, index) => ({
            id: doc.id,
            ...doc.data(),
            rank: index + 1
        })) as ModelRanking[];
    } catch (error) {
        console.error('Error fetching language model rankings:', error);
        return [];
    }
};

export const getMultimodalModelRankings = async (): Promise<ModelRanking[]> => {
    try {
        const q = query(collection(db, 'multimodal-models'), orderBy('overall_score', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc, index) => ({
            id: doc.id,
            ...doc.data(),
            rank: index + 1
        })) as ModelRanking[];
    } catch (error) {
        console.error('Error fetching multimodal model rankings:', error);
        return [];
    }
}; 