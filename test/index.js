/*global describe:false, it:false */

'use strict';

var sequencify = require('../');
require('should');
require('mocha');

describe('task sequencing', function() {
	describe('sequencify()', function() {

		var dependencyTree = {
			a: [],
			b: ['a'],
			c: ['a'],
			d: ['b','c'],
			e: ['f'],
			f: ['e'],
			g: ['g']
		};
		var noop = function () {};

		var makeTasks = function (tree) {
			var tasks = {}, p;
			for (p in tree) {
				if (tree.hasOwnProperty(p)) {
					tasks[p] = {
						name: p,
						dep: tree[p],
						fn: noop
					};
				}
			}
			return tasks;
		};

		var theTest = function (source,expected) {
			// arrange
			var tasks = makeTasks(dependencyTree);

			// act
			var actual = sequencify(tasks, source.split(','));

			// assert
			actual.sequence.join(',').should.equal(expected);
			actual.missingTasks.length.should.equal(0);
			actual.recursiveDependencies.length.should.equal(0);
		};

		var theTestError = function (source) {
			// arrange
			var tasks = makeTasks(dependencyTree);

			// act
			var actual = sequencify(tasks, source.split(','));

			// assert done by caller
			return actual;
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
		it('e -> recursive', function() {
			// arrange
			var i;
			var expectedRecursionList = ['e','f','e'];

			// act
			var actual = theTestError('e');

			// assert
			actual.recursiveDependencies.length.should.equal(1);
			actual.recursiveDependencies[0].length.should.equal(expectedRecursionList.length);
			for (i = 0; i < expectedRecursionList.length; i++) {
				actual.recursiveDependencies[0][i].should.equal(expectedRecursionList[i]);
			}
		});
		it('g -> recursive', function() {
			// arrange
			var i;
			var expectedRecursionList = ['g','g'];

			// act
			var actual = theTestError('g');

			// assert
			actual.recursiveDependencies.length.should.equal(1);
			actual.recursiveDependencies[0].length.should.equal(expectedRecursionList.length);
			for (i = 0; i < expectedRecursionList.length; i++) {
				actual.recursiveDependencies[0][i].should.equal(expectedRecursionList[i]);
			}
		});
		it('h -> missing', function() {
			// arrange

			// act
			var actual = theTestError('h');

			// assert
			actual.missingTasks.length.should.equal(1);
			actual.missingTasks[0].should.equal('h');
		});

	});
});
