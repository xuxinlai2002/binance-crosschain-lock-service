import cluster from 'cluster'
import os from "os"
import express from 'express'
import morgan from 'morgan';
import {
    SERVER_PORT
} from 'config/config'
import api from 'modules/api'
import bodyParser from 'body-parser';

if (cluster.isMaster) {
    var numWorkers = os.cpus().length;
    // set it to 1 for now
    numWorkers = 1;
    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    for(var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
} else {
    const app = express();

    morgan.format('ccls', '[Backend] :method :url :status :res[content-length] - :response-time ms');
    app.use(morgan('ccls'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use('/api', api);
    app.get('/', (req, res) => {
        res.json('Landing page')
    });

    app.listen(SERVER_PORT, () => console.log(`Server listen to :${SERVER_PORT}`))
}
