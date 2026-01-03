import redisConnect from "../../../../Config/RedisClient.js";
import { Domain } from "../../../../Models/domain.model.js";
import { Project } from "../../../../Models/projects.model.js";

const DeleteDomain = async (req, res) => {
    try {
        const {projectId} = req.params;
        const domainname = req.body.domains[0];
        console.log("domainname", domainname);

        if(!projectId || !domainname){
            return res.status(400).json({
                message: "projectid and domainname is not provided"
            })
        }

        const project = Project.findOne({projectid: projectId , isActive: 'active'});
        if(!project){
            return res.status(400).json({
                message: "Invlaid Project"
            })
        }

    
        const domain = await Domain.findOneAndUpdate(
            {projectid: projectId , alloweddomain: domainname},
            {$pull: {alloweddomain: domainname}},
            {new: true}
        )

        if(!domain){
            return res.status(400).json({
                message: "Failed to delete"
            })
        }

        const result = await redisConnect.sRem(`devload/project:${projectId}:domains`, domainname)
        if(result===1){
            console.log(`domain removed`)
        }
        if(result === 0){
            console.log(`Not Found`)
        }


        return res.status(200).json({
            message: "delete Success"
        })


    } catch (error) {
        console.error("Error deleting domain:", error);
        return res.status(500).json({ error: "An error occurred while deleting the domain." });
    }
}

export { DeleteDomain };