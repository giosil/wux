var HelloWorld = (function (_super) {
    __extends(HelloWorld, _super);
    function HelloWorld() {
        return _super.call(this, '', 'HelloWorld') || this;
    }
    HelloWorld.prototype.render = function () {
        return '<div class="hello">Hello World</div>';
    };
    return HelloWorld;
}(WUX.WComponent));
//# sourceMappingURL=hello.js.map