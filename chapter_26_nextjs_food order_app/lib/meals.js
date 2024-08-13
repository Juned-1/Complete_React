import fs from "node:fs";
import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";
import { Stream } from "node:stream";
const db = sql("meals.db"); //establishing connection
export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 5000)); //arbitary delay simulate delay in async server component
  //preparing sql statement and run the object query which is returned after preparation
  //throw new Error('failed to load data');
  return db.prepare(`SELECT * FROM meals`).all(); //run method used to insert data, all is used to retrieve data, retrieve all rows, for single row, get()
  //SQLlit does not return promise
}
export function getMeal(slug) {
  return db.prepare("SELECT * FROM meals WHERE slug=?").get(slug); //'SELECT * FROM meals WHERE slug='+slug is vulnerable to sql injection
}

export async function saveMeal(meal) {
  //creating slug based on title
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions); //snitizing input
  const extension = meal.image.name.split(".").pop();
  //generate unique file name, not file name of user
  const fileName = `${meal.slug}-${Date.now()}.${extension}`;
  const stream = fs.createWriteStream(`public/images/${fileName}`); //accept path and return writeStream object
  //creating or buffering image
  const bufferedImage = await meal.image.arrayBuffer();
  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error("Saving image failed!");
    }
  }); //write method wants a chunk is buffer, since we have arrayBuffer, we convert it back to normal buffer since chunk is normal buffer

  //we will make image as path, we don't want to store image in db
  meal.image = `/images/${fileName}`;

  //saving in DataBase
  db.prepare(
    `INSERT INTO meals
    (title, summary, instructions, creator, creator_email, image, slug)
    VALUES (
      @title,
      @summary,
      @instructions,
      @creator,
      @creator_email,
      @image,
      @slug
   )`
  ).run(meal);
  //instead of so many placeholder ?, we can use format name and pass an object with same key as value
  //better sqlite will look at package with same key name to extract the values stored under that property name
}
