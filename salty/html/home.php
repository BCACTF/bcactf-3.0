<?php
require('../db.php');
define('DEBUG', 0);

require('checkCredentials.php');

while(($sid = session_id()) == null){
        session_start();
}

if (DEBUG) $fp = fopen("home.log", 'a');
if (DEBUG) fprintf($fp, "\n\n\nStart logging\n");

$username="";
$password="";
if (isset($_REQUEST['username'])) $username = $_REQUEST['username'];
if (isset($_REQUEST['password'])) $password = $_REQUEST['password'];

$user_id = checkCredentials($username, $password, $sid);

if ($user_id == null){
	if (DEBUG) fprintf($fp, "User login fails\n");
	header("Location: /index.php?m=Invalid%20credentials");
	exit();
}
elseif ($user_id == 1){
	if (DEBUG) fprintf($fp, "User login as admin\n");
	$message = "bcactf{1_10v3_5a1ty_h@5h_br0wn5_3749}";
}
else {
	if (DEBUG) fprintf($fp, "User login as non-admin\n");
	$message = "you're not admin! have some hash browns though :,)";
}
?>

<!doctype html>
<html>
<body>
<h1>Salty</h1>
<p>Welcome!</p>

