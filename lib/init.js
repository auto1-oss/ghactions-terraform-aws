const core = require("@actions/core");
const path = require("path")
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function init() {
    try {
        const version = core.getInput("terraform_version");
        const versionsSet = version.split(".");
        const majorVer = (versionsSet[0] = "0") ? versionsSet[1] : versionsSet[0];
        const initcmd = makeInitCmd(core.getInput("bucket"), core.getInput("stateprefix"), core.getInput("aws_region"), majorVer);
        core.info(`Changing directories to working directory`)
        process.chdir(path.join(process.cwd(), core.getInput("working-directory")))
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


