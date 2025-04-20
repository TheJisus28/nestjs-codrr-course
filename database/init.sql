-- CREATE DATABASE IF NOT EXISTS taskrrdb
SELECT 'CREATE DATABASE taskrrdb'
WHERE NOT EXISTS (
  SELECT FROM pg_database WHERE datname = 'taskrrdb'
)
\gexec
