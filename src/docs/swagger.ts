import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Lingerie Backend API",
            version: "1.0.0",
            description: "API de gestion des utilisateurs, produits, variantes et commandes.",
        },
        servers: [{ url: "http://localhost:4000", description: "Serveur local" }],
        tags: [
            { name: "Authentification", description: "Inscription, connexion et tokens." },
            { name: "Utilisateurs", description: "Gestion des comptes utilisateurs." },
            { name: "Produits", description: "Catalogue et variantes de produits." },
            { name: "Commandes", description: "Creation et suivi des commandes." },
        ],
        components: {
            securitySchemes: {
                bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: { type: "integer" }, email: { type: "string", format: "email" },
                        firstName: { type: "string" }, lastName: { type: "string" },
                        role: { type: "string", enum: ["admin", "user"] }, adresse: { type: "string" },
                        phone: { type: "integer" }, createdAt: { type: "string", format: "date-time" },
                    },
                },
                RegisterInput: {
                    type: "object",
                    required: ["email", "password", "firstName", "lastName", "adresse", "phone"],
                    properties: {
                        email: { type: "string", format: "email" }, password: { type: "string", format: "password" },
                        firstName: { type: "string" }, lastName: { type: "string" }, adresse: { type: "string" },
                        phone: { type: "integer" }, role: { type: "string", enum: ["admin", "user"], default: "user" },
                    },
                },
                LoginInput: {
                    type: "object", required: ["email", "password"],
                    properties: { email: { type: "string", format: "email" }, password: { type: "string", format: "password" } },
                },
                TokenInput: { type: "object", required: ["refreshToken"], properties: { refreshToken: { type: "string" } } },
                TokenResponse: {
                    type: "object",
                    properties: { accessToken: { type: "string" }, refreshToken: { type: "string" }, expireIn: { type: "string" } },
                },
                Product: {
                    type: "object",
                    properties: {
                        id: { type: "integer" }, name: { type: "string" }, description: { type: "string" },
                        price: { type: "number", format: "float" }, image: { type: "string" },
                        type: { type: "string", enum: ["chaussette", "dessous"] }, brandId: { type: "integer" },
                        createdAt: { type: "string", format: "date-time" },
                        variante: { type: "array", items: { $ref: "#/components/schemas/Variant" } },
                    },
                },
                ProductInput: {
                    type: "object", required: ["name", "description", "price", "image", "type", "brandId"],
                    properties: {
                        name: { type: "string" }, description: { type: "string" }, price: { type: "number" },
                        image: { type: "string", format: "binary" }, type: { type: "string", enum: ["chaussette", "dessous"] }, brandId: { type: "integer" },
                    },
                },
                Variant: {
                    type: "object",
                    properties: {
                        id: { type: "integer" }, stock: { type: "integer" }, price: { type: "number" }, image: { type: "string" },
                        productId: { type: "integer" }, idSize: { type: "integer" }, idColor: { type: "integer" },
                        size: { type: "object" }, color: { type: "object" },
                    },
                },
                VariantInput: {
                    type: "object", required: ["stock", "price", "image", "idSize", "idColor"],
                    properties: { stock: { type: "integer" }, price: { type: "number" }, image: { type: "string", format: "binary" }, idSize: { type: "integer" }, idColor: { type: "integer" } },
                },
                OrderDetailInput: {
                    type: "object", required: ["quantity", "price", "varianteId"],
                    properties: { quantity: { type: "integer" }, price: { type: "number" }, varianteId: { type: "integer" } },
                },
                Order: {
                    type: "object",
                    properties: {
                        id: { type: "integer" }, status: { type: "string", enum: ["pending", "paid", "delivered"] },
                        totalPrice: { type: "number" }, dateOrder: { type: "string", format: "date-time" }, idUser: { type: "integer" },
                        orderDetails: { type: "array", items: { $ref: "#/components/schemas/OrderDetailInput" } },
                    },
                },
                OrderInput: {
                    type: "object", required: ["totalPrice", "orderDetails"],
                    properties: { totalPrice: { type: "number" }, orderDetails: { type: "array", items: { $ref: "#/components/schemas/OrderDetailInput" } } },
                },
                ErrorResponse: {
                    type: "object", properties: { status: { type: "boolean", example: false }, message: { type: "string" } },
                },
            },
        },
    },
    apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
