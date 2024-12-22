import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

export const getLanguageModelRankings = async () => {
    try {
        const q = query(collection(db, 'language-model-rankings'), orderBy('overall_score', 'desc'));
        const querySnapshot = await getDocs(q);
        const rankings = querySnapshot.docs.map((doc, index) => {
            const data = doc.data();
            console.log('Language model ranking data:', data); // Debug log
            return {
                id: doc.id,
                ...data,
                rank: index + 1,
                // Ensure numeric values
                overall_score: Number(data.overall_score || 0),
                mathematics: Number(data.mathematics || 0),
                knowledge_usage: Number(data.knowledge_usage || 0),
                coding: Number(data.coding || 0),
                organization: Number(data.organization || 0)
            };
        });
        console.log('Language model rankings:', rankings); // Debug log
        return rankings;
    } catch (error) {
        console.error('Error fetching language model rankings:', error);
        return [];
    }
};

export const getMultimodalModelRankings = async () => {
    try {
        const q = query(collection(db, 'multimodal-model-rankings'), orderBy('overall_score', 'desc'));
        const querySnapshot = await getDocs(q);
        const rankings = querySnapshot.docs.map((doc, index) => {
            const data = doc.data();
            console.log('Multimodal model ranking data:', data); // Debug log
            return {
                id: doc.id,
                ...data,
                rank: index + 1,
                // Ensure numeric values
                overall_score: Number(data.overall_score || 0),
                visual_recognition: Number(data.visual_recognition || 0),
                audio_processing: Number(data.audio_processing || 0),
                text_understanding: Number(data.text_understanding || 0),
                integration: Number(data.integration || 0)
            };
        });
        console.log('Multimodal model rankings:', rankings); // Debug log
        return rankings;
    } catch (error) {
        console.error('Error fetching multimodal model rankings:', error);
        return [];
    }
}; 