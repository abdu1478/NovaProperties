import  {IUser} from "./models/model";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}