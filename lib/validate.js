const core = require("@actions/core");
const path = require("path")
const exec = require("@actions/exec")

async function validate() {
    try {
        const version = core.getInput("terraform_version");
        const versionsSet = version.split(".");
        const majorVer = (versionsSet[0] = "0") ? versionsSet[1] : versionsSet[0];
        const region = core.getInput("aws_region");
        process.env['AWS_DEFAULT_REGION'] = `${region}`;
        core.info(`Changing directories to working directory`);
        process.chdir(path.join(process.cwd(), core.getInput("working-directory")));
        core.info(`Starting terraform validate`);
        const execfile = `terraform${majorVer}`;
        core.startGroup(`Terraform Validate`);
        await exec.exec(execfile, [`validate`]);
        core.endGroup();
    } catch (err) {
        core.error(err);
        throw err;
    }
}

module.exports = validate;