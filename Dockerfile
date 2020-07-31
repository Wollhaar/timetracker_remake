FROM php:7.2-apache

RUN DEBIAN_FRONTEND=noninteractive \
    apt-get update && \
    apt-get install apt-utils -y \
            iputils-ping -y \
            vim -y \
            wget -y \
            nmap -y \
            git -y

RUN nmap localhost || echo "# Docker Added lines" >> /etc/apache2/apache2.conf && \
    echo "ServerName localhost" >> /etc/apache2/apache2.conf
