"use client"

interface ConversationContext {
  lastCard?: string
  mood?: string
  interests: string[]
  conversationCount: number
}

interface ConversationResponse {
  text: string
  followUp?: string
  suggestions?: string[]
}

export class ConversationEngine {
  private context: ConversationContext = {
    interests: [],
    conversationCount: 0,
  }

  private responses = {
    greetings: [
      "হ্যালো! আমি তোমার বন্ধু রোবট। তুমি কেমন আছো?",
      "আসসালামু আলাইকুম! আজ তুমি কী করতে চাও?",
      "হাই! আমি তোমার সাথে কথা বলতে এবং খেলতে পছন্দ করি।",
    ],

    basicNeeds: {
      sleep: [
        "ঘুমানো খুব ভালো! ঘুমের আগে কি তুমি দাঁত ব্রাশ করেছো?",
        "ভালো ঘুম তোমাকে সুস্থ রাখে। তুমি কি গল্প শুনতে চাও?",
        "ঘুমের সময় হয়েছে। মা-বাবাকে বলো তোমার ঘুমের সময় হয়েছে।",
      ],
      eat: [
        "খাবার খুব জরুরি! তুমি কী খেতে পছন্দ করো?",
        "ভাত, মাছ, সবজি খেলে তুমি বড় এবং শক্তিশালী হবে।",
        "খাওয়ার আগে হাত ধুয়ে নিও। এটা খুব গুরুত্বপূর্ণ।",
      ],
      drink: [
        "পানি খাওয়া খুব ভালো! দিনে অনেক পানি খেতে হয়।",
        "তুমি কি দুধ পছন্দ করো? দুধ তোমার হাড় মজবুত করে।",
        "পানি খেলে তুমি সুস্থ থাকবে। আরো পানি খাও।",
      ],
      bathroom: ["বাথরুম ব্যবহারের পর হাত ধুয়ে নিও।", "নিজের যত্ন নেওয়া খুব গুরুত্বপূর্ণ।", "ভালো! নিজের প্রয়োজনের কথা বলতে পারা খুব ভালো।"],
    },

    emotions: {
      happy: [
        "তুমি খুশি! এটা দেখে আমিও খুশি হলাম। কী তোমাকে খুশি করেছে?",
        "খুশি থাকা খুব ভালো! তুমি কি গান গাইতে চাও?",
        "হাসিখুশি থাকো সবসময়। তুমি কি নাচতে পারো?",
      ],
      sad: [
        "দুঃখ লাগছে? আমি তোমার পাশে আছি। কী হয়েছে বলো।",
        "কান্না করলে মন ভালো হয়ে যায়। তুমি কি আলিঙ্গন চাও?",
        "দুঃখ করো না। আমরা একসাথে খেলবো, ঠিক আছে?",
      ],
      angry: [
        "রাগ হয়েছে? গভীর শ্বাস নাও। এক, দুই, তিন।",
        "রাগ হলে ধীরে ধীরে শ্বাস নিতে হয়। আমার সাথে করো।",
        "রাগ স্বাভাবিক, কিন্তু শান্ত হওয়া ভালো। চলো গান শুনি।",
      ],
      scared: [
        "ভয় পেয়েছো? আমি তোমার সাথে আছি। তুমি নিরাপদ।",
        "ভয়ের কিছু নেই। আমি তোমাকে রক্ষা করবো।",
        "সাহসী হও। তুমি খুব ভালো একটি বাচ্চা।",
      ],
    },

    activities: {
      play: [
        "খেলা খুব মজার! তুমি কী খেলতে চাও?",
        "চলো একসাথে খেলি। তুমি কি লুকোচুরি পছন্দ করো?",
        "খেলাধুলা তোমাকে সুস্থ রাখে। চলো দৌড়াদৌড়ি করি।",
      ],
      study: [
        "পড়াশোনা খুব ভালো! তুমি কী শিখতে চাও?",
        "বই পড়া তোমাকে স্মার্ট করে। চলো একসাথে পড়ি।",
        "শেখা খুব মজার। তুমি কি গণিত পছন্দ করো?",
      ],
      story: [
        "গল্প শোনা খুব মজার! তুমি কোন গল্প পছন্দ করো?",
        "আমি তোমাকে সুন্দর গল্প বলবো। শুনতে চাও?",
        "গল্পের মাধ্যমে অনেক কিছু শেখা যায়।",
      ],
      help: [
        "সাহায্য চাওয়া খুব ভালো! আমি তোমাকে সাহায্য করবো।",
        "তুমি কী নিয়ে সাহায্য চাও? আমি এখানে আছি।",
        "সাহায্য চাইতে লজ্জা নেই। আমি সবসময় তোমার পাশে।",
      ],
    },

    educational: {
      numbers: [
        "সংখ্যা শেখা খুব মজার! তুমি কত পর্যন্ত গুনতে পারো?",
        "গণিত খুব সহজ। চলো একসাথে গুনি।",
        "সংখ্যা দিয়ে অনেক মজার খেলা করা যায়।",
      ],
      colors: ["রং খুব সুন্দর! তোমার প্রিয় রং কোনটি?", "চারপাশে কত রকম রং আছে! চলো খুঁজে দেখি।", "রং মিশিয়ে নতুন রং বানানো যায়।"],
      animals: [
        "প্রাণীরা খুব মজার! তুমি কোন প্রাণী পছন্দ করো?",
        "প্রাণীদের অনেক কিছু শেখার আছে। তারা কেমন শব্দ করে?",
        "প্রাণীরা আমাদের বন্ধু। তাদের যত্ন নিতে হয়।",
      ],
      shapes: ["আকার চারপাশে সব জায়গায় আছে। চলো খুঁজে দেখি।", "বিভিন্ন আকার দিয়ে সুন্দর ছবি আঁকা যায়।", "তুমি কোন আকার বেশি পছন্দ করো?"],
    },

    followUps: [
      "তুমি আর কী করতে চাও?",
      "আমার সাথে আরো কথা বলো।",
      "তুমি কি আরো কিছু জানতে চাও?",
      "চলো আরো মজা করি।",
      "তুমি কেমন অনুভব করছো এখন?",
    ],

    encouragements: ["তুমি খুব ভালো!", "চমৎকার!", "তুমি অনেক স্মার্ট!", "আমি তোমার উপর গর্বিত!", "তুমি দারুণ!"],
  }

