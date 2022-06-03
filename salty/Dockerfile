FROM --platform=linux/amd64

# install required packages
RUN sudo apt update
RUN sudo apt install -y apache2 php libapache2-mod-php mysql-server php-mysql

# don't clobber the existing html folder
WORKDIR /var/www
RUN if [ -d html ]; then mv html html.backup; fi

# link from /var/www/hmtl to the install-dir/html
WORKDIR /usr/local/salty
RUN ln -s ./html /var/www/html

# Initialize salty.db and ensure permissions are set
WORKDIR /usr/local/salty
RUN sudo ./setup.sh
RUN chown :www-data -R html
RUN chmod 0660 -R html

# Update apache2 config: unlink existing conf files; add ours; restart apache2
WORKDIR /etc/apache2/sites-enabled
RUN LIST=$(find . -type l | sed 's/\.\///'); for LINK in $LIST; do unlink $LINK ; done
RUN LIST=$(find . -type f | sed 's/\.\///'); for FILE in $LIST; do rm $FILE ; done
RUN ln -s /usr/local/salty/salty.conf /etc/apache2/sites-enabled/salty.conf
RUN systemctl restart apache2
