# activate mods and special-conf
a2ensite 001-project.conf;
a2enmod rewrite

# reload, restart apache service
service apache2 reload;
apachectl restart;