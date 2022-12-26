<template>
    <div class="sentiment">
        <v-container class="py-0 px-0 elevation-2" fluid="fluid" >
            <v-layout wrap>
                <v-flex xs12>
                    <v-card style="background-color: lightgray;">
                        <v-card-text>
                            <h1 class="text-xs-left">
                                <v-icon>thumbs_up_down</v-icon> 
                                Meinungsbild 
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
                                        <v-card-title class="headline">Bedienung der Ansicht: Meinungsbild</v-card-title>
                                        
                                        <img src="@/assets/A_Hilfe.png" width="700px">

                                        <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="darken-1" flat="flat" @click.native="dialog = false">OK</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </h1>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
            <v-layout wrap>
                <v-flex xs12>
                    <v-card class="elevation-0" style="background-color: #e8e8e8;">
                        <v-card-text class="pr-3 pb-0">
                            <v-layout>
                                <v-flex xs12>
                                    <v-card height="20px" style="background-color: lightgray;">        
                                        <h2> Standpunkt </h2>
                                    </v-card>
                                    <v-card height="55px" class="elevation-1 pl-3 pr-3">       
                                        <v-select
                                            :items="states"
                                            v-model="standpoint"
                                            label="Standpunkt wählen..."
                                            autocomplete
                                        ></v-select>
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs8>
                    <v-card class="elevation-0" style="background-color: #e8e8e8;">
                        <v-card-text class="pr-1">
                            <v-layout>
                                <v-flex xs12>
                                    <v-card height="20px" style="background-color: lightgray;">        
                                        <h2> Entwicklung der Meinung über die Zeit </h2>
                                    </v-card>
                                    <v-card  height="350px" class="elevation-1">  
                                        <tmp :data="lineChartData" @lineChartBrush="handleLineChartBrush($event)" @brush="lineBrush = $event"></tmp>
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs4>
                    <v-card class="elevation-0" style="background-color: #e8e8e8;">
                        <v-card-text>
                            <v-layout>
                                <v-flex xs12>
                                    <v-card height="20px" style="background-color: lightgray;">        
                                        <h2> Kommentarverteilung </h2>
                                    </v-card>
                                    <v-card  height="350px" class="elevation-1"> 
                                        <tmp2 :data="scatterPlotData" @brush="scatterBrush = $event" @selectedPoints="handleScatterPointSelection($event)"></tmp2> 
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>


            <!-- Diagramme -->
            <v-layout wrap>
                <v-flex xs6>
                    <v-card class="elevation-0">
                        <v-card-text class="pt-0" style="background-color: #e8e8e8;">
                            <v-layout>
                                <v-flex xs12>
                                    <v-card style="background-color: red;" height="30px">
                                            <h1><font color="white">Kontra Argumente</font></h1>
                                    </v-card>
                                    <v-card height="300px" class="scroll-y">
                                        
                                        <v-list three-line subheader v-for="(item) in conArguments" :key="item.key">
                                            <v-subheader>{{ item.count }} Kommentare</v-subheader> <!-- , ? mal diskutiert -->
                                            <div class="argumentfield">
                                                <span v-html="item.text"></span>
                                            </div>
                                            <v-divider></v-divider>
                                        </v-list>

                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs6>
                    <v-card class="elevation-0">
                        <v-card-text class="pt-0" style="background-color: #e8e8e8;">
                            <v-layout>
                                <v-flex xs12>
                                    <v-card style="background-color: green;" height="30px">
                                        <h1><font color="white">Pro Argumente</font></h1>
                                    </v-card>
                                    <v-card height="300px" class="scroll-y">
                                       
                                        <v-list three-line subheader v-for="item in proArguments" :key="item.key">
                                            <v-subheader> {{ item.count }} Kommentare</v-subheader> <!-- , ? mal diskutiert -->
                                            <div class="argumentfield">
                                                <span v-html="item.text"></span>
                                            </div>
                                            <v-divider></v-divider>
                                        </v-list>

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
import D3LineChart from "./../representations/D3LineChart";
import D3Scatterplot from "./../representations/D3Scatterplot";

