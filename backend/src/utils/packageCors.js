export const packageCors = {
    origin: '*',
    methods: ['POST', 'DELETE'],
    credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization' , 'x-api-key'],
}