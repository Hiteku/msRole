import styled from "styled-components";
import React, { useState, useEffect } from 'react';
import { roleData } from "./roleData";
import "./style.css";

const CheckBoxWrapper = styled.div`
  position: flex;
  margin: 2.5px 50px 0 auto;
`;

const CheckBoxLabel = styled.label`
  position: absolute;
  width: 42px;
  height: 26px;
  border-radius: 15px;
  background: #bebebe;
  cursor: pointer;
  &::after {
    content: "";
    display: block;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    margin: 3px;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`;

const CheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  width: 42px;
  height: 26px;
  &:checked + ${CheckBoxLabel} {
    background: #9393FF;
    &::after {
      content: "";
      display: block;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      margin-left: 21px;
      transition: 0.2s;
    }
  }
`;

const RoleDirectory = ({
  doubleFinishingEffect,
}) => {
  const [currentPage, setCurrentPage] = useState("傳授技能");
  const [showDoubleFinishingEffect, setShowDoubleFinishingEffect] = useState(false);
  const [sortBy, setSortBy] = useState("group");
  const [isImageVisible, setIsImageVisible] = useState(false);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleChangeSortBy = (event) => {
    setSortBy(event.target.value);
  };

  const handleSwitchToggle = () => {
    setShowDoubleFinishingEffect((prevState) => !prevState);
  };

  const handleToggleImage = () => {
    setIsImageVisible(!isImageVisible);
  };

  return (
    <div className="flex-container">
      <h1>楓之谷職業列表 <img src="https://hiteku.github.io/img/ms/icon/迷你殺人鯨.png" alt=""/></h1>
      <div className="page-buttons">
        <button
          className={currentPage === "傳授技能" ? "active" : ""}
          onClick={() => handlePageChange("傳授技能")}
        >
          傳授技能
        </button>
        <button
          className={currentPage === "戰地拼圖" ? "active" : ""}
          onClick={() => handlePageChange("戰地拼圖")}
        >
          戰地拼圖
        </button>
        <button
          className={currentPage === "萌獸終傷" ? "active" : ""}
          onClick={() => handlePageChange("萌獸終傷")}
        >
          萌獸終傷
        </button>
        <div className="sort-by-container">
          {currentPage === "萌獸終傷" && (
            <>
              <p>有無創世</p>
              <CheckBoxWrapper>
                <CheckBox id="checkbox" type="checkbox"
                  checked={doubleFinishingEffect} onChange={handleSwitchToggle}/>
                <CheckBoxLabel htmlFor="checkbox"/>
              </CheckBoxWrapper>
            </>
          )}
          <select value={sortBy} onChange={handleChangeSortBy} disabled={currentPage === "傳授技能"}>
            <option value="group">職業群</option>
            {currentPage !== "傳授技能" && <option value="class">類別</option>}
            {currentPage === "戰地拼圖" && <option value="battlefieldEffect">戰地效果</option>}
            {currentPage === "萌獸終傷" && <option value="doubleFinishingEffect">雙終效益</option>}
          </select>
        </div>
      </div>
      <div className="role-directory-container">
        {currentPage === "傳授技能" && (
          <RoleList
            roles={roleData}
            currentPage={currentPage}
            showSkills={true}
            showBattlefieldEffect={false}
            showDoubleFinishingEffect={false}
            sortBy={"group"}
            isImageVisible={isImageVisible}
          />
        )}
        {currentPage === "戰地拼圖" && (
          <RoleList
            roles={roleData}
            currentPage={currentPage}
            showSkills={false}
            showBattlefieldEffect={true}
            showDoubleFinishingEffect={false}
            sortBy={sortBy}
            isImageVisible={isImageVisible}
          />
        )}
        {currentPage === "萌獸終傷" && (
          <RoleList
            roles={roleData}
            currentPage={currentPage}
            showSkills={false}
            showBattlefieldEffect={false}
            showDoubleFinishingEffect={true}
            doubleFinishingEffect={showDoubleFinishingEffect}
            sortBy={sortBy}
            isImageVisible={isImageVisible}
          />
        )}
      </div>
        <ScrollToTopButton></ScrollToTopButton>
        <button className="floating-button" onClick={handleToggleImage}>
          {isImageVisible ? 'Hide' : 'Show'}
        </button>
    </div>
  );
};

const RoleList = ({
  roles,
  currentPage,
  showSkills,
  showBattlefieldEffect,
  showDoubleFinishingEffect,
  doubleFinishingEffect,
  sortBy,
  isImageVisible,
}) => {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // 監聽視窗大小變化
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // 清除事件監聽器
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const hideTd700 = windowWidth < 700, hideTd500 = windowWidth < 500;

  const sortedRoleData = roles.sort((a, b) => {
    if (sortBy === "group") {
      return a.group.localeCompare(b.group) || a.skills.localeCompare(b.skills);
    } else if (sortBy === "class") {
      return a.class.localeCompare(b.class) || a.skills.localeCompare(b.skills);
    } else if (sortBy === "battlefieldEffect" && showBattlefieldEffect) {
      return a.sortType - b.sortType;
    } else if (sortBy === "doubleFinishingEffect" && showDoubleFinishingEffect) {
      return parseFloat(a.doubleFinishingEffect) - parseFloat(b.doubleFinishingEffect);
    }
    return 0;
  });

  return (
    <div>
      <table className="role-table">
        <thead>
          <tr>
            <th style={{width: "17%"}}>名稱</th>
            {!hideTd500 && <th style={{width: "12%"}}>職業群</th>}
            {!hideTd500 && <th style={{width: "12%"}}>類別</th>}
            {showSkills && <th>傳授技能</th>}
            {showBattlefieldEffect && <th>效果</th>}
            {showBattlefieldEffect && !hideTd700 && <th style={{width: "8%"}}>B</th>}
            {showBattlefieldEffect && !hideTd700 && <th style={{width: "8%"}}>A</th>}
            {showBattlefieldEffect && <th style={{width: "8%"}}>S</th>}
            {showBattlefieldEffect && <th style={{width: "8%"}}>SS</th>}
            {showBattlefieldEffect && <th style={{width: "8%"}}>SSS</th>}
            {showDoubleFinishingEffect && !hideTd700 && <th></th>}
            {showDoubleFinishingEffect && <th style={{width: "12%"}}>雙終效益</th>}
            {showDoubleFinishingEffect && <th style={{width: "12%"}} class="tooltip">臨界值%攻</th>}
          </tr>
        </thead>
        <tbody>
          {sortedRoleData.map((role) => (
            <tr key={role.name}>
              <td>
                {isImageVisible && (
                  <><img src={('https://hiteku.github.io/img/ms/role/' + role.name + '.png')} style={{width: "115px"}} alt="" /><br/></>
                )}
                {role.name}
              </td>
              {!hideTd500 && <td>{role.group}</td>}
              {!hideTd500 && <td>{role.class}</td>}
              {showSkills && !role.skills.includes('々') &&(
                <td
                  style={{ textAlign: 'left', verticalAlign: 'top' }}
                  rowspan={(role.skills.includes('時之祝福')) ? 1 : parseInt(role.skills.split('\n')[0].match(/\d+/)) / 2}
                >
                  {role.skills.split('\n').map((skill, index) => (
                    <React.Fragment key={index}>
                      {index === 0 ? (
                        <strong style={{ display: 'block', textAlign: 'center' }}>{skill}</strong>
                      ) : (
                        skill
                      )}
                      <br />
                    </React.Fragment>
                  ))}
                </td>
              )}
              {showBattlefieldEffect && (
                <>
                  <td>{role.battlefieldEffect[0].split('+')[0]}</td>
                  {role.battlefieldEffect.map((effect, index) => (
                    (hideTd700 && index < 2) || (
                      <td key={index}>{effect.split('+')[1]}</td>
                    )
                  ))}
                </>
              )}
              {showDoubleFinishingEffect && !hideTd700 && (
                <td></td>
              )}
              {showDoubleFinishingEffect && (
                <td>
                  {doubleFinishingEffect
                    ? role.doubleFinishingEffect.split('(')[1].replace(')', '')
                    : role.doubleFinishingEffect.split('(')[0]}%
                </td>
              )}
              {showDoubleFinishingEffect && (
                <td>
                  {doubleFinishingEffect
                    ? role.attackThreshold.split('(')[1].replace(')', '')
                    : role.attackThreshold.split('(')[0]}%
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div id="src" style={{ display: currentPage === "萌獸終傷" ? "block" : "none" }}>
        <sub>資料來源：<a class="src" href="https://forum.gamer.com.tw/Co.php?bsn=07650&sn=6444987" target="_blank" rel="noreferrer">各職業終傷萌獸效益統整</a></sub>
      </div>
    </div>
  );
};

const ScrollToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const buttonStyles = {
    position: 'fixed',
    bottom: '75px',
    right: '20px',
    borderRadius: '50%',
    background: '#222',
    color: '#fff',
    width: '50px',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    opacity: showButton ? '1' : '0',
    transition: 'opacity 0.3s ease-in-out'
  };

  return (
    <div style={buttonStyles} onClick={scrollToTop} >
      <i className="fa-solid fa-angle-up"></i>
    </div>
  );
};

export default RoleDirectory;
