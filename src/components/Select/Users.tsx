import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import type { SelectChangeEvent } from "@mui/material/Select";
import Select from "@mui/material/Select";
import { useSession } from "next-auth/react";
import React from "react";
import { api } from "../../utils/api";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      background: "rgb(30 41 59)",
      color: "#FFF",
    },
  },
};
interface SelectUsersProps {
  onChange: (personName: string[]) => void;
  value: string[];
}
function SelectUsers(props: SelectUsersProps) {
  const listUsers = api.user.getAll.useQuery({});

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    props.onChange(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const session = useSession();
  const role = session?.data?.user.role;
  const sessionUserId = session?.data?.user.id;

  return (
    <FormControl>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        variant="standard"
        value={props?.value}
        onChange={handleChange}
        sx={{
          p: 0.5,
          maxWidth: 100,
          color: "#FFF",
          background: "#334155",
          columnFill: "#FFF",
          fill: "white",
          borderRadius: "5px",
        }}
        renderValue={(selected) =>
          listUsers.data
            ?.filter((user) => selected?.includes(user.id))
            ?.map((user) => user.name)
            .join(", ")
        }
        MenuProps={MenuProps}
      >
        {listUsers.data?.map((user) => {
          if (user.id === sessionUserId && role !== "TECH") return;

          return (
            <MenuItem key={user.id} value={user.id}>
              <Checkbox
                sx={{ color: "#FFF" }}
                checked={props.value.indexOf(user.id) > -1}
              />
              <ListItemText primary={user.name} />
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

export default React.memo(SelectUsers);
