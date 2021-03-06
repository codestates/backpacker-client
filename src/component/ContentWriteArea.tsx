import { ReactElement, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "reducer";
import "../css/ContentWriteArea.scss";
import ContentItemList from "./ContentItemList";
import ContentSearch from "./ContentSearch";
import ContentWriteAreaHeader from "./ContentWriteAreaHeader";
import ContentWriteCalendar from "./ContentWriteCalendar";
import MapModal from "./MapModal";
import { createGlobalStyle } from "styled-components";
import { DropResult } from "react-beautiful-dnd";
import { reorder } from "./reorder";
import { getPlanList } from "action/ContentWriteAction";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import ContentMap from "./ContentMap";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { openTotalMap, openTotalMapClose } from "action/ModalClickAction";

export default function ContentWriteArea(): ReactElement {
  let token = localStorage.getItem("token");
  const toast = useToast();
  const [totalCost, settotalCost] = useState(0);
  // const state = useSelector((state: RootState) => state);
  const dayList = useSelector((state: RootState) => state.dayListReducer);
  const currentDay = useSelector((state: RootState) => state.currentDayReducer);
  const startDate = useSelector((state: RootState) => state.startDateReducer);
  const endDate = useSelector((state: RootState) => state.endDateReducer);
  const title = useSelector((state: RootState) => state.titleReducer);
  const region = useSelector((state: RootState) => state.regionReducer);
  const [planList, setplanList] = useState<
    Array<Array<{ price?: number; img?: string }>>
  >([[{}]]);
  const mapClickState = useSelector((state: RootState) => state.MapClick);
  const mapItemClickState = useSelector(
    (state: RootState) => state.MapItemClick
  );
  const openTotalMapState = useSelector(
    (state: RootState) => state.openTotalMapClickReducer
  );

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const handleCost = () => {
      console.log("handleCost");
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
          // console.log("?????????", sum);
          settotalCost(sum);
        }
      }
    };
    handleCost();
  }, [planList]);

  useEffect(() => {
    dispatch(getPlanList(planList));
  }, [planList]);

  // ?????? ?????? ????????? arr ??????,
  // ??? arr.map
  // arr = [0, 0, 0, 0, 0].map((el) => {
  //    {currentDay === arr.indexOf(el) ? (
  //    <ContentItemList currentDay={currentDay} planList={planList} />
  //    ) : null}
  // })

  // res.data.item[0] ????????? ??????
  // res.data.item[0].addr1 ??????
  // res.data.item[0].firstimage ?????? ??????
  // res.data.item[0].mapx mapy ?????? ??????
  // res.data.item[0].title ????????????
  // res.data.item[0].tel ????????????
  const Bodytag = createGlobalStyle`
body {
  overflow : hidden;
  height : 100%;
}
body*{
  touch-action : none;
}
`;

  const handleSendBtn = async () => {
    // axios.defaults.headers.common["Authorization"] = `bearer ${token}`;
    // axios.defaults.headers.post["Content-Type"] = "application/json";
    await axios
      .post(
        "https://localhost:4000/content/create",
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
      .then((res) => {
        history.push(`/content/${res.data.id}`);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  const onDragEnd = useCallback(
    ({ destination, source }: DropResult) => {
      console.log("onDragEnd");
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
    if (openTotalMapState) {
      dispatch(openTotalMapClose());
    } else {
      dispatch(openTotalMap());
    }
  };
  return (
    <>
      {mapItemClickState ? <Bodytag /> : null}
      {mapItemClickState ? <div className="modal"></div> : null}
      <ContentWriteCalendar />

      <ContentWriteAreaHeader />
      <div className="bigWriteArea">
        <section className="contentWriteAreaBox">
          {dayList !== null
            ? Object.entries(dayList).map((el, idx) => {
                return currentDay === Number(el[0]) ? (
                  <>
                    <h1 className="forWhen">DAY {currentDay + 1}</h1>
                    <div className="tableOfplan">
                      <ContentItemList
                        planList={planList}
                        onDragEnd={onDragEnd}
                        setplanList={setplanList}
                        key={idx}
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
          {openTotalMapState ? (
            <ArrowRightIcon color="white" />
          ) : (
            <ArrowLeftIcon color="white" className="arrowLIcon" />
          )}
        </button>
        {openTotalMapState ? (
          <section className="mapSection">
            <ContentMap planList={planList} />
          </section>
        ) : null}
      </div>
      {/* {console.log(state, "???????????? ?????????")} */}
    </>
  );
}
