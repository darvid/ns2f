"use strict";angular.module("projectsApp",["ngAnimate","ngRoute","ngSanitize","ngTouch","angular-toArrayFilter","monospaced.elastic"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("projectsApp").controller("MainCtrl",["$scope","$http","firewall",function(a,b,c){a.denyOutput=!0,a.denyForward="REJECT",a.firewall=c,a.$watch("netstat",function(a){c.parseNetstat(a)})}]),angular.module("projectsApp").service("firewall",function(){this.incoming=[],this.outgoing=[],this.upsertRule=function(a,b){var c="outgoing"==b?this.outgoing:this.incoming,d=_.findWhere(c,{port:a.port});void 0!==d?d.protocols=_.union(d.protocols,a.protocols):c.push(a)},this.parseNetstat=function(a){if(void 0!==a){this.clear();var b=this,c=["tcp","tcp6","udp","udp6"];_.each(a.split(/\r\n|[\n\r\u0085\u2028\u2029]/g),function(a){if(-1===a.indexOf("LISTEN")||-1===a.indexOf("ESTABLISHED")){var d=a.split(/\s+/),e=d[0],f=d[3],g=d[4];if(_.contains(c,e)){var h=parseInt(_.last(f.split(":"))),i=parseInt(_.last(g.split(":")));isNaN(h)||isNaN(i)||("6"===e[3]&&(e=e.slice(0,3)),b.upsertRule({port:h,protocols:[e]},"incoming"),b.upsertRule({port:i,protocols:[e]},"outgoing"))}}})}},this.clear=function(){this.incoming=[],this.outgoing=[]}});