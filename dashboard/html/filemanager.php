<!DOCTYPE html>
<html>
<head>
<title>Multiple File Upload using Ajax, Jquery and PHP</title>
	<link href="css/bootstrap.css" rel="stylesheet" type="text/css" media="screen">
        <link rel="stylesheet" type="text/css" href="css/DT_bootstrap.css">
</head>
	<script src="js/jquery.js" type="text/javascript"></script>
	<script src="js/bootstrap.js" type="text/javascript"></script>
	<script type="text/javascript" charset="utf-8" language="javascript" src="js/jquery.dataTables.js"></script>
	<script type="text/javascript" charset="utf-8" language="javascript" src="js/DT_bootstrap.js"></script>
	<script type="text/javascript" src="js/jquery_1.5.2.js"></script>

<style>
body {
	font-family:Verdana, Geneva, sans-serif; 
}
span{
	color:red;
	cursor:pointer;
}
</style>
<body>

<center>

<h2 style="color:blue; text-align:center;">File Manager</h2>



<table class="table table-striped table-bordered" style="width:60%;" id="add_files">
	<thead>
		<tr>
			<th style="color:blue; text-align:center;">File Name</th>
			<th style="color:blue; text-align:center;">Status</th>
			<th style="color:blue; text-align:center;">File Size</th>
			<th style="color:blue; text-align:center;">Action</th>
		<tr>
	</thead>
	<tbody>
	<?php

	$di = new RecursiveDirectoryIterator('/home/pi/videoloop/photos');
	$_filepath_ = '';
	foreach (new RecursiveIteratorIterator($di) as $filename => $file) {
	    //echo $filename . ' - ' . $file->getSize() . ' bytes <br/>';
	    $_filepath_ = 'photos/' . str_replace('/home/pi/videoloop/photos/','',$filename);
	    echo '<tr><th><img src='.$_filepath_ . ' height=25 width=25></th><th>'.$_filepath_.'</th><th>' . $file->getSize() . ' bytes </th><th>--</th>';
	}



?>

	</tbody>
</table>


</center>
	

</body>
</html>