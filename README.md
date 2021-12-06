# IAJMAS
Pasos Ejecutar bd:

Abrir doc: https://docs.google.com/document/d/1HIGv1uSTOjtVHO64fZS1QcBM6S4GjH41/edit



Pasos ejecucion de programa:

1. Instalar el programa xampp
2. Ejecutar el control panel de xampp y arrancar el servidor tomcat
3. Configuracion proyecto:
	a. Ajustar la conexion de la bd de tu maquina en el archivo en la ruta 'C:\xampp\htdocs\source\libs\PostgreSQLConnect.php'
	b. Activar las extensiones de postgres en el archivo 'C:\xampp\php\php.ini'
		;extension=pdo_pgsql
		;extension=pgsql
	c. copiar la carpeta 'ia' dentro de 'C:\xampp\htdocs\', esto contiene el codigo de la pagina
	d. copiar la carpeta 'source' dentro de 'C:\xampp\htdocs\', esto contiene las librerias de js y hojas css necesarias para la ejecucion.
4. Abrir el proyecto en la ruta 'http://localhost/ia'
