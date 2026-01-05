import { Model } from "../../../../models/index.js";

const GetAnalyticsData = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(403).json({
                message: "Invalid User"
            });
        }

        const projectid = req.params.projectid;
        if (!projectid) {
            return res.status(400).json({
                message: "Project ID not received"
            });
        }

       
        const findProject = await Model.Project.findOne({ 
            _id: projectid, 
            userid: user._id, 
            isActive: 'active' 
        });

        if (!findProject) {
            return res.status(404).json({
                message: "Invalid project or frozen project"
            });
        }

       
        const analytics = {
            
            projectname: findProject.projectname,
            projectid: findProject._id,
            
            
            totalUploads: findProject.totalUploads || 0,
            totaloptimisedfile: findProject.totaloptimisedfile || 0,
            
           
            storageUsed: findProject.storageUsed || 0,
            projectstoragelimit: findProject.projectstoragelimit || 0,
            storageProcessing: findProject.storageProcessing || 0,
            
           
            optimisedRawBytes: findProject.optimisedRawBytes || 0,
            optimisedFinalBytes: findProject.optimisedFinalBytes || 0,
            savedStorage: findProject.savedStorage || 0,
            
           
            requestsUsed: findProject.requestsUsed || 0,
            trafficused: findProject.trafficused || 0,
            
           
            maxfilesize: findProject.maxfilesize || 0,
            
           
            storagePercentage: findProject.projectstoragelimit > 0 
                ? ((findProject.storageUsed / findProject.projectstoragelimit) * 100).toFixed(2)
                : 0,
            optimizationRate: findProject.totalUploads > 0 
                ? ((findProject.totaloptimisedfile / findProject.totalUploads) * 100).toFixed(2)
                : 0,
            compressionRatio: findProject.optimisedRawBytes > 0 
                ? ((findProject.savedStorage / findProject.optimisedRawBytes) * 100).toFixed(2)
                : 0,
            
            
            fileTypeAllowed: findProject.fileTypeAllowed || [],
            isOptimise: findProject.isOptimise || false,
            
            
            createdAt: findProject.createdAt,
            updatedAt: findProject.updatedAt
        };

        return res.status(200).json({
            success: true,
            analytics: analytics,
            message: "Analytics data retrieved successfully"
        });

    } catch (error) {
        console.error('Analytics Error:', error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
            message: error.message
        });
    }
};

export { GetAnalyticsData };