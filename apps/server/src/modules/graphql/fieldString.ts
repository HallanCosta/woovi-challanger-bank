import { GraphQLString } from "graphql";

export const fieldString = (key: string) => ({
	[key]: {
    type: GraphQLString,
    resolve: (obj) => obj[key],
  },
});