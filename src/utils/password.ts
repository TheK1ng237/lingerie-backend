import bcrypt from 'bcrypt'


const SALT_ROUND=12
export async function hashpassword(plain: string):Promise<string>{
    return bcrypt.hash(plain,SALT_ROUND);
}

export async function comparePassword(plain:string,hash:string):Promise<boolean>{
    return bcrypt.compare(plain,hash);
}