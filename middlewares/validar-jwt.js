const { response } = require('express');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuario.model');

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

        // Agregamos el uid, el nombre y el rol y el token 
        // a los req para tenerlos disponibles en futurs req
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

const validarADMIN_ROLE = async ( req, res, next ) =>{
    const uid = req.uid;

    try {
        const usuarioDB = await usuarioModel.findById(uid);
        if(!usuarioDB){
            res.status(404).json({
                ok: false,
                msg: "El usuario no existe"
            });
        }


        if(usuarioDB.role !== 'ADMIN_ROLE' ){
            res.status(500).json({
                ok: false,
                msg: "El usuario no tiene privilegios de hacer esa operacion"
            });
        }

        next();

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: "Hubo un error, consulte con el administrador",
            error
        });

    }
}

module.exports = {
    validarJWT,
    validarADMIN_ROLE
}