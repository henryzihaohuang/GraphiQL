const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const expressGraphQL = require('express-graphql').graphqlHTTP
const app = express();

app.use('./graphql', expressGraphQL({
    graphiql: true
}))

app.listen(4000, () =>{
    console.log('Listening')
});
