/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {

    live_build_dir: 'live/build',

    dluxSrcDir: '../../../../../../../../dlux/dlux-web/build',

    dluxSrcFiles: [
        '../../../../../../../../dlux/dlux-web/build/**/*.*',
        '!../../../../../../../../dlux/dlux-web/build/*.*',
        '!../../../../../../../../dlux/dlux-web/build/src/common/config/env.module.js',
        '!../../../../../../../../dlux/dlux-web/build/src/app/app.module.js',

    ],

    envConfig: {
        "configEnv":"ENV_DEV",
        "baseURL": "http://172.17.0.2:",
        "adSalPort": "8080",
        "mdSalPort" : "8181"
    },

};
