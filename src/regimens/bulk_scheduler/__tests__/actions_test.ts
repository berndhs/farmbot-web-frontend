let errorStub = jest.fn();
jest.mock("i18next", () => ({ t: (i: string) => i }))
jest.mock("../../../ui/index", () => ({ error: errorStub }));

import { commitBulkEditor } from "../actions";
import { fakeState } from "../../../test_helpers";

describe("commitBulkEditor()", () => {
  it("does nothing if no regimen is selected", () => {
    let getState = () => fakeState();
    let dispatch = jest.fn();
    let results = commitBulkEditor()(dispatch, getState);
    expect(dispatch.mock.calls.length).toEqual(0);
    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
