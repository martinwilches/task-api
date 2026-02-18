import jwt from 'jsonwebtoken'

import User from '../models/user.model.js'

// proteger rutas - validación jwt
export const protect = async (req, res, next) => {
    let token

    // verificar si hay token en headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    // verificar si hay token en cookies
    else if (req.cookies.token) {
        token = req.cookies.token
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'No autorizado para acceder a esta ruta'
        })
    }

    try {
        // verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // agrear usuario a la request
        req.user = await User.findById(decoded.id)

        if (!req.user || !req.user.isActive) {
            return res.status(401).json({
                success: false,
                error: 'Usuario no encontrado o inactivo'
            })
        }

        next()
    } catch(error) {
        res.status(401).json({
            success: false,
            error: 'Token invalido o expirado'
        })
    }
}

// autorizar roles específicos
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `El rol ${req.user.role} no esta autorizado para acceder a esta ruta`
            })
        }

        next()
    }
}