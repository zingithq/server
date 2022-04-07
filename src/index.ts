import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';

import envConfig from './config/config';
import dbConfig from './config/mongoConfig';
import checkRequestOrigin from './middlewares/checkRequestOrigin.middleware';
import userRoutes from './components/user/user.routes';
import cartRoutes from './components/cart/cart.routes';
import outletRoutes from './components/outlet/outlet.routes';
import campusRoutes from './components/campus/campus.routes';
import itemRoutes from './components/item/item.routes';

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
// TODO: Add middlewares for rate limiting, rate slowing, fileLogging etc.
// TODO: Add route for versioning

dbConfig(envConfig.MONGO_URI);

app.get('/', (_: Request, res: Response) =>
	res.status(200).json({ response: 'Hello World' })
);

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/outlet', outletRoutes);
app.use('/api/v1/item', itemRoutes);
app.use('/api/v1/campus', campusRoutes);

const { PORT }: { PORT: number } = envConfig;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
