// import { execSync } from 'child_process'

// const env = process.env.NODE_ENV || 'local'

// if (env === 'development') {
//   console.log('[postinstall] Running migrate:dev...')
//   execSync('npm run migrate:dev', { stdio: 'inherit' })
// } else {
//   console.log(`[postinstall] Skipping migrate:dev (env: ${env})`)
// }
import { execSync } from 'child_process'

const env = process.env.NODE_ENV || 'local'

try {
  if (env === 'development') {
    console.log('[postinstall] Running migrate:dev...')
    execSync('npm run migrate:dev', { stdio: 'inherit' })
  } else if (env === 'production') {
    console.log('[postinstall] Running migrate:prod...')
    execSync('npm run migrate:prod', { stdio: 'inherit' })
  } else {
    console.log(`[postinstall] Skipping migration for env: ${env}`)
  }
} catch (err) {
  console.error('[postinstall] Error during migration:', err.message)
  process.exit(1)
}
