
export class AppError extends Error{
    public readonly statuscode:number;

    constructor(message:string,statuscode:number=500){
        super(message);
        this.statuscode=statuscode;

        Object.setPrototypeOf(this,new.target.prototype);
        Error.captureStackTrace(this);
    }

}