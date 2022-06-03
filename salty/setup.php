<?php
require("../db.php");
  
if(!file_exists(DB_FILE)){
       	$user="admin";
        $password="bca4";
        $salt="NaCl";
        $hash = md5($password.$salt);

        $db = new SQLite3(DB_FILE);

        $db->exec("drop table if exists users;");
        $db->exec("create table users (session_id char(255), user_id char(255), hash char(255), salt char(255))");

        $db->exec("insert into users (session_id, user_id, hash, salt) values ('default', '{$user}', '{$hash}', '{$salt}');");
}
