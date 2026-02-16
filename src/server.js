import dotenv from 'dotenv'

import app from './app.js'
import connectDB from './config/database.js'

const PORT = process.env.PORT || 3000

dotenv.config()

// conectar la base de datos
connectDB()

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto http://localhost:${PORT}`)
})