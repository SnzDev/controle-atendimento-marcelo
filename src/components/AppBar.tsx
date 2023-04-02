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
import AssignmentIcon from "@mui/icons-material/Assignment";
import StoreIcon from "@mui/icons-material/Store";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import BadgeIcon from "@mui/icons-material/Badge";
import PersonIcon from "@mui/icons-material/Person";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { api } from "../utils/api";
import { StyledMenu } from "./StyledMenu";
import { SelectUser, SelectService } from "../components/Select";
import type {
  FilterAssignment,
  HandleChangeFilterAssignment,
} from "../pages/atendimento";
import type { UserRole } from "@prisma/client";
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
interface IMenu {
  name: string;
  href: string;
  icon: React.ReactElement;
  role: UserRole[];
}

const menu: IMenu[] = [
  {
    name: "Atendimentos",
    href: "/atendimento",
    icon: <AssignmentIcon fontSize="medium" />,
    role: ["ADMIN", "TECH", "USER"],
  },
  {
    name: "Clientes",
    href: "/cadastro/cliente",
    icon: <PersonIcon fontSize="medium" />,
    role: ["ADMIN", "USER"],
  },
  {
    name: "Regiões",
    href: "/cadastro/regiao",
    icon: <LocationOnIcon fontSize="medium" />,
    role: ["ADMIN"],
  },
  {
    name: "Revendas",
    href: "/cadastro/loja",
    icon: <StoreIcon fontSize="medium" />,
    role: ["ADMIN"],
  },
  {
    name: "Serviços",
    href: "/cadastro/servico",
    icon: <HomeRepairServiceIcon fontSize="medium" />,
    role: ["ADMIN"],
  },
  {
    name: "Usuários",
    href: "/cadastro/usuario",
    icon: <BadgeIcon fontSize="medium" />,
    role: ["ADMIN"],
  },
];

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
            {menu.map((menu) => {
              if (!menu.role.includes(role as UserRole)) return null;
              return (
                <Link href={menu.href} key={menu.name}>
                  <Tooltip title={menu.name}>
                    <MenuItem>{menu.icon}</MenuItem>
                  </Tooltip>
                </Link>
              );
            })}
            {!isTechnic && screenAssignment && (
              <div className="ml-5 flex gap-5">
                <input
                  placeholder="Nome do cliente"
                  value={filterAssignment?.clientName ?? ""}
                  onChange={(e) =>
                    onChange({ key: "clientName", value: e.target.value })
                  }
                  className="rounded-md border-slate-100 bg-slate-700 p-2 text-slate-100 shadow-lg"
                />
                <SelectService
                  onChange={(e) => {
                    onChange &&
                      onChange({ key: "servicesSelect", value: e ?? [] });
                  }}
                  value={filterAssignment?.servicesSelect ?? []}
                />
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
              {menu.map((menu) => {
                if (!menu.role.includes(role as UserRole)) return null;
                return (
                  <Link href={menu.href} key={menu.name}>
                    <MenuItem>
                      <Typography textAlign="center">{menu.name}</Typography>
                    </MenuItem>
                  </Link>
                );
              })}
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
