// services/userService.ts
import { prisma } from '../utils/db';
import bcrypt from 'bcrypt';

export class UserService {
    // 创建用户
    async createUser(username: string, email: string, password: string) {
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          username,
          email,
          passwordHash,
        },
      });
      return user;
    }
  
    // 获取所有用户
    async getUsers() {
      return await prisma.user.findMany();
    }
  
    // 获取单个用户
    async getUserById(userId: number) {
      return await prisma.user.findUnique({
        where: { id: userId },
      });
    }
  
    // 更新用户信息
    async updateUser(userId: number, updatedData: { username?: string; email?: string }) {
      return await prisma.user.update({
        where: { id: userId },
        data: updatedData,
      });
    }
  
    // 删除用户
    async deleteUser(userId: number) {
      return await prisma.user.delete({
        where: { id: userId },
      });
    }
  }
  
  export default new UserService();
