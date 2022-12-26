/*
 * Testdaten Generator 
 * @author Jakob Andersen
 */

var departments = ["Politik", "Wirtschaft", "Sport", "Kultur", ];
var topics = ["Deutschland", "Mittelstand", "Fußball", "Märkte", "Literatur", "Wintersport" ];
var authers = ["Frida Müller", "August Schröder", "Karl Becker", "Albert Seibert"]
var times = ['01/01/18', '01/02/18', '01/03/18', '01/04/18', '01/05/18', '01/06/18', '01/07/18', '01/08/18', '01/09/18', '01/10/18', '01/11/18', '01/12/18', '01/13/18', '01/14/18', '01/15/18', '01/16/18', '01/17/18', '01/18/18', '01/19/18', '01/20/18', '01/21/18', '01/22/18', '01/23/18', '01/24/18', '01/25/18', '01/26/18', '01/27/18', '01/28/18', '01/29/18', '01/30/18', '02/01/18', '02/02/18', '02/03/18', '02/04/18', '02/05/18', '02/06/18', '02/07/18', '02/08/18', '02/09/18', '02/10/18', '02/11/18', '02/12/18', '02/13/18', '02/14/18', '02/15/18', '02/16/18', '02/17/18', '02/18/18', '02/19/18', '02/20/18', '02/21/18', '02/22/18', '02/23/18', '02/24/18', '02/25/18', '02/26/18', '02/27/18', '02/28/18'];

// convert time
for(var i = 0; i < times.length; i++) {
    var date = times[i].split('/'); 
    times[i] = new Date('20' + date[2], date[0]-1, date[1]);
}

function countReduce(comments, keyArray, f) {
    var result = [];
    for (var t = 0; t < keyArray.length; t++) {
        for (var d = 0; d < times.length; d++) {
            var count = {};
            comments
                .filter(e => f(e) === keyArray[t])
                .filter(e => e.timeStamp === times[d])
                .forEach(function (x) { count[x.timeStamp] = (count[x.timeStamp] || 0) + 1; });

            var obj = {}
            obj.key = keyArray[t];
            obj.date = times[d];
            obj.value = count[times[d]] || 0;
            result.push(obj);
        }
    }
    return result;
}

function countReduceByKey(comments, keyArray, f) {
    var result = [];
    for (var t = 0; t < keyArray.length; t++) {
        var count = {};
        comments
            .filter(e => f(e) === keyArray[t])
            .forEach(e => count[f(e)] = (count[f(e)] || 0) + 1 );

        var obj = {}
        obj.key = keyArray[t];
        obj.value = count[keyArray[t]] || 0;
        result.push(obj);
    }
    return result;
}

function countReduceDepartment(data) {
    return countReduce(data, departments, e => e.department);
}

function countReduceTopic(data) {
    return countReduce(data, topics, e => e.topic);
}

function countReduceAuthor(data) {
    return countReduce(data, authers, e => e.author);
}

function countReduceDepartmentByKey(data) {
    return countReduceByKey(data, departments, e => e.department);
}

function countReduceTopicByKey(data) {
    return countReduceByKey(data, topics, e => e.topic);
}

function countReduceAuthorByKey(data) {
    return countReduceByKey(data, authers, e => e.author);
}


