// This page is for Sourav
import React from "react";
import Style from "../../css/Home.module.css";
import HomeSec1 from "./HomeSec1";
import HomeSec2 from "./HomeSec2";
import HomeSec3 from "./HomeSec3";

const Home = () => {
  return (
    <>
      <div className={Style.Homestyle}>
        <HomeSec1 />
        <HomeSec2 />
        <HomeSec3 />
      </div>
    </>
  );
};

export default Home;
