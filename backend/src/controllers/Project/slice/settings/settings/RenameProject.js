import { Model } from '../../../../../models/index.js'

const RenameProject = async(req , res)=>{
    try {
        const user = req.user;
        if(!user){
            return res.status(403).json({
                message: "Invalid user"
            })
        }

        const projectname = req.body.projectname;
        const projectid = req.params.projectid;
        

        if(!projectid){
            return res.status(400).json({   
                message: "Project ID is required"
            })
        };

        if(!projectname){
            return res.status(400).json({
                message: "Project name is required"
            })
        };


        if(projectname.length < 3 || projectname.length > 30){
            return res.status(400).json({
                message: "Project name must be between 3 and 30 characters"
            })
        }

        const updatedvalue = await Model.Project.findOneAndUpdate(
            {userid: user._id , _id: projectid},
            {$set: {projectname: projectname}},
            {new: true}
        )

        if(!updatedvalue){
            return res.status(400).json({
                message: "Invalid Projectid"
            })
        }

        return res.status(200).json({
            message: "Successfully Updated"
        })
    } catch (error) {
      return res.status(500).json({
        error: "Internal server Error"
      })  
    }
}


export {RenameProject}