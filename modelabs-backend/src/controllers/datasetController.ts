import { Request, Response } from 'express';
import * as datasetService from '../services/datasetService';

export async function getDatasets(req: Request, res: Response) {
  try {
    const type = req.query.type as 'text' | 'multimodal' | undefined;
    const datasets = await datasetService.getDatasets(type);
    res.json(datasets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getDataset(req: Request, res: Response) {
  try {
    const dataset = await datasetService.getDataset(req.params.id);
    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }
    res.json(dataset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function uploadDataset(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const dataset = await datasetService.uploadDataset(req.file);
    res.status(201).json(dataset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteDataset(req: Request, res: Response) {
  try {
    await datasetService.deleteDataset(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}