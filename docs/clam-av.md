## Run clamAV locally

1. git clone https://github.com/UKForeignOffice/docker-clamav
2. cd docker-clamav/debian/buster/
3. docker build -t clamav .
4. docker run -p 3310:3310 clamav:latest - this takes 5 minutes time to start up completely.
5. Run it with -d once you verify it’s working - docker run -d -p 3310:3310 clamav:latest

Then point your code at 127.0.0.1 and 3310