import DataStore from './../../data/DataStore'; 

export default {
  props: ['show'],
  name: "sentiment",
  components: {
        'tmp': D3LineChart,
        'tmp2': D3Scatterplot,
  },
  data() {
    return {
        dialog: false,

        lineChartData : [],
        lineBrush: [],

        scatterPlotData: [],
        scatterBrush: '',

        proArguments : [], 
        conArguments : [], 
    
        lastStreamBrush : [],

        standpoint: null,
        states: [
          'Keine Auswahl - [Übersicht sämtlicher Standpunkte]', 
          'Deutschland sollte den Rundfunkbeitrag behalten.',
          'Diesel-Fahrverbote sind notwendig und richtig.'
        ]
    }

  }, methods : {
      hide() {
          this.clear();
          this.$emit('hide', false);
      },
      reactivated() {
          this.updateView()
      },
      setLineChartData() {
          var newBrush = DataStore.methods.getCommentsTimeBrush()

          if(DataStore.state.lineChartBruch.length > 0 && 
            JSON.stringify(this.lastStreamBrush) != JSON.stringify(newBrush)) {
            DataStore.state.lineChartBruch = [];
            this.lineChartData = [DataStore.methods.getSentimentData(), false]
          }  else {
            this.lineChartData = [DataStore.methods.getSentimentData(), true]
          }

          this.lastStreamBrush = newBrush;
          
      },
      setScatterPlotData(mode) {
          var data = DataStore.methods.getScatterData()
          this.scatterPlotData = [data, mode]
      },
      handleLineChartBrush(extend) {
          DataStore.state.lineChartBruch = extend;
          this.setScatterPlotData(false)
      },
      handleScatterPointSelection(selectedPoints) {
        this.setArgumentTableData(selectedPoints, true);
        DataStore.methods.setIndicators(selectedPoints);
      },
      setArgumentTableData(selectedPoints, manuelChange) {
        var args = DataStore.methods.getArguments(selectedPoints);
        this.proArguments = args['pros'];
        this.conArguments = args['cons'];

        if(manuelChange) 
            this.triggerChangeEvent();
      },
      triggerChangeEvent() {
          this.$store.state.sentimentViewChanged = !this.$store.state.sentimentViewChanged;
      },
      clear () {
          d3.select("#myLineChart").select(".brush").call(this.lineBrush.extent([0, 0]))
          this.lineBrush.clear().event(d3.select("#myLineChart .brush"))

          d3.select("#myScatterPlot").select(".brush").call(this.scatterBrush.extent([0, 0]))
          this.scatterBrush.clear().event(d3.select("#myScatterPlot .brush"))

          this.standpoint = this.states[0];
      },
      updateView() {
          console.log('- contendViewChanged')
          this.setLineChartData();
          this.setScatterPlotData(false) 
      }
  },
  computed : {
    selectionViewChanged () {
         return this.$store.state.contendViewChanged;
    },
  },
  watch : {
      selectionViewChanged () {
          if(this.show) {
              this.updateView()
          } else {
              DataStore.methods.setIndicators(DataStore.methods.getScatterData());
              this.triggerChangeEvent();
          }
      },
      standpoint (newValue, oldValue) {
        if(oldValue == null) {
            this.setScatterPlotData(true)
        } else {
            DataStore.methods.setPosition(newValue);
            this.setLineChartData(); 
            this.setScatterPlotData(false)
        }
      },
      show(newValue) {
          if(!newValue) {
              this.hide();
          } else {
              this.reactivated();
          }
      }
  },
  mounted : function () {
      this.setLineChartData();
      this.setArgumentTableData(DataStore.methods.getScatterData())
      this.standpoint = this.states[0];
  },
  
}
</script>

<style>

.argumentfield {
    text-align: left;
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 16px;
    font-size: 15px;
}
</style>
