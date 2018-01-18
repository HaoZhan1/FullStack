#! /bin/bash

fuser -k 3000/tcp
fuser -k 5000/tcp

redis-server &

cd ./oj-server
nodemon server.js &

cd ../executor
source activate Hao1
pip3 install -r requirements.txt
python3 executor_server.py 5003 &

echo "================================="
read -p "PRESS [ENTER] terminate processes." PRESSSKEY

fuser -k 3000/tcp
fuser -k 5000/tcp

redis-cli shutdown
