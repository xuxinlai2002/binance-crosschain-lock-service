import cluster from 'cluster'
import os from "os"
import express from 'express'
import morgan from 'morgan';
import {
    SERVER_PORT,
    JOB_INTERVAL,
} from 'config/config'
import api from 'modules/api'
import bodyParser from 'body-parser';
import childProcess from 'child_process';


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
    app.use(express.static('public'));
    app.set('view engine', 'pug');
    app.use('/api', api);

    var data = {
        'start': true,
        'interval': JOB_INTERVAL,
        'content': ['Query Smart Contract']
    };
    app._listenContract = childProcess.fork('./services/job');
    app._listenContract.send(data);

    var data1 = {
        'start': true,
        'interval': 1000,
        'content': ['Query Smart Contract Fast Mode']
    };
    app._listenContract2 = childProcess.fork('./services/job2');
    app._listenContract2.send(data1);


    app.listen(SERVER_PORT, () => console.log(`Server listen to :${SERVER_PORT}`))
}
