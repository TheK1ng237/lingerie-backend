import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

type ValidationSchema = {
    parseAsync(value: unknown): Promise<unknown>;
};

export const validate = (schema: ValidationSchema) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const parsed = await schema.parseAsync(
                {
                    body: req.body,
                    query: req.query,
                    params: req.params
                }
            ) as { body?: Request["body"]; params?: unknown; query?: unknown };

            if (parsed.body !== undefined) req.body = parsed.body;
            if (parsed.params !== undefined) req.params = parsed.params as Request["params"];
            if (parsed.query !== undefined) req.query = parsed.query as Request["query"];
            next()
        }catch(error){
            if(error instanceof ZodError){
                res.status(400).json({
                    status:false,
                    message:"validation error",
                    error: error.issues.map((issue) =>({field: issue.path.join("."),message: issue.message}))
                })
                return;
            }
            next(error)
        }
    }