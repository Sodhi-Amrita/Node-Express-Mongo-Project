require('dotenv').config()

const username = process.env.USER_NAME;
const password = process.env.PASS_WORD;
module.exports = {
    mongoDBUrl: `mongodb+srv://${username}:${password}@cluster0.wsw0n0z.mongodb.net/sample_geospatial?retryWrites=true`,
    secret: 'eggwhitesonly'
}
