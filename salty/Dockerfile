FROM --platform=linux/amd64

# Expects the install package to be in /usr/local/salty-session

# install required packages
RUN sudo apt update
RUN sudo apt install -y apache2 php libapache2-mod-php 

# don't clobber the existing html folder
WORKDIR /var/www
RUN if [ -d html ]; then mv html html.backup; fi
RUN if [ -l html ]; then unlink html; fi
RUN ln -s /usr/local/salty-session /var/www/html

# Initialize salty.db and ensure permissions are set
WORKDIR /usr/local/salty-session
RUN chown :www-data -R html
RUN chmod 0660 -R html

