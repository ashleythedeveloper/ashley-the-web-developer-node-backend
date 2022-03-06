const DB = require('./database');

exports.GetProjects = async (req, res) => {
  const projects = await DB.GetAllProjects()
  .then((data) => {
    return res.status(200).send(data);
  })
  .catch((err) => {
    res.status(500).send()
  })
};


exports.GetProject = async (req, res) => {
  const slug = req.body.slug;

  if (slug) {
    const project = await DB.GetProject(slug);
    const projectImages = await DB.GetProjectImages(project.id);
    const projectTechStack = await DB.GetProjectTechStack(project.id);

    console.log(project)
    console.log(projectImages)
    console.log(projectTechStack)

    return res.status(200).send({project: project, projectImages: projectImages, projectTechStack: projectTechStack})
  }
}

