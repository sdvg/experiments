var $clock = $('#clock');

var clock = {
    set: function(time) {
        time = time || new Date();
        var hours = time.getHours(),
            minutes = time.getMinutes(),
            seconds = time.getSeconds();

        // console.log('set clock to', hours+':'+minutes+':'+seconds);

        var isBetween = function(from, to) {
            var fromSplit = from.split(':'),
                toSplit = to.split(':'),
                fromMinutes = parseInt(fromSplit[0], 10),
                fromSeconds = parseInt(fromSplit[1], 10),
                toMinutes = parseInt(toSplit[0], 10),
                toSeconds = parseInt(toSplit[1], 10);


            if(toMinutes > fromMinutes || toMinutes === fromMinutes && toSeconds > fromSeconds) { //to is later then from
                return (minutes > fromMinutes || minutes === fromMinutes && seconds > fromSeconds) &&
                       (minutes < toMinutes || minutes === toMinutes && seconds < toSeconds);

            }
            else { // to is earlier then from
                return !(
                   (minutes > toMinutes || (minutes === toMinutes && seconds > toSeconds)) &&
                   (minutes < fromMinutes || (minutes === fromMinutes && seconds < fromSeconds))
                );
            }
        };

        var activeSegments = [];

        //02:30 -> 22:29  ...nach...
        if(isBetween('02:29', '22:30')) {
            if(isBetween('02:29', '07:30')) {
                activeSegments.push('m-5');
            }
            else if(isBetween('07:29', '12:30')) {
                activeSegments.push('m-10');
            }
            else if(isBetween('12:29', '17:30')) {
                activeSegments.push('m-15');
            }
            else if(isBetween('17:29', '22:30')) {
                activeSegments.push('m-20');
            }
            activeSegments.push('m-nach');
        }

        //22:30 -> 37:29 vor/nach/genau halb
        if(isBetween('22:29', '37:30')) {
            if(isBetween('22:29', '27:30')) {
                activeSegments.push('m-5', 'm-vor');
            }
            else if(isBetween('32:29', '37:30')) {
                activeSegments.push('m-5', 'm-nach');
            }

            activeSegments.push('m-30');
        }

        //37:30 -> 57:29 ...vor...
        if(isBetween('37:29', '57:30')) {
            if(isBetween('37:29', '42:30')) {
                activeSegments.push('m-20');
            }
            else if(isBetween('42:29', '47:30')) {
                activeSegments.push('m-15');
            }
            else if(isBetween('47:29', '52:30')) {
                activeSegments.push('m-10');
            }
            else if(isBetween('52:29', '57:30')) {
                activeSegments.push('m-5');
            }

            activeSegments.push('m-vor');
        }

        //hour segment:
        var hourSegment = null;
        if(isBetween('00:00', '22:30')) {
            hourSegment = this.to12hStr(hours);
        }
        else {
            hourSegment = this.to12hStr(hours+1);
        }
        activeSegments.push(hourSegment);

        if(isBetween('57:29', '02:30')) {
            activeSegments.push('uhr');
        }
        else if(hourSegment === '1') {
            activeSegments.push('1-add');
        }

        // console.log('segments: ', activeSegments);
        $clock.find('.active').removeClass('active');
        var selector = '.'+activeSegments.join(', .');
        $(selector).addClass('active');
    },

    to12hStr: function(hours) {
        hours = hours || 12;
        hours = hours > 12 ? hours - 12 : hours;

        return ''+hours;
    },

    setClockToNow: function () {
        var now = new Date();
        clock.set(now);
        //update all 30 seconds:
        var next = now.getSeconds() > 30 ? 60 : 30;
        var timeout = Math.abs(next-now.getSeconds())*1000;
        timeout = timeout > 0 ? timeout : 30000;

        setTimeout(clock.setClockToNow, timeout);
    }
};

clock.setClockToNow();