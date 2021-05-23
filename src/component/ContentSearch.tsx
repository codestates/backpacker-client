import { getImage } from "action/ContentWriteAction";
import axios from "axios";
import React, { ReactElement, useState } from "react";
import { useDispatch } from "react-redux";
import "../css/ContentSearch.scss";
interface Props {
  currentDay: number;
  planList: Object[][];
  setplanList: React.Dispatch<React.SetStateAction<Object[][]>>;
}

type placeState = null | string;
export default function ContentSearch({
  currentDay,
  planList,
  setplanList,
}: Props): ReactElement {
  const [place, setplace] = useState<placeState>(null);
  const dispatch = useDispatch();

  const handleaddPlan = async () => {
    const res = await axios.post("http://localhost:4000/api/detailList", {
      title: place,
      num: 1,
    });

    let copyPlan: Object[][] = [...planList];
    if (copyPlan[currentDay] === undefined) {
      copyPlan[currentDay] = [
        {
          thumbnail: res.data.item[0].galWebImageUrl,
          title: res.data.item[0].galTitle,
        },
      ];
    } else {
      copyPlan[currentDay].push({
        thumbnail: res.data.item[0].galWebImageUrl,
        title: res.data.item[0].galTitle,
      });
    }
    setplanList(copyPlan);
  };
  return (
    <div className="contentSearchBox">
      <input
        className="contentSearchInput"
        onChange={(e) => {
          setplace(e.target.value);
        }}
      />
      <button
        className="contentSearchButton"
        // onClick={() => {
        //   return place !== null ? dispatch(getImage(place, 1)) : null;
        // }}
        onClick={handleaddPlan}
      >
        Search
      </button>
      {console.log("계획", planList)}
    </div>
  );
}