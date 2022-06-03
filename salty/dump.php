<?php
define('DEBUG', 0);
require("../db.php");

	while(($sid = session_id()) == null){
        session_start();
        }

	if (DEBUG) {
		if (!($fp = fopen('dump.log', 'a'))){
			die("Unable to open dump.log");
		}
	}
        //$db = new SQLite3(DB_FILE);
	if (!($db = new mysqli(DB_HOST, DB_USER, DB_PASS))){
		die("Dump: Unable to connect to database");
	}

	$query = "SELECT username, hash, salt FROM salty.users where (session_id = '".$sid."' or session_id='default');";
	if (DEBUG) fprintf($fp, "dump query:%s\n", $query);

	$result = $db->query($query);
	if (!$result){
		die("Dump: query fails");
	}
       //$res = $db->query("SELECT user_id,hash,salt FROM users ");
?>

<html>
	<body>
		<h1>database dump :)</h1>
		<table border=1 cellspacing=0 cellpadding=2>
			<tr>
				<td>username</td><td>password</td><td>salt</td></tr>

<?php
//while ($row = $result->fetchArray()) {
        while ($row = $result->fetch_assoc()) {
                echo "<tr><td>{$row['username']}</td><td>{$row['hash']}</td><td>{$row['salt']}</td></tr>";
             }
     ?>   
     </table>	
     
     <div>
     <a href="/index.php">Home</a><br/>
     <a href="/create.php">Create user</a><br/>
     <a href="/dump.php">Dump DB</a><br/>
     </div>
     
