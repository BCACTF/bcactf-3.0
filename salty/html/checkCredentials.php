<?php

function checkCredentials($username, $password, $sid){
	global $fp;

	if (DEBUG) fprintf($fp, "checkCredentials(u:%s, p:%s, sid:%s)\n", $username, $password, $sid);

	if (DEBUG) fprintf("About to access database with h:%s, u:%s, p:%s\n", DB_HOST, DB_USER, DB_PASS);

	if (!($db = new mysqli(DB_HOST, DB_USER, DB_PASS))){
		if (DEBUG) fprintf($fp, "Home: Unable to connect to db\n");
		die ("Home: Unable to connect to db.");
	}
	if (DEBUG) fprintf($fp, "Home: Connected to db\n");

	$safe_username = mysqli_real_escape_string($db, $username);
	if (DEBUG) fprintf($fp, "Safe username: %s\n", $safe_username);

	$query = "SELECT id, username, hash, salt FROM salty.users where username='".$safe_username."' and (session_id = '".$sid."' or session_id = 'default');";

	if (DEBUG) fprintf($fp, "Check credential query:\n%s\n", $query);

	$result = $db->query($query);

	if (!$result){
		die("Home: Check credential query fails");
	}

	$row = $result->fetch_assoc();
	if (DEBUG) fprintf($fp, "row:%s\n", json_encode($row));

	$user_id = null;

	if (md5($password.$row['salt']) == $row['hash']){
		$user_id = $row['id'];
	}
	
	if (DEBUG) fprintf($fp, "checkCredentials about to return %s\n", $user_id);
	return $user_id;
}