import mongoose from 'mongoose'

const { Schema } = mongoose

const taskSchema = new Schema({
    title: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true,
        maxLength: [100, 'El título no puede exceder 100 caracteres.']
    },
    description: {
        type: String,
        trim: true,
        maxLength: [500, 'La descripción no puede exceder 500 caracteres.']
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    },
    dueDate: {
        type: Date
    },
    user: { // asociar la task con un user
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true // agregar los campos createdAt y updatedAt automáticamente
})

// indice para mejorar búsqueda por usuario
taskSchema.index({ user: 1, createdAt: -1 })

const Task = mongoose.model('Task', taskSchema)

export default Task