# Adeptus Optimus Frontend v1

# First deployment with Firebase
In root:

```
sudo apt-get autoremove 
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash - 
sudo apt-get install -y nodejs
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

# Test locally
In root (avoid CORS issues locally):

`chromium-browser --disable-web-security --user-data-dir ./public/index.html`

Dev query string: `id=admin&token=U2FsdGVkX197wfW/IY0sqa/Ckju8AeU3pRLPSra1aCxZeAHrWePPDPJlYTy5bwdU`