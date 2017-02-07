FROM node:onbuild

#RUN apt-get update && apt-get -y install cron

# http://stackoverflow.com/questions/37458287/how-to-run-a-cron-job-inside-a-docker-container

# Add crontab file in the cron directory
#COPY crontab /etc/cron.d/hello-cron

# Give execution rights on the cron job
#RUN chmod 0644 /etc/cron.d/hello-cron

# Create the log file to be able to run tail
#RUN touch /var/log/cron.log

#RUN crontab /etc/cron.d/hello-cron

# Run the command on container startup
#CMD cron && tail -f /var/log/cron.log
