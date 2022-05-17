<?php
//define('URL', 'http://34.12.101.169');
define('URL','');
$fp = fopen("home.log", "w");


while(($sid = session_id()) == null){
        session_start();
}


//printf (" before  func def usrnamae:%s, password:%s\n", $_GET['username'], $_GET['password']);
function check_credentials($username,$password,$sid){
	global $fp;
	//printf("Enter checkCredentials(u%s, pw:%s, sid:%s)<br>\n", $username, $password, $sid);
	fprintf($fp, "Enter checkCredentials(u%s, pw:%s, sid:%s)<br>\n", $username, $password, $sid);
		//LEGACY CODE FROM HOSTED DB
		//$servername = "localhost";
       	 	//$dbuser = "saltyuser";
        	//$dbpwd = "d42828926b";
		//$conn = new mysqli($servername, $dbuser, $dbpwd);

		//if ($conn->connect_error) {
                //	die("Connection failed: " . $conn->connect_error);
		//}
		
			
		$db=new SQLite3('salty.db');

		
		//sleep 5 seconds in index.php and create.php,sanitize input (also in index and create)
		$query="SELECT hash,salt,user_id FROM users WHERE user_id='{$username}'and (session_id='{$sid}' or session_id='default');";
		//echo($query." ");
		$result=$db->query($query);
		//printf("q=%s",$query);
		if(!$result){
			die('home.php query failed');
		}
		$row=$result->fetchArray();
		//echo("printing row stuff");
		//var_dump($row);

		if(md5($password.$row['salt'])==$row['hash']){
			return($row['user_id']);
		}
		else{
			return(null);
		}

	

	} // END function cheeckCredntials 

//printf (" after func def usrnamae:%s, password:%s\n", $_GET['username'], $_GET['password']);
//exit;

	//if(isset($_GET['username'])){
		$username=$_GET['username'];
//	}
//	else {
//		$username="";
//	}

//	if(isset($_GET['password'])){
                $password=$_GET['password'];
 //       }
//	else {
//		$password="";
//	}

	//printf("home: u:%s, pw:%s<br>\n", $username, $password);
	fprintf($fp, "home: u:%s, pw:%s<br>\n", $username, $password);
	//echo("got u=$username and p=$password");

	//printf("about to chck credentials for u:%s, pw:%s, sid:%s<br>\n", $username, $password, $sid);
	fprintf($fp, "about to chck credentials for u:%s, pw:%s, sid:%s<br>\n", $username, $password, $sid);
	$user_id=check_credentials($username,$password,$sid);
	//printf("Got back from chck credentiasl with user_id=%s<br>\n", $user_id);
	fprintf($fp, "Got back from chck credentiasl with user_id=%s<br>\n", $user_id);
	
	//var_dump($uid);
	if($user_id==null){
		sleep(3);
		//printf ("I would like to redirect yo now...\n");
		header('Location: '.URL.'/index.php');
	}
	elseif($user_id=='admin'){
		echo("bcactf{1_10v3_h@5h_br0wn5_34209}");
	}
	else{
		echo("you are not admin. have some hash browns though :,)");
	}

		
?>