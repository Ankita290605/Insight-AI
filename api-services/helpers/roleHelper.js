const roles = {
    "OWNER":1,
    "ADMIN":2,
    "MEMBER":3
};

const checkIfValidRole = (role)=>{
    if(!(role in roles)){
        return false;
    }
    return true;
}
const checkAdminOrOwner = (role)=>{
    if(checkIfValidRole(role) && roles[role]<=2){
        return true;
    }
    return false;
}

const checkIfCurrentUserCanModify = (currentUserRole,targetUserRole,roleToChangeWith)=>{
    if(!checkIfValidRole(currentUserRole) || !checkIfValidRole(targetUserRole) || !checkIfValidRole(roleToChangeWith)){
        return false;
    }
    currentUserRole=roles[currentUserRole];
    targetUserRole=roles[targetUserRole];
    roleToChangeWith=roles[roleToChangeWith];
    if(currentUserRole>=targetUserRole){
        return false;
    }
    if(currentUserRole>=roleToChangeWith){
        return false;
    }
    if(targetUserRole<=roleToChangeWith){
        return false;
    }
    return true;
}

const higherAuthority = (currentUserRole,targetUserRole)=>{
    if(!checkIfValidRole(currentUserRole) || !checkIfValidRole(targetUserRole)){
        return false;
    }
    if(roles[currentUserRole]>=roles[targetUserRole]){
        return false;
    }
    return true;
}

module.exports = {
    checkIfValidRole,
    checkIfCurrentUserCanModify,
    checkAdminOrOwner,
    higherAuthority
};