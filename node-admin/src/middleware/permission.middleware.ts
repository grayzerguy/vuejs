// //

// import { Request, Response, NextFunction, RequestHandler } from "express";
// import { User } from "../entity/user.entity";

// export const PermissionMiddleware = (access: string): RequestHandler => {
//     return (req: Request, res: Response, next: NextFunction): void => {
//         const user: User | undefined = req['user'];

//         console.log(user)

//         // if (!user || !user.role || !user.role.permissions) {
//         //     res.status(401).json({ message: 'unauthorized' });
//         //     return;
//         // }

//         const permissions = user.role.permissions;

//         const hasPermission =
//             req.method === 'GET'
//                 ? permissions.some(p => p.name === `view_${access}` || p.name === `edit_${access}`)
//                 : permissions.some(p => p.name === `edit_${access}`);

//         if (!hasPermission) {
//             res.status(401).json({ message: 'unauthorized' });
//             return;
//         }

//         next();
//     };
// };
import { Request, Response, NextFunction, RequestHandler } from "express";
import { User } from "../entity/user.entity";

export const PermissionMiddleware = (access: string): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = req['user'] as User | undefined;
        console.log("user in PermissionMiddleware:", user);
        if (!user || !user.role || !Array.isArray(user.role.permissions)) {
            res.status(401).json({ message: 'unauthorized - no user or permissions' });
            return;
        }

        const permissions = user.role.permissions;
        console.log("user in PermissionMiddleware:", user);

        // const hasPermission =
        //     req.method === 'GET'
        //         ? permissions.some(p => p.name === `view_${access}` || p.name === `edit_${access}`)
        //         : permissions.some(p => p.name === `edit_${access}`);

        // if (!hasPermission) {
        //     res.status(401).json({ message: 'unauthorized - insufficient permissions' });
        //     return;
        // } 
        if (req.method === 'GET') {
            if (!permissions.some(p => (p.name === `view_${access}`) || (p.name === `edit_${access}`))) {
                res.status(401).send({
                    message: 'unauthorized'
                });
                return;
            }
        } else {
            if (!permissions.some(p => p.name === `edit_${access}`)) {
                res.status(401).send({
                    message: 'unauthorized'
                });
                return;
            }
        }

        next();
    };
};
