import { Button, styled, type ButtonProps } from "@mui/material";

type StyledButtonProps = ButtonProps & { to?: string };

const StyledButton = styled(Button)<StyledButtonProps>(({ theme }) => ({
  "&.Mui-disabled": {
    backgroundColor: theme.palette.grey[600],
    color: theme.palette.text.disabled,
  },
}));

export default StyledButton;
