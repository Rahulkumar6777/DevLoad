export const privateCors = {
    origin: ['http://localhost:5173'],
    methods: ['POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization' , 'x-api-key' , 'x-private-key']
}