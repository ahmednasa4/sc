<?php 

error_reporting(E_ALL);
ini_set("display_errors", 1);
header("Access-Control-Allow-Origin: *");
header('Content-Type: text/html; charset=utf-8');

require __DIR__ . '/connect.php';



echo json_encode($woocommerce->get('orders',$parameters = ['customer'=>13]));

?>