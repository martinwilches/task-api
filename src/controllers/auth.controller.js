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
// @route   /api/auth/register
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