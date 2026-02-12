import express from 'express'
import tasksRouter from './routes/tasks.routes.js'

const app = express()

// parsear JSON
app.use(express.json())

// ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        message: '¡Bienvenido a TASK API!',
        version: '1.0.0'
    })
})

// rutas de tareas
app.use('/api/tasks', tasksRouter)

// middleware para rutas no encontradas
app.use((req, res) => {
    res.status(404).json({error: 'Ruta no encontrada'})
})

export default app