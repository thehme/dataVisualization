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
            var _this = this;
            

            //debugger;
            this.states = new States();
            this.states.bind('sync',this.procStates,this);
            this.states.fetch();

            this.hdata = new Data();
            this.hdata.bind('sync',this.procData,this);
            this.hdata.fetch({
                success: function() {
                    _this.render();
                }
            }); 
        },
        procStates:function() {
            //debugger;
            //state data contains state outline polygons
            //but they are not yet in the format required for google maps
            //convert the polygons here to lat/long object collections
            var polygons = new Array();
            this.states.each(function(s){

                var p = {
                    name:s.get('name'),
                    poly:[]
                };

                _.each(s.get('point'),function(ll){
                    p.poly.push({lat:parseFloat(ll.lat),lng:parseFloat(ll.lng)});
                },this);
                polygons.push(p);
            },this);
            console.log(polygons);
            this.makeMap(polygons);
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
            //var xlabels = new Array();
            var plotData = [];
            // Create array from collection's population attributes
            //var statePopulation = new Array();
            // Create array from collection's number insured attributes
            //var stateInsured = new Array();
            // Create array from collection's number uninsured attributes
            //var stateUninsured = new Array();
            
            this.hdata.each(function(model){
                //xlabels.push(model.get('name'));
                plotData.push({
                    xlabel: model.get('name'),
                    statePop: model.get('population'),
                    stateIns: model.get('number_insured'),
                    stateUnins: model.get('number_uninsured')
                });
                //statePopulation.push(model.get('population'));
                //stateInsured.push(model.get('number_insured'))
                //stateUninsured.push(model.get('number_uninsured'))
            },this);

            //console.log(plotData);
            plotData.sort(function(a,b){
                //console.log(a);
                //console.log(a.statePop);
                //console.log(typeof(a.population));
                if(a.statePop < b.statePop){
                    return 1;
                }
                if(a.statePop > b.statePop){
                    return -1;
                } 
                return 0;
            });
            //console.log(plotData);
            
            // HIGHCHARTS MAP
            $('#container1').highcharts({
                title: {
                    text: 'Private Health Insurance Levels By State',
                    x: -20 //center
                },
                xAxis: {
                    // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    //categories: xlabels,
                    categories: plotData.map(function(obj) { return obj.xlabel; }),
                    //type: 'category',
                    //crop: false,
                    //overflow: 'none',
                    //tickInterval: 1,

                    // to rotate xlabels
                    labels: {
                        rotation: 320
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
                    data: plotData.map(function(obj) { return obj.statePop; }),
                    type: 'spline'
                }, {
                    name: 'Insured',
                    data: plotData.map(function(obj) { return obj.stateIns; }),
                    type: 'spline'
                }, {
                    name: 'Uninsured',
                    data: plotData.map(function(obj) { return obj.stateUnins; }),
                    type: 'spline'
                }]
            });
            //debugger;
            //STACKED PLOT
            $('#container2').highcharts({
                chart: {
                    type: 'column',
                    height: 700
                },
                title: {
                    text: 'Private Health Insurance Levels By State'
                },
                xAxis: {
                    categories: plotData.map(function(obj) { return obj.xlabel; }),
                    labels: {
                        rotation: 320
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Population (Millions)'
                    },
                    stackLabels: {
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        }
                    }
                },
                legend: {
                    align: 'right',
                    x: -30,
                    verticalAlign: 'top',
                    y: 25,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: false,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                textShadow: '0 0 3px black'
                            }
                        }
                    }
                },
                series: [{
                    name: 'Insured',
                    data: plotData.map(function(obj) { return obj.stateIns; })
                }, {
                    name: 'Uninsured',
                    data: plotData.map(function(obj) { return obj.stateUnins; })
                }]
            });
        },
        makeMap:function(polygons) {
            //once we have state outlines in polygons we can make a map
            //google map will not load until the html document [DOM]
            //is ready to receive content and fully loaded - so we do document.ready
            //the use of document.ready changes context so we need to use that=this
            //to store the parent context and can access it inside document.ready
            //which is an anonymous closure
            var _this = this;
            //console.log(_this);
            //map code goes here
            $(document).ready(function() {
                //alert("Here!");
                // var mapCanvas = document.getElementById('map');
                // var mapOptions = {
                //     center: new google.maps.LatLng(38, -95),
                //     zoom: 4,
                //     mapTypeId: google.maps.MapTypeId.ROADMAP
                // }
                // var map = new google.maps.Map(mapCanvas, mapOptions);

                map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 4,
                    center: {lat: 38, lng: -95},
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });

                //console.log(polygons[0].poly);
                // Construct the polygon.

                polygons.forEach(function (element, index, array) {
                    statePolygon = new google.maps.Polygon({
                        paths: element.poly,
                        //paths: polygons,
                        //console.log(paths);
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.8,
                        strokeWeight: 3,
                        fillColor: '#FF0000',
                        fillOpacity: 0.35
                    })
                    statePolygon.setMap(map);
                });
                // var statePolygon = new google.maps.Polygon({
                //      paths: polygons[0].poly,
                //      //paths: polygons,
                //      //console.log(paths);
                //      strokeColor: '#FF0000',
                //      strokeOpacity: 0.8,
                //      strokeWeight: 3,
                //      fillColor: '#FF0000',
                //      fillOpacity: 0.35

                // });
                //debugger;
                //console.log(_this);
                //statePolygon.setMap(map);
                
                // // Add a listener for the click event.
                // bermudaTriangle.addListener('click', showArrays);

                // infoWindow = new google.maps.InfoWindow;

                // /** @this {google.maps.Polygon} */
                // function showArrays(event) {
                //   // Since this polygon has only one path, we can call getPath() to return the
                //   // MVCArray of LatLngs.
                //   var vertices = this.getPath();

                //   var contentString = '<b>Bermuda Triangle polygon</b><br>' +
                //       'Clicked location: <br>' + event.latLng.lat() + ',' + event.latLng.lng() +
                //       '<br>';

                //   // Iterate over the vertices.
                //   for (var i =0; i < vertices.getLength(); i++) {
                //     var xy = vertices.getAt(i);
                //     contentString += '<br>' + 'Coordinate ' + i + ':<br>' + xy.lat() + ',' +
                //         xy.lng();
                //   }

                //   // Replace the info window's content and position.
                //   infoWindow.setContent(contentString);
                //   infoWindow.setPosition(event.latLng);

                //   infoWindow.open(map);
                // }
                //console.log(map);
            });
        }
    });

    var App = new appView;
});
