import { useState } from "react";
import { InputGroup, Input, InputRightElement, Button } from "@chakra-ui/react";

export default function PasswordInput({
  isInvalid,
  field,
  placeholder,
}): JSX.Element {
  const [show, setShow] = useState(false);
  const handleClick = (): void => setShow(!show);

  return (
    <InputGroup size="md">
      <Input
        {...field}
        pr="4.5rem"
        type={show ? "text" : "password"}
        placeholder={placeholder}
        errorBorderColor="crimson"
        isInvalid={isInvalid}
      />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
          {show ? "Hide" : "Show"}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}
