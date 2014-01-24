/*jshint node:true */

"use strict";

var sequence = function (tasks, names, results, nest, allRunningTasks) {
	var i, name, node, e, j;
	nest = nest || [];
	allRunningTasks = allRunningTasks || collectAllRunningTasks(tasks, names);
	for (i = 0; i < names.length; i++) {
		name = names[i];
		// de-dup results
		if (results.indexOf(name) === -1) {
			node = tasks[name];
			if (nest.indexOf(name) > -1) {
				nest.push(name);
				e = new Error('Recursive dependencies detected: '+nest.join(' -> '));
				e.recursiveTasks = nest;
				e.taskList = [];
				for (j in tasks) {
					if (tasks.hasOwnProperty(j)) {
						e.taskList.push(tasks[j].name);
					}
				}
				throw e;
			}
			if (node.dep.length) {
				nest.push(name);
				sequence(tasks, node.dep, results, nest, allRunningTasks); // recurse
				nest.pop(name);
			}
			if (node.mustRunAfter && node.mustRunAfter.length) {
				nest.push(name);
				// sequence all mustRunAfter tasks that are going to be run
				sequence(tasks, node.mustRunAfter.filter(allRunningTasks.hasOwnProperty.bind(allRunningTasks)), results, nest, allRunningTasks); // recurse
				nest.pop(name);
			}
			results.push(name);
		}
	}
};

// Simply collects all tasks that need to be run as a hashmap of map[taskname] = true
var collectAllRunningTasks = function(tasks, names, allRunningTasks) {
	var i, name, node, e, j;
	allRunningTasks = allRunningTasks || {};
	for (i = 0; i < names.length; i++) {
		name = names[i];
		// de-dup results
		if (!allRunningTasks[name]) {
			node = tasks[name];
			if (!node) {
				e = new Error('task "'+name+'" is not defined');
				e.missingTask = name;
				e.taskList = [];
				for (j in tasks) {
					if (tasks.hasOwnProperty(j)) {
						e.taskList.push(tasks[j].name);
					}
				}
				throw e;
			}
			// order does not matter at this stage, so go ahead and store
			// the requested name
			allRunningTasks[name] = true;
			if (node.dep.length) {
				collectAllRunningTasks(tasks, node.dep, allRunningTasks); // recurse
			}
		}
	}
	return allRunningTasks;
};

module.exports = sequence;
