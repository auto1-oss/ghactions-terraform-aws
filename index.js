const init = require("./lib/init")
const ensure = require("./lib/ensure")
const plan = require("./lib/plan");
const apply = require("./lib/apply");
const destroy = require("./lib/destroy");
const core = require("@actions/core");
var process = require('process');
const validate = require("./lib/validate");


(async () => {
    try {
        const action = core.getInput("command");
        core.info(`Running command ${action}...`)
        switch (action) {
            default:
                core.info(`Undefined action: ${action}`);
            case "validate":
                await validate();
                break;
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

function makeWorkspaceOrNot(createworkspace, workspace) {
    if (createworkspace != "false") {
        return [`workspace`, `new`, `${workspace}`]
    }
    return [`workspace`, `select`, `${workspace}`]
}

function addEnvVars(aws_access_key_id, aws_secret_access_key) {
    if (aws_access_key_id != "acracadabra_id") {
        core.info(`**** IMPORTANT: Setting provided AWS Credentials ****`);
        process.env['AWS_ACCESS_KEY_ID'] = `${aws_access_key_id}`;
        process.env['AWS_SECRET_ACCESS_KEY'] = `${aws_secret_access_key}`;
    }
    core.info(`**** IMPORTANT: No AWS Credentials provided. To proceed with instance profile access ****`);
}


function makePlanCmd(varsfile, planfile, target) {
    let plan = [`plan`];

    if (varsfile != "") {
        plan = plan.concat([`-var-file`, `${varsfile}`])
    }

    if (target != "") {
        plan = plan.concat([`-target`, `${target}`]);
    }

    plan = plan.concat([`-out`, `${planfile}`]);

    return plan;
}

function makeInitArgs(bucket, prefix, region) {
    if (bucket != '' && prefix != '') {
        return [ `init`, `-force-copy`, `-backend-config`, `region=${region}`, `-backend-config`, `bucket=${bucket}`, `-backend-config`, `key=${prefix}`]
    }
    return [`init`]
}