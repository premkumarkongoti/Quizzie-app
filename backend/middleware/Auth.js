
const jwt = require('jsonwebtoken');
require('dotenv').config(); 

const requireAuth = (req, res, next) => {
  const token = req.header('Authorization');

console.log(`headers.authorization ${token}`)
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const {userId} = jwt.verify(token, process.env.JWT_SECRET);
    console.log(userId);
    req.userId = userId;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = requireAuth;
 











// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization']; 
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'Authorization token is missing' });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
//     if (err) {
//       console.error('Error verifying token:', err);
//       return res.status(403).json({ message: 'Invalid token' });
//     }
//     req.user = decodedToken.user;
//     next();
//   });
// };

// module.exports = authenticateToken;









// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const requireAuth = (req, res, next) => {
//   const authHeader = req.header('Authorization');

//   console.log(`headers.authorization ${authHeader}`)
//   if (!authHeader) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   const token = authHeader.split(' ')[1]; // Remove "Bearer" prefix
//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   try {
//     const { userId } = jwt.verify(token, process.env.JWT_SECRET);
//     console.log(userId);
//     req.userId = userId;
//     next();
//   } catch (err) {
//     console.error(err);
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
// };

// module.exports = requireAuth;
