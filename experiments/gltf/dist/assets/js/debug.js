/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "8aed7ad8fa191b4630e7"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 1;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(132)(__webpack_require__.s = 132);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // GLTool.js

var _glMatrix = __webpack_require__(2);

var _getAndApplyExtension = __webpack_require__(54);

var _getAndApplyExtension2 = _interopRequireDefault(_getAndApplyExtension);

var _exposeAttributes = __webpack_require__(55);

var _exposeAttributes2 = _interopRequireDefault(_exposeAttributes);

var _getFloat = __webpack_require__(56);

var _getFloat2 = _interopRequireDefault(_getFloat);

var _getHalfFloat = __webpack_require__(57);

var _getHalfFloat2 = _interopRequireDefault(_getHalfFloat);

var _getAttribLoc = __webpack_require__(33);

var _getAttribLoc2 = _interopRequireDefault(_getAttribLoc);

var _ExtensionsList = __webpack_require__(58);

var _ExtensionsList2 = _interopRequireDefault(_ExtensionsList);

var _Geometry = __webpack_require__(3);

var _Geometry2 = _interopRequireDefault(_Geometry);

var _Mesh = __webpack_require__(13);

var _Mesh2 = _interopRequireDefault(_Mesh);

var _Object3D = __webpack_require__(8);

var _Object3D2 = _interopRequireDefault(_Object3D);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gl = void 0;

var GLTool = function () {
	function GLTool() {
		_classCallCheck(this, GLTool);

		this.canvas;
		this._viewport = [0, 0, 0, 0];
		this._enabledVertexAttribute = [];
		this.identityMatrix = _glMatrix.mat4.create();
		this._normalMatrix = _glMatrix.mat3.create();
		this._inverseModelViewMatrix = _glMatrix.mat3.create();
		this._modelMatrix = _glMatrix.mat4.create();
		this._matrix = _glMatrix.mat4.create();
		this._matrixStacks = [];
		this._lastMesh = null;
		this._useWebGL2 = false;
		this._hasArrayInstance;
		this._extArrayInstance;
		this._hasCheckedExt = false;
		_glMatrix.mat4.identity(this.identityMatrix, this.identityMatrix);

		this.isMobile = false;
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			this.isMobile = true;
		}
	}

	//	INITIALIZE

	_createClass(GLTool, [{
		key: 'init',
		value: function init(mCanvas) {
			var mParameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


			if (mCanvas === null || mCanvas === undefined) {
				console.error('Canvas not exist');
				return;
			}

			if (this.canvas !== undefined && this.canvas !== null) {
				this.destroy();
			}

			this.canvas = mCanvas;
			this.setSize(window.innerWidth, window.innerHeight);

			mParameters.useWebgl2 = mParameters.useWebgl2 || false;

			var ctx = void 0;
			if (mParameters.useWebgl2) {
				ctx = this.canvas.getContext('experimental-webgl2', mParameters) || this.canvas.getContext('webgl2', mParameters);

				if (!ctx) {
					ctx = this.canvas.getContext('webgl', mParameters) || this.canvas.getContext('experimental-webgl', mParameters);
					this._useWebGL2 = false;
				} else {
					this._useWebGL2 = true;
				}
			} else {
				// ctx = this.canvas.getContext('experimental-webgl2', mParameters) || this.canvas.getContext('webgl2', mParameters);
				// if(ctx) {
				// 	this._useWebGL2 = true;
				// } else {
				// 	ctx = this.canvas.getContext('webgl', mParameters) || this.canvas.getContext('experimental-webgl', mParameters);
				// }

				ctx = this.canvas.getContext('webgl', mParameters) || this.canvas.getContext('experimental-webgl', mParameters);
				this._useWebGL2 = false;
			}

			console.log('Using WebGL 2 ?', this.webgl2);

			//	extensions
			this.initWithGL(ctx);
		}
	}, {
		key: 'initWithGL',
		value: function initWithGL(ctx) {
			if (!this.canvas) {
				this.canvas = ctx.canvas;
			}
			gl = this.gl = ctx;

			this.extensions = {};
			for (var i = 0; i < _ExtensionsList2.default.length; i++) {
				this.extensions[_ExtensionsList2.default[i]] = gl.getExtension(_ExtensionsList2.default[i]);
			}

			//	Copy gl Attributes
			(0, _exposeAttributes2.default)();
			(0, _getAndApplyExtension2.default)(gl, 'OES_vertex_array_object');
			(0, _getAndApplyExtension2.default)(gl, 'ANGLE_instanced_arrays');
			(0, _getAndApplyExtension2.default)(gl, 'WEBGL_draw_buffers');

			this.enable(this.DEPTH_TEST);
			this.enable(this.CULL_FACE);
			this.enable(this.BLEND);
			this.enableAlphaBlending();
		}

		//	PUBLIC METHODS

	}, {
		key: 'setViewport',
		value: function setViewport(x, y, w, h) {
			var hasChanged = false;
			if (x !== this._viewport[0]) {
				hasChanged = true;
			}
			if (y !== this._viewport[1]) {
				hasChanged = true;
			}
			if (w !== this._viewport[2]) {
				hasChanged = true;
			}
			if (h !== this._viewport[3]) {
				hasChanged = true;
			}

			if (hasChanged) {
				gl.viewport(x, y, w, h);
				this._viewport = [x, y, w, h];
			}
		}
	}, {
		key: 'scissor',
		value: function scissor(x, y, w, h) {
			gl.scissor(x, y, w, h);
		}
	}, {
		key: 'clear',
		value: function clear(r, g, b, a) {
			gl.clearColor(r, g, b, a);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		}
	}, {
		key: 'cullFace',
		value: function cullFace(mValue) {
			gl.cullFace(mValue);
		}
	}, {
		key: 'setMatrices',
		value: function setMatrices(mCamera) {
			this.camera = mCamera;
			this.rotate(this.identityMatrix);
		}
	}, {
		key: 'useShader',
		value: function useShader(mShader) {
			this.shader = mShader;
			this.shaderProgram = this.shader.shaderProgram;
		}
	}, {
		key: 'rotate',
		value: function rotate(mRotation) {
			_glMatrix.mat4.copy(this._modelMatrix, mRotation);
			_glMatrix.mat4.multiply(this._matrix, this.camera.matrix, this._modelMatrix);
			_glMatrix.mat3.fromMat4(this._normalMatrix, this._matrix);
			_glMatrix.mat3.invert(this._normalMatrix, this._normalMatrix);
			_glMatrix.mat3.transpose(this._normalMatrix, this._normalMatrix);

			_glMatrix.mat3.fromMat4(this._inverseModelViewMatrix, this._matrix);
			_glMatrix.mat3.invert(this._inverseModelViewMatrix, this._inverseModelViewMatrix);
		}
	}, {
		key: 'drawGeometry',
		value: function drawGeometry(mGeometry, modelMatrix) {
			if (mGeometry.length) {
				for (var i = 0; i < mGeometry.length; i++) {
					this.draw(mGeometry[i]);
				}
				return;
			}

			mGeometry.bind(this.shaderProgram);

			//	DEFAULT UNIFORMS
			if (this.camera !== undefined) {
				this.shader.uniform('uProjectionMatrix', 'mat4', this.camera.projection);
				this.shader.uniform('uViewMatrix', 'mat4', this.camera.matrix);
			}

			this.shader.uniform('uCameraPos', 'vec3', this.camera.position);
			this.shader.uniform('uModelMatrix', 'mat4', modelMatrix || this._modelMatrix);
			this.shader.uniform('uNormalMatrix', 'mat3', this._normalMatrix);
			this.shader.uniform('uModelViewMatrixInverse', 'mat3', this._inverseModelViewMatrix);

			var drawType = mGeometry.drawType;

			if (mGeometry.isInstanced) {
				gl.drawElementsInstanced(mGeometry.drawType, mGeometry.iBuffer.numItems, gl.UNSIGNED_SHORT, 0, mGeometry.numInstance);
			} else {
				if (drawType === gl.POINTS) {
					gl.drawArrays(drawType, 0, mGeometry.vertexSize);
				} else {
					gl.drawElements(drawType, mGeometry.iBuffer.numItems, gl.UNSIGNED_SHORT, 0);
				}
			}

			mGeometry.unbind();
		}
	}, {
		key: 'drawMesh',
		value: function drawMesh(mMesh) {
			var material = mMesh.material,
			    geometry = mMesh.geometry;


			if (material.doubleSided) {
				this.disable(GL.CULL_FACE);
			} else {
				this.enable(GL.CULL_FACE);
			}

			material.update();
			this.drawGeometry(geometry, mMesh.matrix);
		}
	}, {
		key: 'draw',
		value: function draw(mObj) {
			var _this = this;

			if (mObj instanceof _Geometry2.default) {
				this.drawGeometry(mObj);
			} else if (mObj instanceof _Mesh2.default) {
				this.drawMesh(mObj);
			} else if (mObj instanceof _Object3D2.default) {
				// console.log('here');
				mObj.updateMatrix();
				mObj.children.forEach(function (child) {
					_this.draw(child);
				});
			}
		}
	}, {
		key: 'drawTransformFeedback',
		value: function drawTransformFeedback(mTransformObject) {
			var meshSource = mTransformObject.meshSource,
			    meshDestination = mTransformObject.meshDestination,
			    numPoints = mTransformObject.numPoints,
			    transformFeedback = mTransformObject.transformFeedback;

			//	BIND SOURCE BUFFERS -> setupVertexAttr(sourceVAO)

			meshSource.bind(this.shaderProgram);
			meshDestination.generateBuffers(this.shaderProgram);

			//	BIND DESTINATION BUFFERS
			gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback);

			meshDestination.attributes.forEach(function (attr, i) {
				gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, i, attr.buffer);
			});

			gl.enable(gl.RASTERIZER_DISCARD);

			gl.beginTransformFeedback(gl.POINTS);
			gl.drawArrays(gl.POINTS, 0, numPoints);
			gl.endTransformFeedback();

			//	reset state
			gl.disable(gl.RASTERIZER_DISCARD);
			gl.useProgram(null);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
			meshDestination.attributes.forEach(function (attr, i) {
				gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, i, null);
			});
			gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

			meshSource.unbind();
		}
	}, {
		key: 'setSize',
		value: function setSize(mWidth, mHeight) {
			this._width = mWidth;
			this._height = mHeight;
			this.canvas.width = this._width;
			this.canvas.height = this._height;
			this._aspectRatio = this._width / this._height;

			if (gl) {
				this.viewport(0, 0, this._width, this._height);
			}
		}
	}, {
		key: 'showExtensions',
		value: function showExtensions() {
			console.log('Extensions : ', this.extensions);
			for (var ext in this.extensions) {
				if (this.extensions[ext]) {
					console.log(ext, ':', this.extensions[ext]);
				}
			}
		}
	}, {
		key: 'checkExtension',
		value: function checkExtension(mExtension) {
			return !!this.extensions[mExtension];
		}
	}, {
		key: 'getExtension',
		value: function getExtension(mExtension) {
			return this.extensions[mExtension];
		}

		//	BLEND MODES

	}, {
		key: 'enableAlphaBlending',
		value: function enableAlphaBlending() {
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		}
	}, {
		key: 'enableAdditiveBlending',
		value: function enableAdditiveBlending() {
			gl.blendFunc(gl.ONE, gl.ONE);
		}

		//	matrices

	}, {
		key: 'pushMatrix',
		value: function pushMatrix() {
			var mtx = _glMatrix.mat4.clone(this._modelMatrix);
			this._matrixStacks.push(mtx);
		}
	}, {
		key: 'popMatrix',
		value: function popMatrix() {
			if (this._matrixStacks.length == 0) {
				return null;
			}
			var mtx = this._matrixStacks.pop();
			this.rotate(mtx);
		}

		//	GL NATIVE FUNCTIONS

	}, {
		key: 'enable',
		value: function enable(mParameter) {
			gl.enable(mParameter);
		}
	}, {
		key: 'disable',
		value: function disable(mParameter) {
			gl.disable(mParameter);
		}
	}, {
		key: 'viewport',
		value: function viewport(x, y, w, h) {
			this.setViewport(x, y, w, h);
		}

		//	GETTER AND SETTERS

	}, {
		key: 'destroy',


		//	DESTROY

		value: function destroy() {

			if (this.canvas.parentNode) {
				try {
					this.canvas.parentNode.removeChild(this.canvas);
				} catch (e) {
					console.log('Error : ', e);
				}
			}

			this.canvas = null;
		}
	}, {
		key: 'FLOAT',
		get: function get() {
			return (0, _getFloat2.default)();
		}
	}, {
		key: 'HALF_FLOAT',
		get: function get() {
			return (0, _getHalfFloat2.default)();
		}
	}, {
		key: 'width',
		get: function get() {
			return this._width;
		}
	}, {
		key: 'height',
		get: function get() {
			return this._height;
		}
	}, {
		key: 'aspectRatio',
		get: function get() {
			return this._aspectRatio;
		}
	}, {
		key: 'webgl2',
		get: function get() {
			return this._useWebGL2;
		}
	}]);

	return GLTool;
}();

var GL = new GLTool();

exports.default = GL;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// GLShader.js



Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _GLTexture = __webpack_require__(9);

var _GLTexture2 = _interopRequireDefault(_GLTexture);

var _GLCubeTexture = __webpack_require__(14);

var _GLCubeTexture2 = _interopRequireDefault(_GLCubeTexture);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var glslify = __webpack_require__(61);
var isSame = function isSame(array1, array2) {
	if (array1.length !== array2.length) {
		return false;
	}

	for (var i = 0; i < array1.length; i++) {
		if (array1[i] !== array2[i]) {
			return false;
		}
	}

	return true;
};

var addLineNumbers = function addLineNumbers(string) {
	var lines = string.split('\n');
	for (var i = 0; i < lines.length; i++) {
		lines[i] = i + 1 + ': ' + lines[i];
	}
	return lines.join('\n');
};

var cloneArray = function cloneArray(mArray) {
	if (mArray.slice) {
		return mArray.slice(0);
	} else {
		return new Float32Array(mArray);
	}
};

var gl = void 0;
var defaultVertexShader = __webpack_require__(15);
var defaultFragmentShader = __webpack_require__(62);

var uniformMapping = {
	float: 'uniform1f',
	vec2: 'uniform2fv',
	vec3: 'uniform3fv',
	vec4: 'uniform4fv',
	int: 'uniform1i',
	mat3: 'uniformMatrix3fv',
	mat4: 'uniformMatrix4fv'
};

var GLShader = function () {
	function GLShader() {
		var strVertexShader = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultVertexShader;
		var strFragmentShader = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultFragmentShader;
		var mVaryings = arguments[2];

		_classCallCheck(this, GLShader);

		gl = _GLTool2.default.gl;
		this.parameters = [];
		this._uniformTextures = [];
		this._varyings = mVaryings;

		if (!strVertexShader) {
			strVertexShader = defaultVertexShader;
		}
		if (!strFragmentShader) {
			strFragmentShader = defaultVertexShader;
		}

		var vsShader = this._createShaderProgram(strVertexShader, true);
		var fsShader = this._createShaderProgram(strFragmentShader, false);
		this._attachShaderProgram(vsShader, fsShader);
	}

	_createClass(GLShader, [{
		key: 'bind',
		value: function bind() {

			if (_GLTool2.default.shader === this) {
				return;
			}
			gl.useProgram(this.shaderProgram);
			_GLTool2.default.useShader(this);
			// this.uniformTextures = [];
		}
	}, {
		key: 'uniform',
		value: function uniform(mName, mType, mValue) {
			if ((typeof mName === 'undefined' ? 'undefined' : _typeof(mName)) === 'object') {
				this.uniformObject(mName);
				return;
			}
			/*
   if(!!mValue === undefined || mValue === null) {
   	console.warn('mValue Error:', mName);
   	return;
   }
   */
			var uniformType = uniformMapping[mType] || mType;

			var hasUniform = false;
			var oUniform = void 0;
			var parameterIndex = -1;

			for (var i = 0; i < this.parameters.length; i++) {
				oUniform = this.parameters[i];
				if (oUniform.name === mName) {
					hasUniform = true;
					parameterIndex = i;
					break;
				}
			}

			var isNumber = false;

			if (!hasUniform) {
				isNumber = uniformType === 'uniform1i' || uniformType === 'uniform1f';
				this.shaderProgram[mName] = gl.getUniformLocation(this.shaderProgram, mName);
				if (isNumber) {
					this.parameters.push({ name: mName, type: uniformType, value: mValue, uniformLoc: this.shaderProgram[mName], isNumber: isNumber });
				} else {
					this.parameters.push({ name: mName, type: uniformType, value: cloneArray(mValue), uniformLoc: this.shaderProgram[mName], isNumber: isNumber });
				}

				parameterIndex = this.parameters.length - 1;
			} else {
				this.shaderProgram[mName] = oUniform.uniformLoc;
				isNumber = oUniform.isNumber;
			}

			if (!this.parameters[parameterIndex].uniformLoc) {
				return;
			}

			if (uniformType.indexOf('Matrix') === -1) {
				if (!isNumber) {
					if (!isSame(this.parameters[parameterIndex].value, mValue) || !hasUniform) {
						gl[uniformType](this.shaderProgram[mName], mValue);
						this.parameters[parameterIndex].value = cloneArray(mValue);
					}
				} else {
					var needUpdate = this.parameters[parameterIndex].value !== mValue || !hasUniform;
					if (needUpdate) {
						gl[uniformType](this.shaderProgram[mName], mValue);
						this.parameters[parameterIndex].value = mValue;
					}
				}
			} else {
				if (!isSame(this.parameters[parameterIndex].value, mValue) || !hasUniform) {
					gl[uniformType](this.shaderProgram[mName], false, mValue);
					this.parameters[parameterIndex].value = cloneArray(mValue);
				}
			}
		}
	}, {
		key: 'uniformObject',
		value: function uniformObject(mUniformObj) {
			var _this = this;

			var _loop = function _loop(uniformName) {

				if (mUniformObj[uniformName] instanceof _GLTexture2.default || mUniformObj[uniformName] instanceof _GLCubeTexture2.default) {
					var texture = mUniformObj[uniformName];

					var textureIndex = -1;;
					_this._uniformTextures.forEach(function (ut, i) {
						if (ut.name === uniformName) {
							textureIndex = i;
							ut.texture = texture;
						}
					});

					if (textureIndex === -1) {
						textureIndex = _this._uniformTextures.length;
						_this._uniformTextures.push({
							name: uniformName,
							texture: texture
						});
					}

					_this.uniform(uniformName, 'uniform1i', textureIndex);
					texture.bind(textureIndex);
				} else {
					var uniformValue = mUniformObj[uniformName];
					var uniformType = GLShader.getUniformType(uniformValue);

					if (uniformValue.concat && uniformValue[0].concat) {
						var tmp = [];
						for (var i = 0; i < uniformValue.length; i++) {
							tmp = tmp.concat(uniformValue[i]);
						}
						uniformValue = tmp;
					}

					_this.uniform(uniformName, uniformType, uniformValue);
				}
			};

			for (var uniformName in mUniformObj) {
				_loop(uniformName);
			}
		}
	}, {
		key: '_createShaderProgram',
		value: function _createShaderProgram(mShaderStr, isVertexShader) {

			var shaderType = isVertexShader ? _GLTool2.default.VERTEX_SHADER : _GLTool2.default.FRAGMENT_SHADER;
			var shader = gl.createShader(shaderType);

			gl.shaderSource(shader, mShaderStr);
			gl.compileShader(shader);

			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				console.warn('Error in Shader : ', gl.getShaderInfoLog(shader));
				console.log(addLineNumbers(mShaderStr));
				return null;
			}

			return shader;
		}
	}, {
		key: '_attachShaderProgram',
		value: function _attachShaderProgram(mVertexShader, mFragmentShader) {

			this.shaderProgram = gl.createProgram();
			gl.attachShader(this.shaderProgram, mVertexShader);
			gl.attachShader(this.shaderProgram, mFragmentShader);

			gl.deleteShader(mVertexShader);
			gl.deleteShader(mFragmentShader);

			if (this._varyings) {
				console.log('Transform feedback setup : ', this._varyings);
				gl.transformFeedbackVaryings(this.shaderProgram, this._varyings, gl.SEPARATE_ATTRIBS);
			}

			gl.linkProgram(this.shaderProgram);
		}
	}]);

	return GLShader;
}();

GLShader.getUniformType = function (mValue) {
	var isArray = !!mValue.concat;

	var getArrayUniformType = function getArrayUniformType(mValue) {
		if (mValue.length === 9) {
			return 'uniformMatrix3fv';
		} else if (mValue.length === 16) {
			return 'uniformMatrix4fv';
		} else {
			return 'vec' + mValue.length;
		}
	};

	if (!isArray) {
		return 'float';
	} else {
		if (!mValue[0].concat) {
			return getArrayUniformType(mValue);
		} else {
			return getArrayUniformType(mValue[0]);
		}
	}
};

exports.default = GLShader;

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gl_matrix_common__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__gl_matrix_mat2__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__gl_matrix_mat2d__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__gl_matrix_mat3__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__gl_matrix_mat4__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__gl_matrix_quat__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__gl_matrix_vec2__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__gl_matrix_vec3__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__gl_matrix_vec4__ = __webpack_require__(31);
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "glMatrix", function() { return __WEBPACK_IMPORTED_MODULE_0__gl_matrix_common__; });
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "mat2", function() { return __WEBPACK_IMPORTED_MODULE_1__gl_matrix_mat2__; });
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "mat2d", function() { return __WEBPACK_IMPORTED_MODULE_2__gl_matrix_mat2d__; });
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "mat3", function() { return __WEBPACK_IMPORTED_MODULE_3__gl_matrix_mat3__; });
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "mat4", function() { return __WEBPACK_IMPORTED_MODULE_4__gl_matrix_mat4__; });
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "quat", function() { return __WEBPACK_IMPORTED_MODULE_5__gl_matrix_quat__; });
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "vec2", function() { return __WEBPACK_IMPORTED_MODULE_6__gl_matrix_vec2__; });
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "vec3", function() { return __WEBPACK_IMPORTED_MODULE_7__gl_matrix_vec3__; });
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "vec4", function() { return __WEBPACK_IMPORTED_MODULE_8__gl_matrix_vec4__; });
/**
 * @fileoverview gl-matrix - High performance matrix and vector operations
 * @author Brandon Jones
 * @author Colin MacKenzie IV
 * @version 2.4.0
 */

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */
// END HEADER













/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _glMatrix = __webpack_require__(2);

var _getAttribLoc = __webpack_require__(33);

var _getAttribLoc2 = _interopRequireDefault(_getAttribLoc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gl = void 0;
var STATIC_DRAW = 35044;

var getBuffer = function getBuffer(attr) {
	var buffer = void 0;

	if (attr.buffer !== undefined) {
		buffer = attr.buffer;
	} else {
		buffer = gl.createBuffer();
		attr.buffer = buffer;
	}

	return buffer;
};

var formBuffer = function formBuffer(mData, mNum) {
	var ary = [];

	for (var i = 0; i < mData.length; i += mNum) {
		var o = [];
		for (var j = 0; j < mNum; j++) {
			o.push(mData[i + j]);
		}

		ary.push(o);
	}

	return ary;
};

var Geometry = function () {
	function Geometry() {
		var mDrawingType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;
		var mUseVao = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

		_classCallCheck(this, Geometry);

		gl = _GLTool2.default.gl;
		this.drawType = mDrawingType;
		this._attributes = [];
		this._numInstance = -1;
		this._enabledVertexAttribute = [];

		this._indices = [];
		this._faces = [];
		this._bufferChanged = [];
		this._hasIndexBufferChanged = false;
		this._hasVAO = false;
		this._isInstanced = false;

		this._extVAO = !!_GLTool2.default.gl.createVertexArray;
		this._useVAO = !!this._extVAO && mUseVao;
		// this._useVAO = false;
	}

	_createClass(Geometry, [{
		key: 'bufferVertex',
		value: function bufferVertex(mArrayVertices) {
			var mDrawType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : STATIC_DRAW;


			this.bufferData(mArrayVertices, 'aVertexPosition', 3, mDrawType);

			if (this.normals.length < this.vertices.length) {
				this.bufferNormal(mArrayVertices, mDrawType);
			}

			return this;
		}
	}, {
		key: 'bufferTexCoord',
		value: function bufferTexCoord(mArrayTexCoords) {
			var mDrawType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : STATIC_DRAW;


			this.bufferData(mArrayTexCoords, 'aTextureCoord', 2, mDrawType);
			return this;
		}
	}, {
		key: 'bufferNormal',
		value: function bufferNormal(mNormals) {
			var mDrawType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : STATIC_DRAW;


			this.bufferData(mNormals, 'aNormal', 3, mDrawType);
			return this;
		}
	}, {
		key: 'bufferIndex',
		value: function bufferIndex(mArrayIndices) {
			var isDynamic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			this._drawType = isDynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;
			if (mArrayIndices instanceof Array) {
				this._indices = new Uint16Array(mArrayIndices);
			} else {
				this._indices = mArrayIndices;
			}

			this._numItems = this._indices.length;
			return this;
		}
	}, {
		key: 'bufferFlattenData',
		value: function bufferFlattenData(mData, mName, mItemSize) {
			var mDrawType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : STATIC_DRAW;
			var isInstanced = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;


			var data = formBuffer(mData, mItemSize);
			this.bufferData(data, mName, mItemSize, mDrawType = STATIC_DRAW, isInstanced = false);
			return this;
		}
	}, {
		key: 'bufferData',
		value: function bufferData(mData, mName, mItemSize) {
			var mDrawType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : STATIC_DRAW;
			var isInstanced = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

			var i = 0;
			var drawType = mDrawType;
			if (!drawType) debugger;

			var bufferData = [];
			if (!mItemSize) {
				mItemSize = mData[0].length;
			}
			this._isInstanced = isInstanced || this._isInstanced;

			//	flatten buffer data		
			for (i = 0; i < mData.length; i++) {
				for (var j = 0; j < mData[i].length; j++) {
					bufferData.push(mData[i][j]);
				}
			}
			var dataArray = new Float32Array(bufferData);
			var attribute = this.getAttribute(mName);

			if (attribute) {
				//	attribute existed, replace with new data
				attribute.itemSize = mItemSize;
				attribute.dataArray = dataArray;
				attribute.source = mData;
			} else {
				//	attribute not exist yet, create new attribute object
				this._attributes.push({ name: mName, source: mData, itemSize: mItemSize, drawType: drawType, dataArray: dataArray, isInstanced: isInstanced });
			}

			this._bufferChanged.push(mName);
			return this;
		}
	}, {
		key: 'bufferInstance',
		value: function bufferInstance(mData, mName) {
			if (!_GLTool2.default.gl.vertexAttribDivisor) {
				console.error('Extension : ANGLE_instanced_arrays is not supported with this device !');
				return;
			}

			var itemSize = mData[0].length;
			this._numInstance = mData.length;
			this.bufferData(mData, mName, itemSize, STATIC_DRAW, true);
		}
	}, {
		key: 'bind',
		value: function bind(mShaderProgram) {
			this.generateBuffers(mShaderProgram);

			if (this.hasVAO) {
				gl.bindVertexArray(this.vao);
			} else {
				this.attributes.forEach(function (attribute) {
					gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer);
					var attrPosition = attribute.attrPosition;
					gl.vertexAttribPointer(attrPosition, attribute.itemSize, gl.FLOAT, false, 0, 0);

					if (attribute.isInstanced) {
						gl.vertexAttribDivisor(attrPosition, 1);
					}
				});

				//	BIND INDEX BUFFER
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
			}
		}
	}, {
		key: 'generateBuffers',
		value: function generateBuffers(mShaderProgram) {
			var _this = this;

			if (this._bufferChanged.length == 0) {
				return;
			}

			if (this._useVAO) {
				//	IF SUPPORTED, CREATE VAO

				//	CREATE & BIND VAO
				if (!this._vao) {
					this._vao = gl.createVertexArray();
				}

				gl.bindVertexArray(this._vao);

				//	UPDATE BUFFERS
				this._attributes.forEach(function (attrObj) {

					if (_this._bufferChanged.indexOf(attrObj.name) !== -1) {
						var buffer = getBuffer(attrObj);
						gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
						gl.bufferData(gl.ARRAY_BUFFER, attrObj.dataArray, attrObj.drawType);

						var attrPosition = (0, _getAttribLoc2.default)(gl, mShaderProgram, attrObj.name);
						gl.enableVertexAttribArray(attrPosition);
						gl.vertexAttribPointer(attrPosition, attrObj.itemSize, gl.FLOAT, false, 0, 0);
						attrObj.attrPosition = attrPosition;

						if (attrObj.isInstanced) {
							gl.vertexAttribDivisor(attrPosition, 1);
						}
					}
				});

				//	check index buffer
				this._updateIndexBuffer();

				//	UNBIND VAO
				gl.bindVertexArray(null);

				this._hasVAO = true;
			} else {
				//	ELSE, USE TRADITIONAL METHOD

				this._attributes.forEach(function (attrObj) {
					//	SKIP IF BUFFER HASN'T CHANGED
					if (_this._bufferChanged.indexOf(attrObj.name) !== -1) {
						var buffer = getBuffer(attrObj);
						gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
						gl.bufferData(gl.ARRAY_BUFFER, attrObj.dataArray, attrObj.drawType);

						var attrPosition = (0, _getAttribLoc2.default)(gl, mShaderProgram, attrObj.name);
						gl.enableVertexAttribArray(attrPosition);
						gl.vertexAttribPointer(attrPosition, attrObj.itemSize, gl.FLOAT, false, 0, 0);
						attrObj.attrPosition = attrPosition;

						if (attrObj.isInstanced) {
							gl.vertexAttribDivisor(attrPosition, 1);
						}
					}
				});

				this._updateIndexBuffer();
			}

			this._hasIndexBufferChanged = false;
			this._bufferChanged = [];
		}
	}, {
		key: 'unbind',
		value: function unbind() {
			if (this._useVAO) {
				gl.bindVertexArray(null);
			}

			this._attributes.forEach(function (attribute) {
				if (attribute.isInstanced) {
					gl.vertexAttribDivisor(attribute.attrPosition, 0);
				}
			});
		}
	}, {
		key: '_updateIndexBuffer',
		value: function _updateIndexBuffer() {
			if (!this._hasIndexBufferChanged) {
				if (!this.iBuffer) {
					this.iBuffer = gl.createBuffer();
				}
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._indices, this._drawType);
				this.iBuffer.itemSize = 1;
				this.iBuffer.numItems = this._numItems;
			}
		}
	}, {
		key: 'computeNormals',
		value: function computeNormals() {
			var usingFaceNormals = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;


			this.generateFaces();

			if (usingFaceNormals) {
				this._computeFaceNormals();
			} else {
				this._computeVertexNormals();
			}
		}

		//	PRIVATE METHODS

	}, {
		key: '_computeFaceNormals',
		value: function _computeFaceNormals() {

			var faceIndex = void 0;
			var face = void 0;
			var normals = [];

			for (var i = 0; i < this._indices.length; i += 3) {
				faceIndex = i / 3;
				face = this._faces[faceIndex];
				var N = face.normal;

				normals[face.indices[0]] = N;
				normals[face.indices[1]] = N;
				normals[face.indices[2]] = N;
			}

			this.bufferNormal(normals);
		}
	}, {
		key: '_computeVertexNormals',
		value: function _computeVertexNormals() {
			//	loop through all vertices
			var face = void 0;
			var sumNormal = _glMatrix.vec3.create();
			var normals = [];
			var vertices = this.vertices;


			for (var i = 0; i < vertices.length; i++) {

				_glMatrix.vec3.set(sumNormal, 0, 0, 0);

				for (var j = 0; j < this._faces.length; j++) {
					face = this._faces[j];

					//	if vertex exist in the face, add the normal to sum normal
					if (face.indices.indexOf(i) >= 0) {

						sumNormal[0] += face.normal[0];
						sumNormal[1] += face.normal[1];
						sumNormal[2] += face.normal[2];
					}
				}

				_glMatrix.vec3.normalize(sumNormal, sumNormal);
				normals.push([sumNormal[0], sumNormal[1], sumNormal[2]]);
			}

			this.bufferNormal(normals);
		}
	}, {
		key: 'generateFaces',
		value: function generateFaces() {
			var ia = void 0,
			    ib = void 0,
			    ic = void 0;
			var a = void 0,
			    b = void 0,
			    c = void 0;
			var vba = _glMatrix.vec3.create(),
			    vca = _glMatrix.vec3.create(),
			    vNormal = _glMatrix.vec3.create();
			var vertices = this.vertices;


			for (var i = 0; i < this._indices.length; i += 3) {

				ia = this._indices[i];
				ib = this._indices[i + 1];
				ic = this._indices[i + 2];

				a = vertices[ia];
				b = vertices[ib];
				c = vertices[ic];

				var face = {
					indices: [ia, ib, ic],
					vertices: [a, b, c]
				};

				this._faces.push(face);
			}
		}
	}, {
		key: 'getAttribute',
		value: function getAttribute(mName) {
			return this._attributes.find(function (a) {
				return a.name === mName;
			});
		}
	}, {
		key: 'getSource',
		value: function getSource(mName) {
			var attr = this.getAttribute(mName);
			return attr ? attr.source : [];
		}

		//	GETTER AND SETTERS

	}, {
		key: 'vertices',
		get: function get() {
			return this.getSource('aVertexPosition');
		}
	}, {
		key: 'normals',
		get: function get() {
			return this.getSource('aNormal');
		}
	}, {
		key: 'coords',
		get: function get() {
			return this.getSource('aTextureCoord');
		}
	}, {
		key: 'indices',
		get: function get() {
			return this._indices;
		}
	}, {
		key: 'vertexSize',
		get: function get() {
			return this.vertices.length;
		}
	}, {
		key: 'faces',
		get: function get() {
			return this._faces;
		}
	}, {
		key: 'attributes',
		get: function get() {
			return this._attributes;
		}
	}, {
		key: 'hasVAO',
		get: function get() {
			return this._hasVAO;
		}
	}, {
		key: 'vao',
		get: function get() {
			return this._vao;
		}
	}, {
		key: 'numInstance',
		get: function get() {
			return this._numInstance;
		}
	}, {
		key: 'isInstanced',
		get: function get() {
			return this._isInstanced;
		}
	}]);

	return Geometry;
}();

exports.default = Geometry;

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ARRAY_TYPE", function() { return ARRAY_TYPE; });
/* harmony export (immutable) */ __webpack_exports__["setMatrixArrayType"] = setMatrixArrayType;
/* harmony export (immutable) */ __webpack_exports__["toRadian"] = toRadian;
/* harmony export (immutable) */ __webpack_exports__["equals"] = equals;
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

/**
 * Common utilities
 * @module glMatrix
 */

// Configuration Constants
const EPSILON = 0.000001;
/* harmony export (immutable) */ __webpack_exports__["EPSILON"] = EPSILON;

let ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
const RANDOM = Math.random;
/* harmony export (immutable) */ __webpack_exports__["RANDOM"] = RANDOM;


/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */
function setMatrixArrayType(type) {
  ARRAY_TYPE = type;
}

const degree = Math.PI / 180;

/**
 * Convert Degree To Radian
 *
 * @param {Number} a Angle in Degrees
 */
function toRadian(a) {
  return a * degree;
}

/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 *
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */
function equals(a, b) {
  return Math.abs(a - b) <= EPSILON*Math.max(1.0, Math.abs(a), Math.abs(b));
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Batch.js

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Batch = function () {
	function Batch(mGeometry, mShader) {
		_classCallCheck(this, Batch);

		this._geometry = mGeometry;
		this._shader = mShader;
	}

	//	PUBLIC METHODS

	_createClass(Batch, [{
		key: 'draw',
		value: function draw() {
			this._shader.bind();
			_GLTool2.default.draw(this._geometry);
		}

		//	GETTER AND SETTER

	}, {
		key: 'geometry',
		get: function get() {
			return this._geometry;
		}
	}, {
		key: 'shader',
		get: function get() {
			return this._shader;
		}
	}]);

	return Batch;
}();

exports.default = Batch;

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
// Scheduler.js


class Scheduler {

	constructor() {
		this._delayTasks = [];
		this._nextTasks = [];
		this._deferTasks = [];
		this._highTasks = [];
		this._usurpTask = [];
		this._enterframeTasks = [];
		this._idTable = 0;
		this.frameRate = 60;
		this._startTime = new Date().getTime();

		this._deltaTime = 0;

		this._loop();
	}


	//  PUBLIC METHODS

	addEF(func, params) {
		params = params || [];
		const id = this._idTable;
		this._enterframeTasks[id] = { func, params };
		this._idTable ++;
		return id;
	}

	removeEF(id) {
		if (this._enterframeTasks[id] !== undefined) {
			this._enterframeTasks[id] = null;
		}
		return -1;
	}

	delay(func, params, delay) {
		const time = new Date().getTime();
		const t = { func, params, delay, time };
		this._delayTasks.push(t);
	}

	defer(func, params) {
		const t = { func, params };
		this._deferTasks.push(t);
	}

	next(func, params) {
		const t = { func, params };
		this._nextTasks.push(t);
	}

	usurp(func, params) {
		const t = { func, params };
		this._usurpTask.push(t);
	}


	//  PRIVATE METHODS

	_process() {
		let i = 0;
		let task;
		let interval;
		let current;
		for (i = 0; i < this._enterframeTasks.length; i++) {
			task = this._enterframeTasks[i];
			if (task !== null && task !== undefined) {
				task.func(task.params);
			}
		}

		while (this._highTasks.length > 0) {
			task = this._highTasks.pop();
			task.func(task.params);
		}


		let startTime = new Date().getTime();
		this._deltaTime = (startTime - this._startTime)/1000;

		for (i = 0; i < this._delayTasks.length; i++) {
			task = this._delayTasks[i];
			if (startTime - task.time > task.delay) {
				task.func(task.params);
				this._delayTasks.splice(i, 1);
			}
		}

		startTime = new Date().getTime();
		this._deltaTime = (startTime - this._startTime)/1000;
		interval = 1000 / this.frameRate;
		while (this._deferTasks.length > 0) {
			task = this._deferTasks.shift();
			current = new Date().getTime();
			if (current - startTime < interval) {
				task.func(task.params);
			} else {
				this._deferTasks.unshift(task);
				break;
			}
		}


		startTime = new Date().getTime();
		this._deltaTime = (startTime - this._startTime)/1000;
		interval = 1000 / this.frameRate;
		while (this._usurpTask.length > 0) {
			task = this._usurpTask.shift();
			current = new Date().getTime();
			if (current - startTime < interval) {
				task.func(task.params);
			}
		}

		this._highTasks = this._highTasks.concat(this._nextTasks);
		this._nextTasks = [];
		this._usurpTask = [];
	}


	_loop() {
		this._process();
		window.requestAnimationFrame(() => this._loop());
	}

	get deltaTime() {
		return this._deltaTime;
	}
}

const scheduler = new Scheduler();

/* harmony default export */ __webpack_exports__["default"] = (scheduler);


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Geom.js



Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Geometry = __webpack_require__(3);

var _Geometry2 = _interopRequireDefault(_Geometry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Geom = {};
var meshTri = void 0;

Geom.plane = function plane(width, height, numSegments) {
	var axis = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'xy';
	var drawType = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 4;

	var positions = [];
	var coords = [];
	var indices = [];
	var normals = [];

	var gapX = width / numSegments;
	var gapY = height / numSegments;
	var gapUV = 1 / numSegments;
	var sx = -width * 0.5;
	var sy = -height * 0.5;
	var index = 0;

	for (var i = 0; i < numSegments; i++) {
		for (var j = 0; j < numSegments; j++) {
			var tx = gapX * i + sx;
			var ty = gapY * j + sy;

			var u = i / numSegments;
			var v = j / numSegments;

			if (axis === 'xz') {
				positions.push([tx, 0, ty + gapY]);
				positions.push([tx + gapX, 0, ty + gapY]);
				positions.push([tx + gapX, 0, ty]);
				positions.push([tx, 0, ty]);

				coords.push([u, 1.0 - (v + gapUV)]);
				coords.push([u + gapUV, 1.0 - (v + gapUV)]);
				coords.push([u + gapUV, 1.0 - v]);
				coords.push([u, 1.0 - v]);

				normals.push([0, 1, 0]);
				normals.push([0, 1, 0]);
				normals.push([0, 1, 0]);
				normals.push([0, 1, 0]);
			} else if (axis === 'yz') {
				positions.push([0, ty, tx]);
				positions.push([0, ty, tx + gapX]);
				positions.push([0, ty + gapY, tx + gapX]);
				positions.push([0, ty + gapY, tx]);

				coords.push([u, v]);
				coords.push([u + gapUV, v]);
				coords.push([u + gapUV, v + gapUV]);
				coords.push([u, v + gapUV]);

				normals.push([1, 0, 0]);
				normals.push([1, 0, 0]);
				normals.push([1, 0, 0]);
				normals.push([1, 0, 0]);
			} else {
				positions.push([tx, ty, 0]);
				positions.push([tx + gapX, ty, 0]);
				positions.push([tx + gapX, ty + gapY, 0]);
				positions.push([tx, ty + gapY, 0]);

				coords.push([u, v]);
				coords.push([u + gapUV, v]);
				coords.push([u + gapUV, v + gapUV]);
				coords.push([u, v + gapUV]);

				normals.push([0, 0, 1]);
				normals.push([0, 0, 1]);
				normals.push([0, 0, 1]);
				normals.push([0, 0, 1]);
			}

			indices.push(index * 4 + 0);
			indices.push(index * 4 + 1);
			indices.push(index * 4 + 2);
			indices.push(index * 4 + 0);
			indices.push(index * 4 + 2);
			indices.push(index * 4 + 3);

			index++;
		}
	}

	var mesh = new _Geometry2.default(drawType);
	mesh.bufferVertex(positions);
	mesh.bufferTexCoord(coords);
	mesh.bufferIndex(indices);
	mesh.bufferNormal(normals);

	return mesh;
};

Geom.sphere = function sphere(size, numSegments) {
	var isInvert = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	var drawType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 4;

	var positions = [];
	var coords = [];
	var indices = [];
	var normals = [];
	var gapUV = 1 / numSegments;
	var index = 0;

	function getPosition(i, j) {
		var isNormal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
		//	rx : -90 ~ 90 , ry : 0 ~ 360
		var rx = i / numSegments * Math.PI - Math.PI * 0.5;
		var ry = j / numSegments * Math.PI * 2;
		var r = isNormal ? 1 : size;
		var pos = [];
		pos[1] = Math.sin(rx) * r;
		var t = Math.cos(rx) * r;
		pos[0] = Math.cos(ry) * t;
		pos[2] = Math.sin(ry) * t;

		var precision = 10000;
		pos[0] = Math.floor(pos[0] * precision) / precision;
		pos[1] = Math.floor(pos[1] * precision) / precision;
		pos[2] = Math.floor(pos[2] * precision) / precision;

		return pos;
	};

	for (var i = 0; i < numSegments; i++) {
		for (var j = 0; j < numSegments; j++) {
			positions.push(getPosition(i, j));
			positions.push(getPosition(i + 1, j));
			positions.push(getPosition(i + 1, j + 1));
			positions.push(getPosition(i, j + 1));

			normals.push(getPosition(i, j, true));
			normals.push(getPosition(i + 1, j, true));
			normals.push(getPosition(i + 1, j + 1, true));
			normals.push(getPosition(i, j + 1, true));

			var u = j / numSegments;
			var v = i / numSegments;

			coords.push([1.0 - u, v]);
			coords.push([1.0 - u, v + gapUV]);
			coords.push([1.0 - u - gapUV, v + gapUV]);
			coords.push([1.0 - u - gapUV, v]);

			indices.push(index * 4 + 0);
			indices.push(index * 4 + 1);
			indices.push(index * 4 + 2);
			indices.push(index * 4 + 0);
			indices.push(index * 4 + 2);
			indices.push(index * 4 + 3);

			index++;
		}
	}

	if (isInvert) {
		indices.reverse();
	}

	var mesh = new _Geometry2.default(drawType);
	mesh.bufferVertex(positions);
	mesh.bufferTexCoord(coords);
	mesh.bufferIndex(indices);
	mesh.bufferNormal(normals);

	return mesh;
};

Geom.cube = function cube(w, h, d) {
	var drawType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 4;

	h = h || w;
	d = d || w;

	var x = w / 2;
	var y = h / 2;
	var z = d / 2;

	var positions = [];
	var coords = [];
	var indices = [];
	var normals = [];
	var count = 0;

	// BACK
	positions.push([-x, y, -z]);
	positions.push([x, y, -z]);
	positions.push([x, -y, -z]);
	positions.push([-x, -y, -z]);

	normals.push([0, 0, -1]);
	normals.push([0, 0, -1]);
	normals.push([0, 0, -1]);
	normals.push([0, 0, -1]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count * 4 + 0);
	indices.push(count * 4 + 1);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 0);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 3);

	count++;

	// RIGHT
	positions.push([x, y, -z]);
	positions.push([x, y, z]);
	positions.push([x, -y, z]);
	positions.push([x, -y, -z]);

	normals.push([1, 0, 0]);
	normals.push([1, 0, 0]);
	normals.push([1, 0, 0]);
	normals.push([1, 0, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count * 4 + 0);
	indices.push(count * 4 + 1);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 0);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 3);

	count++;

	// FRONT
	positions.push([x, y, z]);
	positions.push([-x, y, z]);
	positions.push([-x, -y, z]);
	positions.push([x, -y, z]);

	normals.push([0, 0, 1]);
	normals.push([0, 0, 1]);
	normals.push([0, 0, 1]);
	normals.push([0, 0, 1]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count * 4 + 0);
	indices.push(count * 4 + 1);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 0);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 3);

	count++;

	// LEFT
	positions.push([-x, y, z]);
	positions.push([-x, y, -z]);
	positions.push([-x, -y, -z]);
	positions.push([-x, -y, z]);

	normals.push([-1, 0, 0]);
	normals.push([-1, 0, 0]);
	normals.push([-1, 0, 0]);
	normals.push([-1, 0, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count * 4 + 0);
	indices.push(count * 4 + 1);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 0);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 3);

	count++;

	// TOP
	positions.push([x, y, -z]);
	positions.push([-x, y, -z]);
	positions.push([-x, y, z]);
	positions.push([x, y, z]);

	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count * 4 + 0);
	indices.push(count * 4 + 1);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 0);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 3);

	count++;

	// BOTTOM
	positions.push([x, -y, z]);
	positions.push([-x, -y, z]);
	positions.push([-x, -y, -z]);
	positions.push([x, -y, -z]);

	normals.push([0, -1, 0]);
	normals.push([0, -1, 0]);
	normals.push([0, -1, 0]);
	normals.push([0, -1, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count * 4 + 0);
	indices.push(count * 4 + 1);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 0);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 3);

	count++;

	var mesh = new _Geometry2.default(drawType);
	mesh.bufferVertex(positions);
	mesh.bufferTexCoord(coords);
	mesh.bufferIndex(indices);
	mesh.bufferNormal(normals);

	return mesh;
};

Geom.skybox = function skybox(size) {
	var drawType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

	var positions = [];
	var coords = [];
	var indices = [];
	var normals = [];
	var count = 0;

	// BACK
	positions.push([size, size, -size]);
	positions.push([-size, size, -size]);
	positions.push([-size, -size, -size]);
	positions.push([size, -size, -size]);

	normals.push([0, 0, -1]);
	normals.push([0, 0, -1]);
	normals.push([0, 0, -1]);
	normals.push([0, 0, -1]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count * 4 + 0);
	indices.push(count * 4 + 1);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 0);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 3);

	count++;

	// RIGHT
	positions.push([size, -size, -size]);
	positions.push([size, -size, size]);
	positions.push([size, size, size]);
	positions.push([size, size, -size]);

	normals.push([1, 0, 0]);
	normals.push([1, 0, 0]);
	normals.push([1, 0, 0]);
	normals.push([1, 0, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count * 4 + 0);
	indices.push(count * 4 + 1);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 0);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 3);

	count++;

	// FRONT
	positions.push([-size, size, size]);
	positions.push([size, size, size]);
	positions.push([size, -size, size]);
	positions.push([-size, -size, size]);

	normals.push([0, 0, 1]);
	normals.push([0, 0, 1]);
	normals.push([0, 0, 1]);
	normals.push([0, 0, 1]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count * 4 + 0);
	indices.push(count * 4 + 1);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 0);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 3);

	count++;

	// LEFT
	positions.push([-size, -size, size]);
	positions.push([-size, -size, -size]);
	positions.push([-size, size, -size]);
	positions.push([-size, size, size]);

	normals.push([-1, 0, 0]);
	normals.push([-1, 0, 0]);
	normals.push([-1, 0, 0]);
	normals.push([-1, 0, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count * 4 + 0);
	indices.push(count * 4 + 1);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 0);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 3);

	count++;

	// TOP
	positions.push([size, size, size]);
	positions.push([-size, size, size]);
	positions.push([-size, size, -size]);
	positions.push([size, size, -size]);

	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);
	normals.push([0, 1, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count * 4 + 0);
	indices.push(count * 4 + 1);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 0);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 3);

	count++;

	// BOTTOM
	positions.push([size, -size, -size]);
	positions.push([-size, -size, -size]);
	positions.push([-size, -size, size]);
	positions.push([size, -size, size]);

	normals.push([0, -1, 0]);
	normals.push([0, -1, 0]);
	normals.push([0, -1, 0]);
	normals.push([0, -1, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	indices.push(count * 4 + 0);
	indices.push(count * 4 + 1);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 0);
	indices.push(count * 4 + 2);
	indices.push(count * 4 + 3);

	var mesh = new _Geometry2.default(drawType);
	mesh.bufferVertex(positions);
	mesh.bufferTexCoord(coords);
	mesh.bufferIndex(indices);
	mesh.bufferNormal(normals);

	return mesh;
};

Geom.bigTriangle = function bigTriangle() {

	if (!meshTri) {
		var indices = [2, 1, 0];
		var positions = [[-1, -1], [-1, 4], [4, -1]];

		meshTri = new _Geometry2.default();
		meshTri.bufferData(positions, 'aPosition', 2);
		meshTri.bufferIndex(indices);
	}

	return meshTri;
};

exports.default = Geom;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Object3D.js

var _glMatrix = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Object3D = function () {
	function Object3D() {
		_classCallCheck(this, Object3D);

		this._needUpdate = true;

		this._x = 0;
		this._y = 0;
		this._z = 0;

		this._sx = 1;
		this._sy = 1;
		this._sz = 1;

		this._rx = 0;
		this._ry = 0;
		this._rz = 0;

		this._position = _glMatrix.vec3.create();
		this._scale = _glMatrix.vec3.fromValues(1, 1, 1);
		this._rotation = _glMatrix.vec3.create();

		this._matrix = _glMatrix.mat4.create();
		this._matrixParent = _glMatrix.mat4.create();
		this._matrixRotation = _glMatrix.mat4.create();
		this._matrixScale = _glMatrix.mat4.create();
		this._matrixTranslation = _glMatrix.mat4.create();
		this._matrixQuaternion = _glMatrix.mat4.create();
		this._quat = _glMatrix.quat.create();

		this._children = [];
	}

	_createClass(Object3D, [{
		key: 'updateMatrix',
		value: function updateMatrix() {
			var _this = this;

			if (!this._needUpdate) {
				return;
			}

			_glMatrix.vec3.set(this._scale, this._sx, this._sy, this._sz);
			_glMatrix.vec3.set(this._rotation, this._rx, this._ry, this._rz);
			_glMatrix.vec3.set(this._position, this._x, this._y, this._z);

			_glMatrix.mat4.identity(this._matrixTranslation, this._matrixTranslation);
			_glMatrix.mat4.identity(this._matrixScale, this._matrixScale);
			_glMatrix.mat4.identity(this._matrixRotation, this._matrixRotation);

			_glMatrix.mat4.rotateX(this._matrixRotation, this._matrixRotation, this._rx);
			_glMatrix.mat4.rotateY(this._matrixRotation, this._matrixRotation, this._ry);
			_glMatrix.mat4.rotateZ(this._matrixRotation, this._matrixRotation, this._rz);

			_glMatrix.mat4.fromQuat(this._matrixQuaternion, this._quat);
			_glMatrix.mat4.mul(this._matrixRotation, this._matrixQuaternion, this._matrixRotation);

			_glMatrix.mat4.scale(this._matrixScale, this._matrixScale, this._scale);
			_glMatrix.mat4.translate(this._matrixTranslation, this._matrixTranslation, this._position);

			_glMatrix.mat4.mul(this._matrix, this._matrixTranslation, this._matrixRotation);
			_glMatrix.mat4.mul(this._matrix, this._matrix, this._matrixScale);
			_glMatrix.mat4.mul(this._matrix, this._matrixParent, this._matrix);

			this._children.forEach(function (child) {
				child.updateParentMatrix(_this._matrix);
			});

			this._needUpdate = false;
		}
	}, {
		key: 'updateParentMatrix',
		value: function updateParentMatrix(mParentMatrix) {
			mParentMatrix = mParentMatrix || _glMatrix.mat4.create();
			_glMatrix.mat4.copy(this._matrixParent, mParentMatrix);
			this._needUpdate = true;
		}
	}, {
		key: 'setRotationFromQuaternion',
		value: function setRotationFromQuaternion(mQuat) {
			_glMatrix.quat.copy(this._quat, mQuat);
			this._needUpdate = true;
		}
	}, {
		key: 'addChild',
		value: function addChild(mChild) {
			this._children.push(mChild);
		}
	}, {
		key: 'removeChild',
		value: function removeChild(mChild) {
			var index = this._children.indexOf(mChild);
			if (index == -1) {
				console.warn('Child no exist');return;
			}

			this._children.splice(index, 1);
		}
	}, {
		key: 'matrix',
		get: function get() {
			this.updateMatrix();
			return this._matrix;
		}
	}, {
		key: 'x',
		get: function get() {
			return this._x;
		},
		set: function set(mValue) {
			this._needUpdate = true;
			this._x = mValue;
		}
	}, {
		key: 'y',
		get: function get() {
			return this._y;
		},
		set: function set(mValue) {
			this._needUpdate = true;
			this._y = mValue;
		}
	}, {
		key: 'z',
		get: function get() {
			return this._z;
		},
		set: function set(mValue) {
			this._needUpdate = true;
			this._z = mValue;
		}
	}, {
		key: 'scaleX',
		get: function get() {
			return this._sx;
		},
		set: function set(mValue) {
			this._needUpdate = true;
			this._sx = mValue;
		}
	}, {
		key: 'scaleY',
		get: function get() {
			return this._sy;
		},
		set: function set(mValue) {
			this._needUpdate = true;
			this._sy = mValue;
		}
	}, {
		key: 'scaleZ',
		get: function get() {
			return this._sz;
		},
		set: function set(mValue) {
			this._needUpdate = true;
			this._sz = mValue;
		}
	}, {
		key: 'rotationX',
		get: function get() {
			return this._rx;
		},
		set: function set(mValue) {
			this._needUpdate = true;
			this._rx = mValue;
		}
	}, {
		key: 'rotationY',
		get: function get() {
			return this._ry;
		},
		set: function set(mValue) {
			this._needUpdate = true;
			this._ry = mValue;
		}
	}, {
		key: 'rotationZ',
		get: function get() {
			return this._rz;
		},
		set: function set(mValue) {
			this._needUpdate = true;
			this._rz = mValue;
		}
	}, {
		key: 'children',
		get: function get() {
			return this._children;
		}
	}]);

	return Object3D;
}();

exports.default = Object3D;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // GLTexture.js

var _getTextureParameters = __webpack_require__(59);

var _getTextureParameters2 = _interopRequireDefault(_getTextureParameters);

var _WebglNumber = __webpack_require__(10);

var _WebglNumber2 = _interopRequireDefault(_WebglNumber);

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _scheduling = __webpack_require__(6);

var _scheduling2 = _interopRequireDefault(_scheduling);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gl = void 0;

var GLTexture = function () {
	function GLTexture(mSource) {
		var mParam = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		var _this = this;

		var mWidth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
		var mHeight = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

		_classCallCheck(this, GLTexture);

		gl = _GLTool2.default.gl;

		this._source = mSource;
		this._getDimension(mSource, mWidth, mHeight);
		this._sourceType = mParam.type || getSourceType(mSource);
		this._checkSource();
		this._texelType = this._getTexelType();
		this._isTextureReady = true;

		this._params = (0, _getTextureParameters2.default)(mParam, mSource, this._width, this._height);
		this._checkMipmap();
		this._checkWrapping();

		//	setup texture
		this._texture = gl.createTexture();

		if (this._sourceType === 'video') {
			this._isTextureReady = false;
			_scheduling2.default.addEF(function () {
				return _this._loop();
			});
		} else {
			this._uploadTexture();
		}
	}

	_createClass(GLTexture, [{
		key: '_loop',
		value: function _loop() {
			if (this._source.readyState == 4) {
				this._isTextureReady = true;
				this._uploadTexture();
			}
		}
	}, {
		key: '_uploadTexture',
		value: function _uploadTexture() {
			gl.bindTexture(gl.TEXTURE_2D, this._texture);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

			if (this._isSourceHtmlElement()) {
				gl.texImage2D(gl.TEXTURE_2D, 0, this._params.internalFormat, this._params.format, this._texelType, this._source);
			} else {
				gl.texImage2D(gl.TEXTURE_2D, 0, this._params.internalFormat, this._width, this._height, 0, this._params.format, this._texelType, this._source);
			}

			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this._params.magFilter);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this._params.minFilter);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this._params.wrapS);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this._params.wrapT);
			gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this._params.premultiplyAlpha);

			if (this._params.anisotropy > 0) {
				var ext = _GLTool2.default.getExtension('EXT_texture_filter_anisotropic');
				if (ext) {
					var max = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
					var level = Math.min(max, this._params.anisotropy);
					gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, level);
				}
			}

			if (this._generateMipmap) {
				gl.generateMipmap(gl.TEXTURE_2D);
			}

			//	unbind texture
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: 'bind',
		value: function bind(index) {
			if (index === undefined) {
				index = 0;
			}
			if (!_GLTool2.default.shader) {
				return;
			}

			gl.activeTexture(gl.TEXTURE0 + index);
			if (this._isTextureReady) {
				gl.bindTexture(gl.TEXTURE_2D, this._texture);
			} else {
				gl.bindTexture(gl.TEXTURE_2D, GLTexture.blackTexture().texture);
			}

			this._bindIndex = index;
		}
	}, {
		key: 'updateTexture',
		value: function updateTexture(mSource) {
			this._source = mSource;
			this._checkSource();
			this._uploadTexture();
		}
	}, {
		key: 'generateMipmap',
		value: function generateMipmap() {
			if (!this._generateMipmap) {
				return;
			}
			gl.bindTexture(gl.TEXTURE_2D, this._texture);
			gl.generateMipmap(gl.TEXTURE_2D);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: 'showParameters',
		value: function showParameters() {
			console.log('Source type : ', _WebglNumber2.default[this._sourceType] || this._sourceType);
			console.log('Texel type:', _WebglNumber2.default[this.texelType]);
			console.log('Dimension :', this._width, this._height);
			for (var s in this._params) {
				console.log(s, _WebglNumber2.default[this._params[s]] || this._params[s]);
			}

			console.log('Mipmapping :', this._generateMipmap);
		}
	}, {
		key: '_getDimension',
		value: function _getDimension(mSource, mWidth, mHeight) {
			if (mSource) {
				//	for html image / video element
				this._width = mSource.width || mSource.videoWidth;
				this._height = mSource.height || mSource.videoWidth;

				//	for manual width / height settings
				this._width = this._width || mWidth;
				this._height = this._height || mHeight;

				//	auto detect ( data array) ? not sure is good idea ? 
				//	todo : check HDR 
				if (!this._width || !this._height) {
					this._width = this._height = Math.sqrt(mSource.length / 4);
					// console.log('Auto detect, data dimension : ', this._width, this._height);	
				}
			} else {
				this._width = mWidth;
				this._height = mHeight;
			}
		}
	}, {
		key: '_checkSource',
		value: function _checkSource() {
			if (!this._source) {
				return;
			}

			if (this._sourceType === _GLTool2.default.UNSIGNED_BYTE) {
				if (!(this._source instanceof Uint8Array)) {
					// console.log('Converting to Uint8Array');
					this._source = new Uint8Array(this._source);
				}
			} else if (this._sourceType === _GLTool2.default.FLOAT) {
				if (!(this._source instanceof Float32Array)) {
					// console.log('Converting to Float32Array');
					this._source = new Float32Array(this._source);
				}
			}
		}
	}, {
		key: '_getTexelType',
		value: function _getTexelType() {
			if (this._isSourceHtmlElement()) {
				return _GLTool2.default.UNSIGNED_BYTE;
			}

			//	bad code here, if the type is not on the webglNumber list, it doesn't work
			return _GLTool2.default[_WebglNumber2.default[this._sourceType]] || this._sourceType;
		}
	}, {
		key: '_checkMipmap',
		value: function _checkMipmap() {
			this._generateMipmap = this._params.mipmap;

			if (!(isPowerOfTwo(this._width) && isPowerOfTwo(this._height))) {
				this._generateMipmap = false;
			}

			var minFilter = _WebglNumber2.default[this._params.minFilter];
			if (minFilter.indexOf('MIPMAP') == -1) {
				this._generateMipmap = false;
			}
		}
	}, {
		key: '_checkWrapping',
		value: function _checkWrapping() {
			if (!this._generateMipmap) {
				this._params.wrapS = _GLTool2.default.CLAMP_TO_EDGE;
				this._params.wrapT = _GLTool2.default.CLAMP_TO_EDGE;
			}
		}
	}, {
		key: '_isSourceHtmlElement',
		value: function _isSourceHtmlElement() {
			return this._sourceType === 'image' || this._sourceType === 'video' || this._sourceType === 'canvas';
		}
	}, {
		key: 'minFilter',
		get: function get() {
			return this._params.minFilter;
		},
		set: function set(mValue) {
			this._params.minFilter = mValue;
			this._checkMipmap();

			gl.bindTexture(gl.TEXTURE_2D, this._texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this._params.minFilter);
			gl.bindTexture(gl.TEXTURE_2D, null);

			this.generateMipmap();
		}
	}, {
		key: 'magFilter',
		get: function get() {
			return this._params.minFilter;
		},
		set: function set(mValue) {
			this._params.magFilter = mValue;

			gl.bindTexture(gl.TEXTURE_2D, this._texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this._params.magFilter);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: 'wrapS',
		get: function get() {
			return this._params.wrapS;
		},
		set: function set(mValue) {
			this._params.wrapS = mValue;
			this._checkWrapping();

			gl.bindTexture(gl.TEXTURE_2D, this._texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this._params.wrapS);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: 'wrapT',
		get: function get() {
			return this._params.wrapT;
		},
		set: function set(mValue) {
			this._params.wrapT = mValue;
			this._checkWrapping();

			gl.bindTexture(gl.TEXTURE_2D, this._texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this._params.wrapT);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: 'texelType',
		get: function get() {
			return this._texelType;
		}
	}, {
		key: 'width',
		get: function get() {
			return this._width;
		}
	}, {
		key: 'height',
		get: function get() {
			return this._height;
		}
	}, {
		key: 'texture',
		get: function get() {
			return this._texture;
		}
	}, {
		key: 'isTextureReady',
		get: function get() {
			return this._isTextureReady;
		}
	}]);

	return GLTexture;
}();

function isPowerOfTwo(x) {
	return x !== 0 && !(x & x - 1);
};

function getSourceType(mSource) {
	//	possible source type : Image / Video / Unit8Array / Float32Array
	//	this list must be flexible

	var type = _GLTool2.default.UNSIGNED_BYTE;

	if (mSource instanceof Array) {
		type = _GLTool2.default.UNSIGNED_BYTE;
	} else if (mSource instanceof Uint8Array) {
		type = _GLTool2.default.UNSIGNED_BYTE;
	} else if (mSource instanceof Float32Array) {
		type = _GLTool2.default.FLOAT;
	} else if (mSource instanceof HTMLImageElement) {
		type = 'image';
	} else if (mSource instanceof HTMLCanvasElement) {
		type = 'canvas';
	} else if (mSource instanceof HTMLVideoElement) {
		type = 'video';
	}
	return type;
}

var _whiteTexture = void 0,
    _greyTexture = void 0,
    _blackTexture = void 0;

GLTexture.whiteTexture = function whiteTexture() {
	if (_whiteTexture === undefined) {
		var canvas = document.createElement('canvas');
		canvas.width = canvas.height = 2;
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, 2, 2);
		_whiteTexture = new GLTexture(canvas);
	}

	return _whiteTexture;
};

GLTexture.greyTexture = function greyTexture() {
	if (_greyTexture === undefined) {
		var canvas = document.createElement('canvas');
		canvas.width = canvas.height = 2;
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = 'rgb(127, 127, 127)';
		ctx.fillRect(0, 0, 2, 2);
		_greyTexture = new GLTexture(canvas);
	}
	return _greyTexture;
};

GLTexture.blackTexture = function blackTexture() {
	if (_blackTexture === undefined) {
		var canvas = document.createElement('canvas');
		canvas.width = canvas.height = 2;
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = 'rgb(0, 0, 0)';
		ctx.fillRect(0, 0, 2, 2);
		_blackTexture = new GLTexture(canvas);
	}
	return _blackTexture;
};

exports.default = GLTexture;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// stolen there https://github.com/mattdesl/gl-constants thanks @mattdesl ^^
module.exports = {
	0: 'NONE',
	1: 'ONE',
	2: 'LINE_LOOP',
	3: 'LINE_STRIP',
	4: 'TRIANGLES',
	5: 'TRIANGLE_STRIP',
	6: 'TRIANGLE_FAN',
	256: 'DEPTH_BUFFER_BIT',
	512: 'NEVER',
	513: 'LESS',
	514: 'EQUAL',
	515: 'LEQUAL',
	516: 'GREATER',
	517: 'NOTEQUAL',
	518: 'GEQUAL',
	519: 'ALWAYS',
	768: 'SRC_COLOR',
	769: 'ONE_MINUS_SRC_COLOR',
	770: 'SRC_ALPHA',
	771: 'ONE_MINUS_SRC_ALPHA',
	772: 'DST_ALPHA',
	773: 'ONE_MINUS_DST_ALPHA',
	774: 'DST_COLOR',
	775: 'ONE_MINUS_DST_COLOR',
	776: 'SRC_ALPHA_SATURATE',
	1024: 'STENCIL_BUFFER_BIT',
	1028: 'FRONT',
	1029: 'BACK',
	1032: 'FRONT_AND_BACK',
	1280: 'INVALID_ENUM',
	1281: 'INVALID_VALUE',
	1282: 'INVALID_OPERATION',
	1285: 'OUT_OF_MEMORY',
	1286: 'INVALID_FRAMEBUFFER_OPERATION',
	2304: 'CW',
	2305: 'CCW',
	2849: 'LINE_WIDTH',
	2884: 'CULL_FACE',
	2885: 'CULL_FACE_MODE',
	2886: 'FRONT_FACE',
	2928: 'DEPTH_RANGE',
	2929: 'DEPTH_TEST',
	2930: 'DEPTH_WRITEMASK',
	2931: 'DEPTH_CLEAR_VALUE',
	2932: 'DEPTH_FUNC',
	2960: 'STENCIL_TEST',
	2961: 'STENCIL_CLEAR_VALUE',
	2962: 'STENCIL_FUNC',
	2963: 'STENCIL_VALUE_MASK',
	2964: 'STENCIL_FAIL',
	2965: 'STENCIL_PASS_DEPTH_FAIL',
	2966: 'STENCIL_PASS_DEPTH_PASS',
	2967: 'STENCIL_REF',
	2968: 'STENCIL_WRITEMASK',
	2978: 'VIEWPORT',
	3024: 'DITHER',
	3042: 'BLEND',
	3088: 'SCISSOR_BOX',
	3089: 'SCISSOR_TEST',
	3106: 'COLOR_CLEAR_VALUE',
	3107: 'COLOR_WRITEMASK',
	3317: 'UNPACK_ALIGNMENT',
	3333: 'PACK_ALIGNMENT',
	3379: 'MAX_TEXTURE_SIZE',
	3386: 'MAX_VIEWPORT_DIMS',
	3408: 'SUBPIXEL_BITS',
	3410: 'RED_BITS',
	3411: 'GREEN_BITS',
	3412: 'BLUE_BITS',
	3413: 'ALPHA_BITS',
	3414: 'DEPTH_BITS',
	3415: 'STENCIL_BITS',
	3553: 'TEXTURE_2D',
	4352: 'DONT_CARE',
	4353: 'FASTEST',
	4354: 'NICEST',
	5120: 'BYTE',
	5121: 'UNSIGNED_BYTE',
	5122: 'SHORT',
	5123: 'UNSIGNED_SHORT',
	5124: 'INT',
	5125: 'UNSIGNED_INT',
	5126: 'FLOAT',
	5386: 'INVERT',
	5890: 'TEXTURE',
	6401: 'STENCIL_INDEX',
	6402: 'DEPTH_COMPONENT',
	6403: 'RED',
	6406: 'ALPHA',
	6407: 'RGB',
	6408: 'RGBA',
	6409: 'LUMINANCE',
	6410: 'LUMINANCE_ALPHA',
	7680: 'KEEP',
	7681: 'REPLACE',
	7682: 'INCR',
	7683: 'DECR',
	7936: 'VENDOR',
	7937: 'RENDERER',
	7938: 'VERSION',
	9728: 'NEAREST',
	9729: 'LINEAR',
	9984: 'NEAREST_MIPMAP_NEAREST',
	9985: 'LINEAR_MIPMAP_NEAREST',
	9986: 'NEAREST_MIPMAP_LINEAR',
	9987: 'LINEAR_MIPMAP_LINEAR',
	10240: 'TEXTURE_MAG_FILTER',
	10241: 'TEXTURE_MIN_FILTER',
	10242: 'TEXTURE_WRAP_S',
	10243: 'TEXTURE_WRAP_T',
	10497: 'REPEAT',
	10752: 'POLYGON_OFFSET_UNITS',
	16384: 'COLOR_BUFFER_BIT',
	32769: 'CONSTANT_COLOR',
	32770: 'ONE_MINUS_CONSTANT_COLOR',
	32771: 'CONSTANT_ALPHA',
	32772: 'ONE_MINUS_CONSTANT_ALPHA',
	32773: 'BLEND_COLOR',
	32774: 'FUNC_ADD',
	32777: 'BLEND_EQUATION_RGB',
	32778: 'FUNC_SUBTRACT',
	32779: 'FUNC_REVERSE_SUBTRACT',
	32819: 'UNSIGNED_SHORT_4_4_4_4',
	32820: 'UNSIGNED_SHORT_5_5_5_1',
	32823: 'POLYGON_OFFSET_FILL',
	32824: 'POLYGON_OFFSET_FACTOR',
	32854: 'RGBA4',
	32855: 'RGB5_A1',
	32873: 'TEXTURE_BINDING_2D',
	32926: 'SAMPLE_ALPHA_TO_COVERAGE',
	32928: 'SAMPLE_COVERAGE',
	32936: 'SAMPLE_BUFFERS',
	32937: 'SAMPLES',
	32938: 'SAMPLE_COVERAGE_VALUE',
	32939: 'SAMPLE_COVERAGE_INVERT',
	32968: 'BLEND_DST_RGB',
	32969: 'BLEND_SRC_RGB',
	32970: 'BLEND_DST_ALPHA',
	32971: 'BLEND_SRC_ALPHA',
	33071: 'CLAMP_TO_EDGE',
	33170: 'GENERATE_MIPMAP_HINT',
	33189: 'DEPTH_COMPONENT16',
	33306: 'DEPTH_STENCIL_ATTACHMENT',
	33321: 'R8',
	33635: 'UNSIGNED_SHORT_5_6_5',
	33648: 'MIRRORED_REPEAT',
	33901: 'ALIASED_POINT_SIZE_RANGE',
	33902: 'ALIASED_LINE_WIDTH_RANGE',
	33984: 'TEXTURE0',
	33985: 'TEXTURE1',
	33986: 'TEXTURE2',
	33987: 'TEXTURE3',
	33988: 'TEXTURE4',
	33989: 'TEXTURE5',
	33990: 'TEXTURE6',
	33991: 'TEXTURE7',
	33992: 'TEXTURE8',
	33993: 'TEXTURE9',
	33994: 'TEXTURE10',
	33995: 'TEXTURE11',
	33996: 'TEXTURE12',
	33997: 'TEXTURE13',
	33998: 'TEXTURE14',
	33999: 'TEXTURE15',
	34000: 'TEXTURE16',
	34001: 'TEXTURE17',
	34002: 'TEXTURE18',
	34003: 'TEXTURE19',
	34004: 'TEXTURE20',
	34005: 'TEXTURE21',
	34006: 'TEXTURE22',
	34007: 'TEXTURE23',
	34008: 'TEXTURE24',
	34009: 'TEXTURE25',
	34010: 'TEXTURE26',
	34011: 'TEXTURE27',
	34012: 'TEXTURE28',
	34013: 'TEXTURE29',
	34014: 'TEXTURE30',
	34015: 'TEXTURE31',
	34016: 'ACTIVE_TEXTURE',
	34024: 'MAX_RENDERBUFFER_SIZE',
	34041: 'DEPTH_STENCIL',
	34055: 'INCR_WRAP',
	34056: 'DECR_WRAP',
	34067: 'TEXTURE_CUBE_MAP',
	34068: 'TEXTURE_BINDING_CUBE_MAP',
	34069: 'TEXTURE_CUBE_MAP_POSITIVE_X',
	34070: 'TEXTURE_CUBE_MAP_NEGATIVE_X',
	34071: 'TEXTURE_CUBE_MAP_POSITIVE_Y',
	34072: 'TEXTURE_CUBE_MAP_NEGATIVE_Y',
	34073: 'TEXTURE_CUBE_MAP_POSITIVE_Z',
	34074: 'TEXTURE_CUBE_MAP_NEGATIVE_Z',
	34076: 'MAX_CUBE_MAP_TEXTURE_SIZE',
	34338: 'VERTEX_ATTRIB_ARRAY_ENABLED',
	34339: 'VERTEX_ATTRIB_ARRAY_SIZE',
	34340: 'VERTEX_ATTRIB_ARRAY_STRIDE',
	34341: 'VERTEX_ATTRIB_ARRAY_TYPE',
	34342: 'CURRENT_VERTEX_ATTRIB',
	34373: 'VERTEX_ATTRIB_ARRAY_POINTER',
	34466: 'NUM_COMPRESSED_TEXTURE_FORMATS',
	34467: 'COMPRESSED_TEXTURE_FORMATS',
	34660: 'BUFFER_SIZE',
	34661: 'BUFFER_USAGE',
	34816: 'STENCIL_BACK_FUNC',
	34817: 'STENCIL_BACK_FAIL',
	34818: 'STENCIL_BACK_PASS_DEPTH_FAIL',
	34819: 'STENCIL_BACK_PASS_DEPTH_PASS',
	34877: 'BLEND_EQUATION_ALPHA',
	34921: 'MAX_VERTEX_ATTRIBS',
	34922: 'VERTEX_ATTRIB_ARRAY_NORMALIZED',
	34930: 'MAX_TEXTURE_IMAGE_UNITS',
	34962: 'ARRAY_BUFFER',
	34963: 'ELEMENT_ARRAY_BUFFER',
	34964: 'ARRAY_BUFFER_BINDING',
	34965: 'ELEMENT_ARRAY_BUFFER_BINDING',
	34975: 'VERTEX_ATTRIB_ARRAY_BUFFER_BINDING',
	35040: 'STREAM_DRAW',
	35044: 'STATIC_DRAW',
	35048: 'DYNAMIC_DRAW',
	35632: 'FRAGMENT_SHADER',
	35633: 'VERTEX_SHADER',
	35660: 'MAX_VERTEX_TEXTURE_IMAGE_UNITS',
	35661: 'MAX_COMBINED_TEXTURE_IMAGE_UNITS',
	35663: 'SHADER_TYPE',
	35664: 'FLOAT_VEC2',
	35665: 'FLOAT_VEC3',
	35666: 'FLOAT_VEC4',
	35667: 'INT_VEC2',
	35668: 'INT_VEC3',
	35669: 'INT_VEC4',
	35670: 'BOOL',
	35671: 'BOOL_VEC2',
	35672: 'BOOL_VEC3',
	35673: 'BOOL_VEC4',
	35674: 'FLOAT_MAT2',
	35675: 'FLOAT_MAT3',
	35676: 'FLOAT_MAT4',
	35678: 'SAMPLER_2D',
	35680: 'SAMPLER_CUBE',
	35712: 'DELETE_STATUS',
	35713: 'COMPILE_STATUS',
	35714: 'LINK_STATUS',
	35715: 'VALIDATE_STATUS',
	35716: 'INFO_LOG_LENGTH',
	35717: 'ATTACHED_SHADERS',
	35718: 'ACTIVE_UNIFORMS',
	35719: 'ACTIVE_UNIFORM_MAX_LENGTH',
	35720: 'SHADER_SOURCE_LENGTH',
	35721: 'ACTIVE_ATTRIBUTES',
	35722: 'ACTIVE_ATTRIBUTE_MAX_LENGTH',
	35724: 'SHADING_LANGUAGE_VERSION',
	35725: 'CURRENT_PROGRAM',
	36003: 'STENCIL_BACK_REF',
	36004: 'STENCIL_BACK_VALUE_MASK',
	36005: 'STENCIL_BACK_WRITEMASK',
	36006: 'FRAMEBUFFER_BINDING',
	36007: 'RENDERBUFFER_BINDING',
	36048: 'FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE',
	36049: 'FRAMEBUFFER_ATTACHMENT_OBJECT_NAME',
	36050: 'FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL',
	36051: 'FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE',
	36053: 'FRAMEBUFFER_COMPLETE',
	36054: 'FRAMEBUFFER_INCOMPLETE_ATTACHMENT',
	36055: 'FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT',
	36057: 'FRAMEBUFFER_INCOMPLETE_DIMENSIONS',
	36061: 'FRAMEBUFFER_UNSUPPORTED',
	36064: 'COLOR_ATTACHMENT0',
	36096: 'DEPTH_ATTACHMENT',
	36128: 'STENCIL_ATTACHMENT',
	36160: 'FRAMEBUFFER',
	36161: 'RENDERBUFFER',
	36162: 'RENDERBUFFER_WIDTH',
	36163: 'RENDERBUFFER_HEIGHT',
	36164: 'RENDERBUFFER_INTERNAL_FORMAT',
	36168: 'STENCIL_INDEX8',
	36176: 'RENDERBUFFER_RED_SIZE',
	36177: 'RENDERBUFFER_GREEN_SIZE',
	36178: 'RENDERBUFFER_BLUE_SIZE',
	36179: 'RENDERBUFFER_ALPHA_SIZE',
	36180: 'RENDERBUFFER_DEPTH_SIZE',
	36181: 'RENDERBUFFER_STENCIL_SIZE',
	36194: 'RGB565',
	36336: 'LOW_FLOAT',
	36337: 'MEDIUM_FLOAT',
	36338: 'HIGH_FLOAT',
	36339: 'LOW_INT',
	36340: 'MEDIUM_INT',
	36341: 'HIGH_INT',
	36346: 'SHADER_COMPILER',
	36347: 'MAX_VERTEX_UNIFORM_VECTORS',
	36348: 'MAX_VARYING_VECTORS',
	36349: 'MAX_FRAGMENT_UNIFORM_VECTORS',
	37440: 'UNPACK_FLIP_Y_WEBGL',
	37441: 'UNPACK_PREMULTIPLY_ALPHA_WEBGL',
	37442: 'CONTEXT_LOST_WEBGL',
	37443: 'UNPACK_COLORSPACE_CONVERSION_WEBGL',
	37444: 'BROWSER_DEFAULT_WEBGL'
};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = "// simpleColor.frag\n\n#define SHADER_NAME SIMPLE_COLOR\n\nprecision mediump float;\n#define GLSLIFY 1\n\nuniform vec3 color;\nuniform float opacity;\n\nvoid main(void) {\n    gl_FragColor = vec4(color, opacity);\n}"

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Pass.js

var _GLShader = __webpack_require__(1);

var _GLShader2 = _interopRequireDefault(_GLShader);

var _FrameBuffer = __webpack_require__(18);

var _FrameBuffer2 = _interopRequireDefault(_FrameBuffer);

var _ShaderLibs = __webpack_require__(21);

var _ShaderLibs2 = _interopRequireDefault(_ShaderLibs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pass = function () {
	function Pass(mSource) {
		var mWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
		var mHeight = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
		var mParams = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

		_classCallCheck(this, Pass);

		this.shader = new _GLShader2.default(_ShaderLibs2.default.bigTriangleVert, mSource);

		this._width = mWidth;
		this._height = mHeight;
		this._uniforms = {};
		this._hasOwnFbo = this._width > 0 && this._width > 0;
		this._uniforms = {};

		if (this._hasOwnFbo) {
			this._fbo = new _FrameBuffer2.default(this._width, this.height, mParmas);
		}
	}

	_createClass(Pass, [{
		key: 'uniform',
		value: function uniform(mName, mValue) {
			this._uniforms[mName] = mValue;
		}
	}, {
		key: 'render',
		value: function render(texture) {
			this.shader.bind();
			this.shader.uniform('texture', 'uniform1i', 0);
			texture.bind(0);

			this.shader.uniform(this._uniforms);
		}
	}, {
		key: 'width',
		get: function get() {
			return this._width;
		}
	}, {
		key: 'height',
		get: function get() {
			return this._height;
		}
	}, {
		key: 'fbo',
		get: function get() {
			return this._fbo;
		}
	}, {
		key: 'hasFbo',
		get: function get() {
			return this._hasOwnFbo;
		}
	}]);

	return Pass;
}();

exports.default = Pass;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Object3D2 = __webpack_require__(8);

var _Object3D3 = _interopRequireDefault(_Object3D2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Mesh = function (_Object3D) {
	_inherits(Mesh, _Object3D);

	function Mesh(geometry, material) {
		_classCallCheck(this, Mesh);

		var _this = _possibleConstructorReturn(this, (Mesh.__proto__ || Object.getPrototypeOf(Mesh)).call(this));

		_this.geometry = geometry;
		_this.material = material;
		return _this;
	}

	return Mesh;
}(_Object3D3.default);

exports.default = Mesh;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// GLCubeTexture.js



Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _parseDds = __webpack_require__(60);

var _parseDds2 = _interopRequireDefault(_parseDds);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gl = void 0;
var DDSD_MIPMAPCOUNT = 0x20000;
var OFF_MIPMAPCOUNT = 7;
var headerLengthInt = 31;

var GLCubeTexture = function () {
	function GLCubeTexture(mSource) {
		var mParameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		var isCubeTexture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

		_classCallCheck(this, GLCubeTexture);

		gl = _GLTool2.default.gl;

		if (isCubeTexture) {
			this.texture = mSource;
			return;
		}

		var hasMipmaps = mSource.length > 6;
		if (mSource[0].mipmapCount) {
			hasMipmaps = mSource[0].mipmapCount > 1;
		}

		this.texture = gl.createTexture();
		this.magFilter = mParameters.magFilter || gl.LINEAR;
		this.minFilter = mParameters.minFilter || gl.LINEAR_MIPMAP_LINEAR;
		this.wrapS = mParameters.wrapS || gl.CLAMP_TO_EDGE;
		this.wrapT = mParameters.wrapT || gl.CLAMP_TO_EDGE;

		if (!hasMipmaps && this.minFilter == gl.LINEAR_MIPMAP_LINEAR) {
			this.minFilter = gl.LINEAR;
		}

		gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
		var targets = [gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z];

		var numLevels = 1;
		var index = 0;
		numLevels = mSource.length / 6;
		this.numLevels = numLevels;

		if (hasMipmaps) {
			for (var j = 0; j < 6; j++) {
				for (var i = 0; i < numLevels; i++) {
					gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

					index = j * numLevels + i;
					if (mSource[index].shape) {
						gl.texImage2D(targets[j], i, gl.RGBA, mSource[index].shape[0], mSource[index].shape[1], 0, gl.RGBA, gl.FLOAT, mSource[index].data);
					} else {
						gl.texImage2D(targets[j], i, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mSource[index]);
					}

					gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, this.wrapS);
					gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, this.wrapT);
					gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, this.magFilter);
					gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, this.minFilter);
				}
			}
		} else {
			var _index = 0;
			for (var _j = 0; _j < 6; _j++) {
				_index = _j * numLevels;
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
				if (mSource[_index].shape) {
					gl.texImage2D(targets[_j], 0, gl.RGBA, mSource[_index].shape[0], mSource[_index].shape[1], 0, gl.RGBA, gl.FLOAT, mSource[_index].data);
				} else {
					gl.texImage2D(targets[_j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mSource[_index]);
				}
				gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, this.wrapS);
				gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, this.wrapT);
				gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, this.magFilter);
				gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, this.minFilter);
			}

			gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
		}

		gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
	}

	//	PUBLIC METHOD

	_createClass(GLCubeTexture, [{
		key: 'bind',
		value: function bind() {
			var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			if (!_GLTool2.default.shader) {
				return;
			}

			gl.activeTexture(gl.TEXTURE0 + index);
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
			// gl.uniform1i(GL.shader.uniformTextures[index], index);
			this._bindIndex = index;
		}
	}, {
		key: 'unbind',
		value: function unbind() {
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
		}
	}]);

	return GLCubeTexture;
}();

GLCubeTexture.parseDDS = function parseDDS(mArrayBuffer) {

	function clamp(value, min, max) {
		if (min > max) {
			return clamp(value, max, min);
		}

		if (value < min) return min;else if (value > max) return max;else return value;
	}

	//	CHECKING MIP MAP LEVELS
	var ddsInfos = (0, _parseDds2.default)(mArrayBuffer);
	var flags = ddsInfos.flags;

	var header = new Int32Array(mArrayBuffer, 0, headerLengthInt);
	var mipmapCount = 1;
	if (flags & DDSD_MIPMAPCOUNT) {
		mipmapCount = Math.max(1, header[OFF_MIPMAPCOUNT]);
	}
	var sources = ddsInfos.images.map(function (img) {
		var faceData = new Float32Array(mArrayBuffer.slice(img.offset, img.offset + img.length));
		return {
			data: faceData,
			shape: img.shape,
			mipmapCount: mipmapCount
		};
	});

	return new GLCubeTexture(sources);
};

exports.default = GLCubeTexture;

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = "// basic.vert\n\n#define SHADER_NAME BASIC_VERTEX\n\nprecision highp float;\n#define GLSLIFY 1\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec3 aNormal;\n\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjectionMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vNormal;\n\nvoid main(void) {\n    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);\n    vTextureCoord = aTextureCoord;\n    vNormal = aNormal;\n}"

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _GLShader = __webpack_require__(1);

var _GLShader2 = _interopRequireDefault(_GLShader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var shaderCache = []; // Shaders.js

var definesToString = function definesToString(defines) {
	var outStr = '';
	for (var def in defines) {
		if (defines[def]) {
			outStr += '#define ' + def + ' ' + defines[def] + '\n';
		}
	}
	return outStr;
};

var getUniformType = function getUniformType(mValue) {
	if (mValue.length) {
		return 'vec' + mValue.length;
	} else {
		return 'float';
	}
};

var addUniforms = function addUniforms(mShader, mObjUniforms) {

	var strUniforms = '';
	for (var uniformName in mObjUniforms) {
		var uniformValue = mObjUniforms[uniformName];
		var uniformType = getUniformType(uniformValue);

		strUniforms += 'uniform ' + uniformType + ' ' + uniformName + ';\n';
	}

	mShader = mShader.replace('{{UNIFORMS}}', strUniforms);

	return mShader;
};

var bindUniforms = function bindUniforms(mShader, mObjUniforms) {

	for (var uniformName in mObjUniforms) {
		var uniformValue = mObjUniforms[uniformName];
		var uniformType = getUniformType(uniformValue);
		mShader.uniform(uniformName, uniformType, uniformValue);
	}
};

var injectDefines = function injectDefines(mShader, mDefines) {

	return definesToString(mDefines) + '\n' + mShader;
};

var get = function get(vs, fs) {
	var defines = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	var _shader = void 0;
	var _vs = injectDefines(vs, defines);
	var _fs = injectDefines(fs, defines);

	shaderCache.forEach(function (shader) {
		if (_vs === shader.vs && _fs === shader.fs) {
			_shader = shader.glShader;
		}
	});

	if (!_shader) {
		_shader = new _GLShader2.default(_vs, _fs);
		shaderCache.push({
			vs: _vs,
			fs: _fs,
			glShader: _shader
		});
	}

	return _shader;
};

exports.default = {
	get: get,
	addUniforms: addUniforms,
	bindUniforms: bindUniforms,
	injectDefines: injectDefines
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // FrameBuffer.js

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _GLTexture = __webpack_require__(9);

var _GLTexture2 = _interopRequireDefault(_GLTexture);

var _WebglNumber = __webpack_require__(10);

var _WebglNumber2 = _interopRequireDefault(_WebglNumber);

var _objectAssign = __webpack_require__(17);

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gl = void 0;
var webglDepthTexture = void 0;
var hasCheckedMultiRenderSupport = false;
var extDrawBuffer = void 0;

var checkMultiRender = function checkMultiRender() {
	if (_GLTool2.default.webgl2) {
		return true;
	} else {
		extDrawBuffer = _GLTool2.default.getExtension('WEBGL_draw_buffers');
		return !!extDrawBuffer;
	}

	hasCheckedMultiRenderSupport = true;
};

var FrameBuffer = function () {
	function FrameBuffer(mWidth, mHeight) {
		var mParameters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
		var mNumTargets = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

		_classCallCheck(this, FrameBuffer);

		gl = _GLTool2.default.gl;
		webglDepthTexture = _GLTool2.default.checkExtension('WEBGL_depth_texture');

		this.width = mWidth;
		this.height = mHeight;
		this._numTargets = mNumTargets;
		this._multipleTargets = mNumTargets > 1;
		this._parameters = mParameters;

		if (!hasCheckedMultiRenderSupport) {
			checkMultiRender();
		}

		if (this._multipleTargets) {
			this._checkMaxNumRenderTarget();
		}

		this._init();
	}

	_createClass(FrameBuffer, [{
		key: '_init',
		value: function _init() {
			this._initTextures();

			this.frameBuffer = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);

			if (_GLTool2.default.webgl2) {
				// this.renderBufferDepth = gl.createRenderbuffer();
				// gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBufferDepth);
				// gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);
				// gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderBufferDepth);

				var buffers = [];
				for (var i = 0; i < this._numTargets; i++) {
					gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, this._textures[i].texture, 0);
					buffers.push(gl['COLOR_ATTACHMENT' + i]);
				}

				gl.drawBuffers(buffers);

				gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.glDepthTexture.texture, 0);
			} else {
				for (var _i = 0; _i < this._numTargets; _i++) {
					gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + _i, gl.TEXTURE_2D, this._textures[_i].texture, 0);
				}

				if (this._multipleTargets) {
					var drawBuffers = [];
					for (var _i2 = 0; _i2 < this._numTargets; _i2++) {
						drawBuffers.push(extDrawBuffer['COLOR_ATTACHMENT' + _i2 + '_WEBGL']);
					}

					extDrawBuffer.drawBuffersWEBGL(drawBuffers);
				}

				if (webglDepthTexture) {
					gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.glDepthTexture.texture, 0);
				}
			}

			//	CHECKING FBO
			var FBOstatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
			if (FBOstatus != gl.FRAMEBUFFER_COMPLETE) {
				console.error('GL_FRAMEBUFFER_COMPLETE failed, CANNOT use Framebuffer', _WebglNumber2.default[FBOstatus]);
			}

			//	UNBIND

			gl.bindTexture(gl.TEXTURE_2D, null);
			gl.bindRenderbuffer(gl.RENDERBUFFER, null);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			//	CLEAR FRAMEBUFFER 

			this.clear();
		}
	}, {
		key: '_checkMaxNumRenderTarget',
		value: function _checkMaxNumRenderTarget() {
			var maxNumDrawBuffers = _GLTool2.default.gl.getParameter(extDrawBuffer.MAX_DRAW_BUFFERS_WEBGL);
			if (this._numTargets > maxNumDrawBuffers) {
				console.error('Over max number of draw buffers supported : ', maxNumDrawBuffers);
				this._numTargets = maxNumDrawBuffers;
			}
		}
	}, {
		key: '_initTextures',
		value: function _initTextures() {
			this._textures = [];
			for (var i = 0; i < this._numTargets; i++) {
				var glt = this._createTexture();
				this._textures.push(glt);
			}

			if (_GLTool2.default.webgl2) {
				this.glDepthTexture = this._createTexture(gl.DEPTH_COMPONENT16, gl.UNSIGNED_SHORT, gl.DEPTH_COMPONENT, true);
			} else {
				this.glDepthTexture = this._createTexture(gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, gl.DEPTH_COMPONENT, { minFilter: _GLTool2.default.LINEAR });
			}
		}
	}, {
		key: '_createTexture',
		value: function _createTexture(mInternalformat, mTexelType, mFormat) {
			var mParameters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

			var parameters = (0, _objectAssign2.default)({}, this._parameters);
			if (!mFormat) {
				mFormat = mInternalformat;
			}

			parameters.internalFormat = mInternalformat || gl.RGBA;
			parameters.format = mFormat;
			parameters.type = mTexelType || parameters.type || _GLTool2.default.UNSIGNED_BYTE;
			for (var s in mParameters) {
				parameters[s] = mParameters[s];
			}

			var texture = new _GLTexture2.default(null, parameters, this.width, this.height);
			return texture;
		}

		//	PUBLIC METHODS

	}, {
		key: 'bind',
		value: function bind() {
			var mAutoSetViewport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			if (mAutoSetViewport) {
				_GLTool2.default.viewport(0, 0, this.width, this.height);
			}
			gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
		}
	}, {
		key: 'unbind',
		value: function unbind() {
			var mAutoSetViewport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			if (mAutoSetViewport) {
				_GLTool2.default.viewport(0, 0, _GLTool2.default.width, _GLTool2.default.height);
			}
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			this._textures.forEach(function (texture) {
				texture.generateMipmap();
			});
		}
	}, {
		key: 'clear',
		value: function clear() {
			var r = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
			var g = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
			var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
			var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

			this.bind();
			_GLTool2.default.clear(r, g, b, a);
			this.unbind();
		}

		//	TEXTURES

	}, {
		key: 'getTexture',
		value: function getTexture() {
			var mIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			return this._textures[mIndex];
		}
	}, {
		key: 'getDepthTexture',
		value: function getDepthTexture() {
			return this.glDepthTexture;
		}

		//	TOUGHTS : Should I remove these from frame buffer ? 
		//	Shouldn't these be set individually to each texture ? 
		//	e.g. fbo.getTexture(0).minFilter = GL.NEAREST;
		//		 fbo.getTexture(1).minFilter = GL.LINEAR; ... etc ? 

		//	MIPMAP FILTER

	}, {
		key: 'showParameters',


		//	UTILS

		value: function showParameters() {
			this._textures[0].showParameters();
		}
	}, {
		key: 'minFilter',
		get: function get() {
			return this._textures[0].minFilter;
		},
		set: function set(mValue) {
			this._textures.forEach(function (texture) {
				texture.minFilter = mValue;
			});
		}
	}, {
		key: 'magFilter',
		get: function get() {
			return this._textures[0].magFilter;
		},
		set: function set(mValue) {
			this._textures.forEach(function (texture) {
				texture.magFilter = mValue;
			});
		}

		//	WRAPPING

	}, {
		key: 'wrapS',
		get: function get() {
			return this._textures[0].wrapS;
		},
		set: function set(mValue) {
			this._textures.forEach(function (texture) {
				texture.wrapS = mValue;
			});
		}
	}, {
		key: 'wrapT',
		get: function get() {
			return this._textures[0].wrapT;
		},
		set: function set(mValue) {
			this._textures.forEach(function (texture) {
				texture.wrapT = mValue;
			});
		}
	}, {
		key: 'numTargets',
		get: function get() {
			return this._numTargets;
		}
	}]);

	return FrameBuffer;
}();

exports.default = FrameBuffer;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // EaseNumber.js

var _scheduling = __webpack_require__(6);

var _scheduling2 = _interopRequireDefault(_scheduling);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EaseNumber = function () {
	function EaseNumber(mValue) {
		var _this = this;

		var mEasing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.1;

		_classCallCheck(this, EaseNumber);

		this.easing = mEasing;
		this._value = mValue;
		this._targetValue = mValue;
		this._efIndex = _scheduling2.default.addEF(function () {
			return _this._update();
		});
	}

	_createClass(EaseNumber, [{
		key: '_update',
		value: function _update() {
			var MIN_DIFF = 0.0001;
			this._checkLimit();
			this._value += (this._targetValue - this._value) * this.easing;
			if (Math.abs(this._targetValue - this._value) < MIN_DIFF) {
				this._value = this._targetValue;
			}
		}
	}, {
		key: 'setTo',
		value: function setTo(mValue) {
			this._targetValue = this._value = mValue;
		}
	}, {
		key: 'add',
		value: function add(mAdd) {
			this._targetValue += mAdd;
		}
	}, {
		key: 'limit',
		value: function limit(mMin, mMax) {
			if (mMin > mMax) {
				this.limit(mMax, mMin);
				return;
			}

			this._min = mMin;
			this._max = mMax;

			this._checkLimit();
		}
	}, {
		key: '_checkLimit',
		value: function _checkLimit() {
			if (this._min !== undefined && this._targetValue < this._min) {
				this._targetValue = this._min;
			}

			if (this._max !== undefined && this._targetValue > this._max) {
				this._targetValue = this._max;
			}
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			_scheduling2.default.removeEF(this._efIndex);
		}

		//	GETTERS / SETTERS

	}, {
		key: 'value',
		set: function set(mValue) {
			this._targetValue = mValue;
		},
		get: function get() {
			return this._value;
		}
	}, {
		key: 'targetValue',
		get: function get() {
			return this._targetValue;
		}
	}]);

	return EaseNumber;
}();

exports.default = EaseNumber;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Ray.js

var _glMatrix = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var a = _glMatrix.vec3.create();
var b = _glMatrix.vec3.create();
var c = _glMatrix.vec3.create();
var target = _glMatrix.vec3.create();
var edge1 = _glMatrix.vec3.create();
var edge2 = _glMatrix.vec3.create();
var normal = _glMatrix.vec3.create();
var diff = _glMatrix.vec3.create();

var Ray = function () {
	function Ray(mOrigin, mDirection) {
		_classCallCheck(this, Ray);

		this.origin = _glMatrix.vec3.clone(mOrigin);
		this.direction = _glMatrix.vec3.clone(mDirection);
	}

	_createClass(Ray, [{
		key: 'at',
		value: function at(t) {
			_glMatrix.vec3.copy(target, this.direction);
			_glMatrix.vec3.scale(target, target, t);
			_glMatrix.vec3.add(target, target, this.origin);

			return target;
		}
	}, {
		key: 'lookAt',
		value: function lookAt(mTarget) {
			_glMatrix.vec3.sub(this.direction, mTarget, this.origin);
			_glMatrix.vec3.normalize(this.origin, this.origin);
		}
	}, {
		key: 'closestPointToPoint',
		value: function closestPointToPoint(mPoint) {
			var result = _glMatrix.vec3.create();
			_glMatrix.vec3.sub(mPoint, this.origin);
			var directionDistance = _glMatrix.vec3.dot(result, this.direction);

			if (directionDistance < 0) {
				return _glMatrix.vec3.clone(this.origin);
			}

			_glMatrix.vec3.copy(result, this.direction);
			_glMatrix.vec3.scale(result, result, directionDistance);
			_glMatrix.vec3.add(result, result, this.origin);

			return result;
		}
	}, {
		key: 'distanceToPoint',
		value: function distanceToPoint(mPoint) {
			return Math.sqrt(this.distanceSqToPoint(mPoint));
		}
	}, {
		key: 'distanceSqToPoint',
		value: function distanceSqToPoint(mPoint) {
			var v1 = _glMatrix.vec3.create();

			_glMatrix.vec3.sub(v1, mPoint, this.origin);
			var directionDistance = _glMatrix.vec3.dot(v1, this.direction);

			if (directionDistance < 0) {
				return _glMatrix.vec3.squaredDistance(this.origin, mPoint);
			}

			_glMatrix.vec3.copy(v1, this.direction);
			_glMatrix.vec3.scale(v1, v1, directionDistance);
			_glMatrix.vec3.add(v1, v1, this.origin);
			return _glMatrix.vec3.squaredDistance(v1, mPoint);
		}
	}, {
		key: 'intersectsSphere',
		value: function intersectsSphere(mCenter, mRadius) {
			return this.distanceToPoint(mCenter) <= mRadius;
		}
	}, {
		key: 'intersectSphere',
		value: function intersectSphere(mCenter, mRadius) {
			var v1 = _glMatrix.vec3.create();
			_glMatrix.vec3.sub(v1, mCenter, this.origin);
			var tca = _glMatrix.vec3.dot(v1, this.direction);
			var d2 = _glMatrix.vec3.dot(v1, v1) - tca * tca;
			var radius2 = mRadius * mRadius;

			if (d2 > radius2) return null;

			var thc = Math.sqrt(radius2 - d2);

			var t0 = tca - thc;

			var t1 = tca + thc;

			if (t0 < 0 && t1 < 0) return null;

			if (t0 < 0) return this.at(t1);

			return this.at(t0);
		}
	}, {
		key: 'distanceToPlane',
		value: function distanceToPlane(mPlaneCenter, mNormal) {
			var denominator = _glMatrix.vec3.dot(mNormal, this.direction);

			if (denominator === 0) {}
		}
	}, {
		key: 'intersectTriangle',
		value: function intersectTriangle(mPA, mPB, mPC) {
			var backfaceCulling = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

			_glMatrix.vec3.copy(a, mPA);
			_glMatrix.vec3.copy(b, mPB);
			_glMatrix.vec3.copy(c, mPC);

			// const edge1 = vec3.create();
			// const edge2 = vec3.create();
			// const normal = vec3.create();
			// const diff = vec3.create();

			_glMatrix.vec3.sub(edge1, b, a);
			_glMatrix.vec3.sub(edge2, c, a);
			_glMatrix.vec3.cross(normal, edge1, edge2);

			var DdN = _glMatrix.vec3.dot(this.direction, normal);
			var sign = void 0;

			if (DdN > 0) {
				if (backfaceCulling) {
					return null;
				}
				sign = 1;
			} else if (DdN < 0) {
				sign = -1;
				DdN = -DdN;
			} else {
				return null;
			}

			_glMatrix.vec3.sub(diff, this.origin, a);

			_glMatrix.vec3.cross(edge2, diff, edge2);
			var DdQxE2 = sign * _glMatrix.vec3.dot(this.direction, edge2);
			if (DdQxE2 < 0) {
				return null;
			}

			_glMatrix.vec3.cross(edge1, edge1, diff);
			var DdE1xQ = sign * _glMatrix.vec3.dot(this.direction, edge1);
			if (DdE1xQ < 0) {
				return null;
			}

			if (DdQxE2 + DdE1xQ > DdN) {
				return null;
			}

			var Qdn = -sign * _glMatrix.vec3.dot(diff, normal);
			if (Qdn < 0) {
				return null;
			}

			return this.at(Qdn / DdN);
		}
	}]);

	return Ray;
}();

exports.default = Ray;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _simpleColor = __webpack_require__(11);

var _simpleColor2 = _interopRequireDefault(_simpleColor);

var _bigTriangle = __webpack_require__(22);

var _bigTriangle2 = _interopRequireDefault(_bigTriangle);

var _general = __webpack_require__(37);

var _general2 = _interopRequireDefault(_general);

var _copy = __webpack_require__(23);

var _copy2 = _interopRequireDefault(_copy);

var _basic = __webpack_require__(15);

var _basic2 = _interopRequireDefault(_basic);

var _skybox = __webpack_require__(38);

var _skybox2 = _interopRequireDefault(_skybox);

var _skybox3 = __webpack_require__(39);

var _skybox4 = _interopRequireDefault(_skybox3);

var _gltf = __webpack_require__(70);

var _gltf2 = _interopRequireDefault(_gltf);

var _gltf3 = __webpack_require__(71);

var _gltf4 = _interopRequireDefault(_gltf3);

var _debug = __webpack_require__(72);

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ShaderLbs.js

var ShaderLibs = {
	simpleColorFrag: _simpleColor2.default,
	bigTriangleVert: _bigTriangle2.default,
	generalVert: _general2.default,
	copyFrag: _copy2.default,
	basicVert: _basic2.default,
	skyboxVert: _skybox2.default,
	skyboxFrag: _skybox4.default,
	gltfVert: _gltf2.default,
	gltfFrag: _gltf4.default,
	debugFrag: _debug2.default
};

exports.default = ShaderLibs;

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = "// bigTriangle.vert\n\n#define SHADER_NAME BIG_TRIANGLE_VERTEX\n\nprecision mediump float;\n#define GLSLIFY 1\nattribute vec2 aPosition;\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n    gl_Position = vec4(aPosition, 0.0, 1.0);\n    vTextureCoord = aPosition * .5 + .5;\n}"

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = "// copy.frag\n\n#define SHADER_NAME COPY_FRAGMENT\n\nprecision mediump float;\n#define GLSLIFY 1\n\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\n\nvoid main(void) {\n    gl_FragColor = texture2D(texture, vTextureCoord);\n}"

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Camera.js

var _glMatrix = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Camera = function () {
	function Camera() {
		_classCallCheck(this, Camera);

		//	VIEW MATRIX
		this._matrix = _glMatrix.mat4.create();

		//	FOR TRANSFORM FROM ORIENTATION
		this._quat = _glMatrix.quat.create();
		this._orientation = _glMatrix.mat4.create();

		//	PROJECTION MATRIX
		this._projection = _glMatrix.mat4.create();

		//	POSITION OF CAMERA
		this.position = vec3.create();
	}

	_createClass(Camera, [{
		key: 'lookAt',
		value: function lookAt(aEye, aCenter) {
			var aUp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 1, 0];

			this._eye = vec3.clone(aEye);
			this._center = vec3.clone(aCenter);

			vec3.copy(this.position, aEye);
			_glMatrix.mat4.identity(this._matrix);
			_glMatrix.mat4.lookAt(this._matrix, aEye, aCenter, aUp);
		}
	}, {
		key: 'setFromOrientation',
		value: function setFromOrientation(x, y, z, w) {
			_glMatrix.quat.set(this._quat, x, y, z, w);
			_glMatrix.mat4.fromQuat(this._orientation, this._quat);
			_glMatrix.mat4.translate(this._matrix, this._orientation, this.positionOffset);
		}
	}, {
		key: 'setProjection',
		value: function setProjection(mProj) {
			this._projection = _glMatrix.mat4.clone(mProj);
		}
	}, {
		key: 'setView',
		value: function setView(mView) {
			this._matrix = _glMatrix.mat4.clone(mView);
		}
	}, {
		key: 'setFromViewProj',
		value: function setFromViewProj(mView, mProj) {
			this.setView(mView);
			this.setProjection(mProj);
		}

		//	GETTERS 

	}, {
		key: 'matrix',
		get: function get() {
			return this._matrix;
		}
	}, {
		key: 'viewMatrix',
		get: function get() {
			return this._matrix;
		}
	}, {
		key: 'projection',
		get: function get() {
			return this._projection;
		}
	}, {
		key: 'projectionMatrix',
		get: function get() {
			return this._projection;
		}
	}, {
		key: 'eye',
		get: function get() {
			return this._eye;
		}
	}, {
		key: 'center',
		get: function get() {
			return this._center;
		}
	}]);

	return Camera;
}();

exports.default = Camera;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Camera2 = __webpack_require__(24);

var _Camera3 = _interopRequireDefault(_Camera2);

var _Ray = __webpack_require__(20);

var _Ray2 = _interopRequireDefault(_Ray);

var _glMatrix = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // CameraPerspective.js

var mInverseViewProj = _glMatrix.mat4.create();
var cameraDir = _glMatrix.vec3.create();

var CameraPerspective = function (_Camera) {
	_inherits(CameraPerspective, _Camera);

	function CameraPerspective() {
		_classCallCheck(this, CameraPerspective);

		return _possibleConstructorReturn(this, (CameraPerspective.__proto__ || Object.getPrototypeOf(CameraPerspective)).apply(this, arguments));
	}

	_createClass(CameraPerspective, [{
		key: 'setPerspective',
		value: function setPerspective(mFov, mAspectRatio, mNear, mFar) {

			this._fov = mFov;
			this._near = mNear;
			this._far = mFar;
			this._aspectRatio = mAspectRatio;
			_glMatrix.mat4.perspective(this._projection, mFov, mAspectRatio, mNear, mFar);

			// this._frustumTop = this._near * Math.tan(this._fov * 0.5);
			// this._frustumButtom = -this._frustumTop;
			// this._frustumRight = this._frustumTop * this._aspectRatio;
			// this._frustumLeft = -this._frustumRight;
		}
	}, {
		key: 'setAspectRatio',
		value: function setAspectRatio(mAspectRatio) {
			this._aspectRatio = mAspectRatio;
			_glMatrix.mat4.perspective(this.projection, this._fov, mAspectRatio, this._near, this._far);
		}
	}, {
		key: 'generateRay',
		value: function generateRay(mScreenPosition, mRay) {
			var proj = this.projectionMatrix;
			var view = this.viewMatrix;

			_glMatrix.mat4.multiply(mInverseViewProj, proj, view);
			_glMatrix.mat4.invert(mInverseViewProj, mInverseViewProj);

			_glMatrix.vec3.transformMat4(cameraDir, mScreenPosition, mInverseViewProj);
			_glMatrix.vec3.sub(cameraDir, cameraDir, this.position);
			_glMatrix.vec3.normalize(cameraDir, cameraDir);

			if (!mRay) {
				mRay = new _Ray2.default(this.position, cameraDir);
			} else {
				mRay.origin = this.position;
				mRay.direction = cameraDir;
			}

			return mRay;
		}
	}]);

	return CameraPerspective;
}(_Camera3.default);

exports.default = CameraPerspective;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// BinaryLoader.js

var BinaryLoader = function () {
	function BinaryLoader() {
		var _this = this;

		var isArrayBuffer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

		_classCallCheck(this, BinaryLoader);

		this._req = new XMLHttpRequest();
		this._req.addEventListener('load', function (e) {
			return _this._onLoaded(e);
		});
		this._req.addEventListener('progress', function (e) {
			return _this._onProgress(e);
		});
		if (isArrayBuffer) {
			this._req.responseType = 'arraybuffer';
		}
	}

	_createClass(BinaryLoader, [{
		key: 'load',
		value: function load(url, callback) {
			console.log('Loading : ', url);
			this._callback = callback;

			this._req.open('GET', url);
			this._req.send();
		}
	}, {
		key: '_onLoaded',
		value: function _onLoaded() {
			this._callback(this._req.response);
		}
	}, {
		key: '_onProgress',
		value: function _onProgress() /* e*/{
			// console.log('on Progress:', (e.loaded/e.total*100).toFixed(2));
		}
	}]);

	return BinaryLoader;
}();

exports.default = BinaryLoader;

/***/ }),
/* 27 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ShaderLibs = exports.Shaders = exports.View3D = exports.View = exports.Scene = exports.BatchFXAA = exports.BatchSky = exports.BatchSkybox = exports.BatchLine = exports.BatchDotsPlane = exports.BatchBall = exports.BatchAxis = exports.BatchCopy = exports.PassFxaa = exports.PassHBlur = exports.PassVBlur = exports.PassBlur = exports.PassMacro = exports.Pass = exports.EffectComposer = exports.ColladaParser = exports.loadImages = exports.GLTFLoader = exports.HDRLoader = exports.ObjLoader = exports.BinaryLoader = exports.Object3D = exports.Ray = exports.CameraCube = exports.CameraPerspective = exports.CameraOrtho = exports.Camera = exports.TouchDetector = exports.QuatRotation = exports.WebglNumber = exports.OrbitalControl = exports.TweenNumber = exports.EaseNumber = exports.EventDispatcher = exports.Scheduler = exports.TransformFeedbackObject = exports.MultisampleFrameBuffer = exports.CubeFrameBuffer = exports.FrameBuffer = exports.Batch = exports.Geom = exports.Material = exports.Geometry = exports.Mesh = exports.GLCubeTexture = exports.GLTexture = exports.GLShader = exports.GL = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // alfrid.js

//	WEBGL 2


//	TOOLS


//	SHADERS


//	CAMERAS


//	MATH


//	OBJECT


//	LOADERS


//	POST EFFECT


//	HELPERS


var _glMatrix = __webpack_require__(2);

var GLM = _interopRequireWildcard(_glMatrix);

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _GLShader = __webpack_require__(1);

var _GLShader2 = _interopRequireDefault(_GLShader);

var _GLTexture = __webpack_require__(9);

var _GLTexture2 = _interopRequireDefault(_GLTexture);

var _GLCubeTexture = __webpack_require__(14);

var _GLCubeTexture2 = _interopRequireDefault(_GLCubeTexture);

var _Mesh = __webpack_require__(13);

var _Mesh2 = _interopRequireDefault(_Mesh);

var _Geometry = __webpack_require__(3);

var _Geometry2 = _interopRequireDefault(_Geometry);

var _Material = __webpack_require__(34);

var _Material2 = _interopRequireDefault(_Material);

var _Geom = __webpack_require__(7);

var _Geom2 = _interopRequireDefault(_Geom);

var _Batch = __webpack_require__(5);

var _Batch2 = _interopRequireDefault(_Batch);

var _FrameBuffer = __webpack_require__(18);

var _FrameBuffer2 = _interopRequireDefault(_FrameBuffer);

var _CubeFrameBuffer = __webpack_require__(63);

var _CubeFrameBuffer2 = _interopRequireDefault(_CubeFrameBuffer);

var _MultisampleFrameBuffer = __webpack_require__(64);

var _MultisampleFrameBuffer2 = _interopRequireDefault(_MultisampleFrameBuffer);

var _TransformFeedbackObject = __webpack_require__(65);

var _TransformFeedbackObject2 = _interopRequireDefault(_TransformFeedbackObject);

var _scheduling = __webpack_require__(6);

var _scheduling2 = _interopRequireDefault(_scheduling);

var _EventDispatcher = __webpack_require__(35);

var _EventDispatcher2 = _interopRequireDefault(_EventDispatcher);

var _EaseNumber = __webpack_require__(19);

var _EaseNumber2 = _interopRequireDefault(_EaseNumber);

var _TweenNumber = __webpack_require__(66);

var _TweenNumber2 = _interopRequireDefault(_TweenNumber);

var _OrbitalControl = __webpack_require__(36);

var _OrbitalControl2 = _interopRequireDefault(_OrbitalControl);

var _QuatRotation = __webpack_require__(67);

var _QuatRotation2 = _interopRequireDefault(_QuatRotation);

var _TouchDetector = __webpack_require__(68);

var _TouchDetector2 = _interopRequireDefault(_TouchDetector);

var _WebglNumber = __webpack_require__(10);

var _WebglNumber2 = _interopRequireDefault(_WebglNumber);

var _WebglConst = __webpack_require__(32);

var _WebglConst2 = _interopRequireDefault(_WebglConst);

var _Shaders = __webpack_require__(16);

var _Shaders2 = _interopRequireDefault(_Shaders);

var _ShaderLibs = __webpack_require__(21);

var _ShaderLibs2 = _interopRequireDefault(_ShaderLibs);

var _Camera = __webpack_require__(24);

var _Camera2 = _interopRequireDefault(_Camera);

var _CameraOrtho = __webpack_require__(40);

var _CameraOrtho2 = _interopRequireDefault(_CameraOrtho);

var _CameraPerspective = __webpack_require__(25);

var _CameraPerspective2 = _interopRequireDefault(_CameraPerspective);

var _CameraCube = __webpack_require__(73);

var _CameraCube2 = _interopRequireDefault(_CameraCube);

var _Ray = __webpack_require__(20);

var _Ray2 = _interopRequireDefault(_Ray);

var _Object3D = __webpack_require__(8);

var _Object3D2 = _interopRequireDefault(_Object3D);

var _BinaryLoader = __webpack_require__(26);

var _BinaryLoader2 = _interopRequireDefault(_BinaryLoader);

var _ObjLoader = __webpack_require__(74);

var _ObjLoader2 = _interopRequireDefault(_ObjLoader);

var _HDRLoader = __webpack_require__(75);

var _HDRLoader2 = _interopRequireDefault(_HDRLoader);

var _ColladaParser = __webpack_require__(77);

var _ColladaParser2 = _interopRequireDefault(_ColladaParser);

var _GltfLoader = __webpack_require__(80);

var _GltfLoader2 = _interopRequireDefault(_GltfLoader);

var _loadImages = __webpack_require__(41);

var _loadImages2 = _interopRequireDefault(_loadImages);

var _EffectComposer = __webpack_require__(85);

var _EffectComposer2 = _interopRequireDefault(_EffectComposer);

var _Pass = __webpack_require__(12);

var _Pass2 = _interopRequireDefault(_Pass);

var _PassMacro = __webpack_require__(43);

var _PassMacro2 = _interopRequireDefault(_PassMacro);

var _PassBlur = __webpack_require__(86);

var _PassBlur2 = _interopRequireDefault(_PassBlur);

var _PassVBlur = __webpack_require__(44);

var _PassVBlur2 = _interopRequireDefault(_PassVBlur);

var _PassHBlur = __webpack_require__(46);

var _PassHBlur2 = _interopRequireDefault(_PassHBlur);

var _PassFxaa = __webpack_require__(90);

var _PassFxaa2 = _interopRequireDefault(_PassFxaa);

var _BatchCopy = __webpack_require__(91);

var _BatchCopy2 = _interopRequireDefault(_BatchCopy);

var _BatchAxis = __webpack_require__(92);

var _BatchAxis2 = _interopRequireDefault(_BatchAxis);

var _BatchBall = __webpack_require__(95);

var _BatchBall2 = _interopRequireDefault(_BatchBall);

var _BatchDotsPlane = __webpack_require__(96);

var _BatchDotsPlane2 = _interopRequireDefault(_BatchDotsPlane);

var _BatchLine = __webpack_require__(98);

var _BatchLine2 = _interopRequireDefault(_BatchLine);

var _BatchSkybox = __webpack_require__(99);

var _BatchSkybox2 = _interopRequireDefault(_BatchSkybox);

var _BatchSky = __webpack_require__(100);

var _BatchSky2 = _interopRequireDefault(_BatchSky);

var _BatchFXAA = __webpack_require__(102);

var _BatchFXAA2 = _interopRequireDefault(_BatchFXAA);

var _Scene = __webpack_require__(103);

var _Scene2 = _interopRequireDefault(_Scene);

var _View = __webpack_require__(104);

var _View2 = _interopRequireDefault(_View);

var _View3D = __webpack_require__(105);

var _View3D2 = _interopRequireDefault(_View3D);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VERSION = '0.2.0';

var Alfrid = function () {
	function Alfrid() {
		_classCallCheck(this, Alfrid);

		this.glm = GLM;
		this.GL = _GLTool2.default;
		this.GLTool = _GLTool2.default;
		this.GLShader = _GLShader2.default;
		this.GLTexture = _GLTexture2.default;
		this.GLCubeTexture = _GLCubeTexture2.default;
		this.Mesh = _Mesh2.default;
		this.Geometry = _Geometry2.default;
		this.Material = _Material2.default;
		this.Geom = _Geom2.default;
		this.Batch = _Batch2.default;
		this.FrameBuffer = _FrameBuffer2.default;
		this.CubeFrameBuffer = _CubeFrameBuffer2.default;
		this.Scheduler = _scheduling2.default;
		this.EventDispatcher = _EventDispatcher2.default;
		this.EaseNumber = _EaseNumber2.default;
		this.TweenNumber = _TweenNumber2.default;
		this.Camera = _Camera2.default;
		this.CameraOrtho = _CameraOrtho2.default;
		this.CameraPerspective = _CameraPerspective2.default;
		this.Ray = _Ray2.default;
		this.CameraCube = _CameraCube2.default;
		this.OrbitalControl = _OrbitalControl2.default;
		this.QuatRotation = _QuatRotation2.default;
		this.TouchDetector = _TouchDetector2.default;
		this.BinaryLoader = _BinaryLoader2.default;
		this.ObjLoader = _ObjLoader2.default;
		this.ColladaParser = _ColladaParser2.default;
		this.HDRLoader = _HDRLoader2.default;
		this.GLTFLoader = _GltfLoader2.default;
		this.loadImages = _loadImages2.default;
		this.BatchCopy = _BatchCopy2.default;
		this.BatchAxis = _BatchAxis2.default;
		this.BatchBall = _BatchBall2.default;
		this.BatchBall = _BatchBall2.default;
		this.BatchLine = _BatchLine2.default;
		this.BatchSkybox = _BatchSkybox2.default;
		this.BatchSky = _BatchSky2.default;
		this.BatchFXAA = _BatchFXAA2.default;
		this.BatchDotsPlane = _BatchDotsPlane2.default;
		this.Scene = _Scene2.default;
		this.View = _View2.default;
		this.View3D = _View3D2.default;
		this.Object3D = _Object3D2.default;
		this.Shaders = _Shaders2.default;
		this.ShaderLibs = _ShaderLibs2.default;
		this.WebglNumber = _WebglNumber2.default;

		this.EffectComposer = _EffectComposer2.default;
		this.Pass = _Pass2.default;
		this.PassMacro = _PassMacro2.default;
		this.PassBlur = _PassBlur2.default;
		this.PassVBlur = _PassVBlur2.default;
		this.PassHBlur = _PassHBlur2.default;
		this.PassFxaa = _PassFxaa2.default;

		this.MultisampleFrameBuffer = _MultisampleFrameBuffer2.default;
		this.TransformFeedbackObject = _TransformFeedbackObject2.default;

		//	NOT SUPER SURE I'VE DONE THIS IS A GOOD WAY

		for (var s in GLM) {
			if (GLM[s]) {
				window[s] = GLM[s];
			}
		}
	}

	_createClass(Alfrid, [{
		key: 'log',
		value: function log() {
			if (navigator.userAgent.indexOf('Chrome') > -1) {
				console.log('%clib alfrid : VERSION ' + VERSION, 'background: #193441; color: #FCFFF5');
			} else {
				console.log('lib alfrid : VERSION ', VERSION);
			}
			console.log('%cClasses : ', 'color: #193441');

			for (var s in this) {
				if (this[s]) {
					console.log('%c - ' + s, 'color: #3E606F');
				}
			}
		}
	}]);

	return Alfrid;
}();

var al = new Alfrid();

exports.default = al;
exports.GL = _GLTool2.default;
exports.GLShader = _GLShader2.default;
exports.GLTexture = _GLTexture2.default;
exports.GLCubeTexture = _GLCubeTexture2.default;
exports.Mesh = _Mesh2.default;
exports.Geometry = _Geometry2.default;
exports.Material = _Material2.default;
exports.Geom = _Geom2.default;
exports.Batch = _Batch2.default;
exports.FrameBuffer = _FrameBuffer2.default;
exports.CubeFrameBuffer = _CubeFrameBuffer2.default;
exports.MultisampleFrameBuffer = _MultisampleFrameBuffer2.default;
exports.TransformFeedbackObject = _TransformFeedbackObject2.default;
exports.Scheduler = _scheduling2.default;
exports.EventDispatcher = _EventDispatcher2.default;
exports.EaseNumber = _EaseNumber2.default;
exports.TweenNumber = _TweenNumber2.default;
exports.OrbitalControl = _OrbitalControl2.default;
exports.WebglNumber = _WebglNumber2.default;
exports.QuatRotation = _QuatRotation2.default;
exports.TouchDetector = _TouchDetector2.default;
exports.Camera = _Camera2.default;
exports.CameraOrtho = _CameraOrtho2.default;
exports.CameraPerspective = _CameraPerspective2.default;
exports.CameraCube = _CameraCube2.default;
exports.Ray = _Ray2.default;
exports.Object3D = _Object3D2.default;
exports.BinaryLoader = _BinaryLoader2.default;
exports.ObjLoader = _ObjLoader2.default;
exports.HDRLoader = _HDRLoader2.default;
exports.GLTFLoader = _GltfLoader2.default;
exports.loadImages = _loadImages2.default;
exports.ColladaParser = _ColladaParser2.default;
exports.EffectComposer = _EffectComposer2.default;
exports.Pass = _Pass2.default;
exports.PassMacro = _PassMacro2.default;
exports.PassBlur = _PassBlur2.default;
exports.PassVBlur = _PassVBlur2.default;
exports.PassHBlur = _PassHBlur2.default;
exports.PassFxaa = _PassFxaa2.default;
exports.BatchCopy = _BatchCopy2.default;
exports.BatchAxis = _BatchAxis2.default;
exports.BatchBall = _BatchBall2.default;
exports.BatchDotsPlane = _BatchDotsPlane2.default;
exports.BatchLine = _BatchLine2.default;
exports.BatchSkybox = _BatchSkybox2.default;
exports.BatchSky = _BatchSky2.default;
exports.BatchFXAA = _BatchFXAA2.default;
exports.Scene = _Scene2.default;
exports.View = _View2.default;
exports.View3D = _View3D2.default;
exports.Shaders = _Shaders2.default;
exports.ShaderLibs = _ShaderLibs2.default;

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["create"] = create;
/* harmony export (immutable) */ __webpack_exports__["fromMat4"] = fromMat4;
/* harmony export (immutable) */ __webpack_exports__["clone"] = clone;
/* harmony export (immutable) */ __webpack_exports__["copy"] = copy;
/* harmony export (immutable) */ __webpack_exports__["fromValues"] = fromValues;
/* harmony export (immutable) */ __webpack_exports__["set"] = set;
/* harmony export (immutable) */ __webpack_exports__["identity"] = identity;
/* harmony export (immutable) */ __webpack_exports__["transpose"] = transpose;
/* harmony export (immutable) */ __webpack_exports__["invert"] = invert;
/* harmony export (immutable) */ __webpack_exports__["adjoint"] = adjoint;
/* harmony export (immutable) */ __webpack_exports__["determinant"] = determinant;
/* harmony export (immutable) */ __webpack_exports__["multiply"] = multiply;
/* harmony export (immutable) */ __webpack_exports__["translate"] = translate;
/* harmony export (immutable) */ __webpack_exports__["rotate"] = rotate;
/* harmony export (immutable) */ __webpack_exports__["scale"] = scale;
/* harmony export (immutable) */ __webpack_exports__["fromTranslation"] = fromTranslation;
/* harmony export (immutable) */ __webpack_exports__["fromRotation"] = fromRotation;
/* harmony export (immutable) */ __webpack_exports__["fromScaling"] = fromScaling;
/* harmony export (immutable) */ __webpack_exports__["fromMat2d"] = fromMat2d;
/* harmony export (immutable) */ __webpack_exports__["fromQuat"] = fromQuat;
/* harmony export (immutable) */ __webpack_exports__["normalFromMat4"] = normalFromMat4;
/* harmony export (immutable) */ __webpack_exports__["projection"] = projection;
/* harmony export (immutable) */ __webpack_exports__["str"] = str;
/* harmony export (immutable) */ __webpack_exports__["frob"] = frob;
/* harmony export (immutable) */ __webpack_exports__["add"] = add;
/* harmony export (immutable) */ __webpack_exports__["subtract"] = subtract;
/* harmony export (immutable) */ __webpack_exports__["multiplyScalar"] = multiplyScalar;
/* harmony export (immutable) */ __webpack_exports__["multiplyScalarAndAdd"] = multiplyScalarAndAdd;
/* harmony export (immutable) */ __webpack_exports__["exactEquals"] = exactEquals;
/* harmony export (immutable) */ __webpack_exports__["equals"] = equals;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(4);
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */



/**
 * 3x3 Matrix
 * @module mat3
 */

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */
function create() {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](9);
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}

/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */
function fromMat4(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[4];
  out[4] = a[5];
  out[5] = a[6];
  out[6] = a[8];
  out[7] = a[9];
  out[8] = a[10];
  return out;
}

/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */
function clone(a) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](9);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}

/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}

/**
 * Create a new mat3 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} A new mat3
 */
function fromValues(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](9);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m10;
  out[4] = m11;
  out[5] = m12;
  out[6] = m20;
  out[7] = m21;
  out[8] = m22;
  return out;
}

/**
 * Set the components of a mat3 to the given values
 *
 * @param {mat3} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} out
 */
function set(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m10;
  out[4] = m11;
  out[5] = m12;
  out[6] = m20;
  out[7] = m21;
  out[8] = m22;
  return out;
}

/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */
function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}

/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    let a01 = a[1], a02 = a[2], a12 = a[5];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a01;
    out[5] = a[7];
    out[6] = a02;
    out[7] = a12;
  } else {
    out[0] = a[0];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a[1];
    out[4] = a[4];
    out[5] = a[7];
    out[6] = a[2];
    out[7] = a[5];
    out[8] = a[8];
  }

  return out;
}

/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
function invert(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2];
  let a10 = a[3], a11 = a[4], a12 = a[5];
  let a20 = a[6], a21 = a[7], a22 = a[8];

  let b01 = a22 * a11 - a12 * a21;
  let b11 = -a22 * a10 + a12 * a20;
  let b21 = a21 * a10 - a11 * a20;

  // Calculate the determinant
  let det = a00 * b01 + a01 * b11 + a02 * b21;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  out[0] = b01 * det;
  out[1] = (-a22 * a01 + a02 * a21) * det;
  out[2] = (a12 * a01 - a02 * a11) * det;
  out[3] = b11 * det;
  out[4] = (a22 * a00 - a02 * a20) * det;
  out[5] = (-a12 * a00 + a02 * a10) * det;
  out[6] = b21 * det;
  out[7] = (-a21 * a00 + a01 * a20) * det;
  out[8] = (a11 * a00 - a01 * a10) * det;
  return out;
}

/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
function adjoint(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2];
  let a10 = a[3], a11 = a[4], a12 = a[5];
  let a20 = a[6], a21 = a[7], a22 = a[8];

  out[0] = (a11 * a22 - a12 * a21);
  out[1] = (a02 * a21 - a01 * a22);
  out[2] = (a01 * a12 - a02 * a11);
  out[3] = (a12 * a20 - a10 * a22);
  out[4] = (a00 * a22 - a02 * a20);
  out[5] = (a02 * a10 - a00 * a12);
  out[6] = (a10 * a21 - a11 * a20);
  out[7] = (a01 * a20 - a00 * a21);
  out[8] = (a00 * a11 - a01 * a10);
  return out;
}

/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */
function determinant(a) {
  let a00 = a[0], a01 = a[1], a02 = a[2];
  let a10 = a[3], a11 = a[4], a12 = a[5];
  let a20 = a[6], a21 = a[7], a22 = a[8];

  return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
}

/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
function multiply(out, a, b) {
  let a00 = a[0], a01 = a[1], a02 = a[2];
  let a10 = a[3], a11 = a[4], a12 = a[5];
  let a20 = a[6], a21 = a[7], a22 = a[8];

  let b00 = b[0], b01 = b[1], b02 = b[2];
  let b10 = b[3], b11 = b[4], b12 = b[5];
  let b20 = b[6], b21 = b[7], b22 = b[8];

  out[0] = b00 * a00 + b01 * a10 + b02 * a20;
  out[1] = b00 * a01 + b01 * a11 + b02 * a21;
  out[2] = b00 * a02 + b01 * a12 + b02 * a22;

  out[3] = b10 * a00 + b11 * a10 + b12 * a20;
  out[4] = b10 * a01 + b11 * a11 + b12 * a21;
  out[5] = b10 * a02 + b11 * a12 + b12 * a22;

  out[6] = b20 * a00 + b21 * a10 + b22 * a20;
  out[7] = b20 * a01 + b21 * a11 + b22 * a21;
  out[8] = b20 * a02 + b21 * a12 + b22 * a22;
  return out;
}

/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */
function translate(out, a, v) {
  let a00 = a[0], a01 = a[1], a02 = a[2],
    a10 = a[3], a11 = a[4], a12 = a[5],
    a20 = a[6], a21 = a[7], a22 = a[8],
    x = v[0], y = v[1];

  out[0] = a00;
  out[1] = a01;
  out[2] = a02;

  out[3] = a10;
  out[4] = a11;
  out[5] = a12;

  out[6] = x * a00 + y * a10 + a20;
  out[7] = x * a01 + y * a11 + a21;
  out[8] = x * a02 + y * a12 + a22;
  return out;
}

/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
function rotate(out, a, rad) {
  let a00 = a[0], a01 = a[1], a02 = a[2],
    a10 = a[3], a11 = a[4], a12 = a[5],
    a20 = a[6], a21 = a[7], a22 = a[8],

    s = Math.sin(rad),
    c = Math.cos(rad);

  out[0] = c * a00 + s * a10;
  out[1] = c * a01 + s * a11;
  out[2] = c * a02 + s * a12;

  out[3] = c * a10 - s * a00;
  out[4] = c * a11 - s * a01;
  out[5] = c * a12 - s * a02;

  out[6] = a20;
  out[7] = a21;
  out[8] = a22;
  return out;
};

/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/
function scale(out, a, v) {
  let x = v[0], y = v[1];

  out[0] = x * a[0];
  out[1] = x * a[1];
  out[2] = x * a[2];

  out[3] = y * a[3];
  out[4] = y * a[4];
  out[5] = y * a[5];

  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.translate(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Translation vector
 * @returns {mat3} out
 */
function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = v[0];
  out[7] = v[1];
  out[8] = 1;
  return out;
}

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.rotate(dest, dest, rad);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
function fromRotation(out, rad) {
  let s = Math.sin(rad), c = Math.cos(rad);

  out[0] = c;
  out[1] = s;
  out[2] = 0;

  out[3] = -s;
  out[4] = c;
  out[5] = 0;

  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.scale(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat3} out
 */
function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;

  out[3] = 0;
  out[4] = v[1];
  out[5] = 0;

  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}

/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat2d} a the matrix to copy
 * @returns {mat3} out
 **/
function fromMat2d(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = 0;

  out[3] = a[2];
  out[4] = a[3];
  out[5] = 0;

  out[6] = a[4];
  out[7] = a[5];
  out[8] = 1;
  return out;
}

/**
* Calculates a 3x3 matrix from the given quaternion
*
* @param {mat3} out mat3 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat3} out
*/
function fromQuat(out, q) {
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;

  let xx = x * x2;
  let yx = y * x2;
  let yy = y * y2;
  let zx = z * x2;
  let zy = z * y2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;

  out[0] = 1 - yy - zz;
  out[3] = yx - wz;
  out[6] = zx + wy;

  out[1] = yx + wz;
  out[4] = 1 - xx - zz;
  out[7] = zy - wx;

  out[2] = zx - wy;
  out[5] = zy + wx;
  out[8] = 1 - xx - yy;

  return out;
}

/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* @param {mat3} out mat3 receiving operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {mat3} out
*/
function normalFromMat4(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32;

  // Calculate the determinant
  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

  out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

  out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

  return out;
}

/**
 * Generates a 2D projection matrix with the given bounds
 *
 * @param {mat3} out mat3 frustum matrix will be written into
 * @param {number} width Width of your gl context
 * @param {number} height Height of gl context
 * @returns {mat3} out
 */
function projection(out, width, height) {
    out[0] = 2 / width;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = -2 / height;
    out[5] = 0;
    out[6] = -1;
    out[7] = 1;
    out[8] = 1;
    return out;
}

/**
 * Returns a string representation of a mat3
 *
 * @param {mat3} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
function str(a) {
  return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' +
          a[3] + ', ' + a[4] + ', ' + a[5] + ', ' +
          a[6] + ', ' + a[7] + ', ' + a[8] + ')';
}

/**
 * Returns Frobenius norm of a mat3
 *
 * @param {mat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
function frob(a) {
  return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2)))
}

/**
 * Adds two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  return out;
}

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  return out;
}



/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat3} out
 */
function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  return out;
}

/**
 * Adds two mat3's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat3} out the receiving vector
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat3} out
 */
function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  out[2] = a[2] + (b[2] * scale);
  out[3] = a[3] + (b[3] * scale);
  out[4] = a[4] + (b[4] * scale);
  out[5] = a[5] + (b[5] * scale);
  out[6] = a[6] + (b[6] * scale);
  out[7] = a[7] + (b[7] * scale);
  out[8] = a[8] + (b[8] * scale);
  return out;
}

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat3} a The first matrix.
 * @param {mat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] &&
         a[3] === b[3] && a[4] === b[4] && a[5] === b[5] &&
         a[6] === b[6] && a[7] === b[7] && a[8] === b[8];
}

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat3} a The first matrix.
 * @param {mat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function equals(a, b) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7], a8 = a[8];
  let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8];
  return (Math.abs(a0 - b0) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
          Math.abs(a1 - b1) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
          Math.abs(a2 - b2) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
          Math.abs(a3 - b3) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
          Math.abs(a4 - b4) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
          Math.abs(a5 - b5) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a5), Math.abs(b5)) &&
          Math.abs(a6 - b6) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a6), Math.abs(b6)) &&
          Math.abs(a7 - b7) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a7), Math.abs(b7)) &&
          Math.abs(a8 - b8) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a8), Math.abs(b8)));
}

/**
 * Alias for {@link mat3.multiply}
 * @function
 */
const mul = multiply;
/* harmony export (immutable) */ __webpack_exports__["mul"] = mul;


/**
 * Alias for {@link mat3.subtract}
 * @function
 */
const sub = subtract;
/* harmony export (immutable) */ __webpack_exports__["sub"] = sub;



/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["create"] = create;
/* harmony export (immutable) */ __webpack_exports__["clone"] = clone;
/* harmony export (immutable) */ __webpack_exports__["length"] = length;
/* harmony export (immutable) */ __webpack_exports__["fromValues"] = fromValues;
/* harmony export (immutable) */ __webpack_exports__["copy"] = copy;
/* harmony export (immutable) */ __webpack_exports__["set"] = set;
/* harmony export (immutable) */ __webpack_exports__["add"] = add;
/* harmony export (immutable) */ __webpack_exports__["subtract"] = subtract;
/* harmony export (immutable) */ __webpack_exports__["multiply"] = multiply;
/* harmony export (immutable) */ __webpack_exports__["divide"] = divide;
/* harmony export (immutable) */ __webpack_exports__["ceil"] = ceil;
/* harmony export (immutable) */ __webpack_exports__["floor"] = floor;
/* harmony export (immutable) */ __webpack_exports__["min"] = min;
/* harmony export (immutable) */ __webpack_exports__["max"] = max;
/* harmony export (immutable) */ __webpack_exports__["round"] = round;
/* harmony export (immutable) */ __webpack_exports__["scale"] = scale;
/* harmony export (immutable) */ __webpack_exports__["scaleAndAdd"] = scaleAndAdd;
/* harmony export (immutable) */ __webpack_exports__["distance"] = distance;
/* harmony export (immutable) */ __webpack_exports__["squaredDistance"] = squaredDistance;
/* harmony export (immutable) */ __webpack_exports__["squaredLength"] = squaredLength;
/* harmony export (immutable) */ __webpack_exports__["negate"] = negate;
/* harmony export (immutable) */ __webpack_exports__["inverse"] = inverse;
/* harmony export (immutable) */ __webpack_exports__["normalize"] = normalize;
/* harmony export (immutable) */ __webpack_exports__["dot"] = dot;
/* harmony export (immutable) */ __webpack_exports__["cross"] = cross;
/* harmony export (immutable) */ __webpack_exports__["lerp"] = lerp;
/* harmony export (immutable) */ __webpack_exports__["hermite"] = hermite;
/* harmony export (immutable) */ __webpack_exports__["bezier"] = bezier;
/* harmony export (immutable) */ __webpack_exports__["random"] = random;
/* harmony export (immutable) */ __webpack_exports__["transformMat4"] = transformMat4;
/* harmony export (immutable) */ __webpack_exports__["transformMat3"] = transformMat3;
/* harmony export (immutable) */ __webpack_exports__["transformQuat"] = transformQuat;
/* harmony export (immutable) */ __webpack_exports__["rotateX"] = rotateX;
/* harmony export (immutable) */ __webpack_exports__["rotateY"] = rotateY;
/* harmony export (immutable) */ __webpack_exports__["rotateZ"] = rotateZ;
/* harmony export (immutable) */ __webpack_exports__["angle"] = angle;
/* harmony export (immutable) */ __webpack_exports__["str"] = str;
/* harmony export (immutable) */ __webpack_exports__["exactEquals"] = exactEquals;
/* harmony export (immutable) */ __webpack_exports__["equals"] = equals;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(4);
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */



/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
function create() {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](3);
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  return out;
}

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
function clone(a) {
  var out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
function length(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  return Math.sqrt(x*x + y*y + z*z);
}

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
function fromValues(x, y, z) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}

/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */
function set(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}

/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}

/**
 * Math.ceil the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to ceil
 * @returns {vec3} out
 */
function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  return out;
}

/**
 * Math.floor the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to floor
 * @returns {vec3} out
 */
function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  return out;
}

/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
}

/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
}

/**
 * Math.round the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to round
 * @returns {vec3} out
 */
function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  return out;
}

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */
function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  out[2] = a[2] + (b[2] * scale);
  return out;
}

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
function distance(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  let z = b[2] - a[2];
  return Math.sqrt(x*x + y*y + z*z);
}

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
function squaredDistance(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  let z = b[2] - a[2];
  return x*x + y*y + z*z;
}

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
function squaredLength(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  return x*x + y*y + z*z;
}

/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */
function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}

/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to invert
 * @returns {vec3} out
 */
function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
}

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
function normalize(out, a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let len = x*x + y*y + z*z;
  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
    out[0] = a[0] * len;
    out[1] = a[1] * len;
    out[2] = a[2] * len;
  }
  return out;
}

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function cross(out, a, b) {
  let ax = a[0], ay = a[1], az = a[2];
  let bx = b[0], by = b[1], bz = b[2];

  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
function lerp(out, a, b, t) {
  let ax = a[0];
  let ay = a[1];
  let az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}

/**
 * Performs a hermite interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
function hermite(out, a, b, c, d, t) {
  let factorTimes2 = t * t;
  let factor1 = factorTimes2 * (2 * t - 3) + 1;
  let factor2 = factorTimes2 * (t - 2) + t;
  let factor3 = factorTimes2 * (t - 1);
  let factor4 = factorTimes2 * (3 - 2 * t);

  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;

  return out;
}

/**
 * Performs a bezier interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
function bezier(out, a, b, c, d, t) {
  let inverseFactor = 1 - t;
  let inverseFactorTimesTwo = inverseFactor * inverseFactor;
  let factorTimes2 = t * t;
  let factor1 = inverseFactorTimesTwo * inverseFactor;
  let factor2 = 3 * t * inverseFactorTimesTwo;
  let factor3 = 3 * factorTimes2 * inverseFactor;
  let factor4 = factorTimes2 * t;

  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;

  return out;
}

/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */
function random(out, scale) {
  scale = scale || 1.0;

  let r = __WEBPACK_IMPORTED_MODULE_0__common__["RANDOM"]() * 2.0 * Math.PI;
  let z = (__WEBPACK_IMPORTED_MODULE_0__common__["RANDOM"]() * 2.0) - 1.0;
  let zScale = Math.sqrt(1.0-z*z) * scale;

  out[0] = Math.cos(r) * zScale;
  out[1] = Math.sin(r) * zScale;
  out[2] = z * scale;
  return out;
}

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
function transformMat4(out, a, m) {
  let x = a[0], y = a[1], z = a[2];
  let w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}

/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat3} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */
function transformMat3(out, a, m) {
  let x = a[0], y = a[1], z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}

/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */
function transformQuat(out, a, q) {
  // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

  let x = a[0], y = a[1], z = a[2];
  let qx = q[0], qy = q[1], qz = q[2], qw = q[3];

  // calculate quat * vec
  let ix = qw * x + qy * z - qz * y;
  let iy = qw * y + qz * x - qx * z;
  let iz = qw * z + qx * y - qy * x;
  let iw = -qx * x - qy * y - qz * z;

  // calculate result * inverse quat
  out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  return out;
}

/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
function rotateX(out, a, b, c){
  let p = [], r=[];
  //Translate point to the origin
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];

  //perform rotation
  r[0] = p[0];
  r[1] = p[1]*Math.cos(c) - p[2]*Math.sin(c);
  r[2] = p[1]*Math.sin(c) + p[2]*Math.cos(c);

  //translate to correct position
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];

  return out;
}

/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
function rotateY(out, a, b, c){
  let p = [], r=[];
  //Translate point to the origin
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];

  //perform rotation
  r[0] = p[2]*Math.sin(c) + p[0]*Math.cos(c);
  r[1] = p[1];
  r[2] = p[2]*Math.cos(c) - p[0]*Math.sin(c);

  //translate to correct position
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];

  return out;
}

/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
function rotateZ(out, a, b, c){
  let p = [], r=[];
  //Translate point to the origin
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];

  //perform rotation
  r[0] = p[0]*Math.cos(c) - p[1]*Math.sin(c);
  r[1] = p[0]*Math.sin(c) + p[1]*Math.cos(c);
  r[2] = p[2];

  //translate to correct position
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];

  return out;
}

/**
 * Get the angle between two 3D vectors
 * @param {vec3} a The first operand
 * @param {vec3} b The second operand
 * @returns {Number} The angle in radians
 */
function angle(a, b) {
  let tempA = fromValues(a[0], a[1], a[2]);
  let tempB = fromValues(b[0], b[1], b[2]);

  normalize(tempA, tempA);
  normalize(tempB, tempB);

  let cosine = dot(tempA, tempB);

  if(cosine > 1.0) {
    return 0;
  }
  else if(cosine < -1.0) {
    return Math.PI;
  } else {
    return Math.acos(cosine);
  }
}

/**
 * Returns a string representation of a vector
 *
 * @param {vec3} a vector to represent as a string
 * @returns {String} string representation of the vector
 */
function str(a) {
  return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
}

/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function equals(a, b) {
  let a0 = a[0], a1 = a[1], a2 = a[2];
  let b0 = b[0], b1 = b[1], b2 = b[2];
  return (Math.abs(a0 - b0) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
          Math.abs(a1 - b1) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
          Math.abs(a2 - b2) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a2), Math.abs(b2)));
}

/**
 * Alias for {@link vec3.subtract}
 * @function
 */
const sub = subtract;
/* harmony export (immutable) */ __webpack_exports__["sub"] = sub;


/**
 * Alias for {@link vec3.multiply}
 * @function
 */
const mul = multiply;
/* harmony export (immutable) */ __webpack_exports__["mul"] = mul;


/**
 * Alias for {@link vec3.divide}
 * @function
 */
const div = divide;
/* harmony export (immutable) */ __webpack_exports__["div"] = div;


/**
 * Alias for {@link vec3.distance}
 * @function
 */
const dist = distance;
/* harmony export (immutable) */ __webpack_exports__["dist"] = dist;


/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */
const sqrDist = squaredDistance;
/* harmony export (immutable) */ __webpack_exports__["sqrDist"] = sqrDist;


/**
 * Alias for {@link vec3.length}
 * @function
 */
const len = length;
/* harmony export (immutable) */ __webpack_exports__["len"] = len;


/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */
const sqrLen = squaredLength;
/* harmony export (immutable) */ __webpack_exports__["sqrLen"] = sqrLen;


/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
const forEach = (function() {
  let vec = create();

  return function(a, stride, offset, count, fn, arg) {
    let i, l;
    if(!stride) {
      stride = 3;
    }

    if(!offset) {
      offset = 0;
    }

    if(count) {
      l = Math.min((count * stride) + offset, a.length);
    } else {
      l = a.length;
    }

    for(i = offset; i < l; i += stride) {
      vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2];
      fn(vec, vec, arg);
      a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2];
    }

    return a;
  };
})();
/* harmony export (immutable) */ __webpack_exports__["forEach"] = forEach;



/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["create"] = create;
/* harmony export (immutable) */ __webpack_exports__["clone"] = clone;
/* harmony export (immutable) */ __webpack_exports__["fromValues"] = fromValues;
/* harmony export (immutable) */ __webpack_exports__["copy"] = copy;
/* harmony export (immutable) */ __webpack_exports__["set"] = set;
/* harmony export (immutable) */ __webpack_exports__["add"] = add;
/* harmony export (immutable) */ __webpack_exports__["subtract"] = subtract;
/* harmony export (immutable) */ __webpack_exports__["multiply"] = multiply;
/* harmony export (immutable) */ __webpack_exports__["divide"] = divide;
/* harmony export (immutable) */ __webpack_exports__["ceil"] = ceil;
/* harmony export (immutable) */ __webpack_exports__["floor"] = floor;
/* harmony export (immutable) */ __webpack_exports__["min"] = min;
/* harmony export (immutable) */ __webpack_exports__["max"] = max;
/* harmony export (immutable) */ __webpack_exports__["round"] = round;
/* harmony export (immutable) */ __webpack_exports__["scale"] = scale;
/* harmony export (immutable) */ __webpack_exports__["scaleAndAdd"] = scaleAndAdd;
/* harmony export (immutable) */ __webpack_exports__["distance"] = distance;
/* harmony export (immutable) */ __webpack_exports__["squaredDistance"] = squaredDistance;
/* harmony export (immutable) */ __webpack_exports__["length"] = length;
/* harmony export (immutable) */ __webpack_exports__["squaredLength"] = squaredLength;
/* harmony export (immutable) */ __webpack_exports__["negate"] = negate;
/* harmony export (immutable) */ __webpack_exports__["inverse"] = inverse;
/* harmony export (immutable) */ __webpack_exports__["normalize"] = normalize;
/* harmony export (immutable) */ __webpack_exports__["dot"] = dot;
/* harmony export (immutable) */ __webpack_exports__["lerp"] = lerp;
/* harmony export (immutable) */ __webpack_exports__["random"] = random;
/* harmony export (immutable) */ __webpack_exports__["transformMat4"] = transformMat4;
/* harmony export (immutable) */ __webpack_exports__["transformQuat"] = transformQuat;
/* harmony export (immutable) */ __webpack_exports__["str"] = str;
/* harmony export (immutable) */ __webpack_exports__["exactEquals"] = exactEquals;
/* harmony export (immutable) */ __webpack_exports__["equals"] = equals;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(4);
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */



/**
 * 4 Dimensional Vector
 * @module vec4
 */

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
function create() {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](4);
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  return out;
}

/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {vec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */
function clone(a) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](4);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}

/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */
function fromValues(x, y, z, w) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](4);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}

/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}

/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */
function set(out, x, y, z, w) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}

/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
}

/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  return out;
}

/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  out[3] = a[3] * b[3];
  return out;
}

/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  out[3] = a[3] / b[3];
  return out;
}

/**
 * Math.ceil the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to ceil
 * @returns {vec4} out
 */
function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  out[3] = Math.ceil(a[3]);
  return out;
}

/**
 * Math.floor the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to floor
 * @returns {vec4} out
 */
function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  out[3] = Math.floor(a[3]);
  return out;
}

/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  out[3] = Math.min(a[3], b[3]);
  return out;
}

/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  out[3] = Math.max(a[3], b[3]);
  return out;
}

/**
 * Math.round the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to round
 * @returns {vec4} out
 */
function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  out[3] = Math.round(a[3]);
  return out;
}

/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */
function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
}

/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */
function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  out[2] = a[2] + (b[2] * scale);
  out[3] = a[3] + (b[3] * scale);
  return out;
}

/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} distance between a and b
 */
function distance(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  let z = b[2] - a[2];
  let w = b[3] - a[3];
  return Math.sqrt(x*x + y*y + z*z + w*w);
}

/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} squared distance between a and b
 */
function squaredDistance(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  let z = b[2] - a[2];
  let w = b[3] - a[3];
  return x*x + y*y + z*z + w*w;
}

/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */
function length(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let w = a[3];
  return Math.sqrt(x*x + y*y + z*z + w*w);
}

/**
 * Calculates the squared length of a vec4
 *
 * @param {vec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
function squaredLength(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let w = a[3];
  return x*x + y*y + z*z + w*w;
}

/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to negate
 * @returns {vec4} out
 */
function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = -a[3];
  return out;
}

/**
 * Returns the inverse of the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to invert
 * @returns {vec4} out
 */
function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  out[3] = 1.0 / a[3];
  return out;
}

/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */
function normalize(out, a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let w = a[3];
  let len = x*x + y*y + z*z + w*w;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    out[0] = x * len;
    out[1] = y * len;
    out[2] = z * len;
    out[3] = w * len;
  }
  return out;
}

/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}

/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec4} out
 */
function lerp(out, a, b, t) {
  let ax = a[0];
  let ay = a[1];
  let az = a[2];
  let aw = a[3];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  out[3] = aw + t * (b[3] - aw);
  return out;
}

/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */
function random(out, vectorScale) {
  vectorScale = vectorScale || 1.0;

  //TODO: This is a pretty awful way of doing this. Find something better.
  out[0] = __WEBPACK_IMPORTED_MODULE_0__common__["RANDOM"]();
  out[1] = __WEBPACK_IMPORTED_MODULE_0__common__["RANDOM"]();
  out[2] = __WEBPACK_IMPORTED_MODULE_0__common__["RANDOM"]();
  out[3] = __WEBPACK_IMPORTED_MODULE_0__common__["RANDOM"]();
  normalize(out, out);
  scale(out, out, vectorScale);
  return out;
}

/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */
function transformMat4(out, a, m) {
  let x = a[0], y = a[1], z = a[2], w = a[3];
  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
  return out;
}

/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec4} out
 */
function transformQuat(out, a, q) {
  let x = a[0], y = a[1], z = a[2];
  let qx = q[0], qy = q[1], qz = q[2], qw = q[3];

  // calculate quat * vec
  let ix = qw * x + qy * z - qz * y;
  let iy = qw * y + qz * x - qx * z;
  let iz = qw * z + qx * y - qy * x;
  let iw = -qx * x - qy * y - qz * z;

  // calculate result * inverse quat
  out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  out[3] = a[3];
  return out;
}

/**
 * Returns a string representation of a vector
 *
 * @param {vec4} a vector to represent as a string
 * @returns {String} string representation of the vector
 */
function str(a) {
  return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
}

/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec4} a The first vector.
 * @param {vec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec4} a The first vector.
 * @param {vec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function equals(a, b) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  return (Math.abs(a0 - b0) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
          Math.abs(a1 - b1) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
          Math.abs(a2 - b2) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
          Math.abs(a3 - b3) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a3), Math.abs(b3)));
}

/**
 * Alias for {@link vec4.subtract}
 * @function
 */
const sub = subtract;
/* harmony export (immutable) */ __webpack_exports__["sub"] = sub;


/**
 * Alias for {@link vec4.multiply}
 * @function
 */
const mul = multiply;
/* harmony export (immutable) */ __webpack_exports__["mul"] = mul;


/**
 * Alias for {@link vec4.divide}
 * @function
 */
const div = divide;
/* harmony export (immutable) */ __webpack_exports__["div"] = div;


/**
 * Alias for {@link vec4.distance}
 * @function
 */
const dist = distance;
/* harmony export (immutable) */ __webpack_exports__["dist"] = dist;


/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */
const sqrDist = squaredDistance;
/* harmony export (immutable) */ __webpack_exports__["sqrDist"] = sqrDist;


/**
 * Alias for {@link vec4.length}
 * @function
 */
const len = length;
/* harmony export (immutable) */ __webpack_exports__["len"] = len;


/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */
const sqrLen = squaredLength;
/* harmony export (immutable) */ __webpack_exports__["sqrLen"] = sqrLen;


/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
const forEach = (function() {
  let vec = create();

  return function(a, stride, offset, count, fn, arg) {
    let i, l;
    if(!stride) {
      stride = 4;
    }

    if(!offset) {
      offset = 0;
    }

    if(count) {
      l = Math.min((count * stride) + offset, a.length);
    } else {
      l = a.length;
    }

    for(i = offset; i < l; i += stride) {
      vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2]; vec[3] = a[i+3];
      fn(vec, vec, arg);
      a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2]; a[i+3] = vec[3];
    }

    return a;
  };
})();
/* harmony export (immutable) */ __webpack_exports__["forEach"] = forEach;



/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// WebglConst.js

// stolen there https://github.com/mattdesl/gl-constants thanks @mattdesl ^^

module.exports = {
	ACTIVE_ATTRIBUTES: 35721,
	ACTIVE_ATTRIBUTE_MAX_LENGTH: 35722,
	ACTIVE_TEXTURE: 34016,
	ACTIVE_UNIFORMS: 35718,
	ACTIVE_UNIFORM_MAX_LENGTH: 35719,
	ALIASED_LINE_WIDTH_RANGE: 33902,
	ALIASED_POINT_SIZE_RANGE: 33901,
	ALPHA: 6406,
	ALPHA_BITS: 3413,
	ALWAYS: 519,
	ARRAY_BUFFER: 34962,
	ARRAY_BUFFER_BINDING: 34964,
	ATTACHED_SHADERS: 35717,
	BACK: 1029,
	BLEND: 3042,
	BLEND_COLOR: 32773,
	BLEND_DST_ALPHA: 32970,
	BLEND_DST_RGB: 32968,
	BLEND_EQUATION: 32777,
	BLEND_EQUATION_ALPHA: 34877,
	BLEND_EQUATION_RGB: 32777,
	BLEND_SRC_ALPHA: 32971,
	BLEND_SRC_RGB: 32969,
	BLUE_BITS: 3412,
	BOOL: 35670,
	BOOL_VEC2: 35671,
	BOOL_VEC3: 35672,
	BOOL_VEC4: 35673,
	BROWSER_DEFAULT_WEBGL: 37444,
	BUFFER_SIZE: 34660,
	BUFFER_USAGE: 34661,
	BYTE: 5120,
	CCW: 2305,
	CLAMP_TO_EDGE: 33071,
	COLOR_ATTACHMENT0: 36064,
	COLOR_BUFFER_BIT: 16384,
	COLOR_CLEAR_VALUE: 3106,
	COLOR_WRITEMASK: 3107,
	COMPILE_STATUS: 35713,
	COMPRESSED_TEXTURE_FORMATS: 34467,
	CONSTANT_ALPHA: 32771,
	CONSTANT_COLOR: 32769,
	CONTEXT_LOST_WEBGL: 37442,
	CULL_FACE: 2884,
	CULL_FACE_MODE: 2885,
	CURRENT_PROGRAM: 35725,
	CURRENT_VERTEX_ATTRIB: 34342,
	CW: 2304,
	DECR: 7683,
	DECR_WRAP: 34056,
	DELETE_STATUS: 35712,
	DEPTH_ATTACHMENT: 36096,
	DEPTH_BITS: 3414,
	DEPTH_BUFFER_BIT: 256,
	DEPTH_CLEAR_VALUE: 2931,
	DEPTH_COMPONENT: 6402,
	RED: 6403,
	DEPTH_COMPONENT16: 33189,
	DEPTH_FUNC: 2932,
	DEPTH_RANGE: 2928,
	DEPTH_STENCIL: 34041,
	DEPTH_STENCIL_ATTACHMENT: 33306,
	DEPTH_TEST: 2929,
	DEPTH_WRITEMASK: 2930,
	DITHER: 3024,
	DONT_CARE: 4352,
	DST_ALPHA: 772,
	DST_COLOR: 774,
	DYNAMIC_DRAW: 35048,
	ELEMENT_ARRAY_BUFFER: 34963,
	ELEMENT_ARRAY_BUFFER_BINDING: 34965,
	EQUAL: 514,
	FASTEST: 4353,
	FLOAT: 5126,
	FLOAT_MAT2: 35674,
	FLOAT_MAT3: 35675,
	FLOAT_MAT4: 35676,
	FLOAT_VEC2: 35664,
	FLOAT_VEC3: 35665,
	FLOAT_VEC4: 35666,
	FRAGMENT_SHADER: 35632,
	FRAMEBUFFER: 36160,
	FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: 36049,
	FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: 36048,
	FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: 36051,
	FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: 36050,
	FRAMEBUFFER_BINDING: 36006,
	FRAMEBUFFER_COMPLETE: 36053,
	FRAMEBUFFER_INCOMPLETE_ATTACHMENT: 36054,
	FRAMEBUFFER_INCOMPLETE_DIMENSIONS: 36057,
	FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: 36055,
	FRAMEBUFFER_UNSUPPORTED: 36061,
	FRONT: 1028,
	FRONT_AND_BACK: 1032,
	FRONT_FACE: 2886,
	FUNC_ADD: 32774,
	FUNC_REVERSE_SUBTRACT: 32779,
	FUNC_SUBTRACT: 32778,
	GENERATE_MIPMAP_HINT: 33170,
	GEQUAL: 518,
	GREATER: 516,
	GREEN_BITS: 3411,
	HIGH_FLOAT: 36338,
	HIGH_INT: 36341,
	INCR: 7682,
	INCR_WRAP: 34055,
	INFO_LOG_LENGTH: 35716,
	INT: 5124,
	INT_VEC2: 35667,
	INT_VEC3: 35668,
	INT_VEC4: 35669,
	INVALID_ENUM: 1280,
	INVALID_FRAMEBUFFER_OPERATION: 1286,
	INVALID_OPERATION: 1282,
	INVALID_VALUE: 1281,
	INVERT: 5386,
	KEEP: 7680,
	LEQUAL: 515,
	LESS: 513,
	LINEAR: 9729,
	LINEAR_MIPMAP_LINEAR: 9987,
	LINEAR_MIPMAP_NEAREST: 9985,
	LINES: 1,
	LINE_LOOP: 2,
	LINE_STRIP: 3,
	LINE_WIDTH: 2849,
	LINK_STATUS: 35714,
	LOW_FLOAT: 36336,
	LOW_INT: 36339,
	LUMINANCE: 6409,
	LUMINANCE_ALPHA: 6410,
	MAX_COMBINED_TEXTURE_IMAGE_UNITS: 35661,
	MAX_CUBE_MAP_TEXTURE_SIZE: 34076,
	MAX_FRAGMENT_UNIFORM_VECTORS: 36349,
	MAX_RENDERBUFFER_SIZE: 34024,
	MAX_TEXTURE_IMAGE_UNITS: 34930,
	MAX_TEXTURE_SIZE: 3379,
	MAX_VARYING_VECTORS: 36348,
	MAX_VERTEX_ATTRIBS: 34921,
	MAX_VERTEX_TEXTURE_IMAGE_UNITS: 35660,
	MAX_VERTEX_UNIFORM_VECTORS: 36347,
	MAX_VIEWPORT_DIMS: 3386,
	MEDIUM_FLOAT: 36337,
	MEDIUM_INT: 36340,
	MIRRORED_REPEAT: 33648,
	NEAREST: 9728,
	NEAREST_MIPMAP_LINEAR: 9986,
	NEAREST_MIPMAP_NEAREST: 9984,
	NEVER: 512,
	NICEST: 4354,
	NONE: 0,
	NOTEQUAL: 517,
	NO_ERROR: 0,
	NUM_COMPRESSED_TEXTURE_FORMATS: 34466,
	ONE: 1,
	ONE_MINUS_CONSTANT_ALPHA: 32772,
	ONE_MINUS_CONSTANT_COLOR: 32770,
	ONE_MINUS_DST_ALPHA: 773,
	ONE_MINUS_DST_COLOR: 775,
	ONE_MINUS_SRC_ALPHA: 771,
	ONE_MINUS_SRC_COLOR: 769,
	OUT_OF_MEMORY: 1285,
	PACK_ALIGNMENT: 3333,
	POINTS: 0,
	POLYGON_OFFSET_FACTOR: 32824,
	POLYGON_OFFSET_FILL: 32823,
	POLYGON_OFFSET_UNITS: 10752,
	RED_BITS: 3410,
	RENDERBUFFER: 36161,
	RENDERBUFFER_ALPHA_SIZE: 36179,
	RENDERBUFFER_BINDING: 36007,
	RENDERBUFFER_BLUE_SIZE: 36178,
	RENDERBUFFER_DEPTH_SIZE: 36180,
	RENDERBUFFER_GREEN_SIZE: 36177,
	RENDERBUFFER_HEIGHT: 36163,
	RENDERBUFFER_INTERNAL_FORMAT: 36164,
	RENDERBUFFER_RED_SIZE: 36176,
	RENDERBUFFER_STENCIL_SIZE: 36181,
	RENDERBUFFER_WIDTH: 36162,
	RENDERER: 7937,
	REPEAT: 10497,
	REPLACE: 7681,
	RGB: 6407,
	RGB5_A1: 32855,
	RGB565: 36194,
	RGBA: 6408,
	RGBA4: 32854,
	SAMPLER_2D: 35678,
	SAMPLER_CUBE: 35680,
	SAMPLES: 32937,
	SAMPLE_ALPHA_TO_COVERAGE: 32926,
	SAMPLE_BUFFERS: 32936,
	SAMPLE_COVERAGE: 32928,
	SAMPLE_COVERAGE_INVERT: 32939,
	SAMPLE_COVERAGE_VALUE: 32938,
	SCISSOR_BOX: 3088,
	SCISSOR_TEST: 3089,
	SHADER_COMPILER: 36346,
	SHADER_SOURCE_LENGTH: 35720,
	SHADER_TYPE: 35663,
	SHADING_LANGUAGE_VERSION: 35724,
	SHORT: 5122,
	SRC_ALPHA: 770,
	SRC_ALPHA_SATURATE: 776,
	SRC_COLOR: 768,
	STATIC_DRAW: 35044,
	STENCIL_ATTACHMENT: 36128,
	STENCIL_BACK_FAIL: 34817,
	STENCIL_BACK_FUNC: 34816,
	STENCIL_BACK_PASS_DEPTH_FAIL: 34818,
	STENCIL_BACK_PASS_DEPTH_PASS: 34819,
	STENCIL_BACK_REF: 36003,
	STENCIL_BACK_VALUE_MASK: 36004,
	STENCIL_BACK_WRITEMASK: 36005,
	STENCIL_BITS: 3415,
	STENCIL_BUFFER_BIT: 1024,
	STENCIL_CLEAR_VALUE: 2961,
	STENCIL_FAIL: 2964,
	STENCIL_FUNC: 2962,
	STENCIL_INDEX: 6401,
	STENCIL_INDEX8: 36168,
	STENCIL_PASS_DEPTH_FAIL: 2965,
	STENCIL_PASS_DEPTH_PASS: 2966,
	STENCIL_REF: 2967,
	STENCIL_TEST: 2960,
	STENCIL_VALUE_MASK: 2963,
	STENCIL_WRITEMASK: 2968,
	STREAM_DRAW: 35040,
	SUBPIXEL_BITS: 3408,
	TEXTURE: 5890,
	TEXTURE0: 33984,
	TEXTURE1: 33985,
	TEXTURE2: 33986,
	TEXTURE3: 33987,
	TEXTURE4: 33988,
	TEXTURE5: 33989,
	TEXTURE6: 33990,
	TEXTURE7: 33991,
	TEXTURE8: 33992,
	TEXTURE9: 33993,
	TEXTURE10: 33994,
	TEXTURE11: 33995,
	TEXTURE12: 33996,
	TEXTURE13: 33997,
	TEXTURE14: 33998,
	TEXTURE15: 33999,
	TEXTURE16: 34000,
	TEXTURE17: 34001,
	TEXTURE18: 34002,
	TEXTURE19: 34003,
	TEXTURE20: 34004,
	TEXTURE21: 34005,
	TEXTURE22: 34006,
	TEXTURE23: 34007,
	TEXTURE24: 34008,
	TEXTURE25: 34009,
	TEXTURE26: 34010,
	TEXTURE27: 34011,
	TEXTURE28: 34012,
	TEXTURE29: 34013,
	TEXTURE30: 34014,
	TEXTURE31: 34015,
	TEXTURE_2D: 3553,
	TEXTURE_BINDING_2D: 32873,
	TEXTURE_BINDING_CUBE_MAP: 34068,
	TEXTURE_CUBE_MAP: 34067,
	TEXTURE_CUBE_MAP_NEGATIVE_X: 34070,
	TEXTURE_CUBE_MAP_NEGATIVE_Y: 34072,
	TEXTURE_CUBE_MAP_NEGATIVE_Z: 34074,
	TEXTURE_CUBE_MAP_POSITIVE_X: 34069,
	TEXTURE_CUBE_MAP_POSITIVE_Y: 34071,
	TEXTURE_CUBE_MAP_POSITIVE_Z: 34073,
	TEXTURE_MAG_FILTER: 10240,
	TEXTURE_MIN_FILTER: 10241,
	TEXTURE_WRAP_S: 10242,
	TEXTURE_WRAP_T: 10243,
	TRIANGLES: 4,
	TRIANGLE_FAN: 6,
	TRIANGLE_STRIP: 5,
	UNPACK_ALIGNMENT: 3317,
	UNPACK_COLORSPACE_CONVERSION_WEBGL: 37443,
	UNPACK_FLIP_Y_WEBGL: 37440,
	UNPACK_PREMULTIPLY_ALPHA_WEBGL: 37441,
	UNSIGNED_BYTE: 5121,
	UNSIGNED_INT: 5125,
	UNSIGNED_SHORT: 5123,
	UNSIGNED_SHORT_4_4_4_4: 32819,
	UNSIGNED_SHORT_5_5_5_1: 32820,
	UNSIGNED_SHORT_5_6_5: 33635,
	VALIDATE_STATUS: 35715,
	VENDOR: 7936,
	VERSION: 7938,
	VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: 34975,
	VERTEX_ATTRIB_ARRAY_ENABLED: 34338,
	VERTEX_ATTRIB_ARRAY_NORMALIZED: 34922,
	VERTEX_ATTRIB_ARRAY_POINTER: 34373,
	VERTEX_ATTRIB_ARRAY_SIZE: 34339,
	VERTEX_ATTRIB_ARRAY_STRIDE: 34340,
	VERTEX_ATTRIB_ARRAY_TYPE: 34341,
	VERTEX_SHADER: 35633,
	VIEWPORT: 2978,
	ZERO: 0,
	R8: 33321
};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (gl, shaderProgram, name) {
	if (shaderProgram.cacheAttribLoc === undefined) {
		shaderProgram.cacheAttribLoc = {};
	}
	if (shaderProgram.cacheAttribLoc[name] === undefined) {
		shaderProgram.cacheAttribLoc[name] = gl.getAttribLocation(shaderProgram, name);
	}

	return shaderProgram.cacheAttribLoc[name];
};

; // getAttribLoc.js

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Material.js

var _Shaders = __webpack_require__(16);

var _Shaders2 = _interopRequireDefault(_Shaders);

var _objectAssign = __webpack_require__(17);

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Material = function () {
	function Material(vs, fs) {
		var uniforms = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
		var defines = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

		_classCallCheck(this, Material);

		this._shader = _Shaders2.default.get(vs, fs, defines);
		this.uniforms = (0, _objectAssign2.default)({}, uniforms);
	}

	_createClass(Material, [{
		key: 'update',
		value: function update() {
			this._shader.bind();
			this._shader.uniform(this.uniforms);
		}
	}, {
		key: 'shader',
		get: function get() {
			return this._shader;
		}
	}]);

	return Material;
}();

exports.default = Material;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// EventDispatcher.js

var supportsCustomEvents = true;
try {
	var newTestCustomEvent = document.createEvent('CustomEvent');
	newTestCustomEvent = null;
} catch (e) {
	supportsCustomEvents = false;
}

var EventDispatcher = function () {
	function EventDispatcher() {
		_classCallCheck(this, EventDispatcher);

		this._eventListeners = {};
	}

	_createClass(EventDispatcher, [{
		key: 'addEventListener',
		value: function addEventListener(aEventType, aFunction) {

			if (this._eventListeners === null || this._eventListeners === undefined) {
				this._eventListeners = {};
			}

			if (!this._eventListeners[aEventType]) {
				this._eventListeners[aEventType] = [];
			}
			this._eventListeners[aEventType].push(aFunction);

			return this;
		}
	}, {
		key: 'on',
		value: function on(aEventType, aFunction) {
			return this.addEventListener(aEventType, aFunction);
		}
	}, {
		key: 'removeEventListener',
		value: function removeEventListener(aEventType, aFunction) {
			if (this._eventListeners === null || this._eventListeners === undefined) {
				this._eventListeners = {};
			}
			var currentArray = this._eventListeners[aEventType];

			if (typeof currentArray === 'undefined') {
				return this;
			}

			var currentArrayLength = currentArray.length;
			for (var i = 0; i < currentArrayLength; i++) {
				if (currentArray[i] === aFunction) {
					currentArray.splice(i, 1);
					i--;
					currentArrayLength--;
				}
			}
			return this;
		}
	}, {
		key: 'off',
		value: function off(aEventType, aFunction) {
			return this.removeEventListener(aEventType, aFunction);
		}
	}, {
		key: 'dispatchEvent',
		value: function dispatchEvent(aEvent) {
			if (this._eventListeners === null || this._eventListeners === undefined) {
				this._eventListeners = {};
			}
			var eventType = aEvent.type;

			try {
				if (aEvent.target === null) {
					aEvent.target = this;
				}
				aEvent.currentTarget = this;
			} catch (theError) {
				var newEvent = { type: eventType, detail: aEvent.detail, dispatcher: this };
				return this.dispatchEvent(newEvent);
			}

			var currentEventListeners = this._eventListeners[eventType];
			if (currentEventListeners !== null && currentEventListeners !== undefined) {
				var currentArray = this._copyArray(currentEventListeners);
				var currentArrayLength = currentArray.length;
				for (var i = 0; i < currentArrayLength; i++) {
					var currentFunction = currentArray[i];
					currentFunction.call(this, aEvent);
				}
			}
			return this;
		}
	}, {
		key: 'dispatchCustomEvent',
		value: function dispatchCustomEvent(aEventType, aDetail) {
			var newEvent = void 0;
			if (supportsCustomEvents) {
				newEvent = document.createEvent('CustomEvent');
				newEvent.dispatcher = this;
				newEvent.initCustomEvent(aEventType, false, false, aDetail);
			} else {
				newEvent = { type: aEventType, detail: aDetail, dispatcher: this };
			}
			return this.dispatchEvent(newEvent);
		}
	}, {
		key: 'trigger',
		value: function trigger(aEventType, aDetail) {
			return this.dispatchCustomEvent(aEventType, aDetail);
		}
	}, {
		key: '_destroy',
		value: function _destroy() {
			if (this._eventListeners !== null) {
				for (var objectName in this._eventListeners) {
					if (this._eventListeners.hasOwnProperty(objectName)) {
						var currentArray = this._eventListeners[objectName];
						var currentArrayLength = currentArray.length;
						for (var i = 0; i < currentArrayLength; i++) {
							currentArray[i] = null;
						}
						delete this._eventListeners[objectName];
					}
				}
				this._eventListeners = null;
			}
		}
	}, {
		key: '_copyArray',
		value: function _copyArray(aArray) {
			var currentArray = new Array(aArray.length);
			var currentArrayLength = currentArray.length;
			for (var i = 0; i < currentArrayLength; i++) {
				currentArray[i] = aArray[i];
			}
			return currentArray;
		}
	}]);

	return EventDispatcher;
}();

exports.default = EventDispatcher;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// OrbitalControl.js


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EaseNumber = __webpack_require__(19);

var _EaseNumber2 = _interopRequireDefault(_EaseNumber);

var _scheduling = __webpack_require__(6);

var _scheduling2 = _interopRequireDefault(_scheduling);

var _glMatrix = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getMouse = function getMouse(mEvent, mTarget) {

	var o = mTarget || {};
	if (mEvent.touches) {
		o.x = mEvent.touches[0].pageX;
		o.y = mEvent.touches[0].pageY;
	} else {
		o.x = mEvent.clientX;
		o.y = mEvent.clientY;
	}

	return o;
};

var OrbitalControl = function () {
	function OrbitalControl(mTarget) {
		var _this = this;

		var mListenerTarget = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
		var mRadius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 500;

		_classCallCheck(this, OrbitalControl);

		this._target = mTarget;
		this._listenerTarget = mListenerTarget;
		this._mouse = {};
		this._preMouse = {};
		this.center = _glMatrix.vec3.create();
		this._up = _glMatrix.vec3.fromValues(0, 1, 0);
		this.radius = new _EaseNumber2.default(mRadius);
		this.position = _glMatrix.vec3.fromValues(0, 0, this.radius.value);
		this.positionOffset = _glMatrix.vec3.create();
		this._rx = new _EaseNumber2.default(0);
		this._rx.limit(-Math.PI / 2, Math.PI / 2);
		this._ry = new _EaseNumber2.default(0);
		this._preRX = 0;
		this._preRY = 0;

		this._isLockZoom = false;
		this._isLockRotation = false;
		this._isInvert = false;
		this.sensitivity = 1.0;

		this._wheelBind = function (e) {
			return _this._onWheel(e);
		};
		this._downBind = function (e) {
			return _this._onDown(e);
		};
		this._moveBind = function (e) {
			return _this._onMove(e);
		};
		this._upBind = function () {
			return _this._onUp();
		};

		this.connect();
		_scheduling2.default.addEF(function () {
			return _this._loop();
		});
	}

	_createClass(OrbitalControl, [{
		key: 'connect',
		value: function connect() {
			this.disconnect();

			this._listenerTarget.addEventListener('mousewheel', this._wheelBind);
			this._listenerTarget.addEventListener('DOMMouseScroll', this._wheelBind);

			this._listenerTarget.addEventListener('mousedown', this._downBind);
			this._listenerTarget.addEventListener('touchstart', this._downBind);
			this._listenerTarget.addEventListener('mousemove', this._moveBind);
			this._listenerTarget.addEventListener('touchmove', this._moveBind);
			window.addEventListener('touchend', this._upBind);
			window.addEventListener('mouseup', this._upBind);
		}
	}, {
		key: 'disconnect',
		value: function disconnect() {
			this._listenerTarget.removeEventListener('mousewheel', this._wheelBind);
			this._listenerTarget.removeEventListener('DOMMouseScroll', this._wheelBind);

			this._listenerTarget.removeEventListener('mousedown', this._downBind);
			this._listenerTarget.removeEventListener('touchstart', this._downBind);
			this._listenerTarget.removeEventListener('mousemove', this._moveBind);
			this._listenerTarget.removeEventListener('touchmove', this._moveBind);
			window.removeEventListener('touchend', this._upBind);
			window.removeEventListener('mouseup', this._upBind);
		}

		//	PUBLIC METHODS

	}, {
		key: 'lock',
		value: function lock() {
			var mValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			this._isLockZoom = mValue;
			this._isLockRotation = mValue;
			this._isMouseDown = false;
		}
	}, {
		key: 'lockZoom',
		value: function lockZoom() {
			var mValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			this._isLockZoom = mValue;
		}
	}, {
		key: 'lockRotation',
		value: function lockRotation() {
			var mValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			this._isLockRotation = mValue;
		}
	}, {
		key: 'inverseControl',
		value: function inverseControl() {
			var isInvert = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			this._isInvert = isInvert;
		}

		//	EVENT HANDLERES

	}, {
		key: '_onDown',
		value: function _onDown(mEvent) {
			if (this._isLockRotation) {
				return;
			}
			this._isMouseDown = true;
			getMouse(mEvent, this._mouse);
			getMouse(mEvent, this._preMouse);
			this._preRX = this._rx.targetValue;
			this._preRY = this._ry.targetValue;
		}
	}, {
		key: '_onMove',
		value: function _onMove(mEvent) {
			if (this._isLockRotation) {
				return;
			}
			getMouse(mEvent, this._mouse);
			if (mEvent.touches) {
				mEvent.preventDefault();
			}

			if (this._isMouseDown) {
				var diffX = -(this._mouse.x - this._preMouse.x);
				if (this._isInvert) {
					diffX *= -1;
				}
				this._ry.value = this._preRY - diffX * 0.01 * this.sensitivity;

				var diffY = -(this._mouse.y - this._preMouse.y);
				if (this._isInvert) {
					diffY *= -1;
				}
				this._rx.value = this._preRX - diffY * 0.01 * this.sensitivity;
			}
		}
	}, {
		key: '_onUp',
		value: function _onUp() {
			if (this._isLockRotation) {
				return;
			}
			this._isMouseDown = false;
		}
	}, {
		key: '_onWheel',
		value: function _onWheel(mEvent) {
			if (this._isLockZoom) {
				return;
			}
			var w = mEvent.wheelDelta;
			var d = mEvent.detail;
			var value = 0;
			if (d) {
				if (w) {
					value = w / d / 40 * d > 0 ? 1 : -1; // Opera
				} else {
					value = -d / 3; // Firefox;         TODO: do not /3 for OS X
				}
			} else {
				value = w / 120;
			}

			this.radius.add(-value * 2);
		}

		//	PRIVATE METHODS

	}, {
		key: '_loop',
		value: function _loop() {

			this._updatePosition();

			if (this._target) {
				this._updateCamera();
			}
		}
	}, {
		key: '_updatePosition',
		value: function _updatePosition() {
			this.position[1] = Math.sin(this._rx.value) * this.radius.value;
			var tr = Math.cos(this._rx.value) * this.radius.value;
			this.position[0] = Math.cos(this._ry.value + Math.PI * 0.5) * tr;
			this.position[2] = Math.sin(this._ry.value + Math.PI * 0.5) * tr;
			_glMatrix.vec3.add(this.position, this.position, this.positionOffset);
		}
	}, {
		key: '_updateCamera',
		value: function _updateCamera() {
			this._target.lookAt(this.position, this.center, this._up);
		}

		//	GETTER / SETTER


	}, {
		key: 'rx',
		get: function get() {
			return this._rx;
		}
	}, {
		key: 'ry',
		get: function get() {
			return this._ry;
		}
	}]);

	return OrbitalControl;
}();

exports.default = OrbitalControl;

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = "// generalWithNormal.vert\n\n#define SHADER_NAME GENERAL_VERTEX\n\nprecision highp float;\n#define GLSLIFY 1\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec3 aNormal;\n\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjectionMatrix;\nuniform mat3 uNormalMatrix;\n\nuniform vec3 position;\nuniform vec3 scale;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vNormal;\n\nvoid main(void) {\n\tvec3 pos      = aVertexPosition * scale;\n\tpos           += position;\n\tgl_Position   = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);\n\t\n\tvTextureCoord = aTextureCoord;\n\tvNormal       = normalize(uNormalMatrix * aNormal);\n}"

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = "// basic.vert\n\n#define SHADER_NAME SKYBOX_VERTEX\n\nprecision highp float;\n#define GLSLIFY 1\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec3 aNormal;\n\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjectionMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vVertex;\nvarying vec3 vNormal;\n\nvoid main(void) {\n\tmat4 matView = uViewMatrix;\n\tmatView[3][0] = 0.0;\n\tmatView[3][1] = 0.0;\n\tmatView[3][2] = 0.0;\n\t\n\tgl_Position = uProjectionMatrix * matView * uModelMatrix * vec4(aVertexPosition, 1.0);\n\tvTextureCoord = aTextureCoord;\n\t\n\tvVertex = aVertexPosition;\n\tvNormal = aNormal;\n}"

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = "// basic.frag\n\n#define SHADER_NAME SKYBOX_FRAGMENT\n\nprecision mediump float;\n#define GLSLIFY 1\nuniform samplerCube texture;\nvarying vec2 vTextureCoord;\nvarying vec3 vVertex;\n\nvoid main(void) {\n    gl_FragColor = textureCube(texture, vVertex);\n}"

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Camera2 = __webpack_require__(24);

var _Camera3 = _interopRequireDefault(_Camera2);

var _glMatrix = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // CameraOrtho.js

var CameraOrtho = function (_Camera) {
	_inherits(CameraOrtho, _Camera);

	function CameraOrtho() {
		_classCallCheck(this, CameraOrtho);

		var _this = _possibleConstructorReturn(this, (CameraOrtho.__proto__ || Object.getPrototypeOf(CameraOrtho)).call(this));

		var eye = _glMatrix.vec3.clone([0, 0, 15]);
		var center = _glMatrix.vec3.create();
		var up = _glMatrix.vec3.clone([0, -1, 0]);
		_this.lookAt(eye, center, up);
		_this.ortho(1, -1, 1, -1);
		return _this;
	}

	_createClass(CameraOrtho, [{
		key: 'setBoundary',
		value: function setBoundary(left, right, top, bottom) {
			var near = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.1;
			var far = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 100;

			this.ortho(left, right, top, bottom, near, far);
		}
	}, {
		key: 'ortho',
		value: function ortho(left, right, top, bottom) {
			var near = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.1;
			var far = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 100;

			this.left = left;
			this.right = right;
			this.top = top;
			this.bottom = bottom;
			mat4.ortho(this._projection, left, right, top, bottom, near, far);
		}
	}]);

	return CameraOrtho;
}(_Camera3.default);

exports.default = CameraOrtho;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _promisePolyfill = __webpack_require__(42);

var _promisePolyfill2 = _interopRequireDefault(_promisePolyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var get = function get(url) {
	return new _promisePolyfill2.default(function (resolve, reject) {
		var img = new Image();
		img.onload = function onLoad() {
			resolve(this);
		};

		img.onerror = function onError() {
			reject('Image not found : ' + url);
		};

		img.src = url;
	});
}; // loadImages.js

var loadImages = function loadImages(paths) {
	return _promisePolyfill2.default.all(paths.map(get));
};

exports.default = loadImages;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(setImmediate) {

// Store setTimeout reference so promise-polyfill will be unaffected by
// other code modifying setTimeout (like sinon.useFakeTimers())
var setTimeoutFunc = setTimeout;

function noop() {}

// Polyfill for Function.prototype.bind
function bind(fn, thisArg) {
  return function() {
    fn.apply(thisArg, arguments);
  };
}

function Promise(fn) {
  if (!(this instanceof Promise))
    throw new TypeError('Promises must be constructed via new');
  if (typeof fn !== 'function') throw new TypeError('not a function');
  this._state = 0;
  this._handled = false;
  this._value = undefined;
  this._deferreds = [];

  doResolve(fn, this);
}

function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (self._state === 0) {
    self._deferreds.push(deferred);
    return;
  }
  self._handled = true;
  Promise._immediateFn(function() {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
      return;
    }
    var ret;
    try {
      ret = cb(self._value);
    } catch (e) {
      reject(deferred.promise, e);
      return;
    }
    resolve(deferred.promise, ret);
  });
}

function resolve(self, newValue) {
  try {
    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    if (newValue === self)
      throw new TypeError('A promise cannot be resolved with itself.');
    if (
      newValue &&
      (typeof newValue === 'object' || typeof newValue === 'function')
    ) {
      var then = newValue.then;
      if (newValue instanceof Promise) {
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === 'function') {
        doResolve(bind(then, newValue), self);
        return;
      }
    }
    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (e) {
    reject(self, e);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}

function finale(self) {
  if (self._state === 2 && self._deferreds.length === 0) {
    Promise._immediateFn(function() {
      if (!self._handled) {
        Promise._unhandledRejectionFn(self._value);
      }
    });
  }

  for (var i = 0, len = self._deferreds.length; i < len; i++) {
    handle(self, self._deferreds[i]);
  }
  self._deferreds = null;
}

function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, self) {
  var done = false;
  try {
    fn(
      function(value) {
        if (done) return;
        done = true;
        resolve(self, value);
      },
      function(reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      }
    );
  } catch (ex) {
    if (done) return;
    done = true;
    reject(self, ex);
  }
}

Promise.prototype['catch'] = function(onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise.prototype['finally'] = function(callback) {
  var constructor = this.constructor;
  return this.then(
    function(value) {
      return constructor.resolve(callback()).then(function() {
        return value;
      });
    },
    function(reason) {
      return constructor.resolve(callback()).then(function() {
        return constructor.reject(reason);
      });
    }
  );
};

Promise.all = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!arr || typeof arr.length === 'undefined')
      throw new TypeError('Promise.all accepts an array');
    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then;
          if (typeof then === 'function') {
            then.call(
              val,
              function(val) {
                res(i, val);
              },
              reject
            );
            return;
          }
        }
        args[i] = val;
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.resolve = function(value) {
  if (value && typeof value === 'object' && value.constructor === Promise) {
    return value;
  }

  return new Promise(function(resolve) {
    resolve(value);
  });
};

Promise.reject = function(value) {
  return new Promise(function(resolve, reject) {
    reject(value);
  });
};

Promise.race = function(values) {
  return new Promise(function(resolve, reject) {
    for (var i = 0, len = values.length; i < len; i++) {
      values[i].then(resolve, reject);
    }
  });
};

// Use polyfill for setImmediate for performance gains
Promise._immediateFn =
  (typeof setImmediate === 'function' &&
    function(fn) {
      setImmediate(fn);
    }) ||
  function(fn) {
    setTimeoutFunc(fn, 0);
  };

Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
  if (typeof console !== 'undefined' && console) {
    console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
  }
};

module.exports = Promise;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(82).setImmediate))

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// PassMacro.js

var PassMacro = function () {
	function PassMacro() {
		_classCallCheck(this, PassMacro);

		this._passes = [];
	}

	_createClass(PassMacro, [{
		key: "addPass",
		value: function addPass(pass) {
			this._passes.push(pass);
		}
	}, {
		key: "passes",
		get: function get() {
			return this._passes;
		}
	}]);

	return PassMacro;
}();

exports.default = PassMacro;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _PassBlurBase2 = __webpack_require__(45);

var _PassBlurBase3 = _interopRequireDefault(_PassBlurBase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // PassVBlur.js

var PassVBlur = function (_PassBlurBase) {
	_inherits(PassVBlur, _PassBlurBase);

	function PassVBlur() {
		var mQuality = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 9;
		var mWidth = arguments[1];
		var mHeight = arguments[2];
		var mParams = arguments[3];

		_classCallCheck(this, PassVBlur);

		return _possibleConstructorReturn(this, (PassVBlur.__proto__ || Object.getPrototypeOf(PassVBlur)).call(this, mQuality, [0, 1], mWidth, mHeight, mParams));
	}

	return PassVBlur;
}(_PassBlurBase3.default);

exports.default = PassVBlur;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _Pass2 = __webpack_require__(12);

var _Pass3 = _interopRequireDefault(_Pass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // PassBlurBase.js

var fsBlur5 = __webpack_require__(87);
var fsBlur9 = __webpack_require__(88);
var fsBlur13 = __webpack_require__(89);

var PassBlurBase = function (_Pass) {
	_inherits(PassBlurBase, _Pass);

	function PassBlurBase() {
		var mQuality = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 9;
		var mDirection = arguments[1];
		var mWidth = arguments[2];
		var mHeight = arguments[3];
		var mParams = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

		_classCallCheck(this, PassBlurBase);

		var fs = void 0;
		switch (mQuality) {
			case 5:
			default:
				fs = fsBlur5;
				break;
			case 9:
				fs = fsBlur9;
				break;
			case 13:
				fs = fsBlur13;
				break;

		}

		var _this = _possibleConstructorReturn(this, (PassBlurBase.__proto__ || Object.getPrototypeOf(PassBlurBase)).call(this, fs, mWidth, mHeight, mParams));

		_this.uniform('uDirection', mDirection);
		_this.uniform('uResolution', [_GLTool2.default.width, _GLTool2.default.height]);
		return _this;
	}

	return PassBlurBase;
}(_Pass3.default);

exports.default = PassBlurBase;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _PassBlurBase2 = __webpack_require__(45);

var _PassBlurBase3 = _interopRequireDefault(_PassBlurBase2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // PassHBlur.js

var PassHBlur = function (_PassBlurBase) {
	_inherits(PassHBlur, _PassBlurBase);

	function PassHBlur() {
		var mQuality = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 9;
		var mWidth = arguments[1];
		var mHeight = arguments[2];
		var mParams = arguments[3];

		_classCallCheck(this, PassHBlur);

		return _possibleConstructorReturn(this, (PassHBlur.__proto__ || Object.getPrototypeOf(PassHBlur)).call(this, mQuality, [1, 0], mWidth, mHeight, mParams));
	}

	return PassHBlur;
}(_PassBlurBase3.default);

exports.default = PassHBlur;

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = "// fxaa.frag\n\n#define SHADER_NAME FXAA\n\nprecision highp float;\n#define GLSLIFY 1\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform vec2 uResolution;\n\n\nfloat FXAA_SUBPIX_SHIFT = 1.0/4.0;\n#define FXAA_REDUCE_MIN   (1.0/ 128.0)\n#define FXAA_REDUCE_MUL   (1.0 / 8.0)\n#define FXAA_SPAN_MAX     8.0\n\n\nvec4 applyFXAA(sampler2D tex) {\n    vec4 color;\n    vec2 fragCoord = gl_FragCoord.xy;\n    vec3 rgbNW = texture2D(tex, (fragCoord + vec2(-1.0, -1.0)) * uResolution).xyz;\n    vec3 rgbNE = texture2D(tex, (fragCoord + vec2(1.0, -1.0)) * uResolution).xyz;\n    vec3 rgbSW = texture2D(tex, (fragCoord + vec2(-1.0, 1.0)) * uResolution).xyz;\n    vec3 rgbSE = texture2D(tex, (fragCoord + vec2(1.0, 1.0)) * uResolution).xyz;\n    vec3 rgbM  = texture2D(tex, fragCoord  * uResolution).xyz;\n    vec3 luma = vec3(0.299, 0.587, 0.114);\n    float lumaNW = dot(rgbNW, luma);\n    float lumaNE = dot(rgbNE, luma);\n    float lumaSW = dot(rgbSW, luma);\n    float lumaSE = dot(rgbSE, luma);\n    float lumaM  = dot(rgbM,  luma);\n    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));\n    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));\n\n    vec2 dir;\n    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));\n    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));\n\n    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *\n                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);\n\n    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);\n    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),\n              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),\n              dir * rcpDirMin)) * uResolution;\n\n    vec3 rgbA = 0.5 * (\n        texture2D(tex, fragCoord * uResolution + dir * (1.0 / 3.0 - 0.5)).xyz +\n        texture2D(tex, fragCoord * uResolution + dir * (2.0 / 3.0 - 0.5)).xyz);\n    vec3 rgbB = rgbA * 0.5 + 0.25 * (\n        texture2D(tex, fragCoord * uResolution + dir * -0.5).xyz +\n        texture2D(tex, fragCoord * uResolution + dir * 0.5).xyz);\n\n    float lumaB = dot(rgbB, luma);\n    if ((lumaB < lumaMin) || (lumaB > lumaMax))\n        color = vec4(rgbA, 1.0);\n    else\n        color = vec4(rgbB, 1.0);\n    return color;\n}\n\nvoid main(void) {\n \tvec4 color = applyFXAA(texture);\n    gl_FragColor = color;\n}"

/***/ }),
/* 48 */,
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["create"] = create;
/* harmony export (immutable) */ __webpack_exports__["clone"] = clone;
/* harmony export (immutable) */ __webpack_exports__["copy"] = copy;
/* harmony export (immutable) */ __webpack_exports__["identity"] = identity;
/* harmony export (immutable) */ __webpack_exports__["fromValues"] = fromValues;
/* harmony export (immutable) */ __webpack_exports__["set"] = set;
/* harmony export (immutable) */ __webpack_exports__["transpose"] = transpose;
/* harmony export (immutable) */ __webpack_exports__["invert"] = invert;
/* harmony export (immutable) */ __webpack_exports__["adjoint"] = adjoint;
/* harmony export (immutable) */ __webpack_exports__["determinant"] = determinant;
/* harmony export (immutable) */ __webpack_exports__["multiply"] = multiply;
/* harmony export (immutable) */ __webpack_exports__["rotate"] = rotate;
/* harmony export (immutable) */ __webpack_exports__["scale"] = scale;
/* harmony export (immutable) */ __webpack_exports__["fromRotation"] = fromRotation;
/* harmony export (immutable) */ __webpack_exports__["fromScaling"] = fromScaling;
/* harmony export (immutable) */ __webpack_exports__["str"] = str;
/* harmony export (immutable) */ __webpack_exports__["frob"] = frob;
/* harmony export (immutable) */ __webpack_exports__["LDU"] = LDU;
/* harmony export (immutable) */ __webpack_exports__["add"] = add;
/* harmony export (immutable) */ __webpack_exports__["subtract"] = subtract;
/* harmony export (immutable) */ __webpack_exports__["exactEquals"] = exactEquals;
/* harmony export (immutable) */ __webpack_exports__["equals"] = equals;
/* harmony export (immutable) */ __webpack_exports__["multiplyScalar"] = multiplyScalar;
/* harmony export (immutable) */ __webpack_exports__["multiplyScalarAndAdd"] = multiplyScalarAndAdd;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(4);
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */



/**
 * 2x2 Matrix
 * @module mat2
 */

/**
 * Creates a new identity mat2
 *
 * @returns {mat2} a new 2x2 matrix
 */
function create() {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](4);
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}

/**
 * Creates a new mat2 initialized with values from an existing matrix
 *
 * @param {mat2} a matrix to clone
 * @returns {mat2} a new 2x2 matrix
 */
function clone(a) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](4);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}

/**
 * Copy the values from one mat2 to another
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}

/**
 * Set a mat2 to the identity matrix
 *
 * @param {mat2} out the receiving matrix
 * @returns {mat2} out
 */
function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}

/**
 * Create a new mat2 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m10 Component in column 1, row 0 position (index 2)
 * @param {Number} m11 Component in column 1, row 1 position (index 3)
 * @returns {mat2} out A new 2x2 matrix
 */
function fromValues(m00, m01, m10, m11) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](4);
  out[0] = m00;
  out[1] = m01;
  out[2] = m10;
  out[3] = m11;
  return out;
}

/**
 * Set the components of a mat2 to the given values
 *
 * @param {mat2} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m10 Component in column 1, row 0 position (index 2)
 * @param {Number} m11 Component in column 1, row 1 position (index 3)
 * @returns {mat2} out
 */
function set(out, m00, m01, m10, m11) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m10;
  out[3] = m11;
  return out;
}

/**
 * Transpose the values of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache
  // some values
  if (out === a) {
    let a1 = a[1];
    out[1] = a[2];
    out[2] = a1;
  } else {
    out[0] = a[0];
    out[1] = a[2];
    out[2] = a[1];
    out[3] = a[3];
  }

  return out;
}

/**
 * Inverts a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
function invert(out, a) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];

  // Calculate the determinant
  let det = a0 * a3 - a2 * a1;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  out[0] =  a3 * det;
  out[1] = -a1 * det;
  out[2] = -a2 * det;
  out[3] =  a0 * det;

  return out;
}

/**
 * Calculates the adjugate of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
function adjoint(out, a) {
  // Caching this value is nessecary if out == a
  let a0 = a[0];
  out[0] =  a[3];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] =  a0;

  return out;
}

/**
 * Calculates the determinant of a mat2
 *
 * @param {mat2} a the source matrix
 * @returns {Number} determinant of a
 */
function determinant(a) {
  return a[0] * a[3] - a[2] * a[1];
}

/**
 * Multiplies two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
function multiply(out, a, b) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  out[0] = a0 * b0 + a2 * b1;
  out[1] = a1 * b0 + a3 * b1;
  out[2] = a0 * b2 + a2 * b3;
  out[3] = a1 * b2 + a3 * b3;
  return out;
}

/**
 * Rotates a mat2 by the given angle
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
function rotate(out, a, rad) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  let s = Math.sin(rad);
  let c = Math.cos(rad);
  out[0] = a0 *  c + a2 * s;
  out[1] = a1 *  c + a3 * s;
  out[2] = a0 * -s + a2 * c;
  out[3] = a1 * -s + a3 * c;
  return out;
}

/**
 * Scales the mat2 by the dimensions in the given vec2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2} out
 **/
function scale(out, a, v) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  let v0 = v[0], v1 = v[1];
  out[0] = a0 * v0;
  out[1] = a1 * v0;
  out[2] = a2 * v1;
  out[3] = a3 * v1;
  return out;
}

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat2.identity(dest);
 *     mat2.rotate(dest, dest, rad);
 *
 * @param {mat2} out mat2 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
function fromRotation(out, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);
  out[0] = c;
  out[1] = s;
  out[2] = -s;
  out[3] = c;
  return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat2.identity(dest);
 *     mat2.scale(dest, dest, vec);
 *
 * @param {mat2} out mat2 receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat2} out
 */
function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = v[1];
  return out;
}

/**
 * Returns a string representation of a mat2
 *
 * @param {mat2} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
function str(a) {
  return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
}

/**
 * Returns Frobenius norm of a mat2
 *
 * @param {mat2} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
function frob(a) {
  return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2)))
}

/**
 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
 * @param {mat2} L the lower triangular matrix
 * @param {mat2} D the diagonal matrix
 * @param {mat2} U the upper triangular matrix
 * @param {mat2} a the input matrix to factorize
 */

function LDU(L, D, U, a) {
  L[2] = a[2]/a[0];
  U[0] = a[0];
  U[1] = a[1];
  U[3] = a[3] - L[2] * U[1];
  return [L, D, U];
}

/**
 * Adds two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
}

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  return out;
}

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat2} a The first matrix.
 * @param {mat2} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat2} a The first matrix.
 * @param {mat2} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function equals(a, b) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  return (Math.abs(a0 - b0) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
          Math.abs(a1 - b1) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
          Math.abs(a2 - b2) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
          Math.abs(a3 - b3) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a3), Math.abs(b3)));
}

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat2} out
 */
function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
}

/**
 * Adds two mat2's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat2} out the receiving vector
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat2} out
 */
function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  out[2] = a[2] + (b[2] * scale);
  out[3] = a[3] + (b[3] * scale);
  return out;
}

/**
 * Alias for {@link mat2.multiply}
 * @function
 */
const mul = multiply;
/* harmony export (immutable) */ __webpack_exports__["mul"] = mul;


/**
 * Alias for {@link mat2.subtract}
 * @function
 */
const sub = subtract;
/* harmony export (immutable) */ __webpack_exports__["sub"] = sub;



/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["create"] = create;
/* harmony export (immutable) */ __webpack_exports__["clone"] = clone;
/* harmony export (immutable) */ __webpack_exports__["copy"] = copy;
/* harmony export (immutable) */ __webpack_exports__["identity"] = identity;
/* harmony export (immutable) */ __webpack_exports__["fromValues"] = fromValues;
/* harmony export (immutable) */ __webpack_exports__["set"] = set;
/* harmony export (immutable) */ __webpack_exports__["invert"] = invert;
/* harmony export (immutable) */ __webpack_exports__["determinant"] = determinant;
/* harmony export (immutable) */ __webpack_exports__["multiply"] = multiply;
/* harmony export (immutable) */ __webpack_exports__["rotate"] = rotate;
/* harmony export (immutable) */ __webpack_exports__["scale"] = scale;
/* harmony export (immutable) */ __webpack_exports__["translate"] = translate;
/* harmony export (immutable) */ __webpack_exports__["fromRotation"] = fromRotation;
/* harmony export (immutable) */ __webpack_exports__["fromScaling"] = fromScaling;
/* harmony export (immutable) */ __webpack_exports__["fromTranslation"] = fromTranslation;
/* harmony export (immutable) */ __webpack_exports__["str"] = str;
/* harmony export (immutable) */ __webpack_exports__["frob"] = frob;
/* harmony export (immutable) */ __webpack_exports__["add"] = add;
/* harmony export (immutable) */ __webpack_exports__["subtract"] = subtract;
/* harmony export (immutable) */ __webpack_exports__["multiplyScalar"] = multiplyScalar;
/* harmony export (immutable) */ __webpack_exports__["multiplyScalarAndAdd"] = multiplyScalarAndAdd;
/* harmony export (immutable) */ __webpack_exports__["exactEquals"] = exactEquals;
/* harmony export (immutable) */ __webpack_exports__["equals"] = equals;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(4);
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */



/**
 * 2x3 Matrix
 * @module mat2d
 *
 * @description
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, c, tx,
 *  b, d, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, c, tx,
 *  b, d, ty,
 *  0, 0, 1]
 * </pre>
 * The last row is ignored so the array is shorter and operations are faster.
 */

/**
 * Creates a new identity mat2d
 *
 * @returns {mat2d} a new 2x3 matrix
 */
function create() {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](6);
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = 0;
  out[5] = 0;
  return out;
}

/**
 * Creates a new mat2d initialized with values from an existing matrix
 *
 * @param {mat2d} a matrix to clone
 * @returns {mat2d} a new 2x3 matrix
 */
function clone(a) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](6);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  return out;
}

/**
 * Copy the values from one mat2d to another
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  return out;
}

/**
 * Set a mat2d to the identity matrix
 *
 * @param {mat2d} out the receiving matrix
 * @returns {mat2d} out
 */
function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = 0;
  out[5] = 0;
  return out;
}

/**
 * Create a new mat2d with the given values
 *
 * @param {Number} a Component A (index 0)
 * @param {Number} b Component B (index 1)
 * @param {Number} c Component C (index 2)
 * @param {Number} d Component D (index 3)
 * @param {Number} tx Component TX (index 4)
 * @param {Number} ty Component TY (index 5)
 * @returns {mat2d} A new mat2d
 */
function fromValues(a, b, c, d, tx, ty) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](6);
  out[0] = a;
  out[1] = b;
  out[2] = c;
  out[3] = d;
  out[4] = tx;
  out[5] = ty;
  return out;
}

/**
 * Set the components of a mat2d to the given values
 *
 * @param {mat2d} out the receiving matrix
 * @param {Number} a Component A (index 0)
 * @param {Number} b Component B (index 1)
 * @param {Number} c Component C (index 2)
 * @param {Number} d Component D (index 3)
 * @param {Number} tx Component TX (index 4)
 * @param {Number} ty Component TY (index 5)
 * @returns {mat2d} out
 */
function set(out, a, b, c, d, tx, ty) {
  out[0] = a;
  out[1] = b;
  out[2] = c;
  out[3] = d;
  out[4] = tx;
  out[5] = ty;
  return out;
}

/**
 * Inverts a mat2d
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
function invert(out, a) {
  let aa = a[0], ab = a[1], ac = a[2], ad = a[3];
  let atx = a[4], aty = a[5];

  let det = aa * ad - ab * ac;
  if(!det){
    return null;
  }
  det = 1.0 / det;

  out[0] = ad * det;
  out[1] = -ab * det;
  out[2] = -ac * det;
  out[3] = aa * det;
  out[4] = (ac * aty - ad * atx) * det;
  out[5] = (ab * atx - aa * aty) * det;
  return out;
}

/**
 * Calculates the determinant of a mat2d
 *
 * @param {mat2d} a the source matrix
 * @returns {Number} determinant of a
 */
function determinant(a) {
  return a[0] * a[3] - a[1] * a[2];
}

/**
 * Multiplies two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
function multiply(out, a, b) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
  let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
  out[0] = a0 * b0 + a2 * b1;
  out[1] = a1 * b0 + a3 * b1;
  out[2] = a0 * b2 + a2 * b3;
  out[3] = a1 * b2 + a3 * b3;
  out[4] = a0 * b4 + a2 * b5 + a4;
  out[5] = a1 * b4 + a3 * b5 + a5;
  return out;
}

/**
 * Rotates a mat2d by the given angle
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
function rotate(out, a, rad) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
  let s = Math.sin(rad);
  let c = Math.cos(rad);
  out[0] = a0 *  c + a2 * s;
  out[1] = a1 *  c + a3 * s;
  out[2] = a0 * -s + a2 * c;
  out[3] = a1 * -s + a3 * c;
  out[4] = a4;
  out[5] = a5;
  return out;
}

/**
 * Scales the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2d} out
 **/
function scale(out, a, v) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
  let v0 = v[0], v1 = v[1];
  out[0] = a0 * v0;
  out[1] = a1 * v0;
  out[2] = a2 * v1;
  out[3] = a3 * v1;
  out[4] = a4;
  out[5] = a5;
  return out;
}

/**
 * Translates the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to translate the matrix by
 * @returns {mat2d} out
 **/
function translate(out, a, v) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
  let v0 = v[0], v1 = v[1];
  out[0] = a0;
  out[1] = a1;
  out[2] = a2;
  out[3] = a3;
  out[4] = a0 * v0 + a2 * v1 + a4;
  out[5] = a1 * v0 + a3 * v1 + a5;
  return out;
}

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.rotate(dest, dest, rad);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
function fromRotation(out, rad) {
  let s = Math.sin(rad), c = Math.cos(rad);
  out[0] = c;
  out[1] = s;
  out[2] = -s;
  out[3] = c;
  out[4] = 0;
  out[5] = 0;
  return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.scale(dest, dest, vec);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat2d} out
 */
function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = v[1];
  out[4] = 0;
  out[5] = 0;
  return out;
}

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.translate(dest, dest, vec);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {vec2} v Translation vector
 * @returns {mat2d} out
 */
function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = v[0];
  out[5] = v[1];
  return out;
}

/**
 * Returns a string representation of a mat2d
 *
 * @param {mat2d} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
function str(a) {
  return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' +
          a[3] + ', ' + a[4] + ', ' + a[5] + ')';
}

/**
 * Returns Frobenius norm of a mat2d
 *
 * @param {mat2d} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
function frob(a) {
  return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1))
}

/**
 * Adds two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  return out;
}

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  return out;
}

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat2d} out
 */
function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  return out;
}

/**
 * Adds two mat2d's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat2d} out the receiving vector
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat2d} out
 */
function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  out[2] = a[2] + (b[2] * scale);
  out[3] = a[3] + (b[3] * scale);
  out[4] = a[4] + (b[4] * scale);
  out[5] = a[5] + (b[5] * scale);
  return out;
}

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat2d} a The first matrix.
 * @param {mat2d} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5];
}

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat2d} a The first matrix.
 * @param {mat2d} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function equals(a, b) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
  let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
  return (Math.abs(a0 - b0) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
          Math.abs(a1 - b1) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
          Math.abs(a2 - b2) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
          Math.abs(a3 - b3) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
          Math.abs(a4 - b4) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
          Math.abs(a5 - b5) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a5), Math.abs(b5)));
}

/**
 * Alias for {@link mat2d.multiply}
 * @function
 */
const mul = multiply;
/* harmony export (immutable) */ __webpack_exports__["mul"] = mul;


/**
 * Alias for {@link mat2d.subtract}
 * @function
 */
const sub = subtract;
/* harmony export (immutable) */ __webpack_exports__["sub"] = sub;



/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["create"] = create;
/* harmony export (immutable) */ __webpack_exports__["clone"] = clone;
/* harmony export (immutable) */ __webpack_exports__["copy"] = copy;
/* harmony export (immutable) */ __webpack_exports__["fromValues"] = fromValues;
/* harmony export (immutable) */ __webpack_exports__["set"] = set;
/* harmony export (immutable) */ __webpack_exports__["identity"] = identity;
/* harmony export (immutable) */ __webpack_exports__["transpose"] = transpose;
/* harmony export (immutable) */ __webpack_exports__["invert"] = invert;
/* harmony export (immutable) */ __webpack_exports__["adjoint"] = adjoint;
/* harmony export (immutable) */ __webpack_exports__["determinant"] = determinant;
/* harmony export (immutable) */ __webpack_exports__["multiply"] = multiply;
/* harmony export (immutable) */ __webpack_exports__["translate"] = translate;
/* harmony export (immutable) */ __webpack_exports__["scale"] = scale;
/* harmony export (immutable) */ __webpack_exports__["rotate"] = rotate;
/* harmony export (immutable) */ __webpack_exports__["rotateX"] = rotateX;
/* harmony export (immutable) */ __webpack_exports__["rotateY"] = rotateY;
/* harmony export (immutable) */ __webpack_exports__["rotateZ"] = rotateZ;
/* harmony export (immutable) */ __webpack_exports__["fromTranslation"] = fromTranslation;
/* harmony export (immutable) */ __webpack_exports__["fromScaling"] = fromScaling;
/* harmony export (immutable) */ __webpack_exports__["fromRotation"] = fromRotation;
/* harmony export (immutable) */ __webpack_exports__["fromXRotation"] = fromXRotation;
/* harmony export (immutable) */ __webpack_exports__["fromYRotation"] = fromYRotation;
/* harmony export (immutable) */ __webpack_exports__["fromZRotation"] = fromZRotation;
/* harmony export (immutable) */ __webpack_exports__["fromRotationTranslation"] = fromRotationTranslation;
/* harmony export (immutable) */ __webpack_exports__["getTranslation"] = getTranslation;
/* harmony export (immutable) */ __webpack_exports__["getScaling"] = getScaling;
/* harmony export (immutable) */ __webpack_exports__["getRotation"] = getRotation;
/* harmony export (immutable) */ __webpack_exports__["fromRotationTranslationScale"] = fromRotationTranslationScale;
/* harmony export (immutable) */ __webpack_exports__["fromRotationTranslationScaleOrigin"] = fromRotationTranslationScaleOrigin;
/* harmony export (immutable) */ __webpack_exports__["fromQuat"] = fromQuat;
/* harmony export (immutable) */ __webpack_exports__["frustum"] = frustum;
/* harmony export (immutable) */ __webpack_exports__["perspective"] = perspective;
/* harmony export (immutable) */ __webpack_exports__["perspectiveFromFieldOfView"] = perspectiveFromFieldOfView;
/* harmony export (immutable) */ __webpack_exports__["ortho"] = ortho;
/* harmony export (immutable) */ __webpack_exports__["lookAt"] = lookAt;
/* harmony export (immutable) */ __webpack_exports__["targetTo"] = targetTo;
/* harmony export (immutable) */ __webpack_exports__["str"] = str;
/* harmony export (immutable) */ __webpack_exports__["frob"] = frob;
/* harmony export (immutable) */ __webpack_exports__["add"] = add;
/* harmony export (immutable) */ __webpack_exports__["subtract"] = subtract;
/* harmony export (immutable) */ __webpack_exports__["multiplyScalar"] = multiplyScalar;
/* harmony export (immutable) */ __webpack_exports__["multiplyScalarAndAdd"] = multiplyScalarAndAdd;
/* harmony export (immutable) */ __webpack_exports__["exactEquals"] = exactEquals;
/* harmony export (immutable) */ __webpack_exports__["equals"] = equals;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(4);
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */



/**
 * 4x4 Matrix
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
function create() {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](16);
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
function clone(a) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](16);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}

/**
 * Create a new mat4 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} A new mat4
 */
function fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](16);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}

/**
 * Set the components of a mat4 to the given values
 *
 * @param {mat4} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} out
 */
function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}


/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    let a01 = a[1], a02 = a[2], a03 = a[3];
    let a12 = a[6], a13 = a[7];
    let a23 = a[11];

    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a01;
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = a[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
  } else {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
  }

  return out;
}

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function invert(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32;

  // Calculate the determinant
  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

  return out;
}

/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function adjoint(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
  out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
  out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
  out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
  out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
  out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
  out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
  out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
  out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
  out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
  out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
  out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
  out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
  out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
  out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
  out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
  return out;
}

/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
function determinant(a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32;

  // Calculate the determinant
  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}

/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
function multiply(out, a, b) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  // Cache only the current line of the second matrix
  let b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
  out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
  out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
  out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
  return out;
}

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
function translate(out, a, v) {
  let x = v[0], y = v[1], z = v[2];
  let a00, a01, a02, a03;
  let a10, a11, a12, a13;
  let a20, a21, a22, a23;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
    out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
    out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}

/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
function scale(out, a, v) {
  let x = v[0], y = v[1], z = v[2];

  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}

/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
function rotate(out, a, rad, axis) {
  let x = axis[0], y = axis[1], z = axis[2];
  let len = Math.sqrt(x * x + y * y + z * z);
  let s, c, t;
  let a00, a01, a02, a03;
  let a10, a11, a12, a13;
  let a20, a21, a22, a23;
  let b00, b01, b02;
  let b10, b11, b12;
  let b20, b21, b22;

  if (Math.abs(len) < __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]) { return null; }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;

  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;

  a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
  a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
  a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

  // Construct the elements of the rotation matrix
  b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
  b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
  b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

  // Perform rotation-specific matrix multiplication
  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;

  if (a !== out) { // If the source and destination differ, copy the unchanged last row
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  return out;
}

/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateX(out, a, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);
  let a10 = a[4];
  let a11 = a[5];
  let a12 = a[6];
  let a13 = a[7];
  let a20 = a[8];
  let a21 = a[9];
  let a22 = a[10];
  let a23 = a[11];

  if (a !== out) { // If the source and destination differ, copy the unchanged rows
    out[0]  = a[0];
    out[1]  = a[1];
    out[2]  = a[2];
    out[3]  = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  // Perform axis-specific matrix multiplication
  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}

/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateY(out, a, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);
  let a00 = a[0];
  let a01 = a[1];
  let a02 = a[2];
  let a03 = a[3];
  let a20 = a[8];
  let a21 = a[9];
  let a22 = a[10];
  let a23 = a[11];

  if (a !== out) { // If the source and destination differ, copy the unchanged rows
    out[4]  = a[4];
    out[5]  = a[5];
    out[6]  = a[6];
    out[7]  = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  // Perform axis-specific matrix multiplication
  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}

/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateZ(out, a, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);
  let a00 = a[0];
  let a01 = a[1];
  let a02 = a[2];
  let a03 = a[3];
  let a10 = a[4];
  let a11 = a[5];
  let a12 = a[6];
  let a13 = a[7];

  if (a !== out) { // If the source and destination differ, copy the unchanged last row
    out[8]  = a[8];
    out[9]  = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  // Perform axis-specific matrix multiplication
  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.scale(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Scaling vector
 * @returns {mat4} out
 */
function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = v[1];
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = v[2];
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
function fromRotation(out, rad, axis) {
  let x = axis[0], y = axis[1], z = axis[2];
  let len = Math.sqrt(x * x + y * y + z * z);
  let s, c, t;

  if (Math.abs(len) < __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]) { return null; }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;

  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;

  // Perform rotation-specific matrix multiplication
  out[0] = x * x * t + c;
  out[1] = y * x * t + z * s;
  out[2] = z * x * t - y * s;
  out[3] = 0;
  out[4] = x * y * t - z * s;
  out[5] = y * y * t + c;
  out[6] = z * y * t + x * s;
  out[7] = 0;
  out[8] = x * z * t + y * s;
  out[9] = y * z * t - x * s;
  out[10] = z * z * t + c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateX(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function fromXRotation(out, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);

  // Perform axis-specific matrix multiplication
  out[0]  = 1;
  out[1]  = 0;
  out[2]  = 0;
  out[3]  = 0;
  out[4] = 0;
  out[5] = c;
  out[6] = s;
  out[7] = 0;
  out[8] = 0;
  out[9] = -s;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateY(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function fromYRotation(out, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);

  // Perform axis-specific matrix multiplication
  out[0]  = c;
  out[1]  = 0;
  out[2]  = -s;
  out[3]  = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = s;
  out[9] = 0;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateZ(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function fromZRotation(out, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);

  // Perform axis-specific matrix multiplication
  out[0]  = c;
  out[1]  = s;
  out[2]  = 0;
  out[3]  = 0;
  out[4] = -s;
  out[5] = c;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
function fromRotationTranslation(out, q, v) {
  // Quaternion math
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;

  let xx = x * x2;
  let xy = x * y2;
  let xz = x * z2;
  let yy = y * y2;
  let yz = y * z2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;

  out[0] = 1 - (yy + zz);
  out[1] = xy + wz;
  out[2] = xz - wy;
  out[3] = 0;
  out[4] = xy - wz;
  out[5] = 1 - (xx + zz);
  out[6] = yz + wx;
  out[7] = 0;
  out[8] = xz + wy;
  out[9] = yz - wx;
  out[10] = 1 - (xx + yy);
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;

  return out;
}

/**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslation,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive translation component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */
function getTranslation(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];

  return out;
}

/**
 * Returns the scaling factor component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslationScale
 *  with a normalized Quaternion paramter, the returned vector will be
 *  the same as the scaling vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive scaling factor component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */
function getScaling(out, mat) {
  let m11 = mat[0];
  let m12 = mat[1];
  let m13 = mat[2];
  let m21 = mat[4];
  let m22 = mat[5];
  let m23 = mat[6];
  let m31 = mat[8];
  let m32 = mat[9];
  let m33 = mat[10];

  out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
  out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
  out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);

  return out;
}

/**
 * Returns a quaternion representing the rotational component
 *  of a transformation matrix. If a matrix is built with
 *  fromRotationTranslation, the returned quaternion will be the
 *  same as the quaternion originally supplied.
 * @param {quat} out Quaternion to receive the rotation component
 * @param {mat4} mat Matrix to be decomposed (input)
 * @return {quat} out
 */
function getRotation(out, mat) {
  // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
  let trace = mat[0] + mat[5] + mat[10];
  let S = 0;

  if (trace > 0) {
    S = Math.sqrt(trace + 1.0) * 2;
    out[3] = 0.25 * S;
    out[0] = (mat[6] - mat[9]) / S;
    out[1] = (mat[8] - mat[2]) / S;
    out[2] = (mat[1] - mat[4]) / S;
  } else if ((mat[0] > mat[5])&(mat[0] > mat[10])) {
    S = Math.sqrt(1.0 + mat[0] - mat[5] - mat[10]) * 2;
    out[3] = (mat[6] - mat[9]) / S;
    out[0] = 0.25 * S;
    out[1] = (mat[1] + mat[4]) / S;
    out[2] = (mat[8] + mat[2]) / S;
  } else if (mat[5] > mat[10]) {
    S = Math.sqrt(1.0 + mat[5] - mat[0] - mat[10]) * 2;
    out[3] = (mat[8] - mat[2]) / S;
    out[0] = (mat[1] + mat[4]) / S;
    out[1] = 0.25 * S;
    out[2] = (mat[6] + mat[9]) / S;
  } else {
    S = Math.sqrt(1.0 + mat[10] - mat[0] - mat[5]) * 2;
    out[3] = (mat[1] - mat[4]) / S;
    out[0] = (mat[8] + mat[2]) / S;
    out[1] = (mat[6] + mat[9]) / S;
    out[2] = 0.25 * S;
  }

  return out;
}

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @returns {mat4} out
 */
function fromRotationTranslationScale(out, q, v, s) {
  // Quaternion math
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;

  let xx = x * x2;
  let xy = x * y2;
  let xz = x * z2;
  let yy = y * y2;
  let yz = y * z2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;
  let sx = s[0];
  let sy = s[1];
  let sz = s[2];

  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;

  return out;
}

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     mat4.translate(dest, origin);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *     mat4.translate(dest, negativeOrigin);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @param {vec3} o The origin vector around which to scale and rotate
 * @returns {mat4} out
 */
function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
  // Quaternion math
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;

  let xx = x * x2;
  let xy = x * y2;
  let xz = x * z2;
  let yy = y * y2;
  let yz = y * z2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;

  let sx = s[0];
  let sy = s[1];
  let sz = s[2];

  let ox = o[0];
  let oy = o[1];
  let oz = o[2];

  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0] + ox - (out[0] * ox + out[4] * oy + out[8] * oz);
  out[13] = v[1] + oy - (out[1] * ox + out[5] * oy + out[9] * oz);
  out[14] = v[2] + oz - (out[2] * ox + out[6] * oy + out[10] * oz);
  out[15] = 1;

  return out;
}

/**
 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat} q Quaternion to create matrix from
 *
 * @returns {mat4} out
 */
function fromQuat(out, q) {
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;

  let xx = x * x2;
  let yx = y * x2;
  let yy = y * y2;
  let zx = z * x2;
  let zy = z * y2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;

  out[0] = 1 - yy - zz;
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;

  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;

  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;

  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;

  return out;
}

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
function frustum(out, left, right, bottom, top, near, far) {
  let rl = 1 / (right - left);
  let tb = 1 / (top - bottom);
  let nf = 1 / (near - far);
  out[0] = (near * 2) * rl;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = (near * 2) * tb;
  out[6] = 0;
  out[7] = 0;
  out[8] = (right + left) * rl;
  out[9] = (top + bottom) * tb;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = (far * near * 2) * nf;
  out[15] = 0;
  return out;
}

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function perspective(out, fovy, aspect, near, far) {
  let f = 1.0 / Math.tan(fovy / 2);
  let nf = 1 / (near - far);
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = (2 * far * near) * nf;
  out[15] = 0;
  return out;
}

/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function perspectiveFromFieldOfView(out, fov, near, far) {
  let upTan = Math.tan(fov.upDegrees * Math.PI/180.0);
  let downTan = Math.tan(fov.downDegrees * Math.PI/180.0);
  let leftTan = Math.tan(fov.leftDegrees * Math.PI/180.0);
  let rightTan = Math.tan(fov.rightDegrees * Math.PI/180.0);
  let xScale = 2.0 / (leftTan + rightTan);
  let yScale = 2.0 / (upTan + downTan);

  out[0] = xScale;
  out[1] = 0.0;
  out[2] = 0.0;
  out[3] = 0.0;
  out[4] = 0.0;
  out[5] = yScale;
  out[6] = 0.0;
  out[7] = 0.0;
  out[8] = -((leftTan - rightTan) * xScale * 0.5);
  out[9] = ((upTan - downTan) * yScale * 0.5);
  out[10] = far / (near - far);
  out[11] = -1.0;
  out[12] = 0.0;
  out[13] = 0.0;
  out[14] = (far * near) / (near - far);
  out[15] = 0.0;
  return out;
}

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function ortho(out, left, right, bottom, top, near, far) {
  let lr = 1 / (left - right);
  let bt = 1 / (bottom - top);
  let nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
function lookAt(out, eye, center, up) {
  let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  let eyex = eye[0];
  let eyey = eye[1];
  let eyez = eye[2];
  let upx = up[0];
  let upy = up[1];
  let upz = up[2];
  let centerx = center[0];
  let centery = center[1];
  let centerz = center[2];

  if (Math.abs(eyex - centerx) < __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"] &&
      Math.abs(eyey - centery) < __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"] &&
      Math.abs(eyez - centerz) < __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]) {
    return mat4.identity(out);
  }

  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;

  len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;

  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;

  len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;

  return out;
}

/**
 * Generates a matrix that makes something look at something else.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
function targetTo(out, eye, target, up) {
  let eyex = eye[0],
      eyey = eye[1],
      eyez = eye[2],
      upx = up[0],
      upy = up[1],
      upz = up[2];

  let z0 = eyex - target[0],
      z1 = eyey - target[1],
      z2 = eyez - target[2];

  let len = z0*z0 + z1*z1 + z2*z2;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    z0 *= len;
    z1 *= len;
    z2 *= len;
  }

  let x0 = upy * z2 - upz * z1,
      x1 = upz * z0 - upx * z2,
      x2 = upx * z1 - upy * z0;

  out[0] = x0;
  out[1] = x1;
  out[2] = x2;
  out[3] = 0;
  out[4] = z1 * x2 - z2 * x1;
  out[5] = z2 * x0 - z0 * x2;
  out[6] = z0 * x1 - z1 * x0;
  out[7] = 0;
  out[8] = z0;
  out[9] = z1;
  out[10] = z2;
  out[11] = 0;
  out[12] = eyex;
  out[13] = eyey;
  out[14] = eyez;
  out[15] = 1;
  return out;
};

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
function str(a) {
  return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
          a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
          a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' +
          a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
}

/**
 * Returns Frobenius norm of a mat4
 *
 * @param {mat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
function frob(a) {
  return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2) ))
}

/**
 * Adds two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  out[9] = a[9] + b[9];
  out[10] = a[10] + b[10];
  out[11] = a[11] + b[11];
  out[12] = a[12] + b[12];
  out[13] = a[13] + b[13];
  out[14] = a[14] + b[14];
  out[15] = a[15] + b[15];
  return out;
}

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  out[9] = a[9] - b[9];
  out[10] = a[10] - b[10];
  out[11] = a[11] - b[11];
  out[12] = a[12] - b[12];
  out[13] = a[13] - b[13];
  out[14] = a[14] - b[14];
  out[15] = a[15] - b[15];
  return out;
}

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat4} out
 */
function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  out[9] = a[9] * b;
  out[10] = a[10] * b;
  out[11] = a[11] * b;
  out[12] = a[12] * b;
  out[13] = a[13] * b;
  out[14] = a[14] * b;
  out[15] = a[15] * b;
  return out;
}

/**
 * Adds two mat4's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat4} out the receiving vector
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat4} out
 */
function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  out[2] = a[2] + (b[2] * scale);
  out[3] = a[3] + (b[3] * scale);
  out[4] = a[4] + (b[4] * scale);
  out[5] = a[5] + (b[5] * scale);
  out[6] = a[6] + (b[6] * scale);
  out[7] = a[7] + (b[7] * scale);
  out[8] = a[8] + (b[8] * scale);
  out[9] = a[9] + (b[9] * scale);
  out[10] = a[10] + (b[10] * scale);
  out[11] = a[11] + (b[11] * scale);
  out[12] = a[12] + (b[12] * scale);
  out[13] = a[13] + (b[13] * scale);
  out[14] = a[14] + (b[14] * scale);
  out[15] = a[15] + (b[15] * scale);
  return out;
}

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] &&
         a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] &&
         a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] &&
         a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
}

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function equals(a, b) {
  let a0  = a[0],  a1  = a[1],  a2  = a[2],  a3  = a[3];
  let a4  = a[4],  a5  = a[5],  a6  = a[6],  a7  = a[7];
  let a8  = a[8],  a9  = a[9],  a10 = a[10], a11 = a[11];
  let a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];

  let b0  = b[0],  b1  = b[1],  b2  = b[2],  b3  = b[3];
  let b4  = b[4],  b5  = b[5],  b6  = b[6],  b7  = b[7];
  let b8  = b[8],  b9  = b[9],  b10 = b[10], b11 = b[11];
  let b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];

  return (Math.abs(a0 - b0) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
          Math.abs(a1 - b1) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
          Math.abs(a2 - b2) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
          Math.abs(a3 - b3) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
          Math.abs(a4 - b4) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
          Math.abs(a5 - b5) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a5), Math.abs(b5)) &&
          Math.abs(a6 - b6) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a6), Math.abs(b6)) &&
          Math.abs(a7 - b7) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a7), Math.abs(b7)) &&
          Math.abs(a8 - b8) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a8), Math.abs(b8)) &&
          Math.abs(a9 - b9) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a9), Math.abs(b9)) &&
          Math.abs(a10 - b10) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a10), Math.abs(b10)) &&
          Math.abs(a11 - b11) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a11), Math.abs(b11)) &&
          Math.abs(a12 - b12) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a12), Math.abs(b12)) &&
          Math.abs(a13 - b13) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a13), Math.abs(b13)) &&
          Math.abs(a14 - b14) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a14), Math.abs(b14)) &&
          Math.abs(a15 - b15) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a15), Math.abs(b15)));
}

/**
 * Alias for {@link mat4.multiply}
 * @function
 */
const mul = multiply;
/* harmony export (immutable) */ __webpack_exports__["mul"] = mul;


/**
 * Alias for {@link mat4.subtract}
 * @function
 */
const sub = subtract;
/* harmony export (immutable) */ __webpack_exports__["sub"] = sub;



/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["create"] = create;
/* harmony export (immutable) */ __webpack_exports__["identity"] = identity;
/* harmony export (immutable) */ __webpack_exports__["setAxisAngle"] = setAxisAngle;
/* harmony export (immutable) */ __webpack_exports__["getAxisAngle"] = getAxisAngle;
/* harmony export (immutable) */ __webpack_exports__["multiply"] = multiply;
/* harmony export (immutable) */ __webpack_exports__["rotateX"] = rotateX;
/* harmony export (immutable) */ __webpack_exports__["rotateY"] = rotateY;
/* harmony export (immutable) */ __webpack_exports__["rotateZ"] = rotateZ;
/* harmony export (immutable) */ __webpack_exports__["calculateW"] = calculateW;
/* harmony export (immutable) */ __webpack_exports__["slerp"] = slerp;
/* harmony export (immutable) */ __webpack_exports__["invert"] = invert;
/* harmony export (immutable) */ __webpack_exports__["conjugate"] = conjugate;
/* harmony export (immutable) */ __webpack_exports__["fromMat3"] = fromMat3;
/* harmony export (immutable) */ __webpack_exports__["fromEuler"] = fromEuler;
/* harmony export (immutable) */ __webpack_exports__["str"] = str;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mat3__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__vec3__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__vec4__ = __webpack_require__(31);
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */






/**
 * Quaternion
 * @module quat
 */

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */
function create() {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](4);
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}

/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */
function identity(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}

/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/
function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  let s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}

/**
 * Gets the rotation axis and angle for a given
 *  quaternion. If a quaternion is created with
 *  setAxisAngle, this method will return the same
 *  values as providied in the original parameter list
 *  OR functionally equivalent values.
 * Example: The quaternion formed by axis [0, 0, 1] and
 *  angle -90 is the same as the quaternion formed by
 *  [0, 0, 1] and 270. This method favors the latter.
 * @param  {vec3} out_axis  Vector receiving the axis of rotation
 * @param  {quat} q     Quaternion to be decomposed
 * @return {Number}     Angle, in radians, of the rotation
 */
function getAxisAngle(out_axis, q) {
  let rad = Math.acos(q[3]) * 2.0;
  let s = Math.sin(rad / 2.0);
  if (s != 0.0) {
    out_axis[0] = q[0] / s;
    out_axis[1] = q[1] / s;
    out_axis[2] = q[2] / s;
  } else {
    // If s is zero, return any axis (no rotation - axis does not matter)
    out_axis[0] = 1;
    out_axis[1] = 0;
    out_axis[2] = 0;
  }
  return rad;
}

/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */
function multiply(out, a, b) {
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bx = b[0], by = b[1], bz = b[2], bw = b[3];

  out[0] = ax * bw + aw * bx + ay * bz - az * by;
  out[1] = ay * bw + aw * by + az * bx - ax * bz;
  out[2] = az * bw + aw * bz + ax * by - ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}

/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
function rotateX(out, a, rad) {
  rad *= 0.5;

  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bx = Math.sin(rad), bw = Math.cos(rad);

  out[0] = ax * bw + aw * bx;
  out[1] = ay * bw + az * bx;
  out[2] = az * bw - ay * bx;
  out[3] = aw * bw - ax * bx;
  return out;
}

/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
function rotateY(out, a, rad) {
  rad *= 0.5;

  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let by = Math.sin(rad), bw = Math.cos(rad);

  out[0] = ax * bw - az * by;
  out[1] = ay * bw + aw * by;
  out[2] = az * bw + ax * by;
  out[3] = aw * bw - ay * by;
  return out;
}

/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
function rotateZ(out, a, rad) {
  rad *= 0.5;

  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bz = Math.sin(rad), bw = Math.cos(rad);

  out[0] = ax * bw + ay * bz;
  out[1] = ay * bw - ax * bz;
  out[2] = az * bw + aw * bz;
  out[3] = aw * bw - az * bz;
  return out;
}

/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate W component of
 * @returns {quat} out
 */
function calculateW(out, a) {
  let x = a[0], y = a[1], z = a[2];

  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
  return out;
}

/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 */
function slerp(out, a, b, t) {
  // benchmarks:
  //    http://jsperf.com/quaternion-slerp-implementations
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bx = b[0], by = b[1], bz = b[2], bw = b[3];

  let omega, cosom, sinom, scale0, scale1;

  // calc cosine
  cosom = ax * bx + ay * by + az * bz + aw * bw;
  // adjust signs (if necessary)
  if ( cosom < 0.0 ) {
    cosom = -cosom;
    bx = - bx;
    by = - by;
    bz = - bz;
    bw = - bw;
  }
  // calculate coefficients
  if ( (1.0 - cosom) > 0.000001 ) {
    // standard case (slerp)
    omega  = Math.acos(cosom);
    sinom  = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    // "from" and "to" quaternions are very close
    //  ... so we can do a linear interpolation
    scale0 = 1.0 - t;
    scale1 = t;
  }
  // calculate final values
  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;

  return out;
}

/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */
function invert(out, a) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  let dot = a0*a0 + a1*a1 + a2*a2 + a3*a3;
  let invDot = dot ? 1.0/dot : 0;

  // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

  out[0] = -a0*invDot;
  out[1] = -a1*invDot;
  out[2] = -a2*invDot;
  out[3] = a3*invDot;
  return out;
}

/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */
function conjugate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  return out;
}

/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */
function fromMat3(out, m) {
  // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
  // article "Quaternion Calculus and Fast Animation".
  let fTrace = m[0] + m[4] + m[8];
  let fRoot;

  if ( fTrace > 0.0 ) {
    // |w| > 1/2, may as well choose w > 1/2
    fRoot = Math.sqrt(fTrace + 1.0);  // 2w
    out[3] = 0.5 * fRoot;
    fRoot = 0.5/fRoot;  // 1/(4w)
    out[0] = (m[5]-m[7])*fRoot;
    out[1] = (m[6]-m[2])*fRoot;
    out[2] = (m[1]-m[3])*fRoot;
  } else {
    // |w| <= 1/2
    let i = 0;
    if ( m[4] > m[0] )
      i = 1;
    if ( m[8] > m[i*3+i] )
      i = 2;
    let j = (i+1)%3;
    let k = (i+2)%3;

    fRoot = Math.sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j*3+k] - m[k*3+j]) * fRoot;
    out[j] = (m[j*3+i] + m[i*3+j]) * fRoot;
    out[k] = (m[k*3+i] + m[i*3+k]) * fRoot;
  }

  return out;
}

/**
 * Creates a quaternion from the given euler angle x, y, z.
 *
 * @param {quat} out the receiving quaternion
 * @param {x} Angle to rotate around X axis in degrees.
 * @param {y} Angle to rotate around Y axis in degrees.
 * @param {z} Angle to rotate around Z axis in degrees.
 * @returns {quat} out
 * @function
 */
function fromEuler(out, x, y, z) {
    let halfToRad = 0.5 * Math.PI / 180.0;
    x *= halfToRad;
    y *= halfToRad;
    z *= halfToRad;

    let sx = Math.sin(x);
    let cx = Math.cos(x);
    let sy = Math.sin(y);
    let cy = Math.cos(y);
    let sz = Math.sin(z);
    let cz = Math.cos(z);

    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;

    return out;
}

/**
 * Returns a string representation of a quatenion
 *
 * @param {quat} a vector to represent as a string
 * @returns {String} string representation of the vector
 */
function str(a) {
  return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
}

/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {quat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */
const clone = __WEBPACK_IMPORTED_MODULE_3__vec4__["clone"];
/* harmony export (immutable) */ __webpack_exports__["clone"] = clone;


/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */
const fromValues = __WEBPACK_IMPORTED_MODULE_3__vec4__["fromValues"];
/* harmony export (immutable) */ __webpack_exports__["fromValues"] = fromValues;


/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */
const copy = __WEBPACK_IMPORTED_MODULE_3__vec4__["copy"];
/* harmony export (immutable) */ __webpack_exports__["copy"] = copy;


/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */
const set = __WEBPACK_IMPORTED_MODULE_3__vec4__["set"];
/* harmony export (immutable) */ __webpack_exports__["set"] = set;


/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 * @function
 */
const add = __WEBPACK_IMPORTED_MODULE_3__vec4__["add"];
/* harmony export (immutable) */ __webpack_exports__["add"] = add;


/**
 * Alias for {@link quat.multiply}
 * @function
 */
const mul = multiply;
/* harmony export (immutable) */ __webpack_exports__["mul"] = mul;


/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {quat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */
const scale = __WEBPACK_IMPORTED_MODULE_3__vec4__["scale"];
/* harmony export (immutable) */ __webpack_exports__["scale"] = scale;


/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */
const dot = __WEBPACK_IMPORTED_MODULE_3__vec4__["dot"];
/* harmony export (immutable) */ __webpack_exports__["dot"] = dot;


/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 * @function
 */
const lerp = __WEBPACK_IMPORTED_MODULE_3__vec4__["lerp"];
/* harmony export (immutable) */ __webpack_exports__["lerp"] = lerp;


/**
 * Calculates the length of a quat
 *
 * @param {quat} a vector to calculate length of
 * @returns {Number} length of a
 */
const length = __WEBPACK_IMPORTED_MODULE_3__vec4__["length"];
/* harmony export (immutable) */ __webpack_exports__["length"] = length;


/**
 * Alias for {@link quat.length}
 * @function
 */
const len = length;
/* harmony export (immutable) */ __webpack_exports__["len"] = len;


/**
 * Calculates the squared length of a quat
 *
 * @param {quat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */
const squaredLength = __WEBPACK_IMPORTED_MODULE_3__vec4__["squaredLength"];
/* harmony export (immutable) */ __webpack_exports__["squaredLength"] = squaredLength;


/**
 * Alias for {@link quat.squaredLength}
 * @function
 */
const sqrLen = squaredLength;
/* harmony export (immutable) */ __webpack_exports__["sqrLen"] = sqrLen;


/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */
const normalize = __WEBPACK_IMPORTED_MODULE_3__vec4__["normalize"];
/* harmony export (immutable) */ __webpack_exports__["normalize"] = normalize;


/**
 * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
 *
 * @param {quat} a The first quaternion.
 * @param {quat} b The second quaternion.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
const exactEquals = __WEBPACK_IMPORTED_MODULE_3__vec4__["exactEquals"];
/* harmony export (immutable) */ __webpack_exports__["exactEquals"] = exactEquals;


/**
 * Returns whether or not the quaternions have approximately the same elements in the same position.
 *
 * @param {quat} a The first vector.
 * @param {quat} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
const equals = __WEBPACK_IMPORTED_MODULE_3__vec4__["equals"];
/* harmony export (immutable) */ __webpack_exports__["equals"] = equals;


/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {vec3} a the initial vector
 * @param {vec3} b the destination vector
 * @returns {quat} out
 */
const rotationTo = (function() {
  let tmpvec3 = __WEBPACK_IMPORTED_MODULE_2__vec3__["create"]();
  let xUnitVec3 = __WEBPACK_IMPORTED_MODULE_2__vec3__["fromValues"](1,0,0);
  let yUnitVec3 = __WEBPACK_IMPORTED_MODULE_2__vec3__["fromValues"](0,1,0);

  return function(out, a, b) {
    let dot = __WEBPACK_IMPORTED_MODULE_2__vec3__["dot"](a, b);
    if (dot < -0.999999) {
      __WEBPACK_IMPORTED_MODULE_2__vec3__["cross"](tmpvec3, xUnitVec3, a);
      if (__WEBPACK_IMPORTED_MODULE_2__vec3__["len"](tmpvec3) < 0.000001)
        __WEBPACK_IMPORTED_MODULE_2__vec3__["cross"](tmpvec3, yUnitVec3, a);
      __WEBPACK_IMPORTED_MODULE_2__vec3__["normalize"](tmpvec3, tmpvec3);
      setAxisAngle(out, tmpvec3, Math.PI);
      return out;
    } else if (dot > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      __WEBPACK_IMPORTED_MODULE_2__vec3__["cross"](tmpvec3, a, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + dot;
      return normalize(out, out);
    }
  };
})();
/* harmony export (immutable) */ __webpack_exports__["rotationTo"] = rotationTo;


/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {quat} c the third operand
 * @param {quat} d the fourth operand
 * @param {Number} t interpolation amount
 * @returns {quat} out
 */
const sqlerp = (function () {
  let temp1 = create();
  let temp2 = create();

  return function (out, a, b, c, d, t) {
    slerp(temp1, a, d, t);
    slerp(temp2, b, c, t);
    slerp(out, temp1, temp2, 2 * t * (1 - t));

    return out;
  };
}());
/* harmony export (immutable) */ __webpack_exports__["sqlerp"] = sqlerp;


/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {vec3} view  the vector representing the viewing direction
 * @param {vec3} right the vector representing the local "right" direction
 * @param {vec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */
const setAxes = (function() {
  let matr = __WEBPACK_IMPORTED_MODULE_1__mat3__["create"]();

  return function(out, view, right, up) {
    matr[0] = right[0];
    matr[3] = right[1];
    matr[6] = right[2];

    matr[1] = up[0];
    matr[4] = up[1];
    matr[7] = up[2];

    matr[2] = -view[0];
    matr[5] = -view[1];
    matr[8] = -view[2];

    return normalize(out, fromMat3(out, matr));
  };
})();
/* harmony export (immutable) */ __webpack_exports__["setAxes"] = setAxes;



/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["create"] = create;
/* harmony export (immutable) */ __webpack_exports__["clone"] = clone;
/* harmony export (immutable) */ __webpack_exports__["fromValues"] = fromValues;
/* harmony export (immutable) */ __webpack_exports__["copy"] = copy;
/* harmony export (immutable) */ __webpack_exports__["set"] = set;
/* harmony export (immutable) */ __webpack_exports__["add"] = add;
/* harmony export (immutable) */ __webpack_exports__["subtract"] = subtract;
/* harmony export (immutable) */ __webpack_exports__["multiply"] = multiply;
/* harmony export (immutable) */ __webpack_exports__["divide"] = divide;
/* harmony export (immutable) */ __webpack_exports__["ceil"] = ceil;
/* harmony export (immutable) */ __webpack_exports__["floor"] = floor;
/* harmony export (immutable) */ __webpack_exports__["min"] = min;
/* harmony export (immutable) */ __webpack_exports__["max"] = max;
/* harmony export (immutable) */ __webpack_exports__["round"] = round;
/* harmony export (immutable) */ __webpack_exports__["scale"] = scale;
/* harmony export (immutable) */ __webpack_exports__["scaleAndAdd"] = scaleAndAdd;
/* harmony export (immutable) */ __webpack_exports__["distance"] = distance;
/* harmony export (immutable) */ __webpack_exports__["squaredDistance"] = squaredDistance;
/* harmony export (immutable) */ __webpack_exports__["length"] = length;
/* harmony export (immutable) */ __webpack_exports__["squaredLength"] = squaredLength;
/* harmony export (immutable) */ __webpack_exports__["negate"] = negate;
/* harmony export (immutable) */ __webpack_exports__["inverse"] = inverse;
/* harmony export (immutable) */ __webpack_exports__["normalize"] = normalize;
/* harmony export (immutable) */ __webpack_exports__["dot"] = dot;
/* harmony export (immutable) */ __webpack_exports__["cross"] = cross;
/* harmony export (immutable) */ __webpack_exports__["lerp"] = lerp;
/* harmony export (immutable) */ __webpack_exports__["random"] = random;
/* harmony export (immutable) */ __webpack_exports__["transformMat2"] = transformMat2;
/* harmony export (immutable) */ __webpack_exports__["transformMat2d"] = transformMat2d;
/* harmony export (immutable) */ __webpack_exports__["transformMat3"] = transformMat3;
/* harmony export (immutable) */ __webpack_exports__["transformMat4"] = transformMat4;
/* harmony export (immutable) */ __webpack_exports__["str"] = str;
/* harmony export (immutable) */ __webpack_exports__["exactEquals"] = exactEquals;
/* harmony export (immutable) */ __webpack_exports__["equals"] = equals;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(4);
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */



/**
 * 2 Dimensional Vector
 * @module vec2
 */

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */
function create() {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](2);
  out[0] = 0;
  out[1] = 0;
  return out;
}

/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {vec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */
function clone(a) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](2);
  out[0] = a[0];
  out[1] = a[1];
  return out;
}

/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */
function fromValues(x, y) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](2);
  out[0] = x;
  out[1] = y;
  return out;
}

/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  return out;
}

/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */
function set(out, x, y) {
  out[0] = x;
  out[1] = y;
  return out;
}

/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  return out;
}

/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  return out;
}

/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  return out;
};

/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  return out;
};

/**
 * Math.ceil the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to ceil
 * @returns {vec2} out
 */
function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  return out;
};

/**
 * Math.floor the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to floor
 * @returns {vec2} out
 */
function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  return out;
};

/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  return out;
};

/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  return out;
};

/**
 * Math.round the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to round
 * @returns {vec2} out
 */
function round (out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  return out;
};

/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */
function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  return out;
};

/**
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */
function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  return out;
};

/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} distance between a and b
 */
function distance(a, b) {
  var x = b[0] - a[0],
    y = b[1] - a[1];
  return Math.sqrt(x*x + y*y);
};

/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} squared distance between a and b
 */
function squaredDistance(a, b) {
  var x = b[0] - a[0],
    y = b[1] - a[1];
  return x*x + y*y;
};

/**
 * Calculates the length of a vec2
 *
 * @param {vec2} a vector to calculate length of
 * @returns {Number} length of a
 */
function length(a) {
  var x = a[0],
    y = a[1];
  return Math.sqrt(x*x + y*y);
};

/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
function squaredLength (a) {
  var x = a[0],
    y = a[1];
  return x*x + y*y;
};

/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to negate
 * @returns {vec2} out
 */
function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  return out;
};

/**
 * Returns the inverse of the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to invert
 * @returns {vec2} out
 */
function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  return out;
};

/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to normalize
 * @returns {vec2} out
 */
function normalize(out, a) {
  var x = a[0],
    y = a[1];
  var len = x*x + y*y;
  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
    out[0] = a[0] * len;
    out[1] = a[1] * len;
  }
  return out;
};

/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
};

/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec3} out
 */
function cross(out, a, b) {
  var z = a[0] * b[1] - a[1] * b[0];
  out[0] = out[1] = 0;
  out[2] = z;
  return out;
};

/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec2} out
 */
function lerp(out, a, b, t) {
  var ax = a[0],
    ay = a[1];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec2} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec2} out
 */
function random(out, scale) {
  scale = scale || 1.0;
  var r = __WEBPACK_IMPORTED_MODULE_0__common__["RANDOM"]() * 2.0 * Math.PI;
  out[0] = Math.cos(r) * scale;
  out[1] = Math.sin(r) * scale;
  return out;
};

/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2} m matrix to transform with
 * @returns {vec2} out
 */
function transformMat2(out, a, m) {
  var x = a[0],
    y = a[1];
  out[0] = m[0] * x + m[2] * y;
  out[1] = m[1] * x + m[3] * y;
  return out;
};

/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2d} m matrix to transform with
 * @returns {vec2} out
 */
function transformMat2d(out, a, m) {
  var x = a[0],
    y = a[1];
  out[0] = m[0] * x + m[2] * y + m[4];
  out[1] = m[1] * x + m[3] * y + m[5];
  return out;
};

/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat3} m matrix to transform with
 * @returns {vec2} out
 */
function transformMat3(out, a, m) {
  var x = a[0],
    y = a[1];
  out[0] = m[0] * x + m[3] * y + m[6];
  out[1] = m[1] * x + m[4] * y + m[7];
  return out;
};

/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec2} out
 */
function transformMat4(out, a, m) {
  let x = a[0];
  let y = a[1];
  out[0] = m[0] * x + m[4] * y + m[12];
  out[1] = m[1] * x + m[5] * y + m[13];
  return out;
}

/**
 * Returns a string representation of a vector
 *
 * @param {vec2} a vector to represent as a string
 * @returns {String} string representation of the vector
 */
function str(a) {
  return 'vec2(' + a[0] + ', ' + a[1] + ')';
}

/**
 * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
 *
 * @param {vec2} a The first vector.
 * @param {vec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec2} a The first vector.
 * @param {vec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function equals(a, b) {
  let a0 = a[0], a1 = a[1];
  let b0 = b[0], b1 = b[1];
  return (Math.abs(a0 - b0) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
          Math.abs(a1 - b1) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a1), Math.abs(b1)));
}

/**
 * Alias for {@link vec2.length}
 * @function
 */
const len = length;
/* harmony export (immutable) */ __webpack_exports__["len"] = len;


/**
 * Alias for {@link vec2.subtract}
 * @function
 */
const sub = subtract;
/* harmony export (immutable) */ __webpack_exports__["sub"] = sub;


/**
 * Alias for {@link vec2.multiply}
 * @function
 */
const mul = multiply;
/* harmony export (immutable) */ __webpack_exports__["mul"] = mul;


/**
 * Alias for {@link vec2.divide}
 * @function
 */
const div = divide;
/* harmony export (immutable) */ __webpack_exports__["div"] = div;


/**
 * Alias for {@link vec2.distance}
 * @function
 */
const dist = distance;
/* harmony export (immutable) */ __webpack_exports__["dist"] = dist;


/**
 * Alias for {@link vec2.squaredDistance}
 * @function
 */
const sqrDist = squaredDistance;
/* harmony export (immutable) */ __webpack_exports__["sqrDist"] = sqrDist;


/**
 * Alias for {@link vec2.squaredLength}
 * @function
 */
const sqrLen = squaredLength;
/* harmony export (immutable) */ __webpack_exports__["sqrLen"] = sqrLen;


/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
const forEach = (function() {
  let vec = create();

  return function(a, stride, offset, count, fn, arg) {
    let i, l;
    if(!stride) {
      stride = 2;
    }

    if(!offset) {
      offset = 0;
    }

    if(count) {
      l = Math.min((count * stride) + offset, a.length);
    } else {
      l = a.length;
    }

    for(i = offset; i < l; i += stride) {
      vec[0] = a[i]; vec[1] = a[i+1];
      fn(vec, vec, arg);
      a[i] = vec[0]; a[i+1] = vec[1];
    }

    return a;
  };
})();
/* harmony export (immutable) */ __webpack_exports__["forEach"] = forEach;



/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = getAndApplyExtension;
// VertexArrayObject.js

function getAndApplyExtension(gl, name) {
	var ext = gl.getExtension(name);
	if (!ext) {
		return false;
	}
	var suffix = name.split('_')[0];
	var suffixRE = new RegExp(suffix + '$');

	for (var key in ext) {
		var val = ext[key];
		if (typeof val === 'function') {
			var unsuffixedKey = key.replace(suffixRE, '');
			if (key.substring) {
				gl[unsuffixedKey] = ext[key].bind(ext);
				// console.log('Replacing :', key, '=>', unsuffixedKey);
			}
		}
	}

	return true;
}

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _WebglConst = __webpack_require__(32);

var _WebglConst2 = _interopRequireDefault(_WebglConst);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// exposeAttributes.js

var exposeAttributes = function exposeAttributes() {
	// GL.VERTEX_SHADER         = GL.gl.VERTEX_SHADER;
	// GL.FRAGMENT_SHADER       = GL.gl.FRAGMENT_SHADER;
	// GL.COMPILE_STATUS        = GL.gl.COMPILE_STATUS;
	// GL.DEPTH_TEST            = GL.gl.DEPTH_TEST;
	// GL.CULL_FACE             = GL.gl.CULL_FACE;
	// GL.BLEND                 = GL.gl.BLEND;
	// GL.POINTS                = GL.gl.POINTS;
	// GL.LINES                 = GL.gl.LINES;
	// GL.TRIANGLES             = GL.gl.TRIANGLES;

	// GL.LINEAR                	= GL.gl.LINEAR;
	// GL.NEAREST               	= GL.gl.NEAREST;
	// GL.LINEAR_MIPMAP_NEAREST 	= GL.gl.LINEAR_MIPMAP_NEAREST;
	// GL.NEAREST_MIPMAP_LINEAR 	= GL.gl.NEAREST_MIPMAP_LINEAR;
	// GL.LINEAR_MIPMAP_LINEAR 	= GL.gl.LINEAR_MIPMAP_LINEAR;
	// GL.NEAREST_MIPMAP_NEAREST 	= GL.gl.NEAREST_MIPMAP_NEAREST;
	// GL.MIRRORED_REPEAT       	= GL.gl.MIRRORED_REPEAT;
	// GL.CLAMP_TO_EDGE         	= GL.gl.CLAMP_TO_EDGE;
	// GL.SCISSOR_TEST		   	 	= GL.gl.SCISSOR_TEST;
	// GL.UNSIGNED_BYTE		 	= GL.gl.UNSIGNED_BYTE;
	for (var s in _WebglConst2.default) {
		if (!_GLTool2.default[s]) {
			_GLTool2.default[s] = _WebglConst2.default[s];
		} else {
			console.log('already exist : ', s);
		}
	}
};

exports.default = exposeAttributes;

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	if (!hasChecked) {
		_float = checkFloat();
	}

	return _float;
};

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hasChecked = false; // getFloat.js

var _float = void 0;

function checkFloat() {
	if (_GLTool2.default.webgl2) {
		return _GLTool2.default.gl.FLOAT;
	} else {
		var extFloat = _GLTool2.default.getExtension('OES_texture_float');
		if (extFloat) {
			return _GLTool2.default.gl.FLOAT;
		} else {
			console.warn('USING FLOAT BUT OES_texture_float NOT SUPPORTED');
			return _GLTool2.default.gl.UNSIGNED_BYTE;
		}
	}

	hasChecked = true;
};

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	if (!hasChecked) {
		halfFloat = checkHalfFloat();
	}

	return halfFloat;
};

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hasChecked = false; // getHalfFloat.js

var halfFloat = void 0;

function checkHalfFloat() {
	if (_GLTool2.default.webgl2) {
		return _GLTool2.default.gl.HALF_FLOAT;
	} else {
		var extHalfFloat = _GLTool2.default.getExtension('OES_texture_half_float');
		if (extHalfFloat) {
			return extHalfFloat.HALF_FLOAT_OES;
		} else {
			console.warn('USING HALF FLOAT BUT OES_texture_half_float NOT SUPPORTED');
			return _GLTool2.default.gl.UNSIGNED_BYTE;
		}
	}

	hasChecked = true;
};

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
// ExtensionsList.js

exports.default = ['EXT_shader_texture_lod', 'EXT_sRGB', 'EXT_frag_depth', 'OES_texture_float', 'OES_texture_half_float', 'OES_texture_float_linear', 'OES_texture_half_float_linear', 'OES_standard_derivatives', 'WEBGL_depth_texture', 'EXT_texture_filter_anisotropic', 'OES_vertex_array_object', 'ANGLE_instanced_arrays', 'WEBGL_draw_buffers'];

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isPowerOfTwo(x) {
	return x !== 0 && !(x & x - 1);
} // getTextureParameters.js

;

var getTextureParameters = function getTextureParameters(mParams, mSource, mWidth, mHeight) {
	if (!mParams.minFilter) {
		var minFilter = _GLTool2.default.LINEAR;
		if (mWidth && mWidth) {
			if (isPowerOfTwo(mWidth) && isPowerOfTwo(mHeight)) {
				minFilter = _GLTool2.default.LINEAR_MIPMAP_NEAREST;
			}
		}

		mParams.minFilter = minFilter;
	}

	mParams.mipmap = mParams.mipmap || true;
	mParams.magFilter = mParams.magFilter || _GLTool2.default.LINEAR;
	mParams.wrapS = mParams.wrapS || _GLTool2.default.CLAMP_TO_EDGE;
	mParams.wrapT = mParams.wrapT || _GLTool2.default.CLAMP_TO_EDGE;
	mParams.internalFormat = mParams.internalFormat || _GLTool2.default.RGBA;
	mParams.format = mParams.format || _GLTool2.default.RGBA;
	mParams.premultiplyAlpha = mParams.premultiplyAlpha || false;
	mParams.level = mParams.level || 0;
	mParams.anisotropy = mParams.anisotropy || 0;

	return mParams;
};

exports.default = getTextureParameters;

/***/ }),
/* 60 */
/***/ (function(module, exports) {

// All values and structures referenced from:
// http://msdn.microsoft.com/en-us/library/bb943991.aspx/
//
// DX10 Cubemap support based on
// https://github.com/dariomanesku/cmft/issues/7#issuecomment-69516844
// https://msdn.microsoft.com/en-us/library/windows/desktop/bb943983(v=vs.85).aspx
// https://github.com/playcanvas/engine/blob/master/src/resources/resources_texture.js

var DDS_MAGIC = 0x20534444
var DDSD_MIPMAPCOUNT = 0x20000
var DDPF_FOURCC = 0x4

var FOURCC_DXT1 = fourCCToInt32('DXT1')
var FOURCC_DXT3 = fourCCToInt32('DXT3')
var FOURCC_DXT5 = fourCCToInt32('DXT5')
var FOURCC_DX10 = fourCCToInt32('DX10')
var FOURCC_FP32F = 116 // DXGI_FORMAT_R32G32B32A32_FLOAT

var DDSCAPS2_CUBEMAP = 0x200
var D3D10_RESOURCE_DIMENSION_TEXTURE2D = 3
var DXGI_FORMAT_R32G32B32A32_FLOAT = 2

// The header length in 32 bit ints
var headerLengthInt = 31

// Offsets into the header array
var off_magic = 0
var off_size = 1
var off_flags = 2
var off_height = 3
var off_width = 4
var off_mipmapCount = 7
var off_pfFlags = 20
var off_pfFourCC = 21
var off_caps2 = 28

module.exports = parseHeaders

function parseHeaders (arrayBuffer) {
  var header = new Int32Array(arrayBuffer, 0, headerLengthInt)

  if (header[off_magic] !== DDS_MAGIC) {
    throw new Error('Invalid magic number in DDS header')
  }

  if (!header[off_pfFlags] & DDPF_FOURCC) {
    throw new Error('Unsupported format, must contain a FourCC code')
  }

  var blockBytes
  var format
  var fourCC = header[off_pfFourCC]
  switch (fourCC) {
    case FOURCC_DXT1:
      blockBytes = 8
      format = 'dxt1'
      break
    case FOURCC_DXT3:
      blockBytes = 16
      format = 'dxt3'
      break
    case FOURCC_DXT5:
      blockBytes = 16
      format = 'dxt5'
      break
    case FOURCC_FP32F:
      format = 'rgba32f'
      break
    case FOURCC_DX10:
      var dx10Header = new Uint32Array(arrayBuffer.slice(128, 128 + 20))
      format = dx10Header[0]
      var resourceDimension = dx10Header[1]
      var miscFlag = dx10Header[2]
      var arraySize = dx10Header[3]
      var miscFlags2 = dx10Header[4]

      if (resourceDimension === D3D10_RESOURCE_DIMENSION_TEXTURE2D && format === DXGI_FORMAT_R32G32B32A32_FLOAT) {
        format = 'rgba32f'
      } else {
        throw new Error('Unsupported DX10 texture format ' + format)
      }
      break
    default:
      throw new Error('Unsupported FourCC code: ' + int32ToFourCC(fourCC))
  }

  var flags = header[off_flags]
  var mipmapCount = 1

  if (flags & DDSD_MIPMAPCOUNT) {
    mipmapCount = Math.max(1, header[off_mipmapCount])
  }

  var cubemap = false
  var caps2 = header[off_caps2]
  if (caps2 & DDSCAPS2_CUBEMAP) {
    cubemap = true
  }

  var width = header[off_width]
  var height = header[off_height]
  var dataOffset = header[off_size] + 4
  var texWidth = width
  var texHeight = height
  var images = []
  var dataLength

  if (fourCC === FOURCC_DX10) {
    dataOffset += 20
  }

  if (cubemap) {
    for (var f = 0; f < 6; f++) {
      if (format !== 'rgba32f') {
        throw new Error('Only RGBA32f cubemaps are supported')
      }
      var bpp = 4 * 32 / 8

      width = texWidth
      height = texHeight

      // cubemap should have all mipmap levels defined
      // Math.log2(width) + 1
      var requiredMipLevels = Math.log(width) / Math.log(2) + 1

      for (var i = 0; i < requiredMipLevels; i++) {
        dataLength = width * height * bpp
        images.push({
          offset: dataOffset,
          length: dataLength,
          shape: [ width, height ]
        })
        // Reuse data from the previous level if we are beyond mipmapCount
        // This is hack for CMFT not publishing full mipmap chain https://github.com/dariomanesku/cmft/issues/10
        if (i < mipmapCount) {
          dataOffset += dataLength
        }
        width = Math.floor(width / 2)
        height = Math.floor(height / 2)
      }
    }
  } else {
    for (var i = 0; i < mipmapCount; i++) {
      dataLength = Math.max(4, width) / 4 * Math.max(4, height) / 4 * blockBytes

      images.push({
        offset: dataOffset,
        length: dataLength,
        shape: [ width, height ]
      })
      dataOffset += dataLength
      width = Math.floor(width / 2)
      height = Math.floor(height / 2)
    }
  }

  return {
    shape: [ texWidth, texHeight ],
    images: images,
    format: format,
    flags: flags,
    cubemap: cubemap
  }
}

function fourCCToInt32 (value) {
  return value.charCodeAt(0) +
    (value.charCodeAt(1) << 8) +
    (value.charCodeAt(2) << 16) +
    (value.charCodeAt(3) << 24)
}

function int32ToFourCC (value) {
  return String.fromCharCode(
    value & 0xff,
    (value >> 8) & 0xff,
    (value >> 16) & 0xff,
    (value >> 24) & 0xff
  )
}


/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports = function(strings) {
  if (typeof strings === 'string') strings = [strings]
  var exprs = [].slice.call(arguments,1)
  var parts = []
  for (var i = 0; i < strings.length-1; i++) {
    parts.push(strings[i], exprs[i] || '')
  }
  parts.push(strings[i])
  return parts.join('')
}


/***/ }),
/* 62 */
/***/ (function(module, exports) {

module.exports = "// basic.frag\n\n#define SHADER_NAME BASIC_FRAGMENT\n\nprecision lowp float;\n#define GLSLIFY 1\nvarying vec2 vTextureCoord;\nuniform float time;\n// uniform sampler2D texture;\n\nvoid main(void) {\n    gl_FragColor = vec4(vTextureCoord, sin(time) * .5 + .5, 1.0);\n}"

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// CubeFrameBuffer.js



Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _GLCubeTexture = __webpack_require__(14);

var _GLCubeTexture2 = _interopRequireDefault(_GLCubeTexture);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gl = void 0;

var CubeFrameBuffer = function () {
	function CubeFrameBuffer(size) {
		var mParameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		_classCallCheck(this, CubeFrameBuffer);

		gl = _GLTool2.default.gl;
		this._size = size;
		this.magFilter = mParameters.magFilter || gl.LINEAR;
		this.minFilter = mParameters.minFilter || gl.LINEAR;
		this.wrapS = mParameters.wrapS || gl.CLAMP_TO_EDGE;
		this.wrapT = mParameters.wrapT || gl.CLAMP_TO_EDGE;

		this._init();
	}

	_createClass(CubeFrameBuffer, [{
		key: '_init',
		value: function _init() {
			this.texture = gl.createTexture();
			this.glTexture = new _GLCubeTexture2.default(this.texture, {}, true);

			gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, this.magFilter);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, this.minFilter);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, this.wrapS);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, this.wrapT);

			var targets = [gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z];

			for (var i = 0; i < targets.length; i++) {
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
				gl.texImage2D(targets[i], 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.FLOAT, null);
			}

			this._frameBuffers = [];
			for (var _i = 0; _i < targets.length; _i++) {
				var frameBuffer = gl.createFramebuffer();
				gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, targets[_i], this.texture, 0);

				var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
				if (status !== gl.FRAMEBUFFER_COMPLETE) {
					console.log('\'gl.checkFramebufferStatus() returned \'' + status);
				}

				this._frameBuffers.push(frameBuffer);
			}

			// gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			gl.bindRenderbuffer(gl.RENDERBUFFER, null);
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
		}
	}, {
		key: 'bind',
		value: function bind(mTargetIndex) {

			// if(Math.random() > .99) console.log('bind :', mTargetIndex, this._frameBuffers[mTargetIndex]);
			_GLTool2.default.viewport(0, 0, this.width, this.height);
			gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffers[mTargetIndex]);
		}
	}, {
		key: 'unbind',
		value: function unbind() {
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			_GLTool2.default.viewport(0, 0, _GLTool2.default.width, _GLTool2.default.height);
		}

		//	TEXTURES

	}, {
		key: 'getTexture',
		value: function getTexture() {
			return this.glTexture;
		}

		//	GETTERS AND SETTERS

	}, {
		key: 'width',
		get: function get() {
			return this._size;
		}
	}, {
		key: 'height',
		get: function get() {
			return this._size;
		}
	}]);

	return CubeFrameBuffer;
}();

exports.default = CubeFrameBuffer;

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // MultisampleFrameBuffer.js

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _GLTexture = __webpack_require__(9);

var _GLTexture2 = _interopRequireDefault(_GLTexture);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gl = void 0;

function isPowerOfTwo(x) {
	return x !== 0 && !(x & x - 1);
};

var MultisampleFrameBuffer = function () {
	function MultisampleFrameBuffer(mWidth, mHeight) {
		var mParameters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

		_classCallCheck(this, MultisampleFrameBuffer);

		gl = _GLTool2.default.gl;

		this.width = mWidth;
		this.height = mHeight;

		this.magFilter = mParameters.magFilter || gl.LINEAR;
		this.minFilter = mParameters.minFilter || gl.LINEAR;
		this.wrapS = mParameters.wrapS || gl.CLAMP_TO_EDGE;
		this.wrapT = mParameters.wrapT || gl.CLAMP_TO_EDGE;
		this.useDepth = mParameters.useDepth || true;
		this.useStencil = mParameters.useStencil || false;
		this.texelType = mParameters.type;
		this._numSample = mParameters.numSample || 8;

		if (!isPowerOfTwo(this.width) || !isPowerOfTwo(this.height)) {
			this.wrapS = this.wrapT = gl.CLAMP_TO_EDGE;

			if (this.minFilter === gl.LINEAR_MIPMAP_NEAREST) {
				this.minFilter = gl.LINEAR;
			}
		}

		this._init();
	}

	_createClass(MultisampleFrameBuffer, [{
		key: '_init',
		value: function _init() {
			var texelType = gl.UNSIGNED_BYTE;
			if (this.texelType) {
				texelType = this.texelType;
			}

			this.texelType = texelType;

			this.frameBuffer = gl.createFramebuffer();
			this.frameBufferColor = gl.createFramebuffer();
			this.renderBufferColor = gl.createRenderbuffer();
			this.renderBufferDepth = gl.createRenderbuffer();
			this.glTexture = this._createTexture();
			this.glDepthTexture = this._createTexture(gl.DEPTH_COMPONENT16, gl.UNSIGNED_SHORT, gl.DEPTH_COMPONENT, true);

			gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBufferColor);
			gl.renderbufferStorageMultisample(gl.RENDERBUFFER, this._numSample, gl.RGBA8, this.width, this.height);

			gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBufferDepth);
			gl.renderbufferStorageMultisample(gl.RENDERBUFFER, this._numSample, gl.DEPTH_COMPONENT16, this.width, this.height);

			gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, this.renderBufferColor);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderBufferDepth);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBufferColor);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.glTexture.texture, 0);
			// gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.glDepthTexture.texture, 0);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			// gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBufferDepth);
			// gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.glDepthTexture.texture, 0);
			// gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}
	}, {
		key: '_createTexture',
		value: function _createTexture(mInternalformat, mTexelType, mFormat) {
			var forceNearest = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

			if (mInternalformat === undefined) {
				mInternalformat = gl.RGBA;
			}
			if (mTexelType === undefined) {
				mTexelType = this.texelType;
			}
			if (!mFormat) {
				mFormat = mInternalformat;
			}

			var t = gl.createTexture();
			var glt = new _GLTexture2.default(t, true);
			var magFilter = forceNearest ? _GLTool2.default.NEAREST : this.magFilter;
			var minFilter = forceNearest ? _GLTool2.default.NEAREST : this.minFilter;

			gl.bindTexture(gl.TEXTURE_2D, t);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT);
			gl.texImage2D(gl.TEXTURE_2D, 0, mInternalformat, this.width, this.height, 0, mFormat, mTexelType, null);
			gl.bindTexture(gl.TEXTURE_2D, null);

			return glt;
		}
	}, {
		key: 'bind',
		value: function bind() {
			var mAutoSetViewport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			if (mAutoSetViewport) {
				_GLTool2.default.viewport(0, 0, this.width, this.height);
			}
			gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
		}
	}, {
		key: 'unbind',
		value: function unbind() {
			var mAutoSetViewport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			if (mAutoSetViewport) {
				_GLTool2.default.viewport(0, 0, _GLTool2.default.width, _GLTool2.default.height);
			}

			var width = this.width,
			    height = this.height;


			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.frameBuffer);
			gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.frameBufferColor);
			gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 0.0, 0.0]);
			gl.blitFramebuffer(0, 0, width, height, 0, 0, width, height, gl.COLOR_BUFFER_BIT, _GLTool2.default.NEAREST);
			// gl.blitFramebuffer(
			// 	0, 0, width, height,
			// 	0, 0, width, height,
			// 	gl.COLOR_BUFFER_BIT|gl.DEPTH_STENCIL, GL.NEAREST
			// );

			// gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.frameBuffer);
			// gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.frameBufferDepth);
			// gl.clearBufferfi(gl.DEPTH_STENCIL, 0, 1.0, 0);
			// gl.blitFramebuffer(
			// 	0, 0, width, height,
			// 	0, 0, width, height,
			// 	gl.DEPTH_BUFFER_BIT, gl.NEAREST
			// );

			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}
	}, {
		key: 'getTexture',
		value: function getTexture() {
			var mIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			return this.glTexture;
		}
	}, {
		key: 'getDepthTexture',
		value: function getDepthTexture() {
			return this.glDepthTexture;
		}
	}]);

	return MultisampleFrameBuffer;
}();

exports.default = MultisampleFrameBuffer;

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // TransformFeedbackObject.js

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _GLShader = __webpack_require__(1);

var _GLShader2 = _interopRequireDefault(_GLShader);

var _Geometry = __webpack_require__(3);

var _Geometry2 = _interopRequireDefault(_Geometry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gl = void 0;

var TransformFeedbackObject = function () {
	function TransformFeedbackObject(strVertexShader, strFragmentShader) {
		_classCallCheck(this, TransformFeedbackObject);

		gl = _GLTool2.default.gl;
		this._vs = strVertexShader;
		this._fs = strFragmentShader;

		this._init();
	}

	_createClass(TransformFeedbackObject, [{
		key: '_init',
		value: function _init() {
			this._geoCurrent = new _Geometry2.default();
			this._geoTarget = new _Geometry2.default();
			this._numPoints = -1;

			this._varyings = [];
			this.transformFeedback = gl.createTransformFeedback();
		}
	}, {
		key: 'bufferData',
		value: function bufferData(mData, mName, mVaryingName) {
			var isTransformFeedback = !!mVaryingName;
			console.log('is Transform feedback ?', mName, isTransformFeedback);
			this._geoCurrent.bufferData(mData, mName, null, gl.STREAM_COPY, false);
			this._geoTarget.bufferData(mData, mName, null, gl.STREAM_COPY, false);

			if (isTransformFeedback) {
				this._varyings.push(mVaryingName);

				if (this._numPoints < 0) {
					this._numPoints = mData.length;
				}
			}
		}
	}, {
		key: 'bufferIndex',
		value: function bufferIndex(mArrayIndices) {
			this._geoCurrent.bufferIndex(mArrayIndices);
			this._geoTarget.bufferIndex(mArrayIndices);
		}
	}, {
		key: 'uniform',
		value: function uniform(mName, mType, mValue) {
			if (this.shader) {
				this.shader.uniform(mName, mType, mValue);
			}
		}
	}, {
		key: 'generate',
		value: function generate() {
			this.shader = new _GLShader2.default(this._vs, this._fs, this._varyings);
		}
	}, {
		key: 'render',
		value: function render() {
			if (!this.shader) {
				this.generate();
			}

			this.shader.bind();
			_GLTool2.default.drawTransformFeedback(this);

			this._swap();
		}
	}, {
		key: '_swap',
		value: function _swap() {
			var tmp = this._geoCurrent;
			this._geoCurrent = this._geoTarget;
			this._geoTarget = tmp;
		}
	}, {
		key: 'numPoints',
		get: function get() {
			return this._numPoints;
		}
	}, {
		key: 'geoCurrent',
		get: function get() {
			return this._geoCurrent;
		}
	}, {
		key: 'geoTarget',
		get: function get() {
			return this._geoTarget;
		}
	}, {
		key: 'geoSource',
		get: function get() {
			return this._geoCurrent;
		}
	}, {
		key: 'geoDestination',
		get: function get() {
			return this._geoTarget;
		}
	}]);

	return TransformFeedbackObject;
}();

exports.default = TransformFeedbackObject;

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// TweenNumber.js



Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _scheduling = __webpack_require__(6);

var _scheduling2 = _interopRequireDefault(_scheduling);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Easing = {
	Linear: {
		None: function None(k) {
			return k;
		}
	},
	Quadratic: {
		In: function In(k) {
			return k * k;
		},
		Out: function Out(k) {
			return k * (2 - k);
		},
		InOut: function InOut(k) {
			if ((k *= 2) < 1) {
				return 0.5 * k * k;
			}
			return -0.5 * (--k * (k - 2) - 1);
		}
	},
	Cubic: {
		In: function In(k) {
			return k * k * k;
		},
		Out: function Out(k) {
			return --k * k * k + 1;
		},
		InOut: function InOut(k) {
			if ((k *= 2) < 1) {
				return 0.5 * k * k * k;
			}
			return 0.5 * ((k -= 2) * k * k + 2);
		}
	},
	Quartic: {
		In: function In(k) {
			return k * k * k * k;
		},
		Out: function Out(k) {
			return 1 - --k * k * k * k;
		},
		InOut: function InOut(k) {
			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k;
			}
			return -0.5 * ((k -= 2) * k * k * k - 2);
		}
	},
	Quintic: {
		In: function In(k) {
			return k * k * k * k * k;
		},
		Out: function Out(k) {
			return --k * k * k * k * k + 1;
		},
		InOut: function InOut(k) {
			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k * k;
			}
			return 0.5 * ((k -= 2) * k * k * k * k + 2);
		}
	},
	Sinusoidal: {
		In: function In(k) {
			return 1 - Math.cos(k * Math.PI / 2);
		},
		Out: function Out(k) {
			return Math.sin(k * Math.PI / 2);
		},
		InOut: function InOut(k) {
			return 0.5 * (1 - Math.cos(Math.PI * k));
		}
	},
	Exponential: {
		In: function In(k) {
			return k === 0 ? 0 : Math.pow(1024, k - 1);
		},
		Out: function Out(k) {
			return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
		},
		InOut: function InOut(k) {
			if (k === 0) {
				return 0;
			}
			if (k === 1) {
				return 1;
			}
			if ((k *= 2) < 1) {
				return 0.5 * Math.pow(1024, k - 1);
			}
			return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
		}
	},
	Circular: {
		In: function In(k) {
			return 1 - Math.sqrt(1 - k * k);
		},
		Out: function Out(k) {
			return Math.sqrt(1 - --k * k);
		},
		InOut: function InOut(k) {
			if ((k *= 2) < 1) {
				return -0.5 * (Math.sqrt(1 - k * k) - 1);
			}
			return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
		}
	},
	Elastic: {
		In: function In(k) {
			var s = void 0;
			var a = 0.1;
			var p = 0.4;
			if (k === 0) {
				return 0;
			}
			if (k === 1) {
				return 1;
			}
			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else {
				s = p * Math.asin(1 / a) / (2 * Math.PI);
			}
			return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
		},
		Out: function Out(k) {
			var s = void 0;
			var a = 0.1;
			var p = 0.4;
			if (k === 0) {
				return 0;
			}
			if (k === 1) {
				return 1;
			}
			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else {
				s = p * Math.asin(1 / a) / (2 * Math.PI);
			}
			return a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1;
		},
		InOut: function InOut(k) {
			var s = void 0;
			var a = 0.1;
			var p = 0.4;
			if (k === 0) {
				return 0;
			}
			if (k === 1) {
				return 1;
			}
			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else {
				s = p * Math.asin(1 / a) / (2 * Math.PI);
			}
			if ((k *= 2) < 1) {
				return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
			}
			return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
		}
	},
	Back: {
		In: function In(k) {
			var s = 1.70158;
			return k * k * ((s + 1) * k - s);
		},
		Out: function Out(k) {
			var s = 1.70158;
			return --k * k * ((s + 1) * k + s) + 1;
		},
		InOut: function InOut(k) {
			var s = 1.70158 * 1.525;
			if ((k *= 2) < 1) {
				return 0.5 * (k * k * ((s + 1) * k - s));
			}
			return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
		}
	},
	Bounce: {
		in: function _in(k) {
			return 1 - Easing.Bounce.out(1 - k);
		},
		out: function out(k) {
			if (k < 1 / 2.75) {
				return 7.5625 * k * k;
			} else if (k < 2 / 2.75) {
				return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
			} else if (k < 2.5 / 2.75) {
				return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
			} else {
				return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
			}
		},
		inOut: function inOut(k) {
			if (k < 0.5) {
				return Easing.Bounce.in(k * 2) * 0.5;
			}
			return Easing.Bounce.out(k * 2 - 1) * 0.5 + 0.5;
		}
	}
};

function getFunc(mEasing) {
	switch (mEasing) {
		default:
		case 'linear':
			return Easing.Linear.None;
		case 'expIn':
			return Easing.Exponential.In;
		case 'expOut':
			return Easing.Exponential.Out;
		case 'expInOut':
			return Easing.Exponential.InOut;

		case 'cubicIn':
			return Easing.Cubic.In;
		case 'cubicOut':
			return Easing.Cubic.Out;
		case 'cubicInOut':
			return Easing.Cubic.InOut;

		case 'quarticIn':
			return Easing.Quartic.In;
		case 'quarticOut':
			return Easing.Quartic.Out;
		case 'quarticInOut':
			return Easing.Quartic.InOut;

		case 'quinticIn':
			return Easing.Quintic.In;
		case 'quinticOut':
			return Easing.Quintic.Out;
		case 'quinticInOut':
			return Easing.Quintic.InOut;

		case 'sinusoidalIn':
			return Easing.Sinusoidal.In;
		case 'sinusoidalOut':
			return Easing.Sinusoidal.Out;
		case 'sinusoidalInOut':
			return Easing.Sinusoidal.InOut;

		case 'circularIn':
			return Easing.Circular.In;
		case 'circularOut':
			return Easing.Circular.Out;
		case 'circularInOut':
			return Easing.Circular.InOut;

		case 'elasticIn':
			return Easing.Elastic.In;
		case 'elasticOut':
			return Easing.Elastic.Out;
		case 'elasticInOut':
			return Easing.Elastic.InOut;

		case 'backIn':
			return Easing.Back.In;
		case 'backOut':
			return Easing.Back.Out;
		case 'backInOut':
			return Easing.Back.InOut;

		case 'bounceIn':
			return Easing.Bounce.in;
		case 'bounceOut':
			return Easing.Bounce.out;
		case 'bounceInOut':
			return Easing.Bounce.inOut;
	}
}

var TweenNumber = function () {
	function TweenNumber(mValue) {
		var _this = this;

		var mEasing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'expOut';
		var mSpeed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.01;

		_classCallCheck(this, TweenNumber);

		this._value = mValue;
		this._startValue = mValue;
		this._targetValue = mValue;
		this._counter = 1;
		this.speed = mSpeed;
		this.easing = mEasing;
		this._needUpdate = true;

		this._efIndex = _scheduling2.default.addEF(function () {
			return _this._update();
		});
	}

	_createClass(TweenNumber, [{
		key: '_update',
		value: function _update() {
			var newCounter = this._counter + this.speed;
			if (newCounter > 1) {
				newCounter = 1;
			}
			if (this._counter === newCounter) {
				this._needUpdate = false;
				return;
			}

			this._counter = newCounter;
			this._needUpdate = true;
		}
	}, {
		key: 'limit',
		value: function limit(mMin, mMax) {
			if (mMin > mMax) {
				this.limit(mMax, mMin);
				return;
			}

			this._min = mMin;
			this._max = mMax;

			this._checkLimit();
		}
	}, {
		key: 'setTo',
		value: function setTo(mValue) {
			this._value = mValue;
			this._targetValue = mValue;
			this._counter = 1;
		}
	}, {
		key: '_checkLimit',
		value: function _checkLimit() {
			if (this._min !== undefined && this._targetValue < this._min) {
				this._targetValue = this._min;
			}

			if (this._max !== undefined && this._targetValue > this._max) {
				this._targetValue = this._max;
			}
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			_scheduling2.default.removeEF(this._efIndex);
		}

		//	GETTERS / SETTERS

	}, {
		key: 'value',
		set: function set(mValue) {
			this._startValue = this._value;
			this._targetValue = mValue;
			this._checkLimit();
			this._counter = 0;
		},
		get: function get() {
			if (this._needUpdate) {
				var f = getFunc(this.easing);
				var p = f(this._counter);
				this._value = this._startValue + p * (this._targetValue - this._startValue);
				this._needUpdate = false;
			}
			return this._value;
		}
	}, {
		key: 'targetValue',
		get: function get() {
			return this._targetValue;
		}
	}]);

	return TweenNumber;
}();

exports.default = TweenNumber;

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// QuatRotation.js



Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _glMatrix = __webpack_require__(2);

var _glMatrix2 = _interopRequireDefault(_glMatrix);

var _EaseNumber = __webpack_require__(19);

var _EaseNumber2 = _interopRequireDefault(_EaseNumber);

var _scheduling = __webpack_require__(6);

var _scheduling2 = _interopRequireDefault(_scheduling);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getMouse = function getMouse(mEvent, mTarget) {

	var o = mTarget || {};
	if (mEvent.touches) {
		o.x = mEvent.touches[0].pageX;
		o.y = mEvent.touches[0].pageY;
	} else {
		o.x = mEvent.clientX;
		o.y = mEvent.clientY;
	}

	return o;
};

var QuatRotation = function () {
	function QuatRotation(mTarget) {
		var _this = this;

		var mListenerTarget = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
		var mEasing = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.1;

		_classCallCheck(this, QuatRotation);

		this._target = mTarget;
		this._listenerTarget = mListenerTarget;

		this.matrix = _glMatrix2.default.mat4.create();
		this.m = _glMatrix2.default.mat4.create();
		this._vZaxis = _glMatrix2.default.vec3.clone([0, 0, 0]);
		this._zAxis = _glMatrix2.default.vec3.clone([0, 0, 1]);
		this.preMouse = { x: 0, y: 0 };
		this.mouse = { x: 0, y: 0 };
		this._isMouseDown = false;
		this._rotation = _glMatrix2.default.quat.create();
		this.tempRotation = _glMatrix2.default.quat.create();
		this._rotateZMargin = 0;
		this._offset = 0.004;
		this._slerp = -1;
		this._isLocked = false;

		this._diffX = new _EaseNumber2.default(0, mEasing);
		this._diffY = new _EaseNumber2.default(0, mEasing);

		this._listenerTarget.addEventListener('mousedown', function (e) {
			return _this._onDown(e);
		});
		this._listenerTarget.addEventListener('touchstart', function (e) {
			return _this._onDown(e);
		});
		this._listenerTarget.addEventListener('mousemove', function (e) {
			return _this._onMove(e);
		});
		this._listenerTarget.addEventListener('touchmove', function (e) {
			return _this._onMove(e);
		});
		window.addEventListener('touchend', function () {
			return _this._onUp();
		});
		window.addEventListener('mouseup', function () {
			return _this._onUp();
		});

		_scheduling2.default.addEF(function () {
			return _this._loop();
		});
	}

	// 	PUBLIC METHODS

	_createClass(QuatRotation, [{
		key: 'inverseControl',
		value: function inverseControl() {
			var isInvert = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			this._isInvert = isInvert;
		}
	}, {
		key: 'lock',
		value: function lock() {
			var mValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			this._isLocked = mValue;
		}
	}, {
		key: 'setCameraPos',
		value: function setCameraPos(mQuat) {
			var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.1;

			this.easing = speed;
			if (this._slerp > 0) {
				return;
			}

			var tempRotation = _glMatrix2.default.quat.clone(this._rotation);
			this._updateRotation(tempRotation);
			this._rotation = _glMatrix2.default.quat.clone(tempRotation);
			this._currDiffX = this.diffX = 0;
			this._currDiffY = this.diffY = 0;

			this._isMouseDown = false;
			this._isRotateZ = 0;

			this._targetQuat = _glMatrix2.default.quat.clone(mQuat);
			this._slerp = 1;
		}
	}, {
		key: 'resetQuat',
		value: function resetQuat() {
			this._rotation = _glMatrix2.default.quat.clone([0, 0, 1, 0]);
			this.tempRotation = _glMatrix2.default.quat.clone([0, 0, 0, 0]);
			this._targetQuat = undefined;
			this._slerp = -1;
		}

		//	EVENT HANDLER

	}, {
		key: '_onDown',
		value: function _onDown(mEvent) {
			if (this._isLocked) {
				return;
			}

			var mouse = getMouse(mEvent);
			var tempRotation = _glMatrix2.default.quat.clone(this._rotation);
			this._updateRotation(tempRotation);
			this._rotation = tempRotation;

			this._isMouseDown = true;
			this._isRotateZ = 0;
			this.preMouse = { x: mouse.x, y: mouse.y };

			if (mouse.y < this._rotateZMargin || mouse.y > window.innerHeight - this._rotateZMargin) {
				this._isRotateZ = 1;
			} else if (mouse.x < this._rotateZMargin || mouse.x > window.innerWidth - this._rotateZMargin) {
				this._isRotateZ = 2;
			}

			this._diffX.setTo(0);
			this._diffY.setTo(0);
		}
	}, {
		key: '_onMove',
		value: function _onMove(mEvent) {
			if (this._isLocked) {
				return;
			}
			getMouse(mEvent, this.mouse);
		}
	}, {
		key: '_onUp',
		value: function _onUp() {
			if (this._isLocked) {
				return;
			}
			this._isMouseDown = false;
		}

		//	PRIVATE METHODS

	}, {
		key: '_updateRotation',
		value: function _updateRotation(mTempRotation) {
			if (this._isMouseDown && !this._isLocked) {
				this._diffX.value = -(this.mouse.x - this.preMouse.x);
				this._diffY.value = this.mouse.y - this.preMouse.y;

				if (this._isInvert) {
					this._diffX.value = -this._diffX.targetValue;
					this._diffY.value = -this._diffY.targetValue;
				}
			}

			var angle = void 0,
			    _quat = void 0;

			if (this._isRotateZ > 0) {
				if (this._isRotateZ === 1) {
					angle = -this._diffX.value * this._offset;
					angle *= this.preMouse.y < this._rotateZMargin ? -1 : 1;
					_quat = _glMatrix2.default.quat.clone([0, 0, Math.sin(angle), Math.cos(angle)]);
					_glMatrix2.default.quat.multiply(_quat, mTempRotation, _quat);
				} else {
					angle = -this._diffY.value * this._offset;
					angle *= this.preMouse.x < this._rotateZMargin ? 1 : -1;
					_quat = _glMatrix2.default.quat.clone([0, 0, Math.sin(angle), Math.cos(angle)]);
					_glMatrix2.default.quat.multiply(_quat, mTempRotation, _quat);
				}
			} else {
				var v = _glMatrix2.default.vec3.clone([this._diffX.value, this._diffY.value, 0]);
				var axis = _glMatrix2.default.vec3.create();
				_glMatrix2.default.vec3.cross(axis, v, this._zAxis);
				_glMatrix2.default.vec3.normalize(axis, axis);
				angle = _glMatrix2.default.vec3.length(v) * this._offset;
				_quat = _glMatrix2.default.quat.clone([Math.sin(angle) * axis[0], Math.sin(angle) * axis[1], Math.sin(angle) * axis[2], Math.cos(angle)]);
				_glMatrix2.default.quat.multiply(mTempRotation, _quat, mTempRotation);
			}
		}
	}, {
		key: '_loop',
		value: function _loop() {
			_glMatrix2.default.mat4.identity(this.m);

			if (this._targetQuat === undefined) {
				_glMatrix2.default.quat.set(this.tempRotation, this._rotation[0], this._rotation[1], this._rotation[2], this._rotation[3]);
				this._updateRotation(this.tempRotation);
			} else {
				this._slerp += (0 - this._slerp) * 0.1;

				if (this._slerp < 0.0005) {
					_glMatrix2.default.quat.copy(this._rotation, this._targetQuat);
					_glMatrix2.default.quat.copy(this.tempRotation, this._targetQuat);
					this._targetQuat = undefined;
					this._diffX.setTo(0);
					this._diffY.setTo(0);
					this._slerp = -1;
				} else {
					_glMatrix2.default.quat.set(this.tempRotation, 0, 0, 0, 0);
					_glMatrix2.default.quat.slerp(this.tempRotation, this._targetQuat, this._rotation, this._slerp);
				}
			}

			_glMatrix2.default.vec3.transformQuat(this._vZaxis, this._vZaxis, this.tempRotation);

			_glMatrix2.default.mat4.fromQuat(this.matrix, this.tempRotation);
		}

		//	GETTER AND SETTER

	}, {
		key: 'easing',
		set: function set(mValue) {
			this._diffX.easing = mValue;
			this._diffY.easing = mValue;
		},
		get: function get() {
			return this._diffX.easing;
		}
	}]);

	return QuatRotation;
}();

exports.default = QuatRotation;

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _EventDispatcher2 = __webpack_require__(35);

var _EventDispatcher3 = _interopRequireDefault(_EventDispatcher2);

var _Ray = __webpack_require__(20);

var _Ray2 = _interopRequireDefault(_Ray);

var _getMouse = __webpack_require__(69);

var _getMouse2 = _interopRequireDefault(_getMouse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // TouchDetector.js


function distance(a, b) {
	var dx = a.x - b.x;
	var dy = a.y - b.y;
	return Math.sqrt(dx * dx + dy * dy);
}

var TouchDetector = function (_EventDispatcher) {
	_inherits(TouchDetector, _EventDispatcher);

	function TouchDetector(mGeometry, mCamera) {
		var mSkipMoveCheck = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
		var mListenerTarget = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : window;

		_classCallCheck(this, TouchDetector);

		var _this = _possibleConstructorReturn(this, (TouchDetector.__proto__ || Object.getPrototypeOf(TouchDetector)).call(this));

		_this._geometry = mGeometry;
		_this._geometry.generateFaces();
		_this._camera = mCamera;
		_this.faceVertices = mGeometry.faces.map(function (face) {
			return face.vertices;
		});
		_this.clickTolerance = 8;

		_this._ray = new _Ray2.default([0, 0, 0], [0, 0, -1]);
		_this._hit = vec3.fromValues(-999, -999, -999);
		_this._lastPos;
		_this._firstPos;
		_this.mtxModel = mat4.create();

		_this._listenerTarget = mListenerTarget;
		_this._skippingMove = mSkipMoveCheck;

		_this._onMoveBind = function (e) {
			return _this._onMove(e);
		};
		_this._onDownBind = function (e) {
			return _this._onDown(e);
		};
		_this._onUpBind = function () {
			return _this._onUp();
		};

		_this.connect();
		return _this;
	}

	_createClass(TouchDetector, [{
		key: 'connect',
		value: function connect() {
			this._listenerTarget.addEventListener('mousedown', this._onDownBind);
			this._listenerTarget.addEventListener('mousemove', this._onMoveBind);
			this._listenerTarget.addEventListener('mouseup', this._onUpBind);
		}
	}, {
		key: 'disconnect',
		value: function disconnect() {
			this._listenerTarget.removeEventListener('mousedown', this._onDownBind);
			this._listenerTarget.removeEventListener('mousemove', this._onMoveBind);
			this._listenerTarget.removeEventListener('mouseup', this._onUpBind);
		}
	}, {
		key: '_checkHit',
		value: function _checkHit() {
			var _this2 = this;

			var mType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'onHit';

			var camera = this._camera;
			if (!camera) {
				return;
			}

			var mx = this._lastPos.x / _GLTool2.default.width * 2.0 - 1.0;
			var my = -(this._lastPos.y / _GLTool2.default.height) * 2.0 + 1.0;

			camera.generateRay([mx, my, 0], this._ray);

			var hit = void 0;
			var v0 = vec3.create();
			var v1 = vec3.create();
			var v2 = vec3.create();
			var dist = 0;

			var getVector = function getVector(v, target) {
				vec3.transformMat4(target, v, _this2.mtxModel);
			};

			for (var i = 0; i < this.faceVertices.length; i++) {
				var vertices = this.faceVertices[i];
				getVector(vertices[0], v0);
				getVector(vertices[1], v1);
				getVector(vertices[2], v2);
				var t = this._ray.intersectTriangle(v0, v1, v2);

				if (t) {
					if (hit) {
						var distToCam = vec3.dist(t, camera.position);
						if (distToCam < dist) {
							hit = vec3.clone(t);
							dist = distToCam;
						}
					} else {
						hit = vec3.clone(t);
						dist = vec3.dist(hit, camera.position);
					}
				}
			}

			if (hit) {
				this._hit = vec3.clone(hit);
				this.dispatchCustomEvent(mType, { hit: hit });
			} else {
				this.dispatchCustomEvent('onUp');
			}
		}
	}, {
		key: '_onDown',
		value: function _onDown(e) {
			this._firstPos = (0, _getMouse2.default)(e);
			this._lastPos = (0, _getMouse2.default)(e);
			this._checkHit('onDown');
		}
	}, {
		key: '_onMove',
		value: function _onMove(e) {
			this._lastPos = (0, _getMouse2.default)(e);
			if (!this._skippingMove) {
				this._checkHit();
			}
		}
	}, {
		key: '_onUp',
		value: function _onUp() {
			var dist = distance(this._firstPos, this._lastPos);
			if (dist < this.clickTolerance) {
				this._checkHit();
			}
		}
	}]);

	return TouchDetector;
}(_EventDispatcher3.default);

exports.default = TouchDetector;

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (e) {
	var x = void 0,
	    y = void 0;

	if (e.touches) {
		x = e.touches[0].pageX;
		y = e.touches[0].pageY;
	} else {
		x = e.clientX;
		y = e.clientY;
	}

	return {
		x: x, y: y
	};
};

/***/ }),
/* 70 */
/***/ (function(module, exports) {

module.exports = "#define SHADER_NAME gltf_vert\n\nprecision highp float;\n#define GLSLIFY 1\nattribute vec3 aVertexPosition;\n\n#ifdef HAS_UV\nattribute vec2 aTextureCoord;\n#endif\n\n#ifdef HAS_NORMALS\nattribute vec3 aNormal;\n#endif\n\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjectionMatrix;\nuniform mat3 uNormalMatrix;\nuniform mat3 uModelViewMatrixInverse;\n\n\nvarying vec3 vPosition;\nvarying vec2 vTextureCoord;\n\n#ifdef HAS_NORMALS\nvarying vec3 vNormal;\n#endif\n\n\nvoid main(void) {\n\tvec4 position = uModelMatrix * vec4(aVertexPosition, 1.0);\n\tvPosition     = position.xyz / position.w;\n\t\n\t#ifdef HAS_UV\n\tvTextureCoord = vec2(aTextureCoord.x, 1.0 - aTextureCoord.y);\n\t#else\n\tvTextureCoord = vec2(0.,0.);\n\t#endif\n\n\t#ifdef HAS_NORMALS\n\tvNormal       = normalize(vec3(uModelMatrix * vec4(aNormal, 0.0)));\n\t#endif\n\t\n\tgl_Position   = uProjectionMatrix * uViewMatrix * position;\n}\n"

/***/ }),
/* 71 */
/***/ (function(module, exports) {

module.exports = "#define SHADER_NAME gltf_frag\n\n#extension GL_EXT_shader_texture_lod: enable\n#extension GL_OES_standard_derivatives : enable\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform sampler2D \tuBRDFMap;\nuniform samplerCube uRadianceMap;\nuniform samplerCube uIrradianceMap;\n\n#ifdef HAS_BASECOLORMAP\nuniform sampler2D uColorMap;\n#endif\n\n#ifdef HAS_METALROUGHNESSMAP\nuniform sampler2D uMetallicRoughnessMap;\n#endif\n\n#ifdef HAS_OCCLUSIONMAP\nuniform sampler2D uAoMap;\nuniform float uOcclusionStrength;\n#endif\n\n#ifdef HAS_NORMALMAP\nuniform sampler2D uNormalMap;\nuniform float uNormalScale;\n#endif\n\n#ifdef HAS_EMISSIVEMAP\nuniform sampler2D uEmissiveMap;\nuniform vec3 uEmissiveFactor;\n#endif\n\nuniform vec3 uLightDirection;\nuniform vec3 uLightColor;\nuniform vec3 uCameraPos;\n\nuniform vec4 uScaleDiffBaseMR;\nuniform vec4 uScaleFGDSpec;\nuniform vec4 uScaleIBLAmbient;\n\nuniform vec3 uBaseColor;\nuniform float uRoughness;\nuniform float uMetallic;\nuniform float uGamma;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vPosition;\n\n#ifdef HAS_NORMALS\nvarying vec3 vNormal;\n#endif\n\n\n//\tFrom GLTF WebGL PBR :\n//\thttps://github.com/KhronosGroup/glTF-WebGL-PBR\n\n// Encapsulate the various inputs used by the various functions in the shading equation\n// We store values in this struct to simplify the integration of alternative implementations\n// of the shading terms, outlined in the Readme.MD Appendix.\nstruct PBRInfo\n{\n\tfloat NdotL;                  // cos angle between normal and light direction\n\tfloat NdotV;                  // cos angle between normal and view direction\n\tfloat NdotH;                  // cos angle between normal and half vector\n\tfloat LdotH;                  // cos angle between light direction and half vector\n\tfloat VdotH;                  // cos angle between view direction and half vector\n\tfloat perceptualRoughness;    // roughness value, as authored by the model creator (input to shader)\n\tfloat metalness;              // metallic value at the surface\n\tvec3 reflectance0;            // full reflectance color (normal incidence angle)\n\tvec3 reflectance90;           // reflectance color at grazing angle\n\tfloat alphaRoughness;         // roughness mapped to a more linear change in the roughness (proposed by [2])\n\tvec3 diffuseColor;            // color contribution from diffuse lighting\n\tvec3 specularColor;           // color contribution from specular lighting\n};\n\n\nconst float M_PI = 3.141592653589793;\nconst float c_MinRoughness = 0.04;\n\n\nvec4 SRGBtoLINEAR(vec4 srgbIn)\n{\n\t#ifdef MANUAL_SRGB\n\t#ifdef SRGB_FAST_APPROXIMATION\n\tvec3 linOut = pow(srgbIn.xyz,vec3(2.2));\n\t#else //SRGB_FAST_APPROXIMATION\n\tvec3 bLess = step(vec3(0.04045),srgbIn.xyz);\n\tvec3 linOut = mix( srgbIn.xyz/vec3(12.92), pow((srgbIn.xyz+vec3(0.055))/vec3(1.055),vec3(2.4)), bLess );\n\t#endif //SRGB_FAST_APPROXIMATION\n\treturn vec4(linOut,srgbIn.w);;\n\t#else //MANUAL_SRGB\n\treturn srgbIn;\n\t#endif //MANUAL_SRGB\n}\n\n\nvec3 getNormal() {\n\tvec3 pos_dx = dFdx(vPosition);\n\tvec3 pos_dy = dFdy(vPosition);\n\tvec3 tex_dx = dFdx(vec3(vTextureCoord, 0.0));\n\tvec3 tex_dy = dFdy(vec3(vTextureCoord, 0.0));\n\tvec3 t = (tex_dy.t * pos_dx - tex_dx.t * pos_dy) / (tex_dx.s * tex_dy.t - tex_dy.s * tex_dx.t);\n\n\t\n#ifdef HAS_NORMALS\n\tvec3 ng = normalize(vNormal);\n#else\n\tvec3 ng = cross(pos_dx, pos_dy);\n#endif\n\n\tt = normalize(t - ng * dot(ng, t));\n\tvec3 b = normalize(cross(ng, t));\n\tmat3 tbn = mat3(t, b, ng);\n\n#ifdef HAS_NORMALMAP\n\tvec3 n = texture2D(uNormalMap, vTextureCoord).rgb;\n\tn = normalize(tbn * ((2.0 * n - 1.0) * vec3(uNormalScale, uNormalScale, 1.0)));\n#else\n\t// The tbn matrix is linearly interpolated, so we need to re-normalize\n\tvec3 n = normalize(tbn[2].xyz);\n#endif\n\n\treturn n;\n}\n\n\nvec3 getIBLContribution(PBRInfo pbrInputs, vec3 n, vec3 reflection)\n{\n\tfloat mipCount = 7.0; // resolution of 512x512\n\tfloat lod = (pbrInputs.perceptualRoughness * mipCount);\n\t// retrieve a scale and bias to F0. See [1], Figure 3\n\tvec3 brdf = SRGBtoLINEAR(texture2D(uBRDFMap, vec2(pbrInputs.NdotV, 1.0 - pbrInputs.perceptualRoughness))).rgb;\n\tvec3 diffuseLight = SRGBtoLINEAR(textureCube(uIrradianceMap, n)).rgb;\n\n\tvec3 specularLight = SRGBtoLINEAR(textureCubeLodEXT(uRadianceMap, reflection, lod)).rgb;\n\n\tvec3 diffuse = diffuseLight * pbrInputs.diffuseColor;\n\tvec3 specular = specularLight * (pbrInputs.specularColor * brdf.x + brdf.y);\n\n\t// For presentation, this allows us to disable IBL terms\n\tdiffuse *= uScaleIBLAmbient.x;\n\tspecular *= uScaleIBLAmbient.y;\n\n\treturn diffuse + specular;\n}\n\n\nvec3 diffuse(PBRInfo pbrInputs)\n{\n\treturn pbrInputs.diffuseColor / M_PI;\n}\n\n\nvec3 specularReflection(PBRInfo pbrInputs)\n{\n\treturn pbrInputs.reflectance0 + (pbrInputs.reflectance90 - pbrInputs.reflectance0) * pow(clamp(1.0 - pbrInputs.VdotH, 0.0, 1.0), 5.0);\n}\n\nfloat geometricOcclusion(PBRInfo pbrInputs)\n{\n\tfloat NdotL = pbrInputs.NdotL;\n\tfloat NdotV = pbrInputs.NdotV;\n\tfloat r = pbrInputs.alphaRoughness;\n\n\tfloat attenuationL = 2.0 * NdotL / (NdotL + sqrt(r * r + (1.0 - r * r) * (NdotL * NdotL)));\n\tfloat attenuationV = 2.0 * NdotV / (NdotV + sqrt(r * r + (1.0 - r * r) * (NdotV * NdotV)));\n\treturn attenuationL * attenuationV;\n}\n\n\nfloat microfacetDistribution(PBRInfo pbrInputs)\n{\n\tfloat roughnessSq = pbrInputs.alphaRoughness * pbrInputs.alphaRoughness;\n\tfloat f = (pbrInputs.NdotH * roughnessSq - pbrInputs.NdotH) * pbrInputs.NdotH + 1.0;\n\treturn roughnessSq / (M_PI * f * f);\n}\n\nvoid main() {\n\n\tfloat perceptualRoughness   = uRoughness;\n\tfloat metallic              = uMetallic;\n#ifdef HAS_METALROUGHNESSMAP\n\t// Roughness is stored in the 'g' channel, metallic is stored in the 'b' channel.\n\t// This layout intentionally reserves the 'r' channel for (optional) occlusion map data\n\tvec4 mrSample = texture2D(uMetallicRoughnessMap, vTextureCoord);\n\tperceptualRoughness = mrSample.g * perceptualRoughness;\n\tmetallic = mrSample.b * metallic;\n#endif\t\n\tperceptualRoughness         = clamp(perceptualRoughness, c_MinRoughness, 1.0);\n\tmetallic                    = clamp(metallic, 0.0, 1.0);\n\tfloat alphaRoughness        = perceptualRoughness * perceptualRoughness;\n\n#ifdef HAS_BASECOLORMAP\t\n\tvec4 baseColor = SRGBtoLINEAR(texture2D(uColorMap, vTextureCoord));\n#else\n\tvec4 baseColor              = vec4(uBaseColor, 1.0);\n#endif\t\n\t\n\tvec3 f0                     = vec3(0.04);\n\tvec3 diffuseColor           = baseColor.rgb * (vec3(1.0) - f0);\n\tdiffuseColor                *= 1.0 - metallic;\n\tvec3 specularColor          = mix(f0, baseColor.rgb, metallic);\n\t\n\t// Compute reflectance.\n\tfloat reflectance           = max(max(specularColor.r, specularColor.g), specularColor.b);\n\t\n\t// For typical incident reflectance range (between 4% to 100%) set the grazing reflectance to 100% for typical fresnel effect.\n\t// For very low reflectance range on highly diffuse objects (below 4%), incrementally reduce grazing reflecance to 0%.\n\tfloat reflectance90         = clamp(reflectance * 25.0, 0.0, 1.0);\n\tvec3 specularEnvironmentR0  = specularColor.rgb;\n\tvec3 specularEnvironmentR90 = vec3(1.0, 1.0, 1.0) * reflectance90;\n\t\n\tvec3 n                      = getNormal();                             // normal at surface point\n\tvec3 v                      = normalize(uCameraPos - vPosition);        // Vector from surface point to camera\n\tvec3 l                      = normalize(uLightDirection);             // Vector from surface point to light\n\tvec3 h                      = normalize(l+v);                          // Half vector between both l and v\n\tvec3 reflection             = -normalize(reflect(v, n));\n\t\n\tfloat NdotL                 = clamp(dot(n, l), 0.001, 1.0);\n\tfloat NdotV                 = abs(dot(n, v)) + 0.001;\n\tfloat NdotH                 = clamp(dot(n, h), 0.0, 1.0);\n\tfloat LdotH                 = clamp(dot(l, h), 0.0, 1.0);\n\tfloat VdotH                 = clamp(dot(v, h), 0.0, 1.0);\n\n\tPBRInfo pbrInputs = PBRInfo(\n\t\tNdotL,\n\t\tNdotV,\n\t\tNdotH,\n\t\tLdotH,\n\t\tVdotH,\n\t\tperceptualRoughness,\n\t\tmetallic,\n\t\tspecularEnvironmentR0,\n\t\tspecularEnvironmentR90,\n\t\talphaRoughness,\n\t\tdiffuseColor,\n\t\tspecularColor\n\t);\n\n\t// Calculate the shading terms for the microfacet specular shading model\n\tvec3 F              = specularReflection(pbrInputs);\n\tfloat G             = geometricOcclusion(pbrInputs);\n\tfloat D             = microfacetDistribution(pbrInputs);\n\t\n\t// Calculation of analytical lighting contribution\n\tvec3 diffuseContrib = (1.0 - F) * diffuse(pbrInputs);\n\tvec3 specContrib    = F * G * D / (4.0 * NdotL * NdotV);\n\t// Obtain final intensity as reflectance (BRDF) scaled by the energy of the light (cosine law)\n\tvec3 color          = NdotL * uLightColor * (diffuseContrib + specContrib);\n\t\n#ifdef USE_IBL\n\tcolor += getIBLContribution(pbrInputs, n, reflection);\n#endif\n\n#ifdef HAS_OCCLUSIONMAP\t\n\tfloat ao            = texture2D(uAoMap, vTextureCoord).r;\n\tcolor               = mix(color, color * ao, uOcclusionStrength);\n#endif\t\n\n#ifdef HAS_EMISSIVEMAP\n\tvec3 emissive = SRGBtoLINEAR(texture2D(uEmissiveMap, vTextureCoord)).rgb * uEmissiveFactor;\n\tcolor += emissive;\n#endif\n\t\n\t// This section uses mix to override final color for reference app visualization\n\t// of various parameters in the lighting equation.\n\tcolor               = mix(color, F, uScaleFGDSpec.x);\n\tcolor               = mix(color, vec3(G), uScaleFGDSpec.y);\n\tcolor               = mix(color, vec3(D), uScaleFGDSpec.z);\n\tcolor               = mix(color, specContrib, uScaleFGDSpec.w);\n\t\n\tcolor               = mix(color, diffuseContrib, uScaleDiffBaseMR.x);\n\tcolor               = mix(color, baseColor.rgb, uScaleDiffBaseMR.y);\n\tcolor               = mix(color, vec3(metallic), uScaleDiffBaseMR.z);\n\tcolor               = mix(color, vec3(perceptualRoughness), uScaleDiffBaseMR.w);\n\t\n\t// output the fragment color\n\tgl_FragColor        = vec4(pow(color,vec3(1.0/uGamma)), baseColor.a);\n\t// gl_FragColor        = vec4(vec3(metallic), 1.0);\n\n}"

/***/ }),
/* 72 */
/***/ (function(module, exports) {

module.exports = "// debug.frag\n\n#define SHADER_NAME debug_frag\n#extension GL_EXT_shader_texture_lod: enable\n#extension GL_OES_standard_derivatives : enable\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform vec3 uEmissiveFactor;\n\n#ifdef HAS_BASECOLORMAP\nuniform sampler2D uColorMap;\n#endif\n\n#ifdef HAS_NORMALMAP\nuniform sampler2D uNormalMap;\nuniform float uNormalScale;\n#endif\n\n#ifdef HAS_OCCLUSIONMAP\nuniform sampler2D uAoMap;\nuniform float uOcclusionStrength;\n#endif\n\nvarying vec2 vTextureCoord;\nvarying vec3 vNormal;\nvarying vec3 vPosition;\n\nvec3 getNormal() {\n\tvec3 pos_dx = dFdx(vPosition);\n\tvec3 pos_dy = dFdy(vPosition);\n\tvec3 tex_dx = dFdx(vec3(vTextureCoord, 0.0));\n\tvec3 tex_dy = dFdy(vec3(vTextureCoord, 0.0));\n\tvec3 t = (tex_dy.t * pos_dx - tex_dx.t * pos_dy) / (tex_dx.s * tex_dy.t - tex_dy.s * tex_dx.t);\n\n\tvec3 ng = normalize(vNormal);\n\n\tt = normalize(t - ng * dot(ng, t));\n\tvec3 b = normalize(cross(ng, t));\n\tmat3 tbn = mat3(t, b, ng);\n\n#ifdef HAS_NORMALMAP\n\tvec3 n = texture2D(uNormalMap, vTextureCoord).rgb;\n\tn = normalize(tbn * ((2.0 * n - 1.0) * vec3(uNormalScale, uNormalScale, 1.0)));\n#else\n\t// The tbn matrix is linearly interpolated, so we need to re-normalize\n\tvec3 n = normalize(tbn[2].xyz);\n#endif\n\n\treturn n;\n}\n\n\nvoid main(void) {\n    // gl_FragColor = vec4(vNormal * .5 + .5, 1.0);\n\n    vec3 color = getNormal() * .5 + .5;\n\n#ifdef HAS_BASECOLORMAP\n\tcolor = texture2D(uColorMap, vTextureCoord).rgb;\n#endif\n\n#ifdef HAS_OCCLUSIONMAP\t\n\tfloat ao            = texture2D(uAoMap, vTextureCoord).r;\n\tcolor               = mix(color, color * ao, uOcclusionStrength);\n#endif\t\n\n    gl_FragColor = vec4(color, 1.0);\n}"

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// CameraCube.js



Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CameraPerspective2 = __webpack_require__(25);

var _CameraPerspective3 = _interopRequireDefault(_CameraPerspective2);

var _glMatrix = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CAMERA_SETTINGS = [[_glMatrix.vec3.fromValues(0, 0, 0), _glMatrix.vec3.fromValues(1, 0, 0), _glMatrix.vec3.fromValues(0, -1, 0)], [_glMatrix.vec3.fromValues(0, 0, 0), _glMatrix.vec3.fromValues(-1, 0, 0), _glMatrix.vec3.fromValues(0, -1, 0)], [_glMatrix.vec3.fromValues(0, 0, 0), _glMatrix.vec3.fromValues(0, 1, 0), _glMatrix.vec3.fromValues(0, 0, 1)], [_glMatrix.vec3.fromValues(0, 0, 0), _glMatrix.vec3.fromValues(0, -1, 0), _glMatrix.vec3.fromValues(0, 0, -1)], [_glMatrix.vec3.fromValues(0, 0, 0), _glMatrix.vec3.fromValues(0, 0, 1), _glMatrix.vec3.fromValues(0, -1, 0)], [_glMatrix.vec3.fromValues(0, 0, 0), _glMatrix.vec3.fromValues(0, 0, -1), _glMatrix.vec3.fromValues(0, -1, 0)]];

var CameraCube = function (_CameraPerspective) {
	_inherits(CameraCube, _CameraPerspective);

	function CameraCube() {
		_classCallCheck(this, CameraCube);

		var _this = _possibleConstructorReturn(this, (CameraCube.__proto__ || Object.getPrototypeOf(CameraCube)).call(this));

		_this.setPerspective(Math.PI / 2, 1, 0.1, 1000);
		return _this;
	}

	_createClass(CameraCube, [{
		key: 'face',
		value: function face(mIndex) {
			var o = CAMERA_SETTINGS[mIndex];
			this.lookAt(o[0], o[1], o[2]);
		}
	}]);

	return CameraCube;
}(_CameraPerspective3.default);

exports.default = CameraCube;

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// ObjLoader.js



Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _BinaryLoader2 = __webpack_require__(26);

var _BinaryLoader3 = _interopRequireDefault(_BinaryLoader2);

var _Geometry = __webpack_require__(3);

var _Geometry2 = _interopRequireDefault(_Geometry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ObjLoader = function (_BinaryLoader) {
	_inherits(ObjLoader, _BinaryLoader);

	function ObjLoader() {
		_classCallCheck(this, ObjLoader);

		return _possibleConstructorReturn(this, (ObjLoader.__proto__ || Object.getPrototypeOf(ObjLoader)).apply(this, arguments));
	}

	_createClass(ObjLoader, [{
		key: 'load',
		value: function load(url, callback) {
			var drawType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;

			this._drawType = drawType;
			_get(ObjLoader.prototype.__proto__ || Object.getPrototypeOf(ObjLoader.prototype), 'load', this).call(this, url, callback);
		}
	}, {
		key: '_onLoaded',
		value: function _onLoaded() {
			this.parseObj(this._req.response);
		}
	}, {
		key: 'parseObj',
		value: function parseObj(objStr) {
			var lines = objStr.split('\n');

			var positions = [];
			var coords = [];
			var finalNormals = [];
			var vertices = [];
			var normals = [];
			var uvs = [];
			var indices = [];
			var count = 0;
			var result = void 0;

			// v float float float
			var vertexPattern = /v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

			// vn float float float
			var normalPattern = /vn( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

			// vt float float
			var uvPattern = /vt( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

			// f vertex vertex vertex ...
			var facePattern1 = /f( +-?\d+)( +-?\d+)( +-?\d+)( +-?\d+)?/;

			// f vertex/uv vertex/uv vertex/uv ...
			var facePattern2 = /f( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))?/;

			// f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...
			var facePattern3 = /f( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))?/;

			// f vertex//normal vertex//normal vertex//normal ... 
			var facePattern4 = /f( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))?/;

			function parseVertexIndex(value) {
				var index = parseInt(value);
				return (index >= 0 ? index - 1 : index + vertices.length / 3) * 3;
			}

			function parseNormalIndex(value) {
				var index = parseInt(value);
				return (index >= 0 ? index - 1 : index + normals.length / 3) * 3;
			}

			function parseUVIndex(value) {
				var index = parseInt(value);
				return (index >= 0 ? index - 1 : index + uvs.length / 2) * 2;
			}

			function addVertex(a, b, c) {
				positions.push([vertices[a], vertices[a + 1], vertices[a + 2]]);
				positions.push([vertices[b], vertices[b + 1], vertices[b + 2]]);
				positions.push([vertices[c], vertices[c + 1], vertices[c + 2]]);

				indices.push(count * 3 + 0);
				indices.push(count * 3 + 1);
				indices.push(count * 3 + 2);

				count++;
			}

			function addUV(a, b, c) {
				coords.push([uvs[a], uvs[a + 1]]);
				coords.push([uvs[b], uvs[b + 1]]);
				coords.push([uvs[c], uvs[c + 1]]);
			}

			function addNormal(a, b, c) {
				finalNormals.push([normals[a], normals[a + 1], normals[a + 2]]);
				finalNormals.push([normals[b], normals[b + 1], normals[b + 2]]);
				finalNormals.push([normals[c], normals[c + 1], normals[c + 2]]);
			}

			function addFace(a, b, c, d, ua, ub, uc, ud, na, nb, nc, nd) {
				var ia = parseVertexIndex(a);
				var ib = parseVertexIndex(b);
				var ic = parseVertexIndex(c);
				var id = void 0;

				if (d === undefined) {

					addVertex(ia, ib, ic);
				} else {

					id = parseVertexIndex(d);

					addVertex(ia, ib, id);
					addVertex(ib, ic, id);
				}

				if (ua !== undefined) {

					ia = parseUVIndex(ua);
					ib = parseUVIndex(ub);
					ic = parseUVIndex(uc);

					if (d === undefined) {

						addUV(ia, ib, ic);
					} else {

						id = parseUVIndex(ud);

						addUV(ia, ib, id);
						addUV(ib, ic, id);
					}
				}

				if (na !== undefined) {

					ia = parseNormalIndex(na);
					ib = parseNormalIndex(nb);
					ic = parseNormalIndex(nc);

					if (d === undefined) {

						addNormal(ia, ib, ic);
					} else {

						id = parseNormalIndex(nd);

						addNormal(ia, ib, id);
						addNormal(ib, ic, id);
					}
				}
			}

			for (var i = 0; i < lines.length; i++) {
				var line = lines[i];
				line = line.trim();

				if (line.length === 0 || line.charAt(0) === '#') {

					continue;
				} else if ((result = vertexPattern.exec(line)) !== null) {

					vertices.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
				} else if ((result = normalPattern.exec(line)) !== null) {

					normals.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
				} else if ((result = uvPattern.exec(line)) !== null) {

					uvs.push(parseFloat(result[1]), parseFloat(result[2]));
				} else if ((result = facePattern1.exec(line)) !== null) {

					addFace(result[1], result[2], result[3], result[4]);
				} else if ((result = facePattern2.exec(line)) !== null) {

					addFace(result[2], result[5], result[8], result[11], result[3], result[6], result[9], result[12]);
				} else if ((result = facePattern3.exec(line)) !== null) {
					addFace(result[2], result[6], result[10], result[14], result[3], result[7], result[11], result[15], result[4], result[8], result[12], result[16]);
				} else if ((result = facePattern4.exec(line)) !== null) {
					addFace(result[2], result[5], result[8], result[11], undefined, undefined, undefined, undefined, result[3], result[6], result[9], result[12]);
				}
			}

			return this._generateGeometry({
				positions: positions,
				coords: coords,
				normals: finalNormals,
				indices: indices
			});
		}
	}, {
		key: '_generateGeometry',
		value: function _generateGeometry(o) {
			var maxNumVertices = 65535;
			var hasNormals = o.normals.length > 0;
			var hasUVs = o.coords.length > 0;
			var geometry = void 0;

			if (o.positions.length > maxNumVertices) {
				var geometries = [];
				var lastIndex = 0;

				var oCopy = {};
				oCopy.positions = o.positions.concat();
				oCopy.coords = o.coords.concat();
				oCopy.indices = o.indices.concat();
				oCopy.normals = o.normals.concat();

				while (o.indices.length > 0) {

					var sliceNum = Math.min(maxNumVertices, o.positions.length);
					var indices = o.indices.splice(0, sliceNum);
					var positions = [];
					var coords = [];
					var normals = [];
					var index = void 0,
					    tmpIndex = 0;

					for (var i = 0; i < indices.length; i++) {
						if (indices[i] > tmpIndex) {
							tmpIndex = indices[i];
						}

						index = indices[i];

						positions.push(oCopy.positions[index]);
						if (hasUVs) {
							coords.push(oCopy.coords[index]);
						}
						if (hasNormals) {
							normals.push(oCopy.normals[index]);
						}

						indices[i] -= lastIndex;
					}

					lastIndex = tmpIndex + 1;

					geometry = new _Geometry2.default(this._drawType);
					geometry.bufferVertex(positions);
					if (hasUVs) {
						geometry.bufferTexCoord(coords);
					}

					geometry.bufferIndex(indices);
					if (hasNormals) {
						geometry.bufferNormal(normals);
					}

					geometries.push(geometry);
				}

				if (this._callback) {
					this._callback(geometries, oCopy);
				}

				return geometries;
			} else {
				geometry = new _Geometry2.default(this._drawType);
				geometry.bufferVertex(o.positions);
				if (hasUVs) {
					geometry.bufferTexCoord(o.coords);
				}
				geometry.bufferIndex(o.indices);
				if (hasNormals) {
					geometry.bufferNormal(o.normals);
				}

				if (this._callback) {
					this._callback(geometry, o);
				}

				return geometry;
			}

			return null;
		}
	}]);

	return ObjLoader;
}(_BinaryLoader3.default);

ObjLoader.parse = function (objStr) {
	var loader = new ObjLoader();
	return loader.parseObj(objStr);
};

exports.default = ObjLoader;

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// HDRLoader.js



Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BinaryLoader2 = __webpack_require__(26);

var _BinaryLoader3 = _interopRequireDefault(_BinaryLoader2);

var _HDRParser = __webpack_require__(76);

var _HDRParser2 = _interopRequireDefault(_HDRParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HDRLoader = function (_BinaryLoader) {
	_inherits(HDRLoader, _BinaryLoader);

	function HDRLoader() {
		_classCallCheck(this, HDRLoader);

		return _possibleConstructorReturn(this, (HDRLoader.__proto__ || Object.getPrototypeOf(HDRLoader)).call(this, true));
	}

	_createClass(HDRLoader, [{
		key: 'parse',
		value: function parse(mArrayBuffer) {
			return (0, _HDRParser2.default)(mArrayBuffer);
		}
	}, {
		key: '_onLoaded',
		value: function _onLoaded() {
			var o = this.parse(this._req.response);
			if (this._callback) {
				this._callback(o);
			}
		}
	}]);

	return HDRLoader;
}(_BinaryLoader3.default);

HDRLoader.parse = function (mArrayBuffer) {
	return (0, _HDRParser2.default)(mArrayBuffer);
};

exports.default = HDRLoader;

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// HDRParser.js



// Code ported by Marcin Ignac (2014)
// Based on Java implementation from
// https://code.google.com/r/cys12345-research/source/browse/hdr/image_processor/RGBE.java?r=7d84e9fd866b24079dbe61fa0a966ce8365f5726

Object.defineProperty(exports, "__esModule", {
	value: true
});
var radiancePattern = '#\\?RADIANCE';
var commentPattern = '#.*';
// let gammaPattern = 'GAMMA=';
var exposurePattern = 'EXPOSURE=\\s*([0-9]*[.][0-9]*)';
var formatPattern = 'FORMAT=32-bit_rle_rgbe';
var widthHeightPattern = '-Y ([0-9]+) \\+X ([0-9]+)';

// http://croquetweak.blogspot.co.uk/2014/08/deconstructing-floats-frexp-and-ldexp.html
// function ldexp(mantissa, exponent) {
//     return exponent > 1023 ? mantissa * Math.pow(2, 1023) * Math.pow(2, exponent - 1023) : exponent < -1074 ? mantissa * Math.pow(2, -1074) * Math.pow(2, exponent + 1074) : mantissa * Math.pow(2, exponent);
// }

function readPixelsRawRLE(buffer, data, offset, fileOffset, scanlineWidth, numScanlines) {
	var rgbe = new Array(4);
	var scanlineBuffer = null;
	var ptr = void 0;
	var ptrEnd = void 0;
	var count = void 0;
	var buf = new Array(2);
	var bufferLength = buffer.length;

	function readBuf(buf) {
		var bytesRead = 0;
		do {
			buf[bytesRead++] = buffer[fileOffset];
		} while (++fileOffset < bufferLength && bytesRead < buf.length);
		return bytesRead;
	}

	function readBufOffset(buf, offset, length) {
		var bytesRead = 0;
		do {
			buf[offset + bytesRead++] = buffer[fileOffset];
		} while (++fileOffset < bufferLength && bytesRead < length);
		return bytesRead;
	}

	function readPixelsRaw(buffer, data, offset, numpixels) {
		var numExpected = 4 * numpixels;
		var numRead = readBufOffset(data, offset, numExpected);
		if (numRead < numExpected) {
			throw new Error('Error reading raw pixels: got ' + numRead + ' bytes, expected ' + numExpected);
		}
	}

	while (numScanlines > 0) {
		if (readBuf(rgbe) < rgbe.length) {
			throw new Error('Error reading bytes: expected ' + rgbe.length);
		}

		if (rgbe[0] !== 2 || rgbe[1] !== 2 || (rgbe[2] & 0x80) !== 0) {
			// this file is not run length encoded
			data[offset++] = rgbe[0];
			data[offset++] = rgbe[1];
			data[offset++] = rgbe[2];
			data[offset++] = rgbe[3];
			readPixelsRaw(buffer, data, offset, scanlineWidth * numScanlines - 1);
			return;
		}

		if (((rgbe[2] & 0xFF) << 8 | rgbe[3] & 0xFF) !== scanlineWidth) {
			throw new Error('Wrong scanline width ' + ((rgbe[2] & 0xFF) << 8 | rgbe[3] & 0xFF) + ', expected ' + scanlineWidth);
		}

		if (scanlineBuffer === null) {
			scanlineBuffer = new Array(4 * scanlineWidth);
		}

		ptr = 0;
		/* read each of the four channels for the scanline into the buffer */
		for (var i = 0; i < 4; i++) {
			ptrEnd = (i + 1) * scanlineWidth;
			while (ptr < ptrEnd) {
				if (readBuf(buf) < buf.length) {
					throw new Error('Error reading 2-byte buffer');
				}
				if ((buf[0] & 0xFF) > 128) {
					/* a run of the same value */
					count = (buf[0] & 0xFF) - 128;
					if (count === 0 || count > ptrEnd - ptr) {
						throw new Error('Bad scanline data');
					}
					while (count-- > 0) {
						scanlineBuffer[ptr++] = buf[1];
					}
				} else {
					/* a non-run */
					count = buf[0] & 0xFF;
					if (count === 0 || count > ptrEnd - ptr) {
						throw new Error('Bad scanline data');
					}
					scanlineBuffer[ptr++] = buf[1];
					if (--count > 0) {
						if (readBufOffset(scanlineBuffer, ptr, count) < count) {
							throw new Error('Error reading non-run data');
						}
						ptr += count;
					}
				}
			}
		}

		/* copy byte data to output */
		for (var _i = 0; _i < scanlineWidth; _i++) {
			data[offset + 0] = scanlineBuffer[_i];
			data[offset + 1] = scanlineBuffer[_i + scanlineWidth];
			data[offset + 2] = scanlineBuffer[_i + 2 * scanlineWidth];
			data[offset + 3] = scanlineBuffer[_i + 3 * scanlineWidth];
			offset += 4;
		}

		numScanlines--;
	}
}

// Returns data as floats and flipped along Y by default
function parseHdr(buffer) {
	if (buffer instanceof ArrayBuffer) {
		buffer = new Uint8Array(buffer);
	}

	var fileOffset = 0;
	var bufferLength = buffer.length;

	var NEW_LINE = 10;

	function readLine() {
		var buf = '';
		do {
			var b = buffer[fileOffset];
			if (b === NEW_LINE) {
				++fileOffset;
				break;
			}
			buf += String.fromCharCode(b);
		} while (++fileOffset < bufferLength);
		return buf;
	}

	var width = 0;
	var height = 0;
	var exposure = 1;
	var gamma = 1;
	var rle = false;

	for (var i = 0; i < 20; i++) {
		var line = readLine();
		var match = void 0;
		if (match = line.match(radiancePattern)) {} else if (match = line.match(formatPattern)) {
			rle = true;
		} else if (match = line.match(exposurePattern)) {
			exposure = Number(match[1]);
		} else if (match = line.match(commentPattern)) {} else if (match = line.match(widthHeightPattern)) {
			height = Number(match[1]);
			width = Number(match[2]);
			break;
		}
	}

	if (!rle) {
		throw new Error('File is not run length encoded!');
	}

	var data = new Uint8Array(width * height * 4);
	var scanlineWidth = width;
	var numScanlines = height;

	readPixelsRawRLE(buffer, data, 0, fileOffset, scanlineWidth, numScanlines);

	// TODO: Should be Float16
	var floatData = new Float32Array(width * height * 4);
	for (var offset = 0; offset < data.length; offset += 4) {
		var r = data[offset + 0] / 255;
		var g = data[offset + 1] / 255;
		var b = data[offset + 2] / 255;
		var e = data[offset + 3];
		var f = Math.pow(2.0, e - 128.0);

		r *= f;
		g *= f;
		b *= f;

		var floatOffset = offset;

		floatData[floatOffset + 0] = r;
		floatData[floatOffset + 1] = g;
		floatData[floatOffset + 2] = b;
		floatData[floatOffset + 3] = 1.0;
	}

	return {
		shape: [width, height],
		exposure: exposure,
		gamma: gamma,
		data: floatData
	};
}

exports.default = parseHdr;

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _colladaParser = __webpack_require__(78);

var _colladaParser2 = _interopRequireDefault(_colladaParser);

var _Geometry = __webpack_require__(3);

var _Geometry2 = _interopRequireDefault(_Geometry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ColladaParser.js

var generateGeometry = function generateGeometry(meshes) {
	var caches = {};

	meshes.forEach(function (mesh) {
		var _mesh$mesh = mesh.mesh,
		    vertices = _mesh$mesh.vertices,
		    normals = _mesh$mesh.normals,
		    coords = _mesh$mesh.coords,
		    triangles = _mesh$mesh.triangles,
		    name = _mesh$mesh.name;

		if (!caches[name]) {
			var glGeometry = new _Geometry2.default().bufferFlattenData(vertices, 'aVertexPosition', 3).bufferFlattenData(coords, 'aTextureCoord', 2).bufferFlattenData(normals, 'aNormal', 3).bufferIndex(triangles);

			caches[name] = glGeometry;
		}

		mesh.glGeometry = caches[name];
	});
};

var parse = function parse(mData) {
	var meshes = _colladaParser2.default.parse(mData);
	generateGeometry(meshes);

	return meshes;
};

var load = function load(mPath, mCallback) {
	_colladaParser2.default.load(mPath, function (meshes) {
		generateGeometry(meshes);
		mCallback(meshes);
	});
};

var ColladaParser = {
	parse: parse,
	load: load
};

exports.default = ColladaParser;

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Collada = __webpack_require__(79);

var _Collada2 = _interopRequireDefault(_Collada);

var _glMatrix = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ColladaParser.js

var parseData = function parseData(mData) {
	var materials = mData.materials,
	    meshes = mData.meshes;


	var finalMeshes = [];
	var meshObjs = [];
	var allMeshes = [];

	//	getting all meshes' buffers
	for (var s in meshes) {
		var oMesh = meshes[s];
		var vertices = oMesh.vertices,
		    normals = oMesh.normals,
		    coords = oMesh.coords,
		    triangles = oMesh.triangles;

		var buffers = {
			vertices: vertices, normals: normals, coords: coords, triangles: triangles
		};
		allMeshes.push({
			id: s,
			buffers: buffers
		});
	}

	function getMaterial(id) {
		var mat = void 0;
		for (var _s in materials) {
			if (_s === id) {
				mat = materials[_s];
			}
		}

		var oMaterial = {};
		if (mat.diffuse) {
			oMaterial.diffuseColor = mat.diffuse;
		}

		oMaterial.diffuseColor = mat.diffuse || [0, 0, 0];
		oMaterial.shininess = mat.shininess || 0;
		if (mat.textures) {
			if (mat.textures.diffuse) {
				oMaterial.diffuseMapID = mat.textures.diffuse.map_id;
			}

			if (mat.textures.normal) {
				oMaterial.normalMapID = mat.textures.normal.map_id;
			}
		}

		return oMaterial;
	}

	function walk(node, mtxParent) {
		var m = _glMatrix.mat4.create();
		if (node.model) {
			_glMatrix.mat4.multiply(m, mtxParent, node.model);
		} else {
			_glMatrix.mat4.copy(m, mtxParent);
		}

		if (node.children.length > 0) {
			node.children.forEach(function (child) {
				walk(child, m);
			});
		}

		if (node.mesh) {
			var _oMesh = {};
			_oMesh.modelMatrix = m;
			_oMesh.mesh = meshes[node.mesh];
			_oMesh.id = node.id;
			_oMesh.name = node.name;
			_oMesh.material = getMaterial(node.material);
			meshObjs.push(_oMesh);
		}
	}

	var mtx = _glMatrix.mat4.create();
	walk(mData.root, mtx);

	return meshObjs;
};

var parse = function parse(mFile) {
	var o = _Collada2.default.parse(mFile);
	return parseData(o);
};

var load = function load(mPath, mCallBack) {
	_Collada2.default.load(mPath, function (mData) {
		mCallBack(parseData(mData));
	});
};

var ColladaParser = {
	load: load,
	parse: parse
};

exports.default = ColladaParser;
module.exports = exports['default'];
//# sourceMappingURL=ColladaParser.js.map

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _glMatrix = __webpack_require__(2);

var isWorker = global.document === undefined; // Collada.js

var DEG2RAD = Math.PI * 2 / 360;

//global temporal variables
var temp_mat4 = null;
var temp_vec2 = null;
var temp_vec3 = null;
var temp_vec4 = null;
var temp_quat = null;

function request(url, callback) {
	var req = new XMLHttpRequest();
	req.onload = function () {
		var response = this.response;
		if (this.status != 200) return;
		if (callback) callback(this.response);
	};
	req.open("get", url, true);
	req.send();
}

var Collada = {

	libsPath: "./",
	workerPath: "./",
	no_flip: true,
	use_transferables: true, //for workers
	onerror: null,
	verbose: false,
	config: { forceParser: false },

	init: function init(config) {
		config = config || {};
		for (var i in config) {
			this[i] = config[i];
		}this.config = config;

		if (isWorker) {
			try {
				importScripts(this.libsPath + "gl-matrix-min.js", this.libsPath + "tinyxml.js");
			} catch (err) {
				Collada.throwException(Collada.LIBMISSING_ERROR);
			}
		}

		//init glMatrix
		temp_mat4 = _glMatrix.mat4.create();
		temp_vec2 = vec3.create();
		temp_vec3 = vec3.create();
		temp_vec4 = vec3.create();
		temp_quat = _glMatrix.quat.create();

		if (isWorker) console.log("Collada worker ready");
	},

	load: function load(url, callback) {
		request(url, function (data) {
			if (!data) callback(null);else callback(Collada.parse(data));
		});
	},

	_xmlroot: null,
	_nodes_by_id: null,
	_transferables: null,
	_controllers_found: null,
	_geometries_found: null,

	safeString: function safeString(str) {
		if (!str) return "";

		if (this.convertID) return this.convertID(str);

		return str.replace(/ /g, "_");
	},

	LIBMISSING_ERROR: "Libraries loading error, when using workers remember to pass the URL to the tinyxml.js in the options.libsPath",
	NOXMLPARSER_ERROR: "TinyXML not found, when using workers remember to pass the URL to the tinyxml.js in the options.libsPath (Workers do not allow to access the native XML DOMParser)",
	throwException: function throwException(msg) {
		if (isWorker) self.postMessage({ action: "exception", msg: msg });else if (Collada.onerror) Collada.onerror(msg);
		throw msg;
	},

	getFilename: function getFilename(filename) {
		var pos = filename.lastIndexOf("\\");
		if (pos != -1) filename = filename.substr(pos + 1);
		//strip unix slashes
		pos = filename.lastIndexOf("/");
		if (pos != -1) filename = filename.substr(pos + 1);
		return filename;
	},

	last_name: 0,

	generateName: function generateName(v) {
		v = v || "name_";
		var name = v + this.last_name;
		this.last_name++;
		return name;
	},

	parse: function parse(data, options, filename) {
		options = options || {};
		filename = filename || "_dae_" + Date.now() + ".dae";

		//console.log("Parsing collada");
		var flip = false;

		var xmlparser = null;
		var root = null;
		this._transferables = [];

		if (this.verbose) console.log(" - XML parsing...");

		if (global["DOMParser"] && !this.config.forceParser) {
			xmlparser = new DOMParser();
			root = xmlparser.parseFromString(data, "text/xml");
			if (this.verbose) console.log(" - XML parsed");
		} else //USING JS XML PARSER IMPLEMENTATION (much slower)
			{
				if (!global["DOMImplementation"]) return Collada.throwException(Collada.NOXMLPARSER_ERROR);
				//use tinyxmlparser
				try {
					xmlparser = new DOMImplementation();
				} catch (err) {
					return Collada.throwException(Collada.NOXMLPARSER_ERROR);
				}

				root = xmlparser.loadXML(data);
				if (this.verbose) console.log(" - XML parsed");

				//for every node...
				var by_ids = root._nodes_by_id = {};
				for (var i = 0, l = root.all.length; i < l; ++i) {
					var node = root.all[i];
					by_ids[node.id] = node;
					if (node.getAttribute("sid")) by_ids[node.getAttribute("sid")] = node;
				}

				if (!this.extra_functions) {
					this.extra_functions = true;
					//these methods are missing so here is a lousy implementation
					DOMDocument.prototype.querySelector = DOMElement.prototype.querySelector = function (selector) {
						var tags = selector.split(" ");
						var current_element = this;

						while (tags.length) {
							var current = tags.shift();
							var tokens = current.split("#");
							var tagname = tokens[0];
							var id = tokens[1];
							var elements = tagname ? current_element.getElementsByTagName(tagname) : current_element.childNodes;
							if (!id) //no id filter
								{
									if (tags.length == 0) return elements.item(0);
									current_element = elements.item(0);
									continue;
								}

							//has id? check for all to see if one matches the id
							for (var i = 0; i < elements.length; i++) {
								if (elements.item(i).getAttribute("id") == id) {
									if (tags.length == 0) return elements.item(i);
									current_element = elements.item(i);
									break;
								}
							}
						}
						return null;
					};

					DOMDocument.prototype.querySelectorAll = DOMElement.prototype.querySelectorAll = function (selector) {
						var tags = selector.split(" ");
						if (tags.length == 1) return this.getElementsByTagName(selector);

						var current_element = this;
						var result = [];

						inner(this, tags);

						function inner(root, tags) {
							if (!tags) return;

							var current = tags.shift();
							var elements = root.getElementsByTagName(current);
							if (tags.length == 0) {
								for (var i = 0; i < elements.length; i++) {
									result.push(elements.item(i));
								}return;
							}

							for (var i = 0; i < elements.length; i++) {
								inner(elements.item(i), tags.concat());
							}
						}

						var list = new DOMNodeList(this.documentElement);
						list._nodes = result;
						list.length = result.length;

						return list;
					};

					Object.defineProperty(DOMElement.prototype, "textContent", {
						get: function get() {
							var nodes = this.getChildNodes();
							return nodes.item(0).toString();
						},
						set: function set() {}
					});
				}
			}
		this._xmlroot = root;
		var xmlcollada = root.querySelector("COLLADA");
		if (xmlcollada) {
			this._current_DAE_version = xmlcollada.getAttribute("version");
			console.log("DAE Version:" + this._current_DAE_version);
		}

		//var xmlvisual_scene = root.querySelector("visual_scene");
		var xmlvisual_scene = root.getElementsByTagName("visual_scene").item(0);
		if (!xmlvisual_scene) throw "visual_scene XML node not found in DAE";

		//hack to avoid problems with bones with spaces in names
		this._nodes_by_id = {}; //clear
		this._controllers_found = {}; //we need to check what controllers had been found, in case we miss one at the end
		this._geometries_found = {};

		//Create a scene tree
		var scene = {
			object_type: "SceneTree",
			light: null,
			materials: {},
			meshes: {},
			resources: {}, //used to store animation tracks
			root: { children: [] },
			external_files: {} //store info about external files mentioned in this 
		};

		//scene metadata (like author, tool, up vector, dates, etc)
		var xmlasset = root.getElementsByTagName("asset")[0];
		if (xmlasset) scene.metadata = this.readAsset(xmlasset);

		//parse nodes tree to extract names and ierarchy only
		var xmlnodes = xmlvisual_scene.childNodes;
		for (var i = 0; i < xmlnodes.length; i++) {
			if (xmlnodes.item(i).localName != "node") continue;

			var node = this.readNodeTree(xmlnodes.item(i), scene, 0, flip);
			if (node) scene.root.children.push(node);
		}

		//parse nodes content (two steps so we have first all the scene tree info)
		for (var i = 0; i < xmlnodes.length; i++) {
			if (xmlnodes.item(i).localName != "node") continue;
			this.readNodeInfo(xmlnodes.item(i), scene, 0, flip);
		}

		//read remaining controllers (in some cases some controllers are not linked from the nodes or the geometries)
		this.readLibraryControllers(scene);

		//read animations
		var animations = this.readAnimations(root, scene);
		if (animations) {
			var animations_name = "#animations_" + filename.substr(0, filename.indexOf("."));
			scene.resources[animations_name] = animations;
			scene.root.animations = animations_name;
		}

		//read external files (images)
		scene.images = this.readImages(root);

		//clear memory
		this._nodes_by_id = {};
		this._controllers_found = {};
		this._geometries_found = {};
		this._xmlroot = null;

		//console.log(scene);
		return scene;
	},

	/* Collect node ids, in case there is bones (with spaces in name) I need to know the nodenames in advance */
	/*
 readAllNodeNames: function(xmlnode)
 {
 	var node_id = this.safeString( xmlnode.getAttribute("id") );
 	if(node_id)
 		this._nodes_by_id[node_id] = true; //node found
 	//nodes seem to have to possible ids, id and sid, I guess one is unique, the other user-defined
 	var node_sid = this.safeString( xmlnode.getAttribute("sid") );
 	if(node_sid)
 		this._nodes_by_id[node_sid] = true; //node found
 
 	for( var i = 0; i < xmlnode.childNodes.length; i++ )
 	{
 		var xmlchild = xmlnode.childNodes.item(i);
 			//children
 		if(xmlchild.localName != "node")
 			continue;
 		this.readAllNodeNames(xmlchild);
 	}
 },
 	*/

	readAsset: function readAsset(xmlasset) {
		var metadata = {};

		for (var i = 0; i < xmlasset.childNodes.length; i++) {
			var xmlchild = xmlasset.childNodes.item(i);
			if (xmlchild.nodeType != 1) //not tag
				continue;
			switch (xmlchild.localName) {
				case "contributor":
					var tool = xmlchild.querySelector("authoring_tool");
					if (tool) metadata["authoring_tool"] = tool.textContext;
					break;
				case "unit":
					metadata["unit"] = xmlchild.getAttribute("name");break;
				default:
					metadata[xmlchild.localName] = xmlchild.textContent;break;
			}
		}

		return metadata;
	},

	readNodeTree: function readNodeTree(xmlnode, scene, level, flip) {
		var node_id = this.safeString(xmlnode.getAttribute("id"));
		var node_sid = this.safeString(xmlnode.getAttribute("sid"));

		if (!node_id && !node_sid) return null;

		//here we create the node
		var node = {
			id: node_sid || node_id,
			children: [],
			_depth: level
		};

		var node_type = xmlnode.getAttribute("type");
		if (node_type) node.type = node_type;

		var node_name = xmlnode.getAttribute("name");
		if (node_name) node.name = node_name;
		this._nodes_by_id[node.id] = node;
		if (node_id) this._nodes_by_id[node_id] = node;
		if (node_sid) this._nodes_by_id[node_sid] = node;

		//transform
		node.model = this.readTransform(xmlnode, level, flip);

		//node elements
		for (var i = 0; i < xmlnode.childNodes.length; i++) {
			var xmlchild = xmlnode.childNodes.item(i);
			if (xmlchild.nodeType != 1) //not tag
				continue;

			//children
			if (xmlchild.localName == "node") {
				var child_node = this.readNodeTree(xmlchild, scene, level + 1, flip);
				if (child_node) node.children.push(child_node);
				continue;
			}
		}

		return node;
	},

	readNodeInfo: function readNodeInfo(xmlnode, scene, level, flip, parent) {
		var node_id = this.safeString(xmlnode.getAttribute("id"));
		var node_sid = this.safeString(xmlnode.getAttribute("sid"));

		/*
  if(!node_id && !node_sid)
  {
  	console.warn("Collada: node without id, creating a random one");
  	node_id = this.generateName("node_");
  	return null;
  }
  */

		var node;
		if (!node_id && !node_sid) {
			//if there is no id, then either all of this node's properties 
			//should be assigned directly to its parent node, or the node doesn't
			//have a parent node, in which case its a light or something. 
			//So we get the parent by its id, and if there is no parent, we return null
			if (parent) node = this._nodes_by_id[parent.id || parent.sid];else return null;
		} else node = this._nodes_by_id[node_id || node_sid];

		if (!node) {
			console.warn("Collada: Node not found by id: " + (node_id || node_sid));
			return null;
		}

		//node elements
		for (var i = 0; i < xmlnode.childNodes.length; i++) {
			var xmlchild = xmlnode.childNodes.item(i);
			if (xmlchild.nodeType != 1) //not tag
				continue;

			//children
			if (xmlchild.localName == "node") {
				//pass parent node in case child node is a 'dead' node (has no id or sid)
				this.readNodeInfo(xmlchild, scene, level + 1, flip, xmlnode);
				continue;
			}

			//geometry
			if (xmlchild.localName == "instance_geometry") {
				var url = xmlchild.getAttribute("url");
				var mesh_id = url.toString().substr(1);
				node.mesh = mesh_id;

				if (!scene.meshes[url]) {
					var mesh_data = this.readGeometry(url, flip);
					if (mesh_data) {
						mesh_data.name = mesh_id;
						scene.meshes[mesh_id] = mesh_data;
					}
				}

				//binded material
				var xmlmaterials = xmlchild.querySelectorAll("instance_material");
				if (xmlmaterials) {
					for (var iMat = 0; iMat < xmlmaterials.length; ++iMat) {
						var xmlmaterial = xmlmaterials.item(iMat);
						if (!xmlmaterial) {
							console.warn("instance_material not found: " + i);
							continue;
						}

						var matname = xmlmaterial.getAttribute("target").toString().substr(1);
						//matname = matname.replace(/ /g,"_"); //names cannot have spaces
						if (!scene.materials[matname]) {

							var material = this.readMaterial(matname);
							if (material) {
								material.id = matname;
								scene.materials[material.id] = material;
							}
						}
						if (iMat == 0) node.material = matname;else {
							if (!node.materials) node.materials = [];
							node.materials.push(matname);
						}
					}
				}
			}

			//this node has a controller: skinning, morph targets or even multimaterial are controllers
			//warning: I detected that some nodes could have a controller but they are not referenced here.  ??
			if (xmlchild.localName == "instance_controller") {
				var url = xmlchild.getAttribute("url");
				var xmlcontroller = this._xmlroot.querySelector("controller" + url);

				if (xmlcontroller) {

					var mesh_data = this.readController(xmlcontroller, flip, scene);

					//binded materials
					var xmlbind_material = xmlchild.querySelector("bind_material");
					if (xmlbind_material) {
						//removed readBindMaterials up here for consistency
						var xmltechniques = xmlbind_material.querySelectorAll("technique_common");
						for (var iTec = 0; iTec < xmltechniques.length; iTec++) {
							var xmltechnique = xmltechniques.item(iTec);
							var xmlinstance_materials = xmltechnique.querySelectorAll("instance_material");
							for (var iMat = 0; iMat < xmlinstance_materials.length; iMat++) {
								var xmlinstance_material = xmlinstance_materials.item(iMat);
								if (!xmlinstance_material) {
									console.warn("instance_material for controller not found: " + xmlinstance_material);
									continue;
								}
								var matname = xmlinstance_material.getAttribute("target").toString().substr(1);
								if (!scene.materials[matname]) {

									var material = this.readMaterial(matname);
									if (material) {
										material.id = matname;
										scene.materials[material.id] = material;
									}
								}
								if (iMat == 0) node.material = matname;else {
									if (!node.materials) node.materials = [];
									node.materials.push(matname);
								}
							}
						}
					}

					if (mesh_data) {
						var mesh = mesh_data;
						if (mesh_data.type == "morph") {
							mesh = mesh_data.mesh;
							node.morph_targets = mesh_data.morph_targets;
						}

						mesh.name = url.toString();
						node.mesh = url.toString();
						scene.meshes[url] = mesh;
					}
				}
			}

			//light
			if (xmlchild.localName == "instance_light") {
				var url = xmlchild.getAttribute("url");
				this.readLight(node, url);
			}

			//camera
			if (xmlchild.localName == "instance_camera") {
				var url = xmlchild.getAttribute("url");
				this.readCamera(node, url);
			}

			//other possible tags?
		}
	},

	//if you want to rename some material names
	material_translate_table: {
		/*
  transparency: "opacity",
  reflectivity: "reflection_factor",
  specular: "specular_factor",
  shininess: "specular_gloss",
  emission: "emissive",
  diffuse: "color"
  */
	},

	light_translate_table: {

		point: "omni",
		directional: "directional",
		spot: "spot"
	},

	camera_translate_table: {
		xfov: "fov",
		aspect_ratio: "aspect",
		znear: "near",
		zfar: "far"
	},

	//used when id have spaces (regular selector do not support spaces)
	querySelectorAndId: function querySelectorAndId(root, selector, id) {
		var nodes = root.querySelectorAll(selector);
		for (var i = 0; i < nodes.length; i++) {
			var attr_id = nodes.item(i).getAttribute("id");
			if (!attr_id) continue;
			attr_id = attr_id.toString();
			if (attr_id == id) return nodes.item(i);
		}
		return null;
	},

	//returns the first element that matches a tag name, if not tagname is specified then the first tag element
	getFirstChildElement: function getFirstChildElement(root, localName) {
		var c = root.childNodes;
		for (var i = 0; i < c.length; ++i) {
			var item = c.item(i);
			if (item.localName && !localName || localName && localName == item.localName) return item;
		}
		return null;
	},

	readMaterial: function readMaterial(url) {
		var xmlmaterial = this.querySelectorAndId(this._xmlroot, "library_materials material", url);

		if (!xmlmaterial) return null;

		//get effect name
		var xmleffect = xmlmaterial.querySelector("instance_effect");
		if (!xmleffect) return null;

		var effect_url = xmleffect.getAttribute("url").substr(1);

		//get effect
		var xmleffects = this.querySelectorAndId(this._xmlroot, "library_effects effect", effect_url);

		if (!xmleffects) return null;

		//get common
		var xmltechnique = xmleffects.querySelector("technique");
		if (!xmltechnique) return null;

		//get newparams and convert to js object
		var xmlnewparams = xmleffects.querySelectorAll("newparam");
		var newparams = {};
		for (var i = 0; i < xmlnewparams.length; i++) {

			var init_from = xmlnewparams[i].querySelector("init_from");
			var parent;
			if (init_from) parent = init_from.innerHTML;else {
				var source = xmlnewparams[i].querySelector("source");
				parent = source.innerHTML;
			}

			newparams[xmlnewparams[i].getAttribute("sid")] = {
				parent: parent
			};
		}

		var material = {};

		//read the images here because we need to access them to assign texture names
		var images = this.readImages(this._xmlroot);

		var xmlphong = xmltechnique.querySelector("phong");
		if (!xmlphong) xmlphong = xmltechnique.querySelector("blinn");
		if (!xmlphong) xmlphong = xmltechnique.querySelector("lambert");
		if (!xmlphong) return null;

		//for every tag of properties
		for (var i = 0; i < xmlphong.childNodes.length; ++i) {
			var xmlparam = xmlphong.childNodes.item(i);

			if (!xmlparam.localName) //text tag
				continue;

			//translate name
			var param_name = xmlparam.localName.toString();
			if (this.material_translate_table[param_name]) param_name = this.material_translate_table[param_name];

			//value
			var xmlparam_value = this.getFirstChildElement(xmlparam);
			if (!xmlparam_value) continue;

			if (xmlparam_value.localName.toString() == "color") {
				var value = this.readContentAsFloats(xmlparam_value);
				if (xmlparam.getAttribute("opaque") == "RGB_ZERO") material[param_name] = value.subarray(0, 4);else material[param_name] = value.subarray(0, 3);
				continue;
			} else if (xmlparam_value.localName.toString() == "float") {
				material[param_name] = this.readContentAsFloats(xmlparam_value)[0];
				continue;
			} else if (xmlparam_value.localName.toString() == "texture") {
				if (!material.textures) material.textures = {};
				var map_id = xmlparam_value.getAttribute("texture");
				if (!map_id) continue;

				// if map_id is not a filename, lets go and look for it.
				if (map_id.indexOf('.') === -1) {
					//check effect parents
					map_id = this.getParentParam(newparams, map_id);

					if (images[map_id]) map_id = images[map_id].path;
				}

				//now get the texture filename from images

				var map_info = { map_id: map_id };
				var uvs = xmlparam_value.getAttribute("texcoord");
				map_info.uvs = uvs;
				material.textures[param_name] = map_info;
			}
		}

		material.object_type = "Material";
		return material;
	},

	getParentParam: function getParentParam(newparams, param) {
		if (!newparams[param]) return param;

		if (newparams[param].parent) return this.getParentParam(newparams, newparams[param].parent);else return param;
	},

	readLight: function readLight(node, url) {
		var light = {};

		var xmlnode = null;

		if (url.length > 1) //weird cases with id == #
			xmlnode = this._xmlroot.querySelector("library_lights " + url);else {
			var xmlliblights = this._xmlroot.querySelector("library_lights");
			xmlnode = this.getFirstChildElement(xmlliblights, "light");
		}

		if (!xmlnode) return null;

		//pack
		var children = [];
		var xml = xmlnode.querySelector("technique_common");
		if (xml) for (var i = 0; i < xml.childNodes.length; i++) {
			if (xml.childNodes.item(i).nodeType == 1) //tag
				children.push(xml.childNodes.item(i));
		}var xmls = xmlnode.querySelectorAll("technique");
		for (var i = 0; i < xmls.length; i++) {
			var xml2 = xmls.item(i);
			for (var j = 0; j < xml2.childNodes.length; j++) {
				if (xml2.childNodes.item(j).nodeType == 1) //tag
					children.push(xml2.childNodes.item(j));
			}
		}

		//get
		for (var i = 0; i < children.length; i++) {
			var xml = children[i];
			switch (xml.localName) {
				case "point":
					light.type = this.light_translate_table[xml.localName];
					parse_params(light, xml);
					break;
				case "directional":
					light.type = this.light_translate_table[xml.localName];
					parse_params(light, xml);
					break;
				case "spot":
					light.type = this.light_translate_table[xml.localName];
					parse_params(light, xml);
					break;

				case "intensity":
					light.intensity = this.readContentAsFloats(xml)[0];
					break;
			}
		}

		function parse_params(light, xml) {
			for (var i = 0; i < xml.childNodes.length; i++) {
				var child = xml.childNodes.item(i);
				if (!child || child.nodeType != 1) //tag
					continue;

				switch (child.localName) {
					case "color":
						light.color = Collada.readContentAsFloats(child);break;
					case "falloff_angle":
						light.angle_end = Collada.readContentAsFloats(child)[0];
						light.angle = light.angle_end - 10;
						break;
				}
			}
		}

		if (node.model) {
			//light position is final column of model
			light.position = [node.model[12], node.model[13], node.model[14]];
			//light forward vector is reverse of third column of model
			var forward = [-node.model[8], -node.model[9], -node.model[10]];
			//so light target is position + forward
			light.target = [light.position[0] + forward[0], light.position[1] + forward[1], light.position[2] + forward[2]];
		} else {
			console.warn("Could not read light position for light: " + node.name + ". Setting defaults.");
			light.position = [0, 0, 0];
			light.target = [0, -1, 0];
		}

		node.light = light;
	},

	readCamera: function readCamera(node, url) {
		var camera = {};

		var xmlnode = this._xmlroot.querySelector("library_cameras " + url);
		if (!xmlnode) return null;

		//pack
		var children = [];
		var xml = xmlnode.querySelector("technique_common");
		if (xml) //grab all internal stuff
			for (var i = 0; i < xml.childNodes.length; i++) {
				if (xml.childNodes.item(i).nodeType == 1) //tag
					children.push(xml.childNodes.item(i));
			} //
		for (var i = 0; i < children.length; i++) {
			var tag = children[i];
			parse_params(camera, tag);
		}

		function parse_params(camera, xml) {
			for (var i = 0; i < xml.childNodes.length; i++) {
				var child = xml.childNodes.item(i);
				if (!child || child.nodeType != 1) //tag
					continue;
				var translated = Collada.camera_translate_table[child.localName] || child.localName;
				camera[translated] = parseFloat(child.textContent);
			}
		}

		//parse to convert yfov to standard (x) fov
		if (camera.yfov && !camera.fov) {
			if (camera.aspect) {
				camera.fov = camera.yfov * camera.aspect;
			} else console.warn("Could not convert camera yfov to xfov because aspect ratio not set");
		}

		node.camera = camera;
	},

	readTransform: function readTransform(xmlnode, level, flip) {
		//identity
		var matrix = _glMatrix.mat4.create();
		var temp = _glMatrix.mat4.create();
		var tmpq = _glMatrix.quat.create();

		var flip_fix = false;

		//search for the matrix
		for (var i = 0; i < xmlnode.childNodes.length; i++) {
			var xml = xmlnode.childNodes.item(i);
			if (!xml || xml.nodeType != 1) //tag
				continue;

			if (xml.localName == "matrix") {
				var matrix = this.readContentAsFloats(xml);
				//console.log("Nodename: " + xmlnode.getAttribute("id"));
				//console.log(matrix);
				this.transformMatrix(matrix, level == 0);
				//console.log(matrix);
				return matrix;
			}

			if (xml.localName == "translate") {
				var values = this.readContentAsFloats(xml);
				if (flip && level > 0) {
					var tmp = values[1];
					values[1] = values[2];
					values[2] = -tmp; //swap coords
				}

				_glMatrix.mat4.translate(matrix, matrix, values);
				continue;
			}

			//rotate
			if (xml.localName == "rotate") {
				var values = this.readContentAsFloats(xml);
				if (values.length == 4) //x,y,z, angle
					{
						var id = xml.getAttribute("sid");
						if (id == "jointOrientX") {
							values[3] += 90;
							flip_fix = true;
						}
						//rotateX & rotateY & rotateZ done below

						if (flip) {
							var tmp = values[1];
							values[1] = values[2];
							values[2] = -tmp; //swap coords
						}

						if (values[3] != 0.0) {
							_glMatrix.quat.setAxisAngle(tmpq, values.subarray(0, 3), values[3] * DEG2RAD);
							_glMatrix.mat4.fromQuat(temp, tmpq);
							_glMatrix.mat4.multiply(matrix, matrix, temp);
						}
					}
				continue;
			}

			//scale
			if (xml.localName == "scale") {
				var values = this.readContentAsFloats(xml);
				if (flip) {
					var tmp = values[1];
					values[1] = values[2];
					values[2] = -tmp; //swap coords
				}
				_glMatrix.mat4.scale(matrix, matrix, values);
			}
		}

		return matrix;
	},

	readTransform2: function readTransform2(xmlnode, level, flip) {
		//identity
		var matrix = _glMatrix.mat4.create();
		var rotation = _glMatrix.quat.create();
		var tmpmatrix = _glMatrix.mat4.create();
		var tmpq = _glMatrix.quat.create();
		var translate = vec3.create();
		var scale = vec3.fromValues(1, 1, 1);

		var flip_fix = false;

		//search for the matrix
		for (var i = 0; i < xmlnode.childNodes.length; i++) {
			var xml = xmlnode.childNodes.item(i);

			if (xml.localName == "matrix") {
				var matrix = this.readContentAsFloats(xml);
				//console.log("Nodename: " + xmlnode.getAttribute("id"));
				//console.log(matrix);
				this.transformMatrix(matrix, level == 0);
				//console.log(matrix);
				return matrix;
			}

			if (xml.localName == "translate") {
				var values = this.readContentAsFloats(xml);
				translate.set(values);
				continue;
			}

			//rotate
			if (xml.localName == "rotate") {
				var values = this.readContentAsFloats(xml);
				if (values.length == 4) //x,y,z, angle
					{
						var id = xml.getAttribute("sid");
						if (id == "jointOrientX") {
							values[3] += 90;
							flip_fix = true;
						}
						//rotateX & rotateY & rotateZ done below

						if (flip) {
							var tmp = values[1];
							values[1] = values[2];
							values[2] = -tmp; //swap coords
						}

						if (values[3] != 0.0) {
							_glMatrix.quat.setAxisAngle(tmpq, values.subarray(0, 3), values[3] * DEG2RAD);
							_glMatrix.quat.multiply(rotation, rotation, tmpq);
						}
					}
				continue;
			}

			//scale
			if (xml.localName == "scale") {
				var values = this.readContentAsFloats(xml);
				if (flip) {
					var tmp = values[1];
					values[1] = values[2];
					values[2] = -tmp; //swap coords
				}
				scale.set(values);
			}
		}

		if (flip && level > 0) {
			var tmp = translate[1];
			translate[1] = translate[2];
			translate[2] = -tmp; //swap coords
		}
		_glMatrix.mat4.translate(matrix, matrix, translate);

		_glMatrix.mat4.fromQuat(tmpmatrix, rotation);
		//mat4.rotateX(tmpmatrix, tmpmatrix, Math.PI * 0.5);
		_glMatrix.mat4.multiply(matrix, matrix, tmpmatrix);
		_glMatrix.mat4.scale(matrix, matrix, scale);

		return matrix;
	},

	//for help read this: https://www.khronos.org/collada/wiki/Using_accessors
	readGeometry: function readGeometry(id, flip, scene) {
		//already read, could happend if several controllers point to the same mesh
		if (this._geometries_found[id] !== undefined) return this._geometries_found[id];

		//var xmlgeometry = this._xmlroot.querySelector("geometry" + id);
		var xmlgeometry = this._xmlroot.getElementById(id.substr(1));
		if (!xmlgeometry) {
			console.warn("readGeometry: geometry not found: " + id);
			this._geometries_found[id] = null;
			return null;
		}

		//if the geometry has morph targets then instead of storing it in a geometry, it is in a controller
		if (xmlgeometry.localName == "controller") {
			var geometry = this.readController(xmlgeometry, flip, scene);
			this._geometries_found[id] = geometry;
			return geometry;
		}

		if (xmlgeometry.localName != "geometry") {
			console.warn("readGeometry: tag should be geometry, instead it was found: " + xmlgeometry.localName);
			this._geometries_found[id] = null;
			return null;
		}

		var xmlmesh = xmlgeometry.querySelector("mesh");
		if (!xmlmesh) {
			console.warn("readGeometry: mesh not found in geometry: " + id);
			this._geometries_found[id] = null;
			return null;
		}

		//get data sources
		var sources = {};
		var xmlsources = xmlmesh.querySelectorAll("source");
		for (var i = 0; i < xmlsources.length; i++) {
			var xmlsource = xmlsources.item(i);
			if (!xmlsource.querySelector) continue;
			var float_array = xmlsource.querySelector("float_array");
			if (!float_array) continue;
			var floats = this.readContentAsFloats(float_array);

			var xmlaccessor = xmlsource.querySelector("accessor");
			var stride = parseInt(xmlaccessor.getAttribute("stride"));

			sources[xmlsource.getAttribute("id")] = { stride: stride, data: floats };
		}

		//get streams
		var xmlvertices = xmlmesh.querySelector("vertices input");
		var vertices_source = sources[xmlvertices.getAttribute("source").substr(1)];
		sources[xmlmesh.querySelector("vertices").getAttribute("id")] = vertices_source;

		var mesh = null;
		var xmlpolygons = xmlmesh.querySelector("polygons");
		if (xmlpolygons) mesh = this.readTriangles(xmlpolygons, sources);

		if (!mesh) {
			var xmltriangles = xmlmesh.querySelectorAll("triangles");
			if (xmltriangles && xmltriangles.length) mesh = this.readTriangles(xmltriangles, sources);
		}

		if (!mesh) {
			//polylist = true;
			//var vcount = null;
			//var xmlvcount = xmlpolygons.querySelector("vcount");
			//var vcount = this.readContentAsUInt32( xmlvcount );
			var xmlpolylist = xmlmesh.querySelector("polylist");
			if (xmlpolylist) mesh = this.readPolylist(xmlpolylist, sources);
		}

		if (!mesh) {
			var xmllinestrip = xmlmesh.querySelector("linestrips");
			if (xmllinestrip) mesh = this.readLineStrip(sources, xmllinestrip);
		}

		if (!mesh) {
			console.log("no polygons or triangles in mesh: " + id);
			this._geometries_found[id] = null;
			return null;
		}

		//swap coords (X,Y,Z) -> (X,Z,-Y)
		if (flip && !this.no_flip) {
			var tmp = 0;
			var array = mesh.vertices;
			for (var i = 0, l = array.length; i < l; i += 3) {
				tmp = array[i + 1];
				array[i + 1] = array[i + 2];
				array[i + 2] = -tmp;
			}

			array = mesh.normals;
			for (var i = 0, l = array.length; i < l; i += 3) {
				tmp = array[i + 1];
				array[i + 1] = array[i + 2];
				array[i + 2] = -tmp;
			}
		}

		//transferables for worker
		if (isWorker && this.use_transferables) {
			for (var i in mesh) {
				var data = mesh[i];
				if (data && data.buffer && data.length > 100) {
					this._transferables.push(data.buffer);
				}
			}
		}

		//extra info
		mesh.filename = id;
		mesh.object_type = "Mesh";

		this._geometries_found[id] = mesh;
		return mesh;
	},

	readTriangles: function readTriangles(xmltriangles, sources) {
		var use_indices = false;

		var groups = [];
		var buffers = [];
		var last_index = 0;
		var facemap = {};
		var vertex_remap = []; //maps DAE vertex index to Mesh vertex index (because when meshes are triangulated indices are changed
		var indicesArray = [];
		var last_start = 0;
		var group_name = "";
		var material_name = "";

		//for every triangles set (warning, some times they are repeated...)
		for (var tris = 0; tris < xmltriangles.length; tris++) {
			var xml_shape_root = xmltriangles.item(tris);
			var triangles = xml_shape_root.localName == "triangles";

			material_name = xml_shape_root.getAttribute("material");

			//for each buffer (input) build the structure info
			if (tris == 0) buffers = this.readShapeInputs(xml_shape_root, sources);

			//assuming buffers are ordered by offset

			//iterate data
			var xmlps = xml_shape_root.querySelectorAll("p");
			var num_data_vertex = buffers.length; //one value per input buffer

			//for every polygon (could be one with all the indices, could be several, depends on the program)
			for (var i = 0; i < xmlps.length; i++) {
				var xmlp = xmlps.item(i);
				if (!xmlp || !xmlp.textContent) break;

				var data = xmlp.textContent.trim().split(" ");

				//used for triangulate polys
				var first_index = -1;
				var current_index = -1;
				var prev_index = -1;

				//discomment to force 16bits indices
				//if(use_indices && last_index >= 256*256)
				//	break;

				var num_values_per_vertex = 1;
				for (var b in buffers) {
					num_values_per_vertex = Math.max(num_values_per_vertex, buffers[b][4] + 1);
				} //for every pack of indices in the polygon (vertex, normal, uv, ... )
				var current_data_pos = 0;
				for (var k = 0, l = data.length; k < l; k += num_values_per_vertex) {
					var vertex_id = data.slice(k, k + num_values_per_vertex).join(" "); //generate unique id

					prev_index = current_index;
					if (facemap.hasOwnProperty(vertex_id)) //add to arrays, keep the index
						current_index = facemap[vertex_id];else {
						//for every data buffer associated to this vertex
						for (var j = 0; j < buffers.length; ++j) {
							var buffer = buffers[j];
							var array = buffer[1]; //array where we accumulate the final data as we extract if from sources
							var source = buffer[3]; //where to read the data from

							//compute the index inside the data source array
							//var index = parseInt(data[k + j]);
							var index = parseInt(data[k + buffer[4]]);
							//current_data_pos += buffer[4];

							//remember this index in case we need to remap
							if (j == 0) vertex_remap[array.length / buffer[2]] = index; //not sure if buffer[2], it should be number of floats per vertex (usually 3)
							//vertex_remap[ array.length / num_data_vertex ] = index;

							//compute the position inside the source buffer where the final data is located
							index *= buffer[2]; //this works in most DAEs (not all)
							//index = index * buffer[2] + buffer[4]; //stride(2) offset(4)
							//index += buffer[4]; //stride(2) offset(4)
							//extract every value of this element and store it in its final array (every x,y,z, etc)
							for (var x = 0; x < buffer[2]; ++x) {
								if (source[index + x] === undefined) throw "UNDEFINED!"; //DEBUG
								array.push(source[index + x]);
							}
						}

						current_index = last_index;
						last_index += 1;
						facemap[vertex_id] = current_index;
					}

					if (!triangles) //the xml element is not triangles? then split polygons in triangles
						{
							if (k == 0) first_index = current_index;
							//if(k > 2 * num_data_vertex) //not sure if use this or the next line, the next one works in some DAEs but not sure if it works in all
							if (k > 2) //triangulate polygons: ensure this works
								{
									indicesArray.push(first_index);
									indicesArray.push(prev_index);
								}
						}

					indicesArray.push(current_index);
				} //per vertex
			} //per polygon

			var group = {
				name: group_name || "group" + tris,
				start: last_start,
				length: indicesArray.length - last_start,
				material: material_name || ""
			};
			last_start = indicesArray.length;
			groups.push(group);
		} //per triangles group

		var mesh = {
			vertices: new Float32Array(buffers[0][1]),
			info: { groups: groups },
			_remap: new Uint32Array(vertex_remap)
		};

		this.transformMeshInfo(mesh, buffers, indicesArray);

		return mesh;
	},

	readPolylist: function readPolylist(xml_shape_root, sources) {
		var use_indices = false;

		var groups = [];
		var buffers = [];
		var last_index = 0;
		var facemap = {};
		var vertex_remap = [];
		var indicesArray = [];
		var last_start = 0;
		var group_name = "";
		var material_name = "";

		material_name = xml_shape_root.getAttribute("material");
		buffers = this.readShapeInputs(xml_shape_root, sources);

		var xmlvcount = xml_shape_root.querySelector("vcount");
		var vcount = this.readContentAsUInt32(xmlvcount);

		var xmlp = xml_shape_root.querySelector("p");
		var data = this.readContentAsUInt32(xmlp);

		var num_data_vertex = buffers.length;

		var pos = 0;
		for (var i = 0, l = vcount.length; i < l; ++i) {
			var num_vertices = vcount[i];

			var first_index = -1;
			var current_index = -1;
			var prev_index = -1;

			//iterate vertices of this polygon
			for (var k = 0; k < num_vertices; ++k) {
				var vertex_id = data.subarray(pos, pos + num_data_vertex).join(" ");

				prev_index = current_index;
				if (facemap.hasOwnProperty(vertex_id)) //add to arrays, keep the index
					current_index = facemap[vertex_id];else {
					for (var j = 0; j < buffers.length; ++j) {
						var buffer = buffers[j];
						var index = parseInt(data[pos + j]); //p
						var array = buffer[1]; //array with all the data
						var source = buffer[3]; //where to read the data from
						if (j == 0) vertex_remap[array.length / num_data_vertex] = index;
						index *= buffer[2]; //stride
						for (var x = 0; x < buffer[2]; ++x) {
							array.push(source[index + x]);
						}
					}

					current_index = last_index;
					last_index += 1;
					facemap[vertex_id] = current_index;
				}

				if (num_vertices > 3) //split polygons then
					{
						if (k == 0) first_index = current_index;
						//if(k > 2 * num_data_vertex) //not sure if use this or the next line, the next one works in some DAEs but not sure if it works in all
						if (k > 2) //triangulate polygons: tested, this works
							{
								indicesArray.push(first_index);
								indicesArray.push(prev_index);
							}
					}

				indicesArray.push(current_index);
				pos += num_data_vertex;
			} //per vertex
		} //per polygon

		var mesh = {
			vertices: new Float32Array(buffers[0][1]),
			info: {},
			_remap: new Uint32Array(vertex_remap)
		};

		this.transformMeshInfo(mesh, buffers, indicesArray);

		return mesh;
	},

	readShapeInputs: function readShapeInputs(xml_shape_root, sources) {
		var buffers = [];

		var xmlinputs = xml_shape_root.querySelectorAll("input");
		for (var i = 0; i < xmlinputs.length; i++) {
			var xmlinput = xmlinputs.item(i);
			if (!xmlinput.getAttribute) continue;
			var semantic = xmlinput.getAttribute("semantic").toUpperCase();
			var stream_source = sources[xmlinput.getAttribute("source").substr(1)];
			var offset = parseInt(xmlinput.getAttribute("offset"));
			var data_set = 0;
			if (xmlinput.getAttribute("set")) data_set = parseInt(xmlinput.getAttribute("set"));
			buffers.push([semantic, [], stream_source.stride, stream_source.data, offset, data_set]);
		}

		return buffers;
	},

	transformMeshInfo: function transformMeshInfo(mesh, buffers, indicesArray) {
		//rename buffers (DAE has other names)
		var translator = {
			"normal": "normals",
			"texcoord": "coords"
		};
		for (var i = 1; i < buffers.length; ++i) {
			var name = buffers[i][0].toLowerCase();
			var data = buffers[i][1];
			if (!data.length) continue;

			if (translator[name]) name = translator[name];
			if (mesh[name]) name = name + buffers[i][5];
			mesh[name] = new Float32Array(data); //are they always float32? I think so
		}

		if (indicesArray && indicesArray.length) {
			if (mesh.vertices.length > 256 * 256) mesh.triangles = new Uint32Array(indicesArray);else mesh.triangles = new Uint16Array(indicesArray);
		}

		return mesh;
	},

	readLineStrip: function readLineStrip(sources, xmllinestrip) {
		var use_indices = false;

		var buffers = [];
		var last_index = 0;
		var facemap = {};
		var vertex_remap = [];
		var indicesArray = [];
		var last_start = 0;
		var group_name = "";
		var material_name = "";

		var tris = 0; //used in case there are several strips

		//for each buffer (input) build the structure info
		var xmlinputs = xmllinestrip.querySelectorAll("input");
		if (tris == 0) //first iteration, create buffers
			for (var i = 0; i < xmlinputs.length; i++) {
				var xmlinput = xmlinputs.item(i);
				if (!xmlinput.getAttribute) continue;
				var semantic = xmlinput.getAttribute("semantic").toUpperCase();
				var stream_source = sources[xmlinput.getAttribute("source").substr(1)];
				var offset = parseInt(xmlinput.getAttribute("offset"));
				var data_set = 0;
				if (xmlinput.getAttribute("set")) data_set = parseInt(xmlinput.getAttribute("set"));

				buffers.push([semantic, [], stream_source.stride, stream_source.data, offset, data_set]);
			}
		//assuming buffers are ordered by offset

		//iterate data
		var xmlps = xmllinestrip.querySelectorAll("p");
		var num_data_vertex = buffers.length; //one value per input buffer

		//for every polygon (could be one with all the indices, could be several, depends on the program)
		for (var i = 0; i < xmlps.length; i++) {
			var xmlp = xmlps.item(i);
			if (!xmlp || !xmlp.textContent) break;

			var data = xmlp.textContent.trim().split(" ");

			//used for triangulate polys
			var first_index = -1;
			var current_index = -1;
			var prev_index = -1;

			//if(use_indices && last_index >= 256*256)
			//	break;

			//for every pack of indices in the polygon (vertex, normal, uv, ... )
			for (var k = 0, l = data.length; k < l; k += num_data_vertex) {
				var vertex_id = data.slice(k, k + num_data_vertex).join(" "); //generate unique id

				prev_index = current_index;
				if (facemap.hasOwnProperty(vertex_id)) //add to arrays, keep the index
					current_index = facemap[vertex_id];else {
					for (var j = 0; j < buffers.length; ++j) {
						var buffer = buffers[j];
						var index = parseInt(data[k + j]);
						var array = buffer[1]; //array with all the data
						var source = buffer[3]; //where to read the data from
						if (j == 0) vertex_remap[array.length / num_data_vertex] = index;
						index *= buffer[2]; //stride
						for (var x = 0; x < buffer[2]; ++x) {
							array.push(source[index + x]);
						}
					}

					current_index = last_index;
					last_index += 1;
					facemap[vertex_id] = current_index;
				}

				indicesArray.push(current_index);
			} //per vertex
		} //per polygon

		var mesh = {
			primitive: "line_strip",
			vertices: new Float32Array(buffers[0][1]),
			info: {}
		};

		return this.transformMeshInfo(mesh, buffers, indicesArray);
	},

	//like querySelector but allows spaces in names because COLLADA allows space in names
	findXMLNodeById: function findXMLNodeById(root, nodename, id) {
		//precomputed
		if (this._xmlroot._nodes_by_id) {
			var n = this._xmlroot._nodes_by_id[id];
			if (n && n.localName == nodename) return n;
		} else //for the native parser
			{
				var n = this._xmlroot.getElementById(id);
				if (n) return n;
			}

		//recursive: slow
		var childs = root.childNodes;
		for (var i = 0; i < childs.length; ++i) {
			var xmlnode = childs.item(i);
			if (xmlnode.nodeType != 1) //no tag
				continue;
			if (xmlnode.localName != nodename) continue;
			var node_id = xmlnode.getAttribute("id");
			if (node_id == id) return xmlnode;
		}
		return null;
	},

	readImages: function readImages(root) {
		var xmlimages = root.querySelector("library_images");
		if (!xmlimages) return null;

		var images = {};

		var xmlimages_childs = xmlimages.childNodes;
		for (var i = 0; i < xmlimages_childs.length; ++i) {
			var xmlimage = xmlimages_childs.item(i);
			if (xmlimage.nodeType != 1) //no tag
				continue;

			var xmlinitfrom = xmlimage.querySelector("init_from");
			if (!xmlinitfrom) continue;
			if (xmlinitfrom.textContent) {
				var filename = this.getFilename(xmlinitfrom.textContent);
				var id = xmlimage.getAttribute("id");
				images[id] = { filename: filename, map: id, name: xmlimage.getAttribute("name"), path: xmlinitfrom.textContent };
			}
		}

		return images;
	},

	readAnimations: function readAnimations(root, scene) {
		var xmlanimations = root.querySelector("library_animations");
		if (!xmlanimations) return null;

		var xmlanimation_childs = xmlanimations.childNodes;

		var animations = {
			object_type: "Animation",
			takes: {}
		};

		var default_take = { tracks: [] };
		var tracks = default_take.tracks;

		for (var i = 0; i < xmlanimation_childs.length; ++i) {
			var xmlanimation = xmlanimation_childs.item(i);
			if (xmlanimation.nodeType != 1 || xmlanimation.localName != "animation") //no tag
				continue;

			var anim_id = xmlanimation.getAttribute("id");
			if (!anim_id) //nested animation (DAE 1.5)
				{
					var xmlanimation2_childs = xmlanimation.querySelectorAll("animation");
					if (xmlanimation2_childs.length) {
						for (var j = 0; j < xmlanimation2_childs.length; ++j) {
							var xmlanimation2 = xmlanimation2_childs.item(j);
							this.readAnimation(xmlanimation2, tracks);
						}
					} else //source tracks?
						this.readAnimation(xmlanimation, tracks);
				} else //no nested (DAE 1.4)
				this.readAnimation(xmlanimation, tracks);
		}

		if (!tracks.length) return null; //empty animation

		//compute animation duration
		var max_time = 0;
		for (var i = 0; i < tracks.length; ++i) {
			if (max_time < tracks[i].duration) max_time = tracks[i].duration;
		}default_take.name = "default";
		default_take.duration = max_time;
		animations.takes[default_take.name] = default_take;
		return animations;
	},

	//animation xml
	readAnimation: function readAnimation(xmlanimation, result) {
		if (xmlanimation.localName != "animation") return null;

		//this could be missing when there are lots of anims packed in one <animation>
		var anim_id = xmlanimation.getAttribute("id");

		//channels are like animated properties
		var xmlchannel_list = xmlanimation.querySelectorAll("channel");
		if (!xmlchannel_list.length) return null;

		var tracks = result || [];

		for (var i = 0; i < xmlchannel_list.length; ++i) {
			var anim = this.readChannel(xmlchannel_list.item(i), xmlanimation);
			if (anim) tracks.push(anim);
		}

		return tracks;
	},

	readChannel: function readChannel(xmlchannel, xmlanimation) {
		if (xmlchannel.localName != "channel" || xmlanimation.localName != "animation") return null;

		var source = xmlchannel.getAttribute("source");
		var target = xmlchannel.getAttribute("target");

		//sampler, is in charge of the interpolation
		//var xmlsampler = xmlanimation.querySelector("sampler" + source);
		var xmlsampler = this.findXMLNodeById(xmlanimation, "sampler", source.substr(1));
		if (!xmlsampler) {
			console.error("Error DAE: Sampler not found in " + source);
			return null;
		}

		var inputs = {};
		var params = {};
		var sources = {};
		var xmlinputs = xmlsampler.querySelectorAll("input");

		var time_data = null;

		//iterate inputs: collada separates the keyframe info in independent streams, like time, interpolation method, value )
		for (var j = 0; j < xmlinputs.length; j++) {
			var xmlinput = xmlinputs.item(j);
			var source_name = xmlinput.getAttribute("source");

			//there are three 
			var semantic = xmlinput.getAttribute("semantic");

			//Search for source
			var xmlsource = this.findXMLNodeById(xmlanimation, "source", source_name.substr(1));
			if (!xmlsource) continue;

			var xmlparam = xmlsource.querySelector("param");
			if (!xmlparam) continue;

			var type = xmlparam.getAttribute("type");
			inputs[semantic] = { source: source_name, type: type };

			var data_array = null;

			if (type == "float" || type == "float4x4") {
				var xmlfloatarray = xmlsource.querySelector("float_array");
				var floats = this.readContentAsFloats(xmlfloatarray);
				sources[source_name] = floats;
				data_array = floats;
			} else //only floats and matrices are supported in animation
				continue;

			var param_name = xmlparam.getAttribute("name");
			if (param_name == "TIME") time_data = data_array;
			if (semantic == "OUTPUT") param_name = semantic;
			if (param_name) params[param_name] = type;else console.warn("Collada: <param> without name attribute in <animation>");
		}

		if (!time_data) {
			console.error("Error DAE: no TIME info found in <channel>: " + xmlchannel.getAttribute("source"));
			return null;
		}

		//construct animation
		var path = target.split("/");

		var anim = {};
		var nodename = path[0]; //safeString ?
		var node = this._nodes_by_id[nodename];
		var locator = node.id + "/" + path[1];
		//anim.nodename = this.safeString( path[0] ); //where it goes
		anim.name = path[1];
		anim.property = locator;
		var type = "number";
		var element_size = 1;
		var param_type = params["OUTPUT"];
		switch (param_type) {
			case "float":
				element_size = 1;break;
			case "float3x3":
				element_size = 9;type = "mat3";break;
			case "float4x4":
				element_size = 16;type = "mat4";break;
			default:
				break;
		}

		anim.type = type;
		anim.value_size = element_size;
		anim.duration = time_data[time_data.length - 1]; //last sample

		var value_data = sources[inputs["OUTPUT"].source];
		if (!value_data) return null;

		//Pack data ****************
		var num_samples = time_data.length;
		var sample_size = element_size + 1;
		var anim_data = new Float32Array(num_samples * sample_size);
		//for every sample
		for (var j = 0; j < time_data.length; ++j) {
			anim_data[j * sample_size] = time_data[j]; //set time
			var value = value_data.subarray(j * element_size, (j + 1) * element_size);
			if (param_type == "float4x4") {
				this.transformMatrix(value, node ? node._depth == 0 : 0);
				//mat4.transpose(value, value);
			}
			anim_data.set(value, j * sample_size + 1); //set data
		}

		if (isWorker && this.use_transferables) {
			var data = anim_data;
			if (data && data.buffer && data.length > 100) this._transferables.push(data.buffer);
		}

		anim.data = anim_data;
		return anim;
	},

	findNode: function findNode(root, id) {
		if (root.id == id) return root;
		if (root.children) for (var i in root.children) {
			var ret = this.findNode(root.children[i], id);
			if (ret) return ret;
		}
		return null;
	},

	//reads controllers and stores them in 
	readLibraryControllers: function readLibraryControllers(scene) {
		var xmllibrarycontrollers = this._xmlroot.querySelector("library_controllers");
		if (!xmllibrarycontrollers) return null;

		var xmllibrarycontrollers_childs = xmllibrarycontrollers.childNodes;

		for (var i = 0; i < xmllibrarycontrollers_childs.length; ++i) {
			var xmlcontroller = xmllibrarycontrollers_childs.item(i);
			if (xmlcontroller.nodeType != 1 || xmlcontroller.localName != "controller") //no tag
				continue;
			var id = xmlcontroller.getAttribute("id");
			//we have already processed this controller
			if (this._controllers_found[id]) continue;

			//read it (we wont use the returns, we will get it from this._controllers_found
			this.readController(xmlcontroller, null, scene);
		}
	},

	//used for skinning and morphing
	readController: function readController(xmlcontroller, flip, scene) {
		if (!xmlcontroller.localName == "controller") {
			console.warn("readController: not a controller: " + xmlcontroller.localName);
			return null;
		}

		var id = xmlcontroller.getAttribute("id");
		//use cached
		if (this._controllers_found[id]) return this._controllers_found[id];

		//AGUILA
		//TODO: does this work?
		// if (this._controllers_found[ id ])
		// 	return this._controllers_found[ id ];

		var use_indices = false;
		var mesh = null;
		var xmlskin = xmlcontroller.querySelector("skin");
		if (xmlskin) {
			mesh = this.readSkinController(xmlskin, flip, scene);
		}

		var xmlmorph = xmlcontroller.querySelector("morph");
		if (xmlmorph) mesh = this.readMorphController(xmlmorph, flip, scene, mesh);

		//cache and return
		if (this._controllers_found[id]) {
			id += "_1blah"; //??? this doesnt do anything
		} else this._controllers_found[id] = mesh;

		return mesh;
	},

	//read this to more info about DAE and skinning https://collada.org/mediawiki/index.php/Skinning
	readSkinController: function readSkinController(xmlskin, flip, scene) {
		//base geometry
		var id_geometry = xmlskin.getAttribute("source");

		var mesh = this.readGeometry(id_geometry, flip, scene);
		if (!mesh) return null;

		var sources = this.readSources(xmlskin, flip);
		if (!sources) return null;

		//matrix
		var bind_matrix = null;
		var xmlbindmatrix = xmlskin.querySelector("bind_shape_matrix");
		if (xmlbindmatrix) {
			bind_matrix = this.readContentAsFloats(xmlbindmatrix);
			this.transformMatrix(bind_matrix, true, true);
		} else bind_matrix = _glMatrix.mat4.create(); //identity

		//joints
		var joints = [];
		var xmljoints = xmlskin.querySelector("joints");
		if (xmljoints) {
			var joints_source = null; //which bones
			var inv_bind_source = null; //bind matrices
			var xmlinputs = xmljoints.querySelectorAll("input");
			for (var i = 0; i < xmlinputs.length; i++) {
				var xmlinput = xmlinputs[i];
				var sem = xmlinput.getAttribute("semantic").toUpperCase();
				var src = xmlinput.getAttribute("source");
				var source = sources[src.substr(1)];
				if (sem == "JOINT") joints_source = source;else if (sem == "INV_BIND_MATRIX") inv_bind_source = source;
			}

			//save bone names and inv matrix
			if (!inv_bind_source || !joints_source) {
				console.error("Error DAE: no joints or inv_bind sources found");
				return null;
			}

			for (var i in joints_source) {
				//get the inverse of the bind pose
				var inv_mat = inv_bind_source.subarray(i * 16, i * 16 + 16);
				var nodename = joints_source[i];
				var node = this._nodes_by_id[nodename];
				if (!node) {
					console.warn("Node " + nodename + " not found");
					continue;
				}
				this.transformMatrix(inv_mat, node._depth == 0, true);
				joints.push([nodename, inv_mat]);
			}
		}

		//weights
		var xmlvertexweights = xmlskin.querySelector("vertex_weights");
		if (xmlvertexweights) {

			//here we see the order 
			var weights_indexed_array = null;
			var xmlinputs = xmlvertexweights.querySelectorAll("input");
			for (var i = 0; i < xmlinputs.length; i++) {
				if (xmlinputs[i].getAttribute("semantic").toUpperCase() == "WEIGHT") weights_indexed_array = sources[xmlinputs.item(i).getAttribute("source").substr(1)];
			}

			if (!weights_indexed_array) throw "no weights found";

			var xmlvcount = xmlvertexweights.querySelector("vcount");
			var vcount = this.readContentAsUInt32(xmlvcount);

			var xmlv = xmlvertexweights.querySelector("v");
			var v = this.readContentAsUInt32(xmlv);

			var num_vertices = mesh.vertices.length / 3; //3 components per vertex
			var weights_array = new Float32Array(4 * num_vertices); //4 bones per vertex
			var bone_index_array = new Uint8Array(4 * num_vertices); //4 bones per vertex

			var pos = 0;
			var remap = mesh._remap;
			var max_bone = 0; //max bone affected

			for (var i = 0, l = vcount.length; i < l; ++i) {
				var num_bones = vcount[i]; //num bones influencing this vertex

				//find 4 with more influence
				//var v_tuplets = v.subarray(offset, offset + num_bones*2);

				var offset = pos;
				var b = bone_index_array.subarray(i * 4, i * 4 + 4);
				var w = weights_array.subarray(i * 4, i * 4 + 4);

				var sum = 0;
				for (var j = 0; j < num_bones && j < 4; ++j) {
					b[j] = v[offset + j * 2];
					if (b[j] > max_bone) max_bone = b[j];

					w[j] = weights_indexed_array[v[offset + j * 2 + 1]];
					sum += w[j];
				}

				//normalize weights
				if (num_bones > 4 && sum < 1.0) {
					var inv_sum = 1 / sum;
					for (var j = 0; j < 4; ++j) {
						w[j] *= inv_sum;
					}
				}

				pos += num_bones * 2;
			}

			//remap: because vertices order is now changed after parsing the mesh
			var final_weights = new Float32Array(4 * num_vertices); //4 bones per vertex
			var final_bone_indices = new Uint8Array(4 * num_vertices); //4 bones per vertex
			var used_joints = [];

			//for every vertex in the mesh, process bone indices and weights
			for (var i = 0; i < num_vertices; ++i) {
				var p = remap[i] * 4;
				var w = weights_array.subarray(p, p + 4);
				var b = bone_index_array.subarray(p, p + 4);

				//sort by weight so relevant ones goes first
				for (var k = 0; k < 3; ++k) {
					var max_pos = k;
					var max_value = w[k];
					for (var j = k + 1; j < 4; ++j) {
						if (w[j] <= max_value) continue;
						max_pos = j;
						max_value = w[j];
					}
					if (max_pos != k) {
						var tmp = w[k];
						w[k] = w[max_pos];
						w[max_pos] = tmp;
						tmp = b[k];
						b[k] = b[max_pos];
						b[max_pos] = tmp;
					}
				}

				//store
				final_weights.set(w, i * 4);
				final_bone_indices.set(b, i * 4);

				//mark bones used
				if (w[0]) used_joints[b[0]] = true;
				if (w[1]) used_joints[b[1]] = true;
				if (w[2]) used_joints[b[2]] = true;
				if (w[3]) used_joints[b[3]] = true;
			}

			if (max_bone >= joints.length) console.warn("Mesh uses higher bone index than bones found");

			//trim unused bones (collada could give you 100 bones for an object that only uses a fraction of them)
			if (1) {
				var new_bones = [];
				var bones_translation = {};
				for (var i = 0; i < used_joints.length; ++i) {
					if (used_joints[i]) {
						bones_translation[i] = new_bones.length;
						new_bones.push(joints[i]);
					}
				} //in case there are less bones in use...
				if (new_bones.length < joints.length) {
					//remap
					for (var i = 0; i < final_bone_indices.length; i++) {
						final_bone_indices[i] = bones_translation[final_bone_indices[i]];
					}joints = new_bones;
				}
				//console.log("Bones: ", joints.length, " used:", num_used_joints );
			}

			//console.log("Bones: ", joints.length, "Max bone: ", max_bone);

			mesh.weights = final_weights;
			mesh.bone_indices = final_bone_indices;
			mesh.bones = joints;
			mesh.bind_matrix = bind_matrix;

			//delete mesh["_remap"];
		}

		return mesh;
	},

	//NOT TESTED
	readMorphController: function readMorphController(xmlmorph, flip, scene, mesh) {
		var id_geometry = xmlmorph.getAttribute("source");
		var base_mesh = this.readGeometry(id_geometry, flip, scene);
		if (!base_mesh) return null;

		//read sources with blend shapes info (which ones, and the weight)
		var sources = this.readSources(xmlmorph, flip);

		var morphs = [];

		//targets
		var xmltargets = xmlmorph.querySelector("targets");
		if (!xmltargets) return null;

		var xmlinputs = xmltargets.querySelectorAll("input");
		var targets = null;
		var weights = null;

		for (var i = 0; i < xmlinputs.length; i++) {
			var xmlinput = xmlinputs.item(i);
			var semantic = xmlinput.getAttribute("semantic").toUpperCase();
			var data = sources[xmlinput.getAttribute("source").substr(1)];
			if (semantic == "MORPH_TARGET") targets = data;else if (semantic == "MORPH_WEIGHT") weights = data;
		}

		if (!targets || !weights) {
			console.warn("Morph controller without targets or weights. Skipping it.");
			return null;
		}

		//get targets
		for (var i in targets) {
			var id = "#" + targets[i];
			var geometry = this.readGeometry(id, flip, scene);
			scene.meshes[id] = geometry;
			morphs.push({ mesh: id, weight: weights[i] });
		}

		base_mesh.morph_targets = morphs;
		return base_mesh;
	},

	readBindMaterials: function readBindMaterials(xmlbind_material, mesh) {
		var materials = [];

		var xmltechniques = xmlbind_material.querySelectorAll("technique_common");
		for (var i = 0; i < xmltechniques.length; i++) {
			var xmltechnique = xmltechniques.item(i);
			var xmlinstance_materials = xmltechnique.querySelectorAll("instance_material");
			for (var j = 0; j < xmlinstance_materials.length; j++) {
				var xmlinstance_material = xmlinstance_materials.item(j);
				if (xmlinstance_material) materials.push(xmlinstance_material.getAttribute("symbol"));
			}
		}

		return materials;
	},

	readSources: function readSources(xmlnode, flip) {
		//for data sources
		var sources = {};
		var xmlsources = xmlnode.querySelectorAll("source");
		for (var i = 0; i < xmlsources.length; i++) {
			var xmlsource = xmlsources.item(i);
			if (!xmlsource.querySelector) //??
				continue;

			var float_array = xmlsource.querySelector("float_array");
			if (float_array) {
				var floats = this.readContentAsFloats(xmlsource);
				sources[xmlsource.getAttribute("id")] = floats;
				continue;
			}

			var name_array = xmlsource.querySelector("Name_array");
			if (name_array) {
				var names = this.readContentAsStringsArray(name_array);
				if (!names) continue;
				sources[xmlsource.getAttribute("id")] = names;
				continue;
			}

			var ref_array = xmlsource.querySelector("IDREF_array");
			if (ref_array) {
				var names = this.readContentAsStringsArray(ref_array);
				if (!names) continue;
				sources[xmlsource.getAttribute("id")] = names;
				continue;
			}
		}

		return sources;
	},

	readContentAsUInt32: function readContentAsUInt32(xmlnode) {
		if (!xmlnode) return null;
		var text = xmlnode.textContent;
		text = text.replace(/\n/gi, " "); //remove line breaks
		text = text.trim(); //remove empty spaces
		if (text.length == 0) return null;
		var numbers = text.split(" "); //create array
		var floats = new Uint32Array(numbers.length);
		for (var k = 0; k < numbers.length; k++) {
			floats[k] = parseInt(numbers[k]);
		}return floats;
	},

	readContentAsFloats: function readContentAsFloats(xmlnode) {
		if (!xmlnode) return null;
		var text = xmlnode.textContent;
		text = text.replace(/\n/gi, " "); //remove line breaks
		text = text.replace(/\s\s+/gi, " ");
		text = text.replace(/\t/gi, "");
		text = text.trim(); //remove empty spaces
		var numbers = text.split(" "); //create array
		var count = xmlnode.getAttribute("count");
		var length = count ? parseInt(count) : numbers.length;
		var floats = new Float32Array(length);
		for (var k = 0; k < numbers.length; k++) {
			floats[k] = parseFloat(numbers[k]);
		}return floats;
	},

	readContentAsStringsArray: function readContentAsStringsArray(xmlnode) {
		if (!xmlnode) return null;
		var text = xmlnode.textContent;
		text = text.replace(/\n/gi, " "); //remove line breaks
		text = text.replace(/\s\s/gi, " ");
		text = text.trim(); //remove empty spaces
		var words = text.split(" "); //create array
		for (var k = 0; k < words.length; k++) {
			words[k] = words[k].trim();
		}if (xmlnode.getAttribute("count") && parseInt(xmlnode.getAttribute("count")) != words.length) {
			var merged_words = [];
			var name = "";
			for (var i in words) {
				if (!name) name = words[i];else name += " " + words[i];
				if (!this._nodes_by_id[this.safeString(name)]) continue;
				merged_words.push(this.safeString(name));
				name = "";
			}

			var count = parseInt(xmlnode.getAttribute("count"));
			if (merged_words.length == count) return merged_words;

			console.error("Error: bone names have spaces, avoid using spaces in names");
			return null;
		}
		return words;
	},

	max3d_matrix_0: new Float32Array([0, -1, 0, 0, 0, 0, -1, 0, 1, 0, 0, -0, 0, 0, 0, 1]),
	//max3d_matrix_other: new Float32Array([0, -1, 0, 0, 0, 0, -1, 0, 1, 0, 0, -0, 0, 0, 0, 1]),

	transformMatrix: function transformMatrix(matrix, first_level, inverted) {
		_glMatrix.mat4.transpose(matrix, matrix);

		if (this.no_flip) return matrix;

		//WARNING: DO NOT CHANGE THIS FUNCTION, THE SKY WILL FALL
		if (first_level) {

			//flip row two and tree
			var temp = new Float32Array(matrix.subarray(4, 8)); //swap rows
			matrix.set(matrix.subarray(8, 12), 4);
			matrix.set(temp, 8);

			//reverse Z
			temp = matrix.subarray(8, 12);
			vec4.scale(temp, temp, -1);
		} else {
			var M = _glMatrix.mat4.create();
			var m = matrix;

			//if(inverted) mat4.invert(m,m);

			/* non trasposed
   M.set([m[0],m[8],-m[4]], 0);
   M.set([m[2],m[10],-m[6]], 4);
   M.set([-m[1],-m[9],m[5]], 8);
   M.set([m[3],m[11],-m[7]], 12);
   */

			M.set([m[0], m[2], -m[1]], 0);
			M.set([m[8], m[10], -m[9]], 4);
			M.set([-m[4], -m[6], m[5]], 8);
			M.set([m[12], m[14], -m[13]], 12);

			m.set(M);

			//if(inverted) mat4.invert(m,m);
		}
		return matrix;
	}
};

exports.default = Collada;
module.exports = exports['default'];
//# sourceMappingURL=Collada.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27)))

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _xhr = __webpack_require__(81);

var _xhr2 = _interopRequireDefault(_xhr);

var _loadImages = __webpack_require__(41);

var _loadImages2 = _interopRequireDefault(_loadImages);

var _Geometry = __webpack_require__(3);

var _Geometry2 = _interopRequireDefault(_Geometry);

var _Material = __webpack_require__(34);

var _Material2 = _interopRequireDefault(_Material);

var _Mesh = __webpack_require__(13);

var _Mesh2 = _interopRequireDefault(_Mesh);

var _GLShader = __webpack_require__(1);

var _GLShader2 = _interopRequireDefault(_GLShader);

var _ShaderLibs = __webpack_require__(21);

var _ShaderLibs2 = _interopRequireDefault(_ShaderLibs);

var _Shaders = __webpack_require__(16);

var _Shaders2 = _interopRequireDefault(_Shaders);

var _GLTexture = __webpack_require__(9);

var _GLTexture2 = _interopRequireDefault(_GLTexture);

var _Object3D = __webpack_require__(8);

var _Object3D2 = _interopRequireDefault(_Object3D);

var _promisePolyfill = __webpack_require__(42);

var _promisePolyfill2 = _interopRequireDefault(_promisePolyfill);

var _objectAssign = __webpack_require__(17);

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _WebglNumber = __webpack_require__(10);

var _WebglNumber2 = _interopRequireDefault(_WebglNumber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ARRAY_CTOR_MAP = {
	5120: Int8Array,
	5121: Uint8Array,
	5122: Int16Array,
	5123: Uint16Array,
	5125: Uint32Array,
	5126: Float32Array
}; // GltfLoader.js

var SIZE_MAP = {
	SCALAR: 1,
	VEC2: 2,
	VEC3: 3,
	VEC4: 4,
	MAT2: 4,
	MAT3: 9,
	MAT4: 16
};

var semanticAttributeMap = {
	NORMAL: 'aNormal',
	POSITION: 'aVertexPosition',
	// 'TANGENT': 'aTangent',
	TEXCOORD_0: 'aTextureCoord',
	// TEXCOORD_1: 'aTextureCoord1',
	WEIGHTS_0: 'aWeight',
	JOINTS_0: 'aJoint',
	COLOR: 'aColor'
};

var base = void 0;

var load = function load(mSource) {
	return new _promisePolyfill2.default(function (resolve, reject) {
		if (typeof mSource === 'string') {
			base = mSource.substring(0, mSource.lastIndexOf('/') + 1);
		} else {
			base = '';
		}

		_loadGltf(mSource).then(_loadBin).then(_loadTextures).then(_getBufferViewData).then(_parseMaterials).then(_parseMesh).then(_parseNodes).then(function (gltfInfo) {
			resolve(gltfInfo);
		}).catch(function (e) {
			console.log('Error:', e);
		});
	});
};

var _parseNodes = function _parseNodes(gltf) {
	return new _promisePolyfill2.default(function (resolve, reject) {
		var nodes = gltf.nodes,
		    scenes = gltf.scenes;


		var getTree = function getTree(nodeIndex) {
			var node = nodes[nodeIndex];
			var obj3D = node.mesh === undefined ? new _Object3D2.default() : gltf.output.meshes[node.mesh];

			if (node.scale) {
				obj3D.scaleX = node.scale[0];
				obj3D.scaleY = node.scale[1];
				obj3D.scaleZ = node.scale[2];
			}

			if (node.rotation) {
				obj3D.setRotationFromQuaternion(node.rotation);
			}

			if (node.translation) {
				obj3D.x = node.translation[0];
				obj3D.y = node.translation[1];
				obj3D.z = node.translation[2];
			}

			if (node.children) {
				node.children.forEach(function (child) {
					var _child = getTree(child);
					obj3D.addChild(_child);
				});
			}

			return obj3D;
		};

		gltf.output.scenes = scenes.map(function (scene) {
			var container = new _Object3D2.default();
			scene.nodes.forEach(function (nodeIndex) {
				var childTree = getTree(nodeIndex);
				container.addChild(childTree);
			});

			return container;
		});

		resolve(gltf);
	});
};

var _parseMesh = function _parseMesh(gltf) {
	return new _promisePolyfill2.default(function (resolve, reject) {
		var meshes = gltf.meshes;


		meshes.forEach(function (mesh) {
			var primitives = mesh.primitives;


			var geometryInfo = {};

			primitives.forEach(function (primitiveInfo) {
				var semantics = Object.keys(primitiveInfo.attributes);
				var defines = {};

				semantics.forEach(function (semantic) {
					var accessorIdx = primitiveInfo.attributes[semantic];
					var attributeInfo = gltf.accessors[accessorIdx];
					var attributeName = semanticAttributeMap[semantic];
					if (!attributeName) {
						return;
					}
					if (semantic === 'NORMAL') {
						defines.HAS_NORMALS = 1;
					}
					if (semantic.indexOf('TEXCOORD') > -1) {
						defines.HAS_UV = 1;
					}

					var size = SIZE_MAP[attributeInfo.type];
					var attributeArray = _getAccessorData(gltf, accessorIdx);
					if (attributeArray instanceof Uint32Array) {
						attributeArray = new Float32Array(attributeArray);
					}

					if (semantic === 'TEXCOORD_1') {
						console.log(size, attributeArray);
					}

					geometryInfo[attributeName] = {
						value: attributeArray,
						size: size
					};
					// console.log('attribute', attributeName, geometry[attributeName]);
				});

				//	parse index
				if (primitiveInfo.indices != null) {
					var attributeArray = _getAccessorData(gltf, primitiveInfo.indices, true);
					geometryInfo.indices = {
						value: attributeArray,
						size: 1
					};
				}

				var geometry = new _Geometry2.default();

				for (var s in geometryInfo) {
					var data = geometryInfo[s];
					if (s !== 'indices') {
						geometry.bufferFlattenData(data.value, s, data.size);
					} else {
						geometry.bufferIndex(data.value);
					}
				}

				var materialInfo = gltf.output.materialInfo[primitiveInfo.material];
				defines = (0, _objectAssign2.default)(defines, materialInfo.defines);

				var emissiveFacotr = materialInfo.emissiveFacotr,
				    normalTexture = materialInfo.normalTexture,
				    occlusionTexture = materialInfo.occlusionTexture,
				    pbrMetallicRoughness = materialInfo.pbrMetallicRoughness;
				var baseColorTexture = pbrMetallicRoughness.baseColorTexture,
				    metallicRoughnessTexture = pbrMetallicRoughness.metallicRoughnessTexture;


				var uniforms = {
					uEmissiveFactor: emissiveFacotr || [0, 0, 0],
					uBaseColor: pbrMetallicRoughness.baseColorFactor || [1, 1, 1, 1],
					uRoughness: pbrMetallicRoughness.roughnessFactor || 1,
					uMetallic: pbrMetallicRoughness.metallicFactor || 1,
					uScaleDiffBaseMR: [0, 0, 0, 0],
					uScaleFGDSpec: [0, 0, 0, 0],
					uScaleIBLAmbient: [1, 1, 1, 1],
					uLightDirection: [1, 1, 1],
					uLightColor: [1, 1, 1],
					uGamma: 1
				};

				if (baseColorTexture) {
					uniforms.uColorMap = baseColorTexture.glTexture;
				}

				if (metallicRoughnessTexture) {
					uniforms.uMetallicRoughnessMap = metallicRoughnessTexture.glTexture;
				}

				if (normalTexture) {
					uniforms.uNormalScale = normalTexture.scale || 1;
					uniforms.uNormalMap = normalTexture.glTexture;
				}

				if (occlusionTexture) {
					uniforms.uAoMap = occlusionTexture.glTexture;
					uniforms.uOcclusionStrength = occlusionTexture.strength || 1;
				}

				var material = new _Material2.default(_ShaderLibs2.default.gltfVert, _ShaderLibs2.default.gltfFrag, uniforms, defines);
				var mesh = new _Mesh2.default(geometry, material);
				gltf.output.meshes.push(mesh);
			});
		});

		resolve(gltf);
	});
};

var _getBufferViewData = function _getBufferViewData(gltfInfo) {
	return new _promisePolyfill2.default(function (resolve, reject) {
		var bufferViews = gltfInfo.bufferViews,
		    buffers = gltfInfo.buffers;


		bufferViews.forEach(function (bufferViewInfo, i) {
			var buffer = buffers[bufferViewInfo.buffer].data;
			bufferViewInfo.data = buffer.slice(bufferViewInfo.byteOffset || 0, (bufferViewInfo.byteOffset || 0) + (bufferViewInfo.byteLength || 0));
		});
		resolve(gltfInfo);
	});
};

var _loadGltf = function _loadGltf(mSource) {
	return new _promisePolyfill2.default(function (resolve, reject) {
		if (typeof mSource !== 'string') {
			resolve(mSource);
		} else {
			(0, _xhr2.default)(mSource).then(function (o) {
				var gltfInfo = JSON.parse(o);
				gltfInfo.output = {
					meshes: [],
					scenes: [],
					textures: [],
					material: [],
					materialInfo: []
				};

				resolve(gltfInfo);
			}, function (e) {
				reject(e);
			});
		}
	});
};

var _loadBin = function _loadBin(gltfInfo) {
	return new _promisePolyfill2.default(function (resolve, reject) {

		if (gltfInfo.buffers) {
			var count = gltfInfo.buffers.length;

			gltfInfo.buffers.forEach(function (buffer) {

				var urlBin = '' + base + gltfInfo.buffers[0].uri;
				(0, _xhr2.default)(urlBin, true).then(function (o) {
					buffer.data = o;

					count--;
					if (count === 0) {
						resolve(gltfInfo);
					}
				}, function (e) {
					reject(e);
				});
			});
		} else {
			resolve(gltfInfo);
		}
	});
};

var _loadTextures = function _loadTextures(gltfInfo) {
	return new _promisePolyfill2.default(function (resolve, reject) {
		var textures = gltfInfo.textures,
		    images = gltfInfo.images,
		    samplers = gltfInfo.samplers;

		if (!images) {
			resolve(gltfInfo);
		}

		var imagesToLoad = images.map(function (img) {
			return '' + base + img.uri;
		});

		(0, _loadImages2.default)(imagesToLoad).then(function (o) {
			gltfInfo.output.textures = o.map(function (img, i) {
				var settings = (0, _objectAssign2.default)({}, samplers ? samplers[textures[i].sampler] : {});
				return new _GLTexture2.default(img, settings);
			});
			resolve(gltfInfo);
		}, function (e) {
			reject(e);
		});
	});
};

var _parseMaterials = function _parseMaterials(gltfInfo) {
	return new _promisePolyfill2.default(function (resolve, reject) {
		var materials = gltfInfo.materials;
		var textures = gltfInfo.output.textures;


		gltfInfo.output.materialInfo = materials.map(function (material) {
			material.defines = {
				USE_IBL: 1
			};

			if (material.normalTexture) {
				material.defines.HAS_NORMALMAP = 1;
				material.normalTexture.glTexture = textures[material.normalTexture.index];
			}

			if (material.occlusionTexture) {
				material.defines.HAS_OCCLUSIONMAP = 1;
				material.occlusionTexture.glTexture = textures[material.occlusionTexture.index];
			}

			// if(material.pbrMetallicRoughness) {
			if (material.pbrMetallicRoughness.baseColorTexture) {
				material.defines.HAS_BASECOLORMAP = 1;
				material.pbrMetallicRoughness.baseColorTexture.glTexture = textures[material.pbrMetallicRoughness.baseColorTexture.index];
			}

			if (material.pbrMetallicRoughness.metallicRoughnessTexture) {
				material.defines.HAS_METALROUGHNESSMAP = 1;
				material.pbrMetallicRoughness.metallicRoughnessTexture.glTexture = textures[material.pbrMetallicRoughness.metallicRoughnessTexture.index];
			}

			// }

			return material;
		});

		resolve(gltfInfo);
	});
};

var parse = function parse(mGltfInfo, mBin) {
	return new _promisePolyfill2.default(function (resolve, reject) {
		resolve(mSource);
	});
};

var _getAccessorData = function _getAccessorData(gltf, accessorIdx) {
	var isIndices = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	var accessorInfo = gltf.accessors[accessorIdx];
	var buffer = gltf.bufferViews[accessorInfo.bufferView].data;
	var byteOffset = accessorInfo.byteOffset || 0;
	var ArrayCtor = ARRAY_CTOR_MAP[accessorInfo.componentType] || Float32Array;
	var size = SIZE_MAP[accessorInfo.type];
	if (size == null && isIndices) {
		size = 1;
	}
	var arr = new ArrayCtor(buffer, byteOffset, size * accessorInfo.count);
	var quantizeExtension = accessorInfo.extensions && accessorInfo.extensions['WEB3D_quantized_attributes'];
	if (quantizeExtension) {
		var decodedArr = new Float32Array(size * accessorInfo.count);
		var decodeMatrix = quantizeExtension.decodeMatrix;
		var decodeOffset = new Array(size);
		var decodeScale = new Array(size);
		for (var k = 0; k < size; k++) {
			decodeOffset[k] = decodeMatrix[size * (size + 1) + k];
			decodeScale[k] = decodeMatrix[k * (size + 1) + k];
		}
		for (var i = 0; i < accessorInfo.count; i++) {
			for (var _k = 0; _k < size; _k++) {
				decodedArr[i * size + _k] = arr[i * size + _k] * decodeScale[_k] + decodeOffset[_k];
			}
		}

		arr = decodedArr;
	}

	// console.log({buffer, byteOffset, ArrayCtor, size, arr});

	return arr;
};

exports.default = {
	load: load,
	parse: parse
};

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
// xhr.js

var load = function load(mPath, isArrayBuffer) {
	return new Promise(function (resolve, reject) {
		var req = new XMLHttpRequest();
		req.addEventListener('load', function (e) {
			resolve(req.response);
		});

		req.addEventListener('error', function (e) {
			reject(e);
		});

		if (isArrayBuffer) {
			req.responseType = 'arraybuffer';
		}

		req.open('GET', mPath);
		req.send();
	});
};

exports.default = load;

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(83);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27), __webpack_require__(84)))

/***/ }),
/* 84 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // EffectComposer.js

var _Pass = __webpack_require__(12);

var _Pass2 = _interopRequireDefault(_Pass);

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _Geom = __webpack_require__(7);

var _Geom2 = _interopRequireDefault(_Geom);

var _FrameBuffer = __webpack_require__(18);

var _FrameBuffer2 = _interopRequireDefault(_FrameBuffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EffectComposer = function () {
	function EffectComposer(mWidth, mHeight) {
		var mParmas = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

		_classCallCheck(this, EffectComposer);

		this._width = mWidth || _GLTool2.default.width;
		this._height = mHeight || _GLTool2.default.height;

		this._params = {};
		this.setSize(mWidth, mHeight);
		this._geometry = _Geom2.default.bigTriangle();
		this._passes = [];
		this._returnTexture;
	}

	_createClass(EffectComposer, [{
		key: 'addPass',
		value: function addPass(pass) {
			if (pass.passes) {
				this.addPass(pass.passes);
				return;
			}

			if (pass.length) {
				for (var i = 0; i < pass.length; i++) {
					this._passes.push(pass[i]);
				}
			} else {
				this._passes.push(pass);
			}
		}
	}, {
		key: 'render',
		value: function render(mSource) {
			var _this = this;

			var source = mSource;
			var fboTarget = void 0;

			this._passes.forEach(function (pass) {

				//	get target
				if (pass.hasFbo) {
					fboTarget = pass.fbo;
				} else {
					fboTarget = _this._fboTarget;
				}

				//	render
				fboTarget.bind();
				_GLTool2.default.clear(0, 0, 0, 0);
				pass.render(source);
				_GLTool2.default.draw(_this._geometry);
				fboTarget.unbind();

				//	reset source
				if (pass.hasFbo) {
					source = pass.fbo.getTexture();
				} else {
					_this._swap();
					source = _this._fboCurrent.getTexture();
				}
			});

			this._returnTexture = source;

			return source;
		}
	}, {
		key: '_swap',
		value: function _swap() {
			var tmp = this._fboCurrent;
			this._fboCurrent = this._fboTarget;
			this._fboTarget = tmp;

			this._current = this._fboCurrent;
			this._target = this._fboTarget;
		}
	}, {
		key: 'setSize',
		value: function setSize(mWidth, mHeight) {
			this._width = mWidth;
			this._height = mHeight;
			this._fboCurrent = new _FrameBuffer2.default(this._width, this._height, this._params);
			this._fboTarget = new _FrameBuffer2.default(this._width, this._height, this._params);
		}
	}, {
		key: 'getTexture',
		value: function getTexture() {
			return this._returnTexture;
		}
	}, {
		key: 'passes',
		get: function get() {
			return this._passes;
		}
	}]);

	return EffectComposer;
}();

exports.default = EffectComposer;

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _PassVBlur = __webpack_require__(44);

var _PassVBlur2 = _interopRequireDefault(_PassVBlur);

var _PassHBlur = __webpack_require__(46);

var _PassHBlur2 = _interopRequireDefault(_PassHBlur);

var _PassMacro2 = __webpack_require__(43);

var _PassMacro3 = _interopRequireDefault(_PassMacro2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // PassBlur.js

var PassBlur = function (_PassMacro) {
	_inherits(PassBlur, _PassMacro);

	function PassBlur() {
		var mQuality = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 9;
		var mWidth = arguments[1];
		var mHeight = arguments[2];
		var mParams = arguments[3];

		_classCallCheck(this, PassBlur);

		var _this = _possibleConstructorReturn(this, (PassBlur.__proto__ || Object.getPrototypeOf(PassBlur)).call(this));

		var vBlur = new _PassVBlur2.default(mQuality, mWidth, mHeight, mParams);
		var hBlur = new _PassHBlur2.default(mQuality, mWidth, mHeight, mParams);

		_this.addPass(vBlur);
		_this.addPass(hBlur);
		return _this;
	}

	return PassBlur;
}(_PassMacro3.default);

exports.default = PassBlur;

/***/ }),
/* 87 */
/***/ (function(module, exports) {

module.exports = "// blur5.frag\n// source  : https://github.com/Jam3/glsl-fast-gaussian-blur\n\n#define SHADER_NAME BLUR_5\n\nprecision highp float;\n#define GLSLIFY 1\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform vec2 uDirection;\nuniform vec2 uResolution;\n\nvec4 blur5(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {\n\tvec4 color = vec4(0.0);\n\tvec2 off1 = vec2(1.3333333333333333) * direction;\n\tcolor += texture2D(image, uv) * 0.29411764705882354;\n\tcolor += texture2D(image, uv + (off1 / resolution)) * 0.35294117647058826;\n\tcolor += texture2D(image, uv - (off1 / resolution)) * 0.35294117647058826;\n\treturn color; \n}\n\n\nvoid main(void) {\n    gl_FragColor = blur5(texture, vTextureCoord, uResolution, uDirection);\n}"

/***/ }),
/* 88 */
/***/ (function(module, exports) {

module.exports = "// blur9.frag\n// source  : https://github.com/Jam3/glsl-fast-gaussian-blur\n\n#define SHADER_NAME BLUR_9\n\nprecision highp float;\n#define GLSLIFY 1\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform vec2 uDirection;\nuniform vec2 uResolution;\n\nvec4 blur9(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {\n\tvec4 color = vec4(0.0);\n\tvec2 off1 = vec2(1.3846153846) * direction;\n\tvec2 off2 = vec2(3.2307692308) * direction;\n\tcolor += texture2D(image, uv) * 0.2270270270;\n\tcolor += texture2D(image, uv + (off1 / resolution)) * 0.3162162162;\n\tcolor += texture2D(image, uv - (off1 / resolution)) * 0.3162162162;\n\tcolor += texture2D(image, uv + (off2 / resolution)) * 0.0702702703;\n\tcolor += texture2D(image, uv - (off2 / resolution)) * 0.0702702703;\n\treturn color;\n}\n\n\nvoid main(void) {\n    gl_FragColor = blur9(texture, vTextureCoord, uResolution, uDirection);\n}"

/***/ }),
/* 89 */
/***/ (function(module, exports) {

module.exports = "// blur13.frag\n// source  : https://github.com/Jam3/glsl-fast-gaussian-blur\n\n#define SHADER_NAME BLUR_13\n\nprecision highp float;\n#define GLSLIFY 1\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform vec2 uDirection;\nuniform vec2 uResolution;\n\nvec4 blur13(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {\n\tvec4 color = vec4(0.0);\n\tvec2 off1 = vec2(1.411764705882353) * direction;\n\tvec2 off2 = vec2(3.2941176470588234) * direction;\n\tvec2 off3 = vec2(5.176470588235294) * direction;\n\tcolor += texture2D(image, uv) * 0.1964825501511404;\n\tcolor += texture2D(image, uv + (off1 / resolution)) * 0.2969069646728344;\n\tcolor += texture2D(image, uv - (off1 / resolution)) * 0.2969069646728344;\n\tcolor += texture2D(image, uv + (off2 / resolution)) * 0.09447039785044732;\n\tcolor += texture2D(image, uv - (off2 / resolution)) * 0.09447039785044732;\n\tcolor += texture2D(image, uv + (off3 / resolution)) * 0.010381362401148057;\n\tcolor += texture2D(image, uv - (off3 / resolution)) * 0.010381362401148057;\n\treturn color;\n}\n\n\nvoid main(void) {\n    gl_FragColor = blur13(texture, vTextureCoord, uResolution, uDirection);\n}"

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _Pass2 = __webpack_require__(12);

var _Pass3 = _interopRequireDefault(_Pass2);

var _fxaa = __webpack_require__(47);

var _fxaa2 = _interopRequireDefault(_fxaa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // PassFxaa.js

var PassFxaa = function (_Pass) {
	_inherits(PassFxaa, _Pass);

	function PassFxaa() {
		_classCallCheck(this, PassFxaa);

		var _this = _possibleConstructorReturn(this, (PassFxaa.__proto__ || Object.getPrototypeOf(PassFxaa)).call(this, _fxaa2.default));

		_this.uniform('uResolution', [1 / _GLTool2.default.width, 1 / _GLTool2.default.height]);
		return _this;
	}

	return PassFxaa;
}(_Pass3.default);

exports.default = PassFxaa;

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Geom = __webpack_require__(7);

var _Geom2 = _interopRequireDefault(_Geom);

var _GLShader = __webpack_require__(1);

var _GLShader2 = _interopRequireDefault(_GLShader);

var _Batch2 = __webpack_require__(5);

var _Batch3 = _interopRequireDefault(_Batch2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // BatchCopy.js

var vs = __webpack_require__(22);
var fs = __webpack_require__(23);

var BatchCopy = function (_Batch) {
	_inherits(BatchCopy, _Batch);

	function BatchCopy() {
		_classCallCheck(this, BatchCopy);

		var mesh = _Geom2.default.bigTriangle();
		var shader = new _GLShader2.default(vs, fs);

		var _this = _possibleConstructorReturn(this, (BatchCopy.__proto__ || Object.getPrototypeOf(BatchCopy)).call(this, mesh, shader));

		shader.bind();
		shader.uniform('texture', 'uniform1i', 0);
		return _this;
	}

	_createClass(BatchCopy, [{
		key: 'draw',
		value: function draw(texture) {
			this.shader.bind();
			texture.bind(0);
			_get(BatchCopy.prototype.__proto__ || Object.getPrototypeOf(BatchCopy.prototype), 'draw', this).call(this);
		}
	}]);

	return BatchCopy;
}(_Batch3.default);

exports.default = BatchCopy;

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _Geometry = __webpack_require__(3);

var _Geometry2 = _interopRequireDefault(_Geometry);

var _GLShader = __webpack_require__(1);

var _GLShader2 = _interopRequireDefault(_GLShader);

var _Batch2 = __webpack_require__(5);

var _Batch3 = _interopRequireDefault(_Batch2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // BatchAxis.js

var vs = __webpack_require__(93);
var fs = __webpack_require__(94);

var BatchAxis = function (_Batch) {
	_inherits(BatchAxis, _Batch);

	function BatchAxis() {
		_classCallCheck(this, BatchAxis);

		var positions = [];
		var colors = [];
		var indices = [0, 1, 2, 3, 4, 5];
		var r = 9999;

		positions.push([-r, 0, 0]);
		positions.push([r, 0, 0]);
		positions.push([0, -r, 0]);
		positions.push([0, r, 0]);
		positions.push([0, 0, -r]);
		positions.push([0, 0, r]);

		colors.push([1, 0, 0]);
		colors.push([1, 0, 0]);
		colors.push([0, 1, 0]);
		colors.push([0, 1, 0]);
		colors.push([0, 0, 1]);
		colors.push([0, 0, 1]);

		var mesh = new _Geometry2.default(_GLTool2.default.LINES);
		mesh.bufferVertex(positions);
		mesh.bufferIndex(indices);
		mesh.bufferData(colors, 'aColor', 3);

		var shader = new _GLShader2.default(vs, fs);

		return _possibleConstructorReturn(this, (BatchAxis.__proto__ || Object.getPrototypeOf(BatchAxis)).call(this, mesh, shader));
	}

	return BatchAxis;
}(_Batch3.default);

exports.default = BatchAxis;

/***/ }),
/* 93 */
/***/ (function(module, exports) {

module.exports = "// axis.vert\n\n#define SHADER_NAME BASIC_VERTEX\n\nprecision highp float;\n#define GLSLIFY 1\nattribute vec3 aVertexPosition;\nattribute vec3 aColor;\nattribute vec3 aNormal;\n\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjectionMatrix;\n\nvarying vec3 vColor;\nvarying vec3 vNormal;\n\nvoid main(void) {\n    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);\n    vColor = aColor;\n    vNormal = aNormal;\n}"

/***/ }),
/* 94 */
/***/ (function(module, exports) {

module.exports = "// axis.frag\n\n#define SHADER_NAME SIMPLE_TEXTURE\n\nprecision lowp float;\n#define GLSLIFY 1\nvarying vec3 vColor;\nvarying vec3 vNormal;\n\nvoid main(void) {\n\t// vec3 color = vNormal;\n\tvec3 color = vColor + vNormal * 0.0001;\n    gl_FragColor = vec4(color, 1.0);\n}"

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Geom = __webpack_require__(7);

var _Geom2 = _interopRequireDefault(_Geom);

var _GLShader = __webpack_require__(1);

var _GLShader2 = _interopRequireDefault(_GLShader);

var _Batch2 = __webpack_require__(5);

var _Batch3 = _interopRequireDefault(_Batch2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // BatchBall.js

var vs = __webpack_require__(37);
var fs = __webpack_require__(11);

var BatchBall = function (_Batch) {
	_inherits(BatchBall, _Batch);

	function BatchBall() {
		_classCallCheck(this, BatchBall);

		var geometry = _Geom2.default.sphere(1, 24);
		var shader = new _GLShader2.default(vs, fs);
		return _possibleConstructorReturn(this, (BatchBall.__proto__ || Object.getPrototypeOf(BatchBall)).call(this, geometry, shader));
	}

	_createClass(BatchBall, [{
		key: 'draw',
		value: function draw() {
			var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [0, 0, 0];
			var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [1, 1, 1];
			var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [1, 1, 1];
			var opacity = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

			this.shader.bind();
			this.shader.uniform('position', 'uniform3fv', position);
			this.shader.uniform('scale', 'uniform3fv', scale);
			this.shader.uniform('color', 'uniform3fv', color);
			this.shader.uniform('opacity', 'uniform1f', opacity);
			_get(BatchBall.prototype.__proto__ || Object.getPrototypeOf(BatchBall.prototype), 'draw', this).call(this);
		}
	}]);

	return BatchBall;
}(_Batch3.default);

exports.default = BatchBall;

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _Geometry = __webpack_require__(3);

var _Geometry2 = _interopRequireDefault(_Geometry);

var _GLShader = __webpack_require__(1);

var _GLShader2 = _interopRequireDefault(_GLShader);

var _Batch2 = __webpack_require__(5);

var _Batch3 = _interopRequireDefault(_Batch2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // BatchDotsPlane.js

var vs = __webpack_require__(97);
var fs = __webpack_require__(11);

var BatchDotsPlane = function (_Batch) {
	_inherits(BatchDotsPlane, _Batch);

	function BatchDotsPlane() {
		_classCallCheck(this, BatchDotsPlane);

		var positions = [];
		var indices = [];
		var index = 0;
		var size = 100;
		var i = void 0,
		    j = void 0;

		for (i = -size; i < size; i += 1) {
			for (j = -size; j < size; j += 1) {
				positions.push([i, j, 0]);
				indices.push(index);
				index++;

				positions.push([i, 0, j]);
				indices.push(index);
				index++;
			}
		}

		var geometry = new _Geometry2.default(_GLTool2.default.POINTS);
		geometry.bufferVertex(positions);
		geometry.bufferIndex(indices);

		var shader = new _GLShader2.default(vs, fs);

		var _this = _possibleConstructorReturn(this, (BatchDotsPlane.__proto__ || Object.getPrototypeOf(BatchDotsPlane)).call(this, geometry, shader));

		_this.color = [1, 1, 1];
		_this.opacity = 0.5;
		return _this;
	}

	_createClass(BatchDotsPlane, [{
		key: 'draw',
		value: function draw() {
			this.shader.bind();
			this.shader.uniform('color', 'uniform3fv', this.color);
			this.shader.uniform('opacity', 'uniform1f', this.opacity);
			_get(BatchDotsPlane.prototype.__proto__ || Object.getPrototypeOf(BatchDotsPlane.prototype), 'draw', this).call(this);
		}
	}]);

	return BatchDotsPlane;
}(_Batch3.default);

exports.default = BatchDotsPlane;

/***/ }),
/* 97 */
/***/ (function(module, exports) {

module.exports = "// basic.vert\n\n#define SHADER_NAME DOTS_PLANE_VERTEX\n\nprecision highp float;\n#define GLSLIFY 1\nattribute vec3 aVertexPosition;\nattribute vec3 aNormal;\n\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjectionMatrix;\n\nvarying vec3 vNormal;\n\nvoid main(void) {\n    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition + aNormal * 0.000001, 1.0);\n    gl_PointSize = 1.0;\n    vNormal = aNormal;\n}"

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _Geometry = __webpack_require__(3);

var _Geometry2 = _interopRequireDefault(_Geometry);

var _GLShader = __webpack_require__(1);

var _GLShader2 = _interopRequireDefault(_GLShader);

var _Batch2 = __webpack_require__(5);

var _Batch3 = _interopRequireDefault(_Batch2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // BatchLine.js


var vs = __webpack_require__(15);
var fs = __webpack_require__(11);

var BatchAxis = function (_Batch) {
	_inherits(BatchAxis, _Batch);

	function BatchAxis() {
		_classCallCheck(this, BatchAxis);

		var positions = [];
		var indices = [0, 1];
		var coords = [[0, 0], [1, 1]];
		positions.push([0, 0, 0]);
		positions.push([0, 0, 0]);

		var geometry = new _Geometry2.default(_GLTool2.default.LINES);
		geometry.bufferVertex(positions);
		geometry.bufferTexCoord(coords);
		geometry.bufferIndex(indices);

		var shader = new _GLShader2.default(vs, fs);

		return _possibleConstructorReturn(this, (BatchAxis.__proto__ || Object.getPrototypeOf(BatchAxis)).call(this, geometry, shader));
	}

	_createClass(BatchAxis, [{
		key: 'draw',
		value: function draw(mPositionA, mPositionB) {
			var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [1, 1, 1];
			var opacity = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;

			this._geometry.bufferVertex([mPositionA, mPositionB]);

			this._shader.bind();
			this._shader.uniform('color', 'vec3', color);
			this._shader.uniform('opacity', 'float', opacity);
			_get(BatchAxis.prototype.__proto__ || Object.getPrototypeOf(BatchAxis.prototype), 'draw', this).call(this);
		}
	}]);

	return BatchAxis;
}(_Batch3.default);

exports.default = BatchAxis;

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Geom = __webpack_require__(7);

var _Geom2 = _interopRequireDefault(_Geom);

var _GLShader = __webpack_require__(1);

var _GLShader2 = _interopRequireDefault(_GLShader);

var _Batch2 = __webpack_require__(5);

var _Batch3 = _interopRequireDefault(_Batch2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // BatchSkybox.js

var vs = __webpack_require__(38);
var fs = __webpack_require__(39);

var BatchSkybox = function (_Batch) {
	_inherits(BatchSkybox, _Batch);

	function BatchSkybox() {
		var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 20;

		_classCallCheck(this, BatchSkybox);

		var geometry = _Geom2.default.skybox(size);
		var shader = new _GLShader2.default(vs, fs);

		return _possibleConstructorReturn(this, (BatchSkybox.__proto__ || Object.getPrototypeOf(BatchSkybox)).call(this, geometry, shader));
	}

	_createClass(BatchSkybox, [{
		key: 'draw',
		value: function draw(texture) {
			this.shader.bind();
			texture.bind(0);
			_get(BatchSkybox.prototype.__proto__ || Object.getPrototypeOf(BatchSkybox.prototype), 'draw', this).call(this);
		}
	}]);

	return BatchSkybox;
}(_Batch3.default);

exports.default = BatchSkybox;

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Geom = __webpack_require__(7);

var _Geom2 = _interopRequireDefault(_Geom);

var _GLShader = __webpack_require__(1);

var _GLShader2 = _interopRequireDefault(_GLShader);

var _Batch2 = __webpack_require__(5);

var _Batch3 = _interopRequireDefault(_Batch2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // BatchSky.js

var vs = __webpack_require__(101);
var fs = __webpack_require__(23);

var BatchSky = function (_Batch) {
	_inherits(BatchSky, _Batch);

	function BatchSky() {
		var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 50;
		var seg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 24;

		_classCallCheck(this, BatchSky);

		var geometry = _Geom2.default.sphere(size, seg, true);
		var shader = new _GLShader2.default(vs, fs);

		return _possibleConstructorReturn(this, (BatchSky.__proto__ || Object.getPrototypeOf(BatchSky)).call(this, geometry, shader));
	}

	_createClass(BatchSky, [{
		key: 'draw',
		value: function draw(texture) {
			this.shader.bind();
			texture.bind(0);
			_get(BatchSky.prototype.__proto__ || Object.getPrototypeOf(BatchSky.prototype), 'draw', this).call(this);
		}
	}]);

	return BatchSky;
}(_Batch3.default);

exports.default = BatchSky;

/***/ }),
/* 101 */
/***/ (function(module, exports) {

module.exports = "// sky.vert\n\nprecision highp float;\n#define GLSLIFY 1\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec3 aNormal;\n\nuniform mat4 uModelMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjectionMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vNormal;\n\nvoid main(void) {\n\tmat4 matView = uViewMatrix;\n\tmatView[3][0] = 0.0;\n\tmatView[3][1] = 0.0;\n\tmatView[3][2] = 0.0;\n\t\n    gl_Position = uProjectionMatrix * matView * uModelMatrix * vec4(aVertexPosition, 1.0);\n    vTextureCoord = aTextureCoord;\n    vNormal = aNormal;\n}"

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _Geom = __webpack_require__(7);

var _Geom2 = _interopRequireDefault(_Geom);

var _GLShader = __webpack_require__(1);

var _GLShader2 = _interopRequireDefault(_GLShader);

var _Batch2 = __webpack_require__(5);

var _Batch3 = _interopRequireDefault(_Batch2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // BatchFXAA.js


var vs = __webpack_require__(22);
var fs = __webpack_require__(47);

var BatchFXAA = function (_Batch) {
	_inherits(BatchFXAA, _Batch);

	function BatchFXAA() {
		_classCallCheck(this, BatchFXAA);

		var geometry = _Geom2.default.bigTriangle();
		var shader = new _GLShader2.default(vs, fs);

		var _this = _possibleConstructorReturn(this, (BatchFXAA.__proto__ || Object.getPrototypeOf(BatchFXAA)).call(this, geometry, shader));

		shader.bind();
		shader.uniform('texture', 'uniform1i', 0);
		return _this;
	}

	_createClass(BatchFXAA, [{
		key: 'draw',
		value: function draw(texture) {
			this.shader.bind();
			texture.bind(0);
			this.shader.uniform('uResolution', 'vec2', [1 / _GLTool2.default.width, 1 / _GLTool2.default.height]);
			_get(BatchFXAA.prototype.__proto__ || Object.getPrototypeOf(BatchFXAA.prototype), 'draw', this).call(this);
		}
	}]);

	return BatchFXAA;
}(_Batch3.default);

exports.default = BatchFXAA;

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Scene.js

var _scheduling = __webpack_require__(6);

var _scheduling2 = _interopRequireDefault(_scheduling);

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

var _CameraPerspective = __webpack_require__(25);

var _CameraPerspective2 = _interopRequireDefault(_CameraPerspective);

var _CameraOrtho = __webpack_require__(40);

var _CameraOrtho2 = _interopRequireDefault(_CameraOrtho);

var _OrbitalControl = __webpack_require__(36);

var _OrbitalControl2 = _interopRequireDefault(_OrbitalControl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scene = function () {
	function Scene() {
		var _this = this;

		_classCallCheck(this, Scene);

		this._children = [];
		this._matrixIdentity = mat4.create();
		_GLTool2.default.enableAlphaBlending();

		this._init();
		this._initTextures();
		this._initViews();

		this._efIndex = _scheduling2.default.addEF(function () {
			return _this._loop();
		});
		window.addEventListener('resize', function () {
			return _this.resize();
		});
	}

	//	PUBLIC METHODS

	_createClass(Scene, [{
		key: 'update',
		value: function update() {}
	}, {
		key: 'render',
		value: function render() {}
	}, {
		key: 'stop',
		value: function stop() {
			if (this._efIndex === -1) {
				return;
			}
			this._efIndex = _scheduling2.default.removeEF(this._efIndex);
		}
	}, {
		key: 'start',
		value: function start() {
			var _this2 = this;

			if (this._efIndex !== -1) {
				return;
			}

			this._efIndex = _scheduling2.default.addEF(function () {
				return _this2._loop();
			});
		}
	}, {
		key: 'resize',
		value: function resize() {
			_GLTool2.default.setSize(window.innerWidth, window.innerHeight);
			this.camera.setAspectRatio(_GLTool2.default.aspectRatio);
		}
	}, {
		key: 'addChild',
		value: function addChild(mChild) {
			this._children.push(mChild);
		}
	}, {
		key: 'removeChild',
		value: function removeChild(mChild) {
			var index = this._children.indexOf(mChild);
			if (index == -1) {
				console.warn('Child no exist');return;
			}

			this._children.splice(index, 1);
		}

		//	PROTECTED METHODS TO BE OVERRIDEN BY CHILDREN

	}, {
		key: '_initTextures',
		value: function _initTextures() {}
	}, {
		key: '_initViews',
		value: function _initViews() {}
	}, {
		key: '_renderChildren',
		value: function _renderChildren() {
			var child = void 0;
			for (var i = 0; i < this._children.length; i++) {
				child = this._children[i];
				child.toRender();
			}

			_GLTool2.default.rotate(this._matrixIdentity);
		}

		//	PRIVATE METHODS

	}, {
		key: '_init',
		value: function _init() {
			this.camera = new _CameraPerspective2.default();
			this.camera.setPerspective(45 * Math.PI / 180, _GLTool2.default.aspectRatio, 0.1, 100);
			this.orbitalControl = new _OrbitalControl2.default(this.camera, window, 15);
			this.orbitalControl.radius.value = 10;

			this.cameraOrtho = new _CameraOrtho2.default();
		}
	}, {
		key: '_loop',
		value: function _loop() {

			//	RESET VIEWPORT
			_GLTool2.default.viewport(0, 0, _GLTool2.default.width, _GLTool2.default.height);

			//	RESET CAMERA
			_GLTool2.default.setMatrices(this.camera);

			this.update();
			this._renderChildren();
			this.render();
		}
	}]);

	return Scene;
}();

exports.default = Scene;

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // View.js

var _GLShader = __webpack_require__(1);

var _GLShader2 = _interopRequireDefault(_GLShader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var View = function () {
	function View(mStrVertex, mStrFrag) {
		_classCallCheck(this, View);

		this.shader = new _GLShader2.default(mStrVertex, mStrFrag);

		this._init();
	}

	//	PROTECTED METHODS

	_createClass(View, [{
		key: '_init',
		value: function _init() {}

		// 	PUBLIC METHODS

	}, {
		key: 'render',
		value: function render() {}
	}]);

	return View;
}();

exports.default = View;

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Object3D2 = __webpack_require__(8);

var _Object3D3 = _interopRequireDefault(_Object3D2);

var _GLShader = __webpack_require__(1);

var _GLShader2 = _interopRequireDefault(_GLShader);

var _GLTool = __webpack_require__(0);

var _GLTool2 = _interopRequireDefault(_GLTool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // View3D.js

var View3D = function (_Object3D) {
	_inherits(View3D, _Object3D);

	function View3D(mStrVertex, mStrFrag) {
		_classCallCheck(this, View3D);

		var _this = _possibleConstructorReturn(this, (View3D.__proto__ || Object.getPrototypeOf(View3D)).call(this));

		_this._children = [];
		_this.shader = new _GLShader2.default(mStrVertex, mStrFrag);
		_this._init();
		_this._matrixTemp = mat4.create();
		return _this;
	}

	//	PROTECTED METHODS

	_createClass(View3D, [{
		key: '_init',
		value: function _init() {}

		// 	PUBLIC METHODS

	}, {
		key: 'addChild',
		value: function addChild(mChild) {
			this._children.push(mChild);
		}
	}, {
		key: 'removeChild',
		value: function removeChild(mChild) {
			var index = this._children.indexOf(mChild);
			if (index == -1) {
				console.warn('Child no exist');return;
			}

			this._children.splice(index, 1);
		}
	}, {
		key: 'toRender',
		value: function toRender(matrix) {
			if (matrix === undefined) {
				matrix = mat4.create();
			}
			mat4.mul(this._matrixTemp, matrix, this.matrix);
			_GLTool2.default.rotate(this._matrixTemp);
			this.render();

			for (var i = 0; i < this._children.length; i++) {
				var child = this._children[i];
				child.toRender(this.matrix);
			}
		}
	}, {
		key: 'render',
		value: function render() {}
	}]);

	return View3D;
}(_Object3D3.default);

exports.default = View3D;

/***/ }),
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _datGui = __webpack_require__(133);

var _datGui2 = _interopRequireDefault(_datGui);

var _stats = __webpack_require__(136);

var _stats2 = _interopRequireDefault(_stats);

var _alfrid = __webpack_require__(28);

var _alfrid2 = _interopRequireDefault(_alfrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//	INIT DAT-GUI
window.gui = new _datGui2.default.GUI({ width: 300 }); // debug.js

var div = document.body.querySelector('.dg.ac');
div.style.zIndex = '999';

//	STATS
var stats = new _stats2.default();
document.body.appendChild(stats.domElement);
_alfrid2.default.Scheduler.addEF(function () {
  return stats.update();
});

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(134)
module.exports.color = __webpack_require__(135)

/***/ }),
/* 134 */
/***/ (function(module, exports) {

/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

/** @namespace */
var dat = module.exports = dat || {};

/** @namespace */
dat.gui = dat.gui || {};

/** @namespace */
dat.utils = dat.utils || {};

/** @namespace */
dat.controllers = dat.controllers || {};

/** @namespace */
dat.dom = dat.dom || {};

/** @namespace */
dat.color = dat.color || {};

dat.utils.css = (function () {
  return {
    load: function (url, doc) {
      doc = doc || document;
      var link = doc.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = url;
      doc.getElementsByTagName('head')[0].appendChild(link);
    },
    inject: function(css, doc) {
      doc = doc || document;
      var injected = document.createElement('style');
      injected.type = 'text/css';
      injected.innerHTML = css;
      doc.getElementsByTagName('head')[0].appendChild(injected);
    }
  }
})();


dat.utils.common = (function () {
  
  var ARR_EACH = Array.prototype.forEach;
  var ARR_SLICE = Array.prototype.slice;

  /**
   * Band-aid methods for things that should be a lot easier in JavaScript.
   * Implementation and structure inspired by underscore.js
   * http://documentcloud.github.com/underscore/
   */

  return { 
    
    BREAK: {},
  
    extend: function(target) {
      
      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
        
        for (var key in obj)
          if (!this.isUndefined(obj[key])) 
            target[key] = obj[key];
        
      }, this);
      
      return target;
      
    },
    
    defaults: function(target) {
      
      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
        
        for (var key in obj)
          if (this.isUndefined(target[key])) 
            target[key] = obj[key];
        
      }, this);
      
      return target;
    
    },
    
    compose: function() {
      var toCall = ARR_SLICE.call(arguments);
            return function() {
              var args = ARR_SLICE.call(arguments);
              for (var i = toCall.length -1; i >= 0; i--) {
                args = [toCall[i].apply(this, args)];
              }
              return args[0];
            }
    },
    
    each: function(obj, itr, scope) {

      
      if (ARR_EACH && obj.forEach === ARR_EACH) { 
        
        obj.forEach(itr, scope);
        
      } else if (obj.length === obj.length + 0) { // Is number but not NaN
        
        for (var key = 0, l = obj.length; key < l; key++)
          if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) 
            return;
            
      } else {

        for (var key in obj) 
          if (itr.call(scope, obj[key], key) === this.BREAK)
            return;
            
      }
            
    },
    
    defer: function(fnc) {
      setTimeout(fnc, 0);
    },
    
    toArray: function(obj) {
      if (obj.toArray) return obj.toArray();
      return ARR_SLICE.call(obj);
    },

    isUndefined: function(obj) {
      return obj === undefined;
    },
    
    isNull: function(obj) {
      return obj === null;
    },
    
    isNaN: function(obj) {
      return obj !== obj;
    },
    
    isArray: Array.isArray || function(obj) {
      return obj.constructor === Array;
    },
    
    isObject: function(obj) {
      return obj === Object(obj);
    },
    
    isNumber: function(obj) {
      return obj === obj+0;
    },
    
    isString: function(obj) {
      return obj === obj+'';
    },
    
    isBoolean: function(obj) {
      return obj === false || obj === true;
    },
    
    isFunction: function(obj) {
      return Object.prototype.toString.call(obj) === '[object Function]';
    }
  
  };
    
})();


dat.controllers.Controller = (function (common) {

  /**
   * @class An "abstract" class that represents a given property of an object.
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   *
   * @member dat.controllers
   */
  var Controller = function(object, property) {

    this.initialValue = object[property];

    /**
     * Those who extend this class will put their DOM elements in here.
     * @type {DOMElement}
     */
    this.domElement = document.createElement('div');

    /**
     * The object to manipulate
     * @type {Object}
     */
    this.object = object;

    /**
     * The name of the property to manipulate
     * @type {String}
     */
    this.property = property;

    /**
     * The function to be called on change.
     * @type {Function}
     * @ignore
     */
    this.__onChange = undefined;

    /**
     * The function to be called on finishing change.
     * @type {Function}
     * @ignore
     */
    this.__onFinishChange = undefined;

  };

  common.extend(

      Controller.prototype,

      /** @lends dat.controllers.Controller.prototype */
      {

        /**
         * Specify that a function fire every time someone changes the value with
         * this Controller.
         *
         * @param {Function} fnc This function will be called whenever the value
         * is modified via this Controller.
         * @returns {dat.controllers.Controller} this
         */
        onChange: function(fnc) {
          this.__onChange = fnc;
          return this;
        },

        /**
         * Specify that a function fire every time someone "finishes" changing
         * the value wih this Controller. Useful for values that change
         * incrementally like numbers or strings.
         *
         * @param {Function} fnc This function will be called whenever
         * someone "finishes" changing the value via this Controller.
         * @returns {dat.controllers.Controller} this
         */
        onFinishChange: function(fnc) {
          this.__onFinishChange = fnc;
          return this;
        },

        /**
         * Change the value of <code>object[property]</code>
         *
         * @param {Object} newValue The new value of <code>object[property]</code>
         */
        setValue: function(newValue) {
          this.object[this.property] = newValue;
          if (this.__onChange) {
            this.__onChange.call(this, newValue);
          }
          this.updateDisplay();
          return this;
        },

        /**
         * Gets the value of <code>object[property]</code>
         *
         * @returns {Object} The current value of <code>object[property]</code>
         */
        getValue: function() {
          return this.object[this.property];
        },

        /**
         * Refreshes the visual display of a Controller in order to keep sync
         * with the object's current value.
         * @returns {dat.controllers.Controller} this
         */
        updateDisplay: function() {
          return this;
        },

        /**
         * @returns {Boolean} true if the value has deviated from initialValue
         */
        isModified: function() {
          return this.initialValue !== this.getValue()
        }

      }

  );

  return Controller;


})(dat.utils.common);


dat.dom.dom = (function (common) {

  var EVENT_MAP = {
    'HTMLEvents': ['change'],
    'MouseEvents': ['click','mousemove','mousedown','mouseup', 'mouseover'],
    'KeyboardEvents': ['keydown']
  };

  var EVENT_MAP_INV = {};
  common.each(EVENT_MAP, function(v, k) {
    common.each(v, function(e) {
      EVENT_MAP_INV[e] = k;
    });
  });

  var CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;

  function cssValueToPixels(val) {

    if (val === '0' || common.isUndefined(val)) return 0;

    var match = val.match(CSS_VALUE_PIXELS);

    if (!common.isNull(match)) {
      return parseFloat(match[1]);
    }

    // TODO ...ems? %?

    return 0;

  }

  /**
   * @namespace
   * @member dat.dom
   */
  var dom = {

    /**
     * 
     * @param elem
     * @param selectable
     */
    makeSelectable: function(elem, selectable) {

      if (elem === undefined || elem.style === undefined) return;

      elem.onselectstart = selectable ? function() {
        return false;
      } : function() {
      };

      elem.style.MozUserSelect = selectable ? 'auto' : 'none';
      elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
      elem.unselectable = selectable ? 'on' : 'off';

    },

    /**
     *
     * @param elem
     * @param horizontal
     * @param vertical
     */
    makeFullscreen: function(elem, horizontal, vertical) {

      if (common.isUndefined(horizontal)) horizontal = true;
      if (common.isUndefined(vertical)) vertical = true;

      elem.style.position = 'absolute';

      if (horizontal) {
        elem.style.left = 0;
        elem.style.right = 0;
      }
      if (vertical) {
        elem.style.top = 0;
        elem.style.bottom = 0;
      }

    },

    /**
     *
     * @param elem
     * @param eventType
     * @param params
     */
    fakeEvent: function(elem, eventType, params, aux) {
      params = params || {};
      var className = EVENT_MAP_INV[eventType];
      if (!className) {
        throw new Error('Event type ' + eventType + ' not supported.');
      }
      var evt = document.createEvent(className);
      switch (className) {
        case 'MouseEvents':
          var clientX = params.x || params.clientX || 0;
          var clientY = params.y || params.clientY || 0;
          evt.initMouseEvent(eventType, params.bubbles || false,
              params.cancelable || true, window, params.clickCount || 1,
              0, //screen X
              0, //screen Y
              clientX, //client X
              clientY, //client Y
              false, false, false, false, 0, null);
          break;
        case 'KeyboardEvents':
          var init = evt.initKeyboardEvent || evt.initKeyEvent; // webkit || moz
          common.defaults(params, {
            cancelable: true,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            keyCode: undefined,
            charCode: undefined
          });
          init(eventType, params.bubbles || false,
              params.cancelable, window,
              params.ctrlKey, params.altKey,
              params.shiftKey, params.metaKey,
              params.keyCode, params.charCode);
          break;
        default:
          evt.initEvent(eventType, params.bubbles || false,
              params.cancelable || true);
          break;
      }
      common.defaults(evt, aux);
      elem.dispatchEvent(evt);
    },

    /**
     *
     * @param elem
     * @param event
     * @param func
     * @param bool
     */
    bind: function(elem, event, func, bool) {
      bool = bool || false;
      if (elem.addEventListener)
        elem.addEventListener(event, func, bool);
      else if (elem.attachEvent)
        elem.attachEvent('on' + event, func);
      return dom;
    },

    /**
     *
     * @param elem
     * @param event
     * @param func
     * @param bool
     */
    unbind: function(elem, event, func, bool) {
      bool = bool || false;
      if (elem.removeEventListener)
        elem.removeEventListener(event, func, bool);
      else if (elem.detachEvent)
        elem.detachEvent('on' + event, func);
      return dom;
    },

    /**
     *
     * @param elem
     * @param className
     */
    addClass: function(elem, className) {
      if (elem.className === undefined) {
        elem.className = className;
      } else if (elem.className !== className) {
        var classes = elem.className.split(/ +/);
        if (classes.indexOf(className) == -1) {
          classes.push(className);
          elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
        }
      }
      return dom;
    },

    /**
     *
     * @param elem
     * @param className
     */
    removeClass: function(elem, className) {
      if (className) {
        if (elem.className === undefined) {
          // elem.className = className;
        } else if (elem.className === className) {
          elem.removeAttribute('class');
        } else {
          var classes = elem.className.split(/ +/);
          var index = classes.indexOf(className);
          if (index != -1) {
            classes.splice(index, 1);
            elem.className = classes.join(' ');
          }
        }
      } else {
        elem.className = undefined;
      }
      return dom;
    },

    hasClass: function(elem, className) {
      return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(elem.className) || false;
    },

    /**
     *
     * @param elem
     */
    getWidth: function(elem) {

      var style = getComputedStyle(elem);

      return cssValueToPixels(style['border-left-width']) +
          cssValueToPixels(style['border-right-width']) +
          cssValueToPixels(style['padding-left']) +
          cssValueToPixels(style['padding-right']) +
          cssValueToPixels(style['width']);
    },

    /**
     *
     * @param elem
     */
    getHeight: function(elem) {

      var style = getComputedStyle(elem);

      return cssValueToPixels(style['border-top-width']) +
          cssValueToPixels(style['border-bottom-width']) +
          cssValueToPixels(style['padding-top']) +
          cssValueToPixels(style['padding-bottom']) +
          cssValueToPixels(style['height']);
    },

    /**
     *
     * @param elem
     */
    getOffset: function(elem) {
      var offset = {left: 0, top:0};
      if (elem.offsetParent) {
        do {
          offset.left += elem.offsetLeft;
          offset.top += elem.offsetTop;
        } while (elem = elem.offsetParent);
      }
      return offset;
    },

    // http://stackoverflow.com/posts/2684561/revisions
    /**
     * 
     * @param elem
     */
    isActive: function(elem) {
      return elem === document.activeElement && ( elem.type || elem.href );
    }

  };

  return dom;

})(dat.utils.common);


dat.controllers.OptionController = (function (Controller, dom, common) {

  /**
   * @class Provides a select input to alter the property of an object, using a
   * list of accepted values.
   *
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   * @param {Object|string[]} options A map of labels to acceptable values, or
   * a list of acceptable string values.
   *
   * @member dat.controllers
   */
  var OptionController = function(object, property, options) {

    OptionController.superclass.call(this, object, property);

    var _this = this;

    /**
     * The drop down menu
     * @ignore
     */
    this.__select = document.createElement('select');

    if (common.isArray(options)) {
      var map = {};
      common.each(options, function(element) {
        map[element] = element;
      });
      options = map;
    }

    common.each(options, function(value, key) {

      var opt = document.createElement('option');
      opt.innerHTML = key;
      opt.setAttribute('value', value);
      _this.__select.appendChild(opt);

    });

    // Acknowledge original value
    this.updateDisplay();

    dom.bind(this.__select, 'change', function() {
      var desiredValue = this.options[this.selectedIndex].value;
      _this.setValue(desiredValue);
    });

    this.domElement.appendChild(this.__select);

  };

  OptionController.superclass = Controller;

  common.extend(

      OptionController.prototype,
      Controller.prototype,

      {

        setValue: function(v) {
          var toReturn = OptionController.superclass.prototype.setValue.call(this, v);
          if (this.__onFinishChange) {
            this.__onFinishChange.call(this, this.getValue());
          }
          return toReturn;
        },

        updateDisplay: function() {
          this.__select.value = this.getValue();
          return OptionController.superclass.prototype.updateDisplay.call(this);
        }

      }

  );

  return OptionController;

})(dat.controllers.Controller,
dat.dom.dom,
dat.utils.common);


dat.controllers.NumberController = (function (Controller, common) {

  /**
   * @class Represents a given property of an object that is a number.
   *
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   * @param {Object} [params] Optional parameters
   * @param {Number} [params.min] Minimum allowed value
   * @param {Number} [params.max] Maximum allowed value
   * @param {Number} [params.step] Increment by which to change value
   *
   * @member dat.controllers
   */
  var NumberController = function(object, property, params) {

    NumberController.superclass.call(this, object, property);

    params = params || {};

    this.__min = params.min;
    this.__max = params.max;
    this.__step = params.step;

    if (common.isUndefined(this.__step)) {

      if (this.initialValue == 0) {
        this.__impliedStep = 1; // What are we, psychics?
      } else {
        // Hey Doug, check this out.
        this.__impliedStep = Math.pow(10, Math.floor(Math.log(this.initialValue)/Math.LN10))/10;
      }

    } else {

      this.__impliedStep = this.__step;

    }

    this.__precision = numDecimals(this.__impliedStep);


  };

  NumberController.superclass = Controller;

  common.extend(

      NumberController.prototype,
      Controller.prototype,

      /** @lends dat.controllers.NumberController.prototype */
      {

        setValue: function(v) {

          if (this.__min !== undefined && v < this.__min) {
            v = this.__min;
          } else if (this.__max !== undefined && v > this.__max) {
            v = this.__max;
          }

          if (this.__step !== undefined && v % this.__step != 0) {
            v = Math.round(v / this.__step) * this.__step;
          }

          return NumberController.superclass.prototype.setValue.call(this, v);

        },

        /**
         * Specify a minimum value for <code>object[property]</code>.
         *
         * @param {Number} minValue The minimum value for
         * <code>object[property]</code>
         * @returns {dat.controllers.NumberController} this
         */
        min: function(v) {
          this.__min = v;
          return this;
        },

        /**
         * Specify a maximum value for <code>object[property]</code>.
         *
         * @param {Number} maxValue The maximum value for
         * <code>object[property]</code>
         * @returns {dat.controllers.NumberController} this
         */
        max: function(v) {
          this.__max = v;
          return this;
        },

        /**
         * Specify a step value that dat.controllers.NumberController
         * increments by.
         *
         * @param {Number} stepValue The step value for
         * dat.controllers.NumberController
         * @default if minimum and maximum specified increment is 1% of the
         * difference otherwise stepValue is 1
         * @returns {dat.controllers.NumberController} this
         */
        step: function(v) {
          this.__step = v;
          return this;
        }

      }

  );

  function numDecimals(x) {
    x = x.toString();
    if (x.indexOf('.') > -1) {
      return x.length - x.indexOf('.') - 1;
    } else {
      return 0;
    }
  }

  return NumberController;

})(dat.controllers.Controller,
dat.utils.common);


dat.controllers.NumberControllerBox = (function (NumberController, dom, common) {

  /**
   * @class Represents a given property of an object that is a number and
   * provides an input element with which to manipulate it.
   *
   * @extends dat.controllers.Controller
   * @extends dat.controllers.NumberController
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   * @param {Object} [params] Optional parameters
   * @param {Number} [params.min] Minimum allowed value
   * @param {Number} [params.max] Maximum allowed value
   * @param {Number} [params.step] Increment by which to change value
   *
   * @member dat.controllers
   */
  var NumberControllerBox = function(object, property, params) {

    this.__truncationSuspended = false;

    NumberControllerBox.superclass.call(this, object, property, params);

    var _this = this;

    /**
     * {Number} Previous mouse y position
     * @ignore
     */
    var prev_y;

    this.__input = document.createElement('input');
    this.__input.setAttribute('type', 'text');

    // Makes it so manually specified values are not truncated.

    dom.bind(this.__input, 'change', onChange);
    dom.bind(this.__input, 'blur', onBlur);
    dom.bind(this.__input, 'mousedown', onMouseDown);
    dom.bind(this.__input, 'keydown', function(e) {

      // When pressing entire, you can be as precise as you want.
      if (e.keyCode === 13) {
        _this.__truncationSuspended = true;
        this.blur();
        _this.__truncationSuspended = false;
      }

    });

    function onChange() {
      var attempted = parseFloat(_this.__input.value);
      if (!common.isNaN(attempted)) _this.setValue(attempted);
    }

    function onBlur() {
      onChange();
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    function onMouseDown(e) {
      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);
      prev_y = e.clientY;
    }

    function onMouseDrag(e) {

      var diff = prev_y - e.clientY;
      _this.setValue(_this.getValue() + diff * _this.__impliedStep);

      prev_y = e.clientY;

    }

    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
    }

    this.updateDisplay();

    this.domElement.appendChild(this.__input);

  };

  NumberControllerBox.superclass = NumberController;

  common.extend(

      NumberControllerBox.prototype,
      NumberController.prototype,

      {

        updateDisplay: function() {

          this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision);
          return NumberControllerBox.superclass.prototype.updateDisplay.call(this);
        }

      }

  );

  function roundToDecimal(value, decimals) {
    var tenTo = Math.pow(10, decimals);
    return Math.round(value * tenTo) / tenTo;
  }

  return NumberControllerBox;

})(dat.controllers.NumberController,
dat.dom.dom,
dat.utils.common);


dat.controllers.NumberControllerSlider = (function (NumberController, dom, css, common, styleSheet) {

  /**
   * @class Represents a given property of an object that is a number, contains
   * a minimum and maximum, and provides a slider element with which to
   * manipulate it. It should be noted that the slider element is made up of
   * <code>&lt;div&gt;</code> tags, <strong>not</strong> the html5
   * <code>&lt;slider&gt;</code> element.
   *
   * @extends dat.controllers.Controller
   * @extends dat.controllers.NumberController
   * 
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   * @param {Number} minValue Minimum allowed value
   * @param {Number} maxValue Maximum allowed value
   * @param {Number} stepValue Increment by which to change value
   *
   * @member dat.controllers
   */
  var NumberControllerSlider = function(object, property, min, max, step) {

    NumberControllerSlider.superclass.call(this, object, property, { min: min, max: max, step: step });

    var _this = this;

    this.__background = document.createElement('div');
    this.__foreground = document.createElement('div');
    


    dom.bind(this.__background, 'mousedown', onMouseDown);
    
    dom.addClass(this.__background, 'slider');
    dom.addClass(this.__foreground, 'slider-fg');

    function onMouseDown(e) {

      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);

      onMouseDrag(e);
    }

    function onMouseDrag(e) {

      e.preventDefault();

      var offset = dom.getOffset(_this.__background);
      var width = dom.getWidth(_this.__background);
      
      _this.setValue(
        map(e.clientX, offset.left, offset.left + width, _this.__min, _this.__max)
      );

      return false;

    }

    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    this.updateDisplay();

    this.__background.appendChild(this.__foreground);
    this.domElement.appendChild(this.__background);

  };

  NumberControllerSlider.superclass = NumberController;

  /**
   * Injects default stylesheet for slider elements.
   */
  NumberControllerSlider.useDefaultStyles = function() {
    css.inject(styleSheet);
  };

  common.extend(

      NumberControllerSlider.prototype,
      NumberController.prototype,

      {

        updateDisplay: function() {
          var pct = (this.getValue() - this.__min)/(this.__max - this.__min);
          this.__foreground.style.width = pct*100+'%';
          return NumberControllerSlider.superclass.prototype.updateDisplay.call(this);
        }

      }



  );

  function map(v, i1, i2, o1, o2) {
    return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
  }

  return NumberControllerSlider;
  
})(dat.controllers.NumberController,
dat.dom.dom,
dat.utils.css,
dat.utils.common,
".slider {\n  box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);\n  height: 1em;\n  border-radius: 1em;\n  background-color: #eee;\n  padding: 0 0.5em;\n  overflow: hidden;\n}\n\n.slider-fg {\n  padding: 1px 0 2px 0;\n  background-color: #aaa;\n  height: 1em;\n  margin-left: -0.5em;\n  padding-right: 0.5em;\n  border-radius: 1em 0 0 1em;\n}\n\n.slider-fg:after {\n  display: inline-block;\n  border-radius: 1em;\n  background-color: #fff;\n  border:  1px solid #aaa;\n  content: '';\n  float: right;\n  margin-right: -1em;\n  margin-top: -1px;\n  height: 0.9em;\n  width: 0.9em;\n}");


dat.controllers.FunctionController = (function (Controller, dom, common) {

  /**
   * @class Provides a GUI interface to fire a specified method, a property of an object.
   *
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   *
   * @member dat.controllers
   */
  var FunctionController = function(object, property, text) {

    FunctionController.superclass.call(this, object, property);

    var _this = this;

    this.__button = document.createElement('div');
    this.__button.innerHTML = text === undefined ? 'Fire' : text;
    dom.bind(this.__button, 'click', function(e) {
      e.preventDefault();
      _this.fire();
      return false;
    });

    dom.addClass(this.__button, 'button');

    this.domElement.appendChild(this.__button);


  };

  FunctionController.superclass = Controller;

  common.extend(

      FunctionController.prototype,
      Controller.prototype,
      {
        
        fire: function() {
          if (this.__onChange) {
            this.__onChange.call(this);
          }
          if (this.__onFinishChange) {
            this.__onFinishChange.call(this, this.getValue());
          }
          this.getValue().call(this.object);
        }
      }

  );

  return FunctionController;

})(dat.controllers.Controller,
dat.dom.dom,
dat.utils.common);


dat.controllers.BooleanController = (function (Controller, dom, common) {

  /**
   * @class Provides a checkbox input to alter the boolean property of an object.
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   *
   * @member dat.controllers
   */
  var BooleanController = function(object, property) {

    BooleanController.superclass.call(this, object, property);

    var _this = this;
    this.__prev = this.getValue();

    this.__checkbox = document.createElement('input');
    this.__checkbox.setAttribute('type', 'checkbox');


    dom.bind(this.__checkbox, 'change', onChange, false);

    this.domElement.appendChild(this.__checkbox);

    // Match original value
    this.updateDisplay();

    function onChange() {
      _this.setValue(!_this.__prev);
    }

  };

  BooleanController.superclass = Controller;

  common.extend(

      BooleanController.prototype,
      Controller.prototype,

      {

        setValue: function(v) {
          var toReturn = BooleanController.superclass.prototype.setValue.call(this, v);
          if (this.__onFinishChange) {
            this.__onFinishChange.call(this, this.getValue());
          }
          this.__prev = this.getValue();
          return toReturn;
        },

        updateDisplay: function() {
          
          if (this.getValue() === true) {
            this.__checkbox.setAttribute('checked', 'checked');
            this.__checkbox.checked = true;    
          } else {
              this.__checkbox.checked = false;
          }

          return BooleanController.superclass.prototype.updateDisplay.call(this);

        }


      }

  );

  return BooleanController;

})(dat.controllers.Controller,
dat.dom.dom,
dat.utils.common);


dat.color.toString = (function (common) {

  return function(color) {

    if (color.a == 1 || common.isUndefined(color.a)) {

      var s = color.hex.toString(16);
      while (s.length < 6) {
        s = '0' + s;
      }

      return '#' + s;

    } else {

      return 'rgba(' + Math.round(color.r) + ',' + Math.round(color.g) + ',' + Math.round(color.b) + ',' + color.a + ')';

    }

  }

})(dat.utils.common);


dat.color.interpret = (function (toString, common) {

  var result, toReturn;

  var interpret = function() {

    toReturn = false;

    var original = arguments.length > 1 ? common.toArray(arguments) : arguments[0];

    common.each(INTERPRETATIONS, function(family) {

      if (family.litmus(original)) {

        common.each(family.conversions, function(conversion, conversionName) {

          result = conversion.read(original);

          if (toReturn === false && result !== false) {
            toReturn = result;
            result.conversionName = conversionName;
            result.conversion = conversion;
            return common.BREAK;

          }

        });

        return common.BREAK;

      }

    });

    return toReturn;

  };

  var INTERPRETATIONS = [

    // Strings
    {

      litmus: common.isString,

      conversions: {

        THREE_CHAR_HEX: {

          read: function(original) {

            var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
            if (test === null) return false;

            return {
              space: 'HEX',
              hex: parseInt(
                  '0x' +
                      test[1].toString() + test[1].toString() +
                      test[2].toString() + test[2].toString() +
                      test[3].toString() + test[3].toString())
            };

          },

          write: toString

        },

        SIX_CHAR_HEX: {

          read: function(original) {

            var test = original.match(/^#([A-F0-9]{6})$/i);
            if (test === null) return false;

            return {
              space: 'HEX',
              hex: parseInt('0x' + test[1].toString())
            };

          },

          write: toString

        },

        CSS_RGB: {

          read: function(original) {

            var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
            if (test === null) return false;

            return {
              space: 'RGB',
              r: parseFloat(test[1]),
              g: parseFloat(test[2]),
              b: parseFloat(test[3])
            };

          },

          write: toString

        },

        CSS_RGBA: {

          read: function(original) {

            var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);
            if (test === null) return false;

            return {
              space: 'RGB',
              r: parseFloat(test[1]),
              g: parseFloat(test[2]),
              b: parseFloat(test[3]),
              a: parseFloat(test[4])
            };

          },

          write: toString

        }

      }

    },

    // Numbers
    {

      litmus: common.isNumber,

      conversions: {

        HEX: {
          read: function(original) {
            return {
              space: 'HEX',
              hex: original,
              conversionName: 'HEX'
            }
          },

          write: function(color) {
            return color.hex;
          }
        }

      }

    },

    // Arrays
    {

      litmus: common.isArray,

      conversions: {

        RGB_ARRAY: {
          read: function(original) {
            if (original.length != 3) return false;
            return {
              space: 'RGB',
              r: original[0],
              g: original[1],
              b: original[2]
            };
          },

          write: function(color) {
            return [color.r, color.g, color.b];
          }

        },

        RGBA_ARRAY: {
          read: function(original) {
            if (original.length != 4) return false;
            return {
              space: 'RGB',
              r: original[0],
              g: original[1],
              b: original[2],
              a: original[3]
            };
          },

          write: function(color) {
            return [color.r, color.g, color.b, color.a];
          }

        }

      }

    },

    // Objects
    {

      litmus: common.isObject,

      conversions: {

        RGBA_OBJ: {
          read: function(original) {
            if (common.isNumber(original.r) &&
                common.isNumber(original.g) &&
                common.isNumber(original.b) &&
                common.isNumber(original.a)) {
              return {
                space: 'RGB',
                r: original.r,
                g: original.g,
                b: original.b,
                a: original.a
              }
            }
            return false;
          },

          write: function(color) {
            return {
              r: color.r,
              g: color.g,
              b: color.b,
              a: color.a
            }
          }
        },

        RGB_OBJ: {
          read: function(original) {
            if (common.isNumber(original.r) &&
                common.isNumber(original.g) &&
                common.isNumber(original.b)) {
              return {
                space: 'RGB',
                r: original.r,
                g: original.g,
                b: original.b
              }
            }
            return false;
          },

          write: function(color) {
            return {
              r: color.r,
              g: color.g,
              b: color.b
            }
          }
        },

        HSVA_OBJ: {
          read: function(original) {
            if (common.isNumber(original.h) &&
                common.isNumber(original.s) &&
                common.isNumber(original.v) &&
                common.isNumber(original.a)) {
              return {
                space: 'HSV',
                h: original.h,
                s: original.s,
                v: original.v,
                a: original.a
              }
            }
            return false;
          },

          write: function(color) {
            return {
              h: color.h,
              s: color.s,
              v: color.v,
              a: color.a
            }
          }
        },

        HSV_OBJ: {
          read: function(original) {
            if (common.isNumber(original.h) &&
                common.isNumber(original.s) &&
                common.isNumber(original.v)) {
              return {
                space: 'HSV',
                h: original.h,
                s: original.s,
                v: original.v
              }
            }
            return false;
          },

          write: function(color) {
            return {
              h: color.h,
              s: color.s,
              v: color.v
            }
          }

        }

      }

    }


  ];

  return interpret;


})(dat.color.toString,
dat.utils.common);


dat.GUI = dat.gui.GUI = (function (css, saveDialogueContents, styleSheet, controllerFactory, Controller, BooleanController, FunctionController, NumberControllerBox, NumberControllerSlider, OptionController, ColorController, requestAnimationFrame, CenteredDiv, dom, common) {

  css.inject(styleSheet);

  /** Outer-most className for GUI's */
  var CSS_NAMESPACE = 'dg';

  var HIDE_KEY_CODE = 72;

  /** The only value shared between the JS and SCSS. Use caution. */
  var CLOSE_BUTTON_HEIGHT = 20;

  var DEFAULT_DEFAULT_PRESET_NAME = 'Default';

  var SUPPORTS_LOCAL_STORAGE = (function() {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  })();

  var SAVE_DIALOGUE;

  /** Have we yet to create an autoPlace GUI? */
  var auto_place_virgin = true;

  /** Fixed position div that auto place GUI's go inside */
  var auto_place_container;

  /** Are we hiding the GUI's ? */
  var hide = false;

  /** GUI's which should be hidden */
  var hideable_guis = [];

  /**
   * A lightweight controller library for JavaScript. It allows you to easily
   * manipulate variables and fire functions on the fly.
   * @class
   *
   * @member dat.gui
   *
   * @param {Object} [params]
   * @param {String} [params.name] The name of this GUI.
   * @param {Object} [params.load] JSON object representing the saved state of
   * this GUI.
   * @param {Boolean} [params.auto=true]
   * @param {dat.gui.GUI} [params.parent] The GUI I'm nested in.
   * @param {Boolean} [params.closed] If true, starts closed
   */
  var GUI = function(params) {

    var _this = this;

    /**
     * Outermost DOM Element
     * @type DOMElement
     */
    this.domElement = document.createElement('div');
    this.__ul = document.createElement('ul');
    this.domElement.appendChild(this.__ul);

    dom.addClass(this.domElement, CSS_NAMESPACE);

    /**
     * Nested GUI's by name
     * @ignore
     */
    this.__folders = {};

    this.__controllers = [];

    /**
     * List of objects I'm remembering for save, only used in top level GUI
     * @ignore
     */
    this.__rememberedObjects = [];

    /**
     * Maps the index of remembered objects to a map of controllers, only used
     * in top level GUI.
     *
     * @private
     * @ignore
     *
     * @example
     * [
     *  {
     *    propertyName: Controller,
     *    anotherPropertyName: Controller
     *  },
     *  {
     *    propertyName: Controller
     *  }
     * ]
     */
    this.__rememberedObjectIndecesToControllers = [];

    this.__listening = [];

    params = params || {};

    // Default parameters
    params = common.defaults(params, {
      autoPlace: true,
      width: GUI.DEFAULT_WIDTH
    });

    params = common.defaults(params, {
      resizable: params.autoPlace,
      hideable: params.autoPlace
    });


    if (!common.isUndefined(params.load)) {

      // Explicit preset
      if (params.preset) params.load.preset = params.preset;

    } else {

      params.load = { preset: DEFAULT_DEFAULT_PRESET_NAME };

    }

    if (common.isUndefined(params.parent) && params.hideable) {
      hideable_guis.push(this);
    }

    // Only root level GUI's are resizable.
    params.resizable = common.isUndefined(params.parent) && params.resizable;


    if (params.autoPlace && common.isUndefined(params.scrollable)) {
      params.scrollable = true;
    }
//    params.scrollable = common.isUndefined(params.parent) && params.scrollable === true;

    // Not part of params because I don't want people passing this in via
    // constructor. Should be a 'remembered' value.
    var use_local_storage =
        SUPPORTS_LOCAL_STORAGE &&
            localStorage.getItem(getLocalStorageHash(this, 'isLocal')) === 'true';

    Object.defineProperties(this,

        /** @lends dat.gui.GUI.prototype */
        {

          /**
           * The parent <code>GUI</code>
           * @type dat.gui.GUI
           */
          parent: {
            get: function() {
              return params.parent;
            }
          },

          scrollable: {
            get: function() {
              return params.scrollable;
            }
          },

          /**
           * Handles <code>GUI</code>'s element placement for you
           * @type Boolean
           */
          autoPlace: {
            get: function() {
              return params.autoPlace;
            }
          },

          /**
           * The identifier for a set of saved values
           * @type String
           */
          preset: {

            get: function() {
              if (_this.parent) {
                return _this.getRoot().preset;
              } else {
                return params.load.preset;
              }
            },

            set: function(v) {
              if (_this.parent) {
                _this.getRoot().preset = v;
              } else {
                params.load.preset = v;
              }
              setPresetSelectIndex(this);
              _this.revert();
            }

          },

          /**
           * The width of <code>GUI</code> element
           * @type Number
           */
          width: {
            get: function() {
              return params.width;
            },
            set: function(v) {
              params.width = v;
              setWidth(_this, v);
            }
          },

          /**
           * The name of <code>GUI</code>. Used for folders. i.e
           * a folder's name
           * @type String
           */
          name: {
            get: function() {
              return params.name;
            },
            set: function(v) {
              // TODO Check for collisions among sibling folders
              params.name = v;
              if (title_row_name) {
                title_row_name.innerHTML = params.name;
              }
            }
          },

          /**
           * Whether the <code>GUI</code> is collapsed or not
           * @type Boolean
           */
          closed: {
            get: function() {
              return params.closed;
            },
            set: function(v) {
              params.closed = v;
              if (params.closed) {
                dom.addClass(_this.__ul, GUI.CLASS_CLOSED);
              } else {
                dom.removeClass(_this.__ul, GUI.CLASS_CLOSED);
              }
              // For browsers that aren't going to respect the CSS transition,
              // Lets just check our height against the window height right off
              // the bat.
              this.onResize();

              if (_this.__closeButton) {
                _this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;
              }
            }
          },

          /**
           * Contains all presets
           * @type Object
           */
          load: {
            get: function() {
              return params.load;
            }
          },

          /**
           * Determines whether or not to use <a href="https://developer.mozilla.org/en/DOM/Storage#localStorage">localStorage</a> as the means for
           * <code>remember</code>ing
           * @type Boolean
           */
          useLocalStorage: {

            get: function() {
              return use_local_storage;
            },
            set: function(bool) {
              if (SUPPORTS_LOCAL_STORAGE) {
                use_local_storage = bool;
                if (bool) {
                  dom.bind(window, 'unload', saveToLocalStorage);
                } else {
                  dom.unbind(window, 'unload', saveToLocalStorage);
                }
                localStorage.setItem(getLocalStorageHash(_this, 'isLocal'), bool);
              }
            }

          }

        });

    // Are we a root level GUI?
    if (common.isUndefined(params.parent)) {

      params.closed = false;

      dom.addClass(this.domElement, GUI.CLASS_MAIN);
      dom.makeSelectable(this.domElement, false);

      // Are we supposed to be loading locally?
      if (SUPPORTS_LOCAL_STORAGE) {

        if (use_local_storage) {

          _this.useLocalStorage = true;

          var saved_gui = localStorage.getItem(getLocalStorageHash(this, 'gui'));

          if (saved_gui) {
            params.load = JSON.parse(saved_gui);
          }

        }

      }

      this.__closeButton = document.createElement('div');
      this.__closeButton.innerHTML = GUI.TEXT_CLOSED;
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);
      this.domElement.appendChild(this.__closeButton);

      dom.bind(this.__closeButton, 'click', function() {

        _this.closed = !_this.closed;


      });


      // Oh, you're a nested GUI!
    } else {

      if (params.closed === undefined) {
        params.closed = true;
      }

      var title_row_name = document.createTextNode(params.name);
      dom.addClass(title_row_name, 'controller-name');

      var title_row = addRow(_this, title_row_name);

      var on_click_title = function(e) {
        e.preventDefault();
        _this.closed = !_this.closed;
        return false;
      };

      dom.addClass(this.__ul, GUI.CLASS_CLOSED);

      dom.addClass(title_row, 'title');
      dom.bind(title_row, 'click', on_click_title);

      if (!params.closed) {
        this.closed = false;
      }

    }

    if (params.autoPlace) {

      if (common.isUndefined(params.parent)) {

        if (auto_place_virgin) {
          auto_place_container = document.createElement('div');
          dom.addClass(auto_place_container, CSS_NAMESPACE);
          dom.addClass(auto_place_container, GUI.CLASS_AUTO_PLACE_CONTAINER);
          document.body.appendChild(auto_place_container);
          auto_place_virgin = false;
        }

        // Put it in the dom for you.
        auto_place_container.appendChild(this.domElement);

        // Apply the auto styles
        dom.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);

      }


      // Make it not elastic.
      if (!this.parent) setWidth(_this, params.width);

    }

    dom.bind(window, 'resize', function() { _this.onResize() });
    dom.bind(this.__ul, 'webkitTransitionEnd', function() { _this.onResize(); });
    dom.bind(this.__ul, 'transitionend', function() { _this.onResize() });
    dom.bind(this.__ul, 'oTransitionEnd', function() { _this.onResize() });
    this.onResize();


    if (params.resizable) {
      addResizeHandle(this);
    }

    function saveToLocalStorage() {
      localStorage.setItem(getLocalStorageHash(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
    }

    var root = _this.getRoot();
    function resetWidth() {
        var root = _this.getRoot();
        root.width += 1;
        common.defer(function() {
          root.width -= 1;
        });
      }

      if (!params.parent) {
        resetWidth();
      }

  };

  GUI.toggleHide = function() {

    hide = !hide;
    common.each(hideable_guis, function(gui) {
      gui.domElement.style.zIndex = hide ? -999 : 999;
      gui.domElement.style.opacity = hide ? 0 : 1;
    });
  };

  GUI.CLASS_AUTO_PLACE = 'a';
  GUI.CLASS_AUTO_PLACE_CONTAINER = 'ac';
  GUI.CLASS_MAIN = 'main';
  GUI.CLASS_CONTROLLER_ROW = 'cr';
  GUI.CLASS_TOO_TALL = 'taller-than-window';
  GUI.CLASS_CLOSED = 'closed';
  GUI.CLASS_CLOSE_BUTTON = 'close-button';
  GUI.CLASS_DRAG = 'drag';

  GUI.DEFAULT_WIDTH = 245;
  GUI.TEXT_CLOSED = 'Close Controls';
  GUI.TEXT_OPEN = 'Open Controls';

  dom.bind(window, 'keydown', function(e) {

    if (document.activeElement.type !== 'text' &&
        (e.which === HIDE_KEY_CODE || e.keyCode == HIDE_KEY_CODE)) {
      GUI.toggleHide();
    }

  }, false);

  common.extend(

      GUI.prototype,

      /** @lends dat.gui.GUI */
      {

        /**
         * @param object
         * @param property
         * @returns {dat.controllers.Controller} The new controller that was added.
         * @instance
         */
        add: function(object, property) {

          return add(
              this,
              object,
              property,
              {
                factoryArgs: Array.prototype.slice.call(arguments, 2)
              }
          );

        },

        /**
         * @param object
         * @param property
         * @returns {dat.controllers.ColorController} The new controller that was added.
         * @instance
         */
        addColor: function(object, property) {

          return add(
              this,
              object,
              property,
              {
                color: true
              }
          );

        },

        /**
         * @param controller
         * @instance
         */
        remove: function(controller) {

          // TODO listening?
          this.__ul.removeChild(controller.__li);
          this.__controllers.slice(this.__controllers.indexOf(controller), 1);
          var _this = this;
          common.defer(function() {
            _this.onResize();
          });

        },

        destroy: function() {

          if (this.autoPlace) {
            auto_place_container.removeChild(this.domElement);
          }

        },

        /**
         * @param name
         * @returns {dat.gui.GUI} The new folder.
         * @throws {Error} if this GUI already has a folder by the specified
         * name
         * @instance
         */
        addFolder: function(name) {

          // We have to prevent collisions on names in order to have a key
          // by which to remember saved values
          if (this.__folders[name] !== undefined) {
            throw new Error('You already have a folder in this GUI by the' +
                ' name "' + name + '"');
          }

          var new_gui_params = { name: name, parent: this };

          // We need to pass down the autoPlace trait so that we can
          // attach event listeners to open/close folder actions to
          // ensure that a scrollbar appears if the window is too short.
          new_gui_params.autoPlace = this.autoPlace;

          // Do we have saved appearance data for this folder?

          if (this.load && // Anything loaded?
              this.load.folders && // Was my parent a dead-end?
              this.load.folders[name]) { // Did daddy remember me?

            // Start me closed if I was closed
            new_gui_params.closed = this.load.folders[name].closed;

            // Pass down the loaded data
            new_gui_params.load = this.load.folders[name];

          }

          var gui = new GUI(new_gui_params);
          this.__folders[name] = gui;

          var li = addRow(this, gui.domElement);
          dom.addClass(li, 'folder');
          return gui;

        },

        open: function() {
          this.closed = false;
        },

        close: function() {
          this.closed = true;
        },

        onResize: function() {

          var root = this.getRoot();

          if (root.scrollable) {

            var top = dom.getOffset(root.__ul).top;
            var h = 0;

            common.each(root.__ul.childNodes, function(node) {
              if (! (root.autoPlace && node === root.__save_row))
                h += dom.getHeight(node);
            });

            if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
              dom.addClass(root.domElement, GUI.CLASS_TOO_TALL);
              root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + 'px';
            } else {
              dom.removeClass(root.domElement, GUI.CLASS_TOO_TALL);
              root.__ul.style.height = 'auto';
            }

          }

          if (root.__resize_handle) {
            common.defer(function() {
              root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
            });
          }

          if (root.__closeButton) {
            root.__closeButton.style.width = root.width + 'px';
          }

        },

        /**
         * Mark objects for saving. The order of these objects cannot change as
         * the GUI grows. When remembering new objects, append them to the end
         * of the list.
         *
         * @param {Object...} objects
         * @throws {Error} if not called on a top level GUI.
         * @instance
         */
        remember: function() {

          if (common.isUndefined(SAVE_DIALOGUE)) {
            SAVE_DIALOGUE = new CenteredDiv();
            SAVE_DIALOGUE.domElement.innerHTML = saveDialogueContents;
          }

          if (this.parent) {
            throw new Error("You can only call remember on a top level GUI.");
          }

          var _this = this;

          common.each(Array.prototype.slice.call(arguments), function(object) {
            if (_this.__rememberedObjects.length == 0) {
              addSaveMenu(_this);
            }
            if (_this.__rememberedObjects.indexOf(object) == -1) {
              _this.__rememberedObjects.push(object);
            }
          });

          if (this.autoPlace) {
            // Set save row width
            setWidth(this, this.width);
          }

        },

        /**
         * @returns {dat.gui.GUI} the topmost parent GUI of a nested GUI.
         * @instance
         */
        getRoot: function() {
          var gui = this;
          while (gui.parent) {
            gui = gui.parent;
          }
          return gui;
        },

        /**
         * @returns {Object} a JSON object representing the current state of
         * this GUI as well as its remembered properties.
         * @instance
         */
        getSaveObject: function() {

          var toReturn = this.load;

          toReturn.closed = this.closed;

          // Am I remembering any values?
          if (this.__rememberedObjects.length > 0) {

            toReturn.preset = this.preset;

            if (!toReturn.remembered) {
              toReturn.remembered = {};
            }

            toReturn.remembered[this.preset] = getCurrentPreset(this);

          }

          toReturn.folders = {};
          common.each(this.__folders, function(element, key) {
            toReturn.folders[key] = element.getSaveObject();
          });

          return toReturn;

        },

        save: function() {

          if (!this.load.remembered) {
            this.load.remembered = {};
          }

          this.load.remembered[this.preset] = getCurrentPreset(this);
          markPresetModified(this, false);

        },

        saveAs: function(presetName) {

          if (!this.load.remembered) {

            // Retain default values upon first save
            this.load.remembered = {};
            this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);

          }

          this.load.remembered[presetName] = getCurrentPreset(this);
          this.preset = presetName;
          addPresetOption(this, presetName, true);

        },

        revert: function(gui) {

          common.each(this.__controllers, function(controller) {
            // Make revert work on Default.
            if (!this.getRoot().load.remembered) {
              controller.setValue(controller.initialValue);
            } else {
              recallSavedValue(gui || this.getRoot(), controller);
            }
          }, this);

          common.each(this.__folders, function(folder) {
            folder.revert(folder);
          });

          if (!gui) {
            markPresetModified(this.getRoot(), false);
          }


        },

        listen: function(controller) {

          var init = this.__listening.length == 0;
          this.__listening.push(controller);
          if (init) updateDisplays(this.__listening);

        }

      }

  );

  function add(gui, object, property, params) {

    if (object[property] === undefined) {
      throw new Error("Object " + object + " has no property \"" + property + "\"");
    }

    var controller;

    if (params.color) {

      controller = new ColorController(object, property);

    } else {

      var factoryArgs = [object,property].concat(params.factoryArgs);
      controller = controllerFactory.apply(gui, factoryArgs);

    }

    if (params.before instanceof Controller) {
      params.before = params.before.__li;
    }

    recallSavedValue(gui, controller);

    dom.addClass(controller.domElement, 'c');

    var name = document.createElement('span');
    dom.addClass(name, 'property-name');
    name.innerHTML = controller.property;

    var container = document.createElement('div');
    container.appendChild(name);
    container.appendChild(controller.domElement);

    var li = addRow(gui, container, params.before);

    dom.addClass(li, GUI.CLASS_CONTROLLER_ROW);
    dom.addClass(li, typeof controller.getValue());

    augmentController(gui, li, controller);

    gui.__controllers.push(controller);

    return controller;

  }

  /**
   * Add a row to the end of the GUI or before another row.
   *
   * @param gui
   * @param [dom] If specified, inserts the dom content in the new row
   * @param [liBefore] If specified, places the new row before another row
   */
  function addRow(gui, dom, liBefore) {
    var li = document.createElement('li');
    if (dom) li.appendChild(dom);
    if (liBefore) {
      gui.__ul.insertBefore(li, params.before);
    } else {
      gui.__ul.appendChild(li);
    }
    gui.onResize();
    return li;
  }

  function augmentController(gui, li, controller) {

    controller.__li = li;
    controller.__gui = gui;

    common.extend(controller, {

      options: function(options) {

        if (arguments.length > 1) {
          controller.remove();

          return add(
              gui,
              controller.object,
              controller.property,
              {
                before: controller.__li.nextElementSibling,
                factoryArgs: [common.toArray(arguments)]
              }
          );

        }

        if (common.isArray(options) || common.isObject(options)) {
          controller.remove();

          return add(
              gui,
              controller.object,
              controller.property,
              {
                before: controller.__li.nextElementSibling,
                factoryArgs: [options]
              }
          );

        }

      },

      name: function(v) {
        controller.__li.firstElementChild.firstElementChild.innerHTML = v;
        return controller;
      },

      listen: function() {
        controller.__gui.listen(controller);
        return controller;
      },

      remove: function() {
        controller.__gui.remove(controller);
        return controller;
      }

    });

    // All sliders should be accompanied by a box.
    if (controller instanceof NumberControllerSlider) {

      var box = new NumberControllerBox(controller.object, controller.property,
          { min: controller.__min, max: controller.__max, step: controller.__step });

      common.each(['updateDisplay', 'onChange', 'onFinishChange'], function(method) {
        var pc = controller[method];
        var pb = box[method];
        controller[method] = box[method] = function() {
          var args = Array.prototype.slice.call(arguments);
          pc.apply(controller, args);
          return pb.apply(box, args);
        }
      });

      dom.addClass(li, 'has-slider');
      controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);

    }
    else if (controller instanceof NumberControllerBox) {

      var r = function(returned) {

        // Have we defined both boundaries?
        if (common.isNumber(controller.__min) && common.isNumber(controller.__max)) {

          // Well, then lets just replace this with a slider.
          controller.remove();
          return add(
              gui,
              controller.object,
              controller.property,
              {
                before: controller.__li.nextElementSibling,
                factoryArgs: [controller.__min, controller.__max, controller.__step]
              });

        }

        return returned;

      };

      controller.min = common.compose(r, controller.min);
      controller.max = common.compose(r, controller.max);

    }
    else if (controller instanceof BooleanController) {

      dom.bind(li, 'click', function() {
        dom.fakeEvent(controller.__checkbox, 'click');
      });

      dom.bind(controller.__checkbox, 'click', function(e) {
        e.stopPropagation(); // Prevents double-toggle
      })

    }
    else if (controller instanceof FunctionController) {

      dom.bind(li, 'click', function() {
        dom.fakeEvent(controller.__button, 'click');
      });

      dom.bind(li, 'mouseover', function() {
        dom.addClass(controller.__button, 'hover');
      });

      dom.bind(li, 'mouseout', function() {
        dom.removeClass(controller.__button, 'hover');
      });

    }
    else if (controller instanceof ColorController) {

      dom.addClass(li, 'color');
      controller.updateDisplay = common.compose(function(r) {
        li.style.borderLeftColor = controller.__color.toString();
        return r;
      }, controller.updateDisplay);

      controller.updateDisplay();

    }

    controller.setValue = common.compose(function(r) {
      if (gui.getRoot().__preset_select && controller.isModified()) {
        markPresetModified(gui.getRoot(), true);
      }
      return r;
    }, controller.setValue);

  }

  function recallSavedValue(gui, controller) {

    // Find the topmost GUI, that's where remembered objects live.
    var root = gui.getRoot();

    // Does the object we're controlling match anything we've been told to
    // remember?
    var matched_index = root.__rememberedObjects.indexOf(controller.object);

    // Why yes, it does!
    if (matched_index != -1) {

      // Let me fetch a map of controllers for thcommon.isObject.
      var controller_map =
          root.__rememberedObjectIndecesToControllers[matched_index];

      // Ohp, I believe this is the first controller we've created for this
      // object. Lets make the map fresh.
      if (controller_map === undefined) {
        controller_map = {};
        root.__rememberedObjectIndecesToControllers[matched_index] =
            controller_map;
      }

      // Keep track of this controller
      controller_map[controller.property] = controller;

      // Okay, now have we saved any values for this controller?
      if (root.load && root.load.remembered) {

        var preset_map = root.load.remembered;

        // Which preset are we trying to load?
        var preset;

        if (preset_map[gui.preset]) {

          preset = preset_map[gui.preset];

        } else if (preset_map[DEFAULT_DEFAULT_PRESET_NAME]) {

          // Uhh, you can have the default instead?
          preset = preset_map[DEFAULT_DEFAULT_PRESET_NAME];

        } else {

          // Nada.

          return;

        }


        // Did the loaded object remember thcommon.isObject?
        if (preset[matched_index] &&

          // Did we remember this particular property?
            preset[matched_index][controller.property] !== undefined) {

          // We did remember something for this guy ...
          var value = preset[matched_index][controller.property];

          // And that's what it is.
          controller.initialValue = value;
          controller.setValue(value);

        }

      }

    }

  }

  function getLocalStorageHash(gui, key) {
    // TODO how does this deal with multiple GUI's?
    return document.location.href + '.' + key;

  }

  function addSaveMenu(gui) {

    var div = gui.__save_row = document.createElement('li');

    dom.addClass(gui.domElement, 'has-save');

    gui.__ul.insertBefore(div, gui.__ul.firstChild);

    dom.addClass(div, 'save-row');

    var gears = document.createElement('span');
    gears.innerHTML = '&nbsp;';
    dom.addClass(gears, 'button gears');

    // TODO replace with FunctionController
    var button = document.createElement('span');
    button.innerHTML = 'Save';
    dom.addClass(button, 'button');
    dom.addClass(button, 'save');

    var button2 = document.createElement('span');
    button2.innerHTML = 'New';
    dom.addClass(button2, 'button');
    dom.addClass(button2, 'save-as');

    var button3 = document.createElement('span');
    button3.innerHTML = 'Revert';
    dom.addClass(button3, 'button');
    dom.addClass(button3, 'revert');

    var select = gui.__preset_select = document.createElement('select');

    if (gui.load && gui.load.remembered) {

      common.each(gui.load.remembered, function(value, key) {
        addPresetOption(gui, key, key == gui.preset);
      });

    } else {
      addPresetOption(gui, DEFAULT_DEFAULT_PRESET_NAME, false);
    }

    dom.bind(select, 'change', function() {


      for (var index = 0; index < gui.__preset_select.length; index++) {
        gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
      }

      gui.preset = this.value;

    });

    div.appendChild(select);
    div.appendChild(gears);
    div.appendChild(button);
    div.appendChild(button2);
    div.appendChild(button3);

    if (SUPPORTS_LOCAL_STORAGE) {

      var saveLocally = document.getElementById('dg-save-locally');
      var explain = document.getElementById('dg-local-explain');

      saveLocally.style.display = 'block';

      var localStorageCheckBox = document.getElementById('dg-local-storage');

      if (localStorage.getItem(getLocalStorageHash(gui, 'isLocal')) === 'true') {
        localStorageCheckBox.setAttribute('checked', 'checked');
      }

      function showHideExplain() {
        explain.style.display = gui.useLocalStorage ? 'block' : 'none';
      }

      showHideExplain();

      // TODO: Use a boolean controller, fool!
      dom.bind(localStorageCheckBox, 'change', function() {
        gui.useLocalStorage = !gui.useLocalStorage;
        showHideExplain();
      });

    }

    var newConstructorTextArea = document.getElementById('dg-new-constructor');

    dom.bind(newConstructorTextArea, 'keydown', function(e) {
      if (e.metaKey && (e.which === 67 || e.keyCode == 67)) {
        SAVE_DIALOGUE.hide();
      }
    });

    dom.bind(gears, 'click', function() {
      newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
      SAVE_DIALOGUE.show();
      newConstructorTextArea.focus();
      newConstructorTextArea.select();
    });

    dom.bind(button, 'click', function() {
      gui.save();
    });

    dom.bind(button2, 'click', function() {
      var presetName = prompt('Enter a new preset name.');
      if (presetName) gui.saveAs(presetName);
    });

    dom.bind(button3, 'click', function() {
      gui.revert();
    });

//    div.appendChild(button2);

  }

  function addResizeHandle(gui) {

    gui.__resize_handle = document.createElement('div');

    common.extend(gui.__resize_handle.style, {

      width: '6px',
      marginLeft: '-3px',
      height: '200px',
      cursor: 'ew-resize',
      position: 'absolute'
//      border: '1px solid blue'

    });

    var pmouseX;

    dom.bind(gui.__resize_handle, 'mousedown', dragStart);
    dom.bind(gui.__closeButton, 'mousedown', dragStart);

    gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);

    function dragStart(e) {

      e.preventDefault();

      pmouseX = e.clientX;

      dom.addClass(gui.__closeButton, GUI.CLASS_DRAG);
      dom.bind(window, 'mousemove', drag);
      dom.bind(window, 'mouseup', dragStop);

      return false;

    }

    function drag(e) {

      e.preventDefault();

      gui.width += pmouseX - e.clientX;
      gui.onResize();
      pmouseX = e.clientX;

      return false;

    }

    function dragStop() {

      dom.removeClass(gui.__closeButton, GUI.CLASS_DRAG);
      dom.unbind(window, 'mousemove', drag);
      dom.unbind(window, 'mouseup', dragStop);

    }

  }

  function setWidth(gui, w) {
    gui.domElement.style.width = w + 'px';
    // Auto placed save-rows are position fixed, so we have to
    // set the width manually if we want it to bleed to the edge
    if (gui.__save_row && gui.autoPlace) {
      gui.__save_row.style.width = w + 'px';
    }if (gui.__closeButton) {
      gui.__closeButton.style.width = w + 'px';
    }
  }

  function getCurrentPreset(gui, useInitialValues) {

    var toReturn = {};

    // For each object I'm remembering
    common.each(gui.__rememberedObjects, function(val, index) {

      var saved_values = {};

      // The controllers I've made for thcommon.isObject by property
      var controller_map =
          gui.__rememberedObjectIndecesToControllers[index];

      // Remember each value for each property
      common.each(controller_map, function(controller, property) {
        saved_values[property] = useInitialValues ? controller.initialValue : controller.getValue();
      });

      // Save the values for thcommon.isObject
      toReturn[index] = saved_values;

    });

    return toReturn;

  }

  function addPresetOption(gui, name, setSelected) {
    var opt = document.createElement('option');
    opt.innerHTML = name;
    opt.value = name;
    gui.__preset_select.appendChild(opt);
    if (setSelected) {
      gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
    }
  }

  function setPresetSelectIndex(gui) {
    for (var index = 0; index < gui.__preset_select.length; index++) {
      if (gui.__preset_select[index].value == gui.preset) {
        gui.__preset_select.selectedIndex = index;
      }
    }
  }

  function markPresetModified(gui, modified) {
    var opt = gui.__preset_select[gui.__preset_select.selectedIndex];
//    console.log('mark', modified, opt);
    if (modified) {
      opt.innerHTML = opt.value + "*";
    } else {
      opt.innerHTML = opt.value;
    }
  }

  function updateDisplays(controllerArray) {


    if (controllerArray.length != 0) {

      requestAnimationFrame(function() {
        updateDisplays(controllerArray);
      });

    }

    common.each(controllerArray, function(c) {
      c.updateDisplay();
    });

  }

  return GUI;

})(dat.utils.css,
"<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n      \n    </div>\n    \n  </div>\n\n</div>",
".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear;border:0;position:absolute;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-x:hidden}.dg.a.has-save ul{margin-top:27px}.dg.a.has-save ul.closed{margin-top:0}.dg.a .save-row{position:fixed;top:0;z-index:1002}.dg li{-webkit-transition:height 0.1s ease-out;-o-transition:height 0.1s ease-out;-moz-transition:height 0.1s ease-out;transition:height 0.1s ease-out}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;overflow:hidden;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li > *{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:9px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2fa1d6}.dg .cr.number input[type=text]{color:#2fa1d6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2fa1d6}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n",
dat.controllers.factory = (function (OptionController, NumberControllerBox, NumberControllerSlider, StringController, FunctionController, BooleanController, common) {

      return function(object, property) {

        var initialValue = object[property];

        // Providing options?
        if (common.isArray(arguments[2]) || common.isObject(arguments[2])) {
          return new OptionController(object, property, arguments[2]);
        }

        // Providing a map?

        if (common.isNumber(initialValue)) {

          if (common.isNumber(arguments[2]) && common.isNumber(arguments[3])) {

            // Has min and max.
            return new NumberControllerSlider(object, property, arguments[2], arguments[3]);

          } else {

            return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3] });

          }

        }

        if (common.isString(initialValue)) {
          return new StringController(object, property);
        }

        if (common.isFunction(initialValue)) {
          return new FunctionController(object, property, '');
        }

        if (common.isBoolean(initialValue)) {
          return new BooleanController(object, property);
        }

      }

    })(dat.controllers.OptionController,
dat.controllers.NumberControllerBox,
dat.controllers.NumberControllerSlider,
dat.controllers.StringController = (function (Controller, dom, common) {

  /**
   * @class Provides a text input to alter the string property of an object.
   *
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   *
   * @member dat.controllers
   */
  var StringController = function(object, property) {

    StringController.superclass.call(this, object, property);

    var _this = this;

    this.__input = document.createElement('input');
    this.__input.setAttribute('type', 'text');

    dom.bind(this.__input, 'keyup', onChange);
    dom.bind(this.__input, 'change', onChange);
    dom.bind(this.__input, 'blur', onBlur);
    dom.bind(this.__input, 'keydown', function(e) {
      if (e.keyCode === 13) {
        this.blur();
      }
    });
    

    function onChange() {
      _this.setValue(_this.__input.value);
    }

    function onBlur() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    this.updateDisplay();

    this.domElement.appendChild(this.__input);

  };

  StringController.superclass = Controller;

  common.extend(

      StringController.prototype,
      Controller.prototype,

      {

        updateDisplay: function() {
          // Stops the caret from moving on account of:
          // keyup -> setValue -> updateDisplay
          if (!dom.isActive(this.__input)) {
            this.__input.value = this.getValue();
          }
          return StringController.superclass.prototype.updateDisplay.call(this);
        }

      }

  );

  return StringController;

})(dat.controllers.Controller,
dat.dom.dom,
dat.utils.common),
dat.controllers.FunctionController,
dat.controllers.BooleanController,
dat.utils.common),
dat.controllers.Controller,
dat.controllers.BooleanController,
dat.controllers.FunctionController,
dat.controllers.NumberControllerBox,
dat.controllers.NumberControllerSlider,
dat.controllers.OptionController,
dat.controllers.ColorController = (function (Controller, dom, Color, interpret, common) {

  var ColorController = function(object, property) {

    ColorController.superclass.call(this, object, property);

    this.__color = new Color(this.getValue());
    this.__temp = new Color(0);

    var _this = this;

    this.domElement = document.createElement('div');

    dom.makeSelectable(this.domElement, false);

    this.__selector = document.createElement('div');
    this.__selector.className = 'selector';

    this.__saturation_field = document.createElement('div');
    this.__saturation_field.className = 'saturation-field';

    this.__field_knob = document.createElement('div');
    this.__field_knob.className = 'field-knob';
    this.__field_knob_border = '2px solid ';

    this.__hue_knob = document.createElement('div');
    this.__hue_knob.className = 'hue-knob';

    this.__hue_field = document.createElement('div');
    this.__hue_field.className = 'hue-field';

    this.__input = document.createElement('input');
    this.__input.type = 'text';
    this.__input_textShadow = '0 1px 1px ';

    dom.bind(this.__input, 'keydown', function(e) {
      if (e.keyCode === 13) { // on enter
        onBlur.call(this);
      }
    });

    dom.bind(this.__input, 'blur', onBlur);

    dom.bind(this.__selector, 'mousedown', function(e) {

      dom
        .addClass(this, 'drag')
        .bind(window, 'mouseup', function(e) {
          dom.removeClass(_this.__selector, 'drag');
        });

    });

    var value_field = document.createElement('div');

    common.extend(this.__selector.style, {
      width: '122px',
      height: '102px',
      padding: '3px',
      backgroundColor: '#222',
      boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
    });

    common.extend(this.__field_knob.style, {
      position: 'absolute',
      width: '12px',
      height: '12px',
      border: this.__field_knob_border + (this.__color.v < .5 ? '#fff' : '#000'),
      boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
      borderRadius: '12px',
      zIndex: 1
    });
    
    common.extend(this.__hue_knob.style, {
      position: 'absolute',
      width: '15px',
      height: '2px',
      borderRight: '4px solid #fff',
      zIndex: 1
    });

    common.extend(this.__saturation_field.style, {
      width: '100px',
      height: '100px',
      border: '1px solid #555',
      marginRight: '3px',
      display: 'inline-block',
      cursor: 'pointer'
    });

    common.extend(value_field.style, {
      width: '100%',
      height: '100%',
      background: 'none'
    });
    
    linearGradient(value_field, 'top', 'rgba(0,0,0,0)', '#000');

    common.extend(this.__hue_field.style, {
      width: '15px',
      height: '100px',
      display: 'inline-block',
      border: '1px solid #555',
      cursor: 'ns-resize'
    });

    hueGradient(this.__hue_field);

    common.extend(this.__input.style, {
      outline: 'none',
//      width: '120px',
      textAlign: 'center',
//      padding: '4px',
//      marginBottom: '6px',
      color: '#fff',
      border: 0,
      fontWeight: 'bold',
      textShadow: this.__input_textShadow + 'rgba(0,0,0,0.7)'
    });

    dom.bind(this.__saturation_field, 'mousedown', fieldDown);
    dom.bind(this.__field_knob, 'mousedown', fieldDown);

    dom.bind(this.__hue_field, 'mousedown', function(e) {
      setH(e);
      dom.bind(window, 'mousemove', setH);
      dom.bind(window, 'mouseup', unbindH);
    });

    function fieldDown(e) {
      setSV(e);
      // document.body.style.cursor = 'none';
      dom.bind(window, 'mousemove', setSV);
      dom.bind(window, 'mouseup', unbindSV);
    }

    function unbindSV() {
      dom.unbind(window, 'mousemove', setSV);
      dom.unbind(window, 'mouseup', unbindSV);
      // document.body.style.cursor = 'default';
    }

    function onBlur() {
      var i = interpret(this.value);
      if (i !== false) {
        _this.__color.__state = i;
        _this.setValue(_this.__color.toOriginal());
      } else {
        this.value = _this.__color.toString();
      }
    }

    function unbindH() {
      dom.unbind(window, 'mousemove', setH);
      dom.unbind(window, 'mouseup', unbindH);
    }

    this.__saturation_field.appendChild(value_field);
    this.__selector.appendChild(this.__field_knob);
    this.__selector.appendChild(this.__saturation_field);
    this.__selector.appendChild(this.__hue_field);
    this.__hue_field.appendChild(this.__hue_knob);

    this.domElement.appendChild(this.__input);
    this.domElement.appendChild(this.__selector);

    this.updateDisplay();

    function setSV(e) {

      e.preventDefault();

      var w = dom.getWidth(_this.__saturation_field);
      var o = dom.getOffset(_this.__saturation_field);
      var s = (e.clientX - o.left + document.body.scrollLeft) / w;
      var v = 1 - (e.clientY - o.top + document.body.scrollTop) / w;

      if (v > 1) v = 1;
      else if (v < 0) v = 0;

      if (s > 1) s = 1;
      else if (s < 0) s = 0;

      _this.__color.v = v;
      _this.__color.s = s;

      _this.setValue(_this.__color.toOriginal());


      return false;

    }

    function setH(e) {

      e.preventDefault();

      var s = dom.getHeight(_this.__hue_field);
      var o = dom.getOffset(_this.__hue_field);
      var h = 1 - (e.clientY - o.top + document.body.scrollTop) / s;

      if (h > 1) h = 1;
      else if (h < 0) h = 0;

      _this.__color.h = h * 360;

      _this.setValue(_this.__color.toOriginal());

      return false;

    }

  };

  ColorController.superclass = Controller;

  common.extend(

      ColorController.prototype,
      Controller.prototype,

      {

        updateDisplay: function() {

          var i = interpret(this.getValue());

          if (i !== false) {

            var mismatch = false;

            // Check for mismatch on the interpreted value.

            common.each(Color.COMPONENTS, function(component) {
              if (!common.isUndefined(i[component]) &&
                  !common.isUndefined(this.__color.__state[component]) &&
                  i[component] !== this.__color.__state[component]) {
                mismatch = true;
                return {}; // break
              }
            }, this);

            // If nothing diverges, we keep our previous values
            // for statefulness, otherwise we recalculate fresh
            if (mismatch) {
              common.extend(this.__color.__state, i);
            }

          }

          common.extend(this.__temp.__state, this.__color.__state);

          this.__temp.a = 1;

          var flip = (this.__color.v < .5 || this.__color.s > .5) ? 255 : 0;
          var _flip = 255 - flip;

          common.extend(this.__field_knob.style, {
            marginLeft: 100 * this.__color.s - 7 + 'px',
            marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
            backgroundColor: this.__temp.toString(),
            border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip +')'
          });

          this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px'

          this.__temp.s = 1;
          this.__temp.v = 1;

          linearGradient(this.__saturation_field, 'left', '#fff', this.__temp.toString());

          common.extend(this.__input.style, {
            backgroundColor: this.__input.value = this.__color.toString(),
            color: 'rgb(' + flip + ',' + flip + ',' + flip +')',
            textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip +',.7)'
          });

        }

      }

  );
  
  var vendors = ['-moz-','-o-','-webkit-','-ms-',''];
  
  function linearGradient(elem, x, a, b) {
    elem.style.background = '';
    common.each(vendors, function(vendor) {
      elem.style.cssText += 'background: ' + vendor + 'linear-gradient('+x+', '+a+' 0%, ' + b + ' 100%); ';
    });
  }
  
  function hueGradient(elem) {
    elem.style.background = '';
    elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);'
    elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);'
    elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);'
    elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);'
    elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);'
  }


  return ColorController;

})(dat.controllers.Controller,
dat.dom.dom,
dat.color.Color = (function (interpret, math, toString, common) {

  var Color = function() {

    this.__state = interpret.apply(this, arguments);

    if (this.__state === false) {
      throw 'Failed to interpret color arguments';
    }

    this.__state.a = this.__state.a || 1;


  };

  Color.COMPONENTS = ['r','g','b','h','s','v','hex','a'];

  common.extend(Color.prototype, {

    toString: function() {
      return toString(this);
    },

    toOriginal: function() {
      return this.__state.conversion.write(this);
    }

  });

  defineRGBComponent(Color.prototype, 'r', 2);
  defineRGBComponent(Color.prototype, 'g', 1);
  defineRGBComponent(Color.prototype, 'b', 0);

  defineHSVComponent(Color.prototype, 'h');
  defineHSVComponent(Color.prototype, 's');
  defineHSVComponent(Color.prototype, 'v');

  Object.defineProperty(Color.prototype, 'a', {

    get: function() {
      return this.__state.a;
    },

    set: function(v) {
      this.__state.a = v;
    }

  });

  Object.defineProperty(Color.prototype, 'hex', {

    get: function() {

      if (!this.__state.space !== 'HEX') {
        this.__state.hex = math.rgb_to_hex(this.r, this.g, this.b);
      }

      return this.__state.hex;

    },

    set: function(v) {

      this.__state.space = 'HEX';
      this.__state.hex = v;

    }

  });

  function defineRGBComponent(target, component, componentHexIndex) {

    Object.defineProperty(target, component, {

      get: function() {

        if (this.__state.space === 'RGB') {
          return this.__state[component];
        }

        recalculateRGB(this, component, componentHexIndex);

        return this.__state[component];

      },

      set: function(v) {

        if (this.__state.space !== 'RGB') {
          recalculateRGB(this, component, componentHexIndex);
          this.__state.space = 'RGB';
        }

        this.__state[component] = v;

      }

    });

  }

  function defineHSVComponent(target, component) {

    Object.defineProperty(target, component, {

      get: function() {

        if (this.__state.space === 'HSV')
          return this.__state[component];

        recalculateHSV(this);

        return this.__state[component];

      },

      set: function(v) {

        if (this.__state.space !== 'HSV') {
          recalculateHSV(this);
          this.__state.space = 'HSV';
        }

        this.__state[component] = v;

      }

    });

  }

  function recalculateRGB(color, component, componentHexIndex) {

    if (color.__state.space === 'HEX') {

      color.__state[component] = math.component_from_hex(color.__state.hex, componentHexIndex);

    } else if (color.__state.space === 'HSV') {

      common.extend(color.__state, math.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));

    } else {

      throw 'Corrupted color state';

    }

  }

  function recalculateHSV(color) {

    var result = math.rgb_to_hsv(color.r, color.g, color.b);

    common.extend(color.__state,
        {
          s: result.s,
          v: result.v
        }
    );

    if (!common.isNaN(result.h)) {
      color.__state.h = result.h;
    } else if (common.isUndefined(color.__state.h)) {
      color.__state.h = 0;
    }

  }

  return Color;

})(dat.color.interpret,
dat.color.math = (function () {

  var tmpComponent;

  return {

    hsv_to_rgb: function(h, s, v) {

      var hi = Math.floor(h / 60) % 6;

      var f = h / 60 - Math.floor(h / 60);
      var p = v * (1.0 - s);
      var q = v * (1.0 - (f * s));
      var t = v * (1.0 - ((1.0 - f) * s));
      var c = [
        [v, t, p],
        [q, v, p],
        [p, v, t],
        [p, q, v],
        [t, p, v],
        [v, p, q]
      ][hi];

      return {
        r: c[0] * 255,
        g: c[1] * 255,
        b: c[2] * 255
      };

    },

    rgb_to_hsv: function(r, g, b) {

      var min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          delta = max - min,
          h, s;

      if (max != 0) {
        s = delta / max;
      } else {
        return {
          h: NaN,
          s: 0,
          v: 0
        };
      }

      if (r == max) {
        h = (g - b) / delta;
      } else if (g == max) {
        h = 2 + (b - r) / delta;
      } else {
        h = 4 + (r - g) / delta;
      }
      h /= 6;
      if (h < 0) {
        h += 1;
      }

      return {
        h: h * 360,
        s: s,
        v: max / 255
      };
    },

    rgb_to_hex: function(r, g, b) {
      var hex = this.hex_with_component(0, 2, r);
      hex = this.hex_with_component(hex, 1, g);
      hex = this.hex_with_component(hex, 0, b);
      return hex;
    },

    component_from_hex: function(hex, componentIndex) {
      return (hex >> (componentIndex * 8)) & 0xFF;
    },

    hex_with_component: function(hex, componentIndex, value) {
      return value << (tmpComponent = componentIndex * 8) | (hex & ~ (0xFF << tmpComponent));
    }

  }

})(),
dat.color.toString,
dat.utils.common),
dat.color.interpret,
dat.utils.common),
dat.utils.requestAnimationFrame = (function () {

  /**
   * requirejs version of Paul Irish's RequestAnimationFrame
   * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
   */

  return window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback, element) {

        window.setTimeout(callback, 1000 / 60);

      };
})(),
dat.dom.CenteredDiv = (function (dom, common) {


  var CenteredDiv = function() {

    this.backgroundElement = document.createElement('div');
    common.extend(this.backgroundElement.style, {
      backgroundColor: 'rgba(0,0,0,0.8)',
      top: 0,
      left: 0,
      display: 'none',
      zIndex: '1000',
      opacity: 0,
      WebkitTransition: 'opacity 0.2s linear'
    });

    dom.makeFullscreen(this.backgroundElement);
    this.backgroundElement.style.position = 'fixed';

    this.domElement = document.createElement('div');
    common.extend(this.domElement.style, {
      position: 'fixed',
      display: 'none',
      zIndex: '1001',
      opacity: 0,
      WebkitTransition: '-webkit-transform 0.2s ease-out, opacity 0.2s linear'
    });


    document.body.appendChild(this.backgroundElement);
    document.body.appendChild(this.domElement);

    var _this = this;
    dom.bind(this.backgroundElement, 'click', function() {
      _this.hide();
    });


  };

  CenteredDiv.prototype.show = function() {

    var _this = this;
    


    this.backgroundElement.style.display = 'block';

    this.domElement.style.display = 'block';
    this.domElement.style.opacity = 0;
//    this.domElement.style.top = '52%';
    this.domElement.style.webkitTransform = 'scale(1.1)';

    this.layout();

    common.defer(function() {
      _this.backgroundElement.style.opacity = 1;
      _this.domElement.style.opacity = 1;
      _this.domElement.style.webkitTransform = 'scale(1)';
    });

  };

  CenteredDiv.prototype.hide = function() {

    var _this = this;

    var hide = function() {

      _this.domElement.style.display = 'none';
      _this.backgroundElement.style.display = 'none';

      dom.unbind(_this.domElement, 'webkitTransitionEnd', hide);
      dom.unbind(_this.domElement, 'transitionend', hide);
      dom.unbind(_this.domElement, 'oTransitionEnd', hide);

    };

    dom.bind(this.domElement, 'webkitTransitionEnd', hide);
    dom.bind(this.domElement, 'transitionend', hide);
    dom.bind(this.domElement, 'oTransitionEnd', hide);

    this.backgroundElement.style.opacity = 0;
//    this.domElement.style.top = '48%';
    this.domElement.style.opacity = 0;
    this.domElement.style.webkitTransform = 'scale(1.1)';

  };

  CenteredDiv.prototype.layout = function() {
    this.domElement.style.left = window.innerWidth/2 - dom.getWidth(this.domElement) / 2 + 'px';
    this.domElement.style.top = window.innerHeight/2 - dom.getHeight(this.domElement) / 2 + 'px';
  };
  
  function lockScroll(e) {
    console.log(e);
  }

  return CenteredDiv;

})(dat.dom.dom,
dat.utils.common),
dat.dom.dom,
dat.utils.common);

/***/ }),
/* 135 */
/***/ (function(module, exports) {

/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

/** @namespace */
var dat = module.exports = dat || {};

/** @namespace */
dat.color = dat.color || {};

/** @namespace */
dat.utils = dat.utils || {};

dat.utils.common = (function () {
  
  var ARR_EACH = Array.prototype.forEach;
  var ARR_SLICE = Array.prototype.slice;

  /**
   * Band-aid methods for things that should be a lot easier in JavaScript.
   * Implementation and structure inspired by underscore.js
   * http://documentcloud.github.com/underscore/
   */

  return { 
    
    BREAK: {},
  
    extend: function(target) {
      
      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
        
        for (var key in obj)
          if (!this.isUndefined(obj[key])) 
            target[key] = obj[key];
        
      }, this);
      
      return target;
      
    },
    
    defaults: function(target) {
      
      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
        
        for (var key in obj)
          if (this.isUndefined(target[key])) 
            target[key] = obj[key];
        
      }, this);
      
      return target;
    
    },
    
    compose: function() {
      var toCall = ARR_SLICE.call(arguments);
            return function() {
              var args = ARR_SLICE.call(arguments);
              for (var i = toCall.length -1; i >= 0; i--) {
                args = [toCall[i].apply(this, args)];
              }
              return args[0];
            }
    },
    
    each: function(obj, itr, scope) {

      
      if (ARR_EACH && obj.forEach === ARR_EACH) { 
        
        obj.forEach(itr, scope);
        
      } else if (obj.length === obj.length + 0) { // Is number but not NaN
        
        for (var key = 0, l = obj.length; key < l; key++)
          if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) 
            return;
            
      } else {

        for (var key in obj) 
          if (itr.call(scope, obj[key], key) === this.BREAK)
            return;
            
      }
            
    },
    
    defer: function(fnc) {
      setTimeout(fnc, 0);
    },
    
    toArray: function(obj) {
      if (obj.toArray) return obj.toArray();
      return ARR_SLICE.call(obj);
    },

    isUndefined: function(obj) {
      return obj === undefined;
    },
    
    isNull: function(obj) {
      return obj === null;
    },
    
    isNaN: function(obj) {
      return obj !== obj;
    },
    
    isArray: Array.isArray || function(obj) {
      return obj.constructor === Array;
    },
    
    isObject: function(obj) {
      return obj === Object(obj);
    },
    
    isNumber: function(obj) {
      return obj === obj+0;
    },
    
    isString: function(obj) {
      return obj === obj+'';
    },
    
    isBoolean: function(obj) {
      return obj === false || obj === true;
    },
    
    isFunction: function(obj) {
      return Object.prototype.toString.call(obj) === '[object Function]';
    }
  
  };
    
})();


dat.color.toString = (function (common) {

  return function(color) {

    if (color.a == 1 || common.isUndefined(color.a)) {

      var s = color.hex.toString(16);
      while (s.length < 6) {
        s = '0' + s;
      }

      return '#' + s;

    } else {

      return 'rgba(' + Math.round(color.r) + ',' + Math.round(color.g) + ',' + Math.round(color.b) + ',' + color.a + ')';

    }

  }

})(dat.utils.common);


dat.Color = dat.color.Color = (function (interpret, math, toString, common) {

  var Color = function() {

    this.__state = interpret.apply(this, arguments);

    if (this.__state === false) {
      throw 'Failed to interpret color arguments';
    }

    this.__state.a = this.__state.a || 1;


  };

  Color.COMPONENTS = ['r','g','b','h','s','v','hex','a'];

  common.extend(Color.prototype, {

    toString: function() {
      return toString(this);
    },

    toOriginal: function() {
      return this.__state.conversion.write(this);
    }

  });

  defineRGBComponent(Color.prototype, 'r', 2);
  defineRGBComponent(Color.prototype, 'g', 1);
  defineRGBComponent(Color.prototype, 'b', 0);

  defineHSVComponent(Color.prototype, 'h');
  defineHSVComponent(Color.prototype, 's');
  defineHSVComponent(Color.prototype, 'v');

  Object.defineProperty(Color.prototype, 'a', {

    get: function() {
      return this.__state.a;
    },

    set: function(v) {
      this.__state.a = v;
    }

  });

  Object.defineProperty(Color.prototype, 'hex', {

    get: function() {

      if (!this.__state.space !== 'HEX') {
        this.__state.hex = math.rgb_to_hex(this.r, this.g, this.b);
      }

      return this.__state.hex;

    },

    set: function(v) {

      this.__state.space = 'HEX';
      this.__state.hex = v;

    }

  });

  function defineRGBComponent(target, component, componentHexIndex) {

    Object.defineProperty(target, component, {

      get: function() {

        if (this.__state.space === 'RGB') {
          return this.__state[component];
        }

        recalculateRGB(this, component, componentHexIndex);

        return this.__state[component];

      },

      set: function(v) {

        if (this.__state.space !== 'RGB') {
          recalculateRGB(this, component, componentHexIndex);
          this.__state.space = 'RGB';
        }

        this.__state[component] = v;

      }

    });

  }

  function defineHSVComponent(target, component) {

    Object.defineProperty(target, component, {

      get: function() {

        if (this.__state.space === 'HSV')
          return this.__state[component];

        recalculateHSV(this);

        return this.__state[component];

      },

      set: function(v) {

        if (this.__state.space !== 'HSV') {
          recalculateHSV(this);
          this.__state.space = 'HSV';
        }

        this.__state[component] = v;

      }

    });

  }

  function recalculateRGB(color, component, componentHexIndex) {

    if (color.__state.space === 'HEX') {

      color.__state[component] = math.component_from_hex(color.__state.hex, componentHexIndex);

    } else if (color.__state.space === 'HSV') {

      common.extend(color.__state, math.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));

    } else {

      throw 'Corrupted color state';

    }

  }

  function recalculateHSV(color) {

    var result = math.rgb_to_hsv(color.r, color.g, color.b);

    common.extend(color.__state,
        {
          s: result.s,
          v: result.v
        }
    );

    if (!common.isNaN(result.h)) {
      color.__state.h = result.h;
    } else if (common.isUndefined(color.__state.h)) {
      color.__state.h = 0;
    }

  }

  return Color;

})(dat.color.interpret = (function (toString, common) {

  var result, toReturn;

  var interpret = function() {

    toReturn = false;

    var original = arguments.length > 1 ? common.toArray(arguments) : arguments[0];

    common.each(INTERPRETATIONS, function(family) {

      if (family.litmus(original)) {

        common.each(family.conversions, function(conversion, conversionName) {

          result = conversion.read(original);

          if (toReturn === false && result !== false) {
            toReturn = result;
            result.conversionName = conversionName;
            result.conversion = conversion;
            return common.BREAK;

          }

        });

        return common.BREAK;

      }

    });

    return toReturn;

  };

  var INTERPRETATIONS = [

    // Strings
    {

      litmus: common.isString,

      conversions: {

        THREE_CHAR_HEX: {

          read: function(original) {

            var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
            if (test === null) return false;

            return {
              space: 'HEX',
              hex: parseInt(
                  '0x' +
                      test[1].toString() + test[1].toString() +
                      test[2].toString() + test[2].toString() +
                      test[3].toString() + test[3].toString())
            };

          },

          write: toString

        },

        SIX_CHAR_HEX: {

          read: function(original) {

            var test = original.match(/^#([A-F0-9]{6})$/i);
            if (test === null) return false;

            return {
              space: 'HEX',
              hex: parseInt('0x' + test[1].toString())
            };

          },

          write: toString

        },

        CSS_RGB: {

          read: function(original) {

            var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
            if (test === null) return false;

            return {
              space: 'RGB',
              r: parseFloat(test[1]),
              g: parseFloat(test[2]),
              b: parseFloat(test[3])
            };

          },

          write: toString

        },

        CSS_RGBA: {

          read: function(original) {

            var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);
            if (test === null) return false;

            return {
              space: 'RGB',
              r: parseFloat(test[1]),
              g: parseFloat(test[2]),
              b: parseFloat(test[3]),
              a: parseFloat(test[4])
            };

          },

          write: toString

        }

      }

    },

    // Numbers
    {

      litmus: common.isNumber,

      conversions: {

        HEX: {
          read: function(original) {
            return {
              space: 'HEX',
              hex: original,
              conversionName: 'HEX'
            }
          },

          write: function(color) {
            return color.hex;
          }
        }

      }

    },

    // Arrays
    {

      litmus: common.isArray,

      conversions: {

        RGB_ARRAY: {
          read: function(original) {
            if (original.length != 3) return false;
            return {
              space: 'RGB',
              r: original[0],
              g: original[1],
              b: original[2]
            };
          },

          write: function(color) {
            return [color.r, color.g, color.b];
          }

        },

        RGBA_ARRAY: {
          read: function(original) {
            if (original.length != 4) return false;
            return {
              space: 'RGB',
              r: original[0],
              g: original[1],
              b: original[2],
              a: original[3]
            };
          },

          write: function(color) {
            return [color.r, color.g, color.b, color.a];
          }

        }

      }

    },

    // Objects
    {

      litmus: common.isObject,

      conversions: {

        RGBA_OBJ: {
          read: function(original) {
            if (common.isNumber(original.r) &&
                common.isNumber(original.g) &&
                common.isNumber(original.b) &&
                common.isNumber(original.a)) {
              return {
                space: 'RGB',
                r: original.r,
                g: original.g,
                b: original.b,
                a: original.a
              }
            }
            return false;
          },

          write: function(color) {
            return {
              r: color.r,
              g: color.g,
              b: color.b,
              a: color.a
            }
          }
        },

        RGB_OBJ: {
          read: function(original) {
            if (common.isNumber(original.r) &&
                common.isNumber(original.g) &&
                common.isNumber(original.b)) {
              return {
                space: 'RGB',
                r: original.r,
                g: original.g,
                b: original.b
              }
            }
            return false;
          },

          write: function(color) {
            return {
              r: color.r,
              g: color.g,
              b: color.b
            }
          }
        },

        HSVA_OBJ: {
          read: function(original) {
            if (common.isNumber(original.h) &&
                common.isNumber(original.s) &&
                common.isNumber(original.v) &&
                common.isNumber(original.a)) {
              return {
                space: 'HSV',
                h: original.h,
                s: original.s,
                v: original.v,
                a: original.a
              }
            }
            return false;
          },

          write: function(color) {
            return {
              h: color.h,
              s: color.s,
              v: color.v,
              a: color.a
            }
          }
        },

        HSV_OBJ: {
          read: function(original) {
            if (common.isNumber(original.h) &&
                common.isNumber(original.s) &&
                common.isNumber(original.v)) {
              return {
                space: 'HSV',
                h: original.h,
                s: original.s,
                v: original.v
              }
            }
            return false;
          },

          write: function(color) {
            return {
              h: color.h,
              s: color.s,
              v: color.v
            }
          }

        }

      }

    }


  ];

  return interpret;


})(dat.color.toString,
dat.utils.common),
dat.color.math = (function () {

  var tmpComponent;

  return {

    hsv_to_rgb: function(h, s, v) {

      var hi = Math.floor(h / 60) % 6;

      var f = h / 60 - Math.floor(h / 60);
      var p = v * (1.0 - s);
      var q = v * (1.0 - (f * s));
      var t = v * (1.0 - ((1.0 - f) * s));
      var c = [
        [v, t, p],
        [q, v, p],
        [p, v, t],
        [p, q, v],
        [t, p, v],
        [v, p, q]
      ][hi];

      return {
        r: c[0] * 255,
        g: c[1] * 255,
        b: c[2] * 255
      };

    },

    rgb_to_hsv: function(r, g, b) {

      var min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          delta = max - min,
          h, s;

      if (max != 0) {
        s = delta / max;
      } else {
        return {
          h: NaN,
          s: 0,
          v: 0
        };
      }

      if (r == max) {
        h = (g - b) / delta;
      } else if (g == max) {
        h = 2 + (b - r) / delta;
      } else {
        h = 4 + (r - g) / delta;
      }
      h /= 6;
      if (h < 0) {
        h += 1;
      }

      return {
        h: h * 360,
        s: s,
        v: max / 255
      };
    },

    rgb_to_hex: function(r, g, b) {
      var hex = this.hex_with_component(0, 2, r);
      hex = this.hex_with_component(hex, 1, g);
      hex = this.hex_with_component(hex, 0, b);
      return hex;
    },

    component_from_hex: function(hex, componentIndex) {
      return (hex >> (componentIndex * 8)) & 0xFF;
    },

    hex_with_component: function(hex, componentIndex, value) {
      return value << (tmpComponent = componentIndex * 8) | (hex & ~ (0xFF << tmpComponent));
    }

  }

})(),
dat.color.toString,
dat.utils.common);

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

// stats.js - http://github.com/mrdoob/stats.js
(function(f,e){ true?module.exports=e():"function"===typeof define&&define.amd?define(e):f.Stats=e()})(this,function(){var f=function(){function e(a){c.appendChild(a.dom);return a}function u(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();
u(++l%c.children.length)},!1);var k=(performance||Date).now(),g=k,a=0,r=e(new f.Panel("FPS","#0ff","#002")),h=e(new f.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var t=e(new f.Panel("MB","#f08","#201"));u(0);return{REVISION:16,dom:c,addPanel:e,showPanel:u,begin:function(){k=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();h.update(c-k,200);if(c>g+1E3&&(r.update(1E3*a/(c-g),100),g=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/
1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){k=this.end()},domElement:c,setMode:u}};f.Panel=function(e,f,l){var c=Infinity,k=0,g=Math.round,a=g(window.devicePixelRatio||1),r=80*a,h=48*a,t=3*a,v=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=h;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,h);b.fillStyle=f;b.fillText(e,t,v);
b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(h,w){c=Math.min(c,h);k=Math.max(k,h);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=f;b.fillText(g(h)+" "+e+" ("+g(c)+"-"+g(k)+")",t,v);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,g((1-h/w)*p))}}};return f});


/***/ })
/******/ ]);