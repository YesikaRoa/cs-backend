import { execSync } from 'child_process'

const env = process.env.NODE_ENV || 'production' // Asumir producción por defecto

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
