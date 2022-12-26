<template>
    <div class="selection">

        <v-container class="py-0 px-0 elevation-2" fluid="fluid">
            <!-- Überschrift -->
            <v-layout wrap>
                <v-flex xs12>
                    <v-card style="background-color: lightgray;">
                        <v-card-text>
                            <span>
                            <h1 class="text-xs-left">
                                <v-icon right>find_in_page</v-icon>
                                 Artikelauswahl
                                 <v-tooltip bottom>
                                    <v-btn  small slot="activator" style="float: right; margin-top: 0" icon flat  @click.native.stop="dialog = true"><v-icon>help_outline</v-icon></v-btn>
                                    <span>Hilfe</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                 <v-btn  small slot="activator" style="float: right; margin-top: 0" icon flat @click="hide"><v-icon>clear</v-icon></v-btn>
                                 <span>Ansicht schließen</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                 <v-btn  small slot="activator" style="float: right; margin-top: 0" icon flat @click="clear"><v-icon>undo</v-icon></v-btn>
                                 <span>Ansicht zurücksetzen</span>
                                </v-tooltip>
                                <v-dialog v-model="dialog" max-width="800">
                                    <v-card>
                                        <v-card-title class="headline">Bedienung der Ansicht: Artikelauswahl</v-card-title>
                                        
                                        <img src="@/assets/AA_Hilfe.png" width="700px">

                                        <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="darken-1" flat="flat" @click.native="dialog = false">OK</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </h1>
                            </span>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>

            <!-- Diagramme -->
            <v-layout wrap>

                <v-flex xs9>
                    <v-card class="elevation-0">
                        <v-card-text class="pr-1" style="background-color: #e8e8e8;">
                            <v-layout>
                                <v-flex xs12>
                                    <v-card height="20px" style="background-color: lightgray;">        
                                        <h2> Kommentarverteilung über die Zeit</h2>    
                                    </v-card>
                                    <v-card height="380px">
                                    
                                        <d3-stream :msg="modi" :data="streamData" @streamGraphBrushExtend="handleStreamGraphBrushExtend($event)" @streamBrush="handleTimeBrush($event)" @brush="streamBrush = $event"></d3-stream>
                                    
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs3>
                    <v-card class="elevation-0">
                        <v-card-text style="background-color: #e8e8e8;">
                            <v-layout>
                                <v-flex xs12>
                                    <v-card height="20px" style="background-color: lightgray;">        
                                        <h2>Kumulierte Häufigkeit</h2>    
                                    </v-card>
                                    <v-card height="380px">
                                        <v-radio-group v-model="modi" row class="pt-1 pl-4 pb-0">
                                            <v-radio label="Ressort" value="department" ></v-radio>
                                            <v-radio label="Thema" value="topic"></v-radio>
                                        </v-radio-group>
                                        <v-radio-group  style=" margin-top: -30px; " v-model="modi" column class="pl-4 pt-0">
                                            <v-radio label="Autor" value="autor"></v-radio>
                                        </v-radio-group>

                                        <d3-donut :msg="modi" :data="pieData" ></d3-donut> 

                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>

                <v-expansion-panel>
                    <v-expansion-panel-content style="background-color: lightgray;" :key="1">
                        <div  slot="header"><h2>Erweiterte Filter</h2></div>

                            <v-layout wrap>
                                <v-flex xs4>
                                    <v-card class="elevation-0" style="background-color: #E0E0E0;">
                                    <v-card-text>
                                            <v-layout>
                                                <v-flex xs12>
                                                    <v-card height="20px" style="background-color: lightgray;">        
                                                        <center><h2> Ressort Filter</h2></center>
                                                    </v-card>
                                                    <v-card height="247px" class="scroll-y">
                                                        <department-table :data="departmentsData" @selectedDepartments="handleDepartments($event)"></department-table>
                                                    </v-card>
                                                </v-flex>
                                            </v-layout>
                                        </v-card-text>
                                    </v-card>
                                </v-flex>
                                <v-flex xs4>
                                    <v-card class="elevation-0" style="background-color: #E0E0E0;">
                                        <v-card-text>
                                            <v-layout>
                                                <v-flex xs12>
                                                    <v-card height="20px" style="background-color: lightgray;">        
                                                        <center><h2> Themen Filter</h2></center>
                                                    </v-card>
                                                    <v-card height="247px" class="scroll-y">
                                                    <user-table :data="topicsData" @selectedTopics="handleTopics($event)"></user-table>
                                                    </v-card>
                                                </v-flex>
                                            </v-layout>
                                        </v-card-text>
                                    </v-card>
                                </v-flex>
                                <v-flex xs4>
                                    <v-card class="elevation-0" style="background-color: #E0E0E0;">
                                        <v-card-text>
                                            <v-layout>
                                                <v-flex xs12>
                                                    <v-card height="20px" style="background-color: lightgray;">        
                                                        <center><h2> Autoren Filter</h2></center>
                                                    </v-card>
                                                    <v-card height="247px" class="scroll-y"> 
                                                        <author-table :data="authorData" @selectedAuthors="handleAuthors($event)"></author-table>
                                                    </v-card>
                                                </v-flex>
                                            </v-layout>
                                        </v-card-text>
                                    </v-card>
                                </v-flex>
                            </v-layout>

                    </v-expansion-panel-content>
                </v-expansion-panel>


            <v-layout wrap >
                <v-flex xs6>
                    
                    <v-card class="elevation-0">
                        <v-card-text style="background-color: #e8e8e8;">
                            <v-layout>
                                <v-flex xs12>
                                    <v-card height="20px" style="background-color: lightgray;">        
                                        <h2> Artikel Filter</h2>
                                    </v-card>
                                    <v-card height="247px" class="scroll-y"> 
                                        <article-table :data="articleData" @selectedArticles="handleArticles($event)"></article-table>
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs6>
                    <v-card class="elevation-0">
                        <v-card-text class="pr-3" style="background-color: #e8e8e8;">
                            <v-layout>
                                <v-flex xs12>
                                    
                                    <v-card row height="20px" style="background-color: lightgray;">   
                                        <span>
                                        <h2> Aktive Filter </h2> 
                                        <h2> Bla </h2>
                                        </span>
                                    </v-card>
                                    <v-card height="247px" class="scroll-y"> 
                                        <div align="left">
                                            <!-- Zeit -->
                                            <v-chip small close v-if="sBrush != ''" @input="removeBrush">
                                                <v-avatar>
                                                    <v-icon>av_timer</v-icon>
                                                </v-avatar>
                                               {{ sBrush }}
                                            </v-chip>

                                            
                                            

                                            <v-divider v-show="sDepartments.length > 0" ></v-divider>

                                            <v-chip small close  v-for="(el) in sDepartments" :key="el.key" :color="el.value > 0 ? 'basic' : 'red'" @input="chipCloseDepartments(el)">
                                                <v-avatar>
                                                    <v-icon>business_center</v-icon> <!-- label_outline -->
                                                </v-avatar>
                                                {{ el.key }}
                                            </v-chip>

                                            <!-- Ressourts -->
                                           <v-chip small close v-if="sDepartments.length > 1" @input="sDepartments.splice(0, sDepartments.length);">
                                                
                                                {{ sDepartments.length + 'x' }}
                                            </v-chip>
                                            
                                            <!-- Themen -->
                                    <!--        
                                            -->

                                            <v-divider v-show="sTopics.length > 0" ></v-divider>

                                            <v-chip small close  v-for="(el) in sTopics" :key="el.key" :color="el.value > 0 ? 'basic' : 'red'" @input="chipCloseTopics(el)">
                                                <v-avatar>
                                                    <v-icon>import_contacts</v-icon> <!-- label_outline -->
                                                </v-avatar>
                                                {{ el.key }}
                                            </v-chip>

                                            <v-chip small close v-if="sTopics.length > 1" @input="sTopics.splice(0, sTopics.length);">
                                               
                                                {{ sTopics.length + 'x' }}
                                            </v-chip>

                                            <!-- Authers -->
                                 <!--           
                                -->

                                            <v-divider v-show="sAuthors.length > 0" ></v-divider>

                                            <v-chip small close v-for="(el) in sAuthors" :color="el.value > 0 ? 'basic' : 'red'" :key="el.key" @input="chipCloseAuthors(el)">
                                                <v-avatar>
                                                    <v-icon>person</v-icon>
                                                </v-avatar>
                                                {{ el.key }}
                                            </v-chip>

                                            <v-chip small close v-if="sAuthors.length > 1" @input="sAuthors.splice(0, sAuthors.length);">
                                               
                                                {{ sAuthors.length + 'x' }}
                                            </v-chip>

                                            <v-divider v-show="sArticles.length > 0" ></v-divider>

                                            <v-chip small close  v-for="(el) in sArticles" :key="el.key"  :color="el.value > 0 ? 'basic' : 'red'" @input="chipCloseArticle(el)">
                                                <v-avatar>
                                                    <v-icon>bookmark_border</v-icon>
                                                </v-avatar>
                                                {{ trimString(el.key) }}
                                            </v-chip>

                                            <v-chip small close v-if="sArticles.length > 1" @input="sArticles.splice(0, sArticles.length);">
                                                
                                                {{ sArticles.length + 'x' }}
                                            </v-chip>
                                            
                                        </div>
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>



        </v-container>

        <div class="py-2"  />

    </div>
