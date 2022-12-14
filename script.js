async function getData(url) {
  try {
    const response = await axios.get(url)
     return response.data
  } catch (error) {
    console.error(error);
  }
}

const dataSetVG={
  title:"Video Game Sales",
  description:"Top 100 Most Sold Video Games Grouped by Platform",
  url:"https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"
}

const dataSetMS={
  title:"Movies Sales",
  description:"Top 100 Highest Grossing Movies Grouped By Genre",
  url:"https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"
}

const dataSetKP={
  title:"Kickstarter Pledges",
  description:"Top 100 Most Pledged Kickstarter Campaigns Grouped By Category",
  url:"https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json"
}

getData(dataSetVG.url)
.then(d => render(d,dataSetVG))
.catch(err => console.log(err) )

  const render=(data,set)=>{
   
    const width=1100
    const height=700
    const padding = {top:50,bottom:50,left:50,right:50}

    const color = d3.scaleSequential([data.children.length,0],
                                       d3.interpolateRainbow)

    const mouseover=(event,d)=>{

      tooltip.transition().style("opacity",1)
    
      tooltip.attr("data-value", d.data.value)
      .style("left" , (event.pageX +15) + "px")
         .style("top" , (event.pageY +15) + "px")
         .html(`<p>${d.data.name} </p>
         <p>Category:${d.data.category}</p>
         <p>Value:${d.data.value} </p>`)

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
                .attr("width",width)
                .attr("height",height+padding.top+padding.bottom)
                .attr("id","graph")
                .append("g")

    const legend= d3.select("body").append("svg")
                    .attr("width",width)
                    .attr("height",150)
                    .attr("id","legend")
                    .append("g")
   
    const root = d3.hierarchy(data)
                .sum(d=> d.value)
                .sort((a, b) => b.value - a.value)

    d3.treemap()
      .size([width, 600])
      .padding(2)
      (root)

    svg.selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr("class","tile")
        .attr("x", d=> d.x0)
        .attr("y", d => d.y0+200)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill",d => { 
          return color(data.children.map(data=>data.name)
                                    .indexOf(d.data.category))})
       .attr("data-name",d=> d.data.name)    
       .attr("data-category",d=> d.data.category)  
       .attr("data-value",d=> d.data.value)  
       .on("mouseover",mouseover)
       .on("mouseout",mouseout)

    svg.selectAll("text")
       .data(root.leaves())
       .enter()
       .append("text")
       .selectAll("tspan")
       .data(d => {
           return d.data.name.split(/(?=[A-Z][^A-Z])/g)
               .map(v => {
                   return {
                       text: v,
                       x0: d.x0,                       
                       y0: d.y0                        
                   }})})
       .enter()
       .append("tspan")
       .attr("x", d => d.x0 + 1)
       .attr("y", (d, i) => d.y0 + 210 + (i * 10))       
       .text(d => d.text)
       .attr("font-size", "0.6em")
       .attr("fill", "black");
     
        
    svg.append("text")
       .text(`${set.title}`)
       .style("text-anchor", "middle")
       .attr("fill", "white")
       .attr("transform", "translate(" + width/2 + "," + 110+ ")")
       .attr("id","title")

    svg.append("text")
       .text(`${set.description}`)
       .style("text-anchor", "middle")
       .attr("fill", "white")
       .attr("transform", "translate(" + width/2 + "," + 160+ ")")
       .attr("id","description")

    d3.select("body").append("button")
       .text("VideGames")
       .attr("class","btn")
       .attr("id","vgbtn")
       .on("click",()=>{

        d3.selectAll("svg").remove()
       
        getData(dataSetVG.url)
        .then(d => render(d,dataSetVG))
        .catch(err => console.log(err) )
       })
    
    d3.select("body").append("button")
        .text("Movies")
        .attr("class","btn")
        .attr("id","mvbtn")
        .on("click",()=>{

          d3.selectAll("svg").remove()

          getData(dataSetMS.url)
          .then(d => render(d,dataSetMS))
          .catch(err => console.log(err) )
        })

    d3.select("body").append("button")
            .text("Pledges")
            .attr("class","btn")
            .attr("id","kpbtn")
            .on("click",()=>{

              d3.selectAll("svg").remove()

              getData(dataSetKP.url)
              .then(d => render(d,dataSetKP))
              .catch(err => console.log(err) )
             })
                
if(set!==dataSetKP){

    legend.selectAll("rect")
          .data(data.children)
          .enter()
          .append("rect")
          .attr("class", "legend-item")
          .style("stroke", "black")
          .attr("x", (d, i) => i * (width/data.children.length)+3)
          .attr("y",75)
          .attr("width", (width/data.children.length)-5)
          .attr("height", 20)
          .style("fill", d => color(data.children.map(data=>data.name).indexOf(d.name)))

    legend.selectAll("text")
          .data(root.children)
          .enter()
          .append("text")
          .attr('x', (d, i) => i * (width/data.children.length)+15)
          .attr('y', 90)
          .text(d => d.data.name);

}else{

  legend.selectAll("rect")
  .data(data.children)
  .enter()
  .append("rect")
  .attr("class", "legend-item")
  .style("stroke", "black")
  .attr("x", (d, i) => i <6?250:i<12?550:850)
  .attr("y",(d, i) => i <6?20+(i *18):i<12?20+(i *18)-108:20+(i *18)-216)
  .attr("width", 15)
  .attr("height", 15)
  .style("fill", d => color(data.children.map(data=>data.name).indexOf(d.name)))

legend.selectAll("text")
  .data(root.children)
  .enter()
  .append("text")
  .attr("x", (d, i) => 20+(i<6?250:i<12?550:850))
  .attr("y",(d, i) => 15+(i <6?20+(i *18):i<12?20+(i *18)-108:20+(i *18)-216))
  .text(d => d.data.name)
  .attr("fill","white")

}
}




