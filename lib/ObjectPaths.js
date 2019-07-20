"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _this = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Find all paths on the given object up to the specified depth
 * @param next The object to get the paths of
 * @param currPath The currentPath that we're traversing
 * @param paths The array of paths to fill up
 * @param depth How deep we should traverse into the object
 * @param filter A filter to use to avoid traversing properties. i.e. Promises
 */
var toPathStrings = function toPathStrings(next, currPath, paths, depth, filter) {
  if (depth === 0) return;

  if (Array.isArray(next)) {
    paths.push(currPath);

    if (next.length > 0) {
      for (var i = 0; i < next.length; i++) {
        toPathStrings(next[i], "".concat(currPath, "[").concat(i, "]"), paths, depth && depth - 1, filter);
      }
    }
  } else if (next && _typeof(next) === 'object' && filter(next)) {
    var keys = Object.keys(next);

    if (keys.length > 0) {
      keys.forEach(function (k) {
        return toPathStrings(next[k], currPath ? currPath + '.' + k : k, paths, depth && depth - 1, filter);
      });
    } else {
      paths.push(currPath);
    }
  } else {
    paths.push(currPath);
  }
};

var _default = {
  /**
   * Convert an object to a list of paths up to the given depth
   * @param obj The object to get the paths of
   * @param filter A filter to use to avoid traversing properties. i.e. Promises
   * @param depth The depth to go
   * @returns {Array} The array of paths
   */
  toPaths: function toPaths(obj, filter, depth) {
    var paths = [];

    var pass = function pass() {
      return true;
    };

    toPathStrings(obj, null, paths, depth, filter || pass);
    return paths;
  },

  /**
   * Set the value of the given object at the specified path
   * @param path The path to set the value at
   * @param obj The object to set the value on
   * @param val The value to set
   */
  putPath: function putPath(path, obj, val) {
    var parts = path.split('.');

    if (parts.length === 1) {
      obj[parts[0]] = val;
    } else {
      var parentPaths = parts.slice(0, parts.length - 1);
      var parent = parentPaths.reduce(function (obj, prop) {
        if (!obj[prop]) {
          if (prop.endsWith(']')) {
            obj[prop] = [];
          } else {
            obj[prop] = {};
          }

          return obj[prop];
        } else {
          if (prop.endsWith(']')) {
            var indMarker = prop.lastIndexOf('[');
            var ind = prop.slice(indMarker + 1, prop.length - 1);
            var arrProp = prop.slice(0, indMarker);
            if (!Array.isArray(obj[arrProp])) obj[arrProp] = [];
            return obj[arrProp][parseInt(ind)];
          } else {
            return obj[prop];
          }
        }
      }, obj);

      if (parent) {
        var prop = parts.slice(-1)[0];

        if (prop.endsWith(']')) {
          var indMarker = prop.lastIndexOf('[');
          var ind = prop.slice(indMarker + 1, prop.length - 1);
          parent[prop.slice(0, indMarker)][ind] = val;
        } else {
          parent[prop] = val;
        }
      } else {
        return parent;
      }
    }
  },

  /**
   * Get the value at the given path from the specified object
   * @param path The path to get
   * @param obj The object to get the value from
   * @returns {{}} The value at the given path
   */
  getPath: function getPath(path, obj) {
    return path.split('.').reduce(function (obj, prop) {
      if (prop.endsWith(']')) {
        var indMarker = prop.lastIndexOf('[');
        var ind = prop.slice(indMarker + 1, prop.length - 1);
        return obj[prop.slice(0, indMarker)][parseInt(ind)];
      } else {
        return prop in obj ? obj[prop] : undefined;
      }
    }, obj);
  },

  /**
   * Check whether the given path actually exists on an object
   * @param path The path to check
   * @param obj The object to check if the path exists on
   * @returns boolean whether the path exists or not
   */
  hasPath: function hasPath(path, obj) {
    var parent = path.split('.').slice(0, -1);

    if (parent && parent.length > 1) {
      return !!_this.getPath(parent.join('.'), obj);
    } else {
      return !!obj && obj.hasOwnProperty(path);
    }
  }
};
exports["default"] = _default;