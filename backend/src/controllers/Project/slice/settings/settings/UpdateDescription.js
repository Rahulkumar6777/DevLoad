import { Model } from "../../../../../models/index.js";

const UpdateDescription = async(req , res)=>{
    try {
        const user = req.user;
        if(!user){
            return res.status(403).json({
                message: "Invalid user"
            })
        }

        const description = req.body.description;
        const projectid = req.params.projectid;

        if(!projectid){
            return res.status(400).json({
                message: "Project ID is required"
            })
        };

        if(!description){
            return res.status(400).json({
                message: "Description is required"
            })
        };

        if(description.length < 3 || description.length > 50){
            return res.status(400).json({
                message: "Description must be between 3 and 50 characters"
            })
        };

        const updatedvalue = await Model.Project.findOneAndUpdate(
            {userid: user._id , _id: projectid},
            {$set: {description: description}},
            {new: true}
        );

        if(!updatedvalue){
            return res.status(400).json({
                message: "Invalid Projectid"
            })
        };

        return res.status(200).json({
            message: "Successfully Updated"
        });
    } catch (error) {
      return res.status(500).json({
        error: "Internal server Error"
      })  
    }
}

export {UpdateDescription}