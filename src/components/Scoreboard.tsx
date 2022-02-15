import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faScaleBalanced,
  faScaleUnbalanced,
  faScaleUnbalancedFlip,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

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
  return (
    <Container>
      <ScoreSide>
        <Label>Player</Label> <Score>{playerScore}</Score>
      </ScoreSide>
      <Icon>
        <FontAwesomeIcon icon={icon} />
      </Icon>

      <ScoreSide>
        <Label>Opponent</Label> <Score>{opponentScore}</Score>
      </ScoreSide>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  text-align: center;
`;
const ScoreSide = styled.div`
  width: 100px;
  background: #eee;
  padding: 10px;
  border-radius: 5px;
`;
const Label = styled.div`
  text-transform: uppercase;
  font-size: 12px;
`;
const Score = styled.div`
  font-size: 30px;
  padding-top: 5px;
  font-family: consolas;
`;
const Icon = styled.div`
  font-size: 40px;
  padding: 10px;
`;

export default ScoreBoard;
