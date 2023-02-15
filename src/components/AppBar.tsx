import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { StyledMenu } from "./StyledMenu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/router";
import Link from "next/link";
import { Badge } from "@mui/material";

export function ResponsiveAppBar() {
  const { push } = useRouter();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleLogout = async () => {
    await push("/auth/desconectar");
  };
  const session = useSession();
  return (
    <AppBar sx={{ background: "rgb(30 41 59)" }} position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              display: "flex",
              // display: { xs: "none", md: "flex" },
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
              display: "flex",

              // display: { xs: "none", md: "flex" },
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
              display: "flex",

              //  display: { xs: "none", md: "flex" }
            }}
          >
            <Link href="/cadastro/cliente">
              <MenuItem onClick={handleCloseNavMenu}>
                <Typography textAlign="center">Clientes</Typography>
              </MenuItem>
            </Link>
            <Link href="/cadastro/tecnico">
              <MenuItem onClick={handleCloseNavMenu}>
                <Badge variant="dot" color="error">
                  <Typography textAlign="center">Técnicos</Typography>
                </Badge>
              </MenuItem>
            </Link>
            <Link href="/cadastro/loja">
              <MenuItem onClick={handleCloseNavMenu}>
                <Badge variant="dot" color="error">
                  <Typography textAlign="center">Revendas</Typography>
                </Badge>
              </MenuItem>
            </Link>
            <Link href="/cadastro/servico">
              <MenuItem onClick={handleCloseNavMenu}>
                <Badge variant="dot" color="error">
                  <Typography textAlign="center">Serviços</Typography>
                </Badge>
              </MenuItem>
            </Link>
            <Link href="/cadastro/usuario">
              <MenuItem onClick={handleCloseNavMenu}>
                <Badge variant="dot" color="error">
                  <Typography textAlign="center">Usuarios</Typography>
                </Badge>
              </MenuItem>
            </Link>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
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

                {/* <Avatar
                component=
                  alt={session.data?.user.name ?? ""}
                  src={
                    session.data?.user.image ?? "/static/images/avatar/2.jpg"
                  }
                /> */}
              </IconButton>
            </Tooltip>
            <StyledMenu
              sx={{ mt: "50px" }}
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
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
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
{
  /* <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <MenuItem onClick={async () => await push("cadastro/cliente")}>
                <Typography textAlign="center">Clientes</Typography>
              </MenuItem>
              <MenuItem onClick={() => push("cadastro/tecnico")}>
                <Typography textAlign="center">Técnicos</Typography>
              </MenuItem>
              <MenuItem onClick={() => push("cadastro/loja")}>
                <Typography textAlign="center">Revendas</Typography>
              </MenuItem>
              <MenuItem onClick={() => push("cadastro/servico")}>
                <Typography textAlign="center">Serviços</Typography>
              </MenuItem>
              <MenuItem onClick={() => push("cadastro/usuario")}>
                <Typography textAlign="center">Usuarios</Typography>
              </MenuItem>
            </Menu>
          </Box>
          
          <Box sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}>
            <Image
              src="/Logo.png"
              width={95}
              height={95}
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
          </Typography> */
}
