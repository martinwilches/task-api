import bcrypt from 'bcryptjs'

import User from '../models/user.model.js'

// helper para enviar token en cookie
const sendTokenResponse = async (user, statusCode, res) => {
    const token = await user.generateToken()

    const options = {
        expire: process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000, // tiempo de expiración de la cookie
        httpOnly: true, // previene ataques XSS
        secure: process.env.NODE_ENV === 'production', // solo para producción
        sameSite: 'strict' // previene CSRF
    }

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
}

// @desc    Registrar usuario
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        // crear usuario
        const user = await User.create({
            name,
            email,
            password
        })

        sendTokenResponse(user, 201, res)
    } catch(error) {
        if (error.code === 11000) { // duplicate key mongodb
            return res.status(400).json({
                success: false,
                error: 'Este email ya se encuentra registrado'
            })
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message)

            return res.status(400).json({
                success: false,
                error: messages
            })
        }

        res.status(500).json({
            success: false,
            error: 'Error al registrar el usuario'
        })
    }
}

// @desc    Login usuario
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // validar email y password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'El email y la contraseña son requeridos'
            })
        }

        // buscar usuario
        const user = await User.findOne({email}).select('+password') // incluir la contraseña en el resultado de la consulta

        // validar si el usuario existe
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Credenciales invalidas'
            })
        }

        // comparar contraseñas
        const isMatch = await user.comparePassword(password)

        if (!isMatch) {
            return res.status(403).json({
                success: false,
                error: 'Credenciales invalidas'
            })
        }

        sendTokenResponse(user, 200, res)
    } catch(error) {
        res.status(500).json({
            success: true,
            error: 'Error al iniciar sesión'
        })
    }
}