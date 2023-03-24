import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import type { SelectChangeEvent } from "@mui/material/Select";
import Select from "@mui/material/Select";
import { useSession } from "next-auth/react";
import React from "react";
import { api } from "../../utils/api";

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: "500px",
      width: 250,
      background: "rgb(30 41 59)",
      color: "#FFF",
    },
  },
};
interface SelectRegionsProps {
  onChange: (personName: string[]) => void;
  value: string[];
}
function SelectRegions(props: SelectRegionsProps) {
  const listRegions = api.region.getAll.useQuery({});

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
          listRegions.data
            ?.filter((region) => selected?.includes(region.id))
            ?.map((region) => region.name)
            .join(", ")
        }
        MenuProps={MenuProps}
      >
        {listRegions.data?.map((region) => {
          return (
            <MenuItem key={region.id} value={region.id}>
              <Checkbox
                sx={{ color: "#FFF" }}
                checked={props.value.indexOf(region.id) > -1}
              />
              <ListItemText primary={region.name} />
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

export default React.memo(SelectRegions);
