// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// let domain = 'http://10.0.102.128:3001';
// let domain = 'http://localhost:3000';
let domain = 'https://4000-idx-arriendosbk-1726111308907.cluster-2xid2zxbenc4ixa74rpk7q7fyk.cloudworkstations.dev';

export const environment = {
  production: false,
  url: domain+'/api/arriendos/',
  urlCarnet: domain+'/api/carnetVirtual/',
  urlNovedades: domain+'/api/novedades/',
};
