import { join } from 'path'

/**
 * Configuração de Logs
 */

var stream = require('file-stream-rotator')
    .getStream({
        filename: join(__dirname + '/logs', 'access.log'),
        frequency: "1h",
        verbose: false,
        date_format: "YYYY-MM-DD",
        max_logs: "1d",
        audit_file: join(__dirname + '/logs', 'logs-audit.json')
    });

module.exports = stream
