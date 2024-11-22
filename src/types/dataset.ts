export interface Dataset {
    id: string;
    name: string;
    type: 'text' | 'multimodal';
    path: string;
    size: number;
    createdAt: Date;
    updatedAt: Date;
  }