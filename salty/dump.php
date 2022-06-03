<?php
require("../db.php");
	while(($sid = session_id()) == null){
        session_start();
        }

        $db = new SQLite3(salty.db);

        $res = $db->query("SELECT user_id,hash,salt FROM users where (session_id='{$sid}'or session_id='default')");
        //$res = $db->query("SELECT user_id,hash,salt FROM users ");
?>

<html>
	<body>
		<h1>database dump :)</h1>
		<table border=1 cellspacing=0 cellpadding=2>
			<tr>
				<td>username</td><td>password</td><td>salt</td></tr>

<?php
        while ($row = $res->fetchArray()) {
           echo "<tr><td>{$row['user_id']}</td><td>{$row['hash']}</td><td>{$row['salt']}</td></tr>";
        }
?>   
</table>	

<div>
<a href="/index.html">Home</a><br/>
<a href="/create.php">Create user</a><br/>
<a href="/dump.php">debug</a><br/>
</div>
