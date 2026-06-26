import { db, isFirebaseConfigured } from "./firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  setDoc,
  where
} from "firebase/firestore";
import * as mock from "./mockData";

const isClient = typeof window !== "undefined";

// Retrieve items from local storage with initial mock data fallback
function getLocalItems(key, fallback) {
  if (!isClient) return fallback;
  const saved = localStorage.getItem(`${key}`);
  if (!saved) {
    localStorage.setItem(`${key}`, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return fallback;
  }
}

// Save items to local storage
function saveLocalItems(key, data) {
  if (!isClient) return;
  localStorage.setItem(`${key}`, JSON.stringify(data));
}

// ----------------------------------------------------
// GURU JI IMAGES
// ----------------------------------------------------
export async function getGuruJiImages() {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, "guruJiImages"), orderBy("order", "asc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          src: data.imageUrl,
          alt: data.title,
          caption: data.category,
          width: 400,
          height: data.order % 2 === 0 ? 400 : 540, // Simulated masonry heights
          ...data
        };
      });
    } catch (e) {
      console.error("Firestore getGuruJiImages error:", e);
    }
  }
  const local = getLocalItems("guruJiImages", mock.mockGuruJiImages);
  return local.map(item => ({
    ...item,
    src: item.imageUrl,
    alt: item.title,
    caption: item.category,
    width: 400,
    height: item.order % 2 === 0 ? 400 : 540
  }));
}

export async function addGuruJiImage(data) {
  const payload = {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  if (isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, "guruJiImages"), payload);
    return docRef.id;
  }
  const list = getLocalItems("guruJiImages", mock.mockGuruJiImages);
  const newItem = { id: `img_${Date.now()}`, ...payload };
  saveLocalItems("guruJiImages", [...list, newItem]);
  return newItem.id;
}

export async function updateGuruJiImage(id, data) {
  const payload = {
    ...data,
    updatedAt: new Date().toISOString()
  };
  if (isFirebaseConfigured) {
    await updateDoc(doc(db, "guruJiImages", id), payload);
    return id;
  }
  const list = getLocalItems("guruJiImages", mock.mockGuruJiImages);
  const updated = list.map(item => item.id === id ? { ...item, ...payload } : item);
  saveLocalItems("guruJiImages", updated);
  return id;
}

export async function deleteGuruJiImage(id) {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(db, "guruJiImages", id));
    return id;
  }
  const list = getLocalItems("guruJiImages", mock.mockGuruJiImages);
  const filtered = list.filter(item => item.id !== id);
  saveLocalItems("guruJiImages", filtered);
  return id;
}

// ----------------------------------------------------
// GURU JI VIDEOS
// ----------------------------------------------------
export async function getGuruJiVideos() {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, "guruJiVideos"), orderBy("order", "asc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          desc: data.description,
          thumbnail: data.thumbnailUrl,
          url: data.youtubeUrl,
          duration: "Watch Now",
          ...data
        };
      });
    } catch (e) {
      console.error("Firestore getGuruJiVideos error:", e);
    }
  }
  const local = getLocalItems("guruJiVideos", mock.mockGuruJiVideos);
  return local.map(item => ({
    ...item,
    desc: item.description,
    thumbnail: item.thumbnailUrl,
    url: item.youtubeUrl,
    duration: "Watch Now"
  }));
}

export async function addGuruJiVideo(data) {
  const payload = {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  if (isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, "guruJiVideos"), payload);
    return docRef.id;
  }
  const list = getLocalItems("guruJiVideos", mock.mockGuruJiVideos);
  const newItem = { id: `vid_${Date.now()}`, ...payload };
  saveLocalItems("guruJiVideos", [...list, newItem]);
  return newItem.id;
}

