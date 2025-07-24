// src/controller/user.controller.ts
import { Request, Response } from "express";
import { getManager, getRepository } from "typeorm";
import { User } from "../entity/user.entity";
import bcryptjs from "bcryptjs";
import bcrypt from "bcryptjs/umd/types";


export const GetAllUsers = async (req: Request, res: Response) => {
    try {

        const take = 15;
        const page = parseInt(req.query.page as string || '1');

        const repository = getManager().getRepository(User);


        // const users = await repository.find({ relations: ['role'] });
        // const data = users.map(({ password, ...rest }) => rest);
        // res.status(200).json(data);


        const [data, total] = await repository.findAndCount({
            take,
            skip: (page - 1) * take,
            relations: ['role']
        })

        res.send({
            data: data.map(u => {
                const { password, ...data } = u;

                return data;
            }),
            meta: {
                total,
                page,
                last_page: Math.ceil(total / take)
            }
        });

    } catch (err) {
        console.error("❌ Error fetching users:", err);
        res.status(500).json({ message: "Error fetching users" });
    }
};

// export const CreateUser = async (req: Request, res: Response) => {
//     const { role_id, ...body } = req.body;
//     const hashedPassword = await bcryptjs.hash('1234', 10);
//     const repository = getManager().getRepository(User);
//     const { password, ...user } = await repository.save({
//         ...body,
//         password: hashedPassword,
//         role: {
//             id: role_id
//         }
//     })
//     res.status(201).send(user);
// }

export const CreateUser = async (req: Request, res: Response): Promise<Response> => {
  const { first_name, last_name, email, password, role_id } = req.body;

  // בדיקה שהשדות הדרושים קיימים
  if (!first_name || !last_name || !email || !password || !role_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const repository = getRepository(User);

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = repository.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: { id: role_id }
    });

    await repository.save(user);

    const { password: _, ...userWithoutPassword } = user;
    return res.status(201).json(userWithoutPassword);

  } catch (error) {
    return res.status(500).json({ message: "Failed to create user", error });
  }
};

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

