import React, { ReactElement, useState, useEffect } from "react";
import EnterContentListItem from "./EnterContentListItem";
import "../css/EnterContentDayListItem.scss";
import axios from "axios";
import { useParams } from "react-router";
interface Props {
  setindex?: any;
  setitemorder?: any;
}

export default function EnterContentDayListItem({
  setindex,
  setitemorder,
}: Props): ReactElement {
  const [contentItemData, setContentItemData] = useState<any>(null);
  let params = useParams();
  const test = () => {
    for (const [key, value] of Object.entries(params)) {
      //console.log(`${key}: ${value}`);
    }
  };
  test();
  const { id } = useParams<{ id?: string }>();
  useEffect(() => {
    const fetchData = async () => {
      await axios.get(`https://localhost:4000/content/${id}`).then((res) => {
        setContentItemData(res.data.itemArr);
      });
    };
    fetchData();
  }, []);
  return (
    <>
      {/* 전체 리스트 */}
      {contentItemData?.map(
        (
          el: any,
          index: number //[day1],[day2]
        ) => (
          <div>
            {el.map((e: any, idx: number) => (
              <div className="contentDay">
                <div className="contentBodyTitle">
                  <div className="contentDayFirstSection">Day{index + 1}</div>
                  <>
                    <div className="contentBodyList">
                      {/* 아이템 하나  */}
                      <EnterContentListItem
                        props={e}
                        day={index}
                        firstindex={setitemorder}
                        setindex={setindex}
                        index={idx}
                      ></EnterContentListItem>
                    </div>
                  </>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </>
  );
}
