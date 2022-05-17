<?php
//define('URL', 'http://34.132.101.169');
define('URL','');

function createUser($username,$password){
	
	while(($sid = session_id()) == null){
        session_start();
	}

	global $fp;
	fprintf($fp, "in fn createUser with u:%s, p:%s\n", $username, $password);
		//LEGACY CODE FROM HOSTED DB 
		//$servername = "localhost";
       	 	//$dbuser = "saltyuser";
		//$dbpwd = "d42828926b";

		//$conn= new mysqli($servername, $dbuser, $dbpwd);

		//if ($conn->connect_error) {
                //	die("Connection failed: " . $conn->connect_error);
		//}
	
		$db = new SQLite3('salty.db');

		//TODO:sleep 5 seconds in index.php and create.php,sanitize input (also in index and create)
		//TODO:check fro duplicates
		$username=addslashes($username);
		$salt=substr(md5(microtime().$sid),0,5);
		$hash=md5($password.$salt);

	/*if(($conn->query("select count(id) as x from salty.users where username='".$username."';")[0]['x']!=0)){
			header('Location: '.URL.'/create.php?m=username%20is%20already%20in%20use');
			die("username is in use");
		}*/
		$query = "SELECT count(user_id) as 'user_count' from users where user_id='{$username}' and session_id='{$sid}';";
		fprintf($fp, "duplicate check query:%s\n", $query);
		$result=$db->query($query);
		//var_dump($result);
		if($result){
			$row=$result->fetchArray();
			fprintf($fp, "Got row back as %s\nx=%d\n", json_encode($row), $row['user_count']);
			if($row['user_count']>0){
				//fprintf($fp,"before redirecting to create\n");
				//header('Location: /create.php?m=username%20is%20already%20in%20use');
				header('Location: '.URL.'/create.php?u=&p=&m=username%20already%20in%20use');
				exit();
				//fprintf($fp,"after redirecting to create\n");
			}
			fprintf($fp, "Did not detect a duplicate\n");
		}
		else die("duplicate checking query failed");

		fprintf($fp, "About to add record to db\n");
		$query="insert into users (session_id, user_id, hash, salt) values ('{$sid}', '{$username}', '{$hash}', '{$salt}');"; fprintf($fp, "query: %s\n" ,$query);
		$result=$db->exec($query);
}

$fp = fopen("create.txt", "w");
if (!$fp){ die("Failed to open filepointer");}

if (isset($_REQUEST['username']))
	$username = $_REQUEST['username'];

if (isset($_REQUEST['password']))
	$password = $_REQUEST['password'];

//$username="poopiehead";
//$password="abc123";

fprintf($fp, "req[u]:%s, req[p]:%s\n", $username, $password);

if($username != ""){ 
	$uid= createUser($username,$password); 
	fprintf($fp, "in create, back from createUser, uid=%d\n", $uid);

	header('Location: '.URL.'/index.php?m=created%20your%20account,%20please%20log%20in');
}
fprintf($fp, "in create, didn't find username and password params\n");
fclose($fp);


	
		
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

