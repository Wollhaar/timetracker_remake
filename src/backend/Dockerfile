FROM php:7.2-apache

RUN docker-php-ext-install mysqli

RUN DEBIAN_FRONTEND=noninteractive \
    apt-get update && \
    apt-get install --quiet apt-utils -y \
            iputils-ping -y \
            vim -y \
            wget -y \
            zip -y \
            npm -y \
            nmap -y \
            git -y

COPY bin /var/www/html/var/bin
COPY .htaccess /var/www/html/.htaccess

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
    php -r "if (hash_file('sha384', 'composer-setup.php') === 'e5325b19b381bfd88ce90a5ddb7823406b2a38cff6bb704b0acc289a09c8128d4a8ce2bbafcd1fcbdc38666422fe2806') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
    php -r "composer-setup.php"
    php -r "unlink('composer-setup.php');"

RUN nmap localhost || (echo "# Docker Added lines" >> /etc/apache2/apache2.conf && \
    echo "ServerName localhost" >> /etc/apache2/apache2.conf)
