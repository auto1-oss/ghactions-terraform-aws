const core = require("@actions/core");
const util = require('util');
const exec = util.promisify(require('child_process').exec);

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
