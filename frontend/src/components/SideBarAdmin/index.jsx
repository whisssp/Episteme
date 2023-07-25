import { useState } from "react";
import {
  Sidebar as ProSidebar,
  Menu,
  MenuItem,
  useProSidebar,
} from "react-pro-sidebar";
import { Avatar, Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import BookmarksOutlinedIcon from "@mui/icons-material/BookmarksOutlined";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import { tokens } from "../../constants/theme";

const Item = ({ title, to, icon }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const { toggleSidebar, broken } = useProSidebar();
  return (
    <MenuItem
      onClick={broken ? () => toggleSidebar() : () => {}}
      active={to === location.pathname}
      style={{ color: colors.greyAccent }}
      icon={icon}
      routerLink={<Link to={to} />}>
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

const SidebarAdmin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { toggleSidebar, collapseSidebar, collapsed, broken } = useProSidebar();

  return (
    <Box
      sx={{
        "& .sidebar-inner": {
          background: `${colors.background} !important`,
          boxShadow: `0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)`,
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))!important`,
          transition: `box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`,
        },
        "& .sidebar": {
          border: "none",
        },
        "& .menu-icon": {
          backgroundColor: "transparent !important",
        },
        "& .menu-item": {
          // padding: "5px 35px 5px 20px !important",
          backgroundColor: "transparent !important",
        },
        "& .menu-anchor": {
          color: "inherit !important",
          backgroundColor: "transparent !important",
        },
        "& .MuiIconButton-root:hover": {
          color: `${colors.blueAccent} !important`,
          backgroundColor: "transparent !important",
        },
        "& .menu-item:hover": {
          color: `${colors.blueAccent} !important`,
          backgroundColor: "transparent !important",
        },
        "& .menu-item.active": {
          color: `${colors.blueAccent} !important`,
          backgroundColor: "transparent !important",
        },
      }}>
      <ProSidebar breakPoint="md">
        <Menu>
          <MenuItem
            icon={
              collapsed ? (
                <IconButton onClick={() => collapseSidebar()}>
                  <MenuOutlinedIcon />
                </IconButton>
              ) : undefined
            }
            style={{
              margin: "10px 0 20px 0",
              color: colors.greyAccent,
            }}>
            {!collapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px">
                <Typography variant="h3" color={colors.greyAccent}>
                  Admin
                </Typography>
                <IconButton
                  onClick={
                    broken ? () => toggleSidebar() : () => collapseSidebar()
                  }>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>
          {!collapsed && (
            <Box mb="25px">
              <Box mb="25px">
                <Avatar
                  sx={{ width: "100px", height: "100px", mx: "auto" }}
                  alt="profile-user"
                  src="https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png"
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  textAlign="center"
                  color={colors.greyAccent}
                  fontWeight="bold"
                  mt="10px">
                  Thong
                </Typography>
                <Typography variant="h5" color={colors.greenAccent}>
                  Admin
                </Typography>
              </Box>
            </Box>
          )}
          <Box paddingLeft={collapsed ? undefined : "10%"}>
            <Item
              title="Trang chủ"
              to="/admin"
              icon={<HomeOutlinedIcon></HomeOutlinedIcon>}
            />
            <Typography variant="subtitle1" sx={{ margin: "15px 0 5px 20px" }}>
              Người dùng
            </Typography>
            <Item
              title="Danh sách"
              to="/admin/users"
              icon={<PeopleOutlinedIcon />}
            />
            <Item
              title="Thêm người dùng"
              to="/admin/users/add"
              icon={<PersonAddAltOutlinedIcon />}
            />

            <Typography variant="subtitle1" sx={{ margin: "15px 0 5px 20px" }}>
              Bài viết
            </Typography>
            <Item
              title="Danh sách"
              to="/admin/posts"
              icon={<ReceiptLongOutlinedIcon />}
            />
            <Typography variant="subtitle1" sx={{ margin: "15px 0 5px 20px" }}>
              Danh mục
            </Typography>
            <Item
              title="Danh sách"
              to="/admin/categories"
              icon={<BookmarksOutlinedIcon />}
            />
            <Item
              title="Thêm danh mục"
              to="/admin/categories/add"
              icon={<BookmarkAddOutlinedIcon />}
            />
            <Typography variant="subtitle1" sx={{ margin: "15px 0 5px 20px" }}>
              Thống kê
            </Typography>
            <Item
              title="Bài viết mới"
              to="/admin/bar"
              icon={<BarChartOutlinedIcon />}
            />
            <Item
              title="Người dùng mới"
              to="/admin//pie"
              icon={<PieChartOutlineOutlinedIcon />}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default SidebarAdmin;
