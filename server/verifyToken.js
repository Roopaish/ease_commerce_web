import jwt from "jsonwebtoken";
import { createError } from "./error.js";

// Verify if the accessToken is valid before making most of the api requests
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(createError(401, "You are not authenticated!"));

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Invalid Token!"));

    req.user = user; // adding user in request body before passing to other functions
    next();
  });
};

/*
# Working

# Token as Cookie is sent to the client which is generated using secretKey ( process.env.JWT) which will be used to decode it
const token = jwt.sign({ id: user._id }, process.env.JWT); 
res
    .cookie("access_token", token, {
      httpOnly: true, 
    })
    .status(200)
    .json(others);

# Verifying user using the access_token from client cookie
  jwt.verify(token, process.env.jwt, (err, user) => {});
- we take token = access_token that is stored as a cookie in the client 
  that comes automatically with the request object
- jwt.verify takes this token and extract original { id: user._id } from this token using the secret key
- we now update the request object by adding user too
- next() fxn will call the next immediate fxn
- id passed via the api end point and user.id extracted by above method is compared to validate user
*/
