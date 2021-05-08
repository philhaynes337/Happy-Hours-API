module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV, //|| 'development',
    API_TOKEN: process.env.API_TOKEN, //|| 'testtoken',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/happyhoursdb',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://postgres@localhost/happyhoursdb',
    JWT_SECRET: process.env.JWT_SECRET,// || 'test',
}