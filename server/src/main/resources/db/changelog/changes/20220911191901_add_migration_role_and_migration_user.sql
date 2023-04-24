--liquibase formatted sql
--changeset jsclarridge:1662949141158

DO
$do$
BEGIN
  CREATE ROLE db_migration_role;
  EXCEPTION WHEN DUPLICATE_OBJECT THEN
  RAISE NOTICE 'db_migration_role already exists';
END
$do$;

GRANT USAGE, CREATE ON SCHEMA public TO db_migration_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO db_migration_role;

DO
$do$
BEGIN
  CREATE USER db_migration_user;
  EXCEPTION WHEN DUPLICATE_OBJECT THEN
  RAISE NOTICE 'db_migration_user already exists';
END
$do$;

GRANT db_migration_role TO db_migration_user;
GRANT rds_iam TO db_migration_user;
