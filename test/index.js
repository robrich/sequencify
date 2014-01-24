/*jshint node:true */
/*global describe:false, it:false */

"use strict";

var sequence = require('../');
var should = require('should');
require('mocha');

describe('task sequencing', function() {
	describe('sequence()', function() {

		var dependencyTree = {
			a: [],
			b: ['a'],
			c: ['a'],
			d: ['b','c'],
			e: ['f'],
			f: ['e'],
			g: ['g'],
			i: { mustRunAfter: ['c'] },
			j: { mustRunAfter: ['a'], deps: ['i'] },
			k: { mustRunAfter: ['k']}
		};
		var noop = function () {};

		var makeTasks = function (tree) {
			var tasks = {}, p;
			for (p in tree) {
				if (tree.hasOwnProperty(p)) {
					if(Array.isArray(tree[p])) {
						tree[p] = { deps:tree[p] };
					}
					tasks[p] = {
						name: p,
						dep: tree[p].deps || [],
						mustRunAfter: tree[p].mustRunAfter,
						fn: noop
					};
				}
			}
			return tasks;
		};

		var theTest = function (source,expected) {
			// Arrange
			var tasks = makeTasks(dependencyTree);
			var actual = [];

			// Act
			sequence(tasks, source.split(','), actual);

			// Assert
			actual.join(',').should.equal(expected);
		};

		it('a -> a', function() {
			theTest('a', 'a');
		});
		it('a,a -> a', function() {
			theTest('a,a', 'a');
		});
		it('c -> a,c', function() {
			theTest('c', 'a,c');
		});
		it('b -> a,b', function() {
			theTest('b', 'a,b');
		});
		it('c,b -> a,c,b', function() {
			theTest('c,b', 'a,c,b');
		});
		it('b,c -> a,b,c', function() {
			theTest('b,c', 'a,b,c');
		});
		it('b,a -> a,b', function() {
			theTest('b,a', 'a,b');
		});
		it('d -> a,b,c,d', function() {
			theTest('d', 'a,b,c,d');
		});
		it('c,d -> a,c,b,d', function() {
			theTest('c,d', 'a,c,b,d');
		});
		it('b,d -> a,b,c,d', function() {
			theTest('b,d', 'a,b,c,d');
		});
		it('i -> i', function() {
			theTest('i', 'i');
		});
		it('j -> i,j', function() {
			theTest('j', 'i,j');
		});
		it('i,d -> a,c,i,b,d', function() {
			theTest('i,d', 'a,c,i,b,d');
		});
		it('j,a -> i,a,j', function() {
			theTest('j,a', 'i,a,j');
		});
		it('e -> throw', function() {
			var failed = false, i;
			var expectedRecursionList = ['e','f','e'];
			var expectedTaskList = ['a','b','c','d','e','f','g','i','j','k'];
			try {
				theTest('e', 'throw');
				failed = true;
			} catch (err) {
				should.exist(err);
				err.message.should.match(/recursive/i, err.message+' should include recursive');
				err.recursiveTasks.length.should.equal(expectedRecursionList.length);
				for (i = 0; i < expectedRecursionList.length; i++) {
					err.recursiveTasks[i].should.equal(expectedRecursionList[i]);
				}
				err.taskList.length.should.equal(expectedTaskList.length);
				expectedTaskList.forEach(function (item) {
					err.taskList.should.include(item);
				});
			}
			failed.should.equal(false);
		});
		it('g -> throw', function() {
			var failed = false, i;
			var expectedRecursionList = ['g','g'];
			var expectedTaskList = ['a','b','c','d','e','f','g','i','j','k'];
			try {
				theTest('g', 'throw');
				failed = true;
			} catch (err) {
				should.exist(err);
				err.message.should.match(/recursive/i, err.message+' should include recursive');
				err.recursiveTasks.length.should.equal(expectedRecursionList.length);
				for (i = 0; i < expectedRecursionList.length; i++) {
					err.recursiveTasks[i].should.equal(expectedRecursionList[i]);
				}
				err.taskList.length.should.equal(expectedTaskList.length);
				expectedTaskList.forEach(function (item) {
					err.taskList.should.include(item);
				});
			}
			failed.should.equal(false);
		});
		it('h -> throw', function() {
			var failed = false;
			var expectedTaskList = ['a','b','c','d','e','f','g','i','j','k'];
			try {
				theTest('h', 'throw');
				failed = true;
			} catch (err) {
				should.exist(err);
				err.message.should.match(/not defined/i, err.message+' should include not defined');
				err.missingTask.should.equal('h');
				err.taskList.length.should.equal(expectedTaskList.length);
				expectedTaskList.forEach(function (item) {
					err.taskList.should.include(item);
				});
			}
			failed.should.equal(false);
		});
		it('k -> throw', function() {
			var failed = false, i;
			var expectedRecursionList = ['k','k'];
			var expectedTaskList = ['a','b','c','d','e','f','g','i','j','k'];
			try {
				theTest('k', 'throw');
				failed = true;
			} catch (err) {
				should.exist(err);
				err.message.should.match(/recursive/i, err.message+' should include recursive');
				err.recursiveTasks.length.should.equal(expectedRecursionList.length);
				for (i = 0; i < expectedRecursionList.length; i++) {
					err.recursiveTasks[i].should.equal(expectedRecursionList[i]);
				}
				err.taskList.length.should.equal(expectedTaskList.length);
				expectedTaskList.forEach(function (item) {
					err.taskList.should.include(item);
				});
			}
			failed.should.equal(false);
		});

	});
});
