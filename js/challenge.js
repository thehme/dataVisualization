$(function(){

    var dataModel = Backbone.Model.extend({
        initialize:function() {

        }
    });

    var Data = Backbone.Collection.extend({
        model: dataModel,
        url: function() {
            return 'data.json';
        },
        initialize:function() {

        },
        parse:function(response) {
            debugger;
            return response.data;
        }
    });

    var stateModel = Backbone.Model.extend({
        initialize:function() {

        }
    });

    var States = Backbone.Collection.extend({
        model: stateModel,
        url: function() {
            return 'states.json';
        },
        initialize:function() {

        },
        parse:function(response) {
            debugger;
            return response.states.state;
        }
    });

    var appView = Backbone.View.extend({
        initialize:function() {
            debugger;
            this.states = new States();
            this.states.bind('sync',this.procStates,this);
            this.states.fetch();

            this.hdata = new Data();
            this.hdata.bind('sync',this.procData,this);
            this.hdata.fetch(); 

        },
        procStates:function() {
            debugger;
        },
        procData:function() {
            console.log(this);
            for(var i=0; i < this.hdata.length; i++){
                this.hdata.models[i].set({'percentUninsured': (this.hdata.models[i].attributes.number_uninsured/this.hdata.models[i].attributes.population)*100});
                this.hdata.models[i].set({'percentInsured': (this.hdata.models[i].attributes.number_insured/this.hdata.models[i].attributes.population)*100});
            }
            debugger;
        }
    });

    var App = new appView;
});
