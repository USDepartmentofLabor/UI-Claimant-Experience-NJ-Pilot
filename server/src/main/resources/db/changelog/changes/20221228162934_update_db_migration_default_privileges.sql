--liquibase formatted sql
--changeset jsclarridge:1672273774400

ALTER DEFAULT PRIVILEGES FOR ROLE db_migration_user IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_role;
ALTER DEFAULT PRIVILEGES FOR ROLE db_migration_user IN SCHEMA public GRANT USAGE ON SEQUENCES TO app_role;
