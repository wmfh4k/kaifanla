<?php
/*接收客户端提交的订单信息，保存订单，生成订单号，
输出执行的结果，以JSON格式*/
header('Content-Type: application/json');
date_default_timezone_set('prc');
//接收客户端提交的数据
@$user_name = $_REQUEST['user_name'];    //接收人姓名
@$sex = $_REQUEST['sex'];    //性别
@$phone = $_REQUEST['phone'];//联系电话
@$addr = $_REQUEST['addr'];  //收货地址
$order_time = date("Y-m-d H:i");  //以毫秒为单位的当前系统时间
//客户端输入的服务器端校验——真正可靠的校验！
if( !isset($user_name) || !isset($sex) || !isset($phone) || !isset($addr)){
    $output =  [];
    $output["status"]="err";
    $output["msg"] = "Request Data Not OK!";
    echo json_encode($output);
    return;
}
//执行数据库操作
$conn = mysqli_connect('127.0.0.1','root','','kaifanla');
$sql = "SET NAMES UTF8";
mysqli_query($conn, $sql);
$sql = "INSERT INTO kf_order(oid,user_name,sex,phone,addr,order_time) VALUES(NULL,'$user_name','$sex','$phone','$addr','$order_time')";
$result = mysqli_query($conn, $sql);
$sql = " UPDATE  kf_shop  set oid =(select oid from kf_order order by oid desc limit 1),order_time=(select order_time from kf_order order by oid desc limit 1) ";
$result = mysqli_query($conn,$sql);
$sql="INSERT INTO kf_morder(did,name,img_sm,price,num,idx,oid,order_time) SELECT did,name,img_sm,price,num,idx,oid,order_time from kf_shop ";
$result = mysqli_query($conn,$sql);
$sql="DELETE FROM kf_shop ";
$result = mysqli_query($conn,$sql);
$sql="SELECT oid from kf_order order by oid desc limit 1";
$result = mysqli_query($conn,$sql);
$output = [];  //用于保存所有记录的数组
while( ($row=mysqli_fetch_assoc($result))!==NULL ){
    $output[] = $row;
}
// $output = [];
// if($result){    //SQL执行成功
//     $output['status']='succ';
//     $output['oid']=mysqli_insert_id($conn); //获取最近的一条INSERT语句所生成的自增主键
// }else{          //SQL执行失败
//     $output['status']='err';
//     $output['msg']="数据库访问失败！SQL:$sql";
// }
// //向客户端输出响应消息主体
$jsonString = json_encode($output);
echo $jsonString;
?>