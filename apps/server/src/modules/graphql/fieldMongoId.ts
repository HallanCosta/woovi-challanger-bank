import { GraphQLString } from "graphql"

const fieldMongoId = () => ({
  _id: {
    type: GraphQLString,
    resolve: (obj) => obj._id,
  },
})

export { fieldMongoId }