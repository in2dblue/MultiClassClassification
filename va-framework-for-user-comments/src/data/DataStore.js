import crossfilter from 'crossfilter2';

import { 
  getNewData,
  countReduceDepartment,
  countReduceTopic,
  countReduceAuthor,
  countReduceDepartmentByKey,
  countReduceTopicByKey,
  countReduceAuthorByKey,
} from './TestDataGenerator.js'

const DataStore = {
    state: {
        allFilters : {},

        selectedDepartments : [],
        selectedTopics : [],
        selectedAuthors : [],

        allComments : {},
        
        // filtered Comments
        cfAllComments : {
          timeBrush : [],

          all : {},
          time : {},
          author : {},
          department: {},
          topic: {},
          article: {},
        },

        // Stream Graph
        cfAllComments_NoTime : {
          all : {},
          time : {},
          author : {},
          department: {},
          topic: {},
        },

        // Table
        cfTableDepartment : {
          all : {},
          time : {},
          department: {},
        },
        cfTableTopic : {
          all : {},
          time : {},
          department: {},
          topic : {},
        },
        cfTableAuthor : {
          all : {},
          time : {},
          department: {},
          author : {},
          topic: {},
        },

        //
        // Content
        //
        cfContentAll : {
          all : {},
          addresses : {},
          topics: {},
        },
        cfAddresses : {
          all : {},
          addresses : {},
          topics: {},
        },
        cfTopics : {
          all : {},
          addresses : {},
          topics: {},
        },
        


        //
        // Indicators
        // 

        indicators : {},
        discIndicators : {},

        cfDiscIndicatorsReference : {
          all : {},
          reference : {},
          etiquette: {},
          content: {},
        },
        cfDiscIndicatorsEtiquette : {
          all : {},
          reference : {},
          content: {},
          etiquette: {},
        },
        cfDiscIndicatorsContent : {
          all : {},
          reference : {},
          content: {},
          etiquette: {},
        },



        // DEPRICATED

        // DATA POOL
        //myData : getNewData(),
        // DATA DEPARTMENT
        colorTopic : {},

        // STREAM DATA
        cfArticles : { // date, key, value (auther, article, user)
          all: {},
          dimKeyStream: {},
          allStream: {},
          dimTime: {},
          dimKey: {}
        },
        // DATA COMMENT
        cfComments : { // auther, topics, article, timeStamp
          all : {},
          dimTime : {},
          dimTopic : {} ,
          dimAuthor : {},
          dimArticle : {}
        },
        cfSentiment : {
          all : {},
          dimTime : {},
          position : {}
        },

        cloud : {
          length : {},
          readability : {},
          informationDensity : {},
          entertainment : {},
          sentiment: {},
          cite : {},
        },

        selection : [],
        streamBrush : null,
        lineChartBruch : [],

    },
    methods: {
      // private
      getAllFilteredComments() {
        return DataStore.state.cfAllComments.all.allFiltered();
      },
      getAllFilteredComments_NoTimeFilter() {
        return DataStore.state.cfAllComments_NoTime.all.allFiltered();
      },
      filterDepartmens(data) {
        var departments =  DataStore.state.selectedDepartments;
        if(departments.length == 0) return data;
        return data.filter(e => departments.indexOf(e.department) > -1)
      },
      filterTopics(data, topics) {
        if(topics.length == 0) return data;
        return data.filter(e => topics.indexOf(e.topic) > -1)
      },
      filterAuthors(data, authors) {
        if(authors.length == 0) return data;
        return data.filter(e => authors.indexOf(e.author) > -1)
      },
      

      // Für Themenfluss Diagramm
      reduceCountDepartmentsByDate_NoTimeFilter() {
        var comments = DataStore.methods.getAllFilteredComments_NoTimeFilter();
        return countReduceDepartment(comments);
      },
      reduceCountTopicsBydate_NoTimeFilter() {
        var comments = DataStore.methods.getAllFilteredComments_NoTimeFilter();
        return countReduceTopic(comments);
      }, 
      reduceCountAuthorsBydate_NoTimeFilter() {
        var comments = DataStore.methods.getAllFilteredComments_NoTimeFilter();
        return countReduceAuthor(comments);
      }, 

      // Tabelle + Dounut
      reduceCountDepartmentsDounut() {
        var comments = DataStore.methods.getAllFilteredComments();
        return countReduceDepartmentByKey(comments);
      },
      reduceCountTopicsDounut() {
        var comments = DataStore.methods.getAllFilteredComments();
        return countReduceTopicByKey(comments);
      },
      reduceCountAuthorDounut() {
        var comments = DataStore.methods.getAllFilteredComments();
        return countReduceAuthorByKey(comments)
      },

      reduceCountDepartments() {
        return DataStore.state.cfTableDepartment.department.group().reduceCount().all()
      },
      reduceCountTopics() {
        return DataStore.state.cfTableTopic.topic.group().reduceCount().all()
      },
      reduceCountAuthors() {
        return DataStore.state.cfTableAuthor.author.group().reduceCount().all()
      },
      reduceCountArticles() {
        return DataStore.state.cfAllComments.article.group().reduceCount().all()
      },

      getAllFilteredCommentsForContext() {
        return DataStore.state.cfContentAll.all.allFiltered();
      },


      getCommentsTimeBrush() {
        return DataStore.state.cfAllComments.timeBrush;
      },

      // Filter Anmelden / Abmelden mit 'null'
      setCommentsTimeFilter(min, max) { // array
        DataStore.state.allFilters['AA_time'] = [min, max]

        DataStore.state.cfAllComments.timeBrush = [min, max];

        DataStore.state.cfAllComments.time.filterRange([min, max]);
        DataStore.state.cfTableTopic.time.filterRange([min, max]);
        DataStore.state.cfTableAuthor.time.filterRange([min, max]);
        DataStore.state.cfTableDepartment.time.filterRange([min, max]);
      },
      releaseCommentsTimeFilter(){
        DataStore.state.allFilters['AA_time'] = []

        DataStore.state.cfAllComments.timeBrush = [];

        DataStore.state.cfAllComments.time.filter(null);
        DataStore.state.cfTableTopic.time.filter(null);
        DataStore.state.cfTableAuthor.time.filter(null);
        DataStore.state.cfTableDepartment.time.filter(null);
      },
      setCommentsDepartmentFilter(selection) { // array
        DataStore.state.allFilters['AA_department'] = selection

        DataStore.state.cfAllComments.department.filterFunction(e => selection.indexOf(e) > -1);
        DataStore.state.cfAllComments_NoTime.department.filterFunction(e => selection.indexOf(e) > -1);
        DataStore.state.cfTableTopic.department.filterFunction(e => selection.indexOf(e) > -1);
        DataStore.state.cfTableAuthor.department.filterFunction(e => selection.indexOf(e) > -1);
      },
      releaseCommentsDepartmentFilter() {
        DataStore.state.allFilters['AA_department'] = []

        DataStore.state.cfAllComments.department.filter(null);
        DataStore.state.cfAllComments_NoTime.department.filter(null);
        DataStore.state.cfTableTopic.department.filter(null);
        DataStore.state.cfTableAuthor.department.filter(null);
      },
      setCommentsAuthorFilter(selection) {
        DataStore.state.allFilters['AA_author'] = selection

        DataStore.state.cfAllComments.author.filter(e => selection.indexOf(e) > -1);
        DataStore.state.cfAllComments_NoTime.author.filter(e => selection.indexOf(e) > -1);
      },
      releaseCommentsAuthorFilter() {
        DataStore.state.allFilters['AA_author'] = []

        DataStore.state.cfAllComments.author.filter(null);
        DataStore.state.cfAllComments_NoTime.author.filter(null);
      },
      setCommenstTopicFilter(selection) {
        DataStore.state.allFilters['AA_topic'] = selection

        DataStore.state.cfAllComments.topic.filter(e => selection.indexOf(e) > -1);
        DataStore.state.cfAllComments_NoTime.topic.filter(e => selection.indexOf(e) > -1);
        DataStore.state.cfTableAuthor.topic.filter(e => selection.indexOf(e) > -1);
      },
      releaseCommenstTopicFilter() {
        DataStore.state.allFilters['AA_topic'] = []

        DataStore.state.cfAllComments.topic.filter(null);
        DataStore.state.cfAllComments_NoTime.topic.filter(null);
        DataStore.state.cfTableAuthor.topic.filter(null);
      }, 
      setCommentsArticleFilter(selection) {
        DataStore.state.allFilters['AA_article'] = selection

        DataStore.state.cfAllComments.article.filter(e => selection.indexOf(e) > -1);
        DataStore.state.cfAllComments_NoTime.article.filter(e => selection.indexOf(e) > -1);
      },
      releaseCommentsArticleFilter() {
        DataStore.state.allFilters['AA_article'] = []

        DataStore.state.cfAllComments.article.filter(null);
        DataStore.state.cfAllComments_NoTime.article.filter(null);
      },
      
      setPosition(value) {

        var obj = [
        'Deutschland sollte den Rundfunkbeitrag behalten.',
        'Diesel-Fahrverbote sind notwendig und richtig.',
        ]


        var i = obj.indexOf(value);

        DataStore.state.cfSentiment.position = i;
      },

      // Sentiment
      getSentimentData() {
        var times = ['01/01/18', '01/02/18', '01/03/18', '01/04/18', '01/05/18', '01/06/18', '01/07/18', '01/08/18', '01/09/18', '01/10/18', '01/11/18', '01/12/18', '01/13/18', '01/14/18', '01/15/18', '01/16/18', '01/17/18', '01/18/18', '01/19/18', '01/20/18', '01/21/18', '01/22/18', '01/23/18', '01/24/18', '01/25/18', '01/26/18', '01/27/18', '01/28/18', '01/29/18', '01/30/18', '02/01/18', '02/02/18', '02/03/18', '02/04/18', '02/05/18', '02/06/18', '02/07/18', '02/08/18', '02/09/18', '02/10/18', '02/11/18', '02/12/18', '02/13/18', '02/14/18', '02/15/18', '02/16/18', '02/17/18', '02/18/18', '02/19/18', '02/20/18', '02/21/18', '02/22/18', '02/23/18', '02/24/18', '02/25/18', '02/26/18', '02/27/18', '02/28/18'];

      for(var i = 0; i < times.length; i++) {
          var date = times[i].split('/'); 
          times[i] = new Date('20' + date[2], date[0]-1, date[1]);
      }
      
      var brushExtend = DataStore.state.streamBrush;

      if(brushExtend != null) {
        times = times.filter(e => e.getTime() >= brushExtend[0].getTime() && e.getTime() <= brushExtend[1].getTime())
      }

      var objectComments = DataStore.methods.getAllFilteredCommentsForContext();

      var objectSentiment = [];
      for (var d = 0; d < times.length; d++) {
          var obj = {};
          obj.date = times[d];
          obj.pos = 0;
          obj.neg = 0;
          //obj.neu = 0;
          objectComments
          .filter(e => { return  DataStore.state.cfSentiment.position >= 0 ? e.position == DataStore.state.cfSentiment.position : true})
          .filter(e => { return e.timeStamp.getTime() == times[d].getTime() })
          .forEach(e => {
              if(e.sentiment >= 0) {
                  obj.pos++;
              } else if (e.sentiment < 0) {
                  obj.neg++
              } else {
              //    obj.neu++;
              }
            } 
          );
          objectSentiment.push(obj)
      }
      return objectSentiment;
      },
      getScatterData() {
        var data = DataStore.methods.getAllFilteredCommentsForContext();
          var timeBrush = DataStore.state.lineChartBruch;
          data = data.filter(e => { return  DataStore.state.cfSentiment.position >= 0 ? e.position == DataStore.state.cfSentiment.position : true})
          if(timeBrush != null && timeBrush.length > 0) {
             data = data
             .filter(e => {
                 return e.timeStamp.getTime() >= timeBrush[0].getTime() && e.timeStamp.getTime() <= timeBrush[1].getTime();
             })
          }
          return data;
      },
      getArguments(data) {
          // DataStore.state.cfSentiment.position
          
          var timeBrush = DataStore.state.lineChartBruch;
          if(timeBrush != null && timeBrush.length > 0) {
             data = data.filter(e => {
                 return e.timeStamp.getTime() >= timeBrush[0].getTime() && e.timeStamp.getTime() <= timeBrush[1].getTime();
             })
          }

        var count = {};

        for(var i = 0; i < data.length; i++) {
            for(var j = 0; j < data[i].arguments.length; j++) {
                count[data[i].arguments[j]] = (count[data[i].arguments[j]] || 0) + 1;
            }
        }

        var pro = [
          ' Der Rundfunkbeitrag finaziert eine breite Spanne an <font color="green">Möglichkeiten sich Weiterbilden</font>, Informieren oder Unterhalten zu lassen. Er <font color="green">gewährt einen Qualitätsjournalismus.</font>', 'Das ist wichtig, denn es <font color="green">garantiert eine unabhängige Presse</font> im Land. ', 'Zum öffentlich-rechtlichen Rundfunk gehören <font color="green">Nachrichten- und Bildungsformate</font>, die <font color="green">sonst kein Sender in Deutschland zeigen</font> würde', 'Das <font color="green">Programm ist nicht auf Einschaltzahlen ausrichten</font>', 'Öffentlich-rechtliche Medien können <font color="green">Inhalte bereitstellen</font>, die sich <font color="green">für kommerzielle Anbieter nicht rechnen</font>',
          ' ...  <font color="green">vertreibt </font> langfristig <font color="green"> Diselmotoren  </font> vom Markt.', '... <font color="green">treibt </font> die <font color="green"> Elektromobilität voran</font> ...', 'Wenn die <font color="green">Luft</font> in den Städten durch Fahrverbote <font color="green">sauberer</font> wird ... ', 'solange der Verkehrsminister und die Autokonzerne weiter untätig bleiben, haben die <font color="green">Städte</font> gar <font color="green">keine andere Chance</font> ..', '... Weg um <font color="green">Autos aus den Städten zu kriegen</font> ... Radfahren ist hier lebensgefährlich.', 
          
        ];
        var con = [
          'nur <font color="red">Unsinn wird aus den Milliarden finanziert</font>', 'Beitrag ist eine <font color="red">Zwangsabgabe</font>', 'Das öffentlich-rechtliche Fernsehen <font color="red">schmeißt</font> die ihm durch Zwangsmaßnahmen zugeflossenen <font color="red">Mittel zum Fenster hinaus</font>', ' <font color="red">Artikel 5, Abs. 1 des Grundgesetzes</font>: „Jeder hat das Recht, ... sich aus allgemein zugänglichen Quellen ungehindert zu unterrichten...“', 'Öffentlich-rechtlicher <font color="red">Rundfunk und Politik</font> sind nict <font color="red">nicht unabhängig</font> ',
          '... nur auf den Schadstoffen des Diesels rumzuhacken, ist keine Lösung ... <font color="red">Benziner fahren auch nicht mit Luft </font> ... ', 'Autos <font color="red">verpesten nun mal </font> die Umwelt. Die Politik sollte <font color="red">deshalb Anreize für umweltfreundliche Mobilität</font> schaffen', 'Verbot <font color="red"> käme einer Enteignung </font> der Besitzer von 15 Millionen Autos <font color="red"> gleich </font>', ' Verbot ist zu <font color="red"> kurzfristig </font> um sich darauf einzustellen', '... <font color="red">unfair </font> gegenüber Diesel-Fahrern',
        ];

        var pros = [];
        var cons = [];

        for(var i = 0; i < pro.length; i++) {
            var obj = {};
            obj.text = pro[i];
            obj.count = count[i];
            if(obj.count)
                pros.push(obj);
        }

        for(var i = 0; i < con.length; i++) {
            var obj = {};
            obj.text = con[i];
            obj.count = count[i + 10];
            if(obj.count)
                cons.push(obj);
        }

        var comparator = function (a, b) {
            return a.count < b.count;
        } 

        return {'pros' : pros.sort(comparator), 'cons' : cons.sort(comparator) }
      },
      // cfContentAll

      setFilterContentAddresses(selection) {
        DataStore.state.allFilters['C_adressess'] = selection.length == 0 ? [] : selection;

        if(selection.length == 0) {
          DataStore.state.cfTopics.addresses.filter(null);
          DataStore.state.cfContentAll.addresses.filter(null);
        } else {
          DataStore.state.cfTopics.addresses.filterFunction(e => selection.indexOf(e) > -1)
          DataStore.state.cfContentAll.addresses.filterFunction(e => selection.indexOf(e) > -1)
        }
      },
      releaseFilterContentAddresses() {
        DataStore.state.allFilters['C_adressess'] = [];
        DataStore.state.cfTopics.addresses.filter(null);
        DataStore.state.cfContentAll.addresses.filter(null);
      },
      setFilterContentTopics(selection) {
        DataStore.state.allFilters['C_topics'] = selection.length == 0 ? [] : selection;

        if(selection.length == 0) {
          DataStore.state.cfAddresses.topics.filter(null);
          DataStore.state.cfContentAll.topics.filter(null);
        } else {  
          DataStore.state.cfAddresses.topics.filterFunction(e => selection.indexOf(e) > -1)
          DataStore.state.cfContentAll.topics.filterFunction(e => selection.indexOf(e) > -1)
        }
      },
      releaseFilterContentTopics() {
        DataStore.state.allFilters['C_topics'] = [];

        DataStore.state.cfAddresses.topics.filter(null);
        DataStore.state.cfContentAll.topics.filter(null);
      },
      getDataBarChartAdresses() {
        return DataStore.state.cfAddresses.addresses.group().reduceCount().all().sort((a, b) => b.value - a.value);
      },
      getDataBarChartTopics() {
        return DataStore.state.cfTopics.topics.group().reduceCount().all().sort((a, b) => b.value - a.value);
      },


      //
      cfContentAll() {
        DataStore.state.cfContentAll.all = crossfilter(DataStore.methods.getAllFilteredComments());
        DataStore.state.cfContentAll.addresses = state.cfContentAll.all.dimension(function(d){ return d.addresses;}, true);
        DataStore.state.cfContentAll.topics = state.cfContentAll.all.dimension(function(d){ return d.topics;}, true);
      },
      setcfAllAddresses() {
        DataStore.state.cfAddresses.all = crossfilter(DataStore.methods.getAllFilteredComments());
        DataStore.state.cfAddresses.addresses = state.cfAddresses.all.dimension(function(d){ return d.addresses;}, true);
        DataStore.state.cfAddresses.topics = state.cfAddresses.all.dimension(function(d){ return d.topics;}, true);
      },
      setcfAllTopics() {
        DataStore.state.cfTopics.all = crossfilter(DataStore.methods.getAllFilteredComments());
        DataStore.state.cfTopics.addresses = state.cfTopics.all.dimension(function(d){ return d.addresses;}, true);
        DataStore.state.cfTopics.topics = state.cfTopics.all.dimension(function(d){ return d.topics;}, true);
      },

      setAllIndicators() {
        DataStore.state.cfDiscIndicatorsReference.all = crossfilter(DataStore.state.discIndicators)
        DataStore.state.cfDiscIndicatorsReference.etiquette = DataStore.state.cfDiscIndicatorsReference.all.dimension(d => d.indiEtiquette, true); 
        DataStore.state.cfDiscIndicatorsReference.content = DataStore.state.cfDiscIndicatorsReference.all.dimension(d => d.indiContent, true);
        DataStore.state.cfDiscIndicatorsReference.reference = DataStore.state.cfDiscIndicatorsReference.all.dimension(d => d.indiReference, true);
      },

      setAllCloud() {
              // cloud input
              DataStore.state.cloud.length = DataStore.state.indicators.dimension(d => d['Länge']);
              DataStore.state.cloud.readability = DataStore.state.indicators.dimension(d => d['Lesbarkeit']);
              DataStore.state.cloud.informationDensity = DataStore.state.indicators.dimension(d => d['Informationsdichte']);
              DataStore.state.cloud.entertainment = DataStore.state.indicators.dimension(d => d['Unterhaltungswert']);
              DataStore.state.cloud.sentiment = DataStore.state.indicators.dimension(d => d['Stimmung']);
              DataStore.state.cloud.cite = DataStore.state.indicators.dimension(d => d['Referenzierung']);
      },

      // indicators

      setIndicators(data) {
        DataStore.state.discIndicators = data.map(d => d);
        DataStore.state.indicators = crossfilter(data.map(d => d.indicators));
        DataStore.methods.setAllIndicators();
        DataStore.methods.setAllCloud();
      },
      getDiscIndicators() {
        return DataStore.state.discIndicators;
      },
      updateIdicatorsParallelCoordinates() {
        DataStore.state.indicators = crossfilter(DataStore.state.cfDiscIndicatorsReference.all.allFiltered().map(d => d.indicators));
        DataStore.methods.setAllCloud();
      },
      getIndicators() {
        return DataStore.state.indicators.all();
      },
      getFilteredIndicators() {
        return DataStore.state.indicators.allFiltered();
      },
      
      // Indicators
      getDiscIndicatorsReferenceData() {
        return DataStore.state.cfDiscIndicatorsReference.reference.group().reduceCount().all();
      },
      getDiscIndicatorsEtiquetteData() {
        return DataStore.state.cfDiscIndicatorsReference.etiquette.group().reduceCount().all();
      },
      getDiscIndicatorsContentData() {
        return DataStore.state.cfDiscIndicatorsReference.content.group().reduceCount().all();
      },

      setDiscIndicatorsReferenceFilter(selection) {
        DataStore.state.allFilters['I_reference'] = selection.length == 0 ? [] : selection;

        if(selection.length > 0 )   { 
          DataStore.state.cfDiscIndicatorsReference.reference.filterFunction(e =>{ return selection.indexOf(e) > -1 })
        } else {
          DataStore.state.cfDiscIndicatorsReference.reference.filter(null)
        }
        DataStore.methods.updateIdicatorsParallelCoordinates();
      },
      setDiscIndicatorsEtiquetteFilter(selection) {
        DataStore.state.allFilters['I_etiquette'] = selection.length == 0 ? [] : selection;

        if(selection.length > 0 )   { 
          DataStore.state.cfDiscIndicatorsReference.etiquette.filterFunction(e =>{ return selection.indexOf(e) > -1 })
        } else {
          DataStore.state.cfDiscIndicatorsReference.etiquette.filter(null)
        }
        DataStore.methods.updateIdicatorsParallelCoordinates();
      },
      setDiscIndicatorsContentFilter(selection) {
        DataStore.state.allFilters['I_content'] = selection.length == 0 ? [] : selection;

        if(selection.length > 0 )   { 
          DataStore.state.cfDiscIndicatorsReference.content.filterFunction(e =>{ return selection.indexOf(e) > -1 })
        } else {
          DataStore.state.cfDiscIndicatorsReference.content.filter(null)
        }
        DataStore.methods.updateIdicatorsParallelCoordinates();
      },

      // WordCloud
      filterClound(lastBrushed, lastBrushedExtent, lastBrushedExtentIsEmpty) {
        DataStore.state.allFilters['I_' + lastBrushed] = lastBrushedExtentIsEmpty ? [] : lastBrushedExtent;

        //console.log('start FilterCloud: ' + DataStore.state.indicators.allFiltered().length)
        //console.log(lastBrushed, lastBrushedExtent, lastBrushedExtentIsEmpty)
        
        switch(lastBrushed) {
          case 'Länge':
          //console.log('lä')
            if(!lastBrushedExtentIsEmpty) DataStore.state.cloud.length.filterRange(lastBrushedExtent)
            else DataStore.state.cloud.length.filter(null)
            break;
          case 'Lesbarkeit':
          //console.log('le')
            if(!lastBrushedExtentIsEmpty) DataStore.state.cloud.readability.filterRange(lastBrushedExtent)
            else DataStore.state.cloud.readability.filter(null)
            break;
          case 'Informationsdichte':
          //console.log('in')
            if(!lastBrushedExtentIsEmpty) DataStore.state.cloud.informationDensity.filterRange(lastBrushedExtent)
            else DataStore.state.cloud.informationDensity.filter(null)
            break;
          case 'Unterhaltungswert':
          //console.log('un')
            if(!lastBrushedExtentIsEmpty) DataStore.state.cloud.entertainment.filterRange(lastBrushedExtent)
            else DataStore.state.cloud.entertainment.filter(null)
            break;
            case 'Stimmung':
            //console.log('un')
              if(!lastBrushedExtentIsEmpty) DataStore.state.cloud.sentiment.filterRange(lastBrushedExtent)
              else DataStore.state.cloud.sentiment.filter(null)
              break;
          case 'Referenzierung':
          //console.log('re')
            if(!lastBrushedExtentIsEmpty) DataStore.state.cloud.cite.filterRange(lastBrushedExtent)
            else DataStore.state.cloud.cite.filter(null)
            break;
          default:
            //console.log('default')
            break;
        }
        //console.log('end FilterCloud: ' + DataStore.state.indicators.allFiltered().length);
      },
      releaseClound() {

        DataStore.state.allFilters['I_Länge'] = [];
        DataStore.state.allFilters['I_Lesbarkeit'] = [];
        DataStore.state.allFilters['I_Informationsdichte'] = [];
        DataStore.state.allFilters['I_Unterhaltungswert'] = [];
        DataStore.state.allFilters['I_Stimmung'] = [];
        DataStore.state.allFilters['I_Referenzierung'] = [];

        DataStore.state.cloud.length.filter(null)
        DataStore.state.cloud.readability.filter(null)
        DataStore.state.cloud.informationDensity.filter(null)
        DataStore.state.cloud.entertainment.filter(null)
        DataStore.state.cloud.sentiment.filter(null);
        DataStore.state.cloud.cite.filter(null)
      },

      releaseAll() {
        DataStore.methods.releaseCommentsTimeFilter();
        DataStore.methods.releaseCommentsDepartmentFilter();
        DataStore.methods.releaseCommentsAuthorFilter();
        DataStore.methods.releaseCommenstTopicFilter()
        DataStore.methods.releaseCommentsArticleFilter();
      },



    }
  };



