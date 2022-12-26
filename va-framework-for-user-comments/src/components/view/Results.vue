<template>
    <div class="indicatord">

        <v-container class="py-0 px-0 elevation-2" fluid="fluid" >
            <v-layout wrap>
                <v-flex xs12>
                    <v-card style="background-color: lightgray;">
                        <v-card-text>
                            <h1 class="text-xs-left"> 
                                <v-icon>insert_comment</v-icon> 
                                Ausgewählte Kommentare 
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
                                        <v-card-title class="headline">Bedienung der Ansicht: Ausgewählte Kommentare </v-card-title>
                                        
                                        <img src="@/assets/AQ_Hilfe.png" width="700px">

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
                                        <h2> Schlüsselworte nach Häufigkeit </h2>
                                    </v-card>
                                    <v-card  class="elevation-1">
                                        <d3-wordcloud :data="cloudData"></d3-wordcloud>
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs12>
                    <v-card class="elevation-0" style="background-color: #e8e8e8;">
                        <v-card-text class="pt-0">
                            <v-layout >
                                <v-flex xs12>
                                    <v-card height="20px" style="background-color: lightgray;">        
                                        <h2> Kommentare </h2>
                                    </v-card>
                                    <v-card  class="elevation-1"> 
                                        <comments-table :data="commentsData"></comments-table>
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>

    </div>
</template>

<script>
/*
 * @author Jakob Andersen
 */
import D3WordCloud from './../representations/D3WordCloud'
import TableComments from './../representations/TableComments'

import DataStore from './../../data/DataStore'; 

export default {
  props: ['show'],
  name: "results",
  components: {
    'd3-wordcloud' : D3WordCloud,
    'comments-table' : TableComments,
  },
  data() {
    return {
        debug : {},
        commentsData : [],
        cloudData : [],

        dialog: false,
    }
    
  }, 
  methods : {
      hide() {
          this.clear();
          this.$emit('hide', false);
      },
      clear() {

      },
      reactivated() {
          this.updateView()
      },
      updateView() {
         console.log('- indicatorViewChanged')
         this.setCommentsData();
      },
      setCommentsData() {
          this.commentsData = DataStore.state.indicators.allFiltered()
      },
      setCloudData() {
          this.cloudData = ['hugo'] 
      }
  },
  computed : {
      trigger () {
        return this.$store.state.indicatorViewChanged;
      }
  },
  watch : {
      trigger () {
         if(this.show) {
            this.updateView()
         }
         this.debug = DataStore.state.allFilters;
          // keine weitere ansicht
      },
      show(newValue) {
          if(!newValue) {
              this.hide();
          } else {
              this.reactivated();
          }
      }
  },
  mounted() {
      this.setCommentsData();
      this.setCloudData();
  }
  
}
</script>

<style>


</style>
