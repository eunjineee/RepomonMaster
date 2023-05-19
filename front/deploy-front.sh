docker ps -a -q --filter "name=front" | grep -q . && docker stop front && docker rm front | true
docker run -d -p 3000:3000 --name front e105/front:1.0
docker image prune -af
