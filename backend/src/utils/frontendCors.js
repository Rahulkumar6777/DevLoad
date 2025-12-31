const corsLocally = {
    origin: ['http://localhost:5173'],
    methods: ['POST' , 'GET' , 'PUT' , 'DELETE' , 'OPTIONS' , 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}

const corsProdution = {
    origin: ['https://app-devload.cloudcoderhub.com'],
    methods: ['POST' , 'GET' , 'PUT' , 'DELETE' , 'OPTIONS' , 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}

export const corsPublic = {
    origin: '*',
    methods: ['GET'],
    credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization' , 'x-api-key'],
}

export const corsFrontend  = process.env.NODE_ENV === 'production' ? corsProdution : corsLocally;