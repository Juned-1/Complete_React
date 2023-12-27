//Multiple async await
const fs = require("fs");
const superagent = require("superagent");

const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject("I could not find the file 👎");
      resolve(data);
    });
  });
};
const writeFilePromise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject("Could not write the file 👎");
      resolve("succes");
    });
  });
};
const getDogPic = async () => {
  try {
    const data = await readFilePromise(`${__dirname}/dog.txt`);
    console.log(`Breed : ${data}`);
    //handling multiple promise
    const res1Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    ); //return promise, not result
    const res2Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    ); //return promise, not result
    const res3Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    ); //return promise, not result
    const all = await Promise.all([res1Pro, res2Pro, res3Pro]); //await for all promise passing array of promise
    //console.log(all);
    const imgs = all.map(el => el.body.message);
    console.log(imgs);
    await writeFilePromise(`${__dirname}/dog-image.txt`, imgs.join("\n"));
    console.log("Random dog image is saved to file!");
  } catch (err) {
    console.log(err);
    throw err;
  }
  return "2 : READY";
};
(async () => {
  try {
    console.log("1 : Getting dog pics");
    const value = await getDogPic();
    console.log(value);
    console.log("3 : Got dog pics");
  } catch (err) {
    console.log("ERROR 👎");
  }
})();
