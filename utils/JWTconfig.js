import jwt from "jsonwebtoken";

const secretkey =  "jshahygyewggkdwqyg7ueddhbhjbcasygywslhudqwhucbjsba";
const expiry = "1h";

function generateToken(userid){
    const token = jwt.sign({userid}, secretkey, {expiresIn : expiry});
    return token;
}
function verifyToken(token, callback){
    jwt.verify(token, secretkey, (err, tokenData)=>{
        if(err)
            callback(err, null);
        else
            callback(null, tokenData);
    })
}

export { generateToken, verifyToken };