import { createConnection, getManager } from "typeorm";
import { Permission } from "../entity/permission.entity";





createConnection().then(async connection => {

    const permissionRepository = getManager().getRepository(Permission);

    const perms = [
        'view_users',
        'edit_users',
        'view_roles',
        'edit_roles',
        'view_products',
        'edit_products',
        'view_orders',
        'edit_orders'];

    let permissions = [];

    for (let i = 0; i < perms.length; i++) {
        permissions.push(await permissionRepository.save({
            name: perms[i]
        }));
    }
    process.exit(0);
})
