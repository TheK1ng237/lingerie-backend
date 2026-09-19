import helmet from "helmet";


export const securityHeaders= helmet({
    contentSecurityPolicy:{
        directives:{
            defaultSrc:["'self'"],
            scriptSrc:["'self"],
            objectSrc:["'none'"]
        },
    },
    crossOriginResourcePolicy:{
        policy:'same-site'
    }
})

