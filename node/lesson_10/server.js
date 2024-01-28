const dotenv = require(`dotenv`);
const mongoose = require('mongoose');

dotenv.config({ path: `./config.env` });
//synchronous uncaught exception handling
process.on('uncaughtException', err => {
  console.log("Unhandled Exception! Exiting from process");
  console.log(err.name,err.message);
  //forceful termination
  process.exit(1);
});
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
//opetions are passed to overcome deprecation warning
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    //useFindAndModify: false
  })
  .then((con) => {
    //console.log(con.connection);
    console.log('Connection successful!');
  });

const app = require(`./app`);
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
//handling unhandled rejection of promise whch emit an event, handling it by listening to obseravble
process.on('unhandledRejection', err => {
  console.log("Unhandled rejection! Exiting from process");
  console.log(err.name,err.message);
  //process.exit(1); //forceful termination
  //graceful termination
  server.close(() => { //graceful termination close gives server enough time to finish its work before exiting
    process.exit(1);
  })
});