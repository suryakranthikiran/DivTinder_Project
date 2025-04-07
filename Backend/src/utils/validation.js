const validator = require('validator');

const validateSignUpData = (req) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("Name is not valid")
    }
    else if (firstName.length < 4 || firstName.length > 30) {
        throw new Error("First name should be 4-50 characters long")
    }
    else if (!validator.isAlpha(firstName)) {
        throw new Error("First name should only contain alphabets")
    }
    else if (!validator.isAlpha(lastName)) {
        throw new Error("Last name should only contain alphabets")
    }
    else if (!email) {
        throw new Error("Email is not valid")
    }
    else if (!validator.isEmail(email)) {
        throw new Error("Email is not valid")
    }
    else if (!password) {
        throw new Error("Password is not valid")
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Password should be strong")
    }
}

const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "email", "photoUrl", "gender", "age", "about", "skills"]
    const isEditAllowed = Object.keys(req.body).every((key) => {
        return allowedEditFields.includes(key)
    })
    return isEditAllowed
}

module.exports = {
    validateSignUpData,
    validateEditProfileData
}