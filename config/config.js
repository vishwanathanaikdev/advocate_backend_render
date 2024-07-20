const dotenv = require('dotenv')

dotenv.config()

const {
    APP_URL, 
    APP_ENV, 
    PORT, 
    HOST, 
    DB_URL, 
    DB_USER_NAME, 
    DB_PASSWORD, 
    AWS_ACCESS_KEY, 
    AWS_SECRET_ACCESS_KEY, 
    AWS_BUCKET,
    EMAIL,
    REFRESH_TOKEN,
    CLIENT_SECRET,
    CLIENT_ID
} = process.env

module.exports = {
    app_url: APP_URL,
    app_env: APP_ENV,
    port: PORT,
    host: HOST,
    db_url: DB_URL,
    db_user_name: DB_USER_NAME,
    db_password: DB_PASSWORD,
    aws_access_key: AWS_ACCESS_KEY,
    aws_secret_access_key: AWS_SECRET_ACCESS_KEY,
    aws_bucket: AWS_BUCKET,
    email: EMAIL,
    refresh_token: REFRESH_TOKEN,
    client_secret: CLIENT_SECRET,
    client_id: CLIENT_ID
}