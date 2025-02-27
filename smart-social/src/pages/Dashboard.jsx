import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaCog, FaCalendar as FaCalendarIcon, FaPlus, FaPlug } from "react-icons/fa";

const Dashboard = () => {
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [predisPostId, setPredisPostId] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [businessType, setBusinessType] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [postType, setPostType] = useState("");
  const [tone, setTone] = useState("");
  const [prompt, setPrompt] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Display-only placeholder
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [predisInstance, setPredisInstance] = useState(null);
  const [sdkError, setSdkError] = useState(null);
  const [activeSection, setActiveSection] = useState("generate");
  const [scheduledAt, setScheduledAt] = useState("");
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const navigate = useNavigate();

  // Business Types, Subcategories, and Post Types
  const businessTypes = [
    "Retail", "Restaurant", "Service", "Technology", "Healthcare",
    "Education", "Entertainment", "Fitness", "Travel", "Real Estate"
  ];

  const subcategories = {
    Retail: ["Clothing", "Electronics", "Home Goods", "Jewelry", "Books", "Toys", "Furniture", "Sporting Goods", "Beauty", "Grocery"],
    Restaurant: ["Cafe", "Fast Food", "Fine Dining", "Bakery", "Food Truck", "Pizzeria", "Sushi Bar", "Bar", "Deli", "Ice Cream Shop"],
    Service: ["Consulting", "Freelance", "Cleaning", "Landscaping", "Plumbing", "Electrical", "Legal", "Accounting", "Photography", "Event Planning"],
    Technology: ["Software", "Hardware", "IT Services", "Web Development", "Mobile Apps", "Cybersecurity", "Cloud Services", "AI Solutions", "Gadgets", "Tech Support"],
    Healthcare: ["Clinic", "Dental", "Pharmacy", "Physical Therapy", "Optometry", "Veterinary", "Mental Health", "Fitness Center", "Chiropractic", "Home Care"],
    Education: ["Tutoring", "Online Courses", "School", "University", "Language Classes", "Coding Bootcamp", "Art Classes", "Music Lessons", "Daycare", "Coaching"],
    Entertainment: ["Movies", "Music", "Theater", "Gaming", "Events", "Streaming", "Comedy", "Dance", "Photography", "Art Gallery"],
    Fitness: ["Gym", "Yoga Studio", "Personal Training", "Martial Arts", "CrossFit", "Dance Fitness", "Pilates", "Swimming", "Cycling", "Sports Club"],
    Travel: ["Agency", "Tour Operator", "Hotel", "Airline", "Car Rental", "Cruise", "Travel Blog", "Adventure Tours", "Vacation Rentals", "Guide Services"],
    RealEstate: ["Residential", "Commercial", "Property Management", "Real Estate Agent", "Construction", "Interior Design", "Mortgage Broker", "Home Staging", "Land Development", "Appraisal"]
  };

  const postTypes = {
    Retail: {
      Clothing: ["New Arrival", "Sale", "Fashion Tips", "Seasonal Collection", "Customer Review"],
      Electronics: ["Product Launch", "Discount", "Tech Tips", "Review", "Upgrade Offer"],
      HomeGoods: ["New Product", "Home Decor Ideas", "Sale", "DIY Tips", "Seasonal Update"],
      Jewelry: ["New Collection", "Special Offer", "Jewelry Care", "Gift Guide", "Custom Design"],
      Books: ["New Release", "Book Signing", "Reading List", "Author Spotlight", "Discount"],
      Toys: ["New Toy", "Holiday Gift Guide", "Toy Review", "Sale", "Play Ideas"],
      Furniture: ["New Arrival", "Interior Tips", "Sale", "Custom Order", "Room Inspiration"],
      SportingGoods: ["New Gear", "Sports Tips", "Sale", "Athlete Spotlight", "Seasonal Guide"],
      Beauty: ["New Product", "Beauty Tips", "Sale", "Tutorial", "Seasonal Look"],
      Grocery: ["New Item", "Recipe", "Special Offer", "Health Tips", "Weekly Deals"]
    },
    Restaurant: {
      Cafe: ["New Menu Item", "Daily Special", "Event", "Customer Story", "Coffee Tips"],
      FastFood: ["New Item", "Combo Deal", "Limited Offer", "Location Update", "Customer Feedback"],
      FineDining: ["New Dish", "Wine Pairing", "Reservation Offer", "Chef Spotlight", "Special Event"],
      Bakery: ["New Pastry", "Daily Special", "Baking Tips", "Order Discount", "Seasonal Treat"],
      FoodTruck: ["New Location", "Menu Update", "Special Offer", "Event Appearance", "Customer Photo"],
      Pizzeria: ["New Pizza", "Daily Deal", "Pizza Tips", "Customer Review", "Special Event"],
      SushiBar: ["New Roll", "Sushi Special", "Fresh Catch", "Dining Offer", "Sushi Tips"],
      Bar: ["New Drink", "Happy Hour", "Event Night", "Bartender Tip", "Seasonal Cocktail"],
      Deli: ["New Sandwich", "Daily Special", "Catering Offer", "Deli Tips", "Customer Favorite"],
      IceCreamShop: ["New Flavor", "Seasonal Special", "Discount Day", "Ice Cream Tips", "Event"]
    },
    Service: {
      Consulting: ["New Service", "Case Study", "Tips", "Client Success", "Webinar"],
      Freelance: ["Portfolio Update", "Service Offer", "Tips", "Project Showcase", "Availability"],
      Cleaning: ["New Package", "Cleaning Tips", "Special Offer", "Before/After", "Seasonal Service"],
      Landscaping: ["New Design", "Gardening Tips", "Seasonal Offer", "Project Photo", "Maintenance Plan"],
      Plumbing: ["Service Update", "Plumbing Tips", "Emergency Offer", "Customer Story", "Seasonal Check"],
      Electrical: ["New Service", "Safety Tips", "Special Deal", "Project Highlight", "Emergency Contact"],
      Legal: ["New Offering", "Legal Tips", "Case Win", "Consultation Offer", "Law Update"],
      Accounting: ["Tax Tips", "New Service", "Deadline Reminder", "Client Success", "Financial Advice"],
      Photography: ["New Shoot", "Photography Tips", "Portfolio Update", "Special Offer", "Event Coverage"],
      EventPlanning: ["New Package", "Event Tips", "Recent Event", "Special Offer", "Theme Idea"]
    },
    Technology: {
      Software: ["New Feature", "Update", "Tech Tips", "User Story", "Discount"],
      Hardware: ["New Product", "Tech Specs", "Sale", "Review", "Upgrade Offer"],
      ITServices: ["New Service", "IT Tips", "Case Study", "Support Offer", "Security Update"],
      WebDevelopment: ["New Site", "Dev Tips", "Portfolio Update", "Special Offer", "SEO Advice"],
      MobileApps: ["New App", "Update", "App Tips", "User Feedback", "Launch Offer"],
      Cybersecurity: ["Security Tips", "New Service", "Threat Update", "Client Success", "Free Check"],
      CloudServices: ["New Plan", "Cloud Tips", "Case Study", "Special Offer", "Migration Guide"],
      AISolutions: ["New AI Tool", "AI Tips", "Case Study", "Demo Offer", "Innovation Update"],
      Gadgets: ["New Gadget", "Tech Review", "Sale", "Usage Tips", "Gift Guide"],
      TechSupport: ["Support Tips", "New Service", "Quick Fix", "Client Story", "24/7 Offer"]
    },
    Healthcare: {
      Clinic: ["New Service", "Health Tips", "Appointment Offer", "Patient Story", "Seasonal Check"],
      Dental: ["New Treatment", "Dental Tips", "Special Offer", "Patient Review", "Smile Makeover"],
      Pharmacy: ["New Medication", "Health Advice", "Discount", "Rx Tips", "Wellness Event"],
      PhysicalTherapy: ["New Therapy", "Exercise Tips", "Recovery Story", "Special Offer", "Free Consult"],
      Optometry: ["New Glasses", "Eye Care Tips", "Sale", "Patient Story", "Vision Check"],
      Veterinary: ["Pet Care Tips", "New Service", "Pet Story", "Special Offer", "Clinic Event"],
      MentalHealth: ["Wellness Tips", "New Therapy", "Support Offer", "Client Story", "Workshop"],
      FitnessCenter: ["New Class", "Fitness Tips", "Member Story", "Special Offer", "Challenge"],
      Chiropractic: ["Adjustment Tips", "New Service", "Patient Success", "Free Check", "Health Event"],
      HomeCare: ["Care Tips", "New Service", "Caregiver Story", "Special Offer", "Home Safety"]
    },
    Education: {
      Tutoring: ["New Subject", "Study Tips", "Student Success", "Special Offer", "Free Session"],
      OnlineCourses: ["New Course", "Learning Tips", "Course Review", "Discount", "Webinar"],
      School: ["School Event", "Education Tips", "Student Spotlight", "Enrollment Offer", "Update"],
      University: ["New Program", "Campus News", "Student Story", "Scholarship", "Research Update"],
      LanguageClasses: ["New Language", "Language Tips", "Student Progress", "Offer", "Culture Event"],
      CodingBootcamp: ["New Bootcamp", "Coding Tips", "Graduate Story", "Discount", "Free Workshop"],
      ArtClasses: ["New Class", "Art Tips", "Student Work", "Special Offer", "Exhibit"],
      MusicLessons: ["New Lesson", "Music Tips", "Student Performance", "Offer", "Recital"],
      Daycare: ["Activity Update", "Parent Tips", "Child Story", "Enrollment Offer", "Event"],
      Coaching: ["New Program", "Coaching Tips", "Client Success", "Free Session", "Motivation"]
    },
    Entertainment: {
      Movies: ["New Release", "Movie Trivia", "Ticket Offer", "Review", "Behind Scenes"],
      Music: ["New Song", "Music Tips", "Artist Spotlight", "Concert Offer", "Playlist"],
      Theater: ["New Show", "Theater Tips", "Audience Review", "Ticket Deal", "Rehearsal Peek"],
      Gaming: ["New Game", "Gaming Tips", "Player Story", "Sale", "Tournament"],
      Events: ["New Event", "Event Tips", "Attendee Story", "Ticket Offer", "Preview"],
      Streaming: ["New Content", "Streaming Tips", "Viewer Pick", "Subscription Deal", "Watch Party"],
      Comedy: ["New Show", "Comedy Tips", "Audience Laugh", "Ticket Offer", "Joke of Day"],
      Dance: ["New Class", "Dance Tips", "Performer Story", "Special Offer", "Recital"],
      Photography: ["New Shoot", "Photo Tips", "Portfolio Update", "Offer", "Exhibit"],
      ArtGallery: ["New Exhibit", "Art Tips", "Artist Story", "Entry Offer", "Gallery Tour"]
    },
    Fitness: {
      Gym: ["New Equipment", "Workout Tips", "Member Story", "Membership Deal", "Challenge"],
      YogaStudio: ["New Class", "Yoga Tips", "Student Progress", "Special Offer", "Retreat"],
      PersonalTraining: ["New Program", "Fitness Tips", "Client Success", "Free Session", "Goal Tips"],
      MartialArts: ["New Class", "Martial Arts Tips", "Student Belt", "Offer", "Demo Day"],
      CrossFit: ["New WOD", "CrossFit Tips", "Athlete Story", "Special Offer", "Competition"],
      DanceFitness: ["New Routine", "Dance Tips", "Member Fun", "Class Deal", "Dance Event"],
      Pilates: ["New Session", "Pilates Tips", "Client Progress", "Offer", "Workshop"],
      Swimming: ["New Class", "Swim Tips", "Swimmer Story", "Pool Offer", "Swim Meet"],
      Cycling: ["New Ride", "Cycling Tips", "Rider Story", "Gear Deal", "Group Ride"],
      SportsClub: ["New Sport", "Sports Tips", "Team Update", "Membership Offer", "Event"]
    },
    Travel: {
      Agency: ["New Package", "Travel Tips", "Destination Spotlight", "Deal", "Client Story"],
      TourOperator: ["New Tour", "Tour Tips", "Traveler Review", "Special Offer", "Itinerary"],
      Hotel: ["New Room", "Stay Tips", "Guest Story", "Discount", "Hotel Event"],
      Airline: ["New Route", "Flight Tips", "Passenger Story", "Fare Deal", "Travel Update"],
      CarRental: ["New Vehicle", "Road Trip Tips", "Customer Drive", "Rental Offer", "Car Care"],
      Cruise: ["New Cruise", "Cruise Tips", "Passenger Tale", "Cruise Deal", "Port Preview"],
      TravelBlog: ["New Post", "Travel Tips", "Blog Feature", "Guide Offer", "Photo Story"],
      AdventureTours: ["New Adventure", "Adventure Tips", "Traveler Story", "Offer", "Gear Guide"],
      VacationRentals: ["New Listing", "Stay Tips", "Guest Review", "Rental Deal", "Local Guide"],
      GuideServices: ["New Guide", "Travel Tips", "Tourist Story", "Service Offer", "Local Event"]
    },
    RealEstate: {
      Residential: ["New Listing", "Home Tips", "Buyer Story", "Open House", "Market Update"],
      Commercial: ["New Property", "Business Tips", "Tenant Story", "Lease Offer", "Market Trend"],
      PropertyManagement: ["New Service", "Property Tips", "Client Story", "Management Offer", "Update"],
      RealEstateAgent: ["New Listing", "Real Estate Tips", "Sold Story", "Free Consult", "Market News"],
      Construction: ["New Project", "Build Tips", "Client Build", "Construction Offer", "Progress Update"],
      InteriorDesign: ["New Design", "Decor Tips", "Client Space", "Design Offer", "Trend Update"],
      MortgageBroker: ["New Rate", "Finance Tips", "Client Loan", "Mortgage Offer", "Rate Update"],
      HomeStaging: ["New Stage", "Staging Tips", "Staged Home", "Staging Offer", "Before/After"],
      LandDevelopment: ["New Land", "Dev Tips", "Project Update", "Land Offer", "Plan Preview"],
      Appraisal: ["New Service", "Value Tips", "Client Appraisal", "Free Quote", "Market Insight"]
    }
  };

  useEffect(() => {
    console.log("Dashboard component mounted");
    const initializeSdk = () => {
      console.log("Initializing Predis.ai SDK");
      const script = document.createElement("script");
      script.src = "https://predis.ai/sdk/embed.js";
      script.async = true;
      script.crossOrigin = "anonymous";
      script.onload = () => {
        console.log("Predis.ai SDK script loaded");
        if (window.Predis) {
          const predis = new window.Predis({
            appId: "YOUR_PREDIS_APP_ID" // Replace with your Predis.ai App ID
          });
          predis.on("ready", () => {
            console.log("Predis.ai SDK initialized successfully", predis);
            setPredisInstance(predis);
            setSdkError(null);
          });
          predis.on("error", (error) => {
            console.error("Predis.ai SDK initialization error:", error);
            setSdkError("Failed to initialize Predis.ai SDK: " + error.message);
          });
        } else {
          console.error("Predis.ai SDK script loaded but window.Predis is undefined");
          setSdkError("Predis.ai SDK not available");
        }
      };
      script.onerror = () => {
        console.error("Failed to load Predis.ai SDK script");
        setSdkError("Failed to load Predis.ai SDK script");
      };
      document.head.appendChild(script);

      return () => {
        console.log("Cleaning up SDK script");
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    };

    const fetchUserAndAccounts = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Retrieved token from localStorage:", token ? token.slice(0, 20) + "..." : "No token");
        if (!token) {
          console.log("No token found, redirecting to login");
          throw new Error("No token found");
        }
        setIsLoading(true);
        console.log("Fetching user and accounts with token:", token.slice(0, 20) + "...");

        const userResponse = await axios.get("http://localhost:5000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        console.log("User response:", userResponse.data);
        setUsername(userResponse.data.username);
        setEmail(userResponse.data.email);
        setPassword("********"); // Placeholder for security

        const accountsResponse = await axios.get("http://localhost:5000/api/accounts", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        console.log("Accounts response:", accountsResponse.data);
        setConnectedAccounts(accountsResponse.data);

        const scheduledPostsResponse = await axios.get("http://localhost:5000/api/scheduled-posts", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        console.log("Scheduled posts response:", scheduledPostsResponse.data);
        setScheduledPosts(scheduledPostsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    initializeSdk();
    fetchUserAndAccounts();

    window.addEventListener("message", handlePopupMessage);
    return () => window.removeEventListener("message", handlePopupMessage);
  }, [navigate]);

  const handlePopupMessage = (event) => {
    console.log("Received window message:", event.data);
    if (event.data.type === "AUTH_COMPLETE") {
      const fetchAccounts = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get("http://localhost:5000/api/accounts", {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });
          setConnectedAccounts(response.data);
          console.log("Accounts refreshed:", response.data);
        } catch (error) {
          console.error("Error refreshing accounts:", error);
        }
      };
      fetchAccounts();
    } else if (event.data.type === "AUTH_ERROR") {
      console.error("Auth error:", event.data.error, event.data.description || "");
      alert(`Authentication failed: ${event.data.error}${event.data.description ? " - " + event.data.description : ""}`);
    }
  };

  const connectSocialMedia = async (platform) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const endpoint = platform === "Twitter" ? "/api/twitter/auth" :
                      platform === "Facebook" ? "/api/facebook/auth" :
                      platform === "Instagram" ? "/api/instagram/auth" : "/api/linkedin/auth";
      setIsLoading(true);
      console.log(`Initiating ${platform} auth...`);

      const response = await axios.get(`http://localhost:5000${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      console.log(`${platform} auth URL received:`, response.data.url);
      const authUrl = response.data.url;

      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        authUrl,
        "SmartSocialAuth",
        `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
      );
      if (!popup) console.error(`${platform} popup blocked by browser`);

      const checkPopup = setInterval(() => {
        if (popup.closed) {
          console.log(`${platform} popup closed`);
          clearInterval(checkPopup);
          setIsLoading(false);
        }
      }, 500);
    } catch (error) {
      console.error(`Error connecting ${platform}:`, error.message);
      alert(`Error connecting ${platform}: ${error.response?.data?.error || "Unknown error"}`);
      setIsLoading(false);
    }
  };

  const disconnectSocialMedia = async (platform) => {
    try {
      const token = localStorage.getItem("token");
      setIsLoading(true);
      await axios.delete(`http://localhost:5000/api/accounts/${platform}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setConnectedAccounts((prev) => prev.filter((acc) => acc.platform !== platform));
      console.log(`${platform} disconnected`);
    } catch (error) {
      console.error(`Error disconnecting ${platform}:`, error.message);
      alert(`Error disconnecting ${platform}: ${error.response?.data?.error || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePost = async () => {
    try {
      const token = localStorage.getItem("token");
      setIsLoading(true);
      console.log("Sending generate post request...");
      const response = await axios.post(
        "http://localhost:5000/api/generate-post",
        { businessType, subcategory, postType, tone, prompt },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      console.log("Generate post response received:", response.data);
      setPostContent(response.data.caption);
      setHashtags(response.data.hashtags);
      setPredisPostId(response.data.predisPostId);
      setImageUrl(null);
      console.log("Post state updated - predisPostId:", response.data.predisPostId);
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Unknown error";
      console.error("Generate post error:", errorMessage);
      alert(`Error generating post: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePost = async (e, schedule = false) => {
    e.preventDefault();
    if (!postContent) {
      console.warn("Post attempt failed: Missing content");
      alert("Please generate or edit content.");
      return;
    }
    if (selectedPlatforms.length === 0) {
      console.warn("Post attempt failed: No platforms selected");
      alert("Please select at least one platform.");
      return;
    }
    setIsPosting(true);
    try {
      const token = localStorage.getItem("token");
      const postData = { content: `${postContent} ${hashtags.join(" ")}`, platforms: selectedPlatforms, imageUrl };
      console.log("Sending post request:", { postData, schedule });

      if (schedule && scheduledAt) {
        const response = await axios.post(
          "http://localhost:5000/api/schedule-post",
          { ...postData, scheduledAt },
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );
        console.log("Schedule response received:", response.data);
        setScheduledPosts((prev) => [...prev, { ...postData, scheduledAt, status: "pending", _id: response.data.scheduledPostId }]);
        alert("Post scheduled successfully!");
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/post",
          postData,
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );
        console.log("Post response received:", response.data);
        const results = response.data;
        const successMessages = [];
        const errorMessages = [];
        for (const platform in results) {
          if (results[platform].message) {
            successMessages.push(`${platform}: ${results[platform].message} (ID: ${results[platform].tweetId || results[platform].postId || "mocked"})`);
          } else if (results[platform].error === "Twitter rate limit exceeded") {
            errorMessages.push(`${platform}: Rate limit exceeded, try again at ${results[platform].resetTime}`);
          } else {
            errorMessages.push(`${platform}: ${results[platform].error}`);
          }
        }
        if (successMessages.length) alert(successMessages.join("\n"));
        if (errorMessages.length) alert("Errors:\n" + errorMessages.join("\n"));
      }

      setPostContent("");
      setHashtags([]);
      setImageUrl(null);
      setPredisPostId(null);
      setScheduledAt("");
      setSelectedPlatforms([]);
    } catch (error) {
      console.error("Post/Schedule error:", error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.error || "Unknown error"}`);
    } finally {
      setIsPosting(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const updateData = {};
      if (newUsername) updateData.username = newUsername;
      if (newPassword) updateData.password = newPassword;

      if (Object.keys(updateData).length === 0) {
        alert("No changes to update.");
        return;
      }

      const response = await axios.put(
        "http://localhost:5000/api/user",
        updateData,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      console.log("Profile update response:", response.data);
      if (newUsername) setUsername(newUsername);
      if (newPassword) setPassword("********"); // Reset placeholder
      setNewUsername("");
      setNewPassword("");
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error.response?.data || error.message);
      alert(`Error updating profile: ${error.response?.data?.error || "Unknown error"}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    console.log("User logged out");
    navigate("/");
  };

  const editImageInApp = () => {
    console.log("Edit Image button clicked");
    console.log("Current state - predisPostId:", predisPostId, "predisInstance:", predisInstance, "imageUrl:", imageUrl);
    if (!predisPostId) {
      console.warn("No post ID available to edit");
      alert("No post ID available to edit. Please generate a post first.");
      return;
    }
    if (!predisInstance) {
      console.warn("Predis.ai SDK instance not available");
      alert("Predis.ai SDK is not initialized. Check your App ID or network connection.");
      return;
    }
    console.log("Attempting to open Predis.ai editor for postId:", predisPostId);
    predisInstance.createPost({
      postId: predisPostId,
      mediaType: "single_image",
      brandId: "YOUR_CORRECT_BRAND_ID", // Replace with your brand ID
      onSuccess: (result) => {
        console.log("Image edited via SDK:", result);
        if (result.mediaUrls?.length > 0) {
          const newImageUrl = result.mediaUrls[0];
          setImageUrl(newImageUrl);
          axios.post(
            `http://localhost:5000/api/predis-post/${predisPostId}`,
            { imageUrl: newImageUrl },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, withCredentials: true }
          ).then(() => console.log("Updated image URL in database:", newImageUrl));
        } else {
          console.warn("No mediaUrls returned from SDK");
          alert("Image edited, but no URL returned");
        }
      },
      onError: (error) => {
        console.error("SDK editing error:", error);
        alert("Error editing image: " + error.message);
      },
    });
  };

  useEffect(() => {
    if (predisPostId && !imageUrl) {
      const interval = setInterval(async () => {
        console.log("Polling for post status, postId:", predisPostId);
        try {
          const token = localStorage.getItem("token");
          let response = await axios.get(
            `http://localhost:5000/api/post-status/${predisPostId}`,
            { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
          );

          if (response.data.status === "completed") {
            if (response.data.imageUrl) {
              console.log("Image URL retrieved from webhook:", response.data.imageUrl);
              setImageUrl(response.data.imageUrl);
              clearInterval(interval);
            } else {
              console.warn("No image URL in webhook, attempting manual fetch from Predis.ai");
              response = await axios.get(
                `http://localhost:5000/api/predis-post/${predisPostId}`,
                { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
              );
              if (response.data.imageUrl) {
                console.log("Image URL retrieved from manual fetch:", response.data.imageUrl);
                setImageUrl(response.data.imageUrl);
                clearInterval(interval);
              } else {
                console.error("Manual fetch failed, no image URL available");
                alert("Image generated but not retrievable");
                setPredisPostId(null);
                clearInterval(interval);
              }
            }
          } else if (response.data.status === "failed") {
            alert("Image generation failed");
            setPredisPostId(null);
            clearInterval(interval);
          }
        } catch (error) {
          console.error("Polling error:", error.response?.data || error.message);
          clearInterval(interval);
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [predisPostId, imageUrl]);

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const postsOnDate = scheduledPosts.filter(post => {
        const postDate = new Date(post.scheduledAt);
        return postDate.toDateString() === date.toDateString();
      });
      return postsOnDate.length > 0 ? (
        <div className="flex justify-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
        </div>
      ) : null;
    }
  };

  return (
    <div className="font-sans min-h-screen flex bg-blue-100">
      <div className="w-64 bg-white shadow-lg flex flex-col justify-between">
        <div>
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-blue-600">SmartSocial</h1>
          </div>
          <nav className="mt-4">
            <button
              onClick={() => setActiveSection("integrations")}
              className={`w-full text-left p-4 flex items-center ${activeSection === "integrations" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <FaPlug className="mr-2" /> Integrations
            </button>
            <button
              onClick={() => setActiveSection("generate")}
              className={`w-full text-left p-4 flex items-center ${activeSection === "generate" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <FaPlus className="mr-2" /> Generate Posts
            </button>
            <button
              onClick={() => setActiveSection("scheduling")}
              className={`w-full text-left p-4 flex items-center ${activeSection === "scheduling" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <FaCalendarIcon className="mr-2" /> Scheduling
            </button>
            <button
              onClick={() => setActiveSection("settings")}
              className={`w-full text-left p-4 flex items-center ${activeSection === "settings" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <FaCog className="mr-2" /> Settings
            </button>
          </nav>
        </div>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-transform duration-300 transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="bg-white p-6 rounded-2xl shadow-2xl mb-6 border-t-4 border-blue-600">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Welcome back, {username}!</h1>
          <p className="text-gray-600">Manage your social media workflow efficiently.</p>
          {sdkError && <p className="text-red-600 text-sm mt-2">{sdkError}</p>}
        </div>

        {activeSection === "integrations" && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Integrations</h2>
            {isLoading && <p className="text-gray-600 text-center">Loading...</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg border-t-2 border-blue-400 flex items-center justify-between">
                <div className="flex items-center">
                  <FaTwitter className="text-blue-400 text-3xl mr-4" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Twitter</h3>
                    {connectedAccounts.some((acc) => acc.platform === "Twitter") ? (
                      <p className="text-green-600 text-sm">
                        Connected as {connectedAccounts.find((acc) => acc.platform === "Twitter").displayName}
                      </p>
                    ) : (
                      <p className="text-gray-600 text-sm">Not connected</p>
                    )}
                  </div>
                </div>
                {connectedAccounts.some((acc) => acc.platform === "Twitter") ? (
                  <button
                    onClick={() => disconnectSocialMedia("Twitter")}
                    className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-transform duration-300 transform hover:scale-105"
                    disabled={isLoading}
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => connectSocialMedia("Twitter")}
                    className="bg-blue-400 text-white px-4 py-2 rounded-full hover:bg-blue-500 transition-transform duration-300 transform hover:scale-105"
                    disabled={isLoading}
                  >
                    Connect
                  </button>
                )}
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border-t-2 border-blue-600 flex items-center justify-between">
                <div className="flex items-center">
                  <FaFacebook className="text-blue-600 text-3xl mr-4" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Facebook</h3>
                    {connectedAccounts.some((acc) => acc.platform === "Facebook") ? (
                      <p className="text-green-600 text-sm">
                        Connected as {connectedAccounts.find((acc) => acc.platform === "Facebook").displayName}
                      </p>
                    ) : (
                      <p className="text-gray-600 text-sm">Not connected</p>
                    )}
                  </div>
                </div>
                {connectedAccounts.some((acc) => acc.platform === "Facebook") ? (
                  <button
                    onClick={() => disconnectSocialMedia("Facebook")}
                    className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-transform duration-300 transform hover:scale-105"
                    disabled={isLoading}
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => connectSocialMedia("Facebook")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-transform duration-300 transform hover:scale-105"
                    disabled={isLoading}
                  >
                    Connect
                  </button>
                )}
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border-t-2 border-pink-500 flex items-center justify-between">
                <div className="flex items-center">
                  <FaInstagram className="text-pink-500 text-3xl mr-4" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Instagram</h3>
                    {connectedAccounts.some((acc) => acc.platform === "Instagram") ? (
                      <p className="text-green-600 text-sm">
                        Connected as {connectedAccounts.find((acc) => acc.platform === "Instagram").displayName}
                      </p>
                    ) : (
                      <p className="text-gray-600 text-sm">Not connected</p>
                    )}
                  </div>
                </div>
                {connectedAccounts.some((acc) => acc.platform === "Instagram") ? (
                  <button
                    onClick={() => disconnectSocialMedia("Instagram")}
                    className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-transform duration-300 transform hover:scale-105"
                    disabled={isLoading}
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => connectSocialMedia("Instagram")}
                    className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition-transform duration-300 transform hover:scale-105"
                    disabled={isLoading}
                  >
                    Connect
                  </button>
                )}
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border-t-2 border-blue-700 flex items-center justify-between">
                <div className="flex items-center">
                  <FaLinkedin className="text-blue-700 text-3xl mr-4" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">LinkedIn</h3>
                    {connectedAccounts.some((acc) => acc.platform === "LinkedIn") ? (
                      <p className="text-green-600 text-sm">
                        Connected as {connectedAccounts.find((acc) => acc.platform === "LinkedIn").displayName}
                      </p>
                    ) : (
                      <p className="text-gray-600 text-sm">Not connected</p>
                    )}
                  </div>
                </div>
                {connectedAccounts.some((acc) => acc.platform === "LinkedIn") ? (
                  <button
                    onClick={() => disconnectSocialMedia("LinkedIn")}
                    className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-transform duration-300 transform hover:scale-105"
                    disabled={isLoading}
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => connectSocialMedia("LinkedIn")}
                    className="bg-blue-700 text-white px-4 py-2 rounded-full hover:bg-blue-800 transition-transform duration-300 transform hover:scale-105"
                    disabled={isLoading}
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {activeSection === "generate" && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Generate Posts</h2>
            <div className="bg-white p-8 rounded-2xl shadow-2xl border-t-4 border-blue-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                  <select
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    value={businessType}
                    onChange={(e) => {
                      setBusinessType(e.target.value);
                      setSubcategory("");
                      setPostType("");
                    }}
                  >
                    <option value="">Select Business Type</option>
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                  <select
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    value={subcategory}
                    onChange={(e) => {
                      setSubcategory(e.target.value);
                      setPostType("");
                    }}
                    disabled={!businessType}
                  >
                    <option value="">Select Subcategory</option>
                    {businessType && subcategories[businessType].map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Post Type</label>
                  <select
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    value={postType}
                    onChange={(e) => setPostType(e.target.value)}
                    disabled={!subcategory}
                  >
                    <option value="">Select Post Type</option>
                    {businessType && subcategory && postTypes[businessType][subcategory].map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                  <select
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    disabled={!postType}
                  >
                    <option value="">Select Tone</option>
                    <option value="casual">Casual</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Prompt</label>
                <textarea
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  rows="2"
                  placeholder="Add any specific details (e.g., product name, discount code)..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                ></textarea>
              </div>
              <button
                onClick={generatePost}
                className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-transform duration-300 transform hover:scale-105 mb-6 disabled:bg-gray-400"
                disabled={isLoading || !tone}
              >
                {isLoading ? "Generating..." : "Generate Post"}
              </button>
              <form onSubmit={(e) => handlePost(e, false)}>
                {postContent && (
                  <>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Generated Post Content</label>
                      <textarea
                        className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        rows="4"
                        placeholder="Generated post will appear here..."
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hashtags</label>
                      <input
                        type="text"
                        className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        value={hashtags.join(" ")}
                        onChange={(e) => setHashtags(e.target.value.split(" ").filter(tag => tag.startsWith("#")))}
                      />
                    </div>
                    {imageUrl ? (
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Generated Image</label>
                        <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                          <div className="w-[400px] h-[400px] flex items-center justify-center">
                            <img
                              src={imageUrl}
                              alt="Generated Social Media Image"
                              className="max-w-full max-h-full object-contain rounded-lg"
                            />
                          </div>
                          <p className="text-gray-500 text-sm mt-1">Image generated by Predis.ai</p>
                          <button
                            type="button"
                            onClick={editImageInApp}
                            className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 transition-transform duration-300 transform hover:scale-105"
                          >
                            Edit Image
                          </button>
                        </div>
                      </div>
                    ) : predisPostId ? (
                      <div className="mb-6">
                        <p className="text-gray-600">Generating image, please wait...</p>
                      </div>
                    ) : null}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Platforms</label>
                      <div className="flex flex-wrap gap-6">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={selectedPlatforms.includes("Twitter")}
                            onChange={() =>
                              setSelectedPlatforms((prev) =>
                                prev.includes("Twitter")
                                  ? prev.filter((p) => p !== "Twitter")
                                  : [...prev, "Twitter"]
                              )
                            }
                            disabled={!connectedAccounts.some((acc) => acc.platform === "Twitter") || isPosting}
                          />
                          <FaTwitter className="text-blue-400 text-xl mr-2" />
                          <span className="text-gray-700">Twitter</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={selectedPlatforms.includes("Facebook")}
                            onChange={() =>
                              setSelectedPlatforms((prev) =>
                                prev.includes("Facebook")
                                  ? prev.filter((p) => p !== "Facebook")
                                  : [...prev, "Facebook"]
                              )
                            }
                            disabled={!connectedAccounts.some((acc) => acc.platform === "Facebook") || isPosting}
                          />
                          <FaFacebook className="text-blue-600 text-xl mr-2" />
                          <span className="text-gray-700">Facebook</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2 h-5 w-5 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                            checked={selectedPlatforms.includes("Instagram")}
                            onChange={() =>
                              setSelectedPlatforms((prev) =>
                                prev.includes("Instagram")
                                  ? prev.filter((p) => p !== "Instagram")
                                  : [...prev, "Instagram"]
                              )
                            }
                            disabled={!connectedAccounts.some((acc) => acc.platform === "Instagram") || isPosting}
                          />
                          <FaInstagram className="text-pink-500 text-xl mr-2" />
                          <span className="text-gray-700">Instagram</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2 h-5 w-5 text-blue-700 focus:ring-blue-700 border-gray-300 rounded"
                            checked={selectedPlatforms.includes("LinkedIn")}
                            onChange={() =>
                              setSelectedPlatforms((prev) =>
                                prev.includes("LinkedIn")
                                  ? prev.filter((p) => p !== "LinkedIn")
                                  : [...prev, "LinkedIn"]
                              )
                            }
                            disabled={!connectedAccounts.some((acc) => acc.platform === "LinkedIn") || isPosting}
                          />
                          <FaLinkedin className="text-blue-700 text-xl mr-2" />
                          <span className="text-gray-700">LinkedIn</span>
                        </label>
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Post (Optional)</label>
                      <input
                        type="datetime-local"
                        className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-transform duration-300 transform hover:scale-105 disabled:bg-gray-400"
                        disabled={!postContent || selectedPlatforms.length === 0 || isPosting}
                      >
                        {isPosting ? "Posting..." : "Post Now"}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handlePost(e, true)}
                        className="bg-teal-600 text-white px-6 py-3 rounded-full hover:bg-teal-700 transition-transform duration-300 transform hover:scale-105 disabled:bg-gray-400"
                        disabled={!postContent || selectedPlatforms.length === 0 || !scheduledAt || isPosting}
                      >
                        {isPosting ? "Scheduling..." : "Schedule Post"}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </section>
        )}

        {activeSection === "scheduling" && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Scheduling Calendar</h2>
            <div className="bg-white p-8 rounded-2xl shadow-2xl border-t-4 border-blue-600">
              <div className="mb-6">
                <Calendar
                  onChange={setCalendarDate}
                  value={calendarDate}
                  tileContent={tileContent}
                  className="rounded-lg shadow-md"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">All Scheduled Posts</h3>
              {scheduledPosts.length === 0 ? (
                <p className="text-gray-600">No scheduled posts yet.</p>
              ) : (
                <ul className="space-y-4 max-h-[400px] overflow-y-auto">
                  {scheduledPosts.sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)).map((post) => (
                    <li key={post._id} className={`border p-4 rounded-lg ${post.status === "pending" ? "bg-blue-50" : post.status === "posted" ? "bg-green-50" : "bg-red-50"}`}>
                      <p><strong>Content:</strong> {post.content}</p>
                      <p><strong>Platforms:</strong> {post.platforms.join(", ")}</p>
                      {post.imageUrl && <p><strong>Image:</strong> <a href={post.imageUrl} target="_blank" className="text-blue-600">View</a></p>}
                      <p><strong>Scheduled At:</strong> {new Date(post.scheduledAt).toLocaleString()}</p>
                      <p><strong>Status:</strong> {post.status.charAt(0).toUpperCase() + post.status.slice(1)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {activeSection === "settings" && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
            <div className="bg-white p-8 rounded-2xl shadow-2xl border-t-4 border-blue-600">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
              <div className="mb-6">
                <p><strong>Username:</strong> {username}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Password:</strong> {password}</p>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Update Profile</h3>
              <form onSubmit={handleUpdateProfile}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Username</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter new username"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-transform duration-300 transform hover:scale-105"
                >
                  Update Profile
                </button>
              </form>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;