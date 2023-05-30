class PieChart {
  margin = {
    top: 30,
    right: 10,
    bottom: 100,
    left: 40,
  };

  constructor(svg, tooltip, data, filteredcolumns, width = 700, height = 400) {
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

    this.xScale = d3.scaleBand();
    this.yScale = d3.scaleLinear();

    this.svg
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom);

    this.container.attr(
      "transform",
      `translate(${this.margin.left}, ${this.margin.top})`
    );
  }

  update(selectedColumns) {
    var filteredData = this.data.filter(function (d) {
      var isFiltered = true;
      selectedColumns.forEach(function (column) {
        if (d[column] !== "1") {
          isFiltered = false;
        }
      });
      return isFiltered;
    });

    const counts = {};
    this.filteredcolumns.forEach((c) => {
      counts[c] = filteredData.filter(function (d) {
        return d[c] === "1";
      }).length;
    });

    const pieData = d3.pie().value((d) => d.value)(
      Object.entries(counts).map(([key, value]) => ({ key, value }))
    );

    const customColors = [
      "#1f77b4",
      "#ff7f0e",
      "#2ca02c",
      "#d62728",
      "#9467bd",
      "#8c564b",
      "#e377c2",
      "#7f7f7f",
      "#bcbd22",
      "#17becf",
      "#aec7e8",
      "#ffbb78",
      "#98df8a",
      "#ff9896",
      "#c5b0d5",
      "#c49c94",
      "#f7b6d2",
      "#c7c7c7",
      "#dbdb8d",
      "#9edae5",
      "#8ca252",
      "#d6616b",
      "#e7969c",
      "#7b4173",
      "#bd9e39",
      "#b5cf6b",
      "#843c39",
      "#e6550d",
      "#6b6ecf",
      "#637939",
      "#eeeeee",
      "#e7ba52",
      "#ad494a",
      "#3182bd",
      "#a6cee3",
      "#6baed6",
      "#dadaeb",
      "#9e9ac8",
      "#969696",
      "#525252",
    ];

    const arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(Math.min(this.width, this.height) / 2);
    const colorScale = d3
      .scaleOrdinal()
      .domain(Object.keys(counts))
      .range(customColors);

    const allZero = Object.values(counts).every((value) => value === 0);

    if (allZero) {
      // Remove any existing pie chart elements
      this.container.selectAll("path").remove();

      // Append a gray circle to the container
      this.container
        .append("circle")
        .attr("cx", this.width / 2)
        .attr("cy", this.height / 2)
        .attr("r", Math.min(this.width, this.height) / 2)
        .attr("fill", "gray")
        .on("mouseover", (event, d) => {
          // Show tooltip with the value
          this.tooltip
            .select(".tooltip-inner")
            // .html(
            //   `${Object.keys(counts)[d.index]}: ${Object.values(counts)[d.index]}`
            // )
            .html(`겹치는 다른 특성이 없습니다!!`)
            .style("left", event.pageX + "px")
            .style("top", event.pageY + "px")
            .style("opacity", 1);
          this.tooltip.style("display", "block");
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
        })
        .on("mouseout", () => {
          // Hide the tooltip
          this.tooltip.style("display", "none");
        });
    } else {
      this.container
        .selectAll("path")
        .data(pieData)
        .join("path")
        .attr("d", arc)
        .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`)
        .attr("fill", (d, i) => colorScale(i))
        .on("mouseover", (event, d) => {
          // Show tooltip with the value
          this.tooltip
            .select(".tooltip-inner")
            // .html(
            //   `${Object.keys(counts)[d.index]}: ${Object.values(counts)[d.index]}`
            // )
            .html(`${d.data.key} :  ${d.value}`)
            .style("left", event.pageX + "px")
            .style("top", event.pageY + "px")
            .style("opacity", 1);
          this.tooltip.style("display", "block");
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
        })
        .on("mouseout", () => {
          // Hide the tooltip
          this.tooltip.style("display", "none");
        });
    }
  }
  on(eventType, handler) {
    this.handlers[eventType] = handler;
  }
}
