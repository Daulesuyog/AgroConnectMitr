// auth.js
import jwt from 'jsonwebtoken';

export const verifyAuth = (roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  } else if (!Array.isArray(roles)) {
    roles = [];
  }
  console.log('verifyAuth received roles:', roles); // Debug received roles

  return (req, res, next) => {
    const token = req.headers["authorization"] || req.headers["Authorization"];
    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ message: "You need to login first" });
    }

    const authToken = token.split(" ")[1];

    try {
      const decoded = jwt.verify(authToken, process.env.AGROCONNECTMITR_SECRET);
      // console.log('Decoded token in verifyAuth:', decoded); // Debug decoded payload
      if (roles.length && !roles.includes(decoded.role)) {
        console.log('Role check failed. Expected:', roles, 'Got:', decoded.role); // Debug role mismatch
        return res.status(403).json({ message: "You are not authorized" });
      }
      req.user = decoded;
      next();
    } catch (err) {
      console.error("Authentication error:", err.message, 'Token:', authToken); // Detailed error
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

// // auth.js
// import jwt from 'jsonwebtoken';

// export const verifyAuth = (roles = []) => {
//   if (typeof roles === "string") {
//     roles = [roles];
//   }
//   console.log('verifyAuth received roles:', roles); // Debug received roles

//   return (req, res, next) => {
//     const token = req.headers["authorization"] || req.headers["Authorization"];
//     if (!token || !token.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "You need to login first" });
//     }

//     const authToken = token.split(" ")[1];

//     try {
//       const decoded = jwt.verify(authToken, process.env.AGROCONNECTMITR_SECRET);
//       console.log('Decoded token in verifyAuth:', decoded); // Debug decoded payload
//       if (roles.length && !roles.includes(decoded.role)) {
//         console.log('Role check failed. Expected:', roles, 'Got:', decoded.role); // Debug role mismatch
//         return res.status(403).json({ message: "You are not authorized" });
//       }
//       req.user = decoded;
//       next();
//     } catch (err) {
//       console.error("Authentication error:", err.message, 'Token:', authToken); // Detailed error
//       return res.status(401).json({ message: "Invalid token" });
//     }
//   };
// };