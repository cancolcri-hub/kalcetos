-- Permisos completos para PostgREST y service_role en el schema kalcetos.
-- El 0001 original incluía GRANTs parciales que no fueron suficientes; este los completa.

-- USAGE del schema (lo que faltaba)
grant usage on schema kalcetos to anon, authenticated, service_role;

-- service_role: acceso total (bypassa RLS además)
grant all on all tables    in schema kalcetos to service_role;
grant all on all sequences in schema kalcetos to service_role;
grant all on all functions in schema kalcetos to service_role;

-- anon / authenticated: solo SELECT a nivel SQL; RLS limita filas
grant select on all tables    in schema kalcetos to anon, authenticated;
grant select on all sequences in schema kalcetos to anon, authenticated;

-- Default privileges: para tablas/sequencias creadas en el futuro dentro de este schema
alter default privileges in schema kalcetos grant all    on tables    to service_role;
alter default privileges in schema kalcetos grant all    on sequences to service_role;
alter default privileges in schema kalcetos grant select on tables    to anon, authenticated;
alter default privileges in schema kalcetos grant select on sequences to anon, authenticated;
