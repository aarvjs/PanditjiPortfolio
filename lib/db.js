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
  setDoc
} from "firebase/firestore";
import * as mock from "./mockData";

const isClient = typeof window !== "undefined";

// Retrieve items from local storage with initial mock data fallback
function getLocalItems(key, fallback) {
  if (!isClient) return fallback;
  const saved = localStorage.getItem(`nks_${key}`);
  if (!saved) {
    localStorage.setItem(`nks_${key}`, JSON.stringify(fallback));
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
  localStorage.setItem(`nks_${key}`, JSON.stringify(data));
}

// ----------------------------------------------------
// QUOTES
// ----------------------------------------------------
export async function getQuotes() {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, "nks_quotes"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error("Firestore error, falling back to mock:", e);
    }
  }
  return getLocalItems("quotes", mock.mockQuotes);
}

export async function addQuote(data) {
  if (isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, "nks_quotes"), {
      ...data,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  }
  const quotes = getLocalItems("quotes", mock.mockQuotes);
  const newQuote = { id: `q_${Date.now()}`, ...data, createdAt: new Date().toISOString() };
  saveLocalItems("quotes", [newQuote, ...quotes]);
  return newQuote.id;
}

export async function updateQuote(id, data) {
  if (isFirebaseConfigured) {
    const docRef = doc(db, "nks_quotes", id);
    await updateDoc(docRef, data);
    return id;
  }
  const quotes = getLocalItems("quotes", mock.mockQuotes);
  const updated = quotes.map(q => q.id === id ? { ...q, ...data } : q);
  saveLocalItems("quotes", updated);
  return id;
}

export async function deleteQuote(id) {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(db, "nks_quotes", id));
    return id;
  }
  const quotes = getLocalItems("quotes", mock.mockQuotes);
  const filtered = quotes.filter(q => q.id !== id);
  saveLocalItems("quotes", filtered);
  return id;
}

// ----------------------------------------------------
// EVENTS
// ----------------------------------------------------
export async function getEvents() {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, "nks_events"), orderBy("date", "asc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error("Firestore error, falling back to mock:", e);
    }
  }
  return getLocalItems("events", mock.mockEvents);
}

export async function getEventById(id) {
  if (isFirebaseConfigured) {
    try {
      const docSnap = await getDoc(doc(db, "nks_events", id));
      if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
    } catch (e) {
      console.error("Firestore getEventById error:", e);
    }
  }
  const events = getLocalItems("events", mock.mockEvents);
  return events.find(e => e.id === id) || null;
}

export async function addEvent(data) {
  if (isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, "nks_events"), {
      ...data,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  }
  const events = getLocalItems("events", mock.mockEvents);
  const newEvent = { id: `e_${Date.now()}`, ...data, createdAt: new Date().toISOString() };
  saveLocalItems("events", [...events, newEvent]);
  return newEvent.id;
}

export async function updateEvent(id, data) {
  if (isFirebaseConfigured) {
    const docRef = doc(db, "nks_events", id);
    await updateDoc(docRef, data);
    return id;
  }
  const events = getLocalItems("events", mock.mockEvents);
  const updated = events.map(e => e.id === id ? { ...e, ...data } : e);
  saveLocalItems("events", updated);
  return id;
}

export async function deleteEvent(id) {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(db, "nks_events", id));
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
      const q = query(collection(db, "nks_event_registrations"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error("Firestore error:", e);
    }
  }
  return getLocalItems("eventRegistrations", mock.mockEventRegistrations);
}

export async function submitEventRegistration(data) {
  if (isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, "nks_event_registrations"), {
      ...data,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  }
  const regs = getLocalItems("eventRegistrations", mock.mockEventRegistrations);
  const newReg = { id: `reg_${Date.now()}`, ...data, createdAt: new Date().toISOString() };
  saveLocalItems("eventRegistrations", [newReg, ...regs]);
  return newReg.id;
}

