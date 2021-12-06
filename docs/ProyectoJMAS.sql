SELECT * FROM auth_group; -- 
SELECT * FROM auth_group_permissions; -- 
SELECT * FROM auth_permission;
SELECT * FROM auth_user;
SELECT * FROM auth_user_groups; -- 
SELECT * FROM auth_user_user_permissions; -- 
SELECT * FROM base_ala;
SELECT * FROM base_ana;
SELECT * FROM base_anomalylabeled;
SELECT * FROM base_anomalylabeled_time_stamps;
SELECT * FROM base_cal;
SELECT * FROM base_com;
SELECT * FROM base_con;
SELECT * FROM base_dig;
SELECT * FROM base_eve;				-- Eventos
SELECT * FROM base_instalation;		-- Elementos instalados (Pozo, Tanque, Rebombeo, Valvula, Otros)
SELECT * FROM base_timestamp;		-- Dimension hora

SELECT * FROM django_admin_log;
SELECT * FROM django_content_type;
SELECT * FROM django_migrations;
SELECT * FROM django_session;


5 pozos y graficar cómo luce
TODO: Ver que se guarda en cada una de las siguientes tablas:
SELECT * FROM base_ala;
SELECT * FROM base_ana;
SELECT * FROM base_cal;	calibracion?
SELECT * FROM base_com;	comportamiento?
SELECT * FROM base_con;	condicion?
SELECT * FROM base_dig;
SELECT * FROM base_eve;	eventos?

select 
	CONCAT(
		column_name, ' | ',
		CASE
			WHEN character_maximum_length IS NULL THEN data_type
			ELSE CONCAT(data_type, ' (', character_maximum_length, ')')
		END, ' | ',
		CASE
			WHEN is_nullable = 'NO' THEN 'Not Null'
			ELSE 'Nullable'
		END
	)
from INFORMATION_SCHEMA.COLUMNS where table_name = '';


Proyectos
	JmasChihuahua
	GobChih
	JmasJrz
	GobYucatan
	
App Movil

Cajero

Web

Administrativas
	Pedro


Tesis: Proyecto 6 meses
	
Examen:
Experiencia:








SELECT * FROM ;				-- Eventos
SELECT * FROM ;		-- Elementos instalados (Pozo, Tanque, Rebombeo, Valvula, Otros)
SELECT * FROM ;		-- Dimension hora





SELECT *
FROM base_dig BD
WHERE clave_inst = 'RebLeon1'
AND Punto = 'Motor 2'
AND datetime >= '2019-01-01'
ORDER BY datetime
;

SELECT *
FROM base_ala
WHERE clave_inst = 'RebLeon1'
AND Punto = 'Motor 2'
AND datetime >= '2019-01-01'
ORDER BY datetime
;

SELECT *
FROM base_con
WHERE clave_inst = 'RebLeon1'
AND Punto = 'Motor 2'
AND datetime >= '2019-01-01'
ORDER BY datetime
;






2019-01-01 00:44:20.000 -0600	RebLeon1
2019-01-01 01:38:11.000 -0600	RebLeon1




SELECT *
FROM base_instalation
WHERE key = 'RebLeon1'
;


SELECT DISTINCT Condicion FROM base_ana;


SELECT *
FROM base_instalation
WHERE type = '1'
;

-- Anomalias reportas en pozos
SELECT *
FROM base_anomalylabeled BA
INNER JOIN base_instalation BI ON (BI.id = BA.clave_inst_id)
WHERE BI."type" = '1'
;

-- Anomalias reportas en tanques
SELECT *
FROM base_anomalylabeled BA
INNER JOIN base_instalation BI ON (BI.id = BA.clave_inst_id)
WHERE BI."type" = '2'
;



-- 12	Urueta	Pozo Urueta



select column_name, data_type, character_maximum_length, column_default, is_nullable
from INFORMATION_SCHEMA.COLUMNS where table_name = 'base_dig';


Django es un framework de desarrollo web de código abierto, escrito en Python, que respeta el patrón de diseño conocido como modelo–vista–controlador

/*
Pozos
	Presion
	Gasto
	Falla de fase
Tanques
	Gasto Salida
	Gasto Entrada
	Nivel
Rebombeo
	Gasto Salida
	Gasto Entrada
	Oresion Succion
	Presion Descarga
Valvula
	Presion Descarga
	Presion Salida



*/


--  Cantidades de cada instalacion
SELECT
	CASE
		WHEN "type" = '1' THEN 'Pozo'
		WHEN "type" = '2' THEN 'Tanque'
		WHEN "type" = '3' THEN 'Rebombeo'
		WHEN "type" = '4' THEN 'Valvula'
		ELSE 'Otro'
	END Instalacion, COUNT(*)
