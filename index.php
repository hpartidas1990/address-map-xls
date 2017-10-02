<?php
error_reporting(-1);
ini_set('display_errors', 'On');

$json_data = null;

if(isset($_REQUEST) && isset($_FILES['file'])){
    
    include_once 'Excel/reader.php';
    
    $reader = new Spreadsheet_Excel_Reader();
    $reader->setUTFEncoder('iconv');
    $reader->setOutputEncoding('UTF-8');
    $reader->read($_FILES['file']['tmp_name']);
    
    $c = 0;
    $arr_alumnos = [];
    $alumno = [];
    
    for($i = 7; $i <= $reader->sheets[0]['numRows']; $i++){
        //echo utf8_encode($reader->sheets[0]['cells'][$i][4] . " " . $reader->sheets[0]['cells'][$i][5])."<br>";
        
        $alumno["seccion"] = $reader->sheets[0]['cells'][$i][1];
        $alumno["nombre"] = utf8_encode($reader->sheets[0]['cells'][$i][4] . " " . $reader->sheets[0]['cells'][$i][5]);
        $alumno["direccion"] = utf8_encode($reader->sheets[0]['cells'][$i][7]);
        
        array_push($arr_alumnos, $alumno);
    }
    
    $json_data = json_encode($arr_alumnos);
    //echo $json_data;
    //var_dump($arr_alumnos);
    //die();
}
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>godrive.es</title>
        
        <link rel="stylesheet" type="text/css" href="css/style.css">
        
        <script type="text/javascript" src="js/jquery-3.2.1.min.js"></script>
        <script src="http://maps.google.com/maps/api/js?key=AIzaSyBKp1YJhG-nKM-FGUMcCKnR8oBri_NvWfQ" type="text/javascript"></script>
        <script type='text/javascript' src='js/gmaps.js'></script>
		<script type='text/javascript' src="js/randomColor.js"></script>
        
        <script type="text/javascript" src="js/script.js"></script>
        <script type="text/javascript" src="js/jquery-fileupload.js"></script>
        
		<script type="text/javascript">

		jQuery.noConflict();
		jQuery( document ).ready( function($) {

			Utils.initMap();
			Utils.setPinsOnMap('<?php echo $json_data; ?>');

		});

		</script>        
    </head>
	
	<body>

		<div class="master">
			
			<div id="uploader-container">
				<div class="container-slot">
					<form action="" id="form-upload" method="post" accept-charset="utf-8" enctype="multipart/form-data">
    					<input id="file" name="file" type="file">
    					<button id="uploadfile">Cargar Archivo</button>
					</form>
				</div>
				<div>
					<p>Cargue el archivo <b>.xls</b> para ubicar las direcciones en el mapa</p>			
				</div>
			</div>
		
			<div id="map-container">
				<div id="google-map" class="google-map"></div>
			</div>
			
		</div>	
	
	</body>
</html>