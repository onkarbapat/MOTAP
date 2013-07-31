var exec = require('child_process').exec;
var spawn = require("child_process").spawn;

function MobileAction(platform)
{
	console.log("Mobile platform is %s",platform);
}

MobileAction.installApp = function(app_name,cb) {

//change the CWD 
	exec('fruitstrap -b '+app_name, {cwd:'/some/path/Downloads/Payload',timeout:40000}, function(error, stdout, stderr){
		console.log('stdout: ' + stdout);
	    console.log('stderr: ' + stderr);
	    if (error !== null) {
	      console.log('exec error: ' + error);
	      return cb(new Error("Install app error"));
	    }
	    else
	    	return cb(null);
	});
	
};

MobileAction.getUdid = function(cb){
	var udid=null;
	exec('mobiledevice get_udid',function(error, stdout, stderr){
	if (error !== null) {
	      return cb(error);
	    }
	else{
		udid=stdout;
		return cb(null,udid);
	}
	});
	
};

MobileAction.openApp = function(udid,app_package,cb) {
	console.log("In Open app")
	var str1='-l 600000 -w ';
	var str2=' -t /Applications/Xcode.app/Contents/Applications/Instruments.app/Contents/PlugIns/AutomationInstrument.bundle/Contents/Resources/Automation.tracetemplate ';
	console.log(str1.concat(udid,str2,app_package));
	var str=str1.concat(udid,str2,app_package);
	str=str.replace("\n", "");
	spawn('instruments',str.split(" "),{
      detached: true,
      stdio: "inherit"
    });
	return cb(null);

 //    ,function(error, stdout, stderr){
	//  if (error !== null) {
	//  	console.log('exec error: ' + error);
	//      return cb(error);
	//     }
	//     else{
	//     	console.log("Returning null");
	//     	return cb(null);
	//     }

	// });
};

module.exports=MobileAction