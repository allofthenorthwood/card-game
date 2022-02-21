import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faScaleBalanced,
  faScaleUnbalanced,
  faScaleUnbalancedFlip,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import _ from "lodash";

const ScoreBoard = ({
  playerScore,
  opponentScore,
}: {
  playerScore: number;
  opponentScore: number;
}) => {
  const icon =
    playerScore < opponentScore
      ? faScaleUnbalanced
      : playerScore > opponentScore
      ? faScaleUnbalancedFlip
      : faScaleBalanced;

  const scoreDifference = Math.min(
    Math.max(playerScore - opponentScore, -5),
    5
  );
  const scaleSize = 5;
  return (
    <Container>
      <Icon>
        <FontAwesomeIcon icon={icon} />
      </Icon>

      <ScoreVis>
        <Label>Lose</Label>
        <ScoreScale>
          {Array(scaleSize * 2 + 1)
            .fill(null)
            .map((val, idx) => {
              const cur = idx - scaleSize;
              return (
                <ScoreTick
                  key={idx}
                  center={cur === 0}
                  current={scoreDifference === cur}
                >
                  <TickLabel>{cur}</TickLabel>
                </ScoreTick>
              );
            })}
        </ScoreScale>
        <Label>Win</Label>
      </ScoreVis>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  text-align: center;
  flex-direction: column;
`;
const ScoreScale = styled.div`
  display: flex;
`;
const size = 25;
const Label = styled.div`
  text-transform: uppercase;
  font-size: 14px;
  padding: 0 5px;
  line-height: ${size}px;
  font-weight: bold;
  width: 50px;
`;
const ScoreVis = styled.div`
  display: flex;
  padding-bottom: 15px;
`;
const ScoreTick = styled.div<{ current: boolean; center: boolean }>`
  width: ${size}px;
  height: ${size}px;
  border-color: ${(props) =>
    props.current ? "#000" : props.center ? "#999" : "#cccc"};
  border-style: solid;
  border-width: 0;
  border-left-width: 4px;
  background: #eee;
  line-height: ${size - 1}px;
  position: relative;

  &:last-of-type {
    width: 0;
    background: transparent;
  }
`;
const TickLabel = styled.div`
  position: absolute;
  left: -${size / 2 + 2}px;
  top: ${size * 0.8}px;
  text-align: center;
  width: ${size}px;
  font-size: 10px;
`;
const Icon = styled.div`
  font-size: 40px;
  padding: 10px;
`;

export default ScoreBoard;
