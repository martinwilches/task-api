import express from 'express'
const router = express.Router()

import Task from '../models/task.model.js'

// GET /api/tasks - obtener todas las tareas
router.get('/', async (req, res) => {
    const tasks = await Task.find({})

    res.json({
        success: true,
        count: tasks.length,
        data: tasks
    })
})

// GET /api/tasks/:id - obtener una tarea por id
router.get('/:id', (req, res) => {
    const task = tasks.find(task => task.id === parseInt(req.params.id))

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
router.post('/', (req, res) => {
    const { title } = req.body

    if (!title) {
        return res.status(400).json({
            success: false,
            message: 'El titulo es requerido'
        })
    }

    const newTask = {
        id: tasksId++,
        title,
        completed: false,
        createdAt: new Date()
    }

    tasks.push(newTask)

    res.status(201).json({
        success: true,
        data: newTask
    })
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