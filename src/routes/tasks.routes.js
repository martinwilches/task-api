import express from 'express'
const router = express.Router()

import Task from '../models/task.model.js'

// GET /api/tasks - obtener todas las tareas
router.get('/', async (req, res) => {
    try {
        const { completed, priority, sort } = req.query

        const filter = {}
        if (completed !== undefined) {
            filter.completed = completed === true
        }

        if (priority) {
            filter.priority = priority
        }

        // ordenamiento
        const sortOptions = {}
        if (sort) {
            const [ field, order] = sort.split(':')
            sortOptions[field] = order == 'desc' ? -1 : 1
        } else {
            sortOptions.createdAt = -1 // por defecto ordenar mas recientes primero
        }

        const tasks = await Task.find(filter).sort(sortOptions)

        res.json({
            success: true,
            count: tasks.length,
            data: tasks
        })
    } catch(error) {
        res.status(500).json({
            success: false,
            error: 'Error al obtener las tareas'
        })
    }
})

// GET /api/tasks/:id - obtener una tarea por id
router.get('/:id', async (req, res) => {
    const id = req.params.id

    const task = await Task.findById(id)

    if (!task) {
        return res.status(404).json({
            success: false,
            message: 'Tarea no encontrada'
        })
    }

    res.json({
        success: true,
        data: task
    })
})

// POST /api/tasks - crear una nueva tarea
router.post('/', async (req, res) => {
    try {
        const task = await Task.create(req.body)

        res.status(201).json({
            success: true,
            data: task
        })
    } catch(error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.values).map(err => err.message)

            return res.status(400).json({
                success: false,
                error: messages
            })
        }

        res.status(500).json({
            success: false,
            error: 'Error al crear la tarea'
        })
    }
})

// PUT /api/tasks/:id - actualizar una tarea
router.put('/:id', (req, res) => {
    const task = tasks.find(task => task.id === parseInt(req.params.id))

    if (!task) {
        return res.status(404).json({
            success: false,
            message: 'Tarea no encontrada'
        })
    }

    const { title, completed } = req.body

    if (title) task.title = title
    if (completed) task.completed = completed
    task.updatedAt = new Date()

    res.json({
        success: true,
        data: task
    })
})

// DELETE /api/tasks/:id - eliminar una tarea
router.delete('/:id', (req, res) => {
    const taskId = tasks.findIndex(task => task.id === parseInt(req.params.id))

    if (taskId === -1) {
        return res.status(404).json({
            success: false,
            message: 'Tarea no encontrada'
        })
    }

    tasks.splice(taskId, 1)

    res.json({
        success: true,
        message: 'Tarea eliminada correctamente'
    })
})

export default router