docker build -t plant-monitor-api . ;
docker run --rm -d -p 8080:8080 --name plant-monitor-api plant-monitor-api ;
