import { db } from '../config/firebase';
import { LanguageModelRanking, MultimodalModelRanking } from '../types/ranking';

export async function getLanguageModelRankings(): Promise<LanguageModelRanking[]> {
  try {
    const rankings = await db.collection('language-model-rankings')
      .orderBy('overall_score', 'desc')
      .get();
    
    return rankings.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as LanguageModelRanking));
  } catch (error) {
    console.error('Error fetching language model rankings:', error);
    throw error;
  }
}

export async function getMultimodalModelRankings(): Promise<MultimodalModelRanking[]> {
  try {
    const rankings = await db.collection('multimodal-model-rankings')
      .orderBy('overall_score', 'desc')
      .get();
    
    return rankings.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as MultimodalModelRanking));
  } catch (error) {
    console.error('Error fetching multimodal model rankings:', error);
    throw error;
  }
}

export async function initializeModelRanking(model: any): Promise<void> {
  try {
    const collection = model.type.toLowerCase() === 'large language' 
      ? 'language-model-rankings' 
      : 'multimodal-model-rankings';
    
    const rankingRef = db.collection(collection).doc(model.id);
    const ranking = await rankingRef.get();
    
    if (!ranking.exists) {
      // Initialize new ranking with zeros
      if (model.type.toLowerCase() === 'large language') {
        await rankingRef.set({
          model_id: model.id,
          model_name: model.name,
          overall_score: 0,
          inference: 0,
          mathematics: 0,
          coding: 0,
          knowledge_usage: 0,
          organization: 0,
          progress: 0,
          created_at: new Date(),
          updated_at: new Date()
        });
      } else {
        await rankingRef.set({
          model_id: model.id,
          model_name: model.name,
          overall_score: 0,
          visual_recognition: 0,
          audio_processing: 0,
          text_understanding: 0,
          integration: 0,
          progress: 0,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    }
  } catch (error) {
    console.error('Error initializing model ranking:', error);
    throw error;
  }
}
