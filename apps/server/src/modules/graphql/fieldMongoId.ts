import { GraphQLString } from "graphql"

const fieldMongoId = () => ({
  _id: {
    type: GraphQLString,
    resolve: (obj: any) => obj._id,
  },
})

export { fieldMongoId }