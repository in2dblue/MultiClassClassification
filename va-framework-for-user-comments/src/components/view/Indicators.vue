<template>
    <div class="indicatord">
        <v-container class="py-0 px-0 elevation-2" fluid="fluid" >
            <v-layout wrap>
                <v-flex xs12>
                    <v-card style="background-color: lightgray;">
                        <v-card-text>
                            <h1 class="text-xs-left">
                                <v-icon>tune</v-icon>
                                 Qualität 
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
                                        <v-card-title class="headline">Bedienung der Ansicht: Qualität</v-card-title>
                                        
                                        <img src="@/assets/Q_Hilfe.png" width="700px">

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
                        <v-card-text>
                            <v-layout>
                                <v-flex xs12>
                                    <v-card height="20px" style="background-color: lightgray;">        
                                        <h2> Auswahlkriterien </h2>
                                    </v-card>
                                    <v-card class="elevation-1"> 
                                        
                                        <d3-horizontalBar :msg="svgId2" :data="data1" :color="color1" @selection="handleSelection1($event)" @click="backClicked()"></d3-horizontalBar>
                                        <d3-horizontalBar :msg="svgId1" :data="data2" :color="color2" @selection="handleSelection2($event)" @click="backClicked()"></d3-horizontalBar>
                                        <d3-horizontalBar :msg="svgId3" :data="data3" :color="color3" @selection="handleSelection3($event)" @click="backClicked()"></d3-horizontalBar>
                                        
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs12>
                    <v-card class="elevation-0" style="background-color: #e8e8e8;">
                        <v-card-text class="pt-0">
                            <v-layout>
                                <v-flex xs12>
                                    <v-card height="20px" style="background-color: lightgray;">        
                                        <h2> Charakteristika </h2>
                                    </v-card>
                                    <v-card  height="400px" class="elevation-1">       
                                        <!--### -->
                                       <d3-parallelCoordinates :data="parallelCoordinatedData" :event="changeEvent" :mode="changeModeSwap" @brushes="parallelBrushes = $event" @lastBrush="handleParallelBrush($event)" @activeBrushes="handleActiveBrushes($event)"></d3-parallelCoordinates>
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

import D3ParallelCoordinates from "./../representations/D3ParallelCoordinates"
import D3HorizontalStackedBarChart from "./../representations/D3HorizontalStackedBarChart"

import DataStore from './../../data/DataStore'; 

