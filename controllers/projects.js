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

    return res.status(200).send({ project: project, projectImages: projectImages, projectTechStack: projectTechStack })
  }
};

exports.UpdateProject = async (req, res) => {
  const usersToken = res.locals.decodedToken;
  const projectData = [req.body.project, req.body.modifiedProject];
  const projectImages = [req.body.projectImages, req.body.modifiedProjectImages];
  const projectTechStack = [req.body.projectTechStack, req.body.modifiedProjectTechStack];


  const checkIfModified = async (originalData, modifiedData) => {
    if (JSON.stringify(originalData).localeCompare(JSON.stringify(modifiedData)) === 0) {
      return false
    }
    return true
  };


  const handleModifiedProjectData = async (modifiedData) => {
    const saveModifiedProjectData = await DB.UpdateProjectData(modifiedData);
  };


  const handleModifiedProjectImages = async (originalImageList, modifiedImageList) => {
    const imagesToRemove = []
    for (let modifiedImageNumber = 0; modifiedImageNumber < modifiedImageList.length; modifiedImageNumber++) {
      for (let imageNumber = 0; imageNumber < originalImageList.length; imageNumber++) {
        if (originalImageList[imageNumber].image_url !== modifiedImageList[modifiedImageNumber].image_url) {
          imagesToRemove.push(originalImageList.imageNumber);
        }
      }
    }
    console.log(imagesToRemove)
  };


  const handleModifiedProjectTechStack = async (originalTechStackList, modifiedTechStackList) => {
    const techToRemove = []
    if (modifiedTechStackList.length === 0) {
      originalTechStackList.map((tech) => {
        techToRemove.push(tech);
      })
    } else {
      for (let modifiedTechNumber = 0; modifiedTechNumber < modifiedTechStackList.length; modifiedTechNumber++) {
        for (let techNumber = 0; techNumber < originalTechStackList.length; techNumber++) {
          if (originalTechStackList[techNumber].id !== modifiedTechStackList[modifiedTechNumber].id) {
            techToRemove.push(originalTechStackList[techNumber]);
          }
        }
      }
    }
    techToRemove.map(async (tech) => {
      await DB.RemoveTechFromProject(tech);
    })
    return
  };


  const checkProjectData = async () => {
    if (await checkIfModified(projectData[0], projectData[1])) {
      await handleModifiedProjectData(projectData[1])
      return "Data Modified and Saved"
    }
    return "No data modified"
  };


  const checkTechStackData = async () => {
    if (await checkIfModified(projectTechStack[0], projectTechStack[1])) {
      await handleModifiedProjectTechStack(projectTechStack[0], projectTechStack[1]);
      return "Data Modified and Saved"
    }
    return "No data modified"
  }

  const checkOwnership = async (usersId, projectId) => {
    const check = await DB.CheckOwnershipOfProject(usersId, projectId);
    if (check.rows.length > 0) {
      return true
    } 
    return false
  }

  const isOwner  = await checkOwnership(usersToken.userId, projectData[1].id);
  if (!isOwner) {
    res.status(401).send({message: "You are not the owner of this project!"})
  } else {
  let p = await checkTechStackData();
  let q = await checkProjectData()


  res.status(200).send({p, q})
  }
}


