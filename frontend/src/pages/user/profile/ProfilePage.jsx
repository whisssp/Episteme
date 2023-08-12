/* eslint-disable react/prop-types */
import { Fragment, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useMode } from "../../../context/mode-context";
import { tokens } from "../../../constants/theme";
import { useParams } from "react-router-dom";
import { CardPost } from "../../../components/CardPost";
import { DEFAULT_IMAGE } from "../../../constants/default";
import { getAuthorById } from "../../../services/authService";
import {
  getAllCardByType,
  getAllPostOfAuthor,
  getStatisticByType,
} from "../../../services/authorService";
import CardDraft from "../../../components/CardDraft/CardDraft";
import CardAuthor from "../../../components/CardAuthor";
import { STATUS_POST } from "../../../constants/status";
import {
  PostCategoryStat,
  ProfileStatistic,
} from "../../../components/ProfileStatistic";

const ProfilePage = () => {
  const { userId } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [cardType, setCardType] = useState("");
  const [statistic, setStatistic] = useState({});
  const [categoriesPosted, setCategoriesPosted] = useState([]);
  // const [data, setData] = useState(null);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Tác giả";
    if (userId) {
      getAuthorById(userId)
        .then((response) => setUserInfo(response.data))
        .catch((e) => console.log(e));
      getStatisticByType(userId, "posts-views")
        .then((response) =>
          setStatistic((prev) => {
            return { ...prev, totalView: response.data };
          })
        )
        .catch((e) =>
          console.log("ProfilePage - GetStatisticByType-postviews", e)
        );
      getStatisticByType(userId, "post-number")
        .then((response) =>
          setStatistic((prev) => {
            return { ...prev, totalPost: response.data };
          })
        )
        .catch((e) => console.log("ProfilePage - GetStatisticByType-posts", e));
      getStatisticByType(userId, "bookmarks-number")
        .then((response) =>
          setStatistic((prev) => {
            return {
              ...prev,
              totalBookmark: response.data,
            };
          })
        )
        .catch((e) =>
          console.log("ProfilePage - GetStatisticByType-bookmarks", e)
        );
      getStatisticByType(userId, "follows/count")
        .then((response) =>
          setStatistic((prev) => {
            return { ...prev, totalFollower: response.data };
          })
        )
        .catch((e) =>
          console.log("ProfilePage - GetStatisticByType-followers", e)
        );
      getStatisticByType(userId, "pominent-categories")
        .then((response) => setCategoriesPosted(response.data))
        .catch((e) =>
          console.log("ProfilePage - GetStatisticByType-categories", e)
        );
    }
  }, []);

  const handleFollowClick = (e) => {
    e.preventDefault();
    console.log("FOLLOW");
  };
  return (
    <Fragment>
      <Container>
        <Grid
          container
          spacing={1}
          sx={{
            marginBlock: "50px 0",
            flexFlow: {
              xs: "column",
              md: "row",
            },
            alignItems: {
              xs: "center",
              md: "flex-start",
            },
          }}>
          <Grid item md={1} sm={2}>
            <Avatar
              alt={userInfo?.fullname || userInfo?.id || userInfo?.email}
              src={userInfo?.image || DEFAULT_IMAGE.USER_AVATAR}
              sx={{
                display: "block",
                marginX: "auto",
                maxWidth: "80px",
                width: "100%",
                height: "80px",
                marginBottom: {
                  sm: 2,
                  md: 0,
                },
              }}
            />
          </Grid>
          <Grid
            item
            md={11}
            sm={10}
            sx={{
              marginY: "auto",
              display: "flex",
              rowGap: 2,
              alignItems: {
                xs: "center",
                md: "initial",
              },
              flexFlow: {
                xs: "column",
                md: "row",
              },
              justifyContent: {
                md: "space-between",
              },
            }}>
            <Box
              component="div"
              sx={{
                display: "flex",
                flexFlow: "column",
                order: {
                  xs: 2,
                  md: 1,
                },
                rowGap: {
                  md: "8px",
                },
              }}>
              <Typography variant="h5">{userInfo?.fullname}</Typography>
              <Typography
                variant="subtitle2"
                component="span"
                sx={{ fontSize: "12px" }}>
                @{userInfo?.email}
              </Typography>
            </Box>
            <MyButton onClick={handleFollowClick} label="+ Theo dõi" />
          </Grid>
        </Grid>
      </Container>
      <Container
        sx={{
          marginTop: "50px",
        }}>
        <Grid container spacing={2}>
          <Grid item md={9} xs={12}>
            <ListButtons setCardType={setCardType} />
            <ListData type={cardType} userId={userId} />
          </Grid>
          <Grid item md={3} xs={12}>
            <ProfileStatistic statistic={statistic} />
            <PostCategoryStat categories={categoriesPosted} />
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
};

