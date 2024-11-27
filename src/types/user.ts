export interface User {
    id: number;
    username: string;
    email: string;
    passwordHash: string; // 密码应该存储为哈希值
    createdAt: Date;
    updatedAt: Date;
  }