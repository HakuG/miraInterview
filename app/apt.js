
// Obtain all necessary packages

// Paths
const path = require('path');

// Sudo to run apt-get install
const sudo = require('sudo');
// fs to open files
const fs = require('fs');
// open the file
const out = fs.openSync('get.out', 'w');

// Create the synced spawn
const spawnSync = require('child_process').spawnSync;


/*
function getSudo()
{	
const message = "\"Please input the sudo password in order to use packages\n\""
console.log(message);
execSync("sudo echo \"hi\"")
}
*/

const sudoOptions = 
		{
			cachePassword: true,
			prompt: "Password?",
			spawnOptions: 
			{ 
				stdio: ['ignore', out, out]
			}
		};

// Wrapper for apt-get. Takes in apt-get _____ and runs it in sudo mode
// so that we can install
function aptget(args)
{
	// Open a file where we'll be logging what's said
	fs.open("get.out", 'w', (err, fd) => 
	{	
		// Spawn a child process in sudo mode
		var child = sudo(['apt-get'].concat(args.split(' ')), sudoOptions);
		// Output its output to console and log
		child.stdout.on('data', function (data) 
		{
			console.log(data.toString());
			fs.appendFileSync(fd, data.toString())
		});
		
		// Output its error to console and log
		child.stderr.on('data', function (data) 
		{
			console.log(data.toString());
			fs.appendFileSync(fd, data.toString())
		});

		// When the process is over, close the file and tell the user we're done updating
		child.on('close', (code) =>
			{
				console.log("Finished Updating");
				fs.closeSync(fd);
			}
		);
	})
}

// Run apt-Cache in sync with args like this:
// args = "madison git"
// This will run apt-cache with those arguments 
function aptcache(args)
{
	// open a file to store the outut
	fs.open("cache.out", 'w', (err,fd) => 
	{
		// Everything should move to the file descriptors, but we don't care about input
		var syncOptions = 
		{
			stdio: ['ignore', fd, fd]
		}	
		// spawn the child with synchronous 
		var child = spawnSync('apt-cache', args.split(' '), syncOptions);
	});
}


/*child.stdout.on('data', function (data) {
fs.appendFile("cache.out", data.toString(), errCatch)
});
child.on('close', (close) =>
{
console.log("finished process");
fs.closeSync(fd);
});
})

*/
//}

/*

function aptget(args)
{
exec('sudo apt-get ' + args, (error, stdout, stderr) => {
if (error)
{
console.log("we have an error")
}
console.log("hi");
console.log('stdout: ${stdout}');
console.log('stderr: ${stderr}'); 

});
}

*/

/*
function aptcache(a,b)
{
exec('sudo apt-cache ' + args);
}
*/
module.exports.aptget = aptget;
module.exports.aptcache = aptcache;
