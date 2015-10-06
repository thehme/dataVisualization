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
            //debugger;
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
            //debugger;
            return response.states.state;
        }
    });

    var appView = Backbone.View.extend({
        initialize:function() {
            //debugger;
            this.states = new States();
            this.states.bind('sync',this.procStates,this);
            this.states.fetch();

            this.hdata = new Data();
            this.hdata.bind('sync',this.procData,this);
            this.hdata.fetch(); 
            this.render();

        },
        procStates:function() {
            //debugger;
        },
        procData:function() {
            //console.log(this);
            //each method provided by underscore.js
            this.hdata.each(function(model){
                //console.log((model.attributes.number_uninsured/model.attributes.population)*100);
                model.set({'percentUninsured': (model.attributes.number_uninsured/model.attributes.population)*100});
                model.set({'percentInsured': (model.attributes.number_insured/model.attributes.population)*100});
            },this);
            //for(var i=0; i < this.hdata.length; i++){
              //  this.hdata.models[i].set({'percentUninsured': (this.hdata.models[i].attributes.number_uninsured/this.hdata.models[i].attributes.population)*100});
              //  this.hdata.models[i].set({'percentInsured': (this.hdata.models[i].attributes.number_insured/this.hdata.models[i].attributes.population)*100});
            //}
        },
        render: function(){
            // Create array from collection's name attributes
            var xlabels = new Array();
            this.hdata.each(function(model){
                xlabels.push(model.get('name'));
            },this);
            //console.log(xlabels);

            // Create array from collection's population attributes
            var statePopulation = new Array();
            this.hdata.each(function(model){
                //console.log(model.get('population'));
                statePopulation.push(model.get('population'));
            },this);

            // Create array from collection's number insured attributes
            var stateInsured = new Array();
            this.hdata.each(function(model){
                stateInsured.push(model.get('number_insured'))
            }, this);

            // Create array from collection's number uninsured attributes
            var stateUninsured = new Array();
            this.hdata.each(function(model){
                stateUninsured.push(model.get('number_uninsured'))
            }, this);

            $('#container').highcharts({
                title: {
                    text: 'Private Health Insurance Levels By State',
                    x: -20 //center
                },
                xAxis: {
                    // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    categories: xlabels,
                    //type: 'category',
                    //crop: false,
                    //overflow: 'none',
                    //tickInterval: 1,

                    // to rotate xlabels
                    labels: {
                        rotation: 70
                    }
                },
                yAxis: {
                    title: {
                        text: 'Population (Millions)'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [{
                    name: 'Population',
                    data: statePopulation,
                    type: 'spline'
                }, {
                    name: 'Insured',
                    data: stateInsured,
                    type: 'spline'
                }, {
                    name: 'Uninsured',
                    data: stateUninsured,
                    type: 'spline'
                }]
            });
            //debugger;
        }

    });

    var App = new appView;
});
