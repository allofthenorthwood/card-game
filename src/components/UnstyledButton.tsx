import styled from "styled-components";

const UnstyledButton = ({
  children,
  onClick,
  disabled,
}: {
  children: JSX.Element;
  onClick(): void;
  disabled?: boolean;
}) => {
  return (
    <Button onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  );
};

const Button = styled.button`
  border: none;
  background: none;
  padding: 0;
  display: block;
  cursor: pointer;
  font: inherit;
  color: inherit;
  text-decoration: inherit;
  text-align: inherit;
  &:disabled {
    cursor: default;
  }
`;

export default UnstyledButton;
