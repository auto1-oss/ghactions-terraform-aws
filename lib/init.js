const core = require("@actions/core");
const util = require('util');
//const exec = util.promisify(require('child_process').exec);
const exec = require("@actions/exec")

async function init() {
    try {
        const version = core.getInput("terraform_version");
        const versionsSet = version.split(".");
        const majorVer = (versionsSet[0] = "0") ? versionsSet[1] : versionsSet[0];
        const initcmd = makeInitCmd(core.getInput("bucket"), core.getInput("stateprefix"), core.getInput("aws_region"), majorVer, core.getInput("confpath"));
        core.info(`Starting terraform init with command ${initcmd}`);
        //const { stdout, stderr } = await exec(initcmd);
        //core.info(`stdout: ${stdout}`);
        //core.info(`stderr:, ${stderr}`);
        core.startGroup(`Executing commandset`);
        await exec.exec(initcmd,'');
        core.endGroup();
    } catch (err) {
        core.error(err);
        throw err;
    }
}

function makeInitCmd(bucket, prefix, region, majorVer, confpath) {
    if (bucket != '' && prefix != '') {
        return `cd ${confpath} && terraform${majorVer} init -force-copy -backend-config region=${region} -backend-config bucket=${bucket} -backend-config key=${prefix}`
    }
    return `cd ${confpath} && terraform${majorVer} init`
}

module.exports = init;


