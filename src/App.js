import styled from "styled-components";
import React, { useState, useEffect } from 'react';
import { roleData } from "./roleData";
import "./style.css";

const CheckBoxWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: -39px 0px 39px 0px;
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
  position: absolute;
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

const attributeOptions = [
  { name: 'attribute', value: 'attackSpeed', label: '攻速' },
  // { name: 'attribute', value: 'bossDamage', label: '無視Ｂ傷' },
  { name: 'attribute', value: 'criticalChance', label: '暴擊' },
  { name: 'attribute', value: 'doubleFinishingEffect', label: '雙終效益' },
];

function RadioOptions({ options, selected, handleOptionChange }) {
  return (
    <div className='filter'>
      {options.map((option) => (
        <label key={option.value} className={selected === option.value ? 'selected' : ''}>
          <input
            type="radio"
            name={option.name}
            value={option.value}
            checked={selected === option.value}
            onChange={() => handleOptionChange(option.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}

const RoleDirectory = () => {
  const [currentPage, setCurrentPage] = useState('傳授技能');
  const [sortBy, setSortBy] = useState("group");
  const [isImageVisible, setIsImageVisible] = useState(false);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleChangeSortBy = (event) => {
    setSortBy(event.target.value);
  };

  const handleToggleImage = () => {
    setIsImageVisible(!isImageVisible);
  };

  return (
    <div className="flex-container">
      <h1>楓之谷職業列表 <img src="https://hiteku.github.io/img/ms/icon/迷你殺人鯨.png" alt=""/></h1>
      <div className="page-buttons">
        <button
          className={currentPage === '傳授技能' ? "active" : ""}
          onClick={() => handlePageChange('傳授技能')}
        >傳授技能
        </button>
        <button
          className={currentPage === '戰地拼圖' ? "active" : ""}
          onClick={() => handlePageChange('戰地拼圖')}
        >戰地拼圖
        </button>
        <button
          className={currentPage === '能力資訊' ? "active" : ""}
          onClick={() => handlePageChange('能力資訊')}
        >能力資訊
        </button>
        <div className="sort-by-container">
          <select value={sortBy} onChange={handleChangeSortBy} disabled={currentPage === '傳授技能'}>
            <option value="group">職業群</option>
            {currentPage !== '傳授技能' && <option value="class">類別</option>}
            {currentPage === '戰地拼圖' && <option value="battlefieldEffect">戰地效果</option>}
            {currentPage === '能力資訊' && <option value="attackSpeed">攻速</option>}
            {currentPage === '能力資訊' && <option value="criticalChance">暴率</option>}
            {currentPage === '能力資訊' && <option value="doubleFinishingEffect">雙終效益</option>}
          </select>
        </div>
      </div>
      <div className="role-directory-container">
        {currentPage === '傳授技能' && (
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
        {currentPage === '戰地拼圖' && (
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
        {currentPage === '能力資訊' && (
          <RoleList
            roles={roleData}
            currentPage={currentPage}
            showSkills={false}
            showBattlefieldEffect={false}
            showDoubleFinishingEffect={true}
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
  sortBy,
  isImageVisible,
}) => {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [attribute, setAttribute] = useState('doubleFinishingEffect');
  const [genesis, setGenesis] = useState(false);

  const handleSwitchToggle = () => {
    setGenesis((prevState) => !prevState);
  };

  const handleAttributeChange = (value) => {
    setAttribute(value);
  };

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
    } else if (sortBy === "attackSpeed" && showDoubleFinishingEffect) {
      return parseFloat(a.attackSpeed) - parseFloat(b.attackSpeed);
    } else if (sortBy === "criticalChance" && showDoubleFinishingEffect) {
      return parseFloat(a.criticalChance) - parseFloat(b.criticalChance);
    }
    return 0;
  });

  return (
    <div>
      {showDoubleFinishingEffect && (
        <RadioOptions
          options={attributeOptions}
          selected={attribute}
          handleOptionChange={handleAttributeChange}
        />
      )}
      {currentPage === '能力資訊' && attribute === 'doubleFinishingEffect' && (
        <>
          <CheckBoxWrapper>
            <CheckBox id="checkbox" type="checkbox" checked={genesis} onChange={handleSwitchToggle}/>
            <CheckBoxLabel htmlFor="checkbox"/>
          </CheckBoxWrapper>
        </>
      )}
      <table className="role-table">
        <thead>
          <tr>
            <th rowSpan="2" style={{width: "17%"}}>名稱</th>
            {!hideTd500 && <th rowSpan="2" style={{width: "12%"}}>職業群</th>}
            {!hideTd500 && <th rowSpan="2" style={{width: "12%"}}>類別</th>}
            {showSkills && <th>傳授技能</th>}
            {showBattlefieldEffect && <th>效果</th>}
            {showBattlefieldEffect && !hideTd700 && <th style={{width: "8%"}}>B</th>}
            {showBattlefieldEffect && !hideTd700 && <th style={{width: "8%"}}>A</th>}
            {showBattlefieldEffect && !isImageVisible && <th style={{width: "8%"}}>S</th>}
            {showBattlefieldEffect && <th style={{width: "8%"}}>SS</th>}
            {showBattlefieldEffect && !isImageVisible && <th style={{width: "8%"}}>SSS</th>}
            {showDoubleFinishingEffect && (
              <>
                {attribute === 'attackSpeed' && (
                  <>
                    <th>武器係數</th>
                    <th>攻速</th>
                  </>
                )}
                {attribute === 'bossDamage' && (
                  <>
                    <th>Ｂ傷</th>
                    <th>無視</th>
                  </>
                )}
                {attribute === 'criticalChance' && (
                  <>
                    <th>暴率%</th>
                    <th>暴傷%</th>
                  </>
                )}
                {attribute === 'doubleFinishingEffect' && (
                  <>
                    <th>雙終效益</th>
                    <th className="tooltip">臨界%攻</th>
                  </>
                )}
              </>
            )}
          </tr>
          {showDoubleFinishingEffect && attribute === 'doubleFinishingEffect' && genesis && (
            <tr><th colSpan="2">{isImageVisible ? <></> : <>創世：</>}破壞的雅達巴特</th></tr>
          )}
        </thead>
        <tbody>
          {sortedRoleData.map((role) => (
            <tr key={role.job}>
              <td>
                {isImageVisible && (
                  <><img src={('https://hiteku.github.io/img/ms/role/' + role.job + '.png')} style={{width: "115px"}} alt="" /><br/></>
                )}
                {role.job}
              </td>
              {!hideTd500 && <td>{role.group}</td>}
              {!hideTd500 && <td>{role.class}</td>}
              {showSkills && !role.skills.includes('々') &&(
                <td
                  style={{ textAlign: 'left', verticalAlign: 'top' }}
                  rowSpan={(role.skills.includes('時之祝福')) ? 1 : parseInt(role.skills.split('\n')[0].match(/\d+/)) / 2}
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
                    (hideTd700 && index < 2) || (isImageVisible && index !== 3) || (
                      <td key={index}>{effect.split('+')[1]}</td>
                    )
                  ))}
                </>
              )}
              {showDoubleFinishingEffect && (
                <>
                  <td>
                    {attribute === 'attackSpeed' && role.weapon}
                    {attribute === 'bossDamage' && role.bossDamage}
                    {attribute === 'criticalChance' && role.criticalChance}
                    {attribute === 'doubleFinishingEffect' && (
                      genesis
                        ? `${role.doubleFinishingEffect.split(', ')[0].split('(')[1].replace(')', '')}%`
                        : `${role.doubleFinishingEffect.split(', ')[0].split('(')[0]}%`
                    )}
                  </td>
                  <td>
                    {attribute === 'attackSpeed' && role.attackSpeed}
                    {attribute === 'bossDamage' && role.ignoreDefense}
                    {attribute === 'criticalChance' && role.criticalDamage}
                    {attribute === 'doubleFinishingEffect' && (
                      genesis
                        ? `${role.attackThreshold.split(', ')[0].split('(')[1].replace(')', '')}%`
                        : `${role.attackThreshold.split(', ')[0].split('(')[0]}%`
                    )}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="src">
        <sub>
          <a href="https://forum.gamer.com.tw/Co.php?bsn=7650&sn=6446584" target="_blank" rel="noopener noreferrer">
            <img
              src={`https://hiteku.github.io/img/-/bahamut.png`}
              alt="imgBahamut"
            />
          </a>
          {/* </a>&nbsp;
          <a href="https://www.youtube.com/Hiteku" target="_blank" rel="noopener noreferrer">
            <img
              src={`https://hiteku.github.io/img/-/youtube.png`}
              alt="imgYoutube"
            /> */} © Hiteku&nbsp;
          {currentPage === '能力資訊' && (
            <>
              {(attribute === 'attackSpeed' || attribute === 'criticalChance' )&& (
                <><span>更新於V259版本．資料來源：</span>
                <a className="src" href="https://forum.gamer.com.tw/Co.php?bsn=7650&sn=6304658" target="_blank" rel="noreferrer">
                  各職業攻速與暴擊率列表
                </a></>
              )}
              {attribute === 'doubleFinishingEffect' && (
                <><span>更新於V259版本．資料來源：</span>
                <a className="src" href="https://forum.gamer.com.tw/Co.php?bsn=7650&sn=6444987" target="_blank" rel="noreferrer">
                  各職業終傷萌獸效益統整
                </a></>
              )}
            </>
          )}
        </sub>
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
