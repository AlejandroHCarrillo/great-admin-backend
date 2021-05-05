const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next ) => {
    // x-token headers
    const token = req.header('x-token');
    // console.log("token: ", token );
    if( !token ){
        return res.status(401).json({
                ok: false,
                msg: 'No hay Token en la peticion '
            });
    }

    try {

        const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);        
        console.log("payload:", payload);

        // Agregamos el uid, el nombre y el rol y el token al los req para tenerlos disponibles en futurs req
        req.uid = payload.uid;
        req.name = payload.name;
        req.role = payload.role;
    }
    catch(error){
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido ',
            error
        });
    }


    next();
}

module.exports = {
    validarJWT
}