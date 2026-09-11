/**
 * PlayPing Studio & Nilesh Kuril Games - Analytics & Event Tracking Engine
 * Tracks page views, device types, game clicks, and modal views.
 * Dispatches to Google Analytics 4 (gtag) and cloud database / local storage.
 */

(function () {
  const STORAGE_KEY_EVENTS = "studio_analytics_events";
  const STORAGE_KEY_AGG = "studio_analytics_aggregated";
  const STORAGE_KEY_GA = "studio_ga_id";
  const STORAGE_KEY_PIN = "studio_admin_pin_hash";
  const STORAGE_KEY_GEO = "studio_visitor_geo";

  // Default SHA-256 for PIN "2026"
  const DEFAULT_PIN_HASH = "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918";

  function getDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "Tablet";
    }
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
      return "Mobile";
    }
    return "Desktop";
  }

  function getBrowserName() {
    const ua = navigator.userAgent;
    if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
    if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Edg")) return "Edge";
    return "Browser";
  }

  function getOS() {
    const ua = navigator.userAgent;
    if (ua.includes("Android")) return "Android";
    if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
    if (ua.includes("Windows")) return "Windows";
    if (ua.includes("Mac OS")) return "macOS";
    if (ua.includes("Linux")) return "Linux";
    return "Unknown";
  }

  function getCleanReferrer() {
    const ref = document.referrer;
    if (!ref) return "Direct";
    try {
      const url = new URL(ref);
      const host = url.hostname.toLowerCase();
      if (host.includes("nileshkuril.in") || host.includes("localhost")) return "Direct";
      if (host.includes("google.")) return "Google Search";
      if (host.includes("linkedin.com")) return "LinkedIn";
      if (host.includes("instagram.com")) return "Instagram";
      if (host.includes("reddit.com")) return "Reddit";
      if (host.includes("youtube.com")) return "YouTube";
      if (host.includes("twitter.com") || host.includes("t.co") || host.includes("x.com")) return "X / Twitter";
      if (host.includes("github.com")) return "GitHub";
      return host.replace(/^www\./, "");
    } catch (e) {
      return "External";
    }
  }

  function getCachedGeo() {
    try {
      const cached = sessionStorage.getItem(STORAGE_KEY_GEO);
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return {
      city: "Detecting...",
      country: "Global",
      flag: "📍"
    };
  }

  function fetchVisitorGeo(callback) {
    try {
      const cached = sessionStorage.getItem(STORAGE_KEY_GEO);
      if (cached) {
        callback(JSON.parse(cached));
        return;
      }
    } catch (e) {}

    fetch("https://ipwho.is/")
      .then(res => res.json())
      .then(data => {
        const geo = {
          city: data.city || "Unknown City",
          country: data.country || "Global",
          flag: (data.flag && data.flag.emoji) ? data.flag.emoji : "📍"
        };
        try {
          sessionStorage.setItem(STORAGE_KEY_GEO, JSON.stringify(geo));
        } catch (e) {}
        callback(geo);
      })
      .catch(() => {
        callback({ city: "Undetected", country: "Global", flag: "🌐" });
      });
  }

  function getVisitorId() {
    let id = localStorage.getItem("studio_visitor_id");
    if (!id) {
      id = "v_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      localStorage.setItem("studio_visitor_id", id);
    }
    return id;
  }

  // Record event locally (always works offline & on GitHub Pages)
  function recordLocalEvent(event) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_EVENTS);
      const events = raw ? JSON.parse(raw) : [];
      events.unshift(event);
      if (events.length > 300) events.length = 300; // retain recent 300
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));

      // Update aggregated stats
      const rawAgg = localStorage.getItem(STORAGE_KEY_AGG);
      const agg = rawAgg ? JSON.parse(rawAgg) : {
        totalViews: 0,
        uniqueVisitors: {},
        gameClicks: {},
        gameModals: {},
        devClicks: 0,
        deviceCounts: { Mobile: 0, Desktop: 0, Tablet: 0 },
        cityCounts: {},
        sourceCounts: {},
        dailyViews: {}
      };

      if (!agg.cityCounts) agg.cityCounts = {};
      if (!agg.sourceCounts) agg.sourceCounts = {};

      const dateKey = new Date(event.timestamp).toISOString().split("T")[0];

      if (event.type === "page_view") {
        agg.totalViews = (agg.totalViews || 0) + 1;
        agg.dailyViews[dateKey] = (agg.dailyViews[dateKey] || 0) + 1;
        agg.uniqueVisitors[event.visitorId] = true;
        agg.deviceCounts[event.device] = (agg.deviceCounts[event.device] || 0) + 1;

        if (event.city && event.city !== "Detecting...") {
          const locKey = `${event.city}, ${event.country}`;
          agg.cityCounts[locKey] = (agg.cityCounts[locKey] || 0) + 1;
        }

        if (event.referrer) {
          agg.sourceCounts[event.referrer] = (agg.sourceCounts[event.referrer] || 0) + 1;
        }
      } else if (event.type === "play_store_click") {
        agg.gameClicks[event.game] = (agg.gameClicks[event.game] || 0) + 1;
      } else if (event.type === "game_modal_view") {
        agg.gameModals[event.game] = (agg.gameModals[event.game] || 0) + 1;
      } else if (event.type === "dev_catalog_click") {
        agg.devClicks = (agg.devClicks || 0) + 1;
      }

      localStorage.setItem(STORAGE_KEY_AGG, JSON.stringify(agg));
    } catch (e) {
      console.warn("Analytics storage error:", e);
    }
  }

  function updateEventGeo(eventId, geo) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_EVENTS);
      if (!raw) return;
      const events = JSON.parse(raw);
      const ev = events.find(e => e.id === eventId);
      if (ev) {
        ev.city = geo.city;
        ev.country = geo.country;
        ev.flag = geo.flag;
        localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
      }

      const rawAgg = localStorage.getItem(STORAGE_KEY_AGG);
      if (rawAgg) {
        const agg = JSON.parse(rawAgg);
        if (!agg.cityCounts) agg.cityCounts = {};
        const locKey = `${geo.city}, ${geo.country}`;
        agg.cityCounts[locKey] = (agg.cityCounts[locKey] || 0) + 1;
        localStorage.setItem(STORAGE_KEY_AGG, JSON.stringify(agg));
      }
    } catch (e) {}
  }

  // Push event to Google Analytics 4 if gtag is available
  function sendToGA(eventName, params) {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }
  }

  const StudioAnalytics = {
    trackPageView: function () {
      const eventId = "pv_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
      const initialGeo = getCachedGeo();
      const referrer = getCleanReferrer();

      const event = {
        id: eventId,
        type: "page_view",
        path: window.location.pathname,
        visitorId: getVisitorId(),
        device: getDeviceType(),
        browser: getBrowserName(),
        os: getOS(),
        referrer: referrer,
        city: initialGeo.city,
        country: initialGeo.country,
        flag: initialGeo.flag,
        timestamp: new Date().toISOString()
      };
      recordLocalEvent(event);
      sendToGA("page_view", {
        page_title: document.title,
        page_location: window.location.href,
        device_type: event.device,
        traffic_source: referrer
      });

      if (initialGeo.city === "Detecting...") {
        fetchVisitorGeo(function (geo) {
          updateEventGeo(eventId, geo);
        });
      }
    },

    trackGameClick: function (gameTitle, url) {
      const geo = getCachedGeo();
      const event = {
        id: "click_" + Date.now(),
        type: "play_store_click",
        game: gameTitle,
        url: url,
        visitorId: getVisitorId(),
        device: getDeviceType(),
        browser: getBrowserName(),
        os: getOS(),
        city: geo.city,
        country: geo.country,
        flag: geo.flag,
        referrer: getCleanReferrer(),
        timestamp: new Date().toISOString()
      };
      recordLocalEvent(event);
      sendToGA("game_download_click", {
        game_title: gameTitle,
        store_url: url,
        device_type: event.device
      });
    },

    trackModalView: function (gameTitle) {
      const geo = getCachedGeo();
      const event = {
        id: "modal_" + Date.now(),
        type: "game_modal_view",
        game: gameTitle,
        visitorId: getVisitorId(),
        device: getDeviceType(),
        browser: getBrowserName(),
        os: getOS(),
        city: geo.city,
        country: geo.country,
        flag: geo.flag,
        referrer: getCleanReferrer(),
        timestamp: new Date().toISOString()
      };
      recordLocalEvent(event);
      sendToGA("view_game_details", {
        game_title: gameTitle
      });
    },

    trackDevClick: function () {
      const geo = getCachedGeo();
      const event = {
        id: "dev_" + Date.now(),
        type: "dev_catalog_click",
        visitorId: getVisitorId(),
        device: getDeviceType(),
        browser: getBrowserName(),
        os: getOS(),
        city: geo.city,
        country: geo.country,
        flag: geo.flag,
        referrer: getCleanReferrer(),
        timestamp: new Date().toISOString()
      };
      recordLocalEvent(event);
      sendToGA("view_developer_catalog", {
        developer: "PlayPing Studio"
      });
    },

    getRecentEvents: function () {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_EVENTS);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    },

    getAggregatedStats: function () {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_AGG);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    },

    // Initialize clean real stats if empty
    seedDemoDataIfEmpty: function () {
      if (!localStorage.getItem(STORAGE_KEY_AGG)) {
        const today = new Date().toISOString().split("T")[0];
        const agg = {
          totalViews: 0,
          uniqueVisitors: {},
          gameClicks: {
            "Imbalance: Ball Balancing Game": 0,
            "Maze and Car : A Puzzle Game": 0
          },
          gameModals: {
            "Imbalance: Ball Balancing Game": 0,
            "Maze and Car : A Puzzle Game": 0
          },
          devClicks: 0,
          deviceCounts: { Mobile: 0, Desktop: 0, Tablet: 0 },
          cityCounts: {},
          sourceCounts: {},
          dailyViews: {}
        };
        agg.dailyViews[today] = 0;

        localStorage.setItem(STORAGE_KEY_AGG, JSON.stringify(agg));
        localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify([]));
      }
    }
  };

  window.StudioAnalytics = StudioAnalytics;

  // Auto track page view when loaded on consumer pages
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      if (!window.location.pathname.includes("admin.html")) {
        StudioAnalytics.trackPageView();
      }
    });
  } else {
    if (!window.location.pathname.includes("admin.html")) {
      StudioAnalytics.trackPageView();
    }
  }
})();
