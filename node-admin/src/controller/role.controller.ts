import {Request, Response} from "express";
import {getManager} from "typeorm";
import {Role} from "../entity/role.entity";

export const Roles = async (req: Request, res: Response) => {
    const repository = getManager().getRepository(Role);

    res.send(await repository.find());
}

export const CreateRole = async (req: Request, res: Response) => {
    const {name, permissions} = req.body;

    const repository = getManager().getRepository(Role);

    const role = await repository.save({
        name,
        permissions: permissions.map(id => ({id}))
    });

    res.status(201).send(role);
}

export const GetRole = async (req: Request, res: Response) => {
    const repository = getManager().getRepository(Role);

    const id = Number(req.params.id);

    res.send(await repository.findOne({ where: { id }, relations: ['permissions'] }))
}

export const UpdateRole = async (req: Request, res: Response) => {
    const {name, permissions} = req.body;

    const repository = getManager().getRepository(Role);

    interface UpdateRoleBody {
        name: string;
        permissions: number[];
    }

    interface RoleUpdateInput {
        id: number;
        name: string;
        permissions: { id: number }[];
    }

    const body: UpdateRoleBody = req.body;

    const roleUpdateInput: RoleUpdateInput = {
        id: Number(req.params.id),
        name: body.name,
        permissions: body.permissions.map((id: number) => ({ id }))
    };

    const role = await repository.save(roleUpdateInput);

    res.status(202).send(role);
}
export const DeleteRole = async (req: Request, res: Response) => {
    const repository = getManager().getRepository(Role)

    await repository.delete(req.params.id);

    res.status(204).send(null);
}