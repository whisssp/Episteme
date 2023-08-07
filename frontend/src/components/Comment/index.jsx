import React, { useEffect, useState } from "react";
import CommentBox from "./CommentBox";
import { Avatar, Box, Button, Stack, TextField } from "@mui/material";
import InputComment from "./InputComment";
import { useAuth } from "../../context/auth-context";
import {
  addCommentPost,
  addCommentReplyPost,
  getCommentPost,
} from "../../services/commentService";
import ReplyBox from "./ReplyBox";
import { toast } from "react-toastify";

const Comment = ({ post }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (post?.id) {
      getCommentPost(post?.id).then((response) => {
        setComments(response);
      });
    }
  }, [post]);
  const handleCommentPost = (value) => {
    const data = {
      content: value,
      userId: user.id,
    };
    addCommentPost(post.id, data)
      .then((response) => {
        setComments((comment) => [response.data, ...comment]);
        toast.success("Thêm bình luận thành công");
      })
      .catch(() => toast.error("Thêm bình luận thất bại"));
  };
  return (
    <Box>
      <Box className="comment-box__container">
        <CommentBox handleCommentPost={handleCommentPost}></CommentBox>
        <Stack spacing={3}>
          {comments.map((comment) => (
            <ReplyBox postId={post?.id} key={comment.id} comment={comment} />
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default Comment;
