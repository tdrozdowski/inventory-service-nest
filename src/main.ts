import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set up Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Inventory Service API')
    .setDescription('API documentation for the Inventory Service')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Save the OpenAPI spec to a file for reference
  const outputPath = path.resolve(process.cwd(), 'openapi-spec.json');
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));

  // Set up Swagger UI at /api endpoint
  SwaggerModule.setup('api', app, document);

  // Set up Redoc UI at /api-docs endpoint
  app.use('/api-docs', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Inventory Service API Documentation</title>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              margin: 0;
              padding: 0;
            }
          </style>
          <!-- Import Redoc from CDN -->
          <script src="https://cdn.jsdelivr.net/npm/redoc@latest/bundles/redoc.standalone.js"></script>
        </head>
        <body>
          <div id="redoc"></div>
          <script>
            Redoc.init('/api-json', {
              scrollYOffset: 50,
              hideDownloadButton: false,
              theme: {
                colors: {
                  primary: {
                    main: '#1976d2'
                  }
                }
              }
            }, document.getElementById('redoc'));
          </script>
        </body>
      </html>
    `);
  });

  await app.listen(3000);
}
bootstrap();
