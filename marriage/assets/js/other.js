


function getSelectedCountry(selectedcountry, dropdown_id) {
    var selected = selectedcountry.options[selectedcountry.selectedIndex].innerHTML;

    //Update the chart top title
    $(dropdown_id).val(selected).html(selected);

    //console.log(selected);
    $.get('assets/data/marriage_ages2.csv', function(csv) {
        var countries = [];
        var data = [];
        var lines = csv.split('\n');
        var chartdiv = 0
        $.each(lines, function(lineNo, line) {
            columns = line.split(',')
            if(lineNo>0){
                countries.push(columns[0]);
                genderslices = [[],[]];
                genderslices[0].push(columns.slice(3,10));//male slice
                genderslices[1].push(columns.slice(15,22)); //female slice
                data.push(genderslices)        
            }
        });
        //console.log(data[0][1][0]);//Finland,male/female, actual data
        // console.log(countries);
        var countryindex = countries.indexOf(selected);
        console.log(dropdown_id);

        if(dropdown_id == '#country-1'){ chartdiv='highchart_container_1'}
        else{chartdiv='highchart_container_2'};
        drawColumnChart(selected,data[countryindex],chartdiv);
    });//end of get
};

function negate(mylist){
    var otherlist = []
    mylist = mylist.map(Number)
    for(i = 0; i < mylist.length; i++){
        otherlist.push(-(mylist[i]));
    };
    return otherlist;
};
function drawColumnChart(countryname,data,highchartdiv){
    // male_slice = [ -2.5, -2.7, -3.1, -3.2,
    //             -3.0, -3.2, -4.3, -4.4, -3.6, -3.1, -2.4,
    //             -2.5, -2.3, -1.2, -0.6, -0.2, -0.0, -0.0];
    // female_slice =[2.4, 2.6, 3.0, 3.1, 2.9,
    //             3.1, 4.1, 4.3, 3.6, 3.4, 2.6, 2.9, 2.9,
    //             1.8, 1.2, 0.6, 0.1, 0.0];
    // countryname = 'Germany';

    male_slice = negate(data[0][0]);
    female_slice = data[1][0].map(Number);
    var categories = ['15-19',
        '20-24', '25-29', '30-34', '35-39', '40-44',
        '45-49', '50-54',
        ];

    //console.log(male_slice);
    //console.log(female_slice);



    Highcharts.chart(highchartdiv, {
        chart: {
            type: 'bar',
            style: {
                fontFamily: 'Avenir Black'
            }
        },
        title: {
            text: '% of Married Persons per Age-group in  '+ countryname
        },
        subtitle: {
            text: 'Source: http://data.worldbank.org/'
        },
        xAxis: [{
            categories: categories,
            reversed: false,
            labels: {
                step: 1
            }
        }, { // mirror axis on right side
            opposite: true,
            reversed: false,
            categories: categories,
            linkedTo: 0,
            labels: {
                step: 1
            }
        }],
        yAxis: {
            title: {
                text: null
            },
            labels: {
                formatter: function () {
                    return Math.abs(this.value) + '%';
                }
            },
            min:-100,
            max:100
        },

        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },

        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + ',  aged ' + this.point.category + '</b><br/>' +
                    'Married: ' + Highcharts.numberFormat(Math.abs(this.point.y), 0)+'%';
            }
        },
        colors: ['#7d97a3', '#0c1f28'],

        series: [{
            name: 'Male',
            data: male_slice
        }, {
            name: 'Female',
            data: female_slice
        }]
    });
};//end of drawColumnChart




//Populate Starter Charts
$(document).ready(function () {
var starters = ['Sweden', 'Mexico'];
    $.get('assets/data/marriage_ages2.csv', function(csv) {
        var countries = [];
        var data = [];
        var lines = csv.split('\n');
        var chartdiv = 0
        $.each(lines, function(lineNo, line) {
            columns = line.split(',')
            if(lineNo>0){
                countries.push(columns[0]);
                genderslices = [[],[]];
                genderslices[0].push(columns.slice(3,10));//male slice
                genderslices[1].push(columns.slice(15,22)); //female slice
                data.push(genderslices)        
            }
        });
        //console.log(data[0][1][0]);//Finland,male/female, actual data
        // console.log(countries);

        //Draw the first starter graph
        document.getElementById("country-1").innerHTML = starters[0];
        var countryindex_1 = countries.indexOf(starters[0]);
        drawColumnChart(starters[0],data[countryindex_1],'highchart_container_1');


        //Draw the second starter graph
        document.getElementById("country-2").innerHTML = starters[1];
        var countryindex_2 = countries.indexOf(starters[1]);
        drawColumnChart(starters[1],data[countryindex_2],'highchart_container_2');

            // Dynamically assign values to the dropdown
        $.each(countries, function(i, p) {
            $('#dropdown-1').append($('<option></option>').val(p).html(p));
        });

        $.each(countries, function(i, p) {
            $('#dropdown-2').append($('<option></option>').val(p).html(p));
        });




    });//end of get

});






