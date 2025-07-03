// src/controller/user.controller.ts
import { Request, Response } from "express";
import { getManager } from "typeorm";
import { User } from "../entity/user.entity";
import bcryptjs from "bcryptjs";


export const GetAllUsers = async (req: Request, res: Response): Promise<void> => {
    console.log("📥 GetAllUsers endpoint was hit");

    try {
        const repository = getManager().getRepository(User);
        const users = await repository.find();

        console.log("📦 Found users:", users.length);

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
        where: { id }
    });

    res.send(user);
}


export const UpdateUserById = async (req: Request, res: Response) => {
    const { role_id, ...body } = req.body;

    const repository = getManager().getRepository(User);


    await repository.update(req.params.id, {
        ...body,
        // role: {
        //     id: role_id
        // }
    });

    const id = Number(req.params.id);

    const userEntity = await repository.findOne({ where: { id } });
    if (!userEntity) {
        return res.status(404).send({ message: "User not found" });
    }

    const { password, ...user } = userEntity;

    res.status(202).send(user);
}

export const DeleteUserById = async (req: Request, res: Response) => {
    const repository = getManager().getRepository(User);

    const id = Number(req.params.id);
    await repository.delete(id);

    res.status(204).send();
}

