const vgUrl="https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"
const msUrl="https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"
const kpUrl="https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json"
let videoGameData
let movieSalesData
let kickPledgesData
const vgBtn=document.querySelector(".vg")
const msBtn=document.querySelector(".ms")
const kpBtn=document.querySelector(".kp")

async function getData(url) {
  try {
    const response = await axios.get(url)
     return response.data
  } catch (error) {
    console.error(error);
  }
}

getData(vgUrl)
.then(d => render(d))
.catch(err => console.log(err) )

getData(msUrl)
.then(d =>movieSalesData=d)
.catch(err=> console.log(err) )

getData(kpUrl)
.then(d => kickPledgesData=d)
.catch(err=> console.log(err) )

// vgBtn.addEventListener("click", () => {
  
// render(videoGameData,"Video Game Sales","Top 100 Most Sold Video Games Grouped by Platform")
// })
// msBtn.addEventListener("click", () => {
//   render(movieSalesData,"Movie Sales","Top 100 Highest Grossing Movies Grouped By Genre")
//   })
// kpBtn.addEventListener("click", () => {
// render(kickPledgesData,"Kickstarter Pledges","Top 100 Most Pledged Kickstarter Campaigns Grouped By Category")
// })



  function render(data){
  

    const width=900
    const height=700
    padding = {top:50,bottom:50,left:50,right:50}


let color = d3.scaleSequential([data.children.length,0], d3.interpolateRainbow)


// And a opacity scale
var opacity = d3.scaleLinear()
.domain([10, 30])
.range([.5,1])


const mouseover=(event,d)=>{
  console.log(d)
  tooltip.transition().style("opacity",.9)

  tooltip.attr("data-value", d)
  .style("left" , (event.pageX +15) + "px")
     .style("top" , (event.pageY +15) + "px")
     .html(`<p>${d.data.name} </p>
     <p>Category:${d.data.category}%</p>
     <p>Value:${d.data.value} </p>
     `)
 
   
    d3.select(event.target).attr("opacity",0.6)
}; 

const mouseout=(event)=> {
  
  tooltip.transition().style("opacity",0)
  d3.select(event.target).attr("opacity",1)

};

    
const tooltip=d3.select("body").append("div")
                    .attr("id", "tooltip")
                    .style("opacity", 0)


    const svg=d3.select("body").append("svg")
    .attr("width",width+padding.left+padding.right)
    .attr("height",height+padding.top+padding.bottom)
    .attr("id","graph")
    .append("g")
   
    const root = d3.hierarchy(data).sum(function(d){ return d.value}).sort((a, b) => b.value - a.value)

    d3.treemap()
    
    .size([1000, 600])
    //.paddingtop(0)
    .padding(2)
    (root)

    svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr("class","tile")
      .attr('x', function (d) { return d.x0; })
      .attr('y', function (d) { return d.y0+200; })
      .attr('width', function (d) { return d.x1 - d.x0; })
      .attr('height', function (d) { return d.y1 - d.y0; })
      .attr('fill',d => { 
     
        
     return color(data.children.map(data=>data.name).indexOf(d.data.category))
         
       })
       .attr("color",d=> color(data.children.map(data=>data.name).indexOf(d.data.category)))
       .attr("data-name",d=> d.data.name)    
       .attr("data-category",d=> d.data.category)  
       .attr("data-value",d=> d.data.value)  
       .on("mouseover",mouseover)
       .on("mouseout",mouseout)
       
  

      svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
    .selectAll('tspan')
    .data(d => {
        return d.data.name.split(/(?=[A-Z][^A-Z])/g) // split the name of movie
            .map(v => {
                return {
                    text: v,
                    x0: d.x0,                        // keep x0 reference
                    y0: d.y0                         // keep y0 reference
                }
            });
    })
    .enter()
    .append('tspan')
    .attr("x", (d) => d.x0 + 1)
    .attr("y", (d, i) => d.y0 + 210 + (i * 10))       // offset by index 
    .text((d) => d.text)
    .attr("font-size", "0.6em")
    .attr("fill", "black");

      // .attr("x", function(d){ return d.x0+3})    // +10 to adjust position (more right)
      // .attr("y", function(d){ return d.y0+215})    // +20 to adjust position (lower)
      // .text(function(d){ return d.data.name })
      // .attr("font-size", "10px")
      // .attr("fill", "black")

    // svg.append("text")
    //   .selectAll("tspan")
    //   .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    //   .enter()
    //   .append("tspan")
    //   .attr("font-size", "8px")
    //   .attr("x", 4)
    //   .attr("y", (d, i) => 13 + 10 * i)
    //   .text(d => d);

    svg.append("text")
       .text(`${data.name}`)
       .style("text-anchor", "middle")
       .attr("transform", "translate(" + 450 + "," + 100+ ")")
       .attr("id","title")

       svg.append("text")
       .text(`aasdfdfdfdfdfdfdfdfdfdffdfdfdf`)
       .style("text-anchor", "middle")
       .attr("transform", "translate(" + 450 + "," + 140+ ")")
       .attr("id","description")

d3.select("body").append("button")
                .text("VideGames")
                .attr("class","btn")
                //.attr("transform", "translate(" + 100+ "," + 50+ ")")
                .on("click",function(){
                    // //select new data
                    // if (dataIndex==1) {
                    //     dataIndex=2;  
                    // } else   {
                    //     dataIndex=1;
                    // }
                    // //rejoin data
                    // var circle = svgDoc.select("g").selectAll("circle")
                    //     .data(eval("dataArray"+dataIndex));
                    
                    // circle.exit().remove();//remove unneeded circles
                    // circle.enter().append("circle")
                    //     .attr("r",0);//create any new circles needed

                    // //update all circles to new positions
                    // circle.transition()
                    //     .duration(500)
                    //     .attr("cx",function(d,i){
                    //         var spacing = lineLength/(eval("dataArray"+dataIndex).length);
                    //         return xBuffer+(i*spacing)
                    //     })
                    //     .attr("cy",yBuffer)
                    //     .attr("r",function(d,i){return d});

                    // d3.select("text").text("dataset"+dataIndex);

                })//end click function
                
      .attr("id","vgbtn")


                d3.select("body").append("button")
                .text("Movies")
                .attr("class","btn")
                .attr("id","mvbtn")

                d3.select("body").append("button")
                .text("Pledges")
                .attr("class","btn")
                .attr("id","kpbtn")
                
               const legend= d3.select("body").append("svg")
                .attr("width",1000)
    .attr("height",50)
    .attr("id","legend")
    .append("g")

    legend.selectAll("rect")
      .data(data.children)
      .enter()
      .append("rect")
      .attr("class", "legend-item")
      .style("stroke", "white")
      .attr("x", (d, i) => i * 55)
      .attr("width", 50)
      .attr("height", 20)
      .style("fill", d => color(data.children.map(data=>data.name).indexOf(d.name)))

    legend.selectAll("text")
      .data(root.children)
      .enter()
      .append("text")
      .attr('x', (d, i) => i * 55)
      .attr('y', 15)
      .text(d => d.data.name);
}




