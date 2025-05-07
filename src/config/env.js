import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Simular __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Obtener entorno
const env = process.env.NODE_ENV || 'local'

// Determinar nombre del archivo .env a cargar
const envFile = env === 'local' ? '.env' : `.env.${env}`

// Ruta absoluta al archivo .env
const envPath = path.resolve(__dirname, `../../${envFile}`)

// Cargar el archivo .env
dotenv.config({ path: envPath })

console.log(`[ENV] Loaded: ${envPath}`)
