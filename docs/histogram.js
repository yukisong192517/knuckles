function histograms(array,array1,tarray)
{
    var margin ={top: 0, right: 20, bottom: 20, left: 0},
      width = 800,
      height = 800;
    var height1=500;
    //default canvas of histogram
    
   
    var canvas = d3.select("body").append("svg")
                .attr("width",width)
                .attr("height",height)
                .attr("transform","translate(150,100)")
                .attr("class","histogram");
    var xaxisscale = d3.scaleLinear()
                        .domain([0,100])
                        .range([0,width]);
    var yaxisscale = d3.scaleLinear()
                        .domain([100,0])
                        .range([0,height1]);
   
  
   
    var x1=xaxisscale.domain([0,array.length]).range([0,width-150]);
    var xAxis=d3.axisBottom(x1).ticks(array.length).tickFormat(function(d,i){if(i!=array.length){return array[i].agencyname;}
                                                                                else{return ""}});
    var xAxisgroup = canvas.append("g")
                            .attr("transform","translate(50,500)")
                            .call(xAxis);

    var bars= canvas.selectAll(".bars")
                .data(array)
                .enter()
                .append("g")
                .attr("class","bar")
                .on("mouseover",function(d){show(d);})
                .on("click",function(d){
                    show(d);
                    d3.select("#acname").style("visibility", "").text(d.agencyname);    
                    var temptopie= trans(array1[array.indexOf(d)]);
                    d3.select("#tablelayer").remove();
                    piechart(temptopie,tarray);
                    pietable(temptopie);
                    d3.select("#p_title").text("Current Chosen Department:  "+d.agencyname);
                });
                
                //.attr("transform","translate(40,0)");
   var histogramw=width-150; 
   var padding=5;       
 
    bars.append("rect")
        .attr("id",function(d,i){return i;})
        .attr("x",function(d,i){return i*(histogramw/(array.length));})
        .attr("y",function(d,i){if(d.totallifecyclecost<14000){return height1-d.totallifecyclecost/50;}
                                    else{if(d.totallifecyclecost/100<500){return height1-d.totallifecyclecost/100;}else{return height1-500;}}
            })
        .attr("width",function(d){return histogramw/array.length-padding;})
        .attr("height",function(d,i){if(d.totallifecyclecost<14000){return d.totallifecyclecost/50;}
                                    else{if(d.totallifecyclecost/100<500){return d.totallifecyclecost/100;}else{return 500;}}})
        .attr("fill", function(d,i) {return "rgb("+(i *20)+", " + (i *15) + ", "+(i*10)+")";})
        .attr("stroke",function(d,i){if(d.totallifecyclecost<250){return "gray";}})
        .attr("transform","translate(50,0)")
        ;
    
    
    d3.selectAll(".tick > text").style("transform","rotate(90deg)")
                                .attr("x",120).attr("y",-15)
                                .on("mouseover",function(d){show(array[d]);
                                })
                                .on("click",function(d){
                    d3.select("#acname").style("visibility", "").text(array[d].agencyname);             
                   show(array[d]);
                    var temptopie= trans(array1[d]);
                    d3.select("#tablelayer").remove();
                    piechart(temptopie,tarray);
                    pietable(temptopie);
                    d3.select("#p_title").text("Current Chosen Department:  "+array[d].agencyname);

                });
    //table of department
  var dlayer=d3.select("body").append("div").attr("id","desciptionlayer");
  var hdes=dlayer.append("div").attr("id","hdesciptionlayer");
  hdes.append("h2").attr("id","h_header").text("  Table 1: Department and Its Lifecycle Cost");  
  hdes.append("div").attr("id","t_description")
    .text("The table is a literature version of the histogram. Clicking the Agency name could also activate the pie chart and table 2")
    .attr("width","500px;");
    var dp_details=hdes.append("table").attr("id","dep_details");
     var firstrows=dp_details.append("tr");
    firstrows.append("td").text("Agency Name");
    firstrows.append("td").text("Total Life Cycle Cost");
    //sort array
    var dataset1=array.map(function(d){
        return [d.agencyname,d.totallifecyclecost];
    }).sort(function(a,b){return a[1]-b[1];});
    dataset=dataset1.map(function(d){
        return {agencyname:d[0],totallifecyclecost:d[1]}
    });
    
    dataset.forEach(function(d){
        var rows=dp_details.append("tr");
        rows.append("td").attr("id","name").text(d.agencyname).on("click",function(e){
                    d3.select("#acname").style("visibility", "").text(d.agencyname);             
                    show(d);
                    var temptopie= trans(array1[array.findIndex(function(e){return e.agencyname==d.agencyname})]);
                    d3.select("#tablelayer").remove();
                    piechart(temptopie,tarray);
                    pietable(temptopie,tarray);
                    d3.select("#p_title").text("Current Chosen Department:  "+d.agencyname);
                    
                });
        rows.append("td").text(d.totallifecyclecost);
        
    })
}