export async function updateGuruJiVideo(id, data) {
  const payload = {
    ...data,
    updatedAt: new Date().toISOString()
  };
  if (isFirebaseConfigured) {
    await updateDoc(doc(db, "guruJiVideos", id), payload);
    return id;
  }
  const list = getLocalItems("guruJiVideos", mock.mockGuruJiVideos);
  const updated = list.map(item => item.id === id ? { ...item, ...payload } : item);
  saveLocalItems("guruJiVideos", updated);
  return id;
}

export async function deleteGuruJiVideo(id) {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(db, "guruJiVideos", id));
    return id;
  }
  const list = getLocalItems("guruJiVideos", mock.mockGuruJiVideos);
  const filtered = list.filter(item => item.id !== id);
  saveLocalItems("guruJiVideos", filtered);
  return id;
}

// ----------------------------------------------------
// EVENTS
// ----------------------------------------------------
export async function getEvents() {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, "events"), orderBy("date", "asc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          bannerUrl: data.bannerImageUrl,
          googleMapUrl: data.mapLink,
          isOnline: data.eventType === "online",
          ...data
        };
      });
    } catch (e) {
      console.error("Firestore getEvents error:", e);
    }
  }
  const local = getLocalItems("events", mock.mockEvents);
  return local.map(item => ({
    ...item,
    bannerUrl: item.bannerImageUrl || item.bannerUrl,
    googleMapUrl: item.mapLink || item.googleMapUrl,
    isOnline: item.eventType === "online" || item.isOnline
  }));
}

export async function getEventById(id) {
  if (isFirebaseConfigured) {
    try {
      const docSnap = await getDoc(doc(db, "events", id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          bannerUrl: data.bannerImageUrl,
          googleMapUrl: data.mapLink,
          isOnline: data.eventType === "online",
          ...data
        };
      }
    } catch (e) {
      console.error("Firestore getEventById error:", e);
    }
  }
  const events = await getEvents();
  return events.find(e => e.id === id) || null;
}

export async function addEvent(data) {
  const payload = {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  if (isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, "events"), payload);
    return docRef.id;
  }
  const events = getLocalItems("events", mock.mockEvents);
  const newEvent = { id: `e_${Date.now()}`, ...payload };
  saveLocalItems("events", [...events, newEvent]);
  return newEvent.id;
}

export async function updateEvent(id, data) {
  const payload = {
    ...data,
    updatedAt: new Date().toISOString()
  };
  if (isFirebaseConfigured) {
    const docRef = doc(db, "events", id);
    await updateDoc(docRef, payload);
    return id;
  }
  const events = getLocalItems("events", mock.mockEvents);
  const updated = events.map(e => e.id === id ? { ...e, ...payload } : e);
  saveLocalItems("events", updated);
  return id;
}

export async function deleteEvent(id) {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(db, "events", id));
    return id;
  }
  const events = getLocalItems("events", mock.mockEvents);
  const filtered = events.filter(e => e.id !== id);
  saveLocalItems("events", filtered);
  return id;
}

// ----------------------------------------------------
// EVENT REGISTRATIONS
// ----------------------------------------------------
export async function getEventRegistrations() {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, "eventRegistrations"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error("Firestore getEventRegistrations error:", e);
    }
  }
  return getLocalItems("eventRegistrations", mock.mockEventRegistrations);
}

export async function submitEventRegistration(data) {
  const payload = {
    ...data,
    createdAt: new Date().toISOString()
  };
  if (isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, "eventRegistrations"), payload);
    return docRef.id;
  }
  const regs = getLocalItems("eventRegistrations", mock.mockEventRegistrations);
  const newReg = { id: `reg_${Date.now()}`, ...payload };
  saveLocalItems("eventRegistrations", [newReg, ...regs]);
  return newReg.id;
}

export async function deleteEventRegistration(id) {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(db, "eventRegistrations", id));
    return id;
  }
  const list = getLocalItems("eventRegistrations", mock.mockEventRegistrations);
  const filtered = list.filter(item => item.id !== id);
  saveLocalItems("eventRegistrations", filtered);
  return id;
}

