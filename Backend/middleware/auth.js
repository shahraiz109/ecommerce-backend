    const ErrorHandler= require("../utils/ErrorHandler")
    const catchAsyncError= require("./catchAsyncError")
    const jwt= require("jsonwebtoken")
    // const catchAsyncError= require("./catchAsyncError")
    const User = require("../models/user")
const Shope = require("../models/shope")

    exports.isAuthenticated= catchAsyncError(async(req,res,next)=>{
        const {token}= req.cookies;

        if(!token){
            return next(new ErrorHandler("please login to continue"))
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)

        req.user=await User.findById(decoded.id)

        next()
    })

        exports.isSeller = catchAsyncError(async (req, res, next) => {
          const { seller_token } = req.cookies;

          if (!seller_token) {
            return next(new ErrorHandler("please login to continue"));
          }

          const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);

          req.seller = await Shope.findById(decoded.id);

          next();
        });

        exports.isAdmin = (...roles) => {
          return (req, res, next) => {
            if (!roles.includes(req.user.role)) {
              return next(
                new ErrorHandler(
                  `${req.user.role} can not access this resources!`
                )
              );
            }
            next();
          };
        };