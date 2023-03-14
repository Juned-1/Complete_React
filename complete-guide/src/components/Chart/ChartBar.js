import "./ChartBar.css";

const ChartBar = (props) => {
  let barHeight = "0%";

  if (props.maxValue > 0) {
    barHeight = Math.round((props.value / props.maxValue) * 100) + "%";
  }
  return (
    <div className="chart-bar">
      <div className="chart-bar__inner">
        <div
          className="chart-bar__fill"
          style={
            /*sendng js object to style attribute necessary for react sending direct property do not work unlike js*/ {
              height: barHeight,
            }
          }
        ></div>
      </div>
      <div className="chart-bar__label">{props.label}</div>
    </div>
  );
};

export default ChartBar;
