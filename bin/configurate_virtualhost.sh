a2ensite 001-project.conf;
a2enmod rewrite

service apache2 reload;
apachectl restart;