import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLInputObjectType } from 'graphql';

const fields = {
  ps: { type: new GraphQLNonNull(GraphQLString) },
  account: { type: GraphQLString },
  name: { type: new GraphQLNonNull(GraphQLString) },
  document: { type: new GraphQLNonNull(GraphQLString) },
  type: { type: new GraphQLNonNull(GraphQLString) },
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