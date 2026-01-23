import { UUID } from "sequelize";
import { v4 as uuid} from "uuid";

export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function
) => {

  if (!file) return callback(new Error('File is empty'), false);

        const firstNamePart = uuid();
        const uniqueSuffix = firstNamePart + '-' + Math.round(Math.random() * 1E9);
        const originalName = file.originalname.replace(/\s+/g, '_');
        const filename = `${uniqueSuffix}-${originalName}`;
        callback(null, filename);

 
  

};