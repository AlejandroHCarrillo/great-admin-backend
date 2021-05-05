/**
 * Este controlador regresa las respuestas a las rutas solicitadas para la autentificacion de usuarios
 */
const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario.model');
const { generateJWT } = require('../helpers/jwt')
const { cons_color } = require('../config/console-colors');

const createUser = async(req, res = response ) => {
    // console.log(req.body);

    // Obtenemos la informacion del body
    const { email, password } = req.body;

    try{
        let usuario = await Usuario.findOne({ email });

        // console.log("usuario: ", usuario);
        if( usuario ){
            return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con el correo: ' + email
                });
        }

        usuario = new Usuario(req.body);

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        // Generar el token
        const token = await generateJWT(usuario.id, usuario.nombre, usuario.role);
        
        res.status(201).json({ 
            ok: true,
            // msg: `Usuario ${ usuario.name } ha sido registrado con exito`,
            uid: usuario.id,
            name: usuario.name,
            role: usuario.role,
            token
        });

    } catch( error ){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error, por favor contacte a su admistrador'
        })
    }
};

const LoginUser = async (req, res = express.response ) => {
    console.log("Loggin in proccess...", req.body);
    
    try{
    // Obtenemos la informacion del body
        const {email, password } = req.body;    
        var regex = new RegExp(email, "i");
        // console.log(regex);
        const usuario = await Usuario.findOne({}, 'nombre username email img activo password role')
                                .or([{ email: regex }]);
        // console.log("se encontro este usuario: ", usuario );
        // console.log("usuario: ", usuario);
        if( !usuario ){
            return res.status(400).json({
                    ok: false,
                    msg: '[Error de autenticacion] El usuario no existe.'
                });
        }

        if( !usuario.activo ){
            return res.status(400).json({
                    ok: false,
                    msg: '[Error de autenticacion] El usuario no esta activo.'
                });
        }

        // revisar password encriptado
        // const isValid = bcrypt.compareSync(password, usuario.password);
        const isValid = (password === usuario.password);
        console.log("OJO: LOS PASSWORS NO ESTAN ENCRIPTADOS");
        if (!isValid){
            return res.status(400).json({
                ok: false,
                // msg: 'El password es incorrecto.'
                msg: 'Error de autenticacion.'
            });    
        }
        // Generar el token
        const token = await generateJWT(usuario.id, usuario.nombre, usuario.role);
        // console.log("Este es el token", token);
        res.json({ 
            ok: true,
            usuario: {
                nombre: usuario.nombre, 
                email: usuario.email,
                img: usuario.img,
                username: usuario.username,
                role: usuario.role
            },
            uid: usuario.id,
            msg: 'Login OK',
            token
        });
    } catch( error ){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error, por favor contacte a su admistrador'
        })
    }
};

const renewToken = async (req, res = express.response ) => {
    const { uid, name, role } = req;
    console.log("Renovando token...");
    // Generar el token
    const token = await generateJWT(uid, name, role);
    console.log("uid: ", uid, "name: ", name, "Role: ", role);

    res.json({ 
        ok: true,
        token,
        uid,
        name,
        role
        // msg: 'Renew token from controller'
    });
};

module.exports = {
    createUser,
    LoginUser,
    renewToken
};