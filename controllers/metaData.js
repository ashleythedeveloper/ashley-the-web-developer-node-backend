const DB = require('./database');


exports.GetMetaData = async (req, res, next) => {
  const metaData = await DB.getMetaData(req.body.location);

  res.status(201).send(metaData);
};