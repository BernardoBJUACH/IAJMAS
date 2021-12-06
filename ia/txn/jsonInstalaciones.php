<?php
	include "../../source/libs/PostgreSQLConnect.php";
	$dbh = GetConnection();

	// Tipo de instalacion
	$type = (isset($_POST["Type"])) ? $_POST["Type"] : "";

	// Consulta
	$query = "SELECT * FROM base_instalation WHERE type = '{$type}' ORDER BY key";
	$result = pg_query($query) or die('La consulta fallo: ' . pg_last_error());

	// Imprimiendo los resultados en JSON
	$arr = array();
	while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
		$obj = array(
			"Id"=>$line["id"],
			"Key"=>$line["key"],
			"Name"=>$line["name"]
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