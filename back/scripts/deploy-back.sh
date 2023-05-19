docker ps -a -q --filter "name=back" | grep -q . && docker stop back && docker rm back | true
docker run -d -p 8080:8080 -e Profile=dev --name back e105/back:1.0
docker image prune -af
