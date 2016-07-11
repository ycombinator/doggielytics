function timestamp() {
  const timestamp = new Date();
  return timestamp.toISOString();
}

function log(level, message) {
  console.log(timestamp() + ' ' + level + ' ' + message)
}

function trace(message)   { return log('[trace]  ', message); }
function debug(message)   { return log('[debug]  ', message); }
function info(message)    { return log('[info]   ', message); }
function warning(message) { return log('[warning]', message); }
function fatal(message)   { return log('[fatal]  ', message); }

module.exports = {
  trace,
  debug,
  info,
  warning,
  fatal
};
