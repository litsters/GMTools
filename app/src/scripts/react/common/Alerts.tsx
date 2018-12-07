import React, { Component } from "react";
import { Alert } from "../interfaces"

interface AlertState {
    alerts: Alert[]
}

let instance: Alerts;

class Alerts extends Component<{}, AlertState> {
    private alertIdCounter: number;
    private timers: any;

    constructor(props: any) {
        super(props);

        this.alertIdCounter = 0;
        this.timers = {};

        instance = this;

        this.state = {
            alerts: [],
        };
    }

    private clearTimer(id: number) {
        if (id in this.timers) {
            clearTimeout(this.timers[id]);
            delete this.timers[id];
        }
    }

    private closeAlert(id: number) {
        this.clearTimer(id);

        let index;
        for (let i = 0, l = this.state.alerts.length; i < l; i++) {
            if (this.state.alerts[i].id == id) {
                index = i;
                break;
            }
        }
        let alerts = this.state.alerts.slice();
        alerts.splice(index, 1);
        this.setState({
            alerts: alerts,
        });
    }

    private createTimer(id: number) {
        this.clearTimer(id);

        this.timers[id] = setTimeout(() => this.closeAlert(id), 30000);
    }

    static addWarning(body: string, title = "") {
        Alerts.addAlert({
            title: title,
            body: body,
        });
    }

    static addAlert(alert: Alert) {
        if (instance) {
            instance.addAlert(alert);
        }
    }

    addAlert(alert: Alert) {
        // Normalize the alerts
        // Assign a unique ID if the alert doesn't have an Id
        if (!alert.id) {
            alert.id = ++this.alertIdCounter;
        }
        // Unless the alert is specifically marked as not dismissible, make it dismissible
        if (!(alert.dismissible === false)) {
            alert.dismissible = true;
        }
        if (!alert.type) {
            alert.type = "warning";
        }

        if (alert.dismissible) {
            this.createTimer(alert.id);
        }

        // Add the alert
        let alerts = this.state.alerts.slice();
        alerts.push(alert);
        this.setState({
            alerts: alerts,
        });
    }

    render() {
        return (
            <div className="alerts">
                {this.state.alerts.map((alert) => {
                    return (
                        <div key={alert.id} className={"alert alert-" + (alert.type ? alert.type : "warning")}>
                            <strong>{alert.title}</strong> {alert.body}
                            {alert.dismissible && <button type="button" className="close" onClick={() => this.closeAlert(alert.id)}>×</button>}
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default Alerts;
