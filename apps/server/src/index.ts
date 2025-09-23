import http from 'http';

import { app } from './server/app';
import { config } from './config';
import { connectDatabase } from './database';
import { createGraphqlWs } from './server/createGraphqlWs';
import { getContext } from './server/getContext';
import { schema } from './schema/schema';
import { wsServer } from './server/wsServer';
import { runBullMq } from './modules/worker/runBullMq';

(async () => {
	console.log('🚀 SERVIDOR INICIANDO');
	await connectDatabase();
	console.log('✅ Database conectado!');

	const server = http.createServer(app.callback());

	// wsServer(server);

	createGraphqlWs(server, '/graphql/ws', {
		schema,
		context: getContext(),
	});

	createGraphqlWs(server, '/console/graphql/ws', {
		schema,
		context: async () => getContext(),
	});

  console.log('🔄 Iniciando BullMQ worker...');
  await runBullMq();

	server.listen(config.PORT, () => {
		// eslint-disable-next-line
		console.log(`Server running on port:${config.PORT}`);
	});
})();
