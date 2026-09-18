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
        return prisma.variante.create({
            data,
            include: varianteInclude
        });
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
