const core = require("@actions/core");
const path = require("path");
const exec = require("@actions/exec")

async function init() {
    try {
        const version = core.getInput("terraform_version");
        const versionsSet = version.split(".");
        const aws_access_key_id = core.getInput("aws_access_key_id");
        const aws_secret_access_key = core.getInput("aws_secret_access_key")
        const region = core.getInput("aws_region");
        const bucket = core.getInput("bucket");
        const prefix = core.getInput("stateprefix")
        process.env['AWS_DEFAULT_REGION'] = `${region}`;
        addEnvVars(aws_access_key_id, aws_secret_access_key);
        const majorVer = (versionsSet[0] = "0") ? versionsSet[1] : versionsSet[0];
        core.info(`Changing directories to working directory`)
        process.chdir(path.join(process.cwd(), core.getInput("working-directory")))
        const execfile = `terraform${majorVer}`
        const args = makeInitArgs(bucket, prefix, region)
        core.startGroup(`Init info`);
        core.info(`Starting terraform init with command ${execfile} ${args}`);
        await exec.exec(execfile, args);
        core.endGroup();
    } catch (err) {
        core.error(err);
        throw err;
    }
}

module.exports = init;