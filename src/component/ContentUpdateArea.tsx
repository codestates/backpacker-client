import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "reducer";
import "../css/ContentWriteArea.scss";
import ContentItemList from "./ContentItemList";
import ContentSearch from "./ContentSearch";
import ContentUpdateAreaHeader from "./ContentUpdateAreaHeader";
import MapModal from "./MapModal";
import { createGlobalStyle } from "styled-components";
import { DropResult } from "react-beautiful-dnd";
import { reorder } from "./reorder";
import { getPlanList } from "action/ContentWriteAction";
import axios from "axios";
import { useHistory } from "react-router";
import { useToast } from "@chakra-ui/react";
import ContentUpdateCalendar from "./ContentUpdateCalendar";
import ContentMap from "./ContentMap";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
interface Props {
  id: string;
}

export default function ContentUpdateArea({ id }: Props): ReactElement {
  let token = localStorage.getItem("token");
  const history = useHistory();
  const toast = useToast();
  const [totalCost, settotalCost] = useState(0);
  const state = useSelector((state: RootState) => state);
  const dayList = useSelector((state: RootState) => state.dayListReducer);
  const currentDay = useSelector((state: RootState) => state.currentDayReducer);
  const startDate = useSelector((state: RootState) => state.startDateReducer);
  const endDate = useSelector((state: RootState) => state.endDateReducer);
  const title = useSelector((state: RootState) => state.titleReducer);
  const region = useSelector((state: RootState) => state.regionReducer);
  const [contentData, setContentData] = useState<any>(null);
  const [contentUserData, setContentUserData] = useState<any>(null);
  const [planList, setplanList] = useState<
    Array<Array<{ price?: number; img?: string }>>
  >([[{}]]);
  const mapClickState = useSelector((state: RootState) => state.MapClick);
  const mapItemClickState = useSelector(
    (state: RootState) => state.MapItemClick
  );
  const schedule = useSelector((state: RootState) => state.planListReducer);
  const [openTotalMap, setOpenTotalMap] = useState<boolean>(false);
  const dispatch = useDispatch();

  const stateUpdate = (data: any) => {
    setContentData(data.contentInfo);
    setContentUserData(data.userInfo);
    setplanList(data.itemArr);
  };
  //????????? ????????? ?????? (API ??????)
  const fetchData = async () => {
    console.log(`??????????????? id???+${id}`);
    let result = await axios
      .get(`https://localhost:4000/content/${id}`)
      .then((res) => {
        return res.data;
      });
    stateUpdate(result);
  };

  useEffect(() => {
    fetchData();
  }, []);
  // useEffect(
  //   (????????? ??????)
  //   return {
  //   (????????? ??????)
  //   }
  //   }, [?????????]);
  useEffect(() => {
    const handleCost = () => {
      let priceArray = planList.map((el) => {
        return el === undefined
          ? console.log("?????????")
          : el.filter((ele) => {
              return ele.price;
            });
      });
      if (priceArray) {
        let result = priceArray.map((el) => {
          return el === undefined
            ? console.log("????????? ?????????")
            : el.reduce((acc, cur): any => {
                return cur.price !== undefined ? acc + cur.price : 0;
              }, 0);
        }) as number[];
        console.log("??????????????????", result);
        if (result) {
          let sum = 0;
          for (let i = 0; i < result.length; i++) {
            if (result[i] === undefined) {
              continue;
            } else sum = sum + result[i];
          }
          console.log("?????????", sum);
          settotalCost(sum);
        }
      }
    };
    handleCost();
  }, [planList]);

  useEffect(() => {
    dispatch(getPlanList(planList));
  }, [planList]);

  const Bodytag = createGlobalStyle`
body {
  overflow : hidden;
  height : 100%;
}
body*{
  touch-action : none;
}
`;
  //?????? ?????? ??????
  const handleSendBtn = () => {
    axios
      .put(
        `https://localhost:4000/content/${id}/update`,
        {
          startDate: startDate,
          endDate: endDate,
          totalCost: totalCost,
          schedule: planList,
          title: title,
          touristRegion: region,
          thumbnail: planList.map((el, idx) => {
            return el.map((ele) => {
              return ele.img;
            });
          }),
          touristSpot: "??????",
        },
        {
          headers: {
            "content-type": "application/json",
            authorization: `bearer ${token}`,
          },

          withCredentials: true,
        }
      )
      .then((res) => console.log("??????"))
      .catch((err) => console.log(err));
    history.push(`/content/${id}`);
    window.location.reload();
  };

  const onDragEnd = useCallback(
    ({ destination, source }: DropResult) => {
      if (!destination) return;

      const newItems = reorder(
        planList,
        source.index,
        destination.index,
        currentDay
      );

      setplanList(newItems);
    },
    [planList]
  );

  const openTotalMapHandler = () => {
    if (openTotalMap) {
      setOpenTotalMap(false);
    } else {
      setOpenTotalMap(true);
    }
  };
  return (
    <>
      {mapItemClickState ? <Bodytag /> : null}
      {mapItemClickState ? <div className="modal"></div> : null}
      {contentData ? <ContentUpdateCalendar props={contentData} /> : null}
      {console.log(contentUserData)}
      {contentData ? (
        <ContentUpdateAreaHeader
          props={contentUserData}
          content={contentData}
        />
      ) : null}
      <div className="bigWriteArea">
        <section className="contentWriteAreaBox">
          {dayList !== null
            ? Object.entries(dayList).map((el) => {
                return currentDay === Number(el[0]) ? (
                  <>
                    <h1 className="forWhen">DAY {currentDay + 1}</h1>
                    <div className="tableOfplan">
                      <ContentItemList
                        planList={planList}
                        onDragEnd={onDragEnd}
                        setplanList={setplanList}
                      />
                    </div>
                  </>
                ) : null;
              })
            : null}
          <div className="totalPriceBox">
            <div className="totalPrice">
              ??? ?????? ?????? ?????? : {new Intl.NumberFormat().format(totalCost)} ???
            </div>
          </div>
          <ContentSearch planList={planList} setplanList={setplanList} />
          <button
            className="writeCompletedButton"
            onClick={() => {
              if (token) {
                if (title.length === 0) {
                  toast({
                    title: "?????? ??????",
                    description: "?????? ????????? ??????????????????!",
                    position: "top-right",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                  });
                } else if (region.length === 0) {
                  toast({
                    title: "?????? ??????",
                    description: "?????? ????????? ??????????????????!",
                    position: "top-right",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                  });
                } else if (Object.entries(planList[0][0]).length === 0) {
                  toast({
                    title: "?????? ??????",
                    description: "????????? ???????????? ??????????????????!",
                    position: "top-right",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                  });
                } else {
                  handleSendBtn();
                }
              } else {
                toast({
                  title: "?????? ??????",
                  description: "??????????????? ???????????? ??? ????????????.",
                  position: "top-right",
                  status: "error",
                  duration: 5000,
                  isClosable: true,
                });
              }
            }}
          >
            ????????????
          </button>
        </section>
        {mapClickState ? <MapModal planList={planList} /> : null}
        <button className="openMapSectionBtn" onClick={openTotalMapHandler}>
          {openTotalMap ? (
            <ArrowRightIcon color="white" />
          ) : (
            <ArrowLeftIcon color="white" className="arrowLIcon" />
          )}
        </button>
        {openTotalMap ? (
          <section className="mapSection">
            <ContentMap planList={planList} />
          </section>
        ) : null}
      </div>
    </>
  );
}
