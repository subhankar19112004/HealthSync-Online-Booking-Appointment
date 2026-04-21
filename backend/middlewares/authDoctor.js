 import jwt from "jsonwebtoken";
 
 const authDoctor = async (req, res, next) => {
     try {
         const { dtoken } = req.headers;
         if(!dtoken) {
             return res.status(400).json({
                 message: "Not Authorized, you will not welcome here",
                 success: false
            });
         }
         const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
         console.log("token_decode = " , token_decode);
         req.docId = token_decode?.userId; // ✅ safer place to store it 
         console.log(req.docId);
         next();
     } catch (error) {
         console.log(error);
         res.status(500).json({
             message: "Something went wrong",
             success: false
         });
     }
 };
 
 export default authDoctor;
 