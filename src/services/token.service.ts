import jwt from 'jsonwebtoken'
import crypto from "node:crypto"
import { Prisma } from '@prisma/client'
import env from "../config/env.js"
import { prisma } from "../config/database.js"
import { AppError } from '../utils/AppError.js'

export interface jwtPayload {
    sub: number;
    role: string;
}

export class TokenService {

    generateAccessToken(paylooad: jwtPayload): string {
        return jwt.sign(paylooad, env.JWT_ACCESS_SECRET, {
            algorithm: 'HS256',
            expiresIn: env.JWT_ACCESS_EXPIRATION_MINUTES
        })
    }

    verifyAccessToken(token: string): jwtPayload {
        try {
            const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET, {
                algorithms: ['HS256']
            });

            if (
                typeof decoded === "string" ||
                typeof decoded.sub !== "number" ||
                typeof decoded.role !== "string"
            ) {
                throw new AppError("invalid access token", 401);
            }

            return {
                sub: decoded.sub,
                role: decoded.role
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError("invalid or expired access token", 401);
        }
    }

    async generateRefreshToken(idUser: number): Promise<string> {

        const token = crypto.randomBytes(64).toString('hex')

        const expireAt = new Date(Date.now() + 7 * 24 * 60 * 1000)

        await prisma.refreshToken.create({
            data: {
                idUser,
                token,
                expireAt,
                revoke: false
            }
        })

        return token
    }

    async rotateToken(oldtokenn: string): Promise<{ token: string, idUser: number }> {

        const stored = await prisma.refreshToken.findUnique({
            where: { token: oldtokenn }
        })

        if (!stored || stored.revoke || stored.expireAt < new Date()) {
            throw new AppError('refresh token invalid or expired', 401)
        }

        await prisma.refreshToken.update({
            where: { id: stored.id },
            data: { revoke: true }
        })

        const newToken = await this.generateRefreshToken(stored.idUser)

        return { token: newToken, idUser: stored.idUser }
    }

    async revokeRefreshToken(token: string): Promise<void> {

        await prisma.refreshToken.updateMany({
            where: { token },
            data: {
                revoke: true
            }
        })
    }

    async revokeAllForUser(idUser: number): Promise<void> {

        await prisma.refreshToken.updateMany({
            where: { idUser, revoke: false },
            data: { revoke: true }
        })
    }
}

export default new TokenService();