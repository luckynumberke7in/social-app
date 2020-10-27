import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// pull alerts prop out, then if alerts aren't null or 0, display in jsx.
const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg} {/* this dynamically displays alerts based on type */}
    </div>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);
