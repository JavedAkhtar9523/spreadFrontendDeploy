"use client";
import React, { useState, useEffect, useCallback } from "react";
import PostCard from "./PostCard";
import RepostCard from "./Repost";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../store/userSlice";
import { addActivity } from "../utils/activityManager";
import ResumeStoryVideoCarousel from './ResumeStoryVideoCarousel';
import ReportModal from './ReportModal';
import FriendSuggestions from './FriendSuggestions';
import JoinCommunity from "./rightSideJoin";
import TrendingJobs from "./TrendingJobs";
import TrendingTopic from "./TrendingTopic";
import PromotedCompanyCard from "../components/company/PromotedCompanyCard";

export default function PostsFeed({ }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.users?.currentUser || null);
  const [posts, setPosts] = useState([]);
  const [reportModal, setReportModal] = useState({
    open: false,
    postId: null,
    commentId: null
  });

  const [isReporting, setIsReporting] = useState(false);
  const initialStories = [
    // "Add Story" button (usually first)
    {
      id: "add-story",
      userName: "Add Story",
      avatar: "/my-avatar.jpg",
      viewed: false,
      isAddStory: true,
      items: []
    },

    // Regular user stories
    {
      id: 1,
      userName: "Shreya Singh",
      avatar: "https://images.unsplash.com/photo-1762325658409-5d8aa0e43261?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDQ2fHRvd0paRnNrcEdnfHxlbnwwfHx8fHw%3D",
      viewed: false,
      items: [
        {
          id: "1-a",
          type: "image",
          src: "/story1.jpg",
          duration: 4000
        }
      ]
    },
    {
      id: 2,
      userName: "Rahul Sharma",
      avatar: "https://images.unsplash.com/photo-1508341591423-4347099e1f19?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG1hbnxlbnwwfHwwfHx8MA%3D%3D",
      viewed: true, // This story has been viewed
      items: [
        {
          id: "2-a",
          type: "image",
          src: "/story2.jpg",
          duration: 3500
        },
        {
          id: "2-b",
          type: "video",
          src: "/story2-video.mp4",
          duration: 5000
        }
      ]
    },
    {
      id: 3,
      userName: "Bruce mars",
      avatar: "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YnVzaW5lc3MlMjBtYW58ZW58MHx8MHx8fDA%3D",
      viewed: true, // This story has been viewed
      items: [
        {
          id: "2-a",
          type: "image",
          src: "/story2.jpg",
          duration: 3500
        },
        {
          id: "2-b",
          type: "video",
          src: "/story2-video.mp4",
          duration: 5000
        }
      ]
    },
    {
      id: 4,
      userName: "Ayo Models",
      avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bW9kZWxzfGVufDB8fDB8fHww",
      viewed: true, // This story has been viewed
      items: [
        {
          id: "2-a",
          type: "image",
          src: "/story2.jpg",
          duration: 3500
        },
        {
          id: "2-b",
          type: "video",
          src: "/story2-video.mp4",
          duration: 5000
        }
      ]
    },
    {
      id: 5,
      userName: "Joren Aranas",
      avatar: "https://images.unsplash.com/photo-1604514628550-37477afdf4e3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vZGVsc3xlbnwwfHwwfHx8MA%3D%3D",
      viewed: true, // This story has been viewed
      items: [
        {
          id: "2-a",
          type: "image",
          src: "/story2.jpg",
          duration: 3500
        },
        {
          id: "2-b",
          type: "video",
          src: "/story2-video.mp4",
          duration: 5000
        }
      ]
    },
  ];

  const [stories, setStories] = useState(initialStories);

  useEffect(() => {
    const fetchStories = async () => {
      const res = await fetch("/api/stories");
      const data = await res.json();
      setStories(data);
    };

    fetchStories();
  }, []);



  // === Initialize Posts ===
  useEffect(() => {
    setPosts(currentUser?.posts || []);
  }, [currentUser]);

  const persistPosts = useCallback((updatedPosts) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, posts: updatedPosts };
      dispatch(updateUser(updatedUser));
      window.dispatchEvent(new Event("postsUpdated"));
    }
  }, [currentUser, dispatch]);


  const handleReportSubmit = async (category, details) => {
    setIsReporting(true);

    try {
      const { postId, commentId } = reportModal;

      console.log("Report submitted:", {
        postId,
        commentId,
        category,
        details,
        reportedBy: currentUser?.id
      });

      // ✅ IMPORTANT: Return success object
      const result = { success: true };

      // Show success toast
      // toast.success(`Thank you for reporting. We'll review this ${commentId ? 'comment' : 'post'} shortly.`);

      // Add to user activities
      if (currentUser?.id) {
        addActivity(currentUser.id, {
          type: "report",
          postId,
          commentId,
          category,
          details,
          message: `You reported a ${commentId ? 'comment' : 'post'} for ${category}`,
          timestamp: new Date().toISOString(),
        });
      }

      // ✅ Return success - this tells the modal that submission was successful
      return result;

    } catch (error) {
      console.error("Report submission error:", error);
      toast.error("Failed to submit report. Please try again.");

      // ✅ Throw error - this tells the modal that submission failed
      throw error;
    } finally {
      setIsReporting(false);
    }
  };

  const handleReport = (postId, commentId = null) => {
    setReportModal({
      open: true,
      postId,
      commentId
    });
  };

  // === FIXED: Not Interested Functionality ===
  const handleNotInterested = (postId) => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    setPosts(updatedPosts);
    persistPosts(updatedPosts);

    toast.info("We'll show fewer posts like this");

    if (currentUser?.id) {
      addActivity(currentUser.id, {
        type: "not_interested",
        postId,
        message: "You marked a post as not interested",
      });
    }
  };

  // === FIXED: Hide Post Functionality ===
  const handleHidePost = (postId) => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    setPosts(updatedPosts);
    persistPosts(updatedPosts);

    toast.info("Post hidden from your feed");

    if (currentUser?.id) {
      addActivity(currentUser.id, {
        type: "hide_post",
        postId,
        message: "You hid a post from your feed",
      });
    }
  };

  // === Edit Post Functionality ===
  const handleEditPost = (post) => {
    // This would open the edit post modal
    toast.info(`Editing post: ${post.id}`);
    console.log("Edit post:", post);
    // You can implement the edit modal logic here
  };

  // === Delete Post Functionality ===
  const handleDeletePost = (postId) => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    setPosts(updatedPosts);
    persistPosts(updatedPosts);

    // toast.success("Post deleted successfully");

    addActivity(currentUser.id, {
      type: "delete_post",
      postId,
      message: "You deleted your post",
    });
  };

  // === Toggle Comments Functionality ===
  const handleToggleComments = (postId, enabled) => {
    const updatedPosts = posts.map(post =>
      post.id === postId
        ? { ...post, commentsEnabled: enabled }
        : post
    );
    setPosts(updatedPosts);
    persistPosts(updatedPosts);
  };

  // === Like Functionality ===
  const handleLike = (postId) => {
    const prevPost = posts.find((p) => p.id === postId);
    const wasLiked = prevPost?.liked;
    const wasDisliked = prevPost?.disliked;

    const updated = posts.map((p) => {
      if (p.id !== postId) return p;

      let likes = p.likes || 0;
      let dislikes = p.dislikes || 0;

      if (wasLiked) likes = Math.max(0, likes - 1);
      else {
        likes += 1;
        if (wasDisliked) dislikes = Math.max(0, dislikes - 1);
      }

      return {
        ...p,
        liked: !wasLiked,
        disliked: false,
        likes,
        dislikes,
      };
    });

    persistPosts(updated);
    setPosts(updated);

    if (!wasLiked) {
      addActivity(currentUser.id, {
        type: "like",
        postId,
        message: "You liked a post.",
      });
    } else {
      addActivity(currentUser.id, {
        type: "unlike",
        postId,
        message: "You removed your like.",
      });
    }
  };

  // === Dislike Functionality ===
  const handleDislike = (postId) => {
    const prevPost = posts.find((p) => p.id === postId);
    const wasDisliked = prevPost?.disliked;
    const wasLiked = prevPost?.liked;

    const updated = posts.map((p) => {
      if (p.id !== postId) return p;

      let likes = p.likes || 0;
      let dislikes = p.dislikes || 0;

      if (wasDisliked) dislikes = Math.max(0, dislikes - 1);
      else {
        dislikes += 1;
        if (wasLiked) likes = Math.max(0, likes - 1);
      }

      return {
        ...p,
        liked: false,
        disliked: !wasDisliked,
        likes,
        dislikes,
      };
    });

    persistPosts(updated);
    setPosts(updated);

    if (!wasDisliked) {
      addActivity(currentUser.id, {
        type: "dislike",
        postId,
        message: "You disliked a post.",
      });
    } else {
      addActivity(currentUser.id, {
        type: "undislike",
        postId,
        message: "You removed your dislike.",
      });
    }
  };

  // === Repost ===
  const handleRepost = (postId) => {
    setPosts((prev) => {
      const original = prev.find((p) => p.id === postId);
      if (!original) return prev;

      const updated = prev.map((p) =>
        p.id === postId ? { ...p, reposts: (p.reposts || 0) + 1 } : p
      );

      const newRepost = {
        id: Date.now().toString(),
        type: "repost",
        user: {
          name: currentUser?.name || "You",
          username: currentUser?.username || "me",
          avatar: currentUser?.avatar || "",
        },
        originalId: postId,
      };

      const result = [newRepost, ...updated];
      persistPosts(result);
      // toast.success("Reposted");
      return result;
    });
  };

  // === Share ===
  const handleShare = (postId) => {
    const url = `${window.location.origin}/post/${postId}`;
    if (navigator.share) {
      navigator.share({ title: "Post", url }).catch(() => {
        navigator.clipboard.writeText(url);
        toast.info("Link copied");
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.info("Link copied");
    }
  };

  // === Add Comment / Reply ===
  const handleAddComment = (postId, text, replyToCommentId = null, replyToName = null) => {
    if (!text || !text.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      user: {
        id: currentUser?.id,
        name: currentUser?.name || "You",
        username: currentUser?.username || "me",
        avatar: currentUser?.avatar || "",
      },
      content: text,
      replyTo: replyToCommentId
        ? { id: replyToCommentId, name: replyToName || "" }
        : null,
      likes: 0,
      liked: false,
      createdAt: new Date().toISOString(),
    };

    const updated = posts.map((p) =>
      p.id === postId
        ? { ...p, comments: [...(p.comments || []), newComment] }
        : p
    );
    persistPosts(updated);
    setPosts(updated);
    // toast.success("Comment added");

    if (currentUser?.id) {
      addActivity(currentUser.id, {
        type: "comment",
        postId,
        message: text,
      });
    }
  };

  // === Like Comment ===
  const handleLikeComment = (postId, commentId) => {
    const updated = posts.map((p) => {
      if (p.id !== postId) return p;
      const updatedComments = (p.comments || []).map((c) =>
        c.id === commentId
          ? {
            ...c,
            liked: !c.liked,
            likes: (c.likes || 0) + (c.liked ? -1 : 1),
          }
          : c
      );
      return { ...p, comments: updatedComments };
    });
    persistPosts(updated);
    setPosts(updated);
  };

  // === Edit Comment ===
  const handleEditComment = (postId, commentId, newText) => {
    const updated = posts.map((p) => {
      if (p.id !== postId) return p;
      const updatedComments = (p.comments || []).map((c) =>
        c.id === commentId ? { ...c, content: newText, edited: true } : c
      );
      return { ...p, comments: updatedComments };
    });
    persistPosts(updated);
    setPosts(updated);
    // toast.success("Comment edited");
  };

  // === Delete Comment ===
  const handleDeleteComment = (postId, commentId) => {
    const updated = posts.map((p) => {
      if (p.id !== postId) return p;
      const updatedComments = (p.comments || []).filter((c) => c.id !== commentId);
      return { ...p, comments: updatedComments };
    });
    persistPosts(updated);
    setPosts(updated);
    toast.info("Comment deleted");
  };

  // === Poll Voting ===
  const handlePollVote = (postId, optionIndex) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        let newVotes = [...p.poll.votes];
        if (p.pollSelection !== null && p.pollSelection !== optionIndex) {
          newVotes[p.pollSelection] -= 1;
        }
        if (p.pollSelection !== optionIndex) {
          newVotes[optionIndex] += 1;
        }
        return {
          ...p,
          poll: { ...p.poll, votes: newVotes },
          pollVoted: true,
          pollSelection: optionIndex,
        };
      })
    );
  };

  useEffect(() => {
    const handle = () => setPosts(currentUser?.posts || []);
    window.addEventListener("postsUpdated", handle);
    return () => window.removeEventListener("postsUpdated", handle);
  }, [currentUser]);

  return (
    <div className="relative  min-h-screen  text-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <ReportModal
          open={reportModal.open}
          onClose={() =>
            setReportModal({ open: false, postId: null, commentId: null })
          }
          targetType={reportModal.commentId ? "comment" : "post"}
          onSubmit={handleReportSubmit}
        />

        <div className="py-4 ">
          <ResumeStoryVideoCarousel stories={stories} />
        </div>


        <div className="flex gap-6 lg:mx-10 ">

          {/* LEFT: Posts Column (75% width) */}
          <div className="flex-1 mt-4 lg:max-w-[680px]">
            <div className="sticky top-[240px] h-[680px] bg-white  custom-scroll border-[0.3px] border-[#cccccc]  rounded-4xl overflow-y-auto ">

                 <div className="divide-y divide-gray-100">
                  {posts.map((post) => {
                    if (!post || !post.id) {
                      return null;
                    }

                    if (post.type === "repost") {
                      const originalPost = posts.find((x) => x && x.id === post.originalId);

                      if (!originalPost) {
                        console.warn('Original post not found for repost:', post.id);
                        return null;
                      }

                      return (
                        <div key={post.id} className="hover:bg-gray-50 transition-colors duration-200">
                          <RepostCard
                            post={post}
                            originalPost={originalPost}
                            onLike={handleLike}
                            onDislike={handleDislike}
                            onRepost={handleRepost}
                            onAddComment={handleAddComment}
                            onEditComment={handleEditComment}
                            onDeleteComment={handleDeleteComment}
                            onLikeComment={handleLikeComment}
                            onPollVote={handlePollVote}
                            onShare={handleShare}
                            onReport={handleReport}
                            onNotInterested={handleNotInterested}
                            onHidePost={handleHidePost}
                            onEditPost={handleEditPost}
                            onDeletePost={handleDeletePost}
                            onToggleComments={handleToggleComments}
                          />
                        </div>
                      );
                    } else {
                      return (
                        <div key={post.id} className="hover:bg-gray-50 transition-colors duration-200">
                          <PostCard
                            post={post}
                            mode="feed"
                            onLike={handleLike}
                            onDislike={handleDislike}
                            onRepost={handleRepost}
                            onAddComment={handleAddComment}
                            onEditComment={handleEditComment}
                            onDeleteComment={handleDeleteComment}
                            onLikeComment={handleLikeComment}
                            onPollVote={handlePollVote}
                            onShare={handleShare}
                            onReport={handleReport}
                            onNotInterested={handleNotInterested}
                            onHidePost={handleHidePost}
                            onEditPost={handleEditPost}
                            onDeletePost={handleDeletePost}
                            onToggleComments={handleToggleComments}
                          />
                        </div>
                      );
                    }
                  })}
                </div>

              {/* Trending Sections - Scrolls with posts */}
              <div className="mt-6 space-y-6">
                <TrendingTopic />
                <TrendingJobs />
              </div>

            </div>
          </div>

          {/* RIGHT: Sidebar Column (25% width) */}
          <div className="hidden mt-4 lg:block w-[30%]">
            <div className="sticky top-[240px] h-[680px]  border-[0.3px] border-[#cccccc] rounded-2xl    custom-scroll overflow-y-auto pl-2 bg-[#fff]">
              <FriendSuggestions />
              <JoinCommunity />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}