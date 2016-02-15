//CS5410 Assignment1, Fabio Gottlicher A01647928

var lastUpdate;
var elapsedSinceLast;
var events = [];

function gameLoop(time){
    elapsedSinceLast = time - lastUpdate;
    var toRender = update(time);
    render(toRender);
    lastUpdate = time;    
    window.requestAnimationFrame(gameLoop);
}

function update(time){
    var toRender = []
    for(var i = 0; i < events.length;i++){
        var nextExpected = events[i].lastUpdate + events[i].interval;
        console.log('next: ' + nextExpected +  'lastUpdate: ' + lastUpdate + ' now: ' + time);
        if(nextExpected > lastUpdate && nextExpected < time)
        {
            events[i].lastUpdate = nextExpected;
            events[i].repeatCt--;
            toRender.push("Event: " + events[i].name + " (" + events[i].repeatCt + " remaining)")
            if(events[i].repeatCt === 0){   //delete from array when not needed anymore
                events.splice(i,1);
            }
        }
    }
    return toRender;
}

function render(toRender){
    var node = document.getElementById('log');
    var container = document.getElementById('left');
    for(var i = 0; i < toRender.length;i++)
    {
        console.log(toRender[i]);
        node.innerHTML += "<span>" + toRender[i] + "</span><br/>";
        container.scrollTop = container.scrollHeight;
    }
    
}

function init(){
    //lastUpdate = performance.now();
    window.requestAnimationFrame(gameLoop);
}

function addEvent()
{
    console.log('adding event');
    var name = document.getElementById('name').value;
    var interval = parseFloat(document.getElementById('interval').value);
    var repeatCt = parseInt(document.getElementById('ct').value);
    
    events.push(EventFactory(name,interval,repeatCt));
    //execute first event pass
    var node = document.getElementById('log');
    var container = document.getElementById('left');
    node.innerHTML += "<span>" + "Event: " + events[events.length-1].name + " (" + events[events.length-1].repeatCt + " remaining)" + "</span><br/>";
    node.scrollTop = node.scrollHeight;
    container.scrollTop = container.scrollHeight;
    
}


function EventFactory(name,interval,repeatCt){
    var a = {
        name : name,
        interval : interval,
        repeatCt : repeatCt,
        lastUpdate : performance.now()
    }
    return a;
}