// ----------------------------------------------------
// CAMPAIGNS (SEVA WORK)
// ----------------------------------------------------
export async function getCampaigns() {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, "nks_campaigns"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error("Firestore error:", e);
    }
  }
  return getLocalItems("campaigns", mock.mockCampaigns);
}

export async function getCampaignById(id) {
  if (isFirebaseConfigured) {
    try {
      const docSnap = await getDoc(doc(db, "nks_campaigns", id));
      if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
    } catch (e) {
      console.error("Firestore getCampaignById error:", e);
    }
  }
  const campaigns = getLocalItems("campaigns", mock.mockCampaigns);
  return campaigns.find(c => c.id === id) || null;
}

export async function addCampaign(data) {
  if (isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, "nks_campaigns"), {
      ...data,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  }
  const campaigns = getLocalItems("campaigns", mock.mockCampaigns);
  const newCamp = { id: `c_${Date.now()}`, ...data, createdAt: new Date().toISOString() };
  saveLocalItems("campaigns", [newCamp, ...campaigns]);
  return newCamp.id;
}

export async function updateCampaign(id, data) {
  if (isFirebaseConfigured) {
    const docRef = doc(db, "nks_campaigns", id);
    await updateDoc(docRef, data);
    return id;
  }
  const campaigns = getLocalItems("campaigns", mock.mockCampaigns);
  const updated = campaigns.map(c => c.id === id ? { ...c, ...data } : c);
  saveLocalItems("campaigns", updated);
  return id;
}

export async function deleteCampaign(id) {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(db, "nks_campaigns", id));
    return id;
  }
  const campaigns = getLocalItems("campaigns", mock.mockCampaigns);
  const filtered = campaigns.filter(c => c.id !== id);
  saveLocalItems("campaigns", filtered);
  return id;
}

// ----------------------------------------------------
// GALLERY
// ----------------------------------------------------
export async function getGalleryItems() {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, "nks_gallery"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error("Firestore error:", e);
    }
  }
  return getLocalItems("gallery", mock.mockGallery);
}

export async function addGalleryItem(data) {
  if (isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, "nks_gallery"), {
      ...data,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  }
  const gallery = getLocalItems("gallery", mock.mockGallery);
  const newItem = { id: `g_${Date.now()}`, ...data, createdAt: new Date().toISOString() };
  saveLocalItems("gallery", [newItem, ...gallery]);
  return newItem.id;
}

export async function deleteGalleryItem(id) {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(db, "nks_gallery", id));
    return id;
  }
  const gallery = getLocalItems("gallery", mock.mockGallery);
  const filtered = gallery.filter(g => g.id !== id);
  saveLocalItems("gallery", filtered);
  return id;
}

// ----------------------------------------------------
// ANNOUNCEMENTS
// ----------------------------------------------------
export async function getAnnouncements() {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, "nks_announcements"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error("Firestore error:", e);
    }
  }
  return getLocalItems("announcements", mock.mockAnnouncements);
}

export async function addAnnouncement(data) {
  if (isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, "nks_announcements"), {
      ...data,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  }
  const announcements = getLocalItems("announcements", mock.mockAnnouncements);
  const newAnn = { id: `a_${Date.now()}`, ...data, createdAt: new Date().toISOString() };
  saveLocalItems("announcements", [newAnn, ...announcements]);
  return newAnn.id;
}

export async function updateAnnouncement(id, data) {
  if (isFirebaseConfigured) {
    const docRef = doc(db, "nks_announcements", id);
    await updateDoc(docRef, data);
    return id;
  }
  const announcements = getLocalItems("announcements", mock.mockAnnouncements);
  const updated = announcements.map(a => a.id === id ? { ...a, ...data } : a);
  saveLocalItems("announcements", updated);
  return id;
}

export async function deleteAnnouncement(id) {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(db, "nks_announcements", id));
    return id;
  }
  const announcements = getLocalItems("announcements", mock.mockAnnouncements);
  const filtered = announcements.filter(a => a.id !== id);
  saveLocalItems("announcements", filtered);
  return id;
}

