const jwt = require('jsonwebtoken');
global.atob = require("atob");

const generateJWT = (uid, name, role = "USER_ROLE") => {
    console.log("generateJWT...", "Uid: ", uid, "Name: ", name, "Rol: ", role, );

    return new Promise ((resolve, reject)=>{
        const payload = {uid, name, role };

        jwt.sign( payload, process.env.SECRET_JWT_SEED, 
            { expiresIn: process.env.TOKEN_EXPIRES }, 
            (err, token) => {
                if ( err ){
                    console.log(err);
                    reject('No se pudo generar el token')
                }

                resolve( token );

            });
    });

}

const parseJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    // console.log(jsonPayload);
    return JSON.parse(jsonPayload);
};

module.exports = {
    generateJWT,
    parseJwt
}