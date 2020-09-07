# activate mods and special-conf
a2ensite 001-project.conf;
a2enmod rewrite;
a2enmod headers;

mkdir /var/www/.logs

# reload, restart apache service
service apache2 reload;
apachectl restart;