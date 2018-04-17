function Middleware() {}

Middleware.prototype.use = function(func) {
    this.go = (function(_go, _this) {
        return function(next) {
            return _go.call(_this, func.bind(_this, next.bind(_this)));
        };
    })(this.go, this);
};

Middleware.prototype.go = function(next) {
    return next();
};

export default Middleware;
