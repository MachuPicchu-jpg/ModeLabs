export interface Dataset {
    id: string;
    name: string;
    type: 'text' | 'multimodal';
    path: string;
    size: number;
    description?: string;
    userId: string;
    userEmail: string;
    category: string;
    subCategory: string;
    downloads: number;
    visibility: 'public' | 'private';
    status: 'pending' | 'completed' | 'failed';
    createdAt: Date;
    updatedAt: Date;
  }