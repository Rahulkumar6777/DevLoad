import { app } from "./index.js"; 

app.listen(process.env.PORT , ()=> {
    console.log(`server is running on http://localhost:${process.env.PORT}`)
});