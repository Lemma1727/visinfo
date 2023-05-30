class ImageGrid {
  margin = {
    top: 10,
    right: 10,
    bottom: 60,
    left: 1,
  };

  constructor(svg, tooltip, data, width = 700, height = 400) {
    this.svg = svg;
    this.tooltip = tooltip;
    this.data = data;
    this.width = width;
    this.height = height;
    this.gridWidth = 700;
    this.gridHeight = 300;
    this.gridCols = 10;
    this.gridRows = 3;
    this.imageWidth = this.gridWidth / this.gridCols;
    this.imageHeight = this.gridHeight / this.gridRows;
    this.baseUrl = "http://127.0.0.1:8080/visinfo/images/";
  }

  initialize() {
    this.svg = d3.select(this.svg);
    this.tooltip = d3.select(this.tooltip);
    this.container1 = this.svg.append("g").attr("id", "selectedCeleb1");
    this.container2 = this.svg.append("g").attr("id", "selectedCeleb2");

    this.svg
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom);

    this.container1.attr(
      "transform",
      `translate(${this.margin.left}, ${this.margin.top})`
    );
    this.container2.attr(
      "transform",
      `translate(${this.margin.left}, ${this.margin.top + 80})`
    );
  }
  update(selectedCeleb1, selectedCeleb2) {
    var filteredCeleb1 = this.data
      .filter(function (d) {
        return d.name === selectedCeleb1;
      })
      .map(function (d) {
        return d.Image;
      });
    var filteredCeleb2 = this.data
      .filter(function (d) {
        return d.name === selectedCeleb2;
      })
      .map(function (d) {
        return d.Image;
      });

    filteredCeleb1.slice(0, 30).forEach((imageName, index) => {
      const row = Math.floor(index / 10);
      const col = index % 10;
      const x = col * this.imageWidth;
      const y = row * this.imageHeight;
      const imageUrl = this.baseUrl + imageName;

      this.container1
        .append("image")
        .attr("xlink:href", imageUrl)
        .attr("width", this.imageWidth)
        .attr("height", this.imageHeight)
        .attr("x", x)
        .attr("y", y)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .on("mouseover", (event) => {
          this.tooltip.select(".tooltip-inner").html(`${imageName}`);
          this.tooltip.style("display", "block");
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
          this.tooltip.style("display", "none");
        });
    });

    this.container1.select("text").remove();
    this.container1
      .append("text")
      .text("First Celeb :" + selectedCeleb1) // selectedCeleb1에 해당하는 텍스트 표시
      .attr("x", this.gridWidth / 2)
      .attr("y", this.gridHeight + 50) // 그리드 아래에 10px 간격으로 표시
      .style("font-weight", "bold")
      .style("font-size", "30px")
      .style("text-anchor", "middle");

    // 그리드 2
    filteredCeleb2.slice(0, 30).forEach((imageName, index) => {
      const row = Math.floor(index / 10);
      const col = index % 10;
      const x = col * this.imageWidth;
      const y = row * this.imageHeight + this.gridHeight; // 행 간격을 20으로 설정
      const imageUrl = this.baseUrl + imageName;

      this.container2
        .append("image")
        .attr("xlink:href", imageUrl)
        .attr("width", this.imageWidth)
        .attr("height", this.imageHeight)
        .attr("x", x)
        .attr("y", y)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .on("mouseover", (event) => {
          this.tooltip.select(".tooltip-inner").html(`${imageName}`);
          this.tooltip.style("display", "block");
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
          this.tooltip.style("display", "none");
        });
    });

    this.container2.select("text").remove();
    this.container2
      .append("text")
      .text("Second celeb :" + selectedCeleb2) // selectedCeleb1에 해당하는 텍스트 표시
      .attr("x", this.gridWidth / 2)
      .attr("y", this.gridHeight * 2 + 50) // 그리드 아래에 10px 간격으로 표시
      .style("font-weight", "bold")
      .style("font-size", "30px")
      .style("text-anchor", "middle");

    // svg 요소의 높이 조정
    const totalGridHeight = (this.gridHeight + this.margin.bottom + 20) * 2; // 두 그리드의 총 높이
    const svgHeight = this.margin.top + totalGridHeight + this.margin.bottom;
    this.svg.attr("height", svgHeight);
  }
  on(eventType, handler) {
    this.handlers[eventType] = handler;
  }
}
