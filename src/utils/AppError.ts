
export class AppError extends Error{
    public readonly statuscode:number;
    public readonly isOperational :boolean;

    constructor(message:string,statuscode:number=500){
        super(message);
        this.statuscode=statuscode;
        this.isOperational=true
        Object.setPrototypeOf(this,new.target.prototype);
        Error.captureStackTrace(this);
    }

}