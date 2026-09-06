/**
 * Web Reader and Browser Control Service for EchoSphere
 * Enables hands-free web browsing, news extraction, and conversational article reading.
 */

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  fullText: string;
  category: string;
  source: string;
  url: string;
  publishedAt: string;
  language: 'hi' | 'en';
}

export interface WebsiteData {
  id: string;
  name: string;
  domain: string;
  tagline: string;
  primaryLanguage: 'hi' | 'en';
  sections: string[];
  articles: NewsArticle[];
}

export const SUPPORTED_WEBSITES: Record<string, WebsiteData> = {
  'dainik-jagran': {
    id: 'dainik-jagran',
    name: 'Dainik Jagran',
    domain: 'jagran.com',
    tagline: 'दैनिक जागरण — भारत का सर्वाधिक पढ़ा जाने वाला समाचार पत्र',
    primaryLanguage: 'hi',
    sections: ['India', 'World', 'Sports', 'Business', 'Technology'],
    articles: [
      {
        id: 'dj-1',
        title: 'भारत में डिजिटल नवाचार और AI तकनीक का नया युग',
        summary: 'ग्रामीण और बुजुर्ग नागरिकों के लिए वॉइस आधारित तकनीक से डिजिटल साक्षरता में अभूतपूर्व वृद्धि।',
        fullText: 'भारत में डिजिटल क्रांति का नया चरण शुरू हो चुका है। अब इंटरनेट का उपयोग करने के लिए अंग्रेजी या जटिल टाइपिंग की आवश्यकता नहीं है। वॉइस-फर्स्ट आर्टिफिशियल इंटेलिजेंस तकनीकों की मदद से वरिष्ठ नागरिक, बच्चे और ग्रामीण उपयोगकर्ता अपनी मातृभाषा में बोलकर खबरें पढ़ रहे हैं, मौसम जान रहे हैं और सरकारी सेवाओं का लाभ ले रहे हैं। विशेषज्ञों का कहना है कि यह तकनीक भारत को पूरी तरह डिजिटल रूप से समावेशी बना रही है।',
        category: 'India',
        source: 'Dainik Jagran',
        url: 'https://www.jagran.com/news/national',
        publishedAt: 'Today, 08:30 AM',
        language: 'hi',
      },
      {
        id: 'dj-2',
        title: 'उत्तराखंड में चारधाम यात्रा के लिए नई डिजिटल व्यवस्था',
        summary: 'श्रद्धालुओं के लिए मौसम अपडेट और आसान रजिस्ट्रेशन की सुविधा उपलब्ध कराई गई।',
        fullText: 'उत्तराखंड सरकार ने आगामी चारधाम यात्रा के लिए अत्याधुनिक डिजिटल और वॉइस हेल्पलाइन की शुरुआत की है। इसके तहत तीर्थयात्री रियल-टाइम मौसम की जानकारी, मार्ग की स्थिति और चिकित्सा केंद्रों का विवरण सीधे वॉइस कॉल के माध्यम से प्राप्त कर सकेंगे। देहरादून और ऋषिकेश में विशेष सहायता केंद्र स्थापित किए गए हैं।',
        category: 'India',
        source: 'Dainik Jagran',
        url: 'https://www.jagran.com/uttarakhand/dehradun-city',
        publishedAt: 'Today, 09:15 AM',
        language: 'hi',
      },
      {
        id: 'dj-3',
        title: 'टी20 सीरीज में भारतीय टीम की शानदार जीत',
        summary: 'रोमांचक मुकाबले में गेंदबाजों और बल्लेबाजों का बेहतरीन प्रदर्शन, दर्शकों में भारी उत्साह।',
        fullText: 'भारतीय क्रिकेट टीम ने घरेलू मैदान पर खेले गए निर्णायक मुकाबले में शानदार जीत दर्ज करते हुए सीरीज अपने नाम कर ली है। अंतिम ओवरों में तेज गेंदबाजों ने कसी हुई गेंदबाजी की और टीम को ऐतिहासिक जीत दिलाई। कप्तान ने इस जीत का श्रेय पूरी टीम के सामूहिक प्रयास को दिया।',
        category: 'Sports',
        source: 'Dainik Jagran',
        url: 'https://www.jagran.com/cricket',
        publishedAt: 'Today, 07:45 AM',
        language: 'hi',
      },
      {
        id: 'dj-4',
        title: 'वैश्विक अर्थव्यवस्था में स्थिरता के नए संकेत',
        summary: 'एशियाई बाजारों में मजबूती और प्रौद्योगिकी क्षेत्र में नए निवेश से बाजार में सकारात्मक रुख।',
        fullText: 'वैश्विक वित्तीय बाजारों में आज सकारात्मक रुझान देखने को मिला। प्रमुख सूचकांकों में बढ़त दर्ज की गई और मुद्रास्फीति के आंकड़ों में राहत से निवेशकों का भरोसा मजबूत हुआ है। विनिर्माण और सौर ऊर्जा क्षेत्र में नए विदेशी निवेश की घोषणा की गई है।',
        category: 'Business',
        source: 'Dainik Jagran',
        url: 'https://www.jagran.com/business',
        publishedAt: 'Today, 10:00 AM',
        language: 'hi',
      },
      {
        id: 'dj-5',
        title: 'अंतरिक्ष अनुसंधान में भारत की नई ऐतिहासिक उपलब्धि',
        summary: 'इसरो ने नए उपग्रह प्रक्षेपण के साथ सौर अन्वेषण में एक और महत्वपूर्ण मील का पत्थर हासिल किया।',
        fullText: 'भारतीय अंतरिक्ष अनुसंधान संगठन (इसरो) ने आज सवेरे श्रीहरिकोटा से अत्याधुनिक पृथ्वी अवलोकन उपग्रह का सफल प्रक्षेपण किया। यह उपग्रह कृषि, मौसम पूर्वानुमान और आपदा प्रबंधन के लिए हाई-रिज़ॉल्यूशन तस्वीरें भेजेगा।',
        category: 'Technology',
        source: 'Dainik Jagran',
        url: 'https://www.jagran.com/technology',
        publishedAt: 'Today, 06:20 AM',
        language: 'hi',
      },
      {
        id: 'dj-6',
        title: 'जलवायु शिखर सम्मेलन में हरित ऊर्जा पर वैश्विक सहमति',
        summary: '150 से अधिक देशों ने नवीकरणीय ऊर्जा क्षमता को दोगुना करने के लक्ष्य पर हस्ताक्षर किए।',
        fullText: 'संयुक्त राष्ट्र जलवायु सम्मेलन में विश्व नेताओं ने कार्बन उत्सर्जन घटाने और विकासशील देशों को स्वच्छ ऊर्जा अपनाने में वित्तीय सहायता देने के नए समझौते पर सहमति व्यक्त की है।',
        category: 'World',
        source: 'Dainik Jagran',
        url: 'https://www.jagran.com/world',
        publishedAt: 'Yesterday, 11:30 PM',
        language: 'hi',
      },
    ],
  },
  'bbc-news': {
    id: 'bbc-news',
    name: 'BBC News',
    domain: 'bbc.com',
    tagline: 'BBC News — Trusted World News and In-Depth Stories',
    primaryLanguage: 'en',
    sections: ['World', 'Technology', 'Science', 'Health', 'Business'],
    articles: [
      {
        id: 'bbc-1',
        title: 'Next-Generation Voice AI Transforms Digital Accessibility',
        summary: 'Voice interfaces allow millions of seniors and visually impaired users to browse effortlessly.',
        fullText: 'A groundbreaking shift in human-computer interfaces is making the global web accessible to everyone. By combining natural speech synthesis with deep contextual comprehension, modern voice companions allow users to read articles, listen to podcasts, and interact with web services entirely hands-free.',
        category: 'Technology',
        source: 'BBC News',
        url: 'https://www.bbc.com/news/technology',
        publishedAt: 'Today, 09:00 AM',
        language: 'en',
      },
      {
        id: 'bbc-2',
        title: 'Major Breakthrough in Renewable Clean Energy Storage',
        summary: 'Scientists unveil solid-state battery capable of charging in under five minutes.',
        fullText: 'Engineers have demonstrated a scalable new battery technology utilizing organic electrolytes that dramatically improves storage density while eliminating fire hazards, promising faster transitions for electric transport.',
        category: 'Science',
        source: 'BBC News',
        url: 'https://www.bbc.com/news/science_and_environment',
        publishedAt: 'Today, 08:00 AM',
        language: 'en',
      },
    ],
  },
  'the-hindu': {
    id: 'the-hindu',
    name: 'The Hindu',
    domain: 'thehindu.com',
    tagline: 'The Hindu — India’s National Newspaper Since 1878',
    primaryLanguage: 'en',
    sections: ['National', 'International', 'Sports', 'Business', 'Sci-Tech'],
    articles: [
      {
        id: 'th-1',
        title: 'Universal Health Coverage Scheme Expanded for Senior Citizens',
        summary: 'Free healthcare coverage and geriatric wellness centers rolled out nationwide.',
        fullText: 'The Ministry of Health announced the expansion of healthcare access for all citizens aged 70 and above, granting unrestricted access to top secondary and tertiary hospital facilities across the country with seamless digital verification.',
        category: 'National',
        source: 'The Hindu',
        url: 'https://www.thehindu.com/news/national',
        publishedAt: 'Today, 07:30 AM',
        language: 'en',
      },
    ],
  },
  'wikipedia': {
    id: 'wikipedia',
    name: 'Wikipedia',
    domain: 'wikipedia.org',
    tagline: 'Wikipedia — The Free Encyclopedia',
    primaryLanguage: 'en',
    sections: ['Overview', 'History', 'Technology', 'Impact'],
    articles: [
      {
        id: 'wiki-1',
        title: 'Accessibility in Computing',
        summary: 'Design of products, devices, services, and environments for people who experience disabilities.',
        fullText: 'Web accessibility encompasses all disabilities that affect access to the Web, including auditory, cognitive, neurological, physical, speech, and visual disabilities. Voice-user interfaces (VUI) play a pivotal role in removing physical barriers.',
        category: 'Technology',
        source: 'Wikipedia',
        url: 'https://en.wikipedia.org/wiki/Web_accessibility',
        publishedAt: 'Updated Recently',
        language: 'en',
      },
    ],
  },
};

