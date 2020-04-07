
var express = require('express');

// var SEED = require('../config/config').SEED;
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();
var Medico = require('../models/medico');

// ==================================================
// Obtener todos los medicos
// ==================================================
app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, medico) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando medicos',
                    errors: err
                });
            }

            Medico.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    medico: medico,
                    total: conteo
                });
            });

        });

});


// ==================================================
// Actualizar medico
// ==================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el medico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok:false,
                mensaje: 'No existen medicos con ese ID',
                errors: err
            });
        }

        medico.nombre = body.nombre,
        medico.usuario = req.usuario._id,
        medico.hospital = body.hospital

        medico.save((err, medicoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            return res.status(400).json({
                ok:true,
                medico: medicoGuardado
            });

        });
    });

});


// ==================================================
// Crear un nuevo medico
// ==================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico ({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoCreado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No se pudo crear el medico',
                errors: err
            });
        }

        return res.status(200).json({
            ok: true,
            medico: medicoCreado
        });
        
    });
});

// ==================================================
// Borrar un medico
// ==================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndDelete(id, (err, medicoEliminado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No se ha eliminado el medico',
                errors: err
            });
        }

        if (!medicoEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Ningun medico coincide con ese ID',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            medicoEliminado: medicoEliminado
        });
       
    });
});

module.exports = app;
