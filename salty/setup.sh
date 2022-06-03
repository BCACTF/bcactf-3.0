#!/bin/bash

PASSWORD="bca4";
SALT="NaCl";
HASH=$(echo ${PASSWORD}${SALT} | md5sum | cut -d ' ' -f 1)

echo "DROP DATABASE IF EXISTS salty;" | sudo mysql
echo "CREATE DATABASE salty;" | sudo mysql
echo "DROP USER IF EXISTS saltyuser@localhost;" | sudo mysql
echo "CREATE USER saltyuser@localhost identified by '8T9!6rz^JYnkkkLW';" | sudo mysql
echo "CREATE TABLE salty.users(id int not null auto_increment primary key, session_id char(255), username char(255), hash char(255
), salt char(255));" | sudo mysql;
echo "INSERT INTO salty.users(session_id, username, hash, salt) values ('default', 'admin', md5(concat('$PASSWORD', '$SALT')), '$S
ALT');" | sudo mysql
echo "GRANT SELECT, INSERT, DELETE, UPDATE on salty.* to saltyuser@localhost;" | sudo mysql
