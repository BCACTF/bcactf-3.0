<?php

	while(($sid = session_id()) == null){
        session_start();
}
	//phpinfo();
	echo("log in");

	
?>

<html>
<body>

<?php if(isset($_REQUEST['m'])){ printf("<h2>%s</h2>", $_REQUEST['m']);} ?>

<form action="/home.php" method="GET">
	<label>username:</label><input type="text" name="username">
	<label>password:</label><input type="password" name="password">
	<input type="submit" value="log in">
</form>

<br/>
<a href="/create.php">sign up</a><br>
<a href="/dump.php">debug :)</a>