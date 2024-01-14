const dotenv = require(`dotenv`);
dotenv.config({ path: `./config.env` });

const app = require(`./app`);
//console.log(app.get("env")); -- Express environment variable
//console.log(process.env); //process comes from core module, we don't have to require it.
//5. INVOKING SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});