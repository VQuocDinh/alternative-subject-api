import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import initRoutes from './src/routes/index.js';
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger.config.js');

dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '10mb' }));

app.use(express.json());
app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Origin',
      'X-Requested-With',
      'Accept',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Methods',
      'Access-Control-Request-Headers',
      'Access-Control-Request-Method',
      'X-Client-Id',
      'X-Api-Key',
    ],
  })
);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

initRoutes(app);

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    stack: error.stack,
    message: error.message,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
