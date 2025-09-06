import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLInputObjectType } from 'graphql';

const fields = {
  psp: { type: GraphQLString },
  account: { type: GraphQLString },
  name: { type: GraphQLString },
  document: { type: GraphQLString },
  type: { type: GraphQLString },
  pixKey: { type: GraphQLString }
}

export const PartyType = new GraphQLObjectType({
	name: 'Party',
	fields: fields
});

export const PartyInputType = new GraphQLInputObjectType({
  name: 'PartyInput',
  fields: fields,
});