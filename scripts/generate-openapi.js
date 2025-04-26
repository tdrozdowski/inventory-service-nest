const { NestFactory } = require('@nestjs/core');
const { DocumentBuilder, SwaggerModule } = require('@nestjs/swagger');
const fs = require('fs');
const path = require('path');

async function generateOpenApi() {
  // Import the AppModule dynamically to avoid TypeScript issues in a JS file
  const { AppModule } = require('../dist/app.module');

  const app = await NestFactory.create(AppModule);

  // Set up Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Inventory Service API')
    .setDescription('API documentation for the Inventory Service')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Save the OpenAPI spec to a file
  const outputPath = path.resolve(process.cwd(), 'openapi-spec.json');
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));

  console.log(`OpenAPI specification has been generated at ${outputPath}`);

  await app.close();
}

generateOpenApi().catch(err => {
  console.error('Error generating OpenAPI spec:', err);
  process.exit(1);
});
