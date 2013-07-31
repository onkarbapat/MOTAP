var amqp       = require('amqp');
var amqp_hacks = require('./amqp-hacks');

var connection = amqp.createConnection({host: 'localhost'});

var message = process.argv.slice(2).join(' ') || "{\"platform\":\"ios\",\"device\":\"ipad\",\"version\":\"6\",\"testLoc\":\"http://some/location\",\"appName\":\"com.company.AppName\"}";

connection.on('ready', function(){
	var json = JSON.parse(message);
	var myqueue=json.device+'_'+json.version;
	console.log(myqueue);
    connection.queue(myqueue, {autoDelete: false,
                                    durable: true}, function(queue){
        connection.publish(myqueue, message, {deliveryMode: 2});
        console.log(" [x] Sent %s", message);

        amqp_hacks.safeEndConnection(connection);
    });
});