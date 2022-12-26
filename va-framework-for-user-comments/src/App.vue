<template>
  <div id="app">
    <v-app>
      <head>
          <!-- Vuetify import -->
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
      </head>
          <link href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' rel="stylesheet">
          <link href="https://unpkg.com/vuetify@1.0.0/dist/vuetify.min.css" rel="stylesheet">
      <!-- Kopfzeile -->
      <header>
        <v-container style="max-width:1200px; min-width:1200px;">
          <v-toolbar dark color="primary">
            <v-toolbar-title class="white--text">Visuelle Kommentaranalyse</v-toolbar-title>
  
            <v-spacer></v-spacer>

        <v-menu :close-on-content-click="false" nudge-top=-40 :nudge-width="200" v-model="menu3">
              <v-btn color="indigo" dark slot="activator">Ablage</v-btn>
              <v-card>
                <v-list>
                  <v-list-tile avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>Ablageoptionen</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
                <v-divider></v-divider>
                  <v-list class="">
                    <template v-for="(item) in items">
                      <v-list-tile v-if="item.action" :key="item.title" @click="item.click">
                        <v-list-tile-action>
                          <v-icon>{{ item.action }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content class="black--text">
                          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </template>
                  </v-list>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn flat @click="menu3 = false">Schließen</v-btn>
                </v-card-actions>
              </v-card>
        </v-menu>

        <v-menu :close-on-content-click="false" nudge-top=-40 :nudge-width="200" v-model="menu2">
              <v-btn color="indigo" dark slot="activator">Kanal</v-btn>
              <v-card>
                <v-list>
                  <v-list-tile avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>Kanalauswahl</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
                <v-divider></v-divider>
                <v-list>
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-switch v-model="todo0" color="primary"></v-switch>
                    </v-list-tile-action>
                    <v-list-tile-title> <v-icon >message</v-icon> Kommentarsektion </v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-switch v-model="todo1" color="primary"></v-switch>
                    </v-list-tile-action>
                    <v-list-tile-title> <v-icon >email</v-icon> E-Mail</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-switch v-model="todo2" color="primary"></v-switch>
                    </v-list-tile-action>
                    <v-list-tile-title><v-icon>cloud</v-icon> Twitter</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-switch v-model="todo3" color="primary"></v-switch>
                    </v-list-tile-action>
                    <v-list-tile-title><v-icon>face</v-icon> Facebook</v-list-tile-title>
                  </v-list-tile>
                </v-list>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn flat @click="menu2 = false">Schließen</v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>

            <!-- Knöpfe -->
            <v-menu :close-on-content-click="false" nudge-top=-40 :nudge-width="200" v-model="menu">
              <v-btn color="indigo" dark slot="activator">Ansicht</v-btn>
              <v-card>
                <v-list>
                  <v-list-tile avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>Ansichtenauswahl</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
                <v-divider></v-divider>
                <v-list>
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-switch v-model="showArticle" color="primary"></v-switch>
                    </v-list-tile-action>
                    <v-list-tile-title> <v-icon >find_in_page</v-icon> Artikelauswahl</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-switch v-model="showContent" color="primary"></v-switch>
                    </v-list-tile-action>
                    <v-list-tile-title> <v-icon >equalizer</v-icon> Bezugsebene </v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-switch v-model="showSentiment" color="primary"></v-switch>
                    </v-list-tile-action>
                    <v-list-tile-title><v-icon>thumbs_up_down</v-icon> Meinungsbild </v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-switch v-model="showIndicators" color="primary"></v-switch>
                    </v-list-tile-action>
                    <v-list-tile-title><v-icon>tune</v-icon> Qualität </v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-switch v-model="showResults" color="primary"></v-switch>
                    </v-list-tile-action>
                    <v-list-tile-title><v-icon>insert_comment</v-icon> Ausgewählte Kommentare</v-list-tile-title>
                  </v-list-tile>
                </v-list>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn flat @click="menu = false">Schließen</v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>

          </v-toolbar>
        </v-container>
      </header>

      <body>

        <v-container class="pt-0" style="max-width:1200px; min-width:1200px;">
          
          <overview-and-selection v-show="showArticle" @hide="showArticle = $event" :show="showArticle"></overview-and-selection>
          <content- v-show="showContent" @hide="showContent = $event" :show="showContent"></content->
          <sentiment v-show="showSentiment" @hide="showSentiment = $event" :show="showSentiment"></sentiment>
          <indicators v-show="showIndicators" @hide="showIndicators = $event" :show="showIndicators" ></indicators>
          <results v-show="showResults" @hide="showResults = $event" :show="showResults"></results>

          <v-alert dark :value="alert" type="info" transition="scale-transition" >
            Weitere Ansichten sind unter dem Menüpunkt <b>"Ansicht"</b> auswählbar. 
          </v-alert>

        </v-container>
      </body>
    </v-app>
  </div>
</template>

<script>
/*
 * @author Jakob Andersen
 */

import OverviewAndSelection from "./components/view/OverviewAndSelection";
import Content from "./components/view/Content";
import Sentiment from "./components/view/Sentiment";
import Indicators from "./components/view/Indicators";
import Results from "./components/view/Results"

import Vue from 'vue';
import crossfilter from 'crossfilter2';
import * as d3 from "d3";

import DataStore from './data/DataStore'; 

export default {
  name: "App",
  components: {
    'overview-and-selection': OverviewAndSelection,
    'content-' : Content,
    'sentiment' : Sentiment,
    'indicators' : Indicators,
    'results' : Results,
  }, 
  data () {
      return {
        showArticle: true,
        showContent: false,
        showSentiment : false,
        showIndicators : false,
        showResults : false,

        alert: true,

        menu : false,
        menu2 : false,
        menu3 : false,

        todo0 : true,
        todo1 : true,
        todo2 : true,
        todo3 : true,

        items: [
      {
        action: 'delete',
        title: 'Neu',
        click : () =>  { 
        },
      },
      {
        action: 'archive',
        title: 'Speichern...',
        click :() => { },
      },
       {
        action: 'unarchive',
        title: 'Öffnen...',
        click :() => { },
      }
      
    ]
      }
    },
   watch : {
     menu () {
       this.alert = false;
     }
   },
   methods: { 
     newData () {
       this.$store.commit('newData');
     }
   }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
