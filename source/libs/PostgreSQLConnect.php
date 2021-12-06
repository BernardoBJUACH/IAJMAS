<?php
	function GetConnection() {
		return pg_connect("host=localhost dbname=postgres user=postgres password=root");
	}
?>