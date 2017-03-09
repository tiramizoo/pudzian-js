var Pudzian = require("../index"),
    assert = require("assert");

describe("pudzian", function () {
    var context = {};

    beforeEach(function () {
        context.pudzian = new Pudzian({ width: 100, height: 100, length: 100, weight: 100 });
    });

    it("should not fit if item's weight is bigger than max weight of bin", function () {
        assert(!context.pudzian.fit([
            { width: 10, height: 10, length: 10, weight: 50 },
            { width: 10, height: 10, length: 10, weight: 51 }
        ]));
    });

    it("should be able to accept smaller item", function () {
        assert(context.pudzian.fit([{ width: 99, height: 99, length: 99, weight: 5 }]));
    });

    it("should not be able to accept bigger item", function () {
        assert(!context.pudzian.fit([{ width: 99, height: 99, length: 101, weight: 5 }]));
    });

    it("should be able to accept 3 items which in total fit", function () {
        assert(context.pudzian.fit([
            { width: 99, height: 10, length: 99, weight: 1 },
            { width: 60, height: 89, length: 89, weight: 1 },
            { width: 30, height: 10, length: 79, weight: 1 },
            { width: 25, height: 70, length: 70, weight: 1 },
            { width: 50, height: 10, length: 10, weight: 1 },
            { width: 10, height: 50, length: 10, weight: 1 },
            { width: 10, height: 10, length: 50, weight: 1 },
            { width: 90, height: 50, length: 10, weight: 1 },
            { width: 10, height: 40, length: 10, weight: 1 },
            { width: 10, height: 40, length: 10, weight: 1 }
        ]));
    });

    it("should not be able to accept 3 items which in total don't fit", function () {
        assert(!context.pudzian.fit([
            { width: 99, height: 10, length: 99, weight: 1 },
            { width: 60, height: 89, length: 89, weight: 1 },
            { width: 30, height: 10, length: 79, weight: 1 },
            { width: 25, height: 70, length: 70, weight: 1 },
            { width: 50, height: 10, length: 10, weight: 1 },
            { width: 10, height: 50, length: 10, weight: 1 },
            { width: 10, height: 10, length: 50, weight: 1 },
            { width: 90, height: 50, length: 10, weight: 1 },
            { width: 90, height: 40, length: 10, weight: 1 },
            { width: 90, height: 10, length: 10, weight: 1 },
            { width: 5, height: 5, length: 5, weight: 1 }
        ]));
    });

    it("should be able to accept 1000 small items which in total are equal to bin value", function () {
        var items = [];
        for (var i=0; i < 1000; i++) {
            items.push({ width: 10, height: 10, length: 10, weight: 0.1 });
        }
        assert(context.pudzian.fit(items));
    });

    it("should not be able to accept 1001 small items which in total are bigger than bin value", function () {
        var items = [];
        for (var i=0; i < 1001; i++) {
            items.push({ width: 10, height: 10, length: 10, weight: 0.01 });
        }
        assert(!context.pudzian.fit(items));
    });

    it("should be able to accept item which fits when rotated", function () {
        var pudzian = new Pudzian({ width: 100, height: 100, length: 40, weight: 100 });
        assert(pudzian.fit([
            { width: 30, height: 100, length: 80, weight: 1 },
            { width: 20, height: 10,  length: 80, weight: 1 },
            { width: 10, height: 100, length: 80, weight: 1 },
            { width: 80, height: 20,  length: 30, weight: 1 }
        ]));
    });

    it("should not be able to accept item which is non rotatable item (rotate vertical axis)", function () {
        var pudzian = new Pudzian({ width: 100, height: 100, length: 40, weight: 100 });
        assert(!pudzian.fit([{ width: 100, height: 40, length: 100, weight: 1, non_rotatable: true }]));
    });

    it("should be able to accept item which is non rotatable item (rotate horizontal axis)", function () {
        var pudzian = new Pudzian({ width: 100, height: 100, length: 40, weight: 100 });
        assert(pudzian.fit([{ width: 40, height: 100, length: 100, weight: 1, non_rotatable: true }]));
    });

    it("should be able to accept items set 1", function () {
        var pudzian = new Pudzian({width: 150, height: 180, length: 350, weight: 1000});

        var fits = pudzian.fit([
          { width: 90, height: 1, length: 180, weight: 5, non_rotatable: false },
          { width: 90, height: 1, length: 180, weight: 5, non_rotatable: false },
          { width: 90, height: 1, length: 180, weight: 5, non_rotatable: false },
          { width: 90, height: 1, length: 180, weight: 5, non_rotatable: false },
          { width: 5, height:  4, length: 250, weight: 1, non_rotatable: false },
        ]);
        assert(fits);
    });
});
