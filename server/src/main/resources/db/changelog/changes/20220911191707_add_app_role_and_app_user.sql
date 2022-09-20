--liquibase formatted sql
--changeset jsclarridge:1662949027777

DO
$do$
BEGIN
  CREATE ROLE app_role;
  EXCEPTION WHEN DUPLICATE_OBJECT THEN
  RAISE NOTICE 'app_role already exists';
END
$do$;

GRANT USAGE ON SCHEMA public TO app_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_role;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO app_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SEQUENCES TO app_role;

DO
$do$
BEGIN
  CREATE USER app_user;
  EXCEPTION WHEN DUPLICATE_OBJECT THEN
  RAISE NOTICE 'app_user already exists';
END
$do$;

GRANT app_role TO app_user;
GRANT rds_iam TO app_user;