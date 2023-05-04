const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) {
        return res.status(401).send({ message: "Unauthorized user attempts", success: false })
    }

    const token = authHeader.split(" ")[1]
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET,
            (err, decoded) => {
                if (err) {
                    return res.status(403).send({
                        message: "Unauthorized user attempts",
                        success: false
                    })
                }
                req.body.id = decoded.id;
                req.body.role = decoded.role;
                next();
            }
        )
    } else {
        res.status(400).send({
            message: "Please login no user found",
            success: false
        })
    }
}