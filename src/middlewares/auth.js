const adminAuth = (req, res, next) => {
    const token = "xyz123"
    const isValidToken = token === "xyz123"
    if (!isValidToken) {
        return res.status(401).json({ message: "Unauthorized" });
    } else {
        console.log("Token is valid");
        next();
    }

}
const userAuth = (req, res, next) => {
    const token = "xyz12345"
    const isValidToken = token === "xyz123456"
    if (!isValidToken) {
        return res.status(401).json({ message: "Unauthorized" });
    } else {
        console.log("Token is valid");
        next();
    }

}
module.exports = { adminAuth, userAuth };