  updateContext(cardId: string, category: string) {
    this.context.lastCard = cardId
    this.context.conversationCount++

    if (!this.context.interests.includes(category)) {
      this.context.interests.push(category)
    }
  }

  generateResponse(cardId: string, category: string): ConversationResponse {
    this.updateContext(cardId, category)

    let responses: string[] = []

    // Get category-specific responses
    if (category === "basic-needs" && this.responses.basicNeeds[cardId as keyof typeof this.responses.basicNeeds]) {
      responses = this.responses.basicNeeds[cardId as keyof typeof this.responses.basicNeeds]
    } else if (category === "emotions" && this.responses.emotions[cardId as keyof typeof this.responses.emotions]) {
      responses = this.responses.emotions[cardId as keyof typeof this.responses.emotions]
    } else if (
      category === "activities" &&
      this.responses.activities[cardId as keyof typeof this.responses.activities]
    ) {
      responses = this.responses.activities[cardId as keyof typeof this.responses.activities]
    } else if (
      category === "educational" &&
      this.responses.educational[cardId as keyof typeof this.responses.educational]
    ) {
      responses = this.responses.educational[cardId as keyof typeof this.responses.educational]
    }

    // Fallback to encouragements if no specific response
    if (responses.length === 0) {
      responses = this.responses.encouragements
    }

    const mainResponse = responses[Math.floor(Math.random() * responses.length)]
    const followUp =
      this.context.conversationCount > 2
        ? this.responses.followUps[Math.floor(Math.random() * this.responses.followUps.length)]
        : undefined

    return {
      text: mainResponse,
      followUp,
      suggestions: this.generateSuggestions(category),
    }
  }

  generateSuggestions(currentCategory: string): string[] {
    const suggestions = []

    if (currentCategory === "basic-needs") {
      suggestions.push("গল্প শুনতে চাও?", "খেলতে চাও?")
    } else if (currentCategory === "emotions") {
      suggestions.push("গান শুনবে?", "নাচতে চাও?")
    } else if (currentCategory === "activities") {
      suggestions.push("কিছু শিখতে চাও?", "রং নিয়ে জানতে চাও?")
    } else if (currentCategory === "educational") {
      suggestions.push("আরো শিখতে চাও?", "অন্য কিছু দেখবে?")
    }

    return suggestions.slice(0, 2) // Return max 2 suggestions
  }

  getGreeting(): string {
    return this.responses.greetings[Math.floor(Math.random() * this.responses.greetings.length)]
  }

  getContext(): ConversationContext {
    return { ...this.context }
  }
}

export const conversationEngine = new ConversationEngine()
