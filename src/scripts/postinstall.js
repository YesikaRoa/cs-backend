import { execSync } from 'child_process'

const env = process.env.NODE_ENV || 'local'

if (env === 'development') {
  console.log('[postinstall] Running migrate:dev...')
  execSync('npm run migrate:dev', { stdio: 'inherit' })
} else {
  console.log(`[postinstall] Skipping migrate:dev (env: ${env})`)
}
