import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod/v3";

export const validate = (schema: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const parsed = await schema.parseAsync(
                {
                    body: req.body,
                    query: req.query,
                    params: req.params
                }
            );

            req.body= parsed.body;
            req.params = parsed.params;
            req.query= parsed.query;
            next()
        }catch(error){
            if(error instanceof ZodError){
                res.status(400).json({
                    status:false,
                    message:"validation error",
                    error: error.errors.map((error) =>({field: error.path.join("."),message: error.message}))
                })
                return;
            }
            next(error)
        }
    }