</template>

<script>
/*
 * @author Jakob Andersen
 */

import D3Streamgraph from "./../representations/D3Streamgraph";
import D3DonutChart from "./../representations/D3DonutChart";
import DepartmentTable from "./../representations/TableDepartment";
import TableAuthor from "./../representations/TableAuthor";
import TableUser from "./../representations/TableTopic";
import TableArticle from "./../representations/TableArticle";

import DataStore from './../../data/DataStore'; 

export default {
  props: ['show'],
  name: "selection",
  components: {
    "d3-stream": D3Streamgraph,
    "d3-donut": D3DonutChart,
    "department-table": DepartmentTable,
    "author-table": TableAuthor,
    "article-table": TableArticle,
    "user-table": TableUser,


  },
  data() {
    return {
      dialog: false,
      // Stream Graph
      modi: "department",
      streamData: [],
      streamGraphBrushExtend: [],
      streamBrush: '',

      sBrush: '',
      
      // Pie
      pieData : [],

      // Tabellen
      departmentsData: [],
      topicsData: [],
      authorData: [],
      articleData: [],

      sDepartments: [],
      sAuthors: [],
      sArticles: [],
      sTopics: [],
    };
    // DEBUG
  },
  watch : {
      modi(newValue) {
        this.setStreamData(true);
        this.setPieData(true)
      },
      show(newValue) {
          if(!newValue) {
              this.hide();
          } else {
              this.reactivated();
          }

      }
  },
  mounted () {
    this.setStreamData();
    this.setPieData(true);

    this.setDepartmentsData();
    this.setTopicsData();
    this.setAuthorData();
    this.setArticleData();
  },
  methods: {
      // Fenster
      hide() {
          this.clear();
          this.$emit('hide', false);
      },
      clear() {
          DataStore.methods.releaseCommentsTimeFilter();
          DataStore.methods.releaseCommentsDepartmentFilter();
          DataStore.methods.releaseCommenstTopicFilter();
          DataStore.methods.releaseCommentsAuthorFilter();
          DataStore.methods.releaseCommentsArticleFilter();

          this.setStreamData();
          this.setDepartmentsData();
          this.setTopicsData();
          this.setAuthorData();
          this.setArticleData();
          
          this.sDepartments = [];
          this.sAuthors = [];
          this.sArticles = [];
          this.sTopics = [];
          
          this.removeBrush();
          this.setPieData(true);
      },
      reactivated() {
          // nix
      },
      // Stream
      setStreamData(brushEvent) {
        var data = []
         if(this.modi == 'department') 
             data = DataStore.methods.reduceCountDepartmentsByDate_NoTimeFilter();
         else if(this.modi == 'topic')
             data = DataStore.methods.reduceCountTopicsBydate_NoTimeFilter();
         else 
            data = DataStore.methods.reduceCountAuthorsBydate_NoTimeFilter();
        this.streamData = data;
      },
      handleStreamGraphBrushExtend(newValue) {
          var newBrush = (JSON.stringify(this.streamGraphBrushExtend) === JSON.stringify(newValue))

          this.streamGraphBrushExtend = newValue;
          if(newValue.length > 0) {
            var min = newValue[0];
            var max = new Date(newValue[1].getTime() + 1);
            DataStore.methods.setCommentsTimeFilter(min, max);
            DataStore.state.streamBrush = newValue;
          } else {
            DataStore.methods.releaseCommentsTimeFilter();
            DataStore.state.streamBrush = null;
          }

          if(!newBrush) {
            this.setPieData(false);
            this.triggerChangeEvent();
          }
      },
      removeBrush() {
        if(!this.streamBrush.empty()) {
            this.streamBrush.clear().event(d3.select("#myChart .brush"))
            d3.select("#myChart .brush").call(this.streamBrush.extent([0, 0]))
        }
      },
      // Pie
      setPieData(mode) {
        var data = []
         if(this.modi == 'department') 
             data = DataStore.methods.reduceCountDepartmentsDounut();
         else if (this.modi == 'topic')
             data = DataStore.methods.reduceCountTopicsDounut();
         else 
            data = DataStore.methods.reduceCountAuthorDounut();
        this.pieData = [data, mode];
      },
      trimString(el) {
          var l = el.length;
          if(l > 25) {
              return el.substring(0, 23) + '...'
          }
          else return el;

      },
      handleTimeBrush(brush) {
          if(brush.length == 0) {
              this.sBrush = '';
              return;
          }
          function format (time) {
              return time.getDate() + '.' + (time.getMonth() + 1) + "." + time.getFullYear();
          }
          this.sBrush = format(brush[0]) + ' - ' + format(brush[1]);
      }, 
      // Tables
      setDepartmentsData() {
          this.departmentsData = DataStore.methods.reduceCountDepartments();
      },
      setTopicsData() {
          this.topicsData = DataStore.methods.reduceCountTopics();
      },
      setAuthorData() {
        this.authorData = DataStore.methods.reduceCountAuthors()
      },
      setArticleData() {
          this.articleData = DataStore.methods.reduceCountArticles();
      },

      handleDepartments (selection) {
          var selectedDepartments = [];
          for(var i = 0; i < selection.length; i++) {
            selectedDepartments.push(selection[i].key);
          } 
          if(selectedDepartments.length > 0) { 
            DataStore.methods.setCommentsDepartmentFilter(selectedDepartments);
          } else {
            DataStore.methods.releaseCommentsDepartmentFilter();
          }
          this.sDepartments = selection;
          this.updateCharts();
      },
      handleAuthors (selection) {
          var selectedAuthors = [];
          for(var i = 0; i < selection.length; i++) {
            selectedAuthors.push(selection[i].key);
          } 
          if(selectedAuthors.length > 0) { 
            DataStore.methods.setCommentsAuthorFilter(selectedAuthors);
          } else {
            DataStore.methods.releaseCommentsAuthorFilter();
          }
          this.sAuthors = selection;
          this.updateCharts();
      },
      handleArticles (selection) {
          var selectedArticles = [];
          for(var i = 0; i < selection.length; i++) {
            selectedArticles.push(selection[i].key);
          }
          if(selectedArticles.length > 0) { 
            DataStore.methods.setCommentsArticleFilter(selectedArticles);
          } else {
            DataStore.methods.releaseCommentsArticleFilter();
          }
          this.sArticles = selection;
          this.updateCharts();
      },
      handleTopics (selection) {
        var selectedTopics = [];
        for(var i = 0; i < selection.length; i++) {
          selectedTopics.push(selection[i].key);
        } 
        if(selectedTopics.length > 0) { 
          DataStore.methods.setCommenstTopicFilter(selectedTopics);
        } else {
          DataStore.methods.releaseCommenstTopicFilter();
        }
        this.sTopics = selection;
        this.updateCharts();
      },
      updateCharts() {
        this.setStreamData();
        this.setPieData(true);

        this.triggerChangeEvent();
      },
      triggerChangeEvent() {
          this.$store.state.selectionViewChanged = !this.$store.state.selectionViewChanged;
      },
      // chips
      chipCloseArticle(el) {
          var i = this.sArticles.indexOf(el);
          this.sArticles.splice(i, 1);
      },
      chipCloseAuthors(el) {
          var i = this.sAuthors.indexOf(el);
          this.sAuthors.splice(i, 1);
      },
      chipCloseTopics(el) {
          var i = this.sTopics.indexOf(el);
          this.sTopics.splice(i, 1);
      },
      chipCloseDepartments(el) {
          var i = this.sDepartments.indexOf(el);
          this.sDepartments.splice(i, 1);
      },
      
  }
};
</script>