FROM base_instalation
GROUP BY 
	CASE
		WHEN "type" = '1' THEN 'Pozo'
		WHEN "type" = '2' THEN 'Tanque'
		WHEN "type" = '3' THEN 'Rebombeo'
		WHEN "type" = '4' THEN 'Valvula'
		ELSE 'Otro'
	END
;

Grafica comportamiento pozos por año
Comportamiento de pozos por falla
5 pozos y graficar cómo luce





SELECT *
FROM base_ala
WHERE clave_inst = 'RebAtlatec'
AND datetime BETWEEN '2019-01-01' AND '2020-01-01'
AND punto = 'MOTOR 1'
ORDER BY datetime DESC
;

SELECT *
FROM base_ana
WHERE clave_inst = 'Cerro Cruz'
AND datetime BETWEEN '2018-01-01' AND '2019-01-01'
-- AND UPPER(punto) LIKE '%GASTO%'
;


SELECT TO_CHAR(datetime, 'YYYY-MM'), AVG(Valor)
FROM base_ana
WHERE clave_inst = 'PuertaChi1'
AND datetime BETWEEN '2018-01-01' AND '2019-01-01'
AND UPPER(punto) LIKE '%GASTO%'
GROUP BY TO_CHAR(datetime, 'YYYY-MM')
;
Cerro Cruz
PzJardines
Urueta
Villa
PuertaChi1



SELECT TO_CHAR(datetime, 'YYYY-MM'), COUNT(*)
FROM base_con
WHERE clave_inst = 'Aeropuert1'
AND punto = 'Motor'
AND resultado = 'ERR'
AND accion = 'ARRANQUE'
AND datetime BETWEEN '2018-01-01' AND '2019-01-01'
GROUP BY TO_CHAR(datetime, 'YYYY-MM')
ORDER BY 1
;

PzParcela
PuertaChi1
PzJardines
PzRiberas7
Aeropuert1


N.Dios 3


PzCaliforn
PzJardines
Pz.VDor2
Pchichonte

SELECT * FROM base_instalation WHERE "type" = '1';

SELECT * FROM base_ala;
SELECT * FROM base_ana;
SELECT * FROM base_cal;	-- calibracion?
SELECT * FROM base_com;	-- comportamiento?
SELECT * FROM base_con;	-- condicion?
SELECT * FROM base_dig;
SELECT * FROM base_eve;	-- eventos?
SELECT * FROM base_anomalylabeled;
SELECT * FROM base_anomalylabeled_time_stamps;
SELECT * FROM base_instalation;		-- Elementos instalados (Pozo, Tanque, Rebombeo, Valvula, Otros)



SELECT DISTINCT Punto FROM base_ala ORDER BY 1;


SELECT
	TO_CHAR(NOW(), 'YYYY'),
	TO_CHAR(NOW(), 'YYYY-MM'),
	TO_CHAR(NOW(), 'YYYY-MM-DD'),
	TO_CHAR(NOW(), 'WW'),
	TO_CHAR(NOW(), 'YYYY-MM-DD HH24'),
	TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI')
FROM base_ana
LIMIT 1
;

/*
Minuto		YYYY-MM-DD HH24:MI
Hora		YYYY-MM-DD HH24
Dia			YYYY-MM-DD
Semana		WW
Mes			YYYY-MM
Año			YYYY
*/


/*
FechaFinal: "01/31/2018"
FechaInicial: "01/01/2018"
Format: "YYYY-MM-DD"
Instalaciones: "'Aeropuert2','Aldama 4','Aldama 5'"
Unidad: "Día"
Variable: "Nivel"

TO_DATE('20170103','MM/DD/YYYY');
*/


SELECT clave_inst, TO_CHAR(datetime, 'YYYY-MM-DD') Unidad, Valor
FROM base_ana
WHERE clave_inst IN ('Aeropuert2','Aldama 4')
AND datetime BETWEEN TO_DATE('01/01/2018','MM/DD/YYYY H24:MI') AND TO_DATE('01/31/2019','MM/DD/YYYY')
AND UPPER(REPLACE(punto,'ó','o')) LIKE UPPER('%Presion%')
GROUP BY TO_DATE('01/01/2018','MM/DD/YYYY')
ORDER BY 1, 2
;


-- 357880080762713

EstTerraza
Pana 5
Pz.Riberas

N.Dios 1

SacViejo2


CentroConv
PuertaChi1

SELECT *
FROM base_ana
WHERE clave_inst = 'PuertaChi2'
AND UPPER(punto) LIKE '%PRES%'
;

TO_DATE('01/01/2018','MM/DD/YYYY H24:MI')

SELECT * FROM base_instalation WHERE "type" ='';

SELECT TO_CHAR(TO_TIMESTAMP('31/12/2018 23:59','DD/MM/YYYY HH24:MI'), 'DD/MM/YYYY HH24:MI'), TO_TIMESTAMP('31/12/2018 23:59','DD/MM/YYYY HH24:MI');