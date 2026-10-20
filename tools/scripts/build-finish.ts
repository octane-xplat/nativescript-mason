const ngPackage = require('ng-packagr');
const path = require('path');
const fs = require('fs-extra');

const rootDir = path.resolve(path.join(__dirname, '..', '..'));
const nxConfigPath = path.resolve(path.join(rootDir, 'nx.json'));
const nxConfig = JSON.parse(fs.readFileSync(nxConfigPath));
const npmScope = nxConfig.npmScope;

const cmdArgs = process.argv.slice(2);
const packageName = cmdArgs[0];
const publish = cmdArgs.includes('publish');
const skipAngular = cmdArgs.includes('--skip-angular');

const packagePath = path.join('packages', packageName, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath));
const npmPackageName = packageJson.name;
console.log(`Building ${npmPackageName}...${publish ? 'and publishing.' : ''}`);

// build angular package
function buildAngular() {
  ngPackage
    .ngPackagr()
    .forProject(path.join('packages', packageName, 'angular', 'ng-package.json'))
    .withTsConfig(path.join('packages', packageName, 'angular', 'tsconfig.angular.json'))
    .build()
    .then(() => {
      console.log(`${npmPackageName} angular built successfully.`);
      finishPreparation();
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

// copy angular ng-packagr output to dist/packages/{name}
function copyAngularDist() {
  fs.copy(path.join('packages', packageName, 'angular', 'dist'), path.join('dist', 'packages', packageName, 'angular'))
    .then(() => {
      console.log(`${npmPackageName} angular built successfully.`);
      // buildNativeSrc();
      finishPreparation();
    })
    .catch((err) => {
      console.error(err);
      process.exitCode = 1;
    });
}

function finishPreparation() {
  // ng-packagr excludes nested manifests by default, but our Angular adapter
  // ships as a subpath of the main package and needs its entry-point metadata.
  const angularIgnore = path.join('dist', 'packages', packageName, 'angular', '.npmignore');
  if (fs.existsSync(angularIgnore) && !fs.readFileSync(angularIgnore, 'utf8').includes('!package.json')) {
    fs.appendFileSync(angularIgnore, '\n!package.json\n');
  }
  fs.copy(path.join('tools', 'assets', 'publishing'), path.join('dist', 'packages', packageName))
    .then(() => console.log(`${npmPackageName} ready to publish.`))
    .catch((err) => {
      console.error(err);
      process.exitCode = 1;
    });
}

if (!skipAngular && fs.existsSync(path.join(rootDir, 'packages', packageName, 'angular'))) {
  // package has angular specific src, build it first
  buildAngular();
} else {
  finishPreparation();
}
