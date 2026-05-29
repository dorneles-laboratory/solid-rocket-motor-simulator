-- Passo 0: Remove a coluna se ela já existir
ALTER TABLE projects DROP COLUMN IF EXISTS motor_class;
DROP TABLE IF EXISTS flyway_schema_history;

-- PASSO 1: Adiciona a coluna permitindo valores nulos
ALTER TABLE projects ADD COLUMN motor_class VARCHAR(50);

-- PASSO 2: Preenche todos os projetos que já estavam no banco com o valor padrão do Enum
UPDATE projects SET motor_class = 'UNCLASSIFIED' WHERE motor_class IS NULL;

-- PASSO 3: Prende a coluna para não permitir mais valores nulos
ALTER TABLE projects ALTER COLUMN motor_class SET NOT NULL;