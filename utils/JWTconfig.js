import "jsonwebtoken";

const secretkey =  "jshahygyewggkdwqyg7ueddhbhjbcasygywslhudqwhucbjsba";
const expiry = "1h";

function generateToken(userid){
    const token = jsonwebtoken.sign({userid}, secretkey, {expiresIn : expiry});
    return token;
}
function verifyToken(token){
    jsonwebtoken.verify(token, secretkey,(err,tokenData)=>{
        if(err)
            callback(err, null);
        else
            callback(null, tokenData);
    })
}

module.exports = {
    generateToken,
    verifyToken
}