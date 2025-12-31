export const packageCors = {
    origin: '*',
    methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization' , 'x-api-key'],
}