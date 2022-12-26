<template>
  <div class="hello">
      <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      v-model="selected"
      v-bind:pagination.sync="pagination"
      item-key="key"
      hide-actions
      class="elevation-1"
    >
      <template slot="headerCell" slot-scope="props">
        <v-tooltip bottom>
          <span slot="activator">
            {{ props.header.text }}
          </span>
          <span>
            {{ props.header.text }}
          </span>
        </v-tooltip>
      </template>
      <template slot="items" slot-scope="props" >
        <td>
          <v-checkbox
            v-show="!(props.item.value == 0 && !props.selected)"
            primary
            hide-details
            v-model="props.selected"
          ></v-checkbox>
        </td>
        <td class="text-xs-left"> <font :color="props.item.value == 0 ? 'grey' : 'black'">{{ props.item.key }}</font></td>
        <td class="text-xs-center"><font :color="props.item.value == 0 ? 'grey' : 'black'">{{ props.item.value }}</font></td>

      </template>
    </v-data-table>
  </div>
</template>

<script>
/*
 * @author Jakob Andersen
 */

export default {
  props: ['data'],
  data() {
    return {
      search: "",
      init: false,
      items : [],
      selected: [],
      pagination : {'sortBy': 'value', 'descending': true, 'rowsPerPage': -1},
      headers: [
        { text: "", sortable: false,},
        {
          text: "Thema",
          align: "left",
          sortable: true,
          value: "key"
        },
        { text: "Kommentare", value: "value" }
      ],
      i: function() {
        return this.$store.state.timeDimSwitch;
      }
    };
  },
  methods: {
    ccc () {
      this.selected = [];
    }
  },
  watch: {
    data(newValue) {
      this.init = true;
      this.items = newValue;
      this.selected = [];
    },
    selected : function (newValue) {
      if(!this.init) {
       this.$emit('selectedTopics', newValue); 
      }
      this.init = false;       
    }    
  },
  mounted: function() {
    this.$emit('topicCount', this.items.length);
  }
};
</script>
