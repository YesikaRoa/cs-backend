import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import path from 'path'

const swaggerDocument = YAML.load(path.resolve('src/docs/swagger.yaml'))

export function setupSwagger(app) {
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      swaggerOptions: {
        url: 'http://localhost:3002/api/docs/swagger.yaml',
      },
    })
  )
}