export interface WebBrowserControlState {
  isOpen: boolean;
  activeWebsite: WebsiteData | null;
  activeSection: string;
  selectedArticle: NewsArticle | null;
  isReadingAloud: boolean;
  readingParagraphIndex: number;
  readingLanguage: 'hi' | 'en';
  scrollPosition: number;
  statusMessage: string;
}

class WebReaderService {
  private state: WebBrowserControlState = {
    isOpen: false,
    activeWebsite: null,
    activeSection: 'All',
    selectedArticle: null,
    isReadingAloud: false,
    readingParagraphIndex: 0,
    readingLanguage: 'hi',
    scrollPosition: 0,
    statusMessage: '',
  };

  private listeners: Set<(state: WebBrowserControlState) => void> = new Set();

  onStateChange(listener: (state: WebBrowserControlState) => void): () => void {
    this.listeners.add(listener);
    listener({ ...this.state });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private broadcast() {
    this.listeners.forEach((fn) => {
      try {
        fn({ ...this.state });
      } catch {}
    });
  }

  getState(): WebBrowserControlState {
    return { ...this.state };
  }

  // Detect if a command is a website opening or control command
  parseBrowserCommand(prompt: string): {
    isBrowserCommand: boolean;
    siteId?: string;
    section?: string;
    action?: 'open' | 'read_first' | 'sports' | 'india' | 'world' | 'scroll_down' | 'scroll_up' | 'stop' | 'continue' | 'go_back' | 'open_tab';
    speechResponse?: string;
  } {
    const t = prompt.toLowerCase().trim();

    // Check stop
    if (/\b(stop|stop reading|ruko|bas|chup|pause|band karo)\b/i.test(t)) {
      return { isBrowserCommand: true, action: 'stop', speechResponse: 'Stopping reading.' };
    }

    // Check continue
    if (/\b(continue|resume|aage padho|aur padho|continue reading)\b/i.test(t)) {
      return { isBrowserCommand: true, action: 'continue', speechResponse: 'Continuing from where we paused.' };
    }

    // Check scroll
    if (/\b(scroll down|niche karo|scroll|page down)\b/i.test(t)) {
      return { isBrowserCommand: true, action: 'scroll_down', speechResponse: 'Scrolling down.' };
    }
    if (/\b(scroll up|upar karo|scroll up)\b/i.test(t)) {
      return { isBrowserCommand: true, action: 'scroll_up', speechResponse: 'Scrolling up.' };
    }

    // Check go back
    if (/\b(go back|back|piche jao|main menu)\b/i.test(t)) {
      return { isBrowserCommand: true, action: 'go_back', speechResponse: 'Going back to the main sections.' };
    }

    // Check open website
    if (t.includes('dainik jagran') || t.includes('jagran') || t.includes('दैनिक जागरण')) {
      const isHindi = t.match(/[ऀ-ॿ]/) || t.includes('hindi') || t.includes('jagran');
      const speech = isHindi
        ? 'दैनिक जागरण खुल गया है। मुझे देश, विदेश, खेल, व्यापार और तकनीक के समाचार मिले हैं। आप कौन सा सुनना चाहेंगे?'
        : 'Dainik Jagran is open. I found India, World, Sports, Business and Technology. Which one would you like me to read aloud?';
      return { isBrowserCommand: true, siteId: 'dainik-jagran', action: 'open', speechResponse: speech };
    }

    if (t.includes('bbc') || t.includes('bbc news')) {
      return {
        isBrowserCommand: true,
        siteId: 'bbc-news',
        action: 'open',
        speechResponse: 'BBC News is open. I found World, Technology, Science, Health and Business. Which section should I read?',
      };
    }

    if (t.includes('hindu') || t.includes('the hindu')) {
      return {
        isBrowserCommand: true,
        siteId: 'the-hindu',
        action: 'open',
        speechResponse: 'The Hindu is open. I found National, International, Sports and Science. Which one would you like?',
      };
    }

    if (t.includes('wikipedia')) {
      return {
        isBrowserCommand: true,
        siteId: 'wikipedia',
        action: 'open',
        speechResponse: 'Wikipedia article is open. Would you like me to read the overview?',
      };
    }

    // Follow-up section selection
    if (this.state.isOpen) {
      if (t.includes('sport') || t.includes('khel') || t.includes('cricket') || t.includes('खेल')) {
        return { isBrowserCommand: true, section: 'Sports', action: 'sports' };
      }
      if (t.includes('india') || t.includes('desh') || t.includes('national') || t.includes('देश')) {
        return { isBrowserCommand: true, section: 'India', action: 'india' };
      }
      if (t.includes('world') || t.includes('videsh') || t.includes('विदेश')) {
        return { isBrowserCommand: true, section: 'World', action: 'world' };
      }
      if (t.includes('first article') || t.includes('read') || t.includes('padho') || t.includes('article') || t.includes('news')) {
        return { isBrowserCommand: true, action: 'read_first' };
      }
    }

    return { isBrowserCommand: false };
  }

  // Open a website in the reader
  openWebsite(siteId: string) {
    const site = SUPPORTED_WEBSITES[siteId] || SUPPORTED_WEBSITES['dainik-jagran'];
    this.state = {
      ...this.state,
      isOpen: true,
      activeWebsite: site,
      activeSection: site.sections[0] || 'All',
      selectedArticle: site.articles[0] || null,
      isReadingAloud: false,
      readingParagraphIndex: 0,
      readingLanguage: site.primaryLanguage,
      statusMessage: `${site.name} is open. Ready to read.`,
    };
    this.broadcast();
  }

  closeReader() {
    this.state = {
      ...this.state,
      isOpen: false,
      isReadingAloud: false,
      selectedArticle: null,
    };
    this.broadcast();
  }

  selectSection(section: string) {
    if (!this.state.activeWebsite) return;
    const articles = this.state.activeWebsite.articles.filter(
      (a) => a.category.toLowerCase() === section.toLowerCase()
    );
    this.state = {
      ...this.state,
      activeSection: section,
      selectedArticle: articles[0] || this.state.activeWebsite.articles[0],
      readingParagraphIndex: 0,
    };
    this.broadcast();
  }

  selectArticle(article: NewsArticle) {
    this.state = {
      ...this.state,
      selectedArticle: article,
      readingParagraphIndex: 0,
      isReadingAloud: false,
    };
    this.broadcast();
  }

  setReadingState(isReading: boolean, paragraphIndex = 0) {
    this.state = {
      ...this.state,
      isReadingAloud: isReading,
      readingParagraphIndex: paragraphIndex,
    };
    this.broadcast();
  }

  getActiveSite(): WebsiteData | null {
    return this.state.activeWebsite;
  }

  getIsOpen(): boolean {
    return this.state.isOpen;
  }

  close() {
    this.closeReader();
  }

  performVoiceCommand(prompt: string): string | null {
    const cmd = this.parseBrowserCommand(prompt);
    if (!cmd.isBrowserCommand) return null;

    if (cmd.action === 'stop') {
      this.setReadingState(false);
      return cmd.speechResponse || 'Stopped reading.';
    }

    if (cmd.action === 'continue') {
      if (this.state.selectedArticle) {
        this.setReadingState(true, this.state.readingParagraphIndex);
        return `Continuing reading: ${this.state.selectedArticle.title}`;
      }
    }

    if (cmd.action === 'sports' || cmd.section === 'Sports') {
      this.selectSection('Sports');
      return 'Switched to Sports section. Found cricket and sports updates.';
    }

    if (cmd.action === 'india' || cmd.section === 'India') {
      this.selectSection('India');
      return 'Switched to India news. Found top national headlines.';
    }

    if (cmd.action === 'world' || cmd.section === 'World') {
      this.selectSection('World');
      return 'Switched to World news section.';
    }

    if (cmd.action === 'read_first') {
      if (this.state.selectedArticle) {
        this.setReadingState(true, 0);
        return `Reading article: ${this.state.selectedArticle.title}. ${this.state.selectedArticle.summary}`;
      }
    }

    return cmd.speechResponse || null;
  }
}

export const webReaderService = new WebReaderService();
