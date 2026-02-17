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
    try {
        const task = await Task.findById(req.params.id)

        if (!task) {
            return res.status(404).json({
                success: false,
                error: 'Tarea no encontrada'
            })
        }

        res.json({
            success: true,
            data: task
        })
    } catch(error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                error: 'Tarea no encontrada'
            })
        }

        res.status(500).json({
            success: false,
            error: 'Error al obtener la tarea'
        })
    }
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
            const messages = Object.values(error.errors).map(err => err.message)

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
router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true, // retornar el documento actualizado
                runValidators: true // ejecutar las validaciones del schema
            }
        )

        if (!task) {
            return res.status(400).json({
                success: false,
                error: 'Tarea no encontrada'
            })
        }

        res.json({
            success: true,
            data: task
        })
    } catch(error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message)

            return res.status(400).json({
                success: false,
                error: messages
            })
        } else if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                error: 'No se encontró la tarea'
            })
        }

        res.status(500).json({
            success: true,
            error: 'Error al actualizar la tarea'
        })
    }
})

// DELETE /api/tasks/:id - eliminar una tarea
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)

        if (!task) {
            return res.status(400).json({
                success: false,
                error: 'No se encontró la tarea'
            })
        }

        res.json({
            success: true,
            message: 'Tarea eliminada'
        })
    } catch(error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                error: 'No se encontró la tarea'
            })
        }

        res.status(500).json({
            success: false,
            error: 'Error al eliminar la tarea'
        })
    }
})

export default router