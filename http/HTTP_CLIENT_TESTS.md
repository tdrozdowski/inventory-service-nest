# JetBrains HTTP Client Tests

This directory contains HTTP Client test files for testing the API endpoints of the Inventory Service application. These files can be used with JetBrains IDEs (IntelliJ IDEA, WebStorm, etc.) that support the HTTP Client plugin.

## Files

- `api-tests.http`: Basic tests for all API endpoints
- `advanced-api-tests.http`: Advanced tests with chained requests and complete workflow scenarios

## How to Use

1. Open the `.http` files in your JetBrains IDE
2. Make sure the application is running (default: http://localhost:3000)
3. Click the "Run" button next to each request to execute it
4. View the response in the "Response" panel

## Environment Variables

The tests use environment variables to configure the base URL:

```
@baseUrl = http://localhost:3000
```

In the advanced tests, you can switch between development and production environments:

```
@development = http://localhost:3000
@production = https://inventory-service.example.com

# Select the environment to use
@baseUrl = {{development}}
```

To switch to production, change the last line to:

```
@baseUrl = {{production}}
```

## Chained Requests

The advanced tests include chained requests that use the response from previous requests. For example:

```
# @name createItem
POST {{baseUrl}}/items
Content-Type: application/json

{
  "name": "Test Item",
  "description": "This is a test item",
  "unit_price": 19.99
}

### Get the created item by ID
GET {{baseUrl}}/items/{{createItem.response.body.id}}
```

The second request uses the ID from the response of the first request.

## Complete Workflow Scenario

The advanced tests include a complete workflow scenario that demonstrates a real-world use case:

1. Create a person
2. Create multiple items
3. Create an invoice
4. Add items to the invoice
5. Get all items for the invoice
6. Mark the invoice as paid
7. Verify the invoice is marked as paid

## API Endpoints

### Items

- `GET /items`: Get all items
- `GET /items/:id`: Get an item by ID
- `GET /items/alt/:altId`: Get an item by alternative ID
- `POST /items`: Create a new item
- `PUT /items/:id`: Update an item
- `DELETE /items/:id`: Delete an item

### Persons

- `GET /persons`: Get all persons
- `GET /persons/:id`: Get a person by ID
- `GET /persons/alt/:altId`: Get a person by alternative ID
- `GET /persons/email/:email`: Get a person by email
- `POST /persons`: Create a new person
- `PUT /persons/:id`: Update a person
- `DELETE /persons/:id`: Delete a person

### Invoices

- `GET /invoices`: Get all invoices
- `GET /invoices/:id`: Get an invoice by ID
- `GET /invoices/alt/:altId`: Get an invoice by alternative ID
- `GET /invoices/user/:userId`: Get invoices by user ID
- `POST /invoices`: Create a new invoice
- `PUT /invoices/:id`: Update an invoice
- `DELETE /invoices/:id`: Delete an invoice

### Invoices-Items

- `GET /invoices-items`: Get all invoice items
- `GET /invoices-items/invoice/:invoiceId`: Get invoice items by invoice ID
- `GET /invoices-items/item/:itemId`: Get invoice items by item ID
- `GET /invoices-items/:invoiceId/:itemId`: Get a specific invoice item
- `POST /invoices-items`: Create a new invoice item
- `DELETE /invoices-items/:invoiceId/:itemId`: Delete a specific invoice item
- `DELETE /invoices-items/invoice/:invoiceId`: Delete all invoice items for an invoice
- `DELETE /invoices-items/item/:itemId`: Delete all invoice items for an item
