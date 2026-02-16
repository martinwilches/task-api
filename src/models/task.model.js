import mongoose from 'mongoose'

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
        enum: ['low', 'medium', 'high']
    },
    dueDate: {
        type: Date
    }
}, {
    timestamp: true // agregar los campos createdAt y updatedAt automáticamente
})

export default Task = mongoose.model('Task', taskSchema)