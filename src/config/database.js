import mongoose from 'mongoose';
const mongoDB = process.env.MONGODB_URL;
const options = {
  keepAlive: true,
  keepAliveInitialDelay: 300000,
  connectTimeoutMS: 30000,
  autoIndex: false,
  socketTimeoutMS: 30000,
};
if (process.env.MONGODB_USER) {
  options.user = process.env.MONGODB_USER;
  options.pass = process.env.MONGODB_PASSWORD;
}
if (process.env.MONGODB_AUTHDB) {
  options.authSource = process.env.MONGODB_AUTHDB;
}
mongoose.set('strictQuery', false);
// Conectar inmediatamente al requerir el módulo
mongoose.connect(mongoDB, options)
  .then(() => console.log('Database connected'))
  .catch(err => {
    console.error('DB connection error:', err);
    process.exit(1);
  });

