var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// ==================================================
// Verificar token
// ==================================================
exports.verificaToken = function (req, res, next) {

    // app.use('/', (req, res, next) => {    // Cualquier ruta de abajo tiene que pasar por aquí primero
        
    var token = req.query.token;
    
        jwt.verify(token, SEED, (err, decoded) => {
    
            if (err) {
                return res.status(401).json({
                    ok: false,
                    mensaje: 'Token incorrecto',
                    errors: err
                });
            }
            
            req.usuario = decoded.usuario;
            
            next();

            // res.status(200).json({
            //     ok: true,
            //     decoded: decoded
            // });
            
        });
}
