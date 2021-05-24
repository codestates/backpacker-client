import React, { ReactElement } from "react";
import {
  contentItemMapClose,
  contentItemMapOpen,
} from "action/ModalClickAction";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "reducer";
interface Props {}

export default function EnterContentListItem({}: Props): ReactElement {
  const contentMapClickState = useSelector(
    (state: RootState) => state.ContentItemMapClick
  );
  const dispatch = useDispatch();
  return (
    <>
      <div>
        <div className="listItem">
          <div>1번</div>
          <div>
            <img src="https://images.unsplash.com/photo-1611477623565-aa88aeca8153?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"></img>
          </div>
          <div>경복궁</div>
          <button
            onClick={() => {
              contentMapClickState
                ? dispatch(contentItemMapClose())
                : dispatch(contentItemMapOpen());
            }}
          >
            지도
          </button>
        </div>
        <div className="sectionLine"></div>
      </div>
    </>
  );
}