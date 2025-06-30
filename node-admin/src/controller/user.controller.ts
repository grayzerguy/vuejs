import { getManager } from "typeorm";
import { User } from "../entity/user.entity"
import { Request, Response } from "express";
import bcryptjs from "bcryptjs";

export const GetAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const repository = getManager().getRepository(User);
        const users = await repository.find();
        const data = users.map(u => {
            const { password, ...rest } = u;
            return rest;
        });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

// export const CreateUser = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { first_name, last_name, email, password } = req.body;
//         const repository = getManager().getRepository(User);

//         const existing = await repository.findOne({ where: { email } });
//         if (existing) {
//             res.status(400).json({ message: "Email already exists" });
//             return;
//         }

//         const hashedPassword = await bcryptjs.hash(password, 10);

//         const user = repository.create({
//             first_name,
//             last_name,
//             email,
//             password: hashedPassword,
//         });

//         await repository.save(user);

//         const { password: _pw, ...rest } = user;
//         res.status(200).json(rest);
//     } catch (err) {
//         res.status(500).json({ message: "Error creating user" });
//     }
// };
export const CreateUser = async (req: Request, res: Response) => {
    try {
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
    } catch (error) {
        res.status(500).json({ message: "Error creating user" });
    }
}

export const GetUser = async (req: Request, res: Response) => {
    try {
        const repository = getManager().getRepository(User);

        const { password, ...user } = await repository.findOne({ where: { id: Number(req.params.id) } });

        res.send(user);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching user" });
    }
}

export const UpdateUser = async (req: Request, res: Response) => {
    try {
        const { role_id, ...body } = req.body;

        const repository = getManager().getRepository(User);

        await repository.update(req.params.id, {
            ...body,
            role: {
                id: role_id
            }
        });

        const { password, ...user } = await repository.findOne({ where: { id: Number(req.params.id) } });

        res.status(202).send(user);
    } catch (error) {
        res.status(500).json({ message: "Error updating user" });
    }
}

export const DeleteUser = async (req: Request, res: Response) => {
    try {
        const repository = getManager().getRepository(User);

    await repository.delete(req.params.id);

        res.status(204).send(null);
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
}
