<?php
	include "../../source/libs/PostgreSQLConnect.php";
	$dbh = GetConnection();

	// Argumentos
	$formato = (isset($_POST["Formato"])) ? $_POST["Formato"] : "";
	$variable = (isset($_POST["Variable"])) ? $_POST["Variable"] : "";
	$instalaciones = (isset($_POST["Instalaciones"])) ? $_POST["Instalaciones"] : "''";
	$fechaInicial = (isset($_POST["FechaInicial"])) ? $_POST["FechaInicial"] : "";
	$fechaFinal = (isset($_POST["FechaFinal"])) ? $_POST["FechaFinal"] : "";

	// Consulta
	$query = "SELECT clave_inst Instalacion, TO_CHAR(datetime, '$formato') Unidad, Valor
			FROM base_ana
			WHERE clave_inst IN ($instalaciones)
			AND datetime BETWEEN TO_TIMESTAMP('$fechaInicial','DD/MM/YYYY HH24:MI') AND TO_TIMESTAMP('$fechaFinal','DD/MM/YYYY HH24:MI')
			AND UPPER(REPLACE(punto,'ó','o')) LIKE UPPER('%$variable%')
			ORDER BY 1, 2";
	$result = pg_query($query) or die('La consulta fallo: ' . pg_last_error());

	// Imprimiendo los resultados en JSON
	$arr = array();
	while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
		$obj = array(
			"Instalacion"=>$line["instalacion"],
			"Unidad"=>$line["unidad"],
			"Valor"=>$line["valor"]
		);
		array_push($arr, $obj);
	}

	// Liberando el conjunto de resultados
	pg_free_result($result);

	// Cerrando la conexión
	pg_close($dbh);

	// Imprimir Json
	echo json_encode($arr);
?>