// ----------------------------------------------------
// SEVA CAMPAIGNS (SEVA WORK)
// ----------------------------------------------------
export async function getCampaigns() {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, "sevaCampaigns"), orderBy("order", "asc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          bannerUrl: data.imageUrl,
          ...data
        };
      });
    } catch (e) {
      console.error("Firestore getCampaigns error:", e);
    }
  }
  const local = getLocalItems("sevaCampaigns", mock.mockCampaigns);
  return local.map(item => ({
    ...item,
    bannerUrl: item.imageUrl || item.bannerUrl
  }));
}

export async function getCampaignById(id) {
  if (isFirebaseConfigured) {
    try {
      const docSnap = await getDoc(doc(db, "sevaCampaigns", id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          bannerUrl: data.imageUrl,
          ...data
        };
      }
    } catch (e) {
      console.error("Firestore getCampaignById error:", e);
    }
  }
  const campaigns = await getCampaigns();
  return campaigns.find(c => c.id === id) || null;
}

export async function addCampaign(data) {
  const payload = {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  if (isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, "sevaCampaigns"), payload);
    return docRef.id;
  }
  const campaigns = getLocalItems("sevaCampaigns", mock.mockCampaigns);
  const newCamp = { id: `c_${Date.now()}`, ...payload };
  saveLocalItems("sevaCampaigns", [newCamp, ...campaigns]);
  return newCamp.id;
}

export async function updateCampaign(id, data) {
  const payload = {
    ...data,
    updatedAt: new Date().toISOString()
  };
  if (isFirebaseConfigured) {
    const docRef = doc(db, "sevaCampaigns", id);
    await updateDoc(docRef, payload);
    return id;
  }
  const campaigns = getLocalItems("sevaCampaigns", mock.mockCampaigns);
  const updated = campaigns.map(c => c.id === id ? { ...c, ...payload } : c);
  saveLocalItems("sevaCampaigns", updated);
  return id;
}

export async function deleteCampaign(id) {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(db, "sevaCampaigns", id));
    return id;
  }
  const campaigns = getLocalItems("sevaCampaigns", mock.mockCampaigns);
  const filtered = campaigns.filter(c => c.id !== id);
  saveLocalItems("sevaCampaigns", filtered);
  return id;
}

// ----------------------------------------------------
// GALLERY
// ----------------------------------------------------
export async function getGalleryItems() {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, "gallery"), orderBy("order", "asc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          url: data.type === "video" ? data.videoUrl : data.imageUrl,
          ...data
        };
      });
    } catch (e) {
      console.error("Firestore getGalleryItems error:", e);
    }
  }
  const local = getLocalItems("gallery", mock.mockGallery);
  return local.map(item => ({
    ...item,
    url: item.type === "video" ? item.videoUrl : item.imageUrl
  }));
}

export async function addGalleryItem(data) {
  const payload = {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  if (isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, "gallery"), payload);
    return docRef.id;
  }
  const gallery = getLocalItems("gallery", mock.mockGallery);
  const newItem = { id: `g_${Date.now()}`, ...payload };
  saveLocalItems("gallery", [newItem, ...gallery]);
  return newItem.id;
}

export async function deleteGalleryItem(id) {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(db, "gallery", id));
    return id;
  }
  const gallery = getLocalItems("gallery", mock.mockGallery);
  const filtered = gallery.filter(g => g.id !== id);
  saveLocalItems("gallery", filtered);
  return id;
}

export async function updateGalleryItem(id, data) {
  const payload = {
    ...data,
    updatedAt: new Date().toISOString()
  };
  if (isFirebaseConfigured) {
    await updateDoc(doc(db, "gallery", id), payload);
    return id;
  }
  const gallery = getLocalItems("gallery", mock.mockGallery);
  const updated = gallery.map(item => item.id === id ? { ...item, ...payload } : item);
  saveLocalItems("gallery", updated);
  return id;
}

