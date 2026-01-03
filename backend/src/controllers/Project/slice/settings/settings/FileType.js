import { Model } from "../../../../../models/index.js";

const FreevalidFileTypes = ['image', 'audio'];
const PaidvalidFileTypes = ['video'];
const AllValidFileTypes = [...FreevalidFileTypes, ...PaidvalidFileTypes];

const FileType = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(403).json({ message: "Invalid User" });
        }

        const projectid = req.params.projectid;
        if (!projectid) {
            return res.status(400).json({ message: "Project ID is required" });
        }

        const queryKeys = Object.keys(req.query);
        if (queryKeys.length !== 1) {
            return res.status(400).json({
                message: "Send exactly one filetype as query (e.g., ?image=on)"
            });
        }

        const filetypeKey = queryKeys[0];       
        const action = req.query[filetypeKey];  

        
        if (!AllValidFileTypes.includes(filetypeKey)) {
            return res.status(400).json({ message: "Invalid filetype key" });
        }

        if (PaidvalidFileTypes.includes(filetypeKey) && user.subscription !== 'member') {
            return res.status(403).json({ message: "Free users cannot modify 'video' type" });
        }

        if (action !== 'on' && action !== 'off') {
            return res.status(400).json({ message: "Invalid action. Use 'on' or 'off'" });
        }        
        
        const update = action === 'on'
            ? { $addToSet: { fileTypeAllowed: filetypeKey } }
            : { $pull: { fileTypeAllowed: filetypeKey } };

        const updatedProject = await Model.Project.findOneAndUpdate(
            { userid: user._id, projectid },
            update,
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({
            message: `Filetype '${filetypeKey}' is now ${action}`,
            fileTypeAllowed: updatedProject.fileTypeAllowed
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export { FileType };
