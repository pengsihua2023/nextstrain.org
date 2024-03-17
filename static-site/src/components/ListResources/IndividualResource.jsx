/* eslint-disable react/prop-types */
import React, {useState, useRef, useEffect} from 'react';
import styled from 'styled-components';
import { MdHistory } from "react-icons/md";


/**
 * These variables allow calculation of the width of <IndividualResource>,
 * which we use for the column layout so that every <IndividualResource>
 * is nicely aligned. There are other ways (e.g. querying the DOM) but
 * this is simpler and seems to be working well.
 */
const [resourceFontSize, pxPerChar] = [16, 10];
const iconWidth = 50; // including text
const gapSize = 10;
export const getMaxResourceWidth = (names) => {
  const nameWidth = names.reduce((w, n) => {
    const _w = n.length*pxPerChar;
    return _w>w ? _w : w;
  }, 200); // 200 is the minimum
  return nameWidth + gapSize + iconWidth;
}

const ResourceLink = styled.a`
  font-size: ${resourceFontSize}px;
  font-family: monospace;
  white-space: pre; /* don't collapse back-to-back spaces */
  color: ${(props) => props.hovered ? '#31586c' : '#5097BA'} !important;
  text-decoration: none !important;
`;

function Name({displayName, hovered, href, topOfColumn}) {
  return (
    <ResourceLink href={href} target="_blank" rel="noreferrer" hovered={hovered}>
      {'• '}{(hovered||topOfColumn) ? displayName.hovered : displayName.default}
    </ResourceLink>
  )
}

const Container = styled.div`
  padding: 3px;
  overflow: hidden;
  color: #4F4B50;
`;

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: ${gapSize}px;
  align-items: center;
`;

export function TooltipWrapper({description, children}) {
  return (
    <div
      data-tooltip-id="listResourcesTooltip"
      data-tooltip-html={description}
      data-tooltip-place="top">
      {children}
    </div>
  )
} 

export function IconContainer({Icon, text, handleClick=undefined, color="#aaa"}) {
  const iconProps = {size: "1.2em", color};
  const hasOnClick = typeof handleClick === 'function';
  return (
    <div
      style={{display: 'flex', color, alignItems: 'center', gap: '3px', cursor: hasOnClick?'pointer':'auto'}}
      onClick={hasOnClick ? handleClick : ()=>{}}
    >
      <Icon {...iconProps}/>
      {text}
    </div>
  )
}


/**
 * 
 * @param {*} param0 
 * @returns 
 */
export const IndividualResource = ({data, isMobile}) => {
  const ref = useRef(null);
  const [topOfColumn, setTopOfColumn] = useState(false);
  useEffect(() => {
    /* The column CSS is great but doesn't allow us to know if an element is at
    the top of its column, so we resort to JS */
    if (ref.current.offsetTop===ref.current.parentNode.offsetTop) {
      setTopOfColumn(true);
    }
  }, []);

  return (
    <Container innerRef={ref}>

      <FlexRow>

        <TooltipWrapper description={`Last known update on ${data.lastUpdated}`}>
          <ResourceLinkWrapper data={data}>          
            <Name displayName={data.displayName} href={data.url} topOfColumn={topOfColumn}/>
          </ResourceLinkWrapper>
        </TooltipWrapper>

        {data.versioned && !isMobile && (
          <TooltipWrapper description={`${data.nVersions} snapshots of this dataset available (click to see them)` +
            `<br/>Last known update on ${data.lastUpdated}`}>
            <IconContainer
              Icon={MdHistory}
              text={data.nVersions}
            />
          </TooltipWrapper>
        )}

      </FlexRow>

    </Container>
  )
}


/**
 * Wrapper component which monitors for mouse-over events and injects a
 * `hovered: boolean` prop into the child.
 */
export const ResourceLinkWrapper = ({children}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div>
      <div onMouseOver={() => setHovered(true)} onMouseOut={() => setHovered(false)}>
        {React.cloneElement(children, { hovered })}
      </div>
    </div>
  )  
}