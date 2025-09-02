 const asyncHandler = (requestHandler) => {
       return (req, res, next)=>{
            Promise.resolve(requestHandler(req, res, next))
            .catch((err)=>{
                // If an error occurs, we catch it and pass it to the next middleware
                next(err);
            })
        }
 }
 export { asyncHandler };
 


// 2nd way of writing asyncHandler is
// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next);
//     } catch (error) {
//         res.status(error.code || 500).json({
//                  success: false,
//             message: error.message || "Custom Error"
//         })
//     }
// };

// export { asyncHandler };
