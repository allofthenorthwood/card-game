import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandFist, faHeart, faPaw } from "@fortawesome/free-solid-svg-icons";
import { PlayableCardType, CardType } from "src/cardLibrary";
import ResizeText from "src/components/ResizeText";
import styleVars from "src/styleVars";

const maxTitleSize = 20;

export const RawCard = ({
  card,
  healthDiff,
  attackDiff,
}: {
  card: CardType;
  healthDiff?: number;
  attackDiff?: number;
}) => {
  const { name, icon, attack, health, sigils } = card;
  return (
    <Container>
      <Title>
        <ResizeText maxFontSize={maxTitleSize}>{name}</ResizeText>
      </Title>
      <CenterPanel>
        <Icon>
          <FontAwesomeIcon icon={icon ? icon : faPaw} />
        </Icon>
        <Sigils>
          {sigils.map((sigil, idx) => {
            return <span key={sigil + idx}>{sigil}</span>;
          })}
        </Sigils>
      </CenterPanel>
      <Footer>
        <Stat statDiff={attackDiff}>
          <StatIcon>
            <FontAwesomeIcon icon={faHandFist} />
          </StatIcon>
          <StatVal>{attack}</StatVal>
        </Stat>
        <Stat statDiff={healthDiff}>
          <StatIcon>
            <FontAwesomeIcon icon={faHeart} />
          </StatIcon>
          <StatVal>{health}</StatVal>
        </Stat>
      </Footer>
    </Container>
  );
};
const Card = ({ card }: { card: PlayableCardType }) => {
  const attackDiff = card.card.attack - card.originalCard.attack;
  const healthDiff = card.card.health - card.originalCard.health;
  return (
    <RawCard card={card.card} attackDiff={attackDiff} healthDiff={healthDiff} />
  );
};

export const ReverseCardSlot = () => {
  return (
    <ReverseContainer>
      <FontAwesomeIcon icon={faPaw} />
    </ReverseContainer>
  );
};

export const EmptyCardSlot = () => {
  return <Container empty={true} />;
};

const border = "2px solid #ddd";
type ContainerProps = {
  empty?: boolean;
  reverse?: boolean;
};

export const cardShape = `
  width: ${styleVars.cardWidth}px;
  height: ${styleVars.cardHeight}px;
  border-radius: ${styleVars.cardBorderRadius}px;
`;

const Container = styled.div<ContainerProps>`
  ${cardShape}
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
  font-size: 16px;
  border: 1px solid ${(props) => (props.empty ? "transparent" : "#999")};
  background: ${(props) => (props.empty ? "transparent" : "#f3f3f3;")};
`;
const ReverseContainer = styled.div`
  ${cardShape}
  display: flex;
  background: #bbb;
  color: #ddd;
  border: 1px solid #999;
  align-items: center;
  justify-content: center;
  font-size: 50px;
`;

const Title = styled.div`
  text-align: center;
  padding: 5px;
  border-bottom: ${border};
`;

const CenterPanel = styled.div`
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  display: flex;
  position: relative;
`;
const Sigils = styled.div`
  font-size: 10px;
  position: absolute;
  top: 2px;
  left: 5px;
`;
const Icon = styled.div`
  font-size: 40px;
`;

const Footer = styled.div`
  display: flex;
  align-items: flex-end;
  padding: 0 2px;
  justify-content: space-between;
  border-top: ${border};
`;
const Stat = styled.div<{ statDiff?: number }>`
  padding: 5px;
  display: flex;
  flex-direction: row;
  font-weight: bold;
  align-items: center;
  color: ${(props) =>
    props.statDiff
      ? props.statDiff > 0
        ? styleVars.green
        : styleVars.red
      : "inherit"};
`;
const StatVal = styled.div`
  padding-left: 4px;
`;
const StatIcon = styled.div`
  font-size: 12px;
`;

export default Card;
