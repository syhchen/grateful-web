var currentSubmissions = [];
var dimensions = [$('#content').height(), $('#content').width()];

// window.onresize = function(event) {
// 	dimensions = [$('#content').height(), $('#content').width()];
// }

$(document).ready(function() {
    bubblesMain(new Object({
            type : 'radial',
            revolve : 'center',
            minSpeed : 50,
            maxSpeed : 100,
            minSize : 50,
            maxSize : 150,
            num : 30,
            colors : new Array('#EEEEEE','#FFFFFF','#DDDDDD')
        }));

    $.ajax({
        url: '/api/comments',
        dataType: 'json',
        cache: false,
        success: function(data) {
            for(var i = 0; i < data.length; i++) {
                var id = 'submission' + i;
                currentSubmissions[i] = id;
                if(i === 0) {
                    startingPosition = [
                        dimensions[0] / 2 - 80,
                        dimensions[1] / 2 - 260
                    ];
                }
                else {
                    var startingPosition = randomPosition();
                }
                renderSubmission(data[i], id, startingPosition);
            }
            fadeSubmissions(0);
        },
        error: function(xhr, status, err) {
            console.error(this.url, status, err.toString());
        }
    });
});

function renderSubmission(data, id, startingPosition) {
    $('#content').append(function() {
        var text = '<p class="text">&ldquo;' + data.text + '&rdquo;</p>';
        var date = '<div class="date">' + data.date + '</div>';
        // var submission = '<div class="submission" id="' + id + '">' + text + date + '</div>';
        var submission = '<div style="display: none; top:' + startingPosition[0] + 'px; left:' + startingPosition[1] + 'px;" class="submission" id="' + id + '">' + text + date + '</div>';
        return submission;
    });
}

function animateSubmission(selector) {
    var newPosition = randomPosition();
    $(selector).animate({ top: newPosition[0], left: newPosition[1] }, 16000, function() {
        animateSubmission(selector);
    });
}

function fadeSubmissions(currentSubmission) {
    var submission = $('#' + currentSubmissions[currentSubmission]);
    submission.fadeIn(900);
    setTimeout(function() {
        var newPosition = randomPosition();
        submission.fadeOut(1000, function() {
            submission.css({'top': newPosition[0], 'left': newPosition[1]});
        });
        if(currentSubmission === currentSubmissions.length - 1) {
            setTimeout(function() {
                resetSubmissions();
            }, 900);
        }
        else {
            currentSubmission++;
            setTimeout(function() {fadeSubmissions(currentSubmission);}, 1000);
        }
    }, 4200);
}

function randomPosition() {
    var h = dimensions[0] - 160 - 40; // extra padding a four-line submission element
    var w = dimensions[1] - 520 - 40; // width of submission element

    var nh = Math.floor(Math.random() * h) + 20;
    var nw = Math.floor(Math.random() * w) + 20;

    return [nh,nw];
}

function resetSubmissions() {
    $('.submission').remove();
    updateCurrentSubmissions();
}

function updateCurrentSubmissions() {
    $.ajax({
        url: '/api/comments',
        dataType: 'json',
        cache: false,
        success: function(data) {
            console.log("updating current submissions...");
            for(var i = 0; i < data.length; i++) {
                var id = 'submission' + i;
                var startingPosition = randomPosition();
                renderSubmission(data[i], id, startingPosition);
            }
            fadeSubmissions(0);
        },
        error: function(xhr, status, err) {
            console.error(this.url, status, err.toString());
        }
    });
}
