// Static Hindi saving tips (बिजली बचत सुझाव)
export const HINDI_SAVING_TIPS = [
  {
    id: 1,
    category: "high",
    text: "आपकी बिजली खपत अधिक है। इन्वर्टर AC या 5-स्टार रेटिंग वाले उपकरणों का उपयोग करें।"
  },
  {
    id: 2,
    category: "high",
    text: "दिन के समय प्राकृतिक रोशनी का उपयोग करें और अनावश्यक लाइट व पंखे बंद रखें।"
  },
  {
    id: 3,
    category: "medium",
    text: "पंखों के साथ टेबल या स्टैंड फैन का उपयोग करें ताकि AC पर निर्भरता कम हो।"
  },
  {
    id: 4,
    category: "medium",
    text: "फ्रिज का दरवाज़ा बार-बार न खोलें और तापमान को मध्यम स्तर पर रखें।"
  },
  {
    id: 5,
    category: "low",
    text: "आपकी खपत कम है। LED बल्ब और 5-स्टार उपकरणों का उपयोग जारी रखें।"
  },
  {
    id: 6,
    category: "general",
    text: "मीटर रीडिंग को बिल से मिलान करें और किसी भी गड़बड़ी पर तुरंत शिकायत दर्ज करें।"
  },
  {
    id: 7,
    category: "general",
    text: "उच्च लोड वाले उपकरण (जैसे गीजर, इस्तरी) का उपयोग पीक समय (शाम 6-10) में कम करें।"
  }
];

export function getTipsByUsageCategory(category) {
  return HINDI_SAVING_TIPS.filter(
    (tip) => tip.category === category || tip.category === "general"
  );
}

