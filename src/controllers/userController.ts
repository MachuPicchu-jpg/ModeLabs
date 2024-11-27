// controller/UserController.ts
import { Request, Response } from 'express';
import userService from '../services/userService';

export class UserController {
  async create(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      const user = await userService.createUser(username, email, password);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const users = await userService.getUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const user = await userService.getUserById(Number(req.params.id));
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updatedUser = await userService.updateUser(Number(req.params.id), req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const success = await userService.deleteUser(Number(req.params.id));
      if (!success) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new UserController();
