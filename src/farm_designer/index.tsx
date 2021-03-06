import * as React from "react";
import { GardenMap } from "./map/garden_map";
import { connect } from "react-redux";
import { Link } from "react-router";
import { t } from "i18next";
import { Props } from "./interfaces";
import { mapStateToProps } from "./state_to_props";
import { history } from "../history";
import { Plants } from "./plants/plant_inventory";
import { isMobile } from "../util";

interface State {
  zoomLevel: number;
  showPlants: boolean;
  showPoints: boolean;
}

@connect(mapStateToProps)
export class FarmDesigner extends React.Component<Props, Partial<State>> {
  constructor() {
    super();
    this.state = { zoomLevel: 0.6, showPlants: true, showPoints: true };
  }

  zoom = (zoomNumber: number) => {
    let zl = this.state.zoomLevel;
    zl && this.setState({ zoomLevel: zl + zoomNumber });
  }

  childComponent() {
    let fallback = isMobile() ?
      undefined : React.createElement(Plants, this.props as any);
    return this.props.children || fallback;
  }

  toggleAll = () => this.setState({
    showPlants: !this.state.showPlants,
    showPoints: !this.state.showPoints
  });

  togglePlants = () => this.setState({ showPlants: !this.state.showPlants });

  togglePoints = () => this.setState({ showPoints: !this.state.showPoints });

  render() {
    // Kinda nasty, similar to the old q="NoTab" we used to determine no panels.
    // This one just makes sure the designer can click it's panel tabs without
    // the other headers getting in the way. There's more re-usability in this.
    if (history.getCurrentLocation().pathname === "/app/designer") {
      document.body.classList.add("designer-tab");
    } else {
      document.body.classList.remove("designer-tab");
    }

    let { zoomLevel, showPlants, showPoints } = this.state;

    let plusBtnColor = (zoomLevel && zoomLevel <= 0.9) ? "" : "disabled";
    let minusBtnColor = (zoomLevel && zoomLevel >= 0.4) ? "" : "disabled";

    let plantsBtnColor = showPlants ? "green" : "red";
    let pointsBtnColor = showPoints ? "green" : "red";

    return <div className="farm-designer">

      <div className="garden-map-legend" style={{ zoom: 1 }}>
        <button className={"plus-button green " + plusBtnColor}
          onClick={() => this.zoom(0.1)}>
          <i className="fa fa-2x fa-plus" />
        </button>
        <button className={"plus-button green " + minusBtnColor}
          onClick={() => this.zoom(-0.1)}>
          <i className="fa fa-2x fa-minus" />
        </button>
        <div className="map-layers">
          <fieldset>
            <label>
              <span>{t("Plants?")}</span>
              <button
                className={"toggle-button " + plantsBtnColor}
                onClick={this.togglePlants}
              />
            </label>
          </fieldset>
          <fieldset>
            <label>
              <span>{t("Points?")}</span>
              <button
                className={"toggle-button " + pointsBtnColor}
                onClick={this.togglePoints}
              />
            </label>
          </fieldset>
        </div>
      </div>

      <div className="panel-header gray-panel designer-mobile-nav">
        <div className="panel-tabs">
          <Link to="/app/designer" className="mobile-only active">
            {t("Designer")}
          </Link>
          <Link to="/app/designer/plants">
            {t("Plants")}
          </Link>
          <Link to="/app/designer/farm_events" >
            {t("Farm Events")}
          </Link>
        </div>
      </div>
      <div className="farm-designer-panels">
        {this.childComponent()}
      </div>

      <div className="farm-designer-map" style={{ zoom: this.state.zoomLevel }}>
        <GardenMap
          showPoints={showPoints}
          showPlants={showPlants}
          selectedPlant={this.props.selectedPlant}
          crops={this.props.crops}
          dispatch={this.props.dispatch}
          designer={this.props.designer}
          plants={this.props.plants}
          points={this.props.points}
        />
      </div>
    </div>
  }
}
