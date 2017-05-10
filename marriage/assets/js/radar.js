


//Get the data
$.get('assets/data/aggregated.csv', function(csv) {
    var countries = [];
    var data = [];
    var lines = csv.split('\n');
    $.each(lines, function(lineNo, line) {
        columns = line.split(',')
        if(lineNo>0){
            countries.push(columns[0]);
            data.push(columns.slice(7,12));//series data
   
        }
    });
    //console.log(data[0]);// actual data
    //console.log(countries);

    // Dynamically assign values to the dropdown
    $.each(countries, function(i, p) {
        $('#dropdown-3').append($('<option></option>').val(p).html(p));
    });

    $.each(countries, function(i, p) {
        $('#dropdown-4').append($('<option></option>').val(p).html(p));
    });

    //Populate Starter Charts
    var starters = ['Sweden', 'Mexico'];
    var starterdata = [[],[]];

    // Update the dropdowns to reflect initial selection
    $('#dropdown-3').val(starters[0]);
    $('#dropdown-4').val(starters[1]);

    //Details of the first starter graph
    document.getElementById("country-3").innerHTML = starters[0];
    var countryindex_1 = countries.indexOf(starters[0]);
    starterdata[0].push(data[countryindex_1].map(Number));


    //Details of the second starter graph
    document.getElementById("country-4").innerHTML = starters[1];
    var countryindex_2 = countries.indexOf(starters[1]);
    starterdata[1].push(data[countryindex_2].map(Number));

    //Draw both graphs
    drawCharts(starters,starterdata,['radarchart','columnchart'],["country-3","country-4"]);




});//end of get


function getSelectedCountryradar(selectedcountry, dropdown_id) {
    var selected = selectedcountry.options[selectedcountry.selectedIndex].innerHTML;
    var dropdown_selections =[];
    var countries_data=[[],[]];

    dropdown_selections[0] = $("#dropdown-3").find(":selected").text();
    dropdown_selections[1] = $("#dropdown-4").find(":selected").text();
    //console.log(dropdown_selections);
    
    //Update the chart top title
    $(dropdown_id).val(selected).html(selected);



    $.get('assets/data/aggregated.csv', function(csv) {
        var countries = [];
        var data = [];
        var lines = csv.split('\n');
        var chartdiv = 0
        $.each(lines, function(lineNo, line) {
            columns = line.split(',')
            if(lineNo>0){
                countries.push(columns[0]);
                data.push(columns.slice(7,12));//series data
            }
        });
        //console.log(data);//Finland,male/female, actual data
        //console.log(countries);
        // var countryindex1 = countries.indexOf(selected);
        var countryindex1 = countries.indexOf(dropdown_selections[0]);
        countries_data[0].push(data[countryindex1].map(Number))


        var countryindex2 = countries.indexOf(dropdown_selections[1]);
        countries_data[1].push(data[countryindex2].map(Number))

        // if(dropdown_id == '#country-3'){ chartdiv='radarchart1'}
        // else{chartdiv='radarchart2'};
        chartdiv=['radarchart','columnchart'];


        drawCharts(dropdown_selections,countries_data,chartdiv,["country-3","country-4"]);

    });//end of get
};


function drawCharts(countryname,data,chartdivs,dropdown_id){
    var title = '';
    var categories =  ['Marriage Age', 'School Expectancy', 'Labor Force', 'Fertility rate', 'Contraceptive Use'];
    var series1_name =  countryname[0]; var series1_data = data[0][0];
    var series2_name =  countryname[1]; var series2_data = data[1][0];
    console.log(series1_name,series1_data);
    
    function edit_tooltip(category,number_){
        if(category == 'Marriage Age'){ return 17.6 + (number_ * 1.56)}
        else if(category == 'School Expectancy'){ return 5 + (number_ * 1.13)}
        else if(category == 'Labor Force'){ return 12 + (number_ * 7.4)} 
        else if(category == 'Fertility rate'){ return  (number_ * -6.4)/10 + 7.6}
        else if(category == 'Contraceptive Use'){ return (number_ * 82.8)/10 + 5.6}
        

    else {
                return number_
            }


    };
  
    

//Radar Chart 
    Highcharts.chart(chartdivs[0], {

        chart: {
            polar: true,
            type: 'line',
            backgroundColor: 'transparent',
            style: {
                fontFamily: 'Avenir Black'
            }

        },

        title: {
            text: title,
            x: -80
        },
        subtitle: {
            text: 'Source: http://data.worldbank.org/'
        },
        pane: {
            size: '80%'
        },

        xAxis: {
            categories:categories,
            tickmarkPlacement: 'on',
            lineWidth: 0,
            labels:{
                align:'center',
                overflow:'justify'
            }
        },

        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0,
            max: 10,
            labels:{
                enabled: false
            }
        },
        zAxis:{
            min: 0,
            max: 10,
            showFirstLabel: false
        },



        legend: {
            align: 'center',
            verticalAlign: 'bottom',
            // y: 70,
            layout: 'horizontal'
        },
        // colors: ['#7d97a3', '#0c1f28'],


        series: [{
            name: series1_name,
            data: series1_data,
            pointPlacement: 'on'

        },{
            name: series2_name,
            data: series2_data,
            pointPlacement: 'on'
        }

        ],
        tooltip: {
            // pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.1f}</b><br/>'

            formatter: function () {
                return '<span>' + this.series.name + ': <b>' + Highcharts.numberFormat(Math.abs(edit_tooltip(this.point.category,this.point.y)), 2)+'</b><br/>';
            }

        },

    });

//draw column chart
Highcharts.chart(chartdivs[1], {
    chart: {
        type: 'column',
        style: {
                fontFamily: 'Avenir Black'
            }
    },
    title: {
        text: ''
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        categories: categories,
        crosshair: true
    },
    yAxis: {
        min: 0,
        max: 10,
        title: {
            text: 'Values'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        // pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        //     '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        // footerFormat: '</table>',
        shared: true,
        useHTML: true,

        formatter: function () {
                return '<tr><td style="color:' + this.series.color + ';padding:0">' + this.series.name + ':</td>' +
                    '<td style="padding:0"><b>' + Highcharts.numberFormat(Math.abs(this.point.y), 0)+'</b></td></tr>';
            }








    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    // colors: ['#7d97a3', '#0c1f28'],
    series: [{
        name: series1_name,
        data: series1_data

    }, {
        name: series2_name,
        data: series2_data

    }]
});



};//end of drawCharts











    

