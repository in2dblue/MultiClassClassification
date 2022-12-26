<template>
  <div class="commentsTable">
            
      <v-card-title>
        <v-spacer></v-spacer>
        <v-text-field
          append-icon="search"
          label="Suche"
          single-line
          hide-details
          v-model="search"
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        v-bind:pagination.sync="pagination"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">{{ props.item.text }}</td>
          <td width="30" class="text-xs-center">{{ props.item['Referenzierung'] }}</td>
          <td width="30" class="text-xs-">42</td>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          Keine übereinstimmenden Kommentare für die Suchanfrage: "{{ search }}".
        </v-alert>
      </v-data-table>

  </div>
</template>

<script>
/*
 * @author Jakob Andersen
 */

export default {
  props: ['data'],
  data () {
    return {
      search: '',
      pagination : {'sortBy': '', 'descending': true, 'rowsPerPage': 5},
      headers: [
        {
          text: 'Kommentartext',
          align: 'left',
          sortable: false,
          value: 'text'
        },
        {
            sortable: true, 
            align: 'left',
            text: 'Zitiert',
            value: 'Referenzierung' },
        { 
            align: 'left',
            text: 'Empfehlung', 
            value: 'score' },
      ],
      items: []
    }
  },
  watch : {
      data (newValue) { 
        console.log('-  - update commenttable')
        console.log('- end')
        console.log()


         // Testdaten
        if(newValue.length > 0)
        newValue[0].text = "Ich bin mal gespannt ob sich in den betroffenen Strassenabschnitten überhaupt eine Verbesserung der Luftqualität wird nachweisen können oder ob sich der Zirkus als Luftnummer im Wortsinn entpuppen wird." 
        if(newValue.length > 1)
        newValue[1].text = "...die Welt lacht sich über Deutschland kaputt. Wer schon mal etwas gereist ist und die Zustände im Umweltschutz in USA., China, ....gesehen hat, wird verstehen wie lächelich dieses Geschrei von BUND und Co. in Deutschland ist. Leider schadet es unserer Volkswirtschaft und Wohlstand. Das werden die herrschaften dann merken wenn es zu spät ist. Dann heisst es, das haben wir nicht gewusst. Das tut uns jetzt leid;-) "
        if(newValue.length > 2)
        newValue[2].text = "hätten die da oben früher mit der Umweltrettung angefangen,würde man jetzt nicht Diesel Fahrer nerven."
        if(newValue.length > 3)
        newValue[3].text = "Einfach ignorieren!!"
        if(newValue.length > 4)
        newValue[4].text = "Tja, wir verzwergen uns selbst und arbeiten gegen den Wohlstand. Das alles, weil die EU es so möchte. Die Italiener, die werden sich unter der neuen Regierung nicht mehr soviel sagen lassen, dann sieht die EU ganz schön blöd aus. Den Frust wird Deutschland abbekommen."

        this.items = newValue;

        // Testdaten
      //  if(this.items.length > 0)
      //  this.items[0].text = "Ich bin mal gespannt ob sich in den betroffenen Strassenabschnitten überhaupt eine Verbesserung der Luftqualität wird nachweisen können oder ob sich der Zirkus als Luftnummer im Wortsinn entpuppen wird." 
      //  if(this.items.length > 1)
      //  this.items[1].text = "...die Welt lacht sich über Deutschland kaputt. Wer schon mal etwas gereist ist und die Zustände im Umweltschutz in USA., China, ....gesehen hat, wird verstehen wie lächelich dieses Geschrei von BUND und Co. in Deutschland ist. Leider schadet es unserer Volkswirtschaft und Wohlstand. Das werden die herrschaften dann merken wenn es zu spät ist. Dann heisst es, das haben wir nicht gewusst. Das tut uns jetzt leid;-) "
      //  if(this.items.length > 2)
      //  this.items[2].text = "hätten die da oben früher mit der Umweltrettung angefangen,würde man jetzt nicht Diesel Fahrer nerven."
      //  if(this.items.length > 3)
      //  this.items[3].text = "Einfach ignorieren!!"
      //  if(this.items.length > 4)
      //  this.items[4].text = "Tja, wir verzwergen uns selbst und arbeiten gegen den Wohlstand. Das alles, weil die EU es so möchte. Die Italiener, die werden sich unter der neuen Regierung nicht mehr soviel sagen lassen, dann sieht die EU ganz schön blöd aus. Den Frust wird Deutschland abbekommen."
      }
  }
}
</script>
