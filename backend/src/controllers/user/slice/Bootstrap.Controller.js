import { Model } from "../../../models/index.js";

const BootStrap = async (req, res) => {
    try {

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        const user = req.user;

        let projectList = [];


        const projects = await Model.Project.find({ userid: user._id, isActive: 'active' }).lean();
        if (projects.length === 0) {
            projectList = []
        }


        projectList = projects.map(project => ({
            id: project._id,
            name: project.projectname,
            description: project.description || 'No description',
        }));


        const planConfigs = {
            free: {
                apiKeySupport: '1 key per project',
                support: 'Community Support',
            },
            member: {
                apiKeySupport: '5 keys per project (1 key by default)',
                support: 'Priority Email Support',
                renewsOn: user.subscriptionend
                    ? new Date(user.subscriptionend).toISOString()
                    : undefined,
            },
        };

        const plan = planConfigs[user.subscription] ? user.subscription : 'free';



        const response = {
            subscription: {
                plan: user.subscription,
                email: user.email,
                ...(plan !== 'free' && { renewsOn: planConfigs[plan].renewsOn }),
                features: {
                    maxProjects: user.totalProject,
                    maxOperations: user.maxRequests,
                    storageMB: user.maxStorage,
                    apiKeySupport: planConfigs[plan].apiKeySupport,
                    support: planConfigs[plan].support
                },
                isUnderRenew: user?.isUnderRenew,
                subscriptionEnd: user?.subscriptionEnd
            },
            profile: {
                name: user.fullName,
                createdAt: new Date(user?.createdAt).toISOString(),
            },
            projects: projectList,
        };


        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in BootStrap:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


export { BootStrap }