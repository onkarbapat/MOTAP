
var amqp = require('amqp');
var MobileAction = require ('./mobileActions');

var APP = {};

APP.connection = amqp.createConnection({host: 'localhost'});

APP.connection.on('ready', function(){
    console.log("Connected to the server");
    APP.connectionStatus='Connected';
    APP.connection.queue('ipad_6',{autoDelete: false,durable: true},function (queue){
    APP.q = queue;
    APP.q.subscribe({ack: true, prefetchCount: 1},function(msg){
    var body = msg.data.toString('utf-8');
    console.log(" [x] Received %s", body);
    var jpar=JSON.parse(msg.data.toString('utf-8'));
    console.log(" [x] Received-Msg "+jpar.appName);
    var m = new MobileAction(jpar.platform);
    var in_app=MobileAction.installApp("{AppName.app}",function(err){

        if (err===null){
            var udid=MobileAction.getUdid(function(err,udid){
                if(err===null){
                    MobileAction.openApp(udid,jpar.appName,function(err){
                        if (err===null){
                            console.log("Opened Succesfully");
                            queue.shift();
                        }
                        else
                            queue.shift();
                    });
                }
                else
                    queue.shift();
            });
        }
        else{
            console.log("Error while installing App");
            queue.shift();
        }
    });
});
});
});