const ListData = ({ type, userId }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    async function fetchData() {
      await getAllPostOfAuthor(userId).then((response) => {
        setData([
          ...response.data.filter(
            (item) => item.status === STATUS_POST.PUBLISHED
          ),
        ]);
      });
    }
    fetchData();
  }, []);
  // useEffect(() => {
  //   getAllCardByType(type, userId)
  //     .then((response) => setData(response.data))
  //     .catch((e) => console.log(e));
  // }, [type]);
  if (!data) return null;
  return (
    <Grid container spacing={2}>
      {data &&
        data.length > 0 &&
        data.map((item) => {
          return (
            <Grid item xs={12} key={item.id}>
              {type === "drafts" && <CardDraft info={item} />}
              {type === "posts" && (
                <CardPost postInfo={item} direction="horizontal" />
              )}
              {type.includes("follow") && <CardAuthor data={item} />}
            </Grid>
          );
        })}
    </Grid>
  );
};

const ListButtons = ({ setCardType }) => {
  const [active, setActive] = useState("posts");
  useEffect(() => {
    setCardType("posts");
    setActive("posts");
  }, []);
  const handleGetPosts = () => {
    setActive("posts");
    setCardType("posts");
  };
  // const handleGetDrafts = () => {
  //   setActive("drafts");
  //   setCardType("drafts");
  // };
  const handleGetFollowings = () => {
    setActive("followings");
    setCardType("followings");
  };
  const handleGetFollowers = () => {
    setActive("followers");
    setCardType("followers");
  };
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        flexDirection: "row",
        mb: 3,
        overflowX: "auto",
        flexWrap: "nowrap",
        alignItems: "center",
        paddingBlock: 1,
      }}>
      <ButtonItem
        text="Bài viết"
        onClick={handleGetPosts}
        active={active === "posts"}
      />
      {/* <ButtonItem
        text="Bài viết nháp"
        onClick={handleGetDrafts}
        active={active === "drafts"}
      /> */}
      <ButtonItem
        text="Theo dõi"
        onClick={handleGetFollowings}
        active={active === "followings"}
      />
      <ButtonItem
        text="Người theo dõi"
        onClick={handleGetFollowers}
        active={active === "followers"}
      />
    </Box>
  );
};

const ButtonItem = ({ text, onClick = () => {}, active }) => {
  const { theme } = useMode();
  const token = tokens(theme.palette.mode);

  return (
    <Button
      variant="outlined"
      component="span"
      sx={{
        width: "fit-content",
        wordBreak: "normal",
        wordWrap: "normal",
        borderColor: active ? "initial" : "transparent",
        color: token.text,
        flexShrink: 0,
      }}
      onClick={onClick}>
      {text}
    </Button>
  );
};

const MyButton = ({ onClick = () => {}, label }) => {
  const {
    theme: { palette },
  } = useMode();
  const token = tokens(palette.mode);
  return (
    <Button
      onClick={onClick}
      variant="outlined"
      sx={{
        alignSelf: "center",
        color: token.textColor,
        height: "fit-content",
        borderColor: "currentColor",
        // ":hover": {
        //    color: token.greenAccent,
        //    borderColor: "currentColor",
        // },
        order: {
          md: 2,
          xs: 1,
        },
      }}>
      {label}
    </Button>
  );
};

export default ProfilePage;
