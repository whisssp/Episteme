import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { useMode } from "./context/mode-context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import ListPostPage from "./pages/admin/ListPostPage";
import HomePage from "./pages/admin/HomePage";
import ListUsersPage from "./pages/admin/ListUsersPage";
import FormAddUserPage from "./pages/admin/FormAddUserPage";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ListCategoryPage from "./pages/admin/ListCategoryPage";
import FormAddCategoryPage from "./pages/admin/FormAddCategoryPage";
import Main from "./layouts/Main";
import About from "./pages/user/about";
import ProfilePage from "./pages/user/profile/ProfilePage";
import UpdateProfilePage from "./pages/user/update-profile/UpdateProfilePage";
import RegisterPage from "./pages/user/register/RegisterPage";
import ErrorPage from "./pages/user/error/ErrorPage";
import LoginPage from "./pages/user/login/LoginPage";
import { AuthProvider } from "./context/auth-context";
import HomePageUser from "./pages/user/home/HomePage";
import ListPage from "./pages/user/list/ListPage";
import CreatePostPage from "./pages/user/post/CreatePostPage";
import ViewPostPage from "./pages/user/post/ViewPostPage";
import FormUpdateCategoryPage from "./pages/admin/FormUpdateCategoryPage";
import FormUpdateUserPage from "./pages/admin/FormUpdateUserPage";
import MyProfilePage from "./pages/user/profile/MyProfilePage";

function App() {
   const { theme } = useMode();
   return (
      <ThemeProvider theme={theme}>
         <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CssBaseline />
            <AuthProvider>
               <Routes>
                  <Route path="/admin" element={<AdminLayout />}>
                     <Route index element={<HomePage />} />
                     <Route path="users" element={<ListUsersPage />} />
                     <Route path="users/add" element={<FormAddUserPage />} />
                     <Route
                        path="users/update/:id"
                        element={<FormUpdateUserPage />}
                     />
                     <Route path="posts" element={<ListPostPage />} />
                     <Route path="categories" element={<ListCategoryPage />} />
                     <Route
                        path="categories/add"
                        element={<FormAddCategoryPage />}
                     />
                     <Route
                        path="categories/update/:id"
                        element={<FormUpdateCategoryPage />}
                     />
                     <Route path="*" element={<Box p="20px">Not found</Box>} />
                  </Route>
                  <Route element={<Main />}>
                     <Route index element={<HomePageUser />} />
                     <Route
                        path="/create-post"
                        element={<CreatePostPage />}
                     ></Route>
                     <Route path="/p/:slug" element={<ViewPostPage />} />
                     <Route path="/list/:slug" element={<ListPage />} />
                     <Route path="/aboutUs" element={<About />} />
                     <Route
                        path="/profile/me"
                        element={<MyProfilePage />}
                     ></Route>
                     <Route
                        path="/profile/:userId"
                        element={<ProfilePage />}
                     ></Route>
                     <Route
                        path="/update-profile"
                        element={<UpdateProfilePage />}
                     />
                  </Route>
                  <Route path="/login" element={<LoginPage />}>
                     Login
                  </Route>
                  <Route path="/register" element={<RegisterPage />}>
                     Register
                  </Route>
                  <Route path="*" element={<ErrorPage />} />
               </Routes>
            </AuthProvider>
            <ToastContainer
               position="top-right"
               autoClose={5000}
               hideProgressBar={false}
               newestOnTop={false}
               closeOnClick
               rtl={false}
               pauseOnFocusLoss
               draggable
               pauseOnHover
               theme={theme.palette.mode}
            />
         </LocalizationProvider>
      </ThemeProvider>
   );
}

export default App;
