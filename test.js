// Node.js program to demonstrate the
// crypto.createCipheriv() method

// Includes crypto module
const crypto = require('crypto');

// Defining algorithm
const algorithm = 'aes-256-cbc';

// Defining key
const key = '11111111111111111111111111111111';

// Defining iv
const iv = '1111111111111111';

// An encrypt function
function encrypt(text) {
	// Creating Cipheriv with its parameter
	let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);

	// Updating text
	let encrypted = cipher.update(text);

	// Using concatenation
	encrypted = Buffer.concat([encrypted, cipher.final()]);

	// Returning iv and encrypted data
	return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(text) {
	// Creating Decipheriv with its parameter
	let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);

	// Updating text
	let decrypted = decipher.update(Buffer.from(text.encryptedData, 'hex'));

	// Using concatenation
	decrypted = Buffer.concat([decrypted, decipher.final()]);

	// Returning decrypted data
	return decrypted.toString();
}

// Displays output
var output = encrypt(new Date().getTime().toString() + '/zing_consumer');
var decrypted = decrypt(output);
console.log(output, decrypted, key);

// item image: only favs have image
// Rating system: Ask for additional
// Order Decline: Ask for reason
// Make database
