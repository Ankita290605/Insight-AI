const bcrypt = require("bcrypt");

const saltRounds = 10;
const hashPassword = async(password)=>{
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password,salt);
}

const verifyPassword = async(InPass,StoredHash)=>{
    return await bcrypt.compare(InPass,StoredHash);
}

module.exports = {
    hashPassword,
    verifyPassword
};