// init
var state = DataStore.state;
var methods = DataStore.methods;




state.allComments = getNewData().comments;

state.cfAllComments.all = crossfilter(state.allComments),
state.cfAllComments.time = state.cfAllComments.all.dimension(d => d.timeStamp ),
state.cfAllComments.author = state.cfAllComments.all.dimension(function(d) {return d.author; }),
state.cfAllComments.department = state.cfAllComments.all.dimension(function(d) {return d.department; }),
state.cfAllComments.topic = state.cfAllComments.all.dimension(function(d) {return d.topic; }),
state.cfAllComments.article = state.cfAllComments.all.dimension(function(d) {return d.article; }),

state.cfAllComments_NoTime.all = crossfilter(state.allComments),
state.cfAllComments_NoTime.author = state.cfAllComments_NoTime.all.dimension(function(d) {return d.author; }),
state.cfAllComments_NoTime.department = state.cfAllComments_NoTime.all.dimension(function(d) {return d.department; }),
state.cfAllComments_NoTime.topic = state.cfAllComments_NoTime.all.dimension(function(d) {return d.topic; }),
state.cfAllComments_NoTime.article = state.cfAllComments_NoTime.all.dimension(function(d) {return d.article; }),

// Table
state.cfTableTopic.all = crossfilter(state.allComments),
state.cfTableTopic.time = state.cfTableTopic.all.dimension(d => d.timeStamp )
state.cfTableTopic.department = state.cfTableTopic.all.dimension(function(d) {return d.department; })
state.cfTableTopic.topic = state.cfTableTopic.all.dimension(function(d) {return d.topic; })

