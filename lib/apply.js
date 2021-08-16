const core = require("@actions/core");
const util = require('util');
const path = require("path")
const exec = util.promisify(require('child_process').exec);

async function apply() {
    try {
        const version = core.getInput("terraform_version");
        const versionsSet = version.split(".");
        const majorVer = (versionsSet[0] = "0") ? versionsSet[1] : versionsSet[0];
        const applycmd = makeApplyCmd(core.getInput("varsfile"), core.getInput("planfile"), core.getInput("workspace"), majorVer);
        core.info(`Changing directories to working directory`)
        process.chdir(path.join(process.cwd(), core.getInput("confpath")))
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