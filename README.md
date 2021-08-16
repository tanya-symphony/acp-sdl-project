1 - At the root of the sdl-acp-project repo, `yarn install` to install all the dependencies. 

#### Execute tests

```bash
$ npm run test-plain -- --admin-name <admin name> --admin-pwd <admin pwd> --backend-url https://<pod name>.symphony.com
```
Currently admin-name, admin-pwd & backend-url are still required to launch the test even if not necessary.
For the status of this issue, see [ticket](https://perzoinc.atlassian.net/browse/GK-3)


See 'scripts' in package.json for how test-1.5, test-2.0 and test-plain map to mocha for running the specific tests.
