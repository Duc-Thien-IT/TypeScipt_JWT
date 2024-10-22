const User = require("../models/user");

const userController = {
    getAllUsers: async(req, res) => {
        try{
            const user = await User.findAll();
            res.status(200).json(user);
        }
        catch(err)
        {
            console.error('Error fetching users: ', err);
            res.status(500).json(err);
        }
    },

    getUser: async(req, res) => {
        try{
            const user = await User.findByPk(req.params.id);
            if(!user){
                res.status(404).json("User not found ");
            }
            res.status(200).json(user);
        }
        catch(err){
            res.status(500).json({ err: "Information User Failed"});
        }
    },

    deleteUser: async(req, res) => {
        try{
            const user = await User.findByPk(req.params.id); //xoa that la findByIdAndDelete
            res.status(200).json("Delete successfully");
        }
        catch(err)
        {
            res.status(500).json(err);
        }
    },


};

module.exports = userController;