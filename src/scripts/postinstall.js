import dotenv from 'dotenv'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

// Simular __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Obtener entorno
const currentEnv = process.env.NODE_ENV || 'local'

// Determinar nombre del archivo .env a cargar
const envFile = currentEnv === 'local' ? '.env' : `.env.${currentEnv}`

// Ruta absoluta al archivo .env
const envPath = path.resolve(__dirname, `../../${envFile}`)

// Cargar las variables de entorno
dotenv.config({ path: envPath })

// Confirmar entorno cargado
const env = process.env.NODE_ENV || 'production'
console.log('[postinstall] Environment:', env)
console.log('[postinstall] Loaded env file:', envPath)

try {
  if (env === 'local') {
    console.log('[postinstall] Skipping migration: local environment')
  } else if (env === 'development') {
    console.log('[postinstall] Running migrate:dev...')
    execSync('npm run migrate:dev', { stdio: 'inherit' })
  } else {
    console.log('[postinstall] Running migrate:prod...')
    execSync('npm run migrate:prod', { stdio: 'inherit' })
  }
} catch (err) {
  console.error('[postinstall] Error during migration:', err.message)
  process.exit(1)
}
