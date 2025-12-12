"use client";
import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BiDislike, BiSmile } from "react-icons/bi";
import { BsBarChartLine, BsThreeDotsVertical } from "react-icons/bs";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { toggleSaveItem } from "../store/userSlice";
import Dropdown from "../components/Dropdown";
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });
import { Avatar } from "../components/common/Avatar";
import { GrLike } from "react-icons/gr";

import { CiBookmark } from "react-icons/ci";
import { IoMdShareAlt } from "react-icons/io";
import { BiCommentDots } from "react-icons/bi";
import { FaRegBookmark } from "react-icons/fa";
import { HiOutlinePaperClip } from "react-icons/hi2";
import { FiSend } from "react-icons/fi";
import {
  FileText,
  Edit3,
  Trash2,
  Flag,
  UserX,
  EyeOff,
  ThumbsUp,
  MessageCircle,
  ChevronDown,
  Ellipsis,
  ChartNoAxesColumn,
  Heart,
  MessageSquare,
  Repeat2,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { PiDotsThreeOutlineThin, PiShareFatThin } from "react-icons/pi";
import ParseMentions from "../components/common/ParseMentions";
import TruncateText from "../components/common/TruncateText";
import { IoMdHeartEmpty } from "react-icons/io";
import { PiShareFat } from "react-icons/pi";
import { CiRepeat } from "react-icons/ci";
import { LiaCommentDots } from "react-icons/lia";
import { TbMessageCircle } from "react-icons/tb";
// import { CiRepeat } from "react-icons/ci";
import { PiRepeat } from "react-icons/pi";
import { FaHeart } from "react-icons/fa6";
import { CiBookmarkCheck } from "react-icons/ci";
// import { Ellipsis } from 'lucide-react';
import { Bookmark } from "lucide-react";
import { Forward } from "lucide-react";
import { ShieldCheck } from 'lucide-react';
import { Clock } from 'lucide-react';
import { SmartDropdown } from "../components/Dropdown";
import Button from "../components/Button";
import { Smile } from "lucide-react";
import Modal from "../components/Modal";

export default function PostCard({
  post,
  mode = "feed",
  onLike,
  onDislike,
  onRepost,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
  onPollVote,
  onShare,
  onReport,
  onEditPost,
  onDeletePost,
  onHidePost,
  onNotInterested,
  onToggleComments,
}) {
  const router = useRouter();
  const isActivity = mode === "activity";
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.users?.currentUser || null);
  const [expanded, setExpanded] = useState(false);

  // State declarations
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyTarget, setReplyTarget] = useState(null);
  const [visibleComments, setVisibleComments] = useState(2);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [editingComment, setEditingComment] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [shareCount, setShareCount] = useState(post.shares || 0);
  const [commentsEnabled, setCommentsEnabled] = useState(
    post.commentsEnabled !== false
  );
  const [alreadyReposted, setAlreadyReposted] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  // Memoized values
  const {
    likes,
    dislikes,
    commentsCount,
    reposts,
    comments,
    topLevelComments,
  } = useMemo(
    () => ({
      likes: post.likes ?? 0,
      dislikes: post.dislikes ?? 0,
      commentsCount: post.comments ? post.comments.length : 0,
      reposts: post.reposts ?? 0,
      comments: post.comments || [],
      topLevelComments: (post.comments || []).filter((c) => !c.replyTo?.id),
    }),
    [post]
  );

  // Permission checks
  const { isPostOwner, canEditPost, canDeletePost, NotisPostOwner } =
    useMemo(() => {
      const isOwner =
        currentUser?.id === post.user?.id ||
        currentUser?.username === post.user?.username;
      return {
        isPostOwner: isOwner,
        canEditPost: isOwner,
        canDeletePost: isOwner,
        NotisPostOwner: !isOwner,
      };
    }, [currentUser, post.user]);

  // Time ago function
  const timeAgo = useCallback((dateStr) => {
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const key in intervals) {
      const value = Math.floor(seconds / intervals[key]);
      if (value >= 1) {
        return `${value} ${key}${value > 1 ? "s" : ""} ago`;
      }
    }
    return "Just now";
  }, []);

  // Handler functions
  const onShareClick = useCallback(
    (e) => {
      e.stopPropagation();
      setShareCount((prev) => prev + 1);
      onShare?.(post.id);
      toast.success("Post shared!");
    },
    [post.id, onShare]
  );

  const handleCopyLink = useCallback(
    (e) => {
      e?.stopPropagation?.();
      const url = `${window.location.origin}/post/${post.id}`;
      navigator.clipboard.writeText(url);
      toast.info("Link copied to clipboard");
    },
    [post.id]
  );

  const handleNotInterested = useCallback(
    (e) => {
      e?.stopPropagation?.();
      onNotInterested?.(post.id);
    },
    [post.id, onNotInterested]
  );

  const handleHidePost = useCallback(
    (e) => {
      e?.stopPropagation?.();
      onHidePost?.(post.id);
    },
    [post.id, onHidePost]
  );

  const handleReport = useCallback(
    (e) => {
      e?.stopPropagation?.();
      onReport?.(post.id);
    },
    [post.id, onReport]
  );

  const handleEditPost = useCallback(
    (e) => {
      e?.stopPropagation?.();
      onEditPost?.(post);
    },
    [post, onEditPost]
  );

  const handleDeletePost = useCallback(
    (e) => {
      e?.stopPropagation?.();
      if (
        window.confirm(
          "Are you sure you want to delete this post? This action cannot be undone."
        )
      ) {
        onDeletePost?.(post.id);
      }
    },
    [post.id, onDeletePost]
  );

  const handleToggleComments = useCallback(
    (e) => {
      e?.stopPropagation?.();
      const newEnabledState = !commentsEnabled;
      setCommentsEnabled(newEnabledState);
      onToggleComments?.(post.id, newEnabledState);
    },
    [commentsEnabled, post.id, onToggleComments]
  );

  const handleSaveFromMenu = useCallback(
    (e) => {
      e?.stopPropagation?.();
      dispatch(toggleSaveItem({ type: "posts", id: post.id }));
      toast.success(post.saved ? "Removed from saved" : "Saved post");
    },
    [post.id, post.saved, dispatch]
  );

  // Comment handlers
  const openCommentBox = useCallback(
    (replyTo = null) => {
      if (!commentsEnabled) {
        toast.warning("Comments are disabled for this post");
        return;
      }
      setReplyTarget(replyTo);
      setEditingComment(null);
      setShowCommentBox(true);
      setCommentText(replyTo ? `@${replyTo.name} ` : "");
    },
    [commentsEnabled]
  );

  const handleCommentSubmit = useCallback(() => {
    if (!commentText.trim()) return;
    if (!commentsEnabled) {
      toast.warning("Comments are disabled for this post");
      return;
    }

    if (editingComment) {
      onEditComment?.(post.id, editingComment.id, commentText.trim());
      setEditingComment(null);
      toast.success("Comment updated");
    } else {
      const replyToId = replyTarget?.id ?? null;
      const replyToName = replyTarget?.name ?? null;
      onAddComment?.(post.id, commentText.trim(), replyToId, replyToName);
    }

    setCommentText("");
    setReplyTarget(null);
    setShowCommentBox(false);
  }, [
    commentText,
    commentsEnabled,
    editingComment,
    post.id,
    replyTarget,
    onEditComment,
    onAddComment,
  ]);

  const toggleReplies = useCallback((parentId) => {
    setExpandedReplies((prev) => ({ ...prev, [parentId]: !prev[parentId] }));
  }, []);

  const onLikeClick = useCallback(
    (e) => {
      e.stopPropagation();
      onLike?.(post.id);
    },
    [post.id, onLike]
  );

  const onDislikeClick = useCallback(
    (e) => {
      e.stopPropagation();
      onDislike?.(post.id);
    },
    [post.id, onDislike]
  );

  const onRepostClick = (e) => {
    e.stopPropagation();
    onRepost?.(post.id);
  };
  const handleEdit = useCallback((comment) => {
    setEditingComment(comment);
    setCommentText(comment.content);
    setShowCommentBox(true);
    setReplyTarget(null);
  }, []);

  const handleDelete = useCallback(
    (commentId) => {
      onDeleteComment?.(post.id, commentId);
      setConfirmDelete(null);
    },
    [post.id, onDeleteComment]
  );

  const handleLoadMoreComments = useCallback(() => {
    const totalTop = topLevelComments.length;
    setVisibleComments(Math.min(totalTop, visibleComments + 5));
  }, [topLevelComments.length, visibleComments]);

  // Comment permission checks
  const canEditComment = useCallback(
    (comment) => {
      return (
        comment.user.id === currentUser?.id ||
        comment.user.username === currentUser?.username
      );
    },
    [currentUser]
  );

  const canDeleteComment = useCallback(
    (comment) => {
      return (
        comment.user.id === currentUser?.id ||
        comment.user.username === currentUser?.username ||
        isPostOwner
      );
    },
    [currentUser, isPostOwner]
  );

  const handleCommentReport = useCallback(
    (e, comment) => {
      e.stopPropagation();
      onReport?.(post.id, comment.id);
    },
    [post.id, onReport]
  );

  const handleCommentNotInterested = useCallback((e, comment) => {
    e.stopPropagation();
    toast.info("We'll show fewer comments like this");
  }, []);

  // Dropdown Components
  // const PostMenuDropdownButton = useMemo(() => {
  //   return function Button() {
  //     return (
  //       <Ellipsis
  //         className="text-gray-500 hover:text-gray-700 cursor-pointer transition"
  //         size={22}
  //       />
  //     );
  //   };
  // }, []);

  //   const PostMenuDropdownContent = useCallback(({ close }) => (
  //     <div
  //       className="bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-56"
  //       onClick={(e) => e.stopPropagation()}
  //     >

  //       <button
  //         onClick={(e) => {
  //           e.stopPropagation();
  //           handleCopyLink(e);
  //           close();
  //         }}
  //         className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
  //       >
  //         <FiSend size={14} className="text-gray-500" />
  //         <span className="text-sm font-medium">Copy link</span>
  //       </button>

  //       {canEditPost && (
  //         <button
  //           onClick={(e) => {
  //             e.stopPropagation();
  //             handleEditPost(e);
  //             close();
  //           }}
  //           className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
  //         >
  //           <Edit3 size={14} className="text-blue-500" />
  //           <span className="text-sm font-medium">Edit post</span>
  //         </button>
  //       )}

  //       {canDeletePost && (
  //         <button
  //           onClick={(e) => {
  //             e.stopPropagation();
  //             handleDeletePost(e);
  //             close();
  //           }}
  //           className="w-full text-left px-4 py-2.5 text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
  //         >
  //           <Trash2 size={14} />
  //           <span className="text-sm font-medium">Delete post</span>
  //         </button>
  //       )}

  //       {canEditPost && (
  //         <button
  //           onClick={(e) => {
  //             e.stopPropagation();
  //             handleToggleComments(e);
  //             close();
  //           }}
  //           className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
  //         >
  //           <BiCommentDots size={14} className="text-gray-500" />
  //           <span className="text-sm font-medium">
  //             {commentsEnabled ? "Disable comments" : "Enable comments"}
  //           </span>
  //         </button>
  //       )}

  //       {!NotisPostOwner && (
  //         <>
  //           <button
  //             onClick={(e) => {
  //               e.stopPropagation();
  //               handleNotInterested(e);
  //               close();
  //             }}
  //             className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
  //           >
  //             <EyeOff size={14} className="text-gray-500" />
  //             <span className="text-sm font-medium">Not interested</span>
  //           </button>

  //           <button
  //             onClick={(e) => {
  //               e.stopPropagation();
  //               handleHidePost(e);
  //               close();
  //             }}
  //             className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
  //           >
  //             <UserX size={14} className="text-gray-500" />
  //             <span className="text-sm font-medium">Hide post</span>
  //           </button>

  //           <button
  //             onClick={(e) => {
  //               e.stopPropagation();
  //               handleReport(e);
  //               close();
  //             }}
  //             className="w-full text-left px-4 py-2.5 text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors last:rounded-b-lg border-t border-gray-100 mt-1"
  //           >
  //             <Flag size={14} />
  //             <span className="text-sm font-medium">Report Post</span>
  //           </button>
  //         </>
  //       )}
  //     </div>
  //   ), [
  //     handleSaveFromMenu, handleCopyLink, canEditPost, handleEditPost,
  //     canDeletePost, handleDeletePost, handleToggleComments, commentsEnabled,
  //     NotisPostOwner, handleNotInterested, handleHidePost, handleReport, post.saved
  //   ]);

  const PostMenuDropdownButton = useMemo(
    () => (
      <PiDotsThreeOutlineThin
        className="text-gray-700 hover:text-gray-700 cursor-pointer transition"
        size={22}
      />
    ),
    []
  );

  const PostMenuDropdownContent = useCallback(
    ({ close }) => (
      <div
        className="bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-56"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCopyLink(e);
            close();
          }}
          className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
        >
          <FiSend size={14} className="text-gray-500" />
          <span className="text-sm font-medium">Copy link</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEditPost(e);
            close();
          }}
          className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
        >
          <Edit3 size={14} className="text-blue-500" />
          <span className="text-sm font-medium">Edit post</span>
        </button>
        {isPostOwner && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditPost(e);
              close();
            }}
            className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
          >
            <Edit3 size={14} className="text-blue-500" />
            <span className="text-sm font-medium">Edit post</span>
          </button>
        )}

        {isPostOwner && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeletePost(e);
              close();
            }}
            className="w-full text-left px-4 py-2.5 text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
          >
            <Trash2 size={14} />
            <span className="text-sm font-medium">Delete post</span>
          </button>
        )}

        {isPostOwner && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleComments(e);
              close();
            }}
            className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
          >
            <BiCommentDots size={14} className="text-gray-500" />
            <span className="text-sm font-medium">
              {commentsEnabled ? "Disable comments" : "Enable comments"}
            </span>
          </button>
        )}

        {!isPostOwner && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNotInterested(e);
                close();
              }}
              className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
            >
              <EyeOff size={14} className="text-gray-500" />
              <span className="text-sm font-medium">Not interested</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleHidePost(e);
                close();
              }}
              className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
            >
              <UserX size={14} className="text-gray-500" />
              <span className="text-sm font-medium">Hide post</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReport(e);
                close();
              }}
              className="w-full text-left px-4 py-2.5 text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors last:rounded-b-lg border-t border-gray-100 mt-1"
            >
              <Flag size={14} />
              <span className="text-sm font-medium">Report Post</span>
            </button>
          </>
        )}
      </div>
    ),
    [
      handleSaveFromMenu,
      handleCopyLink,
      canEditPost,
      handleEditPost,
      canDeletePost,
      handleDeletePost,
      handleToggleComments,
      commentsEnabled,
      NotisPostOwner,
      handleNotInterested,
      handleHidePost,
      handleReport,
      post.saved,
    ]
  );

  // Truncate Logic
  const limit = 250;
  const isLong = post.content.length > limit;
  const displayText = expanded ? post.content : post.content.slice(0, limit);

  // Comment Dropdown Component
  const CommentMenuDropdown = useCallback(
    ({ comment, onClose }) => (
      <Dropdown
        button={
          <button className="p-1 rounded transition">
            <BsThreeDotsVertical className="text-gray-600" size={14} />
          </button>
        }
        className="right-0"
        onClose={onClose}
      >
        {({ close }) => (
          <div className="w-48 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 py-2">
            {canEditComment(comment) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(comment);
                  close();
                }}
                className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
              >
                <Edit3 size={16} className="text-blue-600" />
                <span className="font-medium">Edit Comment</span>
              </button>
            )}

            {canDeleteComment(comment) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDelete(comment.id);
                  close();
                }}
                className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
              >
                <Trash2 size={16} />
                <span className="font-medium">Delete</span>
              </button>
            )}

            {!canEditComment(comment) && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCommentReport(e, comment);
                    close();
                  }}
                  className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors border-t border-gray-100 mt-1 pt-1"
                >
                  <Flag size={16} />
                  <span className="font-medium">Report Comment</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCommentNotInterested(e, comment);
                    close();
                  }}
                  className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <EyeOff size={16} className="text-gray-500" />
                  <span>Not Interested</span>
                </button>
              </>
            )}
          </div>
        )}
      </Dropdown>
    ),
    [
      canEditComment,
      canDeleteComment,
      handleEdit,
      handleCommentReport,
      handleCommentNotInterested,
    ]
  );

  const renderActions = useCallback(
    () => (
      <div className="flex max-w-[320px]  justify-between text-gray-700 text-sm pt-2">
        <button className="flex items-center gap-1" onClick={onLikeClick}>
          <Heart
            size={24}
            className={likes ? "text-[#f60202] fill-[#f60202]" : ""}
          />
          {likes}
        </button>
        {/* comments icon */}

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowCommentBox((s) => !s);
            setEditingComment(null);
          }}
          className="flex items-center gap-0.5 px-2 py-1 rounded-full text-[#394E57] hover:cursor-pointer hover:text-blue-600  transition"
        >
          <TbMessageCircle className="text-[24px]" />
          <span className="text-sm ">{commentsCount}</span>
        </button>
        {/* reports */}
        {/* <button className="flex items-center gap-1" onClick={onRepostClick}>
          <Repeat2 size={24} />
          {reposts}
         
        </button> */}
        <Dropdown
          button={
            <button className="flex items-center  gap-1">
              <Repeat2 size={24} />
              {reposts}
            </button>
          }
          className="left-2 border top-4 border-gray-300 bg-white shadow-lg rounded-lg p-2 w-56"
        >
          {({ close }) => (
            <div className="flex flex-col gap-3">
              {/* Direct Repost */}
              {!alreadyReposted && (
                <button
                  className=" text-left  hover:cursor-pointer "
                  onClick={() => {
                    // handleDirectRepost();
                    onRepostClick();
                    close();
                  }}
                >
                
                              <h5 className="text-[12px] text-gray-700 font-medium">Repost</h5> 
               <p className="text-[10px] text-gray-500 ">Express yourself — ideas, opinions, updates, anything</p>
                </button>
              )}

              {/* Undo Repost */}
              {alreadyReposted && (
                <button
                  className="flex items-center gap-2 px-3 py-2 hover:bg-red-100 text-red-600 rounded-md"
                  onClick={() => {
                    handleUndoRepost();
                    close();
                  }}
                >
                  Undo Repost
                </button>
              )}

              {/* Repost with Quote */}
              <button
                className=" text-left hover:cursor-pointer "
                onClick={() => {
                  setShowQuoteModal(true);
                  close();
                }}
              >
               <h5 className="text-[12px] text-gray-700 font-medium">Your Thoughts</h5> 
               <p className="text-[10px] text-gray-500 ">Express yourself — ideas, opinions, updates, anything</p>
              </button>
            </div>
          )}
        </Dropdown>

        <div className="flex items-center gap-0.5">
          <button
            onClick={handleSaveFromMenu}
            className="flex items-center  font-bold cursor-pointer gap-1"
          >
            {/* {
          post.saved ?   <Bookmark className="text-gray-700" /> :  <CiBookmarkCheck  className="text-gray-700 " />
         } 
           */}
            <Bookmark className="text-gray-700" />
          </button>

          <button
            className="flex items-center text-gray-800 font-bold cursor-pointer gap-1"
            onClick={onShareClick}
          >
            <Forward size={24} />
          </button>
        </div>
      </div>
    ),
    [
      likes,
      commentsCount,
      reposts,
      onLikeClick,
      onRepostClick,
      onShareClick,
      handleSaveFromMenu,
      post.liked,
      post.saved,
    ]
  );

  const renderReplies = useCallback(
    (parentId, depth = 1) => {
      const replies = comments.filter((c) => c.replyTo?.id === parentId);
      const repliesShown = expandedReplies[parentId] || false;
      if (!replies.length) return null;

      const indent = depth > 0 ? 32 : 0;

      return (
        <div className="mt-2">
          {!repliesShown ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleReplies(parentId);
              }}
              className="text-xs text-blue-400 hover:underline"
            >
              View replies ({replies.length})
            </button>
          ) : (
            <div className="mt-2 space-y-3">
              {replies.map((r) => (
                <div
                  key={r.id}
                  style={{ marginLeft: `${indent}px` }}
                  className="relative border-l border-gray-200 pl-4"
                >
                  <span className="absolute -left-[9px] top-3 w-2 h-[1px] bg-gray-400"></span>

                  <div className="flex items-start gap-0.5">
                    <img
                      src={r.user.avatar || "/default-avatar.png"}
                      alt={r.user.name}
                      className="w-6 h-6 rounded-full"
                    />

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 text-sm">
                            {r.user.name}
                          </span>
                          {r.replyTo?.name && (
                            <span className="text-gray-500 text-xs">
                              replying to {r.replyTo.name}
                            </span>
                          )}
                          <span className="text-gray-500 text-xs">
                            · {timeAgo(r.createdAt)}
                          </span>
                        </div>

                        <CommentMenuDropdown comment={r} onClose={() => {}} />
                      </div>

                      <p className="text-gray-700 text-sm mt-1">{r.content}</p>

                      <div className="flex gap-4 mt-1 text-xs text-gray-500">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onLikeComment?.(post.id, r.id);
                          }}
                          className={`hover:underline ${
                            r.liked ? "text-blue-500" : ""
                          }`}
                        >
                          Like {r.likes ? `(${r.likes})` : ""}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openCommentBox({ id: r.id, name: r.user.name });
                          }}
                          className="hover:underline"
                        >
                          Reply
                        </button>
                      </div>

                      {renderReplies(r.id, depth + 1)}
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleReplies(parentId);
                }}
                className="text-xs text-gray-500 hover:underline mt-1 ml-6"
              >
                Hide replies
              </button>
            </div>
          )}
        </div>
      );
    },
    [
      comments,
      expandedReplies,
      toggleReplies,
      timeAgo,
      CommentMenuDropdown,
      onLikeComment,
      post.id,
      openCommentBox,
    ]
  );

  const renderComments = useCallback(() => {
    if (topLevelComments.length === 0) return null;

    const displayedComments = topLevelComments.slice(0, visibleComments);

    return (
      <div className="mt-4 space-y-4">
        {displayedComments.map((c) => (
          <div key={c.id} className="flex gap-3 group">
            <img
              src={c.user.avatar || "/default-user-profile.svg"}
              alt={c.user.name}
              className="w-9 h-9 rounded-full border border-gray-300 object-cover"
            />

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 text-sm">
                    {c.user.name}
                  </span>
                  <span className="">
                    •{timeAgo(c.createdAt)}
                  </span>
                </div>

                <CommentMenuDropdown comment={c} onClose={() => {}} />
              </div>

              <p className="text-gray-700 text-sm mt-1 leading-relaxed">
                {c.content}
                {c.edited && (
                  <span className="text-gray-400 text-xs ml-2">(Edited)</span>
                )}
              </p>

              <div className="flex gap-4 mt-2 text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLikeComment?.(post.id, c.id);
                  }}
                  className={`hover:text-blue-600 transition flex items-center gap-1 ${
                    c.liked ? "text-blue-600 font-semibold" : "text-gray-500"
                  }`}
                >
                  <ThumbsUp size={12} />
                  Like {c.likes > 0 && `(${c.likes})`}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openCommentBox({ id: c.id, name: c.user.name });
                  }}
                  className="text-gray-500 hover:text-blue-600 transition flex items-center gap-1"
                >
                  <MessageCircle size={12} />
                  Reply
                </button>

                {!canEditComment(c) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCommentReport(e, c);
                    }}
                    className="text-gray-500 hover:text-red-600 transition flex items-center gap-1 opacity-0 group-hover:opacity-100"
                  >
                    <Flag size={12} />
                    Report
                  </button>
                )}
              </div>

              {renderReplies(c.id)}
            </div>
          </div>
        ))}

        {topLevelComments.length > visibleComments && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLoadMoreComments();
            }}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
          >
            View more comments ({topLevelComments.length - visibleComments})
            <ChevronDown size={14} />
          </button>
        )}
      </div>
    );
  }, [
    topLevelComments,
    visibleComments,
    timeAgo,
    CommentMenuDropdown,
    onLikeComment,
    post.id,
    openCommentBox,
    canEditComment,
    handleCommentReport,
    handleLoadMoreComments,
    renderReplies,
  ]);

  const renderMedia = () => {
    // Your existing renderMedia implementation
    if (!post) return null;

    switch (post.type) {
      case "image":
        if (post.image) {
          return (
            <div
              className="rounded-lg  mb-3"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={post.image}
                alt="post"
                className="w-full h-[300px] object-cover"
                // onError={(e) => {
                //   e.target.src = "/default-image.png";
                // }}
              />
            </div>
          );
        } else if (post.images && post.images.length > 0) {
          return renderMultipleImages();
        }
        return null;

      case "video":
        if (post.video) {
          return (
            <div
              className="rounded-lg overflow-hidden mb-3"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={post.video}
                controls
                className="w-full h-[300px] object-cover"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          );
        }
        return null;

      case "poll":
        return post.poll ? (
          <div className="border border-gray-300 rounded-lg p-4 mb-3 bg-white">
            <h4 className="font-semibold text-gray-800 mb-3">
              {post.poll.question}
            </h4>
            <div className="space-y-2">
              {post.poll.options.map((option, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPollVote?.(post.id, index);
                  }}
                  className={`w-full p-3 text-left rounded-lg border transition-all ${
                    post.pollSelection === index
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800">{option}</span>
                    <span className="text-sm text-gray-500">
                      {post.poll.votes?.[index] || 0} votes
                    </span>
                  </div>
                  {post.poll.votes && (
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                      <div
                        className="bg-blue-600 h-1 rounded-full transition-all"
                        style={{
                          width: `${
                            (post.poll.votes[index] /
                              Math.max(
                                ...post.poll.votes.filter((v) => v > 0)
                              )) *
                              100 || 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">{post.poll.timeLeft}</p>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  const renderMultipleImages = () => {
    if (!post.images || post.images.length === 0) return null;

    const imageCount = post.images.length;

    const getGridClass = () => {
      switch (imageCount) {
        case 1:
          return "grid-cols-1";
        case 2:
          return "grid-cols-2";
        case 3:
          return "grid-cols-2";
        case 4:
          return "grid-cols-2";
        default:
          return "grid-cols-3";
      }
    };

    return (
      <div className={`mb-3 grid gap-2 ${getGridClass()}`}>
        {post.images.slice(0, 4).map((image, index) => (
          <div
            key={index}
            className={`relative ${
              imageCount === 3 && index === 0 ? "row-span-2" : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={image}
              alt={`post-${index}`}
              className={`w-full ${
                imageCount === 1
                  ? "h-[300px]"
                  : imageCount === 3 && index === 0
                  ? "h-64"
                  : "h-32"
              } object-cover rounded-lg border border-gray-200`}
              // onError={(e) => {
              //   e.target.src = "/default-image.png";
              // }}
            />
            {imageCount > 4 && index === 3 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold">
                  +{imageCount - 3}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderContentWithMentions = (content) => {
    if (!content) return null;

    const parts = content.split(/(@\w+|#\w+)/g);

    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        const username = part.slice(1);
        return (
          <Link
            key={index}
            href={`/profile/${username}`}
            onClick={(e) => e.stopPropagation()}
            className="text-blue-600 hover:underline font-medium"
          >
            {part}
          </Link>
        );
      } else if (part.startsWith("#")) {
        return (
          <span key={index} className="text-blue-600 font-medium">
            {part}
          </span>
        );
      } else {
        return part;
      }
    });
  };

  return (
    <div
      className="bg-white px-3 md:px-6 py-8 border-b-[0.3px] border-[#cccccc] "
      onClick={() => isActivity && router.push(`/post/${post.id}`)}
    >
      <div className="w-full  flex gap-3 ">
        {/* <img src={post.user.avatar} alt={post.user.name} className="w-20 h-20 rounded-full object-cover" /> */}

        <img
          src={post?.user?.avatar || "/default-user-profile.svg"}
          alt={post.user.name}
          className="w-16 h-16 rounded-full object-cover"
        />

           <div className="flex flex-col mt-5">
          <h1 className="text-[18px] flex gap-0.5 font-semibold text-gray-900">{post.user.name} <ShieldCheck className="text-[#0056e0] w-[20px] " /></h1>
            
          {/* <p className="text-[13px] font-medium text-gray-600">@{post.user.username}</p> */}
          <div className="flex items-start  gap-2">
  <p className="text-xs  text-[#2a2929]">
    {post.user.jobtitle}
  </p>

  <p className="text-gray-500 text-xs flex items-center gap-1">
    
    <Clock className="text-gray-500 w-3" />
    <span className="text-[12px] font-medium ">{timeAgo(post.user.createdAt)}</span>
    
  </p>
</div>
        </div>

        <div className="flex end-1 items-start gap-4  ml-auto">
          <div className="flex end-1 gap-1 items-start" >
         <TrendingUp size={20} className="text-gray-900 cursor-pointer end-2" />       
          <span className="text-md text-gray-950 font-jost ">11k</span>

          </div>
    
          <Dropdown button={PostMenuDropdownButton} className="right-0">
            {PostMenuDropdownContent}
          </Dropdown>
          {/* <Ellipsis className="mt-2 text-gray-300 ml-0.5" /> */}
        </div>
      </div>

      {/* {renderContentWithMentions(post.content)} */}
      <div className="ms-[77px] ">
        <TruncateText text={post.content}>
              {(limit) => <ParseMentions text={post.content.slice(0, limit)} />}
            </TruncateText>

        {/* <div className="text-sm text-gray-700 ">
          <p className="whitespace-pre-line">
            {displayText}
            {!expanded && isLong && " ..."}
          </p>

          {isLong && (
            <button
              className="text-blue-700 font-medium text-sm mt-1"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "See Less" : "See More"}
            </button>
          )}
        </div> */}

        <div className="w-full md:w-[320px] h-[400px] md:h-[450px] mt-3 bg-gray-200 rounded-xl border-2 border-gray-400 overflow-hidden  mb-2">
          <img
            src={"/AboutDumImg.jpeg"}
            className="w-full h-full object-cover"
          />
        </div>

        {/* <div className="mt-2">
    {post.type === "image" && post.images && post.images.length > 
     <div className="w-[320px] h-[450px] mt-3 bg-gray-200 rounded-xl border-2 border-gray-400 overflow-hidden  mb-2">
          <img src={"/AboutDumImg.jpeg"} className="w-full h-full object-cover" />
        </div>
      } */}
        {/* </div>  */}

        {renderActions()}

        {/* Comment Box */}
        {!isActivity && showCommentBox && commentsEnabled && (
          <div
            className="flex items-center justify-between gap-2 px-4 py-3 rounded-2xl mt-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 flex-1">
              <img
                src={currentUser?.avatar || "/default-user-profile.svg"}
                alt="user"
                className="w-8 h-8 rounded-full object-cover"
              />
              <input
                placeholder={
                  editingComment
                    ? "Editing your comment..."
                    : replyTarget
                    ? `Replying to ${replyTarget.name}`
                    : "Write your comment.."
                }
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
                className="flex-1 border border-gray-400 rounded-full px-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            <div className="flex items-center gap-2">
                <SmartDropdown
                                width={350}
                                trigger={
                                  <Button
                                    variant="ghost"
                                    size="small"
                                    buttonclass="!text-[#394E57]"
                                    showIcon
                                    icon={Smile}
                                  />
                                }
                              >
                                <EmojiPicker
                                  // onEmojiClick={(emojiData) => {
                                  //   setText((prev) => prev + emojiData.emoji);
                                  // }}
                                  onEmojiClick={(emojiData) => {
                      setCommentText((prev) => prev + emojiData.emoji);
                    }}
                                  searchDisabled={false}
                                  skinTonesDisabled={true}
                                  height={400}
                                  width={350}
                                />
            </SmartDropdown>

              <button
                onClick={handleCommentSubmit}
                disabled={!commentText.trim()}
                className="p-2 rounded-full border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSend size={16} />
              </button>
            </div>
          
            
          </div>
        )}

        {/* Comments Disabled Message */}
        {!commentsEnabled && (
          <div className="text-center text-gray-500 text-sm py-4 border-t border-gray-200 mt-3">
            Comments are disabled for this post
          </div>
        )}

        {/* Your comments rendering */}
        {commentsEnabled && renderComments()}

        {/* Delete Confirmation Modal */}
        
        {confirmDelete && (
  <Modal
    show={confirmDelete}
    onClose={() => setConfirmDelete(null)}
    title="Delete comment? "
    widthClass="!w-[500px] !align-meddle !items-center "
  >
    <p className="text-sm  text-gray-600 mb-4">
      This action cannot be undone.
    </p>

    <div className="flex justify-end gap-3 pb-4 mt-4">
      <button
        onClick={() => setConfirmDelete(null)}
        className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        Cancel
      </button>

      <button
        onClick={() => handleDelete(confirmDelete)}
        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
      >
        Delete
      </button>
    </div>
  </Modal>
)}
      </div>



      {/* Actions */}

      {/* Comments */}
    </div>
  );
}
