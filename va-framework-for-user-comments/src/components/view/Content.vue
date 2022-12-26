<template>
    <div class="conten-">

        <v-container class="py-0 px-0 elevation-2" fluid="fluid" >
            <v-layout wrap>
                <v-flex xs12>
                    <v-card style="background-color: lightgray;">
                        <v-card-text>
                            <h1 class="text-xs-left">
                                <v-icon >equalizer</v-icon> 
                                Bezugsebene 
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
                                        <v-card-title class="headline">Bedienung der Ansicht: Bezugsebene</v-card-title>
                                        
                                        <img src="@/assets/B_Hilfe.png" width="700px">

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
                <v-flex xs6>
                    <v-card class="elevation-0" style="background-color: #e8e8e8;">
                        <v-card-text>
                            <v-layout>
                                <v-flex xs12>
                                    <v-card height="20px" style="background-color: lightgray;">        
                                        <h2> Adressat </h2>
                                    </v-card>
                                    
                                    <v-card  height="300px" class="elevation-1">       
                                        <!--### -->
                                        <d3-bar2 :msg="svgId1" :data="data1" :close="closeEl1" @barSelection="selection1 = $event" @clickEvent="click()" ></d3-bar2>
                                        <!-- <d3-bar :msg="svgId1"></d3-bar> -->
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs6>
                    <v-card class="elevation-0" style="background-color: #e8e8e8;">
                        <v-card-text>
                            <v-layout>
                                <v-flex xs12>
                                    <v-card height="20px" style="background-color: lightgray;">        
                                        <h2> Thema </h2>
                                    </v-card>
                                    <v-card  height="300px" class="elevation-1"> 
                                        <!--### -->
                                        <d3-bar2  :msg="svgId2" :data="data2" :close="closeEl2" @barSelection="selection2 = $event" @clickEvent="click()" ></d3-bar2>
                                        <!--<d3-bar :msg="svgId2"></d3-bar>-->
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs12>
                    <v-card class="elevation-0 pt-0" style="background-color: #e8e8e8;">
                        <v-card-text class="pt-0">
                            <v-layout>
                                <v-flex xs12>
                                    <v-card height="20px" style="background-color: lightgray;">        
                                        <h2> Aktive Filter </h2>
                                    </v-card>
                                    <v-card  height="70px" class="elevation-1 scroll-y"> 
                                        <!-- Authers -->
                                            <div align="left">
                                                <v-chip small close v-for="(el) in selection1" :key="el.key" @input="chipClose1(el)" >
                                                    <v-avatar>
                                                        <v-icon>group</v-icon>
                                                    </v-avatar>
                                                    {{ el }}
                                                </v-chip>

                                                <v-chip small close v-if="selection1.length > 1" @input="selection1.splice(0, selection1.length);">
  
                                                {{ selection1.length + 'x' }}
                                                </v-chip>

                                                <v-divider v-show="selection2.length > 0"></v-divider>

                                                <v-chip small close v-for="(el) in selection2" :key="el.key" @input="chipClose2(el)">
                                                    <v-avatar>
                                                        <v-icon>subject</v-icon>
                                                    </v-avatar>
                                                    {{ el }}
                                                </v-chip>

                                                <v-chip small close v-if="selection2.length > 1" @input="selection2.splice(0, selection2.length);">
                                      
                                                {{ selection2.length + 'x' }}
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

import D3BarChart2 from "./../representations/D3BarChart2"
import DataStore from './../../data/DataStore'; 

export default {
  props: ['show'],
  name: "conten-",
  components: {
    "d3-bar2": D3BarChart2
  },
  data() {
    return {
          clearMode : false,
          svgId1: 'myBarChart1',
          svgId2: 'myBarChart2',
          selection1: [],
          selection2: [],
          data1 :[],
          data2 : [],
          closeEl1: '',
          closeEl2: '',

          dialog: false,
    }
  
  }, 
  mounted () {
    this.data1 = DataStore.methods.getDataBarChartAdresses();
    this.data2 = DataStore.methods.getDataBarChartTopics();
  },
  methods : {
      hide() {
          this.clear();
          this.$emit('hide', false);
      },
      clear() {
          if(this.selection1.length > 0 || this.selection2.length > 0) {
            this.selection1.splice(0, this.selection1.length);
            this.selection2.splice(0, this.selection2.length);

            DataStore.methods.setFilterContentTopics([]);
            DataStore.methods.setFilterContentTopics([]);

            this.triggerChangeEvent()
          }
      },
      reactivated() {
          DataStore.methods.setcfAllTopics();
          DataStore.methods.setcfAllAddresses();
          DataStore.methods.cfContentAll();
          this.updateView();
      },
      click() {
          this.triggerChangeEvent()
      },
      triggerChangeEvent() {
          this.$store.state.contendViewChanged = !this.$store.state.contendViewChanged;
      },
      chipClose1(el) {
          this.closeEl1 = el;
          var i = this.selection1.indexOf(el);
          if(i > -1) {
              this.selection1.splice(i, 1);
          }
      },
      chipClose2(el) {
          this.closeEl2 = el;
          var i = this.selection2.indexOf(el);
          if(i > -1) {
              this.selection2.splice(i, 1);
          }
      },
      updateView() {
            console.log('- selectionViewChanged')

            DataStore.methods.setFilterContentAddresses(this.selection1);
            DataStore.methods.setFilterContentTopics(this.selection2);

            this.data1 = DataStore.methods.getDataBarChartAdresses();
            this.data2 = DataStore.methods.getDataBarChartTopics();
      }
  }, 
  computed : {
    selectionViewChanged () {
         return this.$store.state.selectionViewChanged;
    },
  }, watch : {
      show (newValue) {
          if(!newValue) {
              this.clear();
          } else {
              this.reactivated();
          }
      },
      selectionViewChanged () {
          DataStore.methods.setcfAllTopics();
          DataStore.methods.setcfAllAddresses();
          DataStore.methods.cfContentAll();

          if(this.show) {
            this.updateView();
          }

          this.triggerChangeEvent()
      },
      selection1 (newValue) {
        DataStore.methods.setFilterContentAddresses(newValue);
        this.data2 = DataStore.methods.getDataBarChartTopics();
      },
      selection2 (newValue) {
        DataStore.methods.setFilterContentTopics(newValue);
        this.data1 = DataStore.methods.getDataBarChartAdresses();
      }
  }
}
</script>