// ----------------------------------------------------
// ANNOUNCEMENTS
// ----------------------------------------------------
export async function getAnnouncements() {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, "announcements"), orderBy("publishDate", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error("Firestore getAnnouncements error:", e);
    }
  }
  return getLocalItems("announcements", mock.mockAnnouncements);
}

export async function addAnnouncement(data) {
  const payload = {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  if (isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, "announcements"), payload);
    return docRef.id;
  }
  const list = getLocalItems("announcements", mock.mockAnnouncements);
  const newAnn = { id: `a_${Date.now()}`, ...payload };
  saveLocalItems("announcements", [newAnn, ...list]);
  return newAnn.id;
}

export async function updateAnnouncement(id, data) {
  const payload = {
    ...data,
    updatedAt: new Date().toISOString()
  };
  if (isFirebaseConfigured) {
    const docRef = doc(db, "announcements", id);
    await updateDoc(docRef, payload);
    return id;
  }
  const list = getLocalItems("announcements", mock.mockAnnouncements);
  const updated = list.map(item => item.id === id ? { ...item, ...payload } : item);
  saveLocalItems("announcements", updated);
  return id;
}

export async function deleteAnnouncement(id) {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(db, "announcements", id));
    return id;
  }
  const list = getLocalItems("announcements", mock.mockAnnouncements);
  const filtered = list.filter(item => item.id !== id);
  saveLocalItems("announcements", filtered);
  return id;
}

// ----------------------------------------------------
// DAILY QUOTES
// ----------------------------------------------------
export async function getQuotes() {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, "quotes"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.quote,
          ...data
        };
      });
    } catch (e) {
      console.error("Firestore getQuotes error:", e);
    }
  }
  const local = getLocalItems("quotes", mock.mockQuotes);
  return local.map(item => ({
    ...item,
    text: item.quote || item.text
  }));
}

export async function addQuote(data) {
  const payload = {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  if (isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, "quotes"), payload);
    return docRef.id;
  }
  const quotes = getLocalItems("quotes", mock.mockQuotes);
  const newQuote = { id: `q_${Date.now()}`, ...payload };
  saveLocalItems("quotes", [newQuote, ...quotes]);
  return newQuote.id;
}

export async function updateQuote(id, data) {
  const payload = {
    ...data,
    updatedAt: new Date().toISOString()
  };
  if (isFirebaseConfigured) {
    const docRef = doc(db, "quotes", id);
    await updateDoc(docRef, payload);
    return id;
  }
  const quotes = getLocalItems("quotes", mock.mockQuotes);
  const updated = quotes.map(q => q.id === id ? { ...q, ...payload } : q);
  saveLocalItems("quotes", updated);
  return id;
}

export async function deleteQuote(id) {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(db, "quotes", id));
    return id;
  }
  const quotes = getLocalItems("quotes", mock.mockQuotes);
  const filtered = quotes.filter(q => q.id !== id);
  saveLocalItems("quotes", filtered);
  return id;
}

// ----------------------------------------------------
// BLOGS
// ----------------------------------------------------
export async function getBlogs() {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          bannerUrl: data.coverImageUrl,
          summary: data.excerpt,
          ...data
        };
      });
    } catch (e) {
      console.error("Firestore getBlogs error:", e);
    }
  }
  const local = getLocalItems("blogs", mock.mockBlogs);
  return local.map(item => ({
    ...item,
    bannerUrl: item.coverImageUrl || item.bannerUrl,
    summary: item.excerpt || item.summary
  }));
}

export async function getBlogById(id) {
  if (isFirebaseConfigured) {
    try {
      const docSnap = await getDoc(doc(db, "blogs", id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          bannerUrl: data.coverImageUrl,
          summary: data.excerpt,
          ...data
        };
      }
    } catch (e) {
      console.error("Firestore getBlogById error:", e);
    }
  }
  const blogs = await getBlogs();
  return blogs.find(b => b.id === id) || null;
}

