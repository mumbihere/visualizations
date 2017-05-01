
// Data gathered from http://populationpyramid.net/germany/2015/


//Get the data
$.get('assets/data/aggregated.csv', function(csv) {
    var countries = [];
    var data = [];
    var lines = csv.split('\n');
    $.each(lines, function(lineNo, line) {
        columns = line.split(',')
        if(lineNo>0){
            countries.push(columns[0]);
            data.push(columns.slice(1,6));//series data
   
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
    var starters = ['Panama', 'Qatar'];

    //Draw the first starter graph
    document.getElementById("country-3").innerHTML = starters[0];
    var countryindex_1 = countries.indexOf(starters[0]);
    drawRadarChart(starters[0],data[countryindex_1].map(Number),'radarchart1');


    //Draw the second starter graph
    document.getElementById("country-4").innerHTML = starters[1];
    var countryindex_2 = countries.indexOf(starters[1]);
    drawRadarChart(starters[1],data[countryindex_2].map(Number),'radarchart2');




});//end of get


function getSelectedCountry(selectedcountry, dropdown_id) {
    var selected = selectedcountry.options[selectedcountry.selectedIndex].innerHTML;

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
                data.push(columns.slice(1,6));//series data
            }
        });
        //console.log(data);//Finland,male/female, actual data
        //console.log(countries);
        var countryindex = countries.indexOf(selected);
        //console.log(dropdown_id);

        if(dropdown_id == '#country-3'){ chartdiv='radarchart1'}
        else{chartdiv='radarchart2'};
        drawRadarChart(selected,data[countryindex].map(Number),chartdiv);

    });//end of get
};


function drawRadarChart(countryname,data,radarchartdiv){
    var title = '';
    var categories =  ['Age when they marry', 'School Expectancy', 'Labor Force Participation', 'Fertility rate(per every 10 women)', 'Contraceptive Use'];
    var series1_name =  countryname;
    var series1_data = data;

//Radar Chart 1
    Highcharts.chart(radarchartdiv, {

        chart: {
            polar: true,
            type: 'line',
            backgroundColor: 'transparent'

        },

        title: {
            text: title,
            x: -80
        },

        pane: {
            size: '80%'
        },

        xAxis: {
            categories:categories,
            tickmarkPlacement: 'on',
            lineWidth: 0
        },

        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0
        },

        tooltip: {
            shared: true,
            pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>'
        },

        legend: {
            align: 'right',
            verticalAlign: 'top',
            y: 70,
            layout: 'vertical'
        },

        series: [{
            name: series1_name,
            data: series1_data,
            pointPlacement: 'on'
        }]

    });  
};//end of drawRadarChart




//Populate Starter Charts
$(document).ready(function () {
    var starters = ['Panama', 'Qatar'];
    console.log('hii ni nini');

    $.get('assets/data/aggregated.csv', function(csv) {
        var countries = [];
        var data = [];
        var lines = csv.split('\n');
        var chartdiv = 0
        $.each(lines, function(lineNo, line) {
            columns = line.split(',')
            if(lineNo>0){
                countries.push(columns[0]);
                data.push(columns.slice(1,6));//series data
            }
        });
        //console.log(data[0][1][0]);//Finland,male/female, actual data
        //console.log(countries);

        //Draw the first starter graph
        document.getElementById("country-3").innerHTML = starters[0];
        var countryindex_1 = countries.indexOf(starters[0]);
        drawRadarChart(starters[0],data[countryindex_1],'radarchart1');


        //Draw the second starter graph
        document.getElementById("country-4").innerHTML = starters[1];
        var countryindex_2 = countries.indexOf(starters[1]);
        drawRadarChart(starters[1],data[countryindex_2],'radarchart2');
    });//end of get

});





    