function getNewData () {

    // Kommentare werden zufällig auf die Artikel gestreut
    const numberComments = 700;

    const articles = [
        {
            author: "Frida Müller",
            department: "Politik",
            topic: "Deutschland",
            article: "Hamburg: Erste Diesel-Fahrverbote in Kraft"
        }, {
            author: "August Schröder",
            department: "Wirtschaft",
            topic: "Mittelstand",
            article: "Diesel-Urteil: Fahrverbote kosten Mittelstand Millionen"
        }, {
            author: "August Schröder",
            department: "Sport",
            topic: "Fußball",
            article: "So gewinnst du nicht die Champions League"
        }, {
            author: "Karl Becker",
            department: "Wirtschaft",
            topic: "Märkte",
            article: "Diesel-Fahrverbote: Polizei macht jetzt ernst"
        }, 
        //{
        //    author: "Karl Becker",
        //    department: "Kultur",
        //    topic: "Literatur",
        //    article: "Erzschmerz"
        //},
         {
            author: "Albert Seibert",
            department: "Politik",
            topic: "Deutschland",
            article: "Wähler kennen die meisten Minister nicht"
        }, {
            author: "Albert Seibert",
            department: "Sport",
            topic: "Wintersport",
            article: "Der Kannibale ist satt"
        }, {
            author: "Albert Seibert",
            department: "Kultur",
            topic: "Literatur",
            article: "Er schwebt in der Unendlichkeit"
        }
    ]
    
    function randomeArticleIndex() {
        var min = 0; max = articles.length - 1;
        return Math.round(Math.random() * (max - min) + min);
    }

    function randomeTimeIndex() {
        var min = 0, max = times.length - 1;
        return times[Math.round(Math.random() * (max - min) + min)];
    }

    var addresses = ["Autor", "Moderator", "Andere Leser", "Angela Merkel", "Andreas Scheuer", "Julia Klöckner",
    "Olaf Scholz", "Peter Altmaier", "Horst Seehofer"]
    var topics = ["Inflation", "Haushalt","Mobilität", "Sicherheit"] //, "#0", "#1", "#2", "#3", "#4", "#5", "#6", "#7", "#8", "#9", "#10", "#11", "#12", "#13", "#14", "#15", "#16", "#17", "#18", "#19", "#20", "#21", "#22", "#23", "#24", "#25", "#26", "#27"]

    function calc (array) {
        var result = []
        var i = Math.round(Math.random() * 2);
        function f () { return Math.round(Math.random() * (array.length - 1)) };
        if(i == 1) {
            result.push(array[f()])
        } else if(i == 2) {
            var ii = f();
            var jj = f();
            if(ii != jj) {
                result.push(array[jj])
            }
            result.push(array[ii])
        }
        return result;
    }

    var i = 0;

    function calcIndicators () {

        var iji = Math.round(Math.random() * 100);
        var jij = Math.round(Math.random() * 100);

        var indicators = {};
        indicators.name = i++;
        indicators.text = 'Kommentar Nr.' + i; 
        indicators['Länge'] = iji < 50 ? Math.round(Math.random() * 27) + 3 : Math.round(Math.random() * 97) + 3;
        indicators['Lesbarkeit'] =  Math.random();
        indicators['Informationsdichte'] = Math.random() * 1;
        indicators['Unterhaltungswert'] = Math.random() * 1;
        indicators['Stimmung'] = jij < 50 ? (Math.random() * 0.5) + 0.5 : Math.random();
        indicators['Referenzierung'] = jij < 50 ? Math.round(Math.random() * 30) : Math.round(Math.random() * 100);
        return  indicators;
    }


    var min = 0, max = articles.length - 1;

    var comments = [];


    for (var k = 0; k < numberComments; k++) {
        
        var obj = {};

        var rand = randomeArticleIndex();
        obj.author = articles[rand].author;
        obj.department = articles[rand].department;
        obj.topic = articles[rand].topic; 
        obj.article = articles[rand].article;
        obj.timeStamp = randomeTimeIndex();

        obj.position = Math.round(Math.random() * 1)

        if(obj.position == 1) { 
            if(obj.timeStamp < new Date(2018, 0, 16)) {
                var rand = Math.random() * 100;
                obj.sentiment = rand > 70 ? Math.random() * (-1) : Math.random() 
            } else if(obj.timeStamp < new Date(2018, 0, 19)) {
                var rand = Math.random() * 100;
                obj.sentiment = rand > 10 ? Math.random() * (-1) : Math.random()
            } else if(obj.timeStamp < new Date(2018, 0, 25)) {
                var rand = Math.random() * 100;
                obj.sentiment = rand > 60 ? Math.random() * (-1) : Math.random()
            } else if(obj.timeStamp < new Date(2018, 0, 30)) {
                var rand = Math.random() * 100;
                obj.sentiment = rand > 5 ? Math.random() * (-1) : Math.random()
            } else if(obj.timeStamp < new Date(2018, 1, 5)) {
                var rand = Math.random() * 100;
                obj.sentiment = rand > 10 ? Math.random() * (-1) : Math.random()
            } else if(obj.timeStamp < new Date(2018, 1, 10)) {
                var rand = Math.random() * 100;
                obj.sentiment = rand > 5 ? Math.random() * (-1) : Math.random()
            } else if(obj.timeStamp < new Date(2018, 1, 17)) {
                var rand = Math.random() * 100;
                obj.sentiment = rand > 90 ? Math.random() * (-1) : Math.random()
            } else {
                var rand = Math.random() * 100;
                obj.sentiment = rand > 90 ? Math.random() * (-1) : Math.random() 
            }
        } else {
            if(obj.timeStamp < new Date(2018, 0, 7)) {
                var rand = Math.random() * 100;
                obj.sentiment = rand < 20 ? Math.random() * (-1) : Math.random() 
            } else if(obj.timeStamp < new Date(2018, 0, 19)) {
                var rand = Math.random() * 100;
                obj.sentiment = rand > 20 ? Math.random() * (-1) : Math.random()
            } else if(obj.timeStamp < new Date(2018, 1, 15)) {
                var rand = Math.random() * 100;
                obj.sentiment = rand > 29 ? Math.random() * (-1) : Math.random()
            } else {
                var rand = Math.random() * 100;
                obj.sentiment = rand > 20 ? Math.random() * (-1) : Math.random() 
            }
        }
 
        obj.addresses = calc(addresses);
        obj.topics = calc(topics);
        obj.indicators = calcIndicators();

        if(obj.addresses.indexOf("Andreas Scheuer") > -1 ) {
            var rand = Math.round(Math.random())
            if(rand == 1) obj.topics = ["Mobilität"]
        } 



        // discreet indicators
        obj.indiReference = [Math.max(0, Math.round(Math.random() * 3) -1)] // [0, 1, 2]
        if(obj.indiReference == 0) {
            obj.indiEtiquette = [Math.max(0, Math.round(Math.random() * 7) - 4)]
        } else {
        obj.indiEtiquette = [Math.round(Math.random() * 3)] // [0, 1, 2, 3]
        }
        obj.indiContent = [Math.round(Math.random() * 4)] //[0, 1, 2, 3]


        // < 10 => pro; >= 10 => con
        if(obj.sentiment > 0)
            obj.arguments = [Math.round((Math.random() * 4)) + (obj.position * 5) ];
        else
            obj.arguments = [Math.round((Math.random() * 4) + (obj.position * 5) + 10)];

        var randVode = Math.round(Math.random() * 3);
        if(obj.sentiment > 0) {
        obj.votes = randVode == 1 ? Math.round((Math.random() * 50) -25) : Math.round((Math.random() * 20)) ;
        } else {
            obj.votes = randVode == 1 ? Math.round((Math.random() * 50) -25) : Math.round((Math.random() * 30) -15) ;
        }
        
        comments.push(obj);
        
    }

    var countByDepartment = countReduceDepartment(comments);

    var countByTopic = countReduceTopic(comments, topics, e => e.topic);

    /// eval




    /// end eval

    return { 'comments' : comments, 'articles' : countByDepartment, 'sentiment': {} };
}

export { getNewData, countReduceDepartment, countReduceAuthor, countReduceTopic, countReduceDepartmentByKey, countReduceTopicByKey, countReduceAuthorByKey }