import styled from "styled-components";

const UnstyledButton = ({
  children,
  onClick,
}: {
  children: JSX.Element;
  onClick(): void;
}) => {
  return <Button onClick={onClick}>{children}</Button>;
};

const Button = styled.button`
  border: none;
  background: none;
  padding: 0;
  display: block;
  cursor: pointer;
  font: inherit;
`;

export default UnstyledButton;
