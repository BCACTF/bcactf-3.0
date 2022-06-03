<?php
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD', 'bca4');
define('CTF_FLAG', 'bcactf{1_10v3_5a1ty_h@5h_br0wn5_3749}');
define('BRUTE_FORCE_DELAY_SEC', 3);
define('SESSION_KEY', 'saltyData');

$isLoggedIn = false;
$message = "";

// this must come before ANY html or output
session_start();

// Capture session data if it is there, else seed it, every session gets a different admin seed
if (isset($_SESSION['saltyData'])){
	$data = json_decode($_SESSION[SESSION_KEY], true);
}
else {
	$adminSalt = 'NaCl-'.substr(md5(microtime()),-5);;
	$data = [	'admin' => [	'salt' => $adminSalt,
					'hash' => md5(ADMIN_PASSWORD.$adminSalt),
			],
	];
}

// process create-user request, if present
if (isset($_REQUEST['action']) && $_REQUEST['action'] == 'create'){
	if (isset($_REQUEST['new_password'])) {
		$password = trim($_REQUEST['new_password']);
	}

	if (isset($_REQUEST['new_username'])) {
		$username = trim($_REQUEST['new_username']);
		if (array_key_exists($username, $data)){
			$message="user already exists";
		}
		else {
			$salt = 'KCl-'.substr(md5(microtime().$username), -5);
			$data[$username] = [	'salt' => $salt,
						'hash' => md5($password.$salt)
			];
		}
	}
}
elseif (isset($_REQUEST['action']) && $_REQUEST['action'] == 'login'){
	if (isset($_REQUEST['login_username'])){
		$login_username = trim($_REQUEST['login_username']);
	}
	if (isset($_REQUEST['login_password'])){
		$login_password = trim($_REQUEST['login_password']);
	}
	if (	array_key_exists($login_username, $data)){
		if (md5($login_password.$data[$login_username]['salt']) == $data[$login_username]['hash']){
			$isLoggedIn = true;
			if ($login_username == ADMIN_USERNAME){
				$message = "welcome admin! here's your flag: ".CTF_FLAG;
			}
			else {
				$message = "you're not admin. have some hash browns though :,)";
			}
		}
		else {
			sleep(BRUTE_FORCE_DELAY_SEC);
			$message = "user does not exist, try signing up";
		}
	}
	else {
		$message = "i don't recognize that user.";
	}

}
else {
	// do nothing
	;
}


// Always close by refreshing session data in case it was updated
$_SESSION[SESSION_KEY] = json_encode($data);
?>

<!doctype html>
<html>
<body>
<div style="margin: 10px auto 100px 0; padding=20px;">
	<h1>Welcome to the Flag Factory</h1>
	<a href="/index.html">Home</a>
</div>
<?php if ($message != ""): ?>
<div style="margin 10px; padding: 10px; border: 2px solid blue;">
<p><?php echo $message; ?></p>
</div>
<?php endif; ?>
<?php if ($isLoggedIn):?>
<h3>Logged in</h3>
<a href="home.php"><button>Log Out</button></a>
<?php else: ?>
<div style="margin: 10px auto 10px auto; padding:0;">
	<div style="display: inline-block; width:40%; margin: 10px; padding: 20px; border: 2px solid blue;">
		<h2>Log In</h2>
		<form action="home.php" method="POST">
		<input type="hidden" name="action" value="login">
		<label>Username:</label><input type="text" name="login_username"/><br/>
		<label>Password:</label><input type="password" name="login_password"/><br/>
		<input type="submit">
		</form>
	</div>
	<div style="display: inline-block; width:40%; margin: 10px; padding: 20px; border: 2px solid blue;">
		<h2>Sign Up</h2>
		<form action="home.php" method="POST">
		<input type="hidden" name="action" value="create">
		<label>Username:</label><input type="text" name="new_username"/><br/>
		<label>Password:</label><input type="password" name="new_password"/><br/>
		<input type="submit">
		</form>
	</div>
</div>
<?php endif; ?>
<div style="margin: 100px auto 10px auto; padding=20px; border: 2px solid blue;">
	<h2>Debug</h2>
	<table border=1 cellpadding=4 cellspacing=0>
		<thead>
			<tr><td>User Name</td><td>Password Hash</td><td>Salt</td></tr>
		</thead>
		<tbody>
			<?php
			foreach($data as $user => $row){
				printf ("<tr><td>%s</td><td>%s</td><td>%s</td></tr>\n", $user, $row['hash'], $row['salt']);
			}
			?>
		</tbody>
	</table>
</div>

	

