module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(794);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 8:
/***/ (function(module, __unusedexports, __webpack_require__) {

const core = __webpack_require__(961);
const util = __webpack_require__(669);
const exec = util.promisify(__webpack_require__(129).exec);

async function init() {
    try {
        const version = core.getInput("terraform_version");
        const versionsSet = version.split(".");
        const majorVer = (versionsSet[0] = "0") ? versionsSet[1] : versionsSet[0];
        const initcmd = makeInitCmd(core.getInput("bucket"), core.getInput("stateprefix"), core.getInput("aws_region"), majorVer);
        core.info(`Starting terraform init with command ${initcmd}`);
        const { stdout, stderr } = await exec(initcmd);
        core.info(`stdout: ${stdout}`);
        core.info(`stderr:, ${stderr}`);
    } catch (err) {
        core.error(err);
        throw err;
    }
}

function makeInitCmd(bucket, prefix, region, majorVer) {
    if (bucket != '' && prefix != '') {
        return `terraform${majorVer} init -force-copy -backend-config region=${region} -backend-config bucket=${bucket} -backend-config key=${prefix}`
    }
    return `terraform${majorVer} init`
}

module.exports = init;




/***/ }),

/***/ 29:
/***/ (function(module, __unusedexports, __webpack_require__) {

const core = __webpack_require__(961);
const util = __webpack_require__(669);
const exec = util.promisify(__webpack_require__(129).exec);

async function destroy() {
    try {
        const version = core.getInput("terraform_version");
        const versionsSet = version.split(".");
        const majorVer = (versionsSet[0] = "0") ? versionsSet[1] : versionsSet[0];
        const destroycmd = makeDestroyCmd(core.getInput("varsfile"), core.getInput("planfile"), core.getInput("workspace"), majorVer);
        core.info(`Starting terraform plan with command ${destroycmd}`);
        const { stdout, stderr } = await exec(destroycmd);
        core.info(`stdout: ${stdout}`);
        core.info(`stderr:, ${stderr}`);
    } catch (err) {
        core.error(err);
        throw err;
    }
}

function makeDestroyCmd(varsfile, planfile, workspace, majorVer) {
    if (varsfile != '') {
        return `terraform${majorVer} workspace select ${workspace} || terraform${majorVer} workspace new ${workspace} && terraform${majorVer} plan -var-file ${varsfile} -out ${planfile} -destroy && terraform${majorVer} apply ${planfile}`
    }
    return `terraform${majorVer} workspace select ${workspace} || terraform${majorVer} workspace new ${workspace} && terraform${majorVer} plan -out ${planfile} -destroy && terraform${majorVer} apply ${planfile}`
}

module.exports = destroy;


/***/ }),

/***/ 129:
/***/ (function(module) {

module.exports = require("child_process");

/***/ }),

/***/ 156:
/***/ (function(module) {

module.exports = eval("require")("@actions/tool-cache");


/***/ }),

/***/ 276:
/***/ (function(module, __unusedexports, __webpack_require__) {

const core = __webpack_require__(961);
const tc = __webpack_require__(156);
const fs = __webpack_require__(747);
const util = __webpack_require__(669);
const exec = util.promisify(__webpack_require__(129).exec);

//Terraform_version==major.minor.patch

async function ensure() {
    try{
        const version = core.getInput("terraform_version");
        const versionsSet = version.split(".");
        const majorVer = (versionsSet[0] = "0") ? versionsSet[1] : versionsSet[0];
        const installpath = `/usr/local/bin/terraform${majorVer}`;
        if (fs.existsSync(installpath)) {
            core.info(`File exists at ${installpath}`);
        } else {
            core.info(`File does not exist at ${installpath}`);
            const downloadurl = `https://releases.hashicorp.com/terraform/${version}/terraform_${version}_linux_amd64.zip`;
            core.info(`Downloading Terraform CLI from ${downloadurl}`);
            const pathToCLIZip = await tc.downloadTool(downloadurl);
            core.info('Extracting Terraform CLI zip file');
            const pathToCLI = await tc.extractZip(pathToCLIZip, "/tmp");
            core.info(`Terraform CLI path is ${pathToCLI}.`);
            if (!pathToCLIZip || !pathToCLI) {
                throw new Error(`Unable to download Terraform from ${downloadurl}`);
            }
            core.info(`Copying and changing file permissions at ${installpath}`);
            const { stdout, stderr } = await exec(`mv /tmp/terraform ${installpath} && chmod 777 ${installpath}`);
            core.info(`stdout: ${stdout}`);
            core.info(`stderr:, ${stderr}`);
            core.info(`File permissions changed!`);
        }
    } catch (err) {
        core.error(err);
        throw err;
    }

}

module.exports = ensure;

/***/ }),

