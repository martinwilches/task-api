import express from 'express'
const router = express.Router()

// base de datos temporal
const tasks = [
    {
        id: 1,
        title: 'Aprender Express',
        completed: false,
        createdAt: new Date
    },
    {
        id: 2,
        title: 'Crear mi primera API',
        completed: false,
        createdAt: new Date
    }
]

// GET /api/tasks - obtener todas las tareas
router.get('/', (req, res) => {
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


export default router