state.cfTableAuthor.all = crossfilter(state.allComments),
state.cfTableAuthor.time = state.cfTableAuthor.all.dimension(d => d.timeStamp )
state.cfTableAuthor.department = state.cfTableAuthor.all.dimension(function(d) {return d.department; })
state.cfTableAuthor.topic = state.cfTableAuthor.all.dimension(function(d) {return d.topic; })
state.cfTableAuthor.author = state.cfTableAuthor.all.dimension(function(d) {return d.author; })

state.cfTableDepartment.all = crossfilter(state.allComments),
state.cfTableDepartment.time = state.cfTableDepartment.all.dimension(d => d.timeStamp )
state.cfTableDepartment.department = state.cfTableDepartment.all.dimension(function(d) {return d.department; })


DataStore.methods.cfContentAll();
DataStore.methods.setcfAllAddresses();
DataStore.methods.setcfAllTopics();

DataStore.methods.setIndicators(state.allComments);

// var topicsDim = cf.dimension(function(d){ return d.topics;}, true);
/*
obj.author = articles[rand].author;
        obj.department = articles[rand].department;
        obj.topic = articles[rand].topic; 
        obj.article = articles[rand].article;
        obj.timeStamp = randomeTimeIndex();
        obj.sentiment = (Math.random() * 2) -1;
*/


export default DataStore;