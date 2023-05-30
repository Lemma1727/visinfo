class BarChart {
  margin = {
    top: 30,
    right: 10,
    bottom: 100,
    left: 40,
  };

  constructor(svg, tooltip, data, filteredcolumns, width = 1000, height = 400) {
    this.svg = svg;
    this.tooltip = tooltip;
    this.data = data;
    this.filteredcolumns = filteredcolumns;
    this.width = width;
    this.height = height;
  }
  initialize() {
    this.svg = d3.select(this.svg);
    this.tooltip = d3.select(this.tooltip);
    this.container = this.svg.append("g");
    this.xAxis = this.svg.append("g");
    this.yAxis = this.svg.append("g");
    this.legend = this.svg.append("g");

    this.xScale = d3.scaleLinear();
    this.yScale = d3.scaleBand();

    this.svg
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom);

    this.container.attr(
      "transform",
      `translate(${this.margin.left}, ${this.margin.top})`
    );
  }

  update(selectedCeleb1, selectedCeleb2) {
    var selectedCelebs = [selectedCeleb1, selectedCeleb2];
    var filteredData = this.data.filter(function (d) {
      return selectedCelebs.includes(d["name"]);
    });

    const countsCeleb1 = {};
    const countsCeleb2 = {};

    this.filteredcolumns.forEach((c) => {
      countsCeleb1[c] = filteredData.filter(function (d) {
        return d["name"] === selectedCeleb1 && d[c] === "1";
      }).length;
      countsCeleb2[c] = filteredData.filter(function (d) {
        return d["name"] === selectedCeleb2 && d[c] === "1";
      }).length;
    });

    const maxCount = d3.max(
      Object.values(countsCeleb1).concat(Object.values(countsCeleb2))
    );

    this.xScale.domain([-maxCount, maxCount]).range([0, this.width]);
    this.yScale.domain(this.filteredcolumns).range([0, this.height]);

    this.container.selectAll("rect").remove();

    this.container.selectAll("text").remove();
    this.container
      .append("text")
      .text("First Celeb :" + selectedCeleb1) // selectedCeleb1에 해당하는 텍스트 표시
      .attr("x", this.margin.left + this.width / 4)
      .attr("y", this.margin.top + this.height + 50) // 그리드 아래에 10px 간격으로 표시
      .style("font-weight", "bold")
      .style("font-size", "30px")
      .style("text-anchor", "middle");

    this.container
      .append("text")
      .text("Secend Celeb :" + selectedCeleb2) // selectedCeleb1에 해당하는 텍스트 표시
      .attr("x", this.margin.left + this.width / 1.5)
      .attr("y", this.margin.top + this.height + 50) // 그리드 아래에 10px 간격으로 표시
      .style("font-weight", "bold")
      .style("font-size", "30px")
      .style("text-anchor", "middle");

    this.container
      .selectAll(".celeb1-bar")
      .data(this.filteredcolumns)
      .join("rect")
      .attr("class", "celeb1-bar")
      .attr("x", (d) => this.xScale(-countsCeleb1[d]))
      .attr("y", (d) => this.yScale(d))
      .attr("width", (d) => this.xScale(countsCeleb1[d]) - this.xScale(0))
      .attr("height", this.yScale.bandwidth() / 2)
      .attr("fill", "LightSkyBlue")
      .on("mouseover", (event, d) => {
        // Show tooltip with the value
        this.tooltip
          .select(".tooltip-inner")
          .html(`${selectedCeleb1} - ${d}: ${countsCeleb1[d]}`);
        // Use Popper.js to set tooltip position
        Popper.createPopper(event.target, this.tooltip.node(), {
          placement: "top",
          modifiers: [
            {
              name: "arrow",
              options: {
                element: this.tooltip.select(".tooltip-arrow").node(),
              },
            },
          ],
        });
        this.tooltip.style("display", "block");
      })
      .on("mouseout", () => {
        // Hide the tooltip
        this.tooltip.style("display", "none");
      });

    this.container
      .selectAll(".celeb2-bar")
      .data(this.filteredcolumns)
      .join("rect")
      .attr("class", "celeb2-bar")
      .attr("x", this.width / 2)
      .attr("y", (d) => this.yScale(d))
      .attr("width", (d) => this.xScale(countsCeleb2[d]) - this.xScale(0))
      .attr("height", this.yScale.bandwidth() / 2)
      .attr("fill", "LightGreen")
      .on("mouseover", (event, d) => {
        // Show tooltip with the value
        this.tooltip
          .select(".tooltip-inner")
          .html(`${selectedCeleb2} - ${d}: ${countsCeleb2[d]}`);
        // Use Popper.js to set tooltip position
        Popper.createPopper(event.target, this.tooltip.node(), {
          placement: "top",
          modifiers: [
            {
              name: "arrow",
              options: {
                element: this.tooltip.select(".tooltip-arrow").node(),
              },
            },
          ],
        });
        this.tooltip.style("display", "block");
      })
      .on("mouseout", () => {
        // Hide the tooltip
        this.tooltip.style("display", "none");
      });

    this.xAxis
      .attr(
        "transform",
        `translate(${this.margin.left}, ${this.margin.top + this.height})`
      )
      .call(d3.axisBottom(this.xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    this.yAxis
      .attr(
        "transform",
        `translate(${this.margin.left + this.width / 2}, ${this.margin.top})`
      )
      .call(d3.axisLeft(this.yScale));
  }

  on(eventType, handler) {
    this.handlers[eventType] = handler;
  }
}
