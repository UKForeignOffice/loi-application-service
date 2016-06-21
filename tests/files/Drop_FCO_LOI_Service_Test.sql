select pg_terminate_backend(pid) from pg_stat_activity where datname='FCO-LOI-Service-Test';

DROP DATABASE "FCO-LOI-Service-Test";