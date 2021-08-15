const init = require("./lib/init")
const ensure = require("./lib/ensure")
const plan = require("./lib/plan");
const apply = require("./lib/apply");
const destroy = require("./lib/destroy");
const core = require("@actions/core");
var process = require('process');



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

