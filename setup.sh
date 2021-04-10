sudo apt-get update

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm bash_completion
nvm install 14.16.0

npm install pm2 -g # daemonize
echo "export PATH=\"$HOME/.npm-packages/bin:$PATH\""

sudo apt install unzip

wget https://github.com/duncanpharvey/zendesk-training-queue-notifications/archive/main.zip # get repository

unzip main.zip # unzip repository
rm -rf main.zip # clean up zip file

# set environment variables
set -a
source ~/.zendesk-notifications.env
set +a

source ~/.bashrc

cd zendesk-training-queue-notifications-main
npm install
pm2 start server.js

# default port 80?
# find out how to add slack app IP whitelist