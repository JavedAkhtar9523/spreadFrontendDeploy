"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  ImagePlus,
  Upload,
  Video,
  FileText,
  X,
  Image,
  ImgIcon,
  BarChart2,
  Smile,
  BrickWallFire,
  UserRoundPlus,
  MapPin,
  Globe,
  UserCheck,
  BadgeCheck,
  AtSign,
  Check,
  File,
  Share,
  Search,
  Edit,
} from "lucide-react";
import Modal from "../components/Modal";
import { useSelector } from "react-redux";
import Button from "../components/Button";
import { InputBox } from "../components/FormInput";
import Dropdown, { SmartDropdown } from "../components/Dropdown";
import { BiSmile } from "react-icons/bi";
import { createPortal } from "react-dom";
import { AutoGrowTextarea } from "../components/TextAreaField";
// import { InputField } from "../components/InputField";
import { CreatePostLocation, TagPeopleModal } from "./TagPostLocationPeople";
import { ImageEditorModalPost } from '../student-profile/ImageEditorModal';
import { useImagePreview } from '../hooks/useImagePreview';
import PDFViewer from '../components/pdfpreview';
import { InputField } from '../components/InputField';
import FormDropdown from "../components/FormDropdown";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

// Enhanced demo data with profiles
export const USERS = [
  {
    username: "ravi",
    name: "Ravi Kumar",
    bio: "Frontend Developer",
    avatar: "/avatars/ravi.jpg",
  },
  {
    username: "vishwakarma",
    name: "Amit Vishwakarma",
    bio: "Full Stack Developer",
    avatar: "/avatars/amit.jpg",
  },
  {
    username: "neha",
    name: "Neha Sharma",
    bio: "UI/UX Designer",
    avatar: "/avatars/neha.jpg",
  },
  {
    username: "careerloop",
    name: "CareerLoop",
    bio: "Your Career Partner",
    avatar: "/avatars/careerloop.jpg",
  },
];

const TAGS = [
  { name: "React", count: "12.5K posts" },
  { name: "NextJS", count: "8.2K posts" },
  { name: "AI", count: "15.3K posts" },
  { name: "Frontend", count: "9.1K posts" },
  { name: "MERN", count: "5.7K posts" },
  { name: "Design", count: "11.2K posts" },
  { name: "Students", count: "25.4K posts" },
  { name: "Education", count: "18.7K posts" },
  { name: "Learning", count: "22.1K posts" },
  { name: "Study", count: "15.9K posts" },
];



// Post type constants
const POST_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  VIDEO: "video",
  POLL: "poll",
  DOCUMENT: "document",
};
const MAX_IMAGES = 5;
const MAX_DOCUMENTS = 1;

