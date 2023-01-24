import 'dotenv/config';
import './models/index.js';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import swaggerDocs from '../swagger.json';

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

routes(app);
app.use((_, res) => {
  res.status(404).send('404 - Página não encontrada!');
});

app.listen(process.env.API_PORT, () => {
  console.log(`API rodando em http://localhost:${process.env.API_PORT}`);
  console.log(`DOCS em http://localhost:${process.env.API_PORT}/api-docs/`);
});
