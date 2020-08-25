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

COPY 001-project.conf /etc/apache2/sites-available/001-project.conf
COPY bin /var/www/html/var/bin

#RUN cd /var/www/html/backend
#    /var/www/html/var/bin/composer_install.sh;

RUN nmap localhost || (echo "# Docker Added lines" >> /etc/apache2/apache2.conf && \
    echo "ServerName localhost" >> /etc/apache2/apache2.conf)
