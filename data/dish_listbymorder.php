<?php
/*分页显示菜品，每页最多显示5条，以JSON格式*/
header('Content-Type: application/json');
$conn = mysqli_connect('127.0.0.1','root','','kaifanla','3306');
$sql = "SET NAMES UTF8";
mysqli_query($conn, $sql);
$sql = " SELECT m.did,m.name,m.img_sm,m.price,m.num,o.order_time,o.user_name FROM kf_morder m,kf_order o where m.oid=o.oid  ";
$result = mysqli_query($conn, $sql);
$output = [];  //用于保存所有记录的数组
while( ($row=mysqli_fetch_assoc($result))!==NULL ){
    $output[] = $row;
}
$jsonString = json_encode($output);
echo $jsonString;