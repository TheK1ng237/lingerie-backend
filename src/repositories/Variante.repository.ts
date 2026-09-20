import { Prisma } from "@prisma/client";
import { prisma } from "../config/database.js";
import {
    IVarianteRepository,
    VarianteWithRelations
} from "./interfaces/IVarianteRepository.js";

const varianteInclude = {
    size: true,
    color: true
} satisfies Prisma.VarianteInclude;

export class VarianteRepository implements IVarianteRepository {
    async create(
        data: Prisma.VarianteUncheckedCreateInput
    ): Promise<VarianteWithRelations> {
        try {
            return await prisma.variante.create({
                data,
                include: varianteInclude
            });
        } catch (err: any) {
            if (err?.code === "P2002" && Array.isArray(err?.meta?.target) && err?.meta?.target.includes("id")) {
                await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Variante"', 'id'), coalesce(max(id), 1)) FROM "Variante";`);
                return prisma.variante.create({
                    data,
                    include: varianteInclude
                });
            }
            throw err;
        }
    }

    async findById(id: number): Promise<VarianteWithRelations | null> {
        return prisma.variante.findUnique({
            where: { id },
            include: varianteInclude
        });
    }

    async updateById(
        id: number,
        data: Prisma.VarianteUpdateInput
    ): Promise<VarianteWithRelations> {
        return prisma.variante.update({
            where: { id },
            data,
            include: varianteInclude
        });
    }
    async deleteVariante(id: number): Promise<void> {
        await prisma.variante.delete({
            where:{id}
        })
    }
}

export default new VarianteRepository();
