app.filter('range', function () {
    return function (input, min, max, pad) {
        
        // Convert string to int
        min = parseInt(min); 
        max = parseInt(max);
        
        function pad(number, length) {
            var r = String(number);
            if (r.length < length) {
                r = utils.repeat(0, length - number.toString().length) + r;
            }
            return r;
        }

        for (var i = min; i <= max; i++)
            if (!pad) {
                input.push(i);
            } else {
                input.push(pad(i, max.toString().length));
            }
        return input;
    };
});