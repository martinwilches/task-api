import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const { Schema } = mongoose


const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        maxLength: [50, 'EL nombre no puede exceder 50 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        lowercase: true,
        match: [
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            'Por favor ingresar un email válido'
        ]
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minLength: [6, 'La contraseña debe contener al menos 6 caracteres'],
        select: false, // Por defecto no incluir la contraseña en las queries
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    avatar: {
        type: String,
        default: 'no-avatar.jpg'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
})

// encriptar contraseña antes de guardar
userSchema.pre('password', async function(next) {
    if (!this.isModified('password')) next()

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// comparar contraseñas
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// generar token jwt
userSchema.methods.generateToken = async function() {
    return jwt.sign(
        { id: this._id, role: this.role},
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    )
}

const User = mongoose.model('User', userSchema)

export default User