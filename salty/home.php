<?php
require("../db.php");
define('URL','');
define('DEBUG', 1);

while(($sid = session_id()) == null){
        session_start();
}

if (DEBUG) $fp=fopen('home.log', 'a');


function check_credentials($username,$password,$sid){
	global $fp;
	if (DEBUG) 	fprintf($fp, "Enter checkCredentials(u%s, pw:%s, sid:%s)\n", $username, $password, $sid);
			
	$db=new SQLite3(DB_FILE);
	if(!$db){
		die("Unable to connect to db in home");
	}

		
	//sleep 5 seconds in home.php and create.php,sanitize input (also in index and create)
	$stmt=$db->prepare("SELECT hash,salt,user_id FROM users WHERE user_id=:username and (session_id=:sid or session_id='default');");
	if (!$stmt){
		die("Failed to prepare statment in home");
	}
	$stmt->bindParam(':username',$username, SQLITE3_TEXT);
	$stmt->bindParam(':sid',$sid, SQLITE3_TEXT);
	$result=$stmt->execute();

	if(!$result){
		die('home.php query failed');
	}
	$row=$result->fetchArray();

	if(md5($password.$row['salt'])==$row['hash']){
		return($row['user_id']);
	}
	else{
		return(null);
	}
} // END function cheeckCredntials 

/*
 * Main Function
 */

if(isset($_REQUEST['username'])){
	$username=$_REQUEST['username'];
}
else {
	$username="";
}

if(isset($_REQUEST['password'])){
	$password=$_REQUEST['password'];
}
else {
	$password="";
}

if (DEBUG) fprintf($fp, "home: u:%s, pw:%s\n", $username, $password);

if (DEBUG) fprintf($fp, "about to chck credentials for u:%s, pw:%s, sid:%s\n", $username, $password, $sid);
$user_id=check_credentials($username,$password,$sid);
if (DEBUG) fprintf($fp, "Got back from check credentials with user_id=%s\n", $user_id);

// if user is guessing passwords, slow them down, it's not the way and this discourages brute forcing on web server
if($user_id==null){
	sleep(3);
	header('Location: /index.html');
}
elseif($user_id=='admin'){
	echo("bcactf{1_10v3_5a1ty_h@5h_br0wn5_3749}");
}
else{
	echo("You are not admin. Have some hash browns though :,)");
}

if (DEBUG && isset ($fp)) fclose($fp);
?>
<html>
<body>


<h1>Salty</h1>

<?php if(isset($_REQUEST['m'])){ printf("<h2>%s</h2>", $_REQUEST['m']);} ?>

<div>
<a href="/index.html">Home</a><br/>
<a href="/create.php">Create user</a><br/>
<a href="/dump.php">Dump DB</a><br/>
</div>

