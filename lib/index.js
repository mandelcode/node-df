var exec  = require('child_process').execFile;
var parse = require('./parse');

module.exports = function df(aOptions, aCallback) {
    var options;
    var callback;

    if (typeof aOptions === 'function') {
        options  = {};
        callback = aOptions;
    }
    else {
        options  = aOptions;
        callback = aCallback;
    }

    // It's a breaking change to be made after releasing 0.1.4
    if (typeof callback !== 'function') {
        throw new Error("You need to provide a callback function");
    }

    // It's a breaking change to be made after releasing 0.1.4
    if (typeof options !== 'object') {
        throw new Error("'option' parameter must be an object");
    }

    if (typeof options.execFileOptions !== undefined && typeof options.execFileOptions !== 'object') {
        throw new Error("'execFileOptions' option must be an object");
    }

    if (options.timeout && !isFinite(options.timeout)) {
        throw new Error("'timeout' option must be a number");
    }

    // TODO: snould validate options and merge with defaults
    // It's a breaking change to be made after releasing 0.1.4

    // TODO: should throw if prefixMultiplier is not a string
    // It should invoke callback with `err` but it's a breaking change

    // TODO: should fail if unit is not a string


    var command = '/bin/df -kP';

    if (!options.isIncludeRemote) { // without 'isIncludeRemote', limit listing to local file systems to prevent stalling or lagging
        command += ' -l';
    }

    if (options.file) {
        command += ' ' + options.file;
    }
    commandParts = command.split(' ');

    let execFileOptions = {...options.execFileOptions};

    if (options.timeout) {
        execFileOptions.timeout = options.timeout;
    }

    exec(
        commandParts[0],
        commandParts.slice(1),
        execFileOptions,
        function (err, strdout, stderr) {
            if (err) {
                callback(err);
                return;
            }

            if (stderr) {
                callback(new Error(err));
                return;
            }

            var entries = parse(stdout, options);

            callback(null, entries);
        }
    );
};
