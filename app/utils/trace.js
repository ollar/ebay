/* eslint-disable no-console */

export default function trace(arg) {
    var now = (window.performance.now() / 1000).toFixed(3);
    console.log(now + ': ', arg);
}

/* eslint-enable no-console */