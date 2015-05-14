'use strict';

angular.module('projectsApp')
  .service('firewall', function () {
    this.incoming = [];
    this.outgoing = [];

    this.upsertRule = function(rule, direction) {
      var container = direction == 'outgoing' ? this.outgoing : this.incoming;
      var existingRule = _.findWhere(container, {port: rule.port});
      if (existingRule !== undefined) {
        existingRule.protocols = _.union(existingRule.protocols, rule.protocols);
      } else {
        container.push(rule);
      }
    }

    this.parseNetstat = function(data) {
      if (data === undefined) {
        return;
      }
      this.clear();
      var firewall = this,
          acceptProtocols = ['tcp', 'tcp6', 'udp', 'udp6'];
      _.each(data.split(/\r\n|[\n\r\u0085\u2028\u2029]/g), function(line) {
        if (line.indexOf('LISTEN') !== -1 &&
            line.indexOf('ESTABLISHED') !== -1) {
          return;
        }
        var chunks = line.split(/\s+/);
        var protocol = chunks[0],
            src_addr_port = chunks[3],
            dst_addr_port = chunks[4];
        if (!_.contains(acceptProtocols, protocol)) {
          return;
        }
        var src_port = parseInt(_.last(src_addr_port.split(':'))),
            dst_port = parseInt(_.last(dst_addr_port.split(':')));
        if (isNaN(src_port) || isNaN(dst_port)) {
          return;
        }
        if (protocol[3] === '6') {
          protocol = protocol.slice(0, 3);
        }

        firewall.upsertRule({
          port: src_port,
          protocols: [protocol]
        }, 'incoming');

        firewall.upsertRule({
          port: dst_port,
          protocols: [protocol]
        }, 'outgoing');
      });
    };

    this.clear = function() {
      this.incoming = [];
      this.outgoing = [];
    }
  });
