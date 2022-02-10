const DB = require('./database');


exports.GetMetaData = async (req, res, next) => {
  console.log(req.body.location)
  const metaData = await DB.getMetaData(req.body.location);

  res.status(201).send(metaData);
};