export async function addBlog(data) {
  const payload = {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  if (isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, "blogs"), payload);
    return docRef.id;
  }
  const blogs = getLocalItems("blogs", mock.mockBlogs);
  const newBlog = { id: `b_${Date.now()}`, ...payload };
  saveLocalItems("blogs", [newBlog, ...blogs]);
  return newBlog.id;
}

export async function updateBlog(id, data) {
  const payload = {
    ...data,
    updatedAt: new Date().toISOString()
  };
  if (isFirebaseConfigured) {
    const docRef = doc(db, "blogs", id);
    await updateDoc(docRef, payload);
    return id;
  }
  const blogs = getLocalItems("blogs", mock.mockBlogs);
  const updated = blogs.map(b => b.id === id ? { ...b, ...payload } : b);
  saveLocalItems("blogs", updated);
  return id;
}

export async function deleteBlog(id) {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(db, "blogs", id));
    return id;
  }
  const blogs = getLocalItems("blogs", mock.mockBlogs);
  const filtered = blogs.filter(b => b.id !== id);
  saveLocalItems("blogs", filtered);
  return id;
}

// ----------------------------------------------------
// VOLUNTEERS
// ----------------------------------------------------
export async function getVolunteerRegistrations() {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, "volunteers"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error("Firestore getVolunteerRegistrations error:", e);
    }
  }
  return getLocalItems("volunteers", mock.mockVolunteers);
}

export async function submitVolunteerForm(data) {
  const payload = {
    ...data,
    createdAt: new Date().toISOString()
  };
  if (isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, "volunteers"), payload);
    return docRef.id;
  }
  const vols = getLocalItems("volunteers", mock.mockVolunteers);
  const newVol = { id: `v_${Date.now()}`, ...payload };
  saveLocalItems("volunteers", [newVol, ...vols]);
  return newVol.id;
}

export async function deleteVolunteerRegistration(id) {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(db, "volunteers", id));
    return id;
  }
  const list = getLocalItems("volunteers", mock.mockVolunteers);
  const filtered = list.filter(item => item.id !== id);
  saveLocalItems("volunteers", filtered);
  return id;
}

// ----------------------------------------------------
// CONTACT MESSAGES
// ----------------------------------------------------
export async function getContactSubmissions() {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, "contactMessages"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error("Firestore getContactSubmissions error:", e);
    }
  }
  return getLocalItems("contacts", mock.mockContacts);
}

export async function submitContactForm(data) {
  const payload = {
    ...data,
    status: "new",
    createdAt: new Date().toISOString()
  };
  if (isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, "contactMessages"), payload);
    return docRef.id;
  }
  const contacts = getLocalItems("contacts", mock.mockContacts);
  const newContact = { id: `con_${Date.now()}`, ...payload };
  saveLocalItems("contacts", [newContact, ...contacts]);
  return newContact.id;
}

export async function deleteContactSubmission(id) {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(db, "contactMessages", id));
    return id;
  }
  const list = getLocalItems("contacts", mock.mockContacts);
  const filtered = list.filter(item => item.id !== id);
  saveLocalItems("contacts", filtered);
  return id;
}

export async function updateContactMessageStatus(id, status) {
  if (isFirebaseConfigured) {
    await updateDoc(doc(db, "contactMessages", id), { status });
    return id;
  }
  const contacts = getLocalItems("contacts", mock.mockContacts);
  const updated = contacts.map(c => c.id === id ? { ...c, status } : c);
  saveLocalItems("contacts", updated);
  return id;
}

// ----------------------------------------------------
// SINGLETONS: SITE SETTINGS, ABOUT CONTENT, DONATION INFO
// ----------------------------------------------------
export async function getSiteSettings() {
  if (isFirebaseConfigured) {
    try {
      const docSnap = await getDoc(doc(db, "siteSettings", "main"));
      if (docSnap.exists()) return docSnap.data();
    } catch (e) {
      console.error("Firestore getSiteSettings error:", e);
    }
  }
  return getLocalItems("siteSettings", mock.mockSiteSettings);
}

