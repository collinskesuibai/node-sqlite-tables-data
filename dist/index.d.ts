import { Request, Response, NextFunction } from "express";
declare const getTablesData: (dbName: string) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export { getTablesData };