// ----------------------------------------------------
// BLOGS
// ----------------------------------------------------
export async function getBlogs() {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, "nks_blogs"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error("Firestore error:", e);
    }
  }
  return getLocalItems("blogs", mock.mockBlogs);
}

export async function getBlogById(id) {
  if (isFirebaseConfigured) {
    try {
      const docSnap = await getDoc(doc(db, "nks_blogs", id));
      if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
    } catch (e) {
      console.error("Firestore getBlogById error:", e);
    }
  }
  const blogs = getLocalItems("blogs", mock.mockBlogs);
  return blogs.find(b => b.id === id) || null;
}

export async function addBlog(data) {
  if (isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, "nks_blogs"), {
      ...data,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  }
  const blogs = getLocalItems("blogs", mock.mockBlogs);
  const newBlog = { id: `b_${Date.now()}`, ...data, createdAt: new Date().toISOString() };
  saveLocalItems("blogs", [newBlog, ...blogs]);
  return newBlog.id;
}

export async function updateBlog(id, data) {
  if (isFirebaseConfigured) {
    const docRef = doc(db, "nks_blogs", id);
    await updateDoc(docRef, data);
    return id;
  }
  const blogs = getLocalItems("blogs", mock.mockBlogs);
  const updated = blogs.map(b => b.id === id ? { ...b, ...data } : b);
  saveLocalItems("blogs", updated);
  return id;
}

export async function deleteBlog(id) {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(db, "nks_blogs", id));
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
      const q = query(collection(db, "nks_volunteers"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error("Firestore error:", e);
    }
  }
  return getLocalItems("volunteers", mock.mockVolunteers);
}

export async function submitVolunteerForm(data) {
  if (isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, "nks_volunteers"), {
      ...data,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  }
  const vols = getLocalItems("volunteers", mock.mockVolunteers);
  const newVol = { id: `v_${Date.now()}`, ...data, createdAt: new Date().toISOString() };
  saveLocalItems("volunteers", [newVol, ...vols]);
  return newVol.id;
}

// ----------------------------------------------------
// CONTACT SUBMISSIONS
// ----------------------------------------------------
export async function getContactSubmissions() {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, "nks_contacts"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error("Firestore error:", e);
    }
  }
  return getLocalItems("contacts", mock.mockContacts);
}

export async function submitContactForm(data) {
  if (isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, "nks_contacts"), {
      ...data,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  }
  const contacts = getLocalItems("contacts", mock.mockContacts);
  const newContact = { id: `con_${Date.now()}`, ...data, createdAt: new Date().toISOString() };
  saveLocalItems("contacts", [newContact, ...contacts]);
  return newContact.id;
}

// ----------------------------------------------------
// DB SEED HELPER (FOR USER CONVENIENCE)
// ----------------------------------------------------
export async function seedMockDataToFirebase() {
  if (!isFirebaseConfigured) {
    throw new Error("Firebase not configured. Cannot seed.");
  }
  
  // Seeds each collection if it is empty
  const seedCollection = async (colName, mockArray) => {
    const colRef = collection(db, colName);
    const snap = await getDocs(colRef);
    if (snap.empty) {
      console.log(`Seeding ${colName}...`);
      for (const item of mockArray) {
        const { id, ...data } = item;
        // set document with ID to retain mockup links or let it autogenerate
        await setDoc(doc(db, colName, id), {
          ...data,
          createdAt: new Date().toISOString()
        });
      }
    }
  };

  await seedCollection("nks_quotes", mock.mockQuotes);
  await seedCollection("nks_events", mock.mockEvents);
  await seedCollection("nks_campaigns", mock.mockCampaigns);
  await seedCollection("nks_gallery", mock.mockGallery);
  await seedCollection("nks_announcements", mock.mockAnnouncements);
  await seedCollection("nks_blogs", mock.mockBlogs);
}