export async function updateSiteSettings(data) {
  const payload = {
    ...data,
    updatedAt: new Date().toISOString()
  };
  if (isFirebaseConfigured) {
    const docRef = doc(db, "siteSettings", "main");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, payload);
    } else {
      await setDoc(docRef, payload);
    }
    return;
  }
  saveLocalItems("siteSettings", payload);
}

export async function getAboutContent() {
  if (isFirebaseConfigured) {
    try {
      const docSnap = await getDoc(doc(db, "aboutContent", "main"));
      if (docSnap.exists()) return docSnap.data();
    } catch (e) {
      console.error("Firestore getAboutContent error:", e);
    }
  }
  return getLocalItems("aboutContent", mock.mockAboutContent);
}

export async function updateAboutContent(data) {
  const payload = {
    ...data,
    updatedAt: new Date().toISOString()
  };
  if (isFirebaseConfigured) {
    const docRef = doc(db, "aboutContent", "main");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, payload);
    } else {
      await setDoc(docRef, payload);
    }
    return;
  }
  saveLocalItems("aboutContent", payload);
}

export async function getDonationInfo() {
  if (isFirebaseConfigured) {
    try {
      const docSnap = await getDoc(doc(db, "donationInfo", "main"));
      if (docSnap.exists()) return docSnap.data();
    } catch (e) {
      console.error("Firestore getDonationInfo error:", e);
    }
  }
  return getLocalItems("donationInfo", mock.mockDonationInfo);
}

export async function updateDonationInfo(data) {
  const payload = {
    ...data,
    updatedAt: new Date().toISOString()
  };
  if (isFirebaseConfigured) {
    const docRef = doc(db, "donationInfo", "main");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, payload);
    } else {
      await setDoc(docRef, payload);
    }
    return;
  }
  saveLocalItems("donationInfo", payload);
}

// ----------------------------------------------------
// DB SEED HELPER (FOR SEEDING ALL COLLECTIONS)
// ----------------------------------------------------
export async function seedMockDataToFirebase() {
  if (!isFirebaseConfigured) {
    throw new Error("Firebase not configured. Cannot seed.");
  }
  
  const seedCollection = async (colName, mockArray) => {
    const colRef = collection(db, colName);
    const snap = await getDocs(colRef);
    if (snap.empty) {
      console.log(`Seeding collection: ${colName}...`);
      for (const item of mockArray) {
        const { id, ...data } = item;
        // Seed with ID to retain mockup matching
        await setDoc(doc(db, colName, id), {
          ...data,
          createdAt: new Date().toISOString()
        });
      }
    }
  };

  // Seed normal collections
  await seedCollection("quotes", mock.mockQuotes);
  await seedCollection("events", mock.mockEvents);
  await seedCollection("sevaCampaigns", mock.mockCampaigns);
  await seedCollection("gallery", mock.mockGallery);
  await seedCollection("announcements", mock.mockAnnouncements);
  await seedCollection("blogs", mock.mockBlogs);
  await seedCollection("guruJiImages", mock.mockGuruJiImages);
  await seedCollection("guruJiVideos", mock.mockGuruJiVideos);

  // Seed singletons if empty
  const seedSingleton = async (colName, docId, fallbackObj) => {
    const docRef = doc(db, colName, docId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      console.log(`Seeding singleton: ${colName}/${docId}...`);
      await setDoc(docRef, {
        ...fallbackObj,
        updatedAt: new Date().toISOString()
      });
    }
  };

  await seedSingleton("siteSettings", "main", mock.mockSiteSettings);
  await seedSingleton("aboutContent", "main", mock.mockAboutContent);
  await seedSingleton("donationInfo", "main", mock.mockDonationInfo);

  console.log("Seeding complete!");
}
