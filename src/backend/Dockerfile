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

RUN /var/www/html/var/bin/composer_install.sh

RUN nmap localhost || \
    echo -e "# Docker Added lines\n \
        ServerName localhost\n \
        ServerName virtualhosttest\n \
        ServerName timetracker.de\n \
        ServerName backend.timetracker.de" \
        >> /etc/apache2/apache2.conf \

