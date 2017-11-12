<?php
header('Content-Type: application/json;charset=utf8');
@$num= $_REQUEST['num'];
@$did= $_REQUEST['did'];
$conn = mysqli_connect('127.0.0.1','root','','kaifanla','3306');
$sql = "SET NAMES UTF8";
mysqli_query($conn, $sql);
$sql = "INSERT INTO kf_shop(num,did,name,price,img_sm) SELECT $num,did,name,price,img_sm FROM kf_dish WHERE did=$did";
$result = mysqli_query($conn, $sql);
$output = [];
if($result){    //SQL执行成功
    $output['status']='succ';
    $output['oid']=mysqli_insert_id($conn); //获取最近的一条INSERT语句所生成的自增主键
}else{          //SQL执行失败
    $output['status']='err';
    $output['msg']="数据库访问失败！SQL:$sql";
}


//向客户端输出响应消息主体
$jsonString = json_encode($output);
echo $jsonString;
?>