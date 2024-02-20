class APIFeatures {
  constructor(query, queryString) {
    this.query = query; //store query promise
    this.queryString = queryString; //store query string
  }
  filter() {
    //BUILD QUERY
    //Technique 1
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    //1a.filtering
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    //Technique 2
    //we start chaining some mongoose built in method
    //const tours = await Tour.find(); --not ok, since await return result, not query
    // const query = Tour.find() //Ok return query on which sort, pagination etc can be done
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');
    //If we await first query method then we can not chain other method on it(like sort, pagination, limit etc)
    //since generally find() method returns query and on query object we have method like sort, pagination etc
    //But if we await initally it will return at find() it will directly return result.
    const queryObj = { ...this.queryString }; //destructuring query object to deep copy, otherwise it will be rference to req.query as shallow copy and change in reqQuery will change in req.query object.
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);
    //1b.Advance filtering
    //filter { difficulty: "easy", duration: {$gte: 5}}
    //query string: { difficulty: "easy", duration: {gte: 5}}
    //gt, gte, lt,lte
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    ); //g flag -- happen regex multiple time --global
    this.query = this.query.find(JSON.parse(queryString));
    return this; //returning entire object so that we can chain other method like sort
  }
  sort() {
    //2: sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      //sort(price ratingsAverage)
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  limitField() {
    //3. Field Limiting
    if (this.queryString.fields) {
      //mongoose require field name separated by space.
      //query = query.select("name duration price"); -- projecting
      const fields = this.queryString.fields.split(',').join(' '); //include mentioned fields
      console.log(fields);
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); //- indicates exluding of that filed
    }
    return this;
  }
  paginate() {
    //4. Pagination
    //page=2&limit=10 means 2 page each having 10 documents 1-10 page 1, 2-20 page 2, 3-30 and so on.
    const page = this.queryString.page * 1 || 1; //str to num, by default page 1
    const limit = this.queryString.limit * 1 || 100; //str to num, by default limit = 100
    const skip = (page - 1) * limit; //3rd page then (3-1)*10 we skip 20 value if limit = 10, and get values from 21-30

    this.query = this.query.skip(skip).limit(limit); //we skip 10 results to get result 11
    // if(req.query.page){
    //   const numTours = Tours.countDocuments();
    //   if(skip >= numTours) throw new Error("This page does not exist");
    // }
    return this;
  }
}
module.exports = APIFeatures;