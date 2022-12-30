--liquibase formatted sql
--changeset jsclarridge:1672190728729

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO db_migration_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO db_migration_role;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO db_migration_role;

-- Modify future tables, sequences and functions.
-- Do not include `FOR ROLE` in the following statements so that:
-- 1. when this runs in RDS, it will apply to the role running migrations.
-- 2. when this runs in Docker, it will apply to the `postgres` role.
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO db_migration_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO db_migration_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON FUNCTIONS TO db_migration_role;
