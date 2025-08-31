const userRegister = async (req, res)=>{
    try {
        console.log("User registration data:");
        res.status(200).json({
            message: "User registered successfully",
            
        });
    } catch (error) {
        console.error("Error occurred during user registration:", error);
        res.status(500).json({
            message: "User registration failed",
            error: error.message
        });
    }
}

export { userRegister }; 