function show(data){

d3.select("#agencyname")
      .text(data.agencyname);
d3.select("#totallifecost")
      .text(data.totallifecyclecost);
d3.select("#board")
        .style("visibility", "");

}

function pieshow(data,tarray){

d3.select("#bcid")
      .text(data.business_id);
d3.select("#lifecost")
      .text(data.totalbusinesslifecyclecost);
d3.select("#boardpie")
      .style("visibility", "");
if(tarray!=undefined)
{
var cid=data.business_id;
//get the details of each business case (include the Investment title and lifecycle cost)
var cidlifecycle=tarray.reduce(function(clifecost,d){
if(d["Investment Title"]==cid)
    {
        clifecost[d["Project Name"]]=+d["Lifecycle Cost"];
    }
return clifecost;
},{});
var c_arr=Object.entries(cidlifecycle); 
var c_arr1=c_arr.sort(function(x,y)//store these details in the c_arr1
{
    return x[1]-y[1];
});
//show the data of details in each business case
d3.select("#bdescription").style("visibility","").selectAll("#bdescription>span").remove();
d3.select("#bcidsub").text(cid);
c_arr1.forEach(function(d){
d3.select("#bdescription").append("span").text("----------------------------").append("br");
d3.select("#bdescription").append("span").attr("id","investtitle").text("Project Name: "+d.slice(',')[0]).append("br");
d3.select("#bdescription").append("span").attr("id","invest_lc").text("Lifecycle Cost: "+d.slice(',')[1]).append("br");

})

}

}

 function piechart(dataset,tarray)
{
    //var pie=d3.layout.pie();
    d3.select("#pie").remove();
   
    var width=300;
    var height =300;
    var outerRadius = width/2;
    var innerRadius =0;
    var arc = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);
    var pie=d3.pie().value(function(d){return d.totalbusinesslifecyclecost});
    var labelArc = d3.arc()
	    .outerRadius(outerRadius + 20)
	    .innerRadius(outerRadius-5);
    var color = d3.scaleOrdinal(d3.schemeCategory20c);
    
    var svg=d3.select("body").append("svg").attr("width",width).attr("height",height).attr("id","pie");
    var arcs = svg.selectAll("g.arc").data(pie(dataset))
                    .enter().append("g").attr("class","arc")
                    .attr("transform","translate(" + outerRadius + "," + outerRadius + ")");
    arcs.append("path")
        .attr("d",arc)
        .attr("fill",function(d,i){return color(i)})
        .on("click",function(d){
            pieshow(d.data,tarray);
        })
        .on("mouseover",function(d){pieshow(d.data)});
    
}

function trans(chart)
{

     var pe_chart_arr=Object.keys(chart).map(function(value){
        return {business_id:value,
                totalbusinesslifecyclecost: chart[value]
            };
    });
    return pe_chart_arr;
}
function pietable(dataset,tarray)
{
    var tablelayer=d3.select("#desciptionlayer").append("div").attr("id","tablelayer");
    tablelayer.append("div").attr("id","p_title");
    tablelayer.append("h2").attr("id","p_header").text("Table 2: Investment Title and Lifecycle Cost in A Department");
    tablelayer.append("div").attr("id","p_description")
    .text("The table below show all business cases of chosen department and their lifecycle cost of each business case. Click the Business Name to see details of chosen Business case below the pie chart.")
    .attr("width","300px;"); 
    var busi_details=tablelayer.append("table").attr("id","busi_details");
     var firstrows=busi_details.append("tr");
    firstrows.append("td").text("Business Case Name");
    firstrows.append("td").text("Total Life Cycle Cost");
    //sort array
    var dataset1=dataset.map(function(d){
        return [d.business_id,d.totalbusinesslifecyclecost];
    }).sort(function(a,b){return a[1]-b[1];});
    dataset=dataset1.map(function(d){
        return {business_id:d[0],totalbusinesslifecyclecost:d[1]}
    });

  dataset.forEach(function(d){
        var rows=busi_details.append("tr");
        rows.append("td").attr("id","name").text(d.business_id).on("click",function(e){ 
            pieshow(d,tarray);});
        rows.append("td").text(d.totalbusinesslifecyclecost); 
            });
}
