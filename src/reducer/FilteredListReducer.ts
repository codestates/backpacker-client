import { FILTER_CHANGE } from "action/FilteredListAction";

let filteredListState: {
  list?: [
    {
      callinder: string;
      day: [string];
      items: [string];
      thumbnail: [string];
      totalCost: number;
      touristSpot: string;
      userinfo: string;
      __v: number;
      _id: string;
    }
  ];
} = {};

interface filteredListAct {
  type: string;
  payload?: [
    {
      callinder: string;
      day: [string];
      items: [string];
      thumbnail: [string];
      totalCost: number;
      touristSpot: string;
      userinfo: string;
      __v: number;
      _id: string;
    }
  ];
}

const filteredListReducer = (
  state = filteredListState,
  action: filteredListAct
) => {
  switch (action.type) {
    case FILTER_CHANGE:
      return {
        ...state,
        list: action.payload,
      };

    default:
      return state;
  }
};

export default filteredListReducer;
