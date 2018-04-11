#!/bin/bash
docker build -t 192.168.1.201:5000/aod-feed-ui:v${BUILD_NUMBER} .
docker push 192.168.1.201:5000/aod-feed-ui:v${BUILD_NUMBER}
cd src
#chmod +x rancher-compose
sed -i 's/\$\$BUILD_NUMBER\$\$/'${BUILD_NUMBER}'/g' docker-compose.yml
#sed -i 's/\$\$PORT_NUMBER\$\$/'`expr 5000 + ${BUILD_NUMBER}`'/g' docker-compose.yml
chmod 777 ./rancher-compose
./rancher-compose --url http://192.168.1.201:8080 --access-key 994E36B65FE1614CA2CD --secret-key zGDwi6rXkmFvEfbPE6JuT3X92PijfY4CE8CpHU56 up --upgrade aod-feed-ui
#./rancher-compose --url http://192.168.1.201:8080 --access-key 994E36B65FE1614CA2CD --secret-key zGDwi6rXkmFvEfbPE6JuT3X92PijfY4CE8CpHU56 -p aod-feed-ui up -d
