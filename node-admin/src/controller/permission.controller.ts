import { Request, Response } from "express";
import { Permission } from "../entity/permission.entity";
import { getManager } from "typeorm";

export const Permissions = async (req: Request, res: Response): Promise<void> => {

    const repository = getManager().getRepository(Permission);

    const sendRepository = await repository.find()

    res.send(sendRepository);

}