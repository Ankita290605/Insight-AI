const allowedTypes = ["application/pdf"];

const checkType = (type)=>{
    
    if(!type || !allowedTypes.includes(type)){
       
        return false;
    }
    return true;
}

module.exports = {checkType};