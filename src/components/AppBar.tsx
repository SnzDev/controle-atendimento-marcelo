import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/MenuOutlined";
import { Badge } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { api } from "../utils/api";
import { StyledMenu } from "./StyledMenu";
import { SelectUser } from "../components/Select";
import type {
  FilterAssignment,
  HandleChangeFilterAssignment,
} from "../pages/atendimento/new";
type ResponsiveAppBarProps =
  | {
      screenAssignment: true;
      openModalSummary: () => void;
      filterAssignment: FilterAssignment;
      onChange: (props: HandleChangeFilterAssignment) => void;
    }
  | {
      screenAssignment?: false;
      filterAssignment?: FilterAssignment;
      onChange?: undefined;
      openModalSummary?: undefined;
    };

function ResponsiveAppBar({
  onChange,
  filterAssignment,
  screenAssignment,
  openModalSummary,
}: ResponsiveAppBarProps) {
  const { push } = useRouter();

  const { data } = useSession();
  const isTechnic = data?.user.role === "TECH";
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    await push("/auth/desconectar");
  };
  const listShop = api.shop.getAll.useQuery({});
  const session = useSession();
  const role = session.data?.user.role;
  return (
    <AppBar sx={{ background: "rgb(30 41 59)", minHeight: "64px" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              mr: 1,
            }}
          >
            <Image
              src="/Logo.png"
              width={95}
              height={95}
              alt="Logo AcesseNet"
            />
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            AcesseNet
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
            }}
          >
            <Link href="/atendimento">
              <MenuItem>
                <Typography textAlign="center">Atendimentos</Typography>
              </MenuItem>
            </Link>
            {role !== "TECH" && (
              <Link href="/cadastro/cliente">
                <MenuItem>
                  <Badge variant="dot" color="success">
                    <Typography textAlign="center">Clientes</Typography>
                  </Badge>
                </MenuItem>
              </Link>
            )}
            {role === "ADMIN" && [
              <Link key="shop" href="/cadastro/loja">
                <MenuItem>
                  <Badge variant="dot" color="error">
                    <Typography textAlign="center">Revendas</Typography>
                  </Badge>
                </MenuItem>
              </Link>,
              <Link key="service" href="/cadastro/servico">
                <MenuItem>
                  <Badge variant="dot" color="error">
                    <Typography textAlign="center">Serviços</Typography>
                  </Badge>
                </MenuItem>
              </Link>,
              <Link key="user" href="/cadastro/usuario">
                <MenuItem>
                  <Badge variant="dot" color="error">
                    <Typography textAlign="center">Usuarios</Typography>
                  </Badge>
                </MenuItem>
              </Link>,
            ]}
            {!isTechnic && screenAssignment && (
              <div className="ml-5 flex gap-5">
                <SelectUser
                  onChange={(e) => {
                    onChange &&
                      onChange({ key: "usersSelect", value: e ?? [] });
                  }}
                  value={filterAssignment?.usersSelect ?? []}
                />
                <select
                  value={filterAssignment?.shopId ?? ""}
                  onChange={(e) => {
                    onChange &&
                      onChange({ key: "shopId", value: e.target.value });
                  }}
                  className="rounded-md border-slate-100 bg-slate-700 p-2 text-slate-100 shadow-lg"
                  placeholder="Loja"
                >
                  <option value="">Revenda</option>
                  {listShop?.data?.map((item) => (
                    <option value={item.id} key={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>

                <input
                  value={filterAssignment?.dateActivity}
                  onChange={(e) =>
                    onChange({ key: "dateActivity", value: e.target.value })
                  }
                  className="rounded-md border-slate-100 bg-slate-700 p-2 text-slate-100 shadow-lg"
                  type="date"
                />
              </div>
            )}
          </Box>
          <Box sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
            <Tooltip title="Opções">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  sx={{ background: " rgb(51 65 85)" }}
                  alt={session.data?.user.name ?? ""}
                >
                  {session.data?.user.image ? (
                    <Image
                      alt={session.data?.user.name ?? ""}
                      width={100}
                      height={100}
                      src={
                        session.data?.user.image ??
                        "/static/images/avatar/2.jpg"
                      }
                    />
                  ) : (
                    session.data?.user.name?.[0] ?? ""
                  )}
                </Avatar>
              </IconButton>
            </Tooltip>
            <StyledMenu
              sx={{ display: { xs: "none", md: "flex" }, mt: "50px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={!!anchorElUser}
              onClose={handleCloseUserMenu}
            >
              {!isTechnic && screenAssignment && (
                <MenuItem onClick={openModalSummary}>
                  <Typography textAlign="center">Resumo Diário</Typography>
                </MenuItem>
              )}
              <MenuItem sx={{ color: "#FFF" }} onClick={handleLogout}>
                <LogoutIcon name="logout" />
                <Typography textAlign="center">Sair</Typography>
              </MenuItem>
            </StyledMenu>
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}>
            <Image
              src="/Logo.png"
              width={65}
              height={65}
              alt="Logo AcesseNet"
            />
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            AcesseNet
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenUserMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <StyledMenu
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={!!anchorElUser}
              onClose={handleCloseUserMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <Link href="/atendimento">
                <MenuItem>
                  <Typography textAlign="center">Atendimentos</Typography>
                </MenuItem>
              </Link>
              {role !== "TECH" && (
                <Link href="/cadastro/cliente">
                  <MenuItem>
                    <Typography textAlign="center">Clientes</Typography>
                  </MenuItem>
                </Link>
              )}
              {role === "ADMIN" && [
                <Link key="shop" href="/cadastro/loja">
                  <MenuItem>
                    <Badge variant="dot" color="error">
                      <Typography textAlign="center">Revendas</Typography>
                    </Badge>
                  </MenuItem>
                </Link>,
                <Link key="service" href="/cadastro/servico">
                  <MenuItem>
                    <Badge variant="dot" color="error">
                      <Typography textAlign="center">Serviços</Typography>
                    </Badge>
                  </MenuItem>
                </Link>,
                <Link key="user" href="/cadastro/usuario">
                  <MenuItem>
                    <Badge variant="dot" color="error">
                      <Typography textAlign="center">Usuarios</Typography>
                    </Badge>
                  </MenuItem>
                </Link>,
              ]}
              {!isTechnic &&
                screenAssignment && [
                  <MenuItem key="shopSelector">
                    <select
                      value={filterAssignment?.shopId ?? ""}
                      onChange={(e) => {
                        onChange({ key: "shopId", value: e.target.value });
                      }}
                      style={{ background: "rgb(30 41 59)" }}
                      placeholder="Loja"
                    >
                      <option disabled value="">
                        Revenda
                      </option>
                      {listShop?.data?.map((item) => (
                        <option
                          value={item.id}
                          key={item.id}
                          className=" text-white"
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </MenuItem>,
                  <MenuItem key="dateSelector">
                    <input
                      value={filterAssignment?.dateActivity}
                      onChange={(e) =>
                        onChange({ key: "dateActivity", value: e.target.value })
                      }
                      type="date"
                      style={{
                        background: "rgb(30 41 59)",
                        marginLeft: 20,
                        color: "#FFF",
                      }}
                    />
                  </MenuItem>,
                ]}

              {!isTechnic && screenAssignment && (
                <MenuItem onClick={openModalSummary}>
                  <Typography textAlign="center">Resumo Diário</Typography>
                </MenuItem>
              )}
              <MenuItem sx={{ color: "#FFF" }} onClick={handleLogout}>
                <LogoutIcon name="logout" />
                <Typography textAlign="center">Sair</Typography>
              </MenuItem>
            </StyledMenu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default React.memo(ResponsiveAppBar);
