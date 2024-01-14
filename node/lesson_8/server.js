const dotenv = require(`dotenv`);
const mongoose = require('mongoose');

dotenv.config({ path: `./config.env` });
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
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
