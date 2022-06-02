<?php
require('../db.php');
define('URL','');
define('DEBUG', 0);


while(($sid = session_id()) == null){
        session_start();
}

if (DEBUG) $fp = fopen('/usr/local/salty/html/create.log', 'a');

function createUser($username, $password, $sid){
	global $fp;
	if (DEBUG) fprintf($fp, "createUser(u:%s, p:%s, s:%s)\n", $username, $password, $sid);

	$db = new SQLite3(DB_FILE);
	if(!$db){
		die("Unable to create database connection in create");
	}

	$username=$username;
	$salt=substr(md5(microtime().$sid),0,5);
	$hash=md5($password.$salt);

	if (DEBUG) fprintf($fp, "u:%s, salt:%s, hash:%s\n", $username, $salt, $hash);

	$stmt = $db->prepare("SELECT count(user_id) as 'user_count' from users where user_id=:username and session_id=:sid;");
	if (!$stmt){
		die("Prepare statement fails in create");
	}

	$stmt->bindValue(':username', $username, SQLITE3_TEXT);
	$stmt->bindValue(':sid', $sid, SQLITE3_TEXT);

	$result=$stmt->execute();

	if (!$result){
		die("Execute dupecheck db query fails in create.php");
	}

	$row=$result->fetchArray();
	if (DEBUG) fprintf($fp, "Got dupecheck row back as %s\nx=%d\n", json_encode($row), $row['user_count']);
	if($row['user_count']>0){
		if (DEBUG) fprintf($fp, "Duplicate userid in create, redirect to create with error msg\n");
		header('Location: '.URL.'/create.php?u=&p=&m=username%20already%20in%20use');
		exit();
	}
	if (DEBUG) fprintf($fp, "Did not detect a duplicate\n");

	if (DEBUG) fprintf($fp, "About to add record to db\n");
	//insert into users (session_id, user_id, hash, salt) values ('default', '{$user}', '{$hash}', '{$salt}'); 
	//$query="insert into users (session_id, user_id, hash, salt) values ('{$sid}', '{$username}', '{$hash}', '{$salt}');"; 

	/*
		$stmt = $db->prepare("INSERT into users(session_id, user_id, hash, salt) values (:sid, :username, :hash, :salt);");

		$stmt->bindParam(':sid', $sid, SQLITE3_TEXT);
		$stmt->bindParam(':username', $username, SQLITE3_TEXT);
		$stmt->bindParam(':hash', $hash, SQLITE3_TEXT);
		$stmt->bindParam(':salt', $salt, SQLITE3_TEXT);

		if (DEBUG) var_dump($stmt);

		$stmt->execute();
	 */

	$query="INSERT INTO users (session_id, user_id, hash, salt) values ('{$sid}', '{$username}', '{$hash}', '{$salt}');"; 
	if (DEBUG) fprintf($fp, "About to use traditional insert: query:%s\n", $query);
	$db->exec($query);

}

$username="";
if (isset($_REQUEST['username']))
	$username = $_REQUEST['username'];

$password="";
if (isset($_REQUEST['password']))
	$password = $_REQUEST['password'];

if (DEBUG) fprintf($fp, "Start of script: req[u]:%s, req[p]:%s\n", $username, $password);

if($username != ""){ 
	createUser($username,$password, $sid); 
	if (DEBUG) fprintf($fp, "Back from creatUser()\n");

	header('Location: '.URL.'/index.html?m=created%20your%20account,%20please%20log%20in');
	exit;
}
else {
	if (DEBUG) fprintf($fp, "In create, didn't find username and password params\n");
}
if (DEBUG && isset($fp)){
	fclose($fp);
}
		
?>
<html>
<body>
<?php
if(isset($_REQUEST['m'])){
	printf("<h3>%s</h3>",$_REQUEST['m']);
}
?>

<h1>create user :)</h1><form action="/create.php" method="GET">
        <label>username:</label><input type="text" name="username">
        <label>password:</label><input type="password" name="password">
        <input type="submit" value="create user">
</form>



<div>
<a href="/index.html">Home</a><br/>
<a href="/create.php">Create user</a><br/>
<a href="/dump.php">Dump DB</a><br/>
</div>
