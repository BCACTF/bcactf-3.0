<!doctype html>
<html>
	<body>
		<h1>Welcome to the Flag Factory Headquarters</h1>
		<div>
		<?php
		if(isset($_REQUEST['m'])){
			printf("<h3>%s</h3>",$_REQUEST['m']);
		}
		?>
		</div>

		<h2>Login</h2>
		<form action="home.php" method="POST">
			<table>
				<tr>
					<td><label>User ID:</label></td>
					<td><input type="text" name="username"></td>
				</tr>
				<tr>
					<td><label>Password:</label></td>
					<td><input type="password" name="password"></td>
				</tr>
			</table>
			<input type="submit">
		</form>
		<p><a href="create.php">Sign Up</a></p>
		<p><a href="dump.php">Dump DB</a></p>
	</body>
</html>

