var Pudzian = function (options) {
    var root = {
        x: 0, y: 0, z: 0, width: options.width, height: options.height, length: options.length, weight: options.weight
    };
    var itemsInside;

    var clone = function (obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    var insertItem = function (bin, item) {
        item.x = bin.x;
        item.y = bin.y;
        item.z = bin.z;
        return item;
    };

    var checkDimensions = function (bin, dimensions) {
        return (dimensions.width <= bin.width && dimensions.height <= bin.height && dimensions.length <= bin.length);
    };

    var rotateItem = function (item, dimensions) {
        item.original_dimensions = { width: item.width, height: item.height, length: item.length };
        item.width  = dimensions.width;
        item.height = dimensions.height;
        item.length = dimensions.length;
        return item;
    };

    var rotate = function (bin, item) {
        if (item.width === item.height && item.height === item.length) return false;

        var positions = [
            { width: item.length, height: item.height, length: item.width,  rotated: false },
            { width: item.length, height: item.width,  length: item.height, rotated: true  },
            { width: item.height, height: item.width,  length: item.length, rotated: true  },
            { width: item.width,  height: item.length, length: item.height, rotated: true  },
            { width: item.height, height: item.length, length: item.width,  rotated: true  },
        ]

        for (var i = 0; i < positions.length; i++) {
            var position = positions[i];
            if ((!position.rotated || !item.non_rotatable) && checkDimensions(bin, position)) {
                return rotateItem(item, position);
            };
        };

        return false;
    };

    var findBin = function (bin, item) {
        if (bin.used) {
            return findBin(bin.right, item) || findBin(bin.front, item) || findBin(bin.up, item);
        }
        else if (item.width <= bin.width && item.height <= bin.height && item.length <= bin.length) {
            return bin;
        }
        else if (rotate(bin, item)) {
            return bin;
        }
        else {
            return null;
        }
    };

    var splitBin = function (bin, width, height, length) {
        bin.used  = true;
        bin.front = { x: bin.x, y: bin.y, z: bin.z + length, width: bin.width, height: bin.height, length: bin.length - length };
        bin.right = { x: bin.x + width, y: bin.y, z: bin.z, width: bin.width - width, height: bin.height, length: length };
        bin.up    = { x: bin.x, y: bin.y + height, z: bin.z, width: width, height: bin.height - height, length: length };
        return bin;
    };

    var sortItems = function (items, sortingMethod) {
        sortingMethod || (sortingMethod = "longest_edge");
        var sortingFunction;

        switch (sortingMethod) {
        case "footprint":
            sortingFunction = function (a,b) {
                return a.width * a.length < b.width * b.length;
            };
            break;
        case "volume":
            sortingFunction = function (a,b) {
                return a.width * a.height * a.length < b.width * b.height * b.length;
            };
            break;
        case "longest_edge":
            sortingFunction = function (a,b) {
                return Math.max(a.width, a.height, a.length) < Math.max(b.width, b.height, b.length);
            };
            break;
        }
        return items.sort(sortingFunction);
    };

    var checkItemsVolume = function (items) {
        var binVolume = root.width * root.height * root.length;
        var itemsVolume = items.reduce(function (sum, item) {
            return sum += item.width * item.height * item.length;
        }, 0);
        return itemsVolume <= binVolume;
    };

    var checkItemsWeight = function (items) {
        var itemsWeight = items.reduce(function (sum, item) {
            return sum += item.weight;
        }, 0);
        return itemsWeight <= root.weight;
    };

    var _fit = function(items, sortingMethod) {
        var sortedItems = sortItems(clone(items), sortingMethod);
        var mainBin     = clone(root);
        itemsInside     = [];

        for (var i = 0; i < sortedItems.length; i++) {
            var bin, item;
            item = sortedItems[i];
            if ((bin = findBin(mainBin, item))) {
                splitBin(bin, item.width, item.height, item.length);
                itemsInside.push(insertItem(bin, item));
            }
            else {
                return false;
            }
        };
        return true;
    }

    return {
        fit: function (items, sortingMethod) {
            if (!checkItemsVolume(items)) return false;
            if (!checkItemsWeight(items)) return false;

            return (_fit(items, "longest_edge") || _fit(items, "footprint") || _fit(items, "volume"));
        },
        items: function () {
            return itemsInside;
        },
        bin: function () {
            return root;
        }
    };
};

if (typeof module !== "undefined") {
    module.exports = Pudzian;
}
