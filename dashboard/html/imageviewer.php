<?php
$selectedImage = (isset($_POST['selectedImage'])) ? trim($_POST['selectedImage']) : "";
?>
<!DOCTYPE html>
<html dir="ltr" lang="en-US">
<head>
<meta charset="UTF-8" />
<title>Image Viewer</title>
<meta name="robots" content="noindex,nofollow" />
<script type="text/javascript">
$(function() {
    $('#selectedImage').on('change', function(event) {
        alert(this.value);
    });
});
</script>

</head>
<body>
<strong>Image Viewer</strong>
<br /><br />
<form method="post" action="<?php echo $_SERVER['REQUEST_URI']; ?>">
<select name="selectedImage" id="selectedImage" onchange="this.form.submit();">
<option value="">- Select an Image - </option>
<?php 
$files = scandir('/home/pi/videoloop/photos/'.$_GET["f"]); 
 
$c1 = count($files);
$c2 = 0;
 
for($i=0; $i<$c1; $i++)
{
  if(strlen($files[$i]) > 3)
  {
    $extension = strtolower(substr($files[$i], -4));
    if(($extension == ".gif") OR ($extension == ".jpg") OR ($extension == ".png"))
    {
      echo "<option value=\"".trim($_GET["f"]."/".$files[$i])."\"";
      if($selectedImage == $_GET["f"]."/".$files[$i]) echo " selected=\"selected\"";
      echo ">".$files[$i]."</option>\n";
      $c2++;
    }
  }
}
 
?>
</select>
<input type="submit" value="Select" />
</form>
<br />
<?php echo "total images = ".$c2; ?>
<br /><br />
<?php
if(!empty($selectedImage))
{
  ?>
  <img width=500 src="/home/pi/videoloop/photos/<?php echo $selectedImage ?>" alt="" />
  <br /><br />
  <?php
  list($width, $height) = getimagesize("/home/pi/videoloop/photos/".$_GET["f"]."/".$selectedImage);
  echo "width = ".$width."<br />";
  echo "height = ".$height."<br />";
}
?>
</body>
</html>
