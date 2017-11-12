<?php
@$did= $_REQUEST['did'];
@$num= $_REQUEST['num'];
@$idx= $_REQUEST['idx'];
$conn = mysqli_connect('127.0.0.1','root','','kaifanla','3306');
$sql = "SET NAMES UTF8";
mysqli_query($conn, $sql);
$sql = "DELETE FROM kf_shop WHERE did=$did AND idx=$idx";
$result = mysqli_query($conn, $sql);
echo $result;