<?php
	function GetConnection() {
		$conn = oci_connect('HR', 'hr', 'localhost/xepdb1');
		// $stid = oci_parse($conn, "ALTER SESSION SET CURRENT_SCHEMA=HR");
		// oci_execute($stid);
		return $conn;
	}
?>