import { Prisma } from "@prisma/client";

export type VarianteWithRelations = Prisma.VarianteGetPayload<{
    include: {
        size: true;
        color: true;
    };
}>;

export interface IVarianteRepository {
    deleteVariante(id: number): Promise<void>;
    create(data: Prisma.VarianteUncheckedCreateInput): Promise<VarianteWithRelations>;
    findById(id: number): Promise<VarianteWithRelations | null>;
    updateById(
        id: number,
        data: Prisma.VarianteUpdateInput
    ): Promise<VarianteWithRelations>;
}
