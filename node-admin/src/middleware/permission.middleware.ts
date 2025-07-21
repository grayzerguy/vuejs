//

import { Request, Response, NextFunction, RequestHandler } from "express";
import { User } from "../entity/user.entity";

export const PermissionMiddleware = (access: string): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user: User | undefined = req['user'];

        if (!user || !user.role || !user.role.permissions) {
            res.status(401).json({ message: 'unauthorized' });
            return;
        }

        const permissions = user.role.permissions;

        const hasPermission =
            req.method === 'GET'
                ? permissions.some(p => p.name === `view_${access}` || p.name === `edit_${access}`)
                : permissions.some(p => p.name === `edit_${access}`);

        if (!hasPermission) {
            res.status(401).json({ message: 'unauthorized' });
            return;
        }

        next();
    };
};
