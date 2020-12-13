# What you'll need
- Couch installed locally
- NPM and Node installed
- An Otka account ([see here to get set up](https://okta.com/))


# To get a local copy set up locally
- Clone the repo to your machine.
- Run `npm install` from both the root and client directories.
- Add a .env file with information from your Otka application.
    ```
    ISSUER=https://{{ OTKA DOMAIN }}/oauth2/default
    CLIENT_ID={{ OTKA CLIENT ID }}
    CLIENT_SECRET={{ OTKA CLIENT SECRET }}
    ```
- To start in dev mode run `npm start` in two different console tabs, one from the root directory and one from the client directory.
- To start in prod mode, or if only working on server changes, run `npm run build` from the client directory then `npm start` from the root directory.