export default {
  props: ['show'],
  name: "indicatord",
  components: {
        'd3-parallelCoordinates': D3ParallelCoordinates,  
        'd3-horizontalBar': D3HorizontalStackedBarChart    
  },
  data() {
    return {
        svgId1 : "horizontalBar1",
        svgId2 : "horisontalBar2",
        svgId3 : "horizontalBar3",

        dialog: false,

        parallelBrushes : [],
        oldBrushes: [],

        changeEvent : true,
        changeModeSwap : true, // Brush behalten
        
        selection1 : [],
        selection2 : [],
        selection3 : [],
        
        label1 : ['On-Topic', 'Meta', 'Off-Topic'],
        label2 : ['Konform', 'Spam', 'Ungeeignet', 'Diskriminierend'],
        label3 : [ "Persönliche Ansichten", "Feedback", "Neue Argumente", "Fehlermeldungen", "URL-Verweise" ],
        
        parallelCoordinatedData : [],

        data1 : [
            {
                "type": "Artikelbezug",
                "On-Topic": 0,
                "Meta": 0,
                "Off-Topic": 0,
           }
       ],
        data2 : [
            {
                "type": "Etikette",
                "Konform": 0,
                "Spam": 0,
                "Ungeeignet":0,
                "Diskriminierend": 0,  
           }
        ],
        data3 : [
            {
                "type": "Originalität",
                "Persönliche Ansichten": 0,
                "Feedback": 0,
                "Neue Argumente": 0,
                "Fehlermeldungen" : 0,
                "URL-Verweise": 0
           }
        ],
        color1 : ["#4daf4a","#377eb8", "#e41a1c"],
        color2 : ["#4daf4a","#ffff33","#ff7f00", "#e41a1c"],
        color3 : ["#984ea3", "#377eb8", "#6a3d9a", "#935673", "#999999",]  ,
    }
  }, methods : {
      hide() {
          this.clear();
          this.$emit('hide', false);
      },
    clear() {
        DataStore.methods.setDiscIndicatorsReferenceFilter([]);
        DataStore.methods.setDiscIndicatorsEtiquetteFilter([])
        DataStore.methods.setDiscIndicatorsContentFilter([])

       this.data1 = [this.getNewData1(), true];
       this.data2 = [this.getNewData2(), true];
       this.data3 = [this.getNewData3(), true];

       this.selection1 = [];
       this.selection2 = [];
       this.selection3 = [];

       this.setParallelCoordinatesData(true);
       DataStore.methods.releaseClound();      
    },
    reactivated() {
        this.updateView();
    },
    updateView() {
        console.log('- opinionViewChanged')  
            
            DataStore.methods.setDiscIndicatorsReferenceFilter(this.selection1.map(d => this.label1.indexOf(d))); 
            DataStore.methods.setDiscIndicatorsEtiquetteFilter(this.selection2.map(d => this.label2.indexOf(d)));
            DataStore.methods.setDiscIndicatorsContentFilter(this.selection3.map(d => this.label3.indexOf(d)));

            this.data1 = [this.getNewData1(), false];
            this.data2 = [this.getNewData2(), false];
            this.data3 = [this.getNewData3(), false];
            
            this.setParallelCoordinatesData();
    },
    backClicked() {
        
    },
    handleActiveBrushes(array) {
            var all = ['Länge', 'Lesbarkeit', 'Informationsdichte', 'Unterhaltungswert', 'Stimmung', 'Referenzierung']

            for(var i = 0; i < array[0].length; i++) {
                all.splice(all.indexOf(array[0][i]), 1);
                DataStore.methods.filterClound(array[0][i], array[1][i], false);   
            }
            for(var j = 0; j < all.length; j++) {
                DataStore.methods.filterClound(all[j], [], true);  
            }
            this.triggerChangeEvent();
    },
    handleParallelBrush(brush) {
     /*   console.log('filter: ' + brush[0])
         DataStore.methods.filterClound(brush[0], brush[1], brush[2]);

        if(this.oldBrushes[brush[0]]) {
             if(JSON.stringify(this.oldBrushes[brush[0]]) != JSON.stringify(brush[1])) {
                 this.triggerChangeEvent();
             }
         } else {
             this.triggerChangeEvent();
         }
         this.oldBrushes[brush[0]] = brush[1];
*/
    },
    handleSelection1 (newValue) {
        this.selection1 = newValue;

        newValue = newValue.map(d => this.label1.indexOf(d));
        DataStore.methods.setDiscIndicatorsReferenceFilter(newValue);
        this.data2 = [this.getNewData2(), false];
        this.data3 = [this.getNewData3(), false];

        this.setParallelCoordinatesData();
      },
      handleSelection2 (newValue) {
        this.selection2 = newValue;

        newValue = newValue.map(d => this.label2.indexOf(d));
        DataStore.methods.setDiscIndicatorsEtiquetteFilter(newValue)
        this.data1 = [this.getNewData1(), false];
        this.data3 = [this.getNewData3(), false];

        this.setParallelCoordinatesData();
      }, 
      handleSelection3 (newValue) {
        this.selection3 = newValue;

        newValue = newValue.map(d => this.label3.indexOf(d));
        DataStore.methods.setDiscIndicatorsContentFilter(newValue)
        this.data1 = [this.getNewData1(), false];
        this.data2 = [this.getNewData2(), false];

        this.setParallelCoordinatesData();
      },
     getNewData(data, label, obj) {
           for(var i = 0; i < label.length; i ++) {
               obj[label[i]] = 0;
           }
           for(var i = 0; i < data.length; i ++) {
               obj[label[data[i].key]] = data[i].value;
           }
        return[obj];
     },
     getNewData1() {
          return this.getNewData(
              DataStore.methods.getDiscIndicatorsReferenceData(),
              this.label1,
            { "type": "Artikelbezug" }
          );
     },
     getNewData2() {
         return this.getNewData(
              DataStore.methods.getDiscIndicatorsEtiquetteData(),
              this.label2,
            { "type": "Etikette" }
          );
     },
     getNewData3() {
         return this.getNewData(
              DataStore.methods.getDiscIndicatorsContentData(),
              this.label3,
            { "type": "Originalität" }
          );
     }, 
     setParallelCoordinatesData(keepBrush) {
         var mode = true;
         if(keepBrush) mode = false;
         this.parallelCoordinatedData = [DataStore.methods.getIndicators(), keepBrush];
     },
     triggerChangeEvent() {
          this.$store.state.indicatorViewChanged = !this.$store.state.indicatorViewChanged;
      },
  },
  computed : {
    sentimentViewChanged() {
      return this.$store.state.sentimentViewChanged;
    }
  },
  watch : {
      show (newValue) {
          if(!newValue) {
              this.clear();
          } else {
              this.reactivated();
          }
      },
      sentimentViewChanged() { 
        if(this.show) {
            this.updateView();
      } else {
          this.triggerChangeEvent();
      }
    },
  }, mounted () {
       this.data1 = [this.getNewData1(), false];
       this.data2 = [this.getNewData2(), false];
       this.data3 = [this.getNewData3(), false];

       this.setParallelCoordinatesData();
  }
}
</script>

