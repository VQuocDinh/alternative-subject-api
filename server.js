import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import connection from './config/connectDB.js';
import initRoutes from './src/routes/index.js';


dotenv.config()
const app = express()
const port = process.env.PORT
app.use(bodyParser.json({ limit: '10mb' }));

app.use(express.json())
app.use(cors())
app.use(morgan('combined'))

connection()
initRoutes(app)


app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})