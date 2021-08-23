1 - At the root of the sdl-acp-project repo, `yarn install` to install all the dependencies. 

#### Execute tests

```bash
$ npm run sdl-admin-test -- --admin-name 'admin@symphony.com' --admin-pwd 'password' --backend-url https://warpdrive-lab.dev.symphony.com/env/XXXXXX/sbe/admin-console --start-page-url https://warpdrive-lab.dev.symphony.com/env/XXXXXX/sbe/client/index.html --support-portal-keystore-path "Your local path/supportportal.dev.keystore" --support-portal-keystore-password "greatsupport" --support-portal-keystore-alias "support-alias-dev"
```
Currently admin-name, admin-pwd & backend-url are still required to launch the test even if not necessary.
For the status of this issue, see [ticket](https://perzoinc.atlassian.net/browse/GK-3)


See 'scripts' in package.json for how sdlAdminTest map to mocha for running the specific tests.
