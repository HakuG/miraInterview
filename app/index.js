const path = require('path');
const aptGet = path.join(__dirname, 'apt');
const fs = require('fs');
const apt = require(aptGet);

// 
var packages = ['git', 'nautilus'];


const checkFile = function(pkg)
{
	// check the current and newest file using the wrapper
	var current = "";
	var newest = "";
	// Run aptcache
	apt.aptcache('policy ' + pkg);
	// Read the output of the aptcache file
	const lineReader = require('readline').createInterface(
	{
		input: fs.createReadStream(path.join(__dirname, 'cache.out'))
	});
	
	// Read each line	
	lineReader.on('line', function(line)
	{
		// Extract just the information for the version number
		if (line.indexOf('Installed') > 0)
		{
			current = line.substring((line.indexOf('Installed') + 'Installed'.length + 2));
		}
		else if (line.indexOf('Candidate') > 0)
		{
			newest = line.substring((line.indexOf('Candidate') + 'Candidate'.length + 2));
			// if the newest is equal to the current, then there's no need for an update
			if (newest == current)
			{
				console.log("No updates for " + pkg);
			}

			// Otherwise, update
			else
			{
				console.log("Updating " + pkg + " from " + current + " to " + "newest");
				
				// Install in sudo mode
				apt.aptget('install ' + pkg);
			}
		}
	});

	// When you're done reading, tell the user we're done
	lineReader.on('close', function()
		{
			console.log("Done With Check");
		}
	);
}

// Here's the runner that we run every 1 minute
const runner = function()
{
	// Iterate through the packages and check each one
	var index = 0;
	for (index = 0; index < packages.length; ++index)
	{
		checkFile(packages[index]);
	}
}

// Run this every couple seconds
setInterval(runner, 1 * 60 * 1000);

//apt.aptget('install ssh -y --force-yes'):
