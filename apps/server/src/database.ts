import mongoose from 'mongoose';

import { config } from './config';

async function connectDatabase() {
  mongoose.connection.on('error', (error) => {
    console.error('Database connection error:', error);
    process.exit(1);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Database connection disconnected');
  });

  mongoose.connection.on('connected', () => {
    console.log('Database connection established');
  });

	// eslint-disable-next-line
	mongoose.connection.on('close', () =>
		console.log('Database connection closed.')
	);

	await mongoose.connect(config.MONGO_URI);
}

export { connectDatabase };
