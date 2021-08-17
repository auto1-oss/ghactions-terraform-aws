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
        core.info(`Running command ${action}...`)
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

