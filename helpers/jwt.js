const jwt = require('jsonwebtoken');

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

module.exports = {
    generateJWT
}