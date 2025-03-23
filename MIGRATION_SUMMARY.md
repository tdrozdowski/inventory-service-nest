# Database Migration Summary

## Overview

This document summarizes the migrations created to match the database schema found in the `lab1.local` PostgreSQL database.

## Tables Discovered

The following tables were found in the database:

1. `_sqlx_migrations` - A system table for tracking migrations (ignored)
2. `items` - Contains inventory items
3. `persons` - Contains person/customer records
4. `invoices` - Contains invoice records
5. `invoices_items` - Junction table linking invoices to items (many-to-many relationship)

## Migration Files Created

### 1. 20240322000000_create_persons_table.js

Creates the `persons` table with the following structure:

- `id`: Auto-incrementing primary key
- `alt_id`: UUID with default gen_random_uuid()
- `name`: Text, not null
- `email`: Text, not null, unique
- `created_by`: Text, not null
- `created_at`: Timestamp with timezone, not null, default now()
- `last_update`: Timestamp with timezone, not null, default now()
- `last_changed_by`: Text, not null, default 'system'

### 2. 20240322000001_create_invoices_table.js

Creates the `invoices` table with the following structure:

- `id`: Auto-incrementing primary key
- `alt_id`: UUID with default gen_random_uuid()
- `total`: Decimal, not null
- `paid`: Boolean, not null, default false
- `created_by`: Text, not null
- `created_at`: Timestamp with timezone, not null, default now()
- `last_update`: Timestamp with timezone, not null, default now()
- `last_changed_by`: Text, not null, default 'system'
- `user_id`: UUID, not null, foreign key to persons(alt_id)

### 3. 20240322000002_create_invoices_items_table.js

Creates the `invoices_items` junction table with the following structure:

- `invoice_id`: UUID, not null, foreign key to invoices(alt_id)
- `item_id`: UUID, not null, foreign key to items(alt_id)
- Composite primary key on (invoice_id, item_id)

### 4. 20240322000003_update_items_table.js

Updates the `items` table to match the actual schema:

- Drops the existing table and recreates it with:
  - `id`: Auto-incrementing primary key
  - `alt_id`: UUID with default gen_random_uuid()
  - `name`: String(255), not null
  - `description`: Text, not null
  - `unit_price`: Decimal, not null
  - `created_by`: Text, not null
  - `created_at`: Timestamp with timezone, not null, default now()
  - `last_update`: Timestamp with timezone, not null, default now()
  - `last_changed_by`: Text, not null, default 'system'

## Testing the Migrations

To test these migrations:

1. Create a test database:

   ```bash
   createdb inventory_test
   ```

2. Run the migrations:

   ```bash
   DATABASE_NAME=inventory_test npm run migrate:latest
   ```

3. Verify the schema matches the original database:
   ```bash
   # Compare schemas
   pg_dump -s inventory_test > test_schema.sql
   pg_dump -h lab1.local -s inventory > original_schema.sql
   diff test_schema.sql original_schema.sql
   ```

## Notes

- The original `items` table in the database has a different structure than the one in the existing migration file. The new migration drops and recreates the table with the correct structure.
- The `_sqlx_migrations` table was ignored as it's a system table used for tracking migrations in another system.
- All tables include audit columns (`created_by`, `created_at`, `last_update`, `last_changed_by`).
- UUID columns (`alt_id`) are used as alternative IDs in all tables, likely for external references.
