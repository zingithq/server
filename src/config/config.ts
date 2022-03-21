import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../.env') });

const environment: string = process.env.NODE_ENV as string;

type Config = {
	PORT: number;
	MONGO_URI: string;
	JWT_SECRET: string;
	ENVIRONMENT: string;
};

const envConfig: Config =
	environment === 'production'
		? {
				PORT: Number(process.env.PORT),
				MONGO_URI: process.env.MONGO_URI as string,
				JWT_SECRET: process.env.JWT_SECRET as string,
				ENVIRONMENT: process.env.NODE_ENV as string,
		  }
		: {
				PORT: 8080,
				MONGO_URI: 'mongodb://localhost:27017/zingit',
				JWT_SECRET: 'blablasecrethello123',
				ENVIRONMENT: 'development',
		  };

export default envConfig;
