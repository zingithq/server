import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';

import envConfig from './config/config';
import dbConfig from './config/mongoConfig';
import checkRequestOrigin from './middlewares/checkRequestOrigin.middleware';

const app: Application = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.enable('trust proxy'); // To log IP Address of the requests
app.use(
	morgan(
		':date[iso] :remote-addr :method :url :status :res[content-length] - :response-time ms'
	)
);
app.use(checkRequestOrigin);
// TODO: Add middlewares for rate limiting, rate slowing, origin blocking, fileLogging etc.

dbConfig(envConfig.MONGO_URI);

app.get('/', (req, res) => res.status(200).json({ message: 'Hello World' }));

const { PORT }: { PORT: number } = envConfig;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
