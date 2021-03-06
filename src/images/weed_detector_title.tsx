import * as React from "react";
import { t } from "i18next";
import { additionalSettingsMenu } from "./weed_detector_config";

interface Props {
  onSave(): void;
  onTest(): void;
  onPhotoClick(): void;
  onSettingToggle(): void;
  onDeletionClick(): void;
  deletionProgress?: string | undefined;
  settingsMenuOpen: boolean;
}

export function TitleBar({
  onSave,
  onTest,
  onPhotoClick,
  settingsMenuOpen,
  onSettingToggle,
  deletionProgress,
  onDeletionClick
}: Props) {
  return <div className="widget-header">
    <button onClick={onSave} className="green">
      {t("SAVE")}
    </button>
    <button onClick={onTest} className="yellow">
      {t("TEST")}
    </button>
    <button className="gray" onClick={onPhotoClick}>
      {t("Take Photo")}
    </button>
    <button onClick={onDeletionClick} className="red">
      {deletionProgress || t("CLEAR WEEDS")}
    </button>
    {/* TODO: Hook up calibration */}
    <button onClick={() => { }} className="green">
      {t("Calibrate")}
    </button>
    <i className="fa fa-cog" onClick={onSettingToggle}>
      {settingsMenuOpen && additionalSettingsMenu()}
    </i>
    <h5>{t("Weed Detector")}</h5>
    <i className={`fa fa-question-circle widget-help-icon`}>
      <div className={`widget-help-text`}>
        {t(`Detect Weeds`)}
      </div>
    </i>
  </div>;
}
