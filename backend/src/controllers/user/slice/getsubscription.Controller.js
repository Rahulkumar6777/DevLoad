const Subscription = async (req, res) => {
    try {
        const user = req.user;

        const freeplan = {
            "plan": user.subscription,
            "email": user.email,
            "features": {
                "maxProjects": user.totalProject,
                "maxOperations": user.maxRequests,
                "storageMB": user.maxStorage,
                "apiKeySupport": "1 key per Project",
                "support": "Community Support"
            }
        }

        if (user.subscription === 'free') {
            return res.status(200).json(
                freeplan
            )
        }


        const proplan = {
            "plan": user.subscription,
            "email": user.email,
            "renewsOn": user.subscriptionEnd,
            "features": {
                "maxProjects": user.totalProject,
                "maxOperations": user.maxRequests,
                "storageMB": user.maxStorage,
                "apiKeySupport": "5 key per Project! by Default comes with 1 key!",
                "support": "Priority Email Support",
                "subscriptionEnd": user?.subscriptionEnd
            },
        }

        
        return res.status(200).json(
            proplan,
            
        )
    } catch (error) {
        return res.status(500).json({
            error: "Internal server Error"
        })
    }
}


export { Subscription }