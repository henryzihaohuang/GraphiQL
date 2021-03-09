const graphql = require('graphql');
const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
} = graphql;

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields:{
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString }
    }
})

//static list of users to show simple db structure
// const users = [
//     { id: '23', firstName: 'Bill', age: 20 },
//     { id: '47', firstName: 'Samantha', age: 21 }
// ]

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id:{ type: GraphQLString },
        firstName:{ type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                .then(res => res.data)
                
            }
        }
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            //you can ask me (server) about a user instance and any args associated
            args: { id: { type: GraphQLString } },

            //resolve is were we go into db or data store to find actual data w arg params

            //parentValue not used ever

            //_ is part of lodash library, goes through all  list of users.
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/users/${args.id}`)
                .then(res => res.data); //{data: {firstName:'bill}} axios response nested on .data

            }
        },
        //sibling to user
        company:{
            type: CompanyType,

            args: { id: { type: GraphQLString } },

            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(res => res.data); //{data: {firstName:'bill}} axios response nested on .data
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})
  