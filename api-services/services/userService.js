const prisma = require("../config/prisma");
const userHelper = require("../helpers/userHelper");
const authHelper = require("../helpers/authHelper");

const register = async(username,password)=>{
    const userExists = await prisma.user.findFirst({
        where:{
            username:username
        }
    });
    if(userExists){
        throw new Error("User already exists");
    }

    const hashPass = await userHelper.hashPassword(password);

    const user = await prisma.user.create({
        data:{
            username:username,
            password_hash:hashPass
        }
    });

    return user;
}

const login = async(username,password)=>{
    const userExists = await prisma.user.findFirst({
        where:{
            username:username
        }
    });

    if(!userExists){
        throw new Error("Wrong credentials");
    }

    const storedHash = userExists.password_hash;

    const match = await userHelper.verifyPassword(password,storedHash);

    if(!match){
        throw new Error("Wrong credentials");
    }

    
    const data ={
        id:userExists.id,
        username:username
    };

    const token = authHelper.signToken(data);

    return token;

}

module.exports = {
    register,
    login
};