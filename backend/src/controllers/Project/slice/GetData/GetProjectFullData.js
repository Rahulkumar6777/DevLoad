import { Model } from "../../../../models/index.js";

const GetProjectFullData= async (req , res)=>{
    try {
        const user = req.user;
        if(!user){
            return res.status(403).json({
                message: "Invalid User"
            })
        }

        const projectid = req.params.projectid;
        if(!projectid){
            return res.status(400).json({
                message: "Projectid not Received"
            })
        }

        const findProject = await Model.Project.findOne({_id: projectid , userid: user._id , isActive: 'active'});
        if(!findProject){
            return res.status(404).json({
                message: "Invalid project or frozen project"
            })
        }

        let alloweddomains =[];
        const Domains = await Model.Domain.findOne({projectid: projectid});
        if(!Domains){
            console.log("No domains found for this project");
        }
        if(Domains){
            alloweddomains = Domains.alloweddomain
        }
        

        const file = await Model.File.find({projectid , status: 'active'});

        const filedata = file.map(data => ({
            filename: data.originalfilename,
            publicurl: data.publicUrl,
            downloadeurl: data.downloadeUrl,
            deleteurl: data.fDeleteUr,
            filetype: data.type,
            filesize: data.size,
            fileid: data.filename,
            underProcessing: data.underProcessing
        }))


        const uploading = {
            maxfilesize: findProject.maxfilesize,
            filetype: findProject.fileTypeAllowed,
        }

        const project = {
            projectname: findProject.projectname,
            projectdescription: findProject.description,
            maxstorage: findProject.projectstoragelimit,
            alloweddomain: alloweddomains
        };

        const processing = {
            areYouWantToOptimise: findProject.isOptimise,
            wantToSendEmailNotificationOnAfterOptimisation: findProject.emailSendPreference
        }


        return res.status(200).json({
            files: filedata,
            settings: {
                uploading: uploading,
                project: project,
                processing: processing
            }
        }
        )

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}


export {GetProjectFullData}