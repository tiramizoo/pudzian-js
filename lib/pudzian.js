var Pudzian = function (options) {
    var root = {
        x: 0, y: 0, z: 0, width: options.width, height: options.height, length: options.length, weight: options.weight
    };
    var items = [];

    var insertItem = function (bin, item) {
        item.x = bin.x;
        item.y = bin.y;
        item.z = bin.z;
        items.push(item);
        return item;
    };

    var checkDimensions = function (bin, dimensions) {
        return (dimensions.width <= bin.width && dimensions.height <= bin.height && dimensions.length <= bin.length);
    };

    var rotateItem = function (item, dimensions) {
        item.original_dimensions = { width: item.width, height: item.height, length: item.length };
        item.width = dimensions.width;
        item.height = dimensions.height;
        item.length = dimensions.length;
        return item;
    };

    var rotate = function (bin, item) {
        if (item.width === item.height && item.height === item.length) return false;

        var position1 = { width: item.length, height: item.height, length: item.width };
        var position2 = { width: item.width,  height: item.length, length: item.height };
        var position3 = { width: item.height, height: item.width,  length: item.length };

        if (checkDimensions(bin, position1)) {
            return rotateItem(item, position1);
        }
        else if (!item.non_rotatable && checkDimensions(bin, position2)) {
            return rotateItem(item, position2);
        }
        else if (!item.non_rotatable && checkDimensions(bin, position3)) {
            return rotateItem(item, position3);
        }
        else {
            return false;
        }
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
        bin.used = true;
        bin.front  = { x: bin.x, y: bin.y, z: bin.z + length, width: bin.width, height: bin.height, length: bin.length - length };
        bin.right = { x: bin.x + width, y: bin.y, z: bin.z, width: bin.width - width, height: bin.height, length: length };
        bin.up = { x: bin.x, y: bin.y + height, z: bin.z, width: width, height: bin.height - height, length: length };
        return bin;
    };

    var sortItems = function (_items, sortingMethod) {
        sortingMethod || (sortingMethod = "footprint");
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
        }
        return _items.sort(sortingFunction);
    };

    var checkItemsVolume = function (_items) {
        var binVolume = root.width * root.height * root.length;
        var itemsVolume = _items.reduce(function (sum, item) {
            return sum += item.width * item.height * item.length;
        }, 0);
        return itemsVolume <= binVolume;
    };

    var checkItemsWeight = function (_items) {
        var itemsWeight = _items.reduce(function (sum, item) {
            return sum += item.weight;
        }, 0);
        return itemsWeight <= root.weight;
    };

    return {
        fit: function (_items, sortingMethod) {
            if (!checkItemsVolume(_items)) return false;
            if (!checkItemsWeight(_items)) return false;

            _items = sortItems(_items, sortingMethod);

            for (var i=0; i < _items.length; i++) {
                var bin, item;
                item = _items[i];
                if ((bin = findBin(root, item))) {
                    splitBin(bin, item.width, item.height, item.length);
                    insertItem(bin, item);
                }
                else {
                    return false;
                }
            };
            return true;
        },
        items: function () {
            return items;
        },
        bin: function () {
            return root;
        }
    };
};

if (typeof module !== "undefined") {
    module.exports = Pudzian;
}
