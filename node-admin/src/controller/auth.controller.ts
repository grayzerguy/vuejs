//import { Register } from './../../vuejs/node-admin/src/controller/auth.controller';
import { Request, Response } from 'express';


 export const Register = (req: Request, res: Response) => {
   res.send(req.body);
}

// function Register1(req:Request, res: Response) {

//     res.send(req.body)
// }

// export default Register1