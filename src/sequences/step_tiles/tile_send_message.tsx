import * as React from "react";
import { StepParams } from "./index";
import { StepTitleBar } from "./step_title_bar";
import { Help, Select } from "../../ui";
import { copy, remove } from "./index";
import { t } from "i18next";
import { StepInputBox } from "../inputs/step_input_box";
import { addChan, removeChan } from "../actions";
import * as _ from "lodash";

let channels = _.pairs<{}, string>({
    "ticker": "Status Ticker/Logs",
    "toast": "Toast Notification",
    "email": "Email",
    "sms": "SMS",
    "twitter": "Twitter"
});

let options = [
    { value: "success", label: "Success" },
    { value: "busy", label: "Busy" },
    { value: "warning", label: "Warning" },
    { value: "error", label: "Error" },
    { value: "info", label: "Info" },
    { value: "fun", label: "Fun" }
];

export class TileSendMessage extends React.Component<StepParams, {}> {
    constructor() {
        super();
        this.handleChannelChange = this.handleChannelChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
    }

    handleChannelChange(name: string, index: number, dispatch: Function,
        event: React.SyntheticEvent<HTMLInputElement>) {
        let channel_name = name;
        let el = event.target as HTMLInputElement;
        let action = (el.checked) ? addChan : removeChan;
        dispatch(action({ channel_name, index }));
    };

    handleOptionChange() {
        console.log("update option");
    }

    render() {
        let { handleChannelChange, handleOptionChange } = this;
        let { index, dispatch, step } = this.props;

        /** TODO: Hack?, is this node not getting the SendMessage interface? 
         * says step.body.message does not exist.
        */
        let args = step.args as any;
        let message = args.message;

        let name_list = _.pluck((step.body || []), "args.channel_name");
        let choices = channels.map(function (pair, key) {
            let [name, label] = pair;
            let isChecked = name_list.includes(name);
            /** TODO: Temporary. Once features are available, enable them. */
            let isDisabled = name == "email" || name == "sms" || name == "twitter";
            return <fieldset key={key}>
                <label htmlFor={name}> {label}</label>
                <input type="checkbox"
                    id={name}
                    disabled={isDisabled}
                    onChange={(event: React.SyntheticEvent<HTMLInputElement>) => {
                        handleChannelChange(name, index, dispatch, event);
                    } }
                    checked={isChecked}
                    />
            </fieldset>;
        });

        return <div>
            <div className="step-wrapper">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="step-header send-message-step">
                            <StepTitleBar index={index}
                                dispatch={dispatch}
                                step={step} />
                            <i className="fa fa-arrows-v step-control" />
                            <i className="fa fa-clone step-control"
                                onClick={() => copy({ dispatch, step })} />
                            <i className="fa fa-trash step-control"
                                onClick={() => remove({ dispatch, index })} />
                            <Help text={(`The Send Message step instructs 
                                FarmBot to send a custom message to the logs. 
                                This can help you with debugging your sequences. 
                                Eventually you will be able to receive push 
                                notifications and email alerts of these
                                messages!`)} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="step-content send-message-step">
                            <div className="row">
                                <div className="col-xs-12">
                                    <label>{t("Message")}</label>
                                    <span className="char-limit">
                                        {message.length}/300
                                    </span>
                                    <StepInputBox dispatch={dispatch}
                                        step={step}
                                        index={index}
                                        field="message"
                                        />
                                    <div className="bottom-content">
                                        <div className="channel-options">
                                            <Select onChange={() => {
                                                handleOptionChange();
                                            } }
                                                options={options}
                                                />
                                        </div>
                                        <div className="channel-fields">
                                            {choices}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}
