FROM --platform=linux/amd64

# install required packages
RUN sudo apt install apache2 php-7.4 libapache2-mod-php php-mcrypt sqlite3 php-sqlite3

# don't clobber the existing html folder
WORKDIR /var/www
RUN mv html html.backup

# link from /var/www/hmtl to the install-dir/html
WORKDIR /usr/local/salty
RUN ln -s ./html /var/www/html

# Initialize salty.db and ensure permissions are set
WORKDIR ./html
RUN php setup.php
RUN chown :www-data *.db
RUN chmod 0660 *.db
