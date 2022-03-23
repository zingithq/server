import crypto from 'crypto';

import envConfig from '../config/config';

const algorightm = 'aes-256-cbc';
const key = envConfig.CRYPTO_KEY;
const iv = envConfig.CRYPTO_IV;

const decryptText = (text: string): string => {
	const decipher = crypto.createDecipheriv(algorightm, key, iv);
	let decrypted = decipher.update(text, 'hex', 'utf8');
	decrypted += decipher.final('utf8');
	return decrypted;
};

export default decryptText;
