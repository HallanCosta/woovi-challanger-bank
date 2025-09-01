import { GraphQLObjectType } from 'graphql';

import { messageConnectionField } from '../modules/message/messageFields';
import { accountConnectionField } from '../modules/account/accountFields';
import { ledgerEntryConnectionField } from '../modules/ledgerEntry/ledgerEntryFields';
import { userConnectionField } from '../modules/user/userFields';

export const QueryType = new GraphQLObjectType({
	name: 'Query',
	fields: () => ({
		...messageConnectionField('messages'),
		...accountConnectionField('accounts'),
		...userConnectionField('users'),
		...ledgerEntryConnectionField('ledgerEntries'),
	}),
});
