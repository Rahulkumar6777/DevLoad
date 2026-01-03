const Logout = async (req , res) => {
   try {
        const user = req.user;

        console.log("pauch gaye")

        user.refreshtoken = '';
        user.save({validateBeforeSave: false})

        return res.status(200)
        .clearCookie("RefreshToken")
        .json({
            message: "Logout Success"
        })

   } catch (error) {
    return res.status(500).json({
        error: "Internal server Error"
    })
   } 
}

export {Logout};