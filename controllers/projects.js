const DB = require('./database');

exports.GetProjects = async (req, res) => {
  const projects = await DB.GetAllProjects()
  .then((data) => {
    return res.status(200).send(data);
  })
  .catch((err) => {
    res.status(500).send()
  })
}