/***/ 334:
/***/ (function(module, __unusedexports, __webpack_require__) {

const core = __webpack_require__(961);
const util = __webpack_require__(669);
const exec = util.promisify(__webpack_require__(129).exec);

async function apply() {
    try {
        const version = core.getInput("terraform_version");
        const versionsSet = version.split(".");
        const majorVer = (versionsSet[0] = "0") ? versionsSet[1] : versionsSet[0];
        const applycmd = makeApplyCmd(core.getInput("varsfile"), core.getInput("planfile"), core.getInput("workspace"), majorVer);
        core.info(`Starting terraform apply with command ${applycmd}`);
        const { stdout, stderr } = await exec(plancmd);
        core.info(`stdout: ${stdout}`);
        core.info(`stderr:, ${stderr}`);
    } catch (err) {
        core.error(err);
        throw err;
    }
}

function makeApplyCmd(varsfile, planfile, workspace, majorVer) {
    if (varsfile != '') {
        return `terraform${majorVer} workspace select ${workspace} || terraform${majorVer} workspace new ${workspace} && terraform${majorVer} plan -var-file ${varsfile} -out ${planfile} && terraform${majorVer} apply ${planfile}`
    }
    return `terraform${majorVer} workspace select ${workspace} || terraform${majorVer} workspace new ${workspace} && terraform${majorVer} plan -out ${planfile} && terraform${majorVer} apply ${planfile}`
}

module.exports = apply;

/***/ }),

/***/ 527:
/***/ (function(module, __unusedexports, __webpack_require__) {

const core = __webpack_require__(961);
const util = __webpack_require__(669);
const exec = util.promisify(__webpack_require__(129).exec);

async function plan() {
    try {
        const version = core.getInput("terraform_version");
        const versionsSet = version.split(".");
        const majorVer = (versionsSet[0] = "0") ? versionsSet[1] : versionsSet[0];
        const plancmd = makePlanCmd(core.getInput("varsfile"), core.getInput("planfile"), core.getInput("workspace"), majorVer);
        core.info(`Starting terraform plan with command ${plancmd}`);
        const { stdout, stderr } = await exec(plancmd);
        core.info(`stdout: ${stdout}`);
        core.info(`stderr:, ${stderr}`);
    } catch (err) {
        core.error(err);
        throw err;
    }
}

function makePlanCmd(varsfile, planfile, workspace, majorVer) {
    if (varsfile != '') {
        return `terraform${majorVer} workspace select ${workspace} || terraform${majorVer} workspace new ${workspace} && terraform${majorVer} plan -var-file ${varsfile} -out ${planfile}`
    }
    return `terraform${majorVer} workspace select ${workspace} || terraform${majorVer} workspace new ${workspace} && terraform${majorVer} plan -out ${planfile}`
}

module.exports = plan;


/***/ }),

/***/ 669:
/***/ (function(module) {

module.exports = require("util");

/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ }),

/***/ 765:
/***/ (function(module) {

module.exports = require("process");

/***/ }),

/***/ 794:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

const init = __webpack_require__(8)
const ensure = __webpack_require__(276)
const plan = __webpack_require__(527);
const apply = __webpack_require__(334);
const destroy = __webpack_require__(29);
const core = __webpack_require__(961);
var process = __webpack_require__(765);



(async () => {
    try {
        const action = core.getInput("command");
        const aws_access_key_id = core.getInput("aws_access_key_id");
        const aws_secret_access_key = core.getInput("aws_secret_access_key")
        const region = core.getInput("aws_region")
        core.info(`Running command ${action}...`)
        process.env['AWS_ACCESS_KEY_ID'] = `${aws_access_key_id}`;
        process.env['AWS_SECRET_ACCESS_KEY'] = `${aws_secret_access_key}`;
        process.env['AWS_DEFAULT_REGION'] = `${region}`;
        switch (action) {
            default:
                core.info(`Undefined action: ${action}`);
            case "destroy":
                await destroy();
                break;
            case "apply":
                await apply();
                break;
            case "plan":
                await plan();
                break;
            case "init":
                await init();
                break;
            case "ensure":
                await ensure();
                break;
        }
    } catch (error) {
        core.setFailed(error.message);
    }
  })();



/***/ }),

/***/ 961:
/***/ (function(module) {

module.exports = eval("require")("@actions/core");


/***/ })

/******/ });