--liquibase formatted sql
--changeset jsclarridge:1662868456772

-- The rds_iam role already exists in the AWS RDS database. This migration
-- creates the role in other environments, such as localdev or CI, to bring
-- those environments into closer parity with deployed environments.
-- Unfortunately, RDS IAM authentication is only supported in the AWS
-- environments. Creating the role in other environments does not, by itself,
-- enable the RDS IAM authentication functionality.

DO
$do$
BEGIN
  CREATE ROLE rds_iam;
  EXCEPTION WHEN DUPLICATE_OBJECT THEN
  RAISE NOTICE 'rds_iam already exists';
END
$do$;
