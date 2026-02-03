# Use official PHP-Apache base image
FROM php:8.2-apache

# Install PHP extensions for MySQL and PDO
RUN docker-php-ext-install mysqli pdo pdo_mysql && docker-php-ext-enable mysqli

# Enable Apache modules used by the apps and caching rules.
RUN a2enmod rewrite headers expires deflate

# Copy in your virtual hosts and PHP config (uncomment if needed)
# COPY ./vhosts/*.conf /etc/apache2/sites-available/
# COPY ./php.ini /usr/local/etc/php/conf.d/custom.ini

# Set working directory
WORKDIR /var/www

# Set correct permissions (from your previous setup)
RUN chown -R www-data:www-data /var/www && \
    find /var/www -type d -exec chmod 755 {} \; && \
    find /var/www -type f -exec chmod 644 {} \;

# Expose Apache port
EXPOSE 80

# Start Apache in foreground
CMD ["apache2-foreground"]
