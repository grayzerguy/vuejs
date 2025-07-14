// src/controller/user.controller.ts
import { Request, Response } from "express";
import { getManager } from "typeorm";
import { User } from "../entity/user.entity";
import bcryptjs from "bcryptjs";


export const GetAllUsers = async (req: Request, res: Response) => {
    try {
        
        const repository = getManager().getRepository(User);
        const users = await repository.find({ relations: ['role'] });
        const data = users.map(({ password, ...rest }) => rest);
        res.status(200).json(data);
    } catch (err) {
        console.error("❌ Error fetching users:", err);
        res.status(500).json({ message: "Error fetching users" });
    }
};

export const CreateUser = async (req: Request, res: Response) => {
    const { role_id, ...body } = req.body;
    const hashedPassword = await bcryptjs.hash('1234', 10);
    const repository = getManager().getRepository(User);
    const { password, ...user } = await repository.save({
        ...body,
        password: hashedPassword,
        role: {
            id: role_id
        }
    })
    res.status(201).send(user);
}

export const GetUser = async (req: Request, res: Response) => {
    const repository = getManager().getRepository(User);
    const id = Number(req.params.id);
    const { password, ...user } = await repository.findOne({
        where: { id },
        relations: ['role']
    });

    res.send(user);
}



export const UpdateUserById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { role_id, ...body } = req.body;
    const repository = getManager().getRepository(User);
    const userExists = await repository.findOne({ where: { id }, relations: ['role'] })
    if (!userExists) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    await repository.update(id, {
        ...body,
        role: {
            id: role_id
        }
    });

    const updatedUser = await repository.findOne({ where: { id } });
    if (!updatedUser) {
        res.status(500).json({ message: "Error retrieving updated user" });
        return;
    }
    const { password, ...userWithoutPassword } = updatedUser;
    res.status(202).json(userWithoutPassword);
};

export const DeleteUserById = async (req: Request, res: Response) => {
    const repository = getManager().getRepository(User);
    const id = Number(req.params.id);
    await repository.delete(id);
    res.status(204).send();
}

