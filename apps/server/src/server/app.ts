import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'kcors';
import { graphqlHTTP } from 'koa-graphql';
import Router from 'koa-router';
import logger from 'koa-logger';

import { schema } from '../schema/schema';
import { getContext } from './getContext';
import { createWebsocketMiddleware } from './websocketMiddleware';
import { Account } from '../modules/account/AccountModel';
import { users } from '../modules/user/users';
import { partyEnum } from '../modules/graphql/partyEnum';

const app = new Koa();

app.use(cors({ origin: '*' }));
app.use(logger());
app.use(
	bodyParser({
		onerror(err, ctx) {
			ctx.throw(err, 422);
		},
	})
);

app.use(createWebsocketMiddleware());

const routes = new Router();

routes.get('/', async (ctx) => {
	ctx.body = { message: 'Bank server is running...' };
});

// Admin endpoints for accounts management
routes.post('/admin/accounts/seed', async (ctx) => {
	try {
		const accounts = await Account.find();

		if (accounts.length === users.length) {
			ctx.body = { message: 'Accounts already seeded' };
			return;
		}

		await Account.deleteMany({});

		await new Account({
			pixKey: '95b7f30c-2fad-43cd-85d1-f5615cf28a39',
			balance: 500000,
			user: users[0]._id,
			type: partyEnum.PHYSICAL,
			psp: 'Bank Challanger LTDA',
		}).save();

		await new Account({
			pixKey: '08771dd3-32c0-4fe7-8725-6175ab14c7ee',
			balance: 100000,
			user: users[1]._id,
			type: partyEnum.LEGAL,
			psp: 'Bank Challanger LTDA',
		}).save();

		ctx.body = { message: 'Accounts seeded successfully' };
	} catch (error) {
		ctx.status = 500;
		ctx.body = { error: 'Failed to seed accounts', details: error };
	}
});

routes.post('/admin/accounts/reset', async (ctx) => {
	try {
		const newBalance = 1000000000;

		await Account.updateOne(
			{ pixKey: '95b7f30c-2fad-43cd-85d1-f5615cf28a39' },
			{ balance: newBalance }
		);

		await Account.updateOne(
			{ pixKey: '08771dd3-32c0-4fe7-8725-6175ab14c7ee' },
			{ balance: newBalance }
		);

		ctx.body = {
			message: 'Accounts reset successfully',
			balance: { account1: newBalance, account2: newBalance },
		};
	} catch (error) {
		ctx.status = 500;
		ctx.body = { error: 'Failed to reset accounts', details: error };
	}
});

// routes.all('/graphql/ws', wsServer);

routes.all(
	'/graphql',
	graphqlHTTP(() => ({
		schema,
		graphiql: true,
		context: getContext(),
	}))
);

app.use(routes.routes());
app.use(routes.allowedMethods());

export { app };
