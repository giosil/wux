var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var APP;
(function (APP) {
    var Main = /** @class */ (function (_super) {
        __extends(Main, _super);
        function Main() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Main.prototype.render = function () {
            this.box = new WUX.WBox('bxf');
            this.box.title = 'Main Box';
            this.box.addTool(new WUX.WLabel('lbl', 'Label'));
            this.box.addCollapse(function (e) {
                console.log(e);
            });
            this.box
                .addRow()
                .addCol('6')
                .add('<span>A</span>')
                .addCol('6')
                .add('<span>B</span>')
                .addRow()
                .addCol('6')
                .add('<span>C</span>')
                .addCol('6')
                .add('<span>D</span>');
            return this.box;
        };
        return Main;
    }(WUX.WComponent));
    APP.Main = Main;
})(APP || (APP = {}));