export default function CreatePostModal({ isOpen, onClose }) {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionType, setSuggestionType] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionPosition, setSuggestionPosition] = useState({ top: 0, left: 0 });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [pollDuration, setPollDuration] = useState("1 Day");
  const [activePostType, setActivePostType] = useState(POST_TYPES.TEXT);
  const [showReactions, setShowReactions] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showReplySettings, setShowReplySettings] = useState(false);
  const [replyOption, setReplyOption] = useState("everyone");
  const [showSaveDraftModal, setShowSaveDraftModal] = useState(false);
  const [showDraftsListModal, setShowDraftsListModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [showTagPeopleModal, setShowTagPeopleModal] = useState(false);
  // New state variables for people and location
  const [showPeopleSuggestions, setShowPeopleSuggestions] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);

  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  // Add internal state for modal management
  const [internalIsOpen, setInternalIsOpen] = useState(isOpen);
  // const [firstImageOrientation, setFirstImageOrientation] = useState(null); // 'landscape', 'portrait', 'square'

  // State variables में add करें
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [imageToEdit, setImageToEdit] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const {
    getModalImageStyle,
    handleFirstImageLoad,
    resetOrientation
  } = useImagePreview();

  // Image Editor Functions add करें
  const handleImageEditClick = (file, index) => {
    // Main modal को close करें
    setInternalIsOpen(false);

    // थोड़ा delay दें smooth transition के लिए
    setTimeout(() => {
      const url = URL.createObjectURL(file);
      setImageToEdit(url);
      setSelectedImageIndex(index);
      setShowImageEditor(true);
    }, 0);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    resetOrientation();
    setUploadedFiles(files);
  };

  const handleEditorSave = (editedImage) => {
    if (editedImage.file && selectedImageIndex !== null) {
      // Replace the old file with edited file
      const newFiles = [...selectedFiles];
      newFiles[selectedImageIndex] = editedImage.file;
      setSelectedFiles(newFiles);

      setShowImageEditor(false);
      setImageToEdit(null);
      setSelectedImageIndex(null);
      const newUrl = URL.createObjectURL(editedImage.file);

      // Main modal को वापस खोलें
      setTimeout(() => {
        setInternalIsOpen(true);
      }, 0);
    }
  };

  const handleEditorCancel = () => {
    setShowImageEditor(false);
    setImageToEdit(null);
    setSelectedImageIndex(null);

    // Main modal को वापस खोलें
    setTimeout(() => {
      setInternalIsOpen(true);
    }, 0);
  };


  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const replySettingsRef = useRef(null);
  const textareaRef = useRef(null);
  const tagInputRef = useRef(null);
  const locationRef = useRef(null);
  const peopleRef = useRef(null);
  const currentUser = useSelector((state) => state.users?.currentUser || null);
  // Sync with external isOpen prop
  useEffect(() => {
    setInternalIsOpen(isOpen);
  }, [isOpen]);

  // Load drafts from localStorage
  useEffect(() => {
    const loadDrafts = () => {
      try {
        const savedDrafts = JSON.parse(localStorage.getItem('postDrafts') || '[]');
        setDrafts(savedDrafts);
      } catch (error) {
        console.error("Error loading drafts:", error);
        setDrafts([]);
      }
    };

    if (showDraftsListModal) {
      loadDrafts();
    }
  }, [showDraftsListModal]);


  // Close main modal when drafts modal opens
  useEffect(() => {
    if (showDraftsListModal && isOpen) {
      onClose();
    }
  }, [showDraftsListModal, isOpen, onClose]);

  // Track unsaved changes
  useEffect(() => {
    const hasContent = text.trim().length > 0 ||
      selectedFiles.length > 0 ||
      (activePostType === POST_TYPES.POLL && pollOptions.some(opt => opt.trim())) ||
      selectedPeople.length > 0 ||
      selectedLocation.trim().length > 0;
    setHasUnsavedChanges(hasContent);
  }, [text, selectedFiles, activePostType, pollOptions, selectedPeople, selectedLocation]);

  // Close emoji picker and reply settings when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
      if (
        replySettingsRef.current &&
        !replySettingsRef.current.contains(event.target)
      ) {
        setShowReplySettings(false);
      }
      if (
        showSuggestions &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
      if (
        showTagSuggestions &&
        tagInputRef.current &&
        !tagInputRef.current.contains(event.target)
      ) {
        setShowTagSuggestions(false);
      }
      if (
        showLocationSuggestions &&
        locationRef.current &&
        !locationRef.current.contains(event.target)
      ) {
        setShowLocationSuggestions(false);
      }
      if (
        showPeopleSuggestions &&
        peopleRef.current &&
        !peopleRef.current.contains(event.target)
      ) {
        setShowPeopleSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSuggestions, showTagSuggestions, showLocationSuggestions, showPeopleSuggestions]);

  // Enhanced suggestion handler with cursor positioning
  const handleTextChange = useCallback((e) => {
    const value = e.target.value;
    setText(value);

    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const lastWordBeforeCursor = textBeforeCursor.split(/\s/).pop();

    if (lastWordBeforeCursor.startsWith("@")) {
      const query = lastWordBeforeCursor.slice(1).toLowerCase();
      const filtered = USERS.filter(
        (u) =>
          u.username.toLowerCase().includes(query) ||
          u.name.toLowerCase().includes(query)
      );
      setSuggestions(filtered);
      setSuggestionType("mention");

      // Calculate position for suggestions near cursor
      const textarea = e.target;
      const textareaRect = textarea.getBoundingClientRect();

      // Create a temporary span to measure the position of text before cursor
      const tempSpan = document.createElement('span');
      tempSpan.style.whiteSpace = 'pre-wrap';
      tempSpan.style.wordWrap = 'break-word';
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.position = 'absolute';
      tempSpan.style.font = window.getComputedStyle(textarea).font;
      tempSpan.style.width = textarea.clientWidth + 'px';
      tempSpan.textContent = textBeforeCursor;

      document.body.appendChild(tempSpan);
      const spanHeight = tempSpan.offsetHeight;
      document.body.removeChild(tempSpan);

      // Calculate position relative to textarea
      const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
      const lines = Math.floor(spanHeight / lineHeight);
      const topPosition = textareaRect.top + (lines * lineHeight) + lineHeight;

      setSuggestionPosition({
        top: topPosition,
        left: textareaRect.left,
        width: textareaRect.width
      });
      setShowSuggestions(true);
    } else if (lastWordBeforeCursor.startsWith("#")) {
      const query = lastWordBeforeCursor.slice(1).toLowerCase();
      const filtered = TAGS.filter((t) => t.name.toLowerCase().includes(query));
      setSuggestions(filtered);
      setSuggestionType("tag");

      // Similar positioning calculation for tags
      const textarea = e.target;
      const textareaRect = textarea.getBoundingClientRect();
      setSuggestionPosition({
        top: textareaRect.bottom,
        left: textareaRect.left,
        width: textareaRect.width
      });
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSuggestionType(null);
    }
  }, []);

  const handleSuggestionClick = useCallback(
    (suggestion) => {
      const words = text.split(/\s/);
      const lastWord = words.pop();

      let newText;
      if (suggestionType === "mention") {
        newText = words.join(" ") + ` @${suggestion.username} `;
      } else if (suggestionType === "tag") {
        newText = words.join(" ") + ` #${suggestion.name} `;
      } else {
        newText = words.join(" ") + " ";
      }

      setText(newText);
      setShowSuggestions(false);
      setSuggestionType(null);

      // Focus back to textarea after selection
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    },
    [text, suggestionType]
  );

  // Enhanced close handler with save draft confirmation
  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowSaveDraftModal(true);
    } else {
      setInternalIsOpen(false);
      onClose();
    }
  };

  // Save draft functionality
  const handleSaveDraft = () => {
    const draft = {
      id: Date.now().toString(),
      text,
      selectedFiles: selectedFiles.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
      })),
      pollOptions,
      pollDuration,
      activePostType,
      replyOption,
      selectedTags,
      selectedPeople,
      selectedLocation,
      createdAt: new Date().toISOString()
    };

    try {
      const existingDrafts = JSON.parse(localStorage.getItem('postDrafts') || '[]');
      const updatedDrafts = [draft, ...existingDrafts.slice(0, 9)];
      localStorage.setItem('postDrafts', JSON.stringify(updatedDrafts));
      console.log("💾 Draft saved successfully");
    } catch (error) {
      console.error("Error saving draft:", error);
    }

    resetForm();
    setShowSaveDraftModal(false);
    setInternalIsOpen(false);
    onClose();
  };

  const handleLoadDraft = (draft) => {
    setText(draft.text || "");
    setSelectedFiles([]); // Files can't be restored from localStorage
    setPollOptions(draft.pollOptions || ["", ""]);
    setPollDuration(draft.pollDuration || "1 Day");
    setActivePostType(draft.activePostType || POST_TYPES.TEXT);
    setReplyOption(draft.replyOption || "everyone");
    setSelectedTags(draft.selectedTags || []);
    setSelectedPeople(draft.selectedPeople || []);
    setSelectedLocation(draft.selectedLocation || "");

    setShowDraftsListModal(false);
    setHasUnsavedChanges(true);


    console.log("Drafts modal closed, reopening main modal...");
    setTimeout(() => {
      console.log("Reopening main modal...");
      setInternalIsOpen(true);
    }, 100);

  };

  // Delete draft
  const handleDeleteDraft = (draftId) => {
    const updatedDrafts = drafts.filter(draft => draft.id !== draftId);
    localStorage.setItem('postDrafts', JSON.stringify(updatedDrafts));
    setDrafts(updatedDrafts);
  };


  // Discard draft and close
  const handleDiscardDraft = () => {
    resetForm();
    setShowSaveDraftModal(false);
    setInternalIsOpen(false);
    onClose();
  };


  // Reset form to initial state
  const resetForm = () => {
    setText("");
    setSelectedFiles([]);
    setPollOptions(["", ""]);
    setPollDuration("1 Day");
    setActivePostType(POST_TYPES.TEXT);
    setReplyOption("everyone");
    setSelectedTags([]);
    setSelectedPeople([]);
    setSelectedLocation("");
    setHasUnsavedChanges(false);
    setShowPeopleSuggestions(false);
    setShowLocationSuggestions(false);
    setLocationSearchQuery("");
  };

  // People tagging functions
  const handleAddPerson = (user) => {
    if (!selectedPeople.find(p => p.username === user.username) && selectedPeople.length < 10) {
      setSelectedPeople([...selectedPeople, user]);
    }
    setShowPeopleSuggestions(false);
  };

  const removePerson = (userToRemove) => {
    setSelectedPeople(selectedPeople.filter(user => user.username !== userToRemove.username));
  };

  // Location functions
  const handleLocationClick = () => {
    setShowLocationSuggestions(!showLocationSuggestions);
    setShowLocation(!showLocation);
  };




  const removeLocation = () => {
    setSelectedLocation("");
    setShowLocationSuggestions(false);
  };

  const handleFileChange = (e) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);

    const validFiles = filesArray.filter((file) => {
      if (activePostType === POST_TYPES.IMAGE) {
        return file.type.startsWith("image/");
      } else if (activePostType === POST_TYPES.VIDEO) {
        return file.type.startsWith("video/");
      } else if (activePostType === POST_TYPES.DOCUMENT) {
        return file.type === "application/pdf" ||
          file.type.includes("document") ||
          file.type.includes("text") ||
          file.name.endsWith('.pdf') ||
          file.name.endsWith('.doc') ||
          file.name.endsWith('.docx') ||
          file.name.endsWith('.txt');
      }
      return false;
    });

    if (activePostType === POST_TYPES.IMAGE) {
      const remainingSlots = MAX_IMAGES - selectedFiles.length;

      if (remainingSlots <= 0) {
        alert(`Maximum ${MAX_IMAGES} images allowed per post`);
        return;
      }

      const filesToAdd = validFiles.slice(0, remainingSlots);

      if (filesToAdd.length < validFiles.length) {
        alert(
          `You can only add ${remainingSlots} more image(s). ${validFiles.length - filesToAdd.length
          } image(s) were not added.`
        );
      }

      setSelectedFiles((prev) => [...prev, ...filesToAdd]);
    } else if (activePostType === POST_TYPES.DOCUMENT) {
      const remainingSlots = MAX_DOCUMENTS - selectedFiles.length;

      if (remainingSlots <= 0) {
        alert(`Maximum ${MAX_DOCUMENTS} documents allowed per post`);
        return;
      }

      const filesToAdd = validFiles.slice(0, remainingSlots);

      if (filesToAdd.length < validFiles.length) {
        alert(
          `You can only add ${remainingSlots} more document(s). ${validFiles.length - filesToAdd.length
          } document(s) were not added.`
        );
      }

      setSelectedFiles((prev) => [...prev, ...filesToAdd]);
    } else {
      setSelectedFiles(validFiles);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePostTypeChange = (type) => {
    if (type !== activePostType) {
      setSelectedFiles([]);
    }
    setActivePostType(type);

    if (type === POST_TYPES.POLL) {
      return;
    }

    if (type === POST_TYPES.IMAGE || type === POST_TYPES.VIDEO || type === POST_TYPES.DOCUMENT) {
      setFileType(type);
      fileInputRef.current?.click();
    }
  };

  const setFileType = (type) => {
    let accept = "";
    if (type === POST_TYPES.IMAGE) accept = "image/*";
    else if (type === POST_TYPES.VIDEO) accept = "video/*";
    else if (type === POST_TYPES.DOCUMENT) accept = ".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain";

    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
    }
  };

  const isImageUploadDisabled =
    selectedFiles.length >= MAX_IMAGES && activePostType === POST_TYPES.IMAGE;

  const isDocumentUploadDisabled =
    selectedFiles.length >= MAX_DOCUMENTS && activePostType === POST_TYPES.DOCUMENT;

  const getFinalPostType = () => {
    if (activePostType === POST_TYPES.POLL) {
      return POST_TYPES.POLL;
    }

    const hasImages = selectedFiles.some((file) =>
      file.type.startsWith("image/")
    );
    const hasVideos = selectedFiles.some((file) =>
      file.type.startsWith("video/")
    );
    const hasDocuments = selectedFiles.some((file) =>
      file.type.includes("pdf") || file.type.includes("document") || file.type.includes("text") ||
      file.name.endsWith('.pdf') || file.name.endsWith('.doc') || file.name.endsWith('.docx') || file.name.endsWith('.txt')
    );

    if (hasImages) return POST_TYPES.IMAGE;
    if (hasVideos) return POST_TYPES.VIDEO;
    if (hasDocuments) return POST_TYPES.DOCUMENT;

    return POST_TYPES.TEXT;
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const handlePollChange = (i, val) => {
    const updated = [...pollOptions];
    updated[i] = val;
    setPollOptions(updated);
  };

  const removePollOption = (index) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  // Tag functionality
  const handleAddTag = (tagName) => {
    if (!selectedTags.includes(tagName) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tagName]);
    }
    setShowTagSuggestions(false);
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handlePost = () => {
    if (!currentUser) return;

    const finalPostType = getFinalPostType();
    const mediaUrls = selectedFiles.map((file) => URL.createObjectURL(file));

    const newPost = {
      id: Date.now().toString(),
      type: finalPostType,
      user: {
        name: currentUser.name,
        username: currentUser.username,
        avatar: currentUser.avatar || "/circle-based.png",
        heading: currentUser.headline,
        jobtitle: currentUser?.jobtitle || "Content writer | Seo",
        time: "Just now",
      },
      content: text,
      likes: 0,
      liked: false,
      saved: false,
      reposts: 0,
      comments: [],
      activity: "Posts",
      tags: [...extractTags(text), ...selectedTags],
      taggedPeople: selectedPeople,
      location: selectedLocation,
      replySettings: replyOption,
      createdAt: new Date().toISOString(),
    };

    if (finalPostType === POST_TYPES.IMAGE && mediaUrls.length > 0) {
      newPost.image = mediaUrls;
    } else if (finalPostType === POST_TYPES.VIDEO && mediaUrls.length > 0) {
      newPost.video = mediaUrls[0];
    } else if (finalPostType === POST_TYPES.DOCUMENT && mediaUrls.length > 0) {
      newPost.documents = selectedFiles.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file)
      }));
    } else if (finalPostType === POST_TYPES.POLL) {
      newPost.poll = {
        question: text || "Poll Question",
        options: pollOptions.filter((opt) => opt.trim()),
        votes: new Array(pollOptions.filter((opt) => opt.trim()).length).fill(
          0
        ),
        timeLeft: `${pollDuration}`,
      };
      newPost.pollVoted = false;
      newPost.pollSelection = null;
    }

    try {
      const socialAppState = JSON.parse(
        localStorage.getItem("socialAppState") || "{}"
      );
      const currentUserData = socialAppState.currentUser;
      const existingPosts = currentUserData?.posts || [];
      const updatedPosts = [newPost, ...existingPosts];

      const updatedState = {
        ...socialAppState,
        currentUser: {
          ...currentUserData,
          posts: updatedPosts,
        },
        users:
          socialAppState.users?.map((user) =>
            user.id === currentUser.id ? { ...user, posts: updatedPosts } : user
          ) || [],
      };

      localStorage.setItem("socialAppState", JSON.stringify(updatedState));

      const updatedActivities = [
        {
          id: Date.now().toString(),
          type: "post",
          postId: newPost.id,
          timestamp: new Date().toISOString(),
          message: `Created a new ${finalPostType} post`,
        },
        ...(currentUserData?.activities || []),
      ];

      const finalState = {
        ...updatedState,
        currentUser: {
          ...updatedState.currentUser,
          activities: updatedActivities,
        },
        users: updatedState.users.map((user) =>
          user.id === currentUser.id
            ? { ...user, activities: updatedActivities }
            : user
        ),
      };

      localStorage.setItem("socialAppState", JSON.stringify(finalState));
      console.log("📩 New Post Created:", newPost);
    } catch (error) {
      console.error("Error saving post:", error);
    }

    resetForm();
    setInternalIsOpen(false);
    onClose();
  };

  const extractTags = (text) => {
    const tagRegex = /#(\w+)/g;
    const matches = text.match(tagRegex);
    return matches ? matches.map((tag) => tag.replace("#", "")) : [];
  };

  const isPostDisabled =
    !text.trim() &&
    selectedFiles.length === 0 &&
    !(
      activePostType === POST_TYPES.POLL &&
      pollOptions.some((opt) => opt.trim())
    );


  // UPDATED: Function to render document preview with PDF support
  const renderDocumentPreview = (file, index) => {
    if (file.type === "application/pdf" || file.name.endsWith('.pdf')) {
      return (
        <PDFViewer
          key={index}
          file={file}
          onRemove={() => removeFile(index)}
        />
      );
    } else {
      return (
        <div key={index} className="relative group min-w-[200px] bg-gray-100 rounded-lg p-4">
          {/* <FileText className="w-12 h-12 text-blue-500 mx-auto mb-2" /> */}
          <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
          <p className="text-xs text-gray-500">Document</p>
          <button
            onClick={() => removeFile(index)}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
          >
            <X size={16} />
          </button>
        </div>
      );
    }
  };

  return (
    <>
      {/* Save Draft Confirmation Modal */}
      <Modal
        show={showSaveDraftModal}
        onClose={() => setShowSaveDraftModal(false)}
        // size="sm"
        widthClass="!w-[400px]"
        bodymodal="!items-center bg-[#09090961]"
      >
        <div className="pb-4">
          <h3 className="text-xl font-semibold  text-gray-800 mb-2">
            Save Draft?
          </h3>
          <p className="text-gray-600 mb-6">
            You have unsaved changes. Do you want to save them as draft or discard?
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              onClick={handleDiscardDraft}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50"
            >
              Discard
            </Button>
            <Button
              onClick={handleSaveDraft}
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              Save Draft
            </Button>
          </div>
        </div>
      </Modal>


      {/* Drafts List Modal */}
      <Modal
        show={showDraftsListModal}
        onClose={() => {
          setShowDraftsListModal(false);

          setTimeout(() => {
            setInternalIsOpen(true);
          }, 0); // small delay for smooth open
        }}

        widthClass="!w-[600px]"

      >
        <div className="w-full mb-2">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Saved Drafts
          </h3>
          {drafts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No drafts saved yet.</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {drafts.map((draft, index) => (
                <div
                  key={draft.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium truncate">
                      {draft.text || "Empty draft"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(draft.createdAt).toLocaleDateString()} • {draft.activePostType}
                    </p>
                    {draft.selectedTags && draft.selectedTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {draft.selectedTags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                        {draft.selectedTags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{draft.selectedTags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    {(draft.selectedPeople && draft.selectedPeople.length > 0) && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="text-xs text-gray-500">With: </span>
                        {draft.selectedPeople.slice(0, 2).map(person => (
                          <span key={person.username} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            @{person.username}
                          </span>
                        ))}
                        {draft.selectedPeople.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{draft.selectedPeople.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                    {draft.selectedLocation && (
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin size={12} className="text-gray-500" />
                        <span className="text-xs text-gray-500">{draft.selectedLocation}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleLoadDraft(draft)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700"
                    >
                      Post
                    </Button>
                    <Button
                      onClick={() => handleDeleteDraft(draft.id)}
                      className="px-3 py-1 border border-red-300 text-red-600 rounded-full text-sm hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </Modal>

      {/* Main Create Post Modal */}
      <Modal show={internalIsOpen} onClose={handleClose} size="md" widthClass="custom-scroll !w-[700px]">
        {/* Main container with flex column and fixed height structure */}
        <div className="flex flex-col h-full max-h-[calc(85vh-2rem)] relative">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto custom-scroll px-5 pt-4">
            {/* User Section */}
            <div className="flex items-start gap-4 pb-4">
              <div>
                <img
                  src={currentUser?.avatar || "/default-user-profile.svg"}
                  alt="profile"
                  className="w-[76px] h-[76px] rounded-full object-cover border  border-gray-200"
                />
              </div>

              {/* User Info and Text Area */}
              <div className="mt-2 relative w-full">
                <h3 className="font-semibold text-gray-800 text-[22px]">
                  {currentUser?.name}
                </h3>

                <div className="relative">
                  <AutoGrowTextarea
                    ref={textareaRef}
                    text={text}
                    handleTextChange={handleTextChange}
                  />

                  {/* Suggestions Box - Now positioned absolutely in the modal */}
                  {showSuggestions && (
                    <div
                      className="fixed bg-white border -mt-5 rounded-lg  max-h-48 overflow-y-auto custom-scroll shadow z-50"
                      style={{
                        top: `${suggestionPosition.top}px`,
                        left: `${suggestionPosition.left}px`,
                        width: `${suggestionPosition.width}px`
                      }}
                    >
                      {suggestions.map((suggestion, i) => (
                        <div
                          key={i}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          {suggestionType === "mention" ? (
                            <div className="flex items-center gap-3">
                              <img
                                src={suggestion.avatar || "/circle-based.png"}
                                alt={suggestion.username}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {suggestion.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  @{suggestion.username}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {suggestion.bio}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p className="font-medium text-gray-900">
                                #{suggestion.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {suggestion.count}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Tags */}
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedTags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        #{tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Selected People */}
                {selectedPeople.length > 0 && (
                  <div className="flex flex-wrap  items-center gap-2 mt-3">
                    <span className="text-sm text-gray-600 font-medium">With:</span>
                    {selectedPeople.map((person, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1  text-blue-700 px-2 py-1 rounded-full text-sm"
                      >
                        @{person.username}
                        <button
                          onClick={() => removePerson(person)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Selected Location */}
                {selectedLocation && (
                  <div className="flex items-center gap-2 mt-3">
                    <MapPin size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-700">{selectedLocation}</span>
                    <button
                      onClick={removeLocation}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}


                {/* Poll Section */}
                {activePostType === POST_TYPES.POLL && (
                  <div className="rounded-lg">
                    <h3 className="font-medium text-[20px] text-gray-700 mb-3">Poll Options</h3>

                    {pollOptions.map((option, index) => (
                      <div key={index} className="flex items-center gap-2 mb-4">
                        <InputField
                          label={`Option ${index + 1}`}
                          name={`pollOption${index}`}
                          value={option}
                          onChange={(e) => handlePollChange(index, e.target.value)}
                          className="h-[50px]"
                        />

                        {pollOptions.length > 2 && (
                          <button
                            onClick={() => removePollOption(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}

                    {pollOptions.length < 4 && (
                      <button
                        onClick={handleAddPollOption}
                        className="text-blue-600 text-[16px] font-medium mt-2"
                      >
                        + Add Option
                      </button>
                    )}

                    {/* Poll Duration Dropdown */}
                    <div className="mt-3">
                      <FormDropdown
                        label="Poll Duration"
                        name="pollDuration"
                        value={pollDuration}
                        onChange={(e) => setPollDuration(e.target.value)}
                        options={["1 Day", "3 Days", "7 Days"]}
                      />
                    </div>

                    {/* Remove Entire Poll */}
                    <button
                      onClick={() => {
                        setPollOptions(["", ""]);
                        setPollDuration("1 Day");
                        setActivePostType(null);
                      }}
                      className="mt-4 text-red-600 font-medium"
                    >
                      Remove Poll
                    </button>
                  </div>
                )}



                <div className="flex gap-4 overflow-x-auto custom-scroll">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group flex-shrink-0">





                      {file.type.startsWith("image/") && (
                        <>
                          <div className="relative " style={getModalImageStyle(index, "modal")}>
                            {/* <img
              src={URL.createObjectURL(file)}
              className="rounded-xl border border-gray-400"
              alt={`Uploaded image ${index + 1}`}
              onLoad={(e) => {
                if (index === 0) {
                  handleFirstImageLoad(e);
                }
              }}
              style={getImageStyle(index)}
            /> */}

                            <img
                              src={URL.createObjectURL(file)}
                              className="rounded-xl border border-gray-400"
                              alt={`Uploaded image ${index + 1}`}
                              onLoad={(e) => {
                                if (index === 0) {
                                  handleFirstImageLoad(e);
                                }
                              }}
                              style={getModalImageStyle()} // No index needed
                            />



                            {/* Edit Button */}
                            <div className="absolute top-2 left-2 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                              <button
                                onClick={() => handleImageEditClick(file, index)}
                                className="text-[#000] font-medium bg-[#e0e0e0b7] rounded-full px-3 py-1"
                                title="Edit Image"
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        </>
                      )}


                      {/* Video Preview */}
                      {file.type.startsWith("video/") && (
                        <video
                          src={URL.createObjectURL(file)}
                          controls
                          className="w-[280px] h-[220px] rounded-xl border object-cover flex-shrink-0"
                        />
                      )}

                      {/* Document Preview */}
                      {(file.type.includes("pdf")) && (
                        <div className="">
                          {renderDocumentPreview(file, index)}
                        </div>
                      )}

                      <button
                        onClick={() => removeFile(index)}
                        className="absolute top-4  right-4 hover:cursor-pointer text-[#000] font-medium bg-[#e0e0e0b7] rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={26} className="p-1" />
                      </button>
                    </div>
                  ))}
                </div>


                {/* Action Buttons */}
                <div className="flex relative items-center gap-5 py-3 rounded-lg">

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
                      onEmojiClick={(emojiData) => {
                        setText((prev) => prev + emojiData.emoji);
                      }}
                      searchDisabled={false}
                      skinTonesDisabled={true}
                      height={400}
                      width={350}
                    />
                  </SmartDropdown>


                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => handlePostTypeChange(POST_TYPES.IMAGE)}
                    buttonclass={`text-[#394E57] ${isImageUploadDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isImageUploadDisabled}
                    showIcon
                    icon={ImagePlus}
                  />

                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => handlePostTypeChange(POST_TYPES.POLL)}
                    buttonclass="text-[#394E57]"
                    showIcon
                    icon={BarChart2}
                  />

                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => handlePostTypeChange(POST_TYPES.DOCUMENT)}
                    buttonclass={`text-[#394E57] ${isDocumentUploadDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isDocumentUploadDisabled}
                    showIcon
                    icon={FileText}
                  />

                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => setShowReactions(!showReactions)}
                    showIcon
                    buttonclass="!text-[#394E57]"
                    icon={BrickWallFire}
                  />

                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => setShowTagPeopleModal(true)}
                    showIcon
                    icon={UserRoundPlus}
                    buttonclass="!text-[#394E57]"
                  />

                  <TagPeopleModal
                    isOpen={showTagPeopleModal}
                    onClose={() => setShowTagPeopleModal(false)}
                    USERS={USERS}
                    selectedPeople={selectedPeople}
                    setSelectedPeople={setSelectedPeople}
                    handleAddPerson={handleAddPerson}

                  />
                  {/* Location Button */}
                  <div className="relative" ref={locationRef}>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => setShowLocationModal(true)}
                      showIcon
                      icon={MapPin}
                      buttonclass="!text-[#394E57]"
                    />

                    {/* Location Modal */}
                    <CreatePostLocation
                      isOpen={showLocationModal}
                      onClose={() => setShowLocationModal(false)}
                      onLocationSelect={setSelectedLocation}
                      selectedLocation={selectedLocation}
                    />

                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="border-t border-[#B6C9DF] pt-4 px-5 pb-4 bg-white flex-shrink-0">

            <SmartDropdown
              width={320}
              trigger={
                <button className="flex items-center gap-2 text-[#0a66c2] hover:bg-blue-50 px-3 py-2 rounded-full">
                  <Globe size={18} />
                  <span className="text-sm font-medium">
                    {replyOption === "everyone" && "Everyone can reply"}
                    {replyOption === "following" && "Accounts you follow"}
                    {replyOption === "verified" && "Verified accounts"}
                    {replyOption === "mentioned" && "Only accounts you mention"}
                  </span>
                </button>
              }
            >
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-lg text-gray-900">Who can reply?</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Choose who can reply to this post.
                </p>
                <p className="text-sm text-gray-500">
                  Anyone mentioned can always reply.
                </p>
              </div>

              <div className="py-2">
                <button
                  onClick={() => setReplyOption("everyone")}
                  className={`w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 ${replyOption === "everyone" ? "bg-blue-50" : ""
                    }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#0a66c2] flex items-center justify-center">
                    <Globe size={20} className="text-white" />
                  </div>
                  <p className="font-semibold text-gray-900">Everyone</p>

                  {replyOption === "everyone" && <Check size={20} className="text-[#0a66c2]" />}
                </button>

                <button
                  onClick={() => setReplyOption("following")}
                  className={`w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 ${replyOption === "following" ? "bg-blue-50" : ""
                    }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#0a66c2] flex items-center justify-center">
                    <UserCheck size={20} className="text-white" />
                  </div>
                  <p className="font-semibold text-gray-900">Accounts you follow</p>

                  {replyOption === "following" && <Check size={20} className="text-[#0a66c2]" />}
                </button>

                <button
                  onClick={() => setReplyOption("verified")}
                  className={`w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 ${replyOption === "verified" ? "bg-blue-50" : ""
                    }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#0a66c2] flex items-center justify-center">
                    <BadgeCheck size={20} className="text-white" />
                  </div>
                  <p className="font-semibold text-gray-900">Verified accounts</p>

                  {replyOption === "verified" && <Check size={20} className="text-[#0a66c2]" />}
                </button>

                <button
                  onClick={() => setReplyOption("mentioned")}
                  className={`w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 ${replyOption === "mentioned" ? "bg-blue-50" : ""
                    }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#0a66c2] flex items-center justify-center">
                    <AtSign size={20} className="text-white" />
                  </div>
                  <p className="font-semibold text-gray-900">Only accounts you mention</p>

                  {replyOption === "mentioned" && <Check size={20} className="text-[#0a66c2]" />}
                </button>
              </div>
            </SmartDropdown>

            <div className="flex justify-between pb-8 gap-3">

              <Button
                className="text-[#2646d4] rounded-full text-[18px] font-semibold"
                onClick={() => {
                  setInternalIsOpen(false);

                  setTimeout(() => {
                    setShowDraftsListModal(true);
                  }, 0); // small safe delay
                }}
              >
                Drafts
              </Button>

              <Button
                onClick={handlePost}
                disabled={isPostDisabled}
                className="rounded-full h-11 px-8 font-semibold bg-[#0013E3] text-white hover:bg-blue-800 "
              >
                Post
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple={activePostType === POST_TYPES.IMAGE || activePostType === POST_TYPES.DOCUMENT}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </Modal>

      <ImageEditorModalPost
        show={showImageEditor}
        onClose={handleEditorCancel}
        image={imageToEdit}
        onSave={handleEditorSave}
      />
    </>
  );
}