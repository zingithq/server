import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../.env') });

const environment = process.env.NODE_ENV as string;

type Config = {
	PORT: number;
	MONGO_URI: string;
	JWT_SECRET: string;
	ENVIRONMENT: string;
	CRYPTO_KEY: string;
	CRYPTO_IV: string;
	ORIGIN_EXPIRY_TIME: number;
};

const envConfig: Config =
	environment === 'production'
		? {
				PORT: Number(process.env.PORT),
				MONGO_URI: process.env.MONGO_URI as string,
				JWT_SECRET: process.env.JWT_SECRET as string,
				ENVIRONMENT: process.env.NODE_ENV as string,
				CRYPTO_KEY: process.env.CRYPTO_KEY as string,
				CRYPTO_IV: process.env.CRYPTO_IV as string,
				ORIGIN_EXPIRY_TIME: Number(process.env.ORIGIN_EXPIRY_TIME),
		  }
		: {
				PORT: 8080,
				MONGO_URI: 'mongodb://localhost:27017/zingit',
				JWT_SECRET: 'blablasecrethello123',
				ENVIRONMENT: 'development',
				CRYPTO_KEY: '11111111111111111111111111111111',
				CRYPTO_IV: '1111111111111111',
				ORIGIN_EXPIRY_TIME: 10 * 86400,
		  };

export default envConfig;
