import * as React from "react";
import { changeStep, removeStep } from "../actions";
import { SequenceBodyItem as Step } from "farmbot";
import { NUMERIC_FIELDS } from "../interfaces";
import { ExecuteBlock } from "../execute_block";
import { Sequence, StepParams } from "../interfaces";
import { defensiveClone } from "../../util";
import { TileIf } from "./tile_if";
import { TileWait } from "./tile_wait";
import { TileMoveAbsolute } from "./tile_move_absolute";
import { TileMoveRelative } from "./tile_move_relative";
import { TileReadPin } from "./tile_read_pin";
import { TileSendMessage } from "./tile_send_message";
import { TileWritePin } from "./tile_write_pin";
import { ToolsState } from "../../tools/interfaces";
import { TileExecuteScript } from "./tile_execute_script";
import { TileTakePhoto } from "./tile_take_photo";
import * as _ from "lodash";
import { LegalArgString, CeleryNode, LegalKindString, LegalSequenceKind } from "farmbot";
import { TaggedSequence, TaggedTool } from "../../resources/tagged_resources";
import { edit } from "../../api/crud";

interface CopyParams {
  dispatch: Function;
  step: Step;
  sequence: TaggedSequence
}

export function copy({ dispatch, step, sequence }: CopyParams) {
  let copy = defensiveClone(step);
  let next = defensiveClone(sequence);
  let seq = next.body;
  seq.body = seq.body || [];
  seq.body.splice(_.indexOf(seq.body, copy), 0, copy);
  dispatch(edit(sequence, next));
};

interface RemoveParams {
  index: number;
  dispatch: Function;
}

export function remove({ dispatch, index }: RemoveParams) {
  dispatch(removeStep(index));
}

interface UpdateStepParams {
  dispatch: Function;
  step: CeleryNode;
  index: number;
  field: string;
}

export function updateStep({ dispatch,
  step,
  index,
  field
}: UpdateStepParams) {
  return (e: React.FormEvent<HTMLInputElement>) => {
    let copy = defensiveClone(step);
    let val = e.currentTarget.value;

    if (NUMERIC_FIELDS.indexOf(field) !== -1) {
      if (val == "-") { // Fix negative number issues.
        _.assign(copy.args, { [field]: "-" });
      } else {
        _.assign(copy.args, { [field]: parseInt(val, 10) });
      }
    } else {
      _.assign(copy.args, { [field]: val });
    };
    dispatch(changeStep(index, copy));
  };
};

export function renderCeleryNode(kind: LegalSequenceKind, props: StepParams) {
  switch (kind) {
    case "execute": return <ExecuteBlock {...props} />;
    case "_if": return <TileIf {...props} />;
    case "move_relative": return <TileMoveRelative {...props} />;
    case "move_absolute": return <TileMoveAbsolute {...props} />;
    case "write_pin": return <TileWritePin {...props} />;
    case "wait": return <TileWait {...props} />;
    case "send_message": return <TileSendMessage {...props} />;
    case "read_pin": return <TileReadPin {...props} />;
    case "execute_script": return <TileExecuteScript {...props} />;
    case "take_photo": return <TileTakePhoto {...props} />;
    default: return <div><hr /> ? Unknown step ? <hr /></div>;
  }
};
