#!/usr/bin/env node

var util = require('util');
var spawn = require('child_process').spawn;
var events = require('events');

var NowPlaying = function () {
	this.init();
};

NowPlaying.prototype.init = function () {
	var instance = this;
	instance.playerinfo = spawn(__dirname + "/playerinfo.rb", []);
	instance.playerinfo.stdout.on("data", function (data) {
		var buff = new Buffer(data);
		var utf8string = buff.toString('utf8');
		var events = utf8string.replace(/}{/g, "}\0{").split("\0");
		events.forEach(function (eventJSON, i) {
			var eventData = JSON.parse(eventJSON);
			instance.emit(eventData.playerState.toLowerCase(), eventData);
		})

	});
	instance.playerinfo.stdout.on("end", function (data) {
		instance.init();
	});
}

NowPlaying.prototype.__proto__ = events.EventEmitter.prototype

module.exports